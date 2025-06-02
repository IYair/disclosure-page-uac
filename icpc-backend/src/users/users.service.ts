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

  /*
  Input: createUserDto: CreateUserDto
  Output: Promise<{ id: string; name: string; lastName: string; userName: string; email: string; }>
  Return value: New user basic info object
  Function: Creates a new user, validates input, hashes password, assigns role, creates comment and ticket
  Variables: username, email, user, role, userRole, newUser, commentBody, comment, savedComment, ticket
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  async create(createUserDto: CreateUserDto) {
    const username = await this.findOneByUsername(createUserDto.userName);
    const email = await this.findOneByEmail(createUserDto.email);
    // Check if username already exists
    if (username !== null) {
      throw new BadRequestException('El nombre de usuario ya existe');
      // Check if email already exists
    } else if (email !== null) {
      throw new BadRequestException('El email ya existe');
    }
    // Validate password length
    if (createUserDto.password.length < 8) {
      throw new BadRequestException(
        'La contraseña debe tener al menos 8 caracteres'
      );
    }
    // Check if passwords match
    if (createUserDto.password === createUserDto.passwordVerify) {
      const user = this.userRepository.create(createUserDto);
      const role = createUserDto.isAdmin ? RoleEnum.ADMIN : RoleEnum.USER;
      user.password = await bcrypt.hash(user.password, 10);
      const userRole = await this.roleRepository.findOne({
        where: { role: role }
      });
      // Assign role to user
      if (userRole) {
        user.role = userRole;
      }
      const newUser = await this.userRepository.save(user);
      // If user was created successfully, create a comment and ticket
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

  /*
  Input: None
  Output: Promise<User[]>
  Return value: Array of all users
  Function: Retrieves all users from the repository
  Variables: None
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  async findAll() {
    return await this.userRepository.find();
  }

  /*
  Input: email: string
  Output: Promise<User | null>
  Return value: User object or null
  Function: Finds a user by email, including their role
  Variables: user
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  async findOneByEmail(email: string) {
    // If an email is not provided, return null
    if (!email) {
      return null;
    }
    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .where('user.email = :email', { email })
      .getMany();
    // If no user is found, return null
    if (user.length === 0) {
      return null;
    }
    return user[0];
  }

  /*
  Input: id: string
  Output: Promise<{ id: string; name: string; lastName: string; userName: string; email: string; isAdmin: boolean }>
  Return value: User info object
  Function: Finds a user by id and returns basic info and admin status
  Variables: user
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
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

  /*
  Input: adminsOnly: boolean
  Output: Promise<string[]>
  Return value: Array of user emails
  Function: Gets emails of all users or only admins
  Variables: users
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  async getMails(adminsOnly: boolean): Promise<string[]> {
    //If adminsOnly is true, get only admin emails, otherwise get all user emails
    const users = adminsOnly
      ? await this.userRepository.find({
          where: { role: { role: RoleEnum.ADMIN } },
          select: ['email']
        })
      : await this.userRepository.find({
          select: ['email']
        });

    // If no users are found, throw an error
    if (users.length === 0) {
      throw new BadRequestException('No hay usuarios registrados');
    }

    return users.map(user => user.email);
  }

  /*
  Input: id: string, updateUserDto: UpdateUserDto
  Output: Promise<{ id: string; name: string; lastName: string; userName: string; email: string; role: string }>
  Return value: Updated user info object
  Function: Updates user data, validates input, checks for duplicates, hashes password if changed
  Variables: user, existingUser, role, modifyUser, updatedUser
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  async update(id: string, updateUserDto: UpdateUserDto) {
    // Validate that the password is not null and has at least 8 characters
    if (updateUserDto.password && updateUserDto.password.length < 8) {
      throw new BadRequestException(
        'La contraseña debe tener al menos 8 caracteres'
      );
    }

    const user = await this.userRepository.findOneBy({ id });

    // If user with the requested id does not exist, throw an error
    if (!user) {
      throw new BadRequestException('El usuario no existe');
    }

    // Verify that the userName is provided and is not already used
    if (updateUserDto.userName && updateUserDto.userName !== user.userName) {
      const existingUser = await this.userRepository.findOneBy({
        userName: updateUserDto.userName
      });
      // If a user with the same userName already exists, throw an error
      if (existingUser) {
        throw new BadRequestException('El nombre de usuario ya existe');
      }
    }

    // Verify that an email is provided and is not already used
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.userRepository.findOneBy({
        email: updateUserDto.email
      });
      // If a user with the same email already exists, throw an error
      if (existingUser) {
        throw new BadRequestException('El email ya existe');
      }
    }

    // Verify passwords
    if (
      updateUserDto.password &&
      updateUserDto.password !== updateUserDto.passwordVerify
    ) {
      throw new BadRequestException('Las contraseñas no coinciden');
    }

    // Maintain the current role if not specified in the request
    let role = user.role;
    if (updateUserDto.isAdmin !== undefined) {
      role = await this.roleRepository.findOne({
        where: { role: updateUserDto.isAdmin ? RoleEnum.ADMIN : RoleEnum.USER }
      });

      // If the role does not exist, throw an error
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
      // If a new password is provided, hash it, otherwise keep the current password
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

    // If the updated user does not have a role, throw an error
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

  /*
  Input: id: string, userId: string
  Output: Promise<User>
  Return value: Removed user object
  Function: Removes a user, creates a comment and ticket for the operation
  Variables: user, requestingUser, commentBody, comment, savedComment, ticket
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  async remove(id: string, userId: string) {
    const user = await this.userRepository.findOneBy({ id });
    // If user with the requested id does not exist, throw an error
    if (!user) {
      throw new BadRequestException('El usuario no existe');
    }

    const requestingUser = await this.userRepository
      .createQueryBuilder('user')
      .where('user.id = :userId', { userId })
      .leftJoinAndSelect('user.role', 'role')
      .getOne();

    // If the requesting user does not exist, throw an error
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

  /*
  Input: username: string
  Output: Promise<User | null>
  Return value: User object or null
  Function: Finds a user by username, including their role
  Variables: user
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  async findOneByUsername(username: string) {
    // If a username is not provided, return null
    if (!username) {
      return null;
    }
    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .where('user.userName = :username', { username })
      .getMany();
    // If no user is found, return null
    if (user.length === 0) {
      return null;
    }
    return user[0];
  }

  /*
  Input: id: string
  Output: Promise<User | null>
  Return value: User object or null
  Function: Finds a user by id, including their role
  Variables: user
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  async findOneById(id: string): Promise<User | null> {
    // If an id is not provided, return null
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
