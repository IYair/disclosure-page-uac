import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Role } from 'src/roles/entities/role.entity';
import * as bcrypt from 'bcrypt';
import { RoleEnum } from 'src/common/enums/role.enum';
import { Comment } from 'src/comment/entities/comment.entity';
import {
  Ticket,
  TicketOperation,
  TicketStatus,
  TicketType
} from 'src/ticket/entities/ticket.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>
  ) {}

  async create(createUserDto: CreateUserDto) {
    const username = await this.findOneByUsername(createUserDto.userName);
    const email = await this.findOneByEmail(createUserDto.email);
    if (username !== null) {
      throw new BadRequestException('El nombre de usuario ya existe');
    } else if (email !== null) {
      throw new BadRequestException('El email ya existe');
    }
    if (createUserDto.password.length < 8) {
      throw new BadRequestException(
        'La contraseña debe tener al menos 8 caracteres'
      );
    }
    if (createUserDto.password === createUserDto.passwordVerify) {
      const user = this.userRepository.create(createUserDto);
      const role = createUserDto.isAdmin ? RoleEnum.ADMIN : RoleEnum.USER;
      user.password = await bcrypt.hash(user.password, 10);
      const userRole = await this.roleRepository.findOne({
        where: { role: role }
      });
      if (userRole) {
        user.role = userRole;
      }
      const newUser = await this.userRepository.save(user);
      if (newUser) {
        const commentBody = `${newUser.name} ha sido creado`;
        const comment = this.commentRepository.create({ body: commentBody });
        const savedComment = await this.commentRepository.save(comment);
        const ticket = this.ticketRepository.create({
          operation: TicketOperation.CREATE,
          commentId: savedComment,
          itemType: TicketType.USER,
          status: TicketStatus.ACCEPTED,
          otherId: newUser.id
        });
        await this.ticketRepository.save(ticket);
        return {
          id: newUser.id,
          name: newUser.name,
          lastName: newUser.lastName,
          userName: newUser.userName,
          email: newUser.email
        };
      }
    } else {
      throw new BadRequestException('Las contraseñas no coinciden');
    }
  }

  async findAll() {
    return await this.userRepository.find();
  }

  async findOneByEmail(email: string) {
    if (!email) {
      return null;
    }
    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .where('user.email = :email', { email })
      .getMany();
    if (user.length === 0) {
      return null;
    }
    return user[0];
  }

  async findOne(id: string) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .where('user.id = :id', { id })
      .getOne();
    return {
      id: user.id,
      name: user.name,
      lastName: user.lastName,
      userName: user.userName,
      email: user.email,
      isAdmin: user.role.role === RoleEnum.ADMIN
    };
  }

  async getMails(adminsOnly: boolean): Promise<string[]> {
    const users = adminsOnly
      ? await this.userRepository.find({
          where: { role: { role: RoleEnum.ADMIN } },
          select: ['email']
        })
      : await this.userRepository.find({
          select: ['email']
        });

    if (users.length === 0) {
      throw new BadRequestException('No hay usuarios registrados');
    }

    return users.map(user => user.email);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password && updateUserDto.password.length < 8) {
      throw new BadRequestException(
        'La contraseña debe tener al menos 8 caracteres'
      );
    }

    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new BadRequestException('El usuario no existe');
    }

    // Verificar nombre de usuario
    if (updateUserDto.userName && updateUserDto.userName !== user.userName) {
      const existingUser = await this.userRepository.findOneBy({
        userName: updateUserDto.userName
      });
      if (existingUser) {
        throw new BadRequestException('El nombre de usuario ya existe');
      }
    }

    // Verificar email
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.userRepository.findOneBy({
        email: updateUserDto.email
      });
      if (existingUser) {
        throw new BadRequestException('El email ya existe');
      }
    }

    // Verificar contraseñas
    if (
      updateUserDto.password &&
      updateUserDto.password !== updateUserDto.passwordVerify
    ) {
      throw new BadRequestException('Las contraseñas no coinciden');
    }

    // Mantener el rol actual si no se especifica en la solicitud
    let role = user.role;
    if (updateUserDto.isAdmin !== undefined) {
      role = await this.roleRepository.findOne({
        where: { role: updateUserDto.isAdmin ? RoleEnum.ADMIN : RoleEnum.USER }
      });

      if (!role) {
        throw new BadRequestException('El rol especificado no existe');
      }
    }

    const modifyUser = this.userRepository.create({
      ...user,
      name: updateUserDto.name || user.name,
      lastName: updateUserDto.lastName || user.lastName,
      userName: updateUserDto.userName || user.userName,
      email: updateUserDto.email || user.email,
      password: updateUserDto.password
        ? await bcrypt.hash(updateUserDto.password, 10)
        : user.password,
      role: role,
      updated_by: updateUserDto.editorId
    });

    await this.userRepository.save(modifyUser);

    const updatedUser = await this.userRepository.findOne({
      where: { id: modifyUser.id },
      relations: ['role']
    });

    if (!updatedUser?.role) {
      throw new BadRequestException(
        'Error al cargar el rol del usuario actualizado'
      );
    }

    return {
      id: updatedUser.id,
      name: updatedUser.name,
      lastName: updatedUser.lastName,
      userName: updatedUser.userName,
      email: updatedUser.email,
      role: updatedUser.role.role
    };
  }

  async remove(id: string, userId: string) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new BadRequestException('El usuario no existe');
    }

    const requestingUser = await this.userRepository
      .createQueryBuilder('user')
      .where('user.id = :userId', { userId })
      .leftJoinAndSelect('user.role', 'role')
      .getOne();

    if (!requestingUser) {
      throw new BadRequestException('Usuario solicitante no encontrado');
    }

    const commentBody = `${requestingUser.userName} ha eliminado al usuario ${user.userName}`;
    const comment = this.commentRepository.create({ body: commentBody });
    const savedComment = await this.commentRepository.save(comment);

    const ticket = this.ticketRepository.create({
      operation: TicketOperation.DELETE,
      commentId: savedComment,
      itemType: TicketType.USER,
      status: TicketStatus.ACCEPTED,
      otherId: user.id
    });

    await this.ticketRepository.save(ticket);
    return await this.userRepository.remove(user);
  }

  async findOneByUsername(username: string) {
    if (!username) {
      return null;
    }
    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .where('user.userName = :username', { username })
      .getMany();
    if (user.length === 0) {
      return null;
    }
    return user[0];
  }
  async findOneById(id: string): Promise<User | null> {
    if (!id) {
      return null;
    }

    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .where('user.id = :id', { id })
      .getOne();

    return user || null;
  }
}
