import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateExcerciseDto } from './dto/create-excercise.dto';
import { UpdateExcerciseDto } from './dto/update-excercise.dto';
import { Repository, Like, In } from 'typeorm';
import { Memory } from 'src/memory/entities/memory.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Excercise } from './entities/excercise.entity';
import { Category } from 'src/categories/entities/category.entity';
import { Difficulty } from 'src/difficulty/entities/difficulty.entity';
import { Time } from 'src/time/entities/time.entity';
import { Tag } from 'src/tags/entities/tag.entity';
import { GetExerciseListDto } from './dto/get-exercise-list.dto';
import {
  Ticket,
  TicketOperation,
  TicketStatus,
  TicketType
} from 'src/ticket/entities/ticket.entity';
import { User } from 'src/users/entities/user.entity';
import { Comment } from 'src/comment/entities/comment.entity';
import { TicketService } from 'src/ticket/ticket.service';
import { MailerService } from 'src/mailer/mailer.service';

@Injectable()
export class ExcercisesService {
  constructor(
    @InjectRepository(Excercise)
    private readonly exerciseRepository: Repository<Excercise>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Difficulty)
    private readonly difficultyRepository: Repository<Difficulty>,
    @InjectRepository(Time)
    private readonly timeRepository: Repository<Time>,
    @InjectRepository(Memory)
    private readonly memoryRepository: Repository<Memory>,
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    private readonly ticketsService: TicketService,
    private readonly mailerService: MailerService
  ) {}

  async create(createExcerciseDto: CreateExcerciseDto) {
    const {
      name,
      category,
      difficulty,
      time,
      memoryId,
      clue,
      constraints,
      solution
    } = createExcerciseDto;
    if (name.length > 255) {
      throw new BadRequestException(
        'El nombre del ejercicio no puede exceder 255 caracteres'
      );
    }
    if (clue && clue.length > 65535) {
      throw new BadRequestException(
        'La pista no puede exceder 65535 caracteres'
      );
    }
    if (constraints && constraints.length > 255) {
      throw new BadRequestException(
        'Las restricciones no pueden exceder 255 caracteres'
      );
    }
    if (solution && solution.length > 65535) {
      throw new BadRequestException(
        'La solución no puede exceder 65535 caracteres'
      );
    }
    const newExcerciseName = await this.exerciseRepository.findOneBy({
      title: name
    });
    if (newExcerciseName !== null) {
      throw new BadRequestException(
        'Un ejercicio con el mismo nombre ya existe'
      );
    }
    const newExcerciseCategory = await this.categoryRepository.findOneBy({
      name: category.name,
      id: category.id
    });
    if (newExcerciseCategory === null) {
      throw new BadRequestException('La categoría no existe');
    }
    const newExcerciseDifficulty = await this.difficultyRepository.findOneBy({
      name: difficulty.name
    });
    if (newExcerciseDifficulty === null) {
      throw new BadRequestException('El nivel de dificultad elegido no existe');
    }

    let newExcerciseTime = null;
    if (time) {
      newExcerciseTime = await this.timeRepository.findOneBy({
        timeLimit: time.value,
        id: time.id
      });
      if (newExcerciseTime === null) {
        throw new BadRequestException('El límite de tiempo elegido no existe');
      }
    }

    let newExcerciseMemory = null;
    if (memoryId !== '') {
      newExcerciseMemory = await this.memoryRepository.findOneBy({
        id: memoryId
      });
      if (newExcerciseMemory === null) {
        throw new BadRequestException('El límite de memoria elegido no existe');
      }
    }

    const newExcercise = this.exerciseRepository.create({
      ...createExcerciseDto,
      title: name,
      memoryId: newExcerciseMemory || undefined,
      time: newExcerciseTime || undefined,
      clue: clue,
      constraints: constraints,
      solution: solution
    });
    newExcercise.category = newExcerciseCategory;
    newExcercise.difficulty = newExcerciseDifficulty;
    const user = await this.userRepository.findOneBy({
      userName: createExcerciseDto.userAuthor
    });
    newExcercise.created_by = user.name;
    newExcercise.user = user;
    newExcercise.isVisible = createExcerciseDto.role === 'admin';
    const savedExcercise = await this.exerciseRepository.save(newExcercise);
    const commentBody = `${user.userName} ha creado un nuevo ejercicio con el nombre ${newExcercise.title}`;
    const comment = this.commentRepository.create({
      body: commentBody
    });
    const commentId = await this.commentRepository.save(comment);
    const ticket = this.ticketRepository.create({
      itemType: TicketType.EXERCISE,
      operation: TicketOperation.CREATE,
      status:
        createExcerciseDto.role === 'admin'
          ? TicketStatus.ACCEPTED
          : TicketStatus.PENDING,
      originalExerciseId: savedExcercise,
      commentId: commentId
    });
    const savedTicket = await this.ticketRepository.save(ticket);
    this.mailerService.sendMail(
      true,
      'create',
      savedExcercise.title,
      'ejercicio'
    );
    if (savedExcercise && savedTicket) {
      return savedExcercise;
    } else {
      throw new BadRequestException('Error al crear el ejercicio');
    }
  }

  async findAll() {
    return await this.exerciseRepository.find();
  }

  async findOne(id: string) {
    return await this.exerciseRepository
      .createQueryBuilder('excercise')
      .where('excercise.id = :id', { id })
      .leftJoinAndSelect('excercise.category', 'category')
      .leftJoinAndSelect('excercise.difficulty', 'difficulty')
      .leftJoinAndSelect('excercise.time', 'time')
      .leftJoinAndSelect('excercise.memoryId', 'memory')
      .leftJoinAndSelect('excercise.tags', 'tags')
      .getOne();
  }

  async findOneByName(name: string) {
    return await this.exerciseRepository.findOneBy({ title: name });
  }

  async getList(body: GetExerciseListDto) {
    if (body.category && body.tags.length > 0 && !body.difficulty) {
      const category = await this.categoryRepository.findOneBy({
        name: body.category
      });
      const tags = await this.tagRepository
        .createQueryBuilder('tag')
        .where('tag.name IN (:...tags)', {
          tags: body.tags.map(tag => tag.name)
        })
        .getMany();
      const res = await this.exerciseRepository
        .createQueryBuilder('excercise')
        .where('excercise.categoryId = :categoryId', {
          categoryId: category.id
        })
        .andWhere('isVisible = :isVisible', { isVisible: true })
        .leftJoinAndSelect('excercise.category', 'category')
        .leftJoinAndSelect('excercise.tags', 'tags')
        .leftJoinAndSelect('excercise.difficulty', 'difficulty')
        .orderBy('difficulty.level', 'ASC') // Ordenar por nivel de dificultad
        .addOrderBy('excercise.title', 'ASC') // Luego ordenar por título
        .getMany();
      const sent = [];
      const names = tags.map(tag => tag.name);
      for (const excercise of res) {
        for (const tag of excercise.tags) {
          if (names.includes(tag.name) && !sent.includes(excercise)) {
            sent.push(excercise);
          }
        }
      }
      return sent;
    } else if (!body.category && body.tags.length > 0 && !body.difficulty) {
      const tags = await this.tagRepository
        .createQueryBuilder('tag')
        .where('tag.name IN (:...tags)', {
          tags: body.tags.map(tag => tag.name)
        })
        .getMany();
      const res = await this.exerciseRepository
        .createQueryBuilder('excercise')
        .where('isVisible = :isVisible', { isVisible: true })
        .leftJoinAndSelect('excercise.category', 'category')
        .leftJoinAndSelect('excercise.tags', 'tags')
        .leftJoinAndSelect('excercise.difficulty', 'difficulty')
        .orderBy('difficulty.level', 'ASC') // Ordenar por nivel de dificultad
        .addOrderBy('excercise.title', 'ASC') // Luego ordenar por título
        .getMany();
      const sent = [];
      const names = tags.map(tag => tag.name);
      for (const excercise of res) {
        for (const tag of excercise.tags) {
          if (names.includes(tag.name) && !sent.includes(excercise)) {
            sent.push(excercise);
          }
        }
      }
      return sent;
    } else if (body.category && body.tags.length === 0 && !body.difficulty) {
      const category = await this.categoryRepository.findOneBy({
        name: body.category
      });
      return await this.exerciseRepository
        .createQueryBuilder('excercise')
        .where('excercise.categoryId = :categoryId', {
          categoryId: category.id
        })
        .andWhere('isVisible = :isVisible', { isVisible: true })
        .leftJoinAndSelect('excercise.category', 'category')
        .leftJoinAndSelect('excercise.tags', 'tags')
        .leftJoinAndSelect('excercise.difficulty', 'difficulty')
        .orderBy('difficulty.level', 'ASC') // Ordenar por nivel de dificultad
        .addOrderBy('excercise.title', 'ASC') // Luego ordenar por título
        .getMany();
    } else if (!body.category && body.tags.length === 0 && !body.difficulty) {
      return this.exerciseRepository
        .createQueryBuilder('excercise')
        .where('isVisible = :isVisible', { isVisible: true })
        .leftJoinAndSelect('excercise.category', 'category')
        .leftJoinAndSelect('excercise.tags', 'tags')
        .leftJoinAndSelect('excercise.difficulty', 'difficulty')
        .orderBy('difficulty.level', 'ASC') // Ordenar por nivel de dificultad
        .addOrderBy('excercise.title', 'ASC') // Luego ordenar por título
        .getMany();
    } else if (body.category && body.tags.length > 0 && body.difficulty) {
      const category = await this.categoryRepository.findOneBy({
        name: body.category
      });
      const tags = await this.tagRepository
        .createQueryBuilder('tag')
        .where('tag.name IN (:...tags)', {
          tags: body.tags.map(tag => tag.name)
        })
        .getMany();
      const difficulty = await this.difficultyRepository.findOneBy({
        name: body.difficulty
      });
      const res = await this.exerciseRepository
        .createQueryBuilder('excercise')
        .where('excercise.categoryId = :categoryId', {
          categoryId: category.id
        })
        .andWhere('isVisible = :isVisible', { isVisible: true })
        .andWhere('excercise.difficultyId = :difficultyId', {
          difficultyId: difficulty.id
        })
        .leftJoinAndSelect('excercise.category', 'category')
        .leftJoinAndSelect('excercise.tags', 'tags')
        .leftJoinAndSelect('excercise.difficulty', 'difficulty')
        .orderBy('difficulty.level', 'ASC') // Ordenar por nivel de dificultad
        .addOrderBy('excercise.title', 'ASC') // Luego ordenar por título
        .getMany();
      const sent = [];
      const names = tags.map(tag => tag.name);
      for (const excercise of res) {
        for (const tag of excercise.tags) {
          if (names.includes(tag.name) && !sent.includes(excercise)) {
            sent.push(excercise);
          }
        }
      }
      return sent;
    } else if (!body.category && body.tags.length > 0 && body.difficulty) {
      const tags = await this.tagRepository
        .createQueryBuilder('tag')
        .where('tag.name IN (:...tags)', {
          tags: body.tags.map(tag => tag.name)
        })
        .orderBy('excercise.title', 'ASC')
        .getMany();
      const difficulty = await this.difficultyRepository.findOneBy({
        name: body.difficulty
      });
      const res = await this.exerciseRepository
        .createQueryBuilder('excercise')
        .where('isVisible = :isVisible', { isVisible: true })
        .andWhere('excercise.difficultyId = :difficultyId', {
          difficultyId: difficulty.id
        })
        .leftJoinAndSelect('excercise.category', 'category')
        .leftJoinAndSelect('excercise.tags', 'tags')
        .leftJoinAndSelect('excercise.difficulty', 'difficulty')
        .orderBy('difficulty.level', 'ASC') // Ordenar por nivel de dificultad
        .addOrderBy('excercise.title', 'ASC') // Luego ordenar por título
        .getMany();
      const sent = [];
      const names = tags.map(tag => tag.name);
      for (const excercise of res) {
        for (const tag of excercise.tags) {
          if (names.includes(tag.name) && !sent.includes(excercise)) {
            sent.push(excercise);
          }
        }
      }
      return sent;
    } else if (body.category && body.tags.length === 0 && body.difficulty) {
      const category = await this.categoryRepository.findOneBy({
        name: body.category
      });
      const difficulty = await this.difficultyRepository.findOneBy({
        name: body.difficulty
      });
      return await this.exerciseRepository
        .createQueryBuilder('excercise')
        .where('excercise.categoryId = :categoryId', {
          categoryId: category.id
        })
        .andWhere('excercise.difficultyId = :difficultyId', {
          difficultyId: difficulty.id
        })
        .andWhere('isVisible = :isVisible', { isVisible: true })
        .leftJoinAndSelect('excercise.category', 'category')
        .leftJoinAndSelect('excercise.tags', 'tags')
        .leftJoinAndSelect('excercise.difficulty', 'difficulty')
        .orderBy('difficulty.level', 'ASC') // Ordenar por nivel de dificultad
        .addOrderBy('excercise.title', 'ASC') // Luego ordenar por título
        .getMany();
    } else {
      const difficulty = await this.difficultyRepository.findOneBy({
        name: body.difficulty
      });
      return this.exerciseRepository
        .createQueryBuilder('excercise')
        .where('isVisible = :isVisible', { isVisible: true })
        .andWhere('excercise.difficultyId = :difficultyId', {
          difficultyId: difficulty.id
        })
        .leftJoinAndSelect('excercise.category', 'category')
        .leftJoinAndSelect('excercise.tags', 'tags')
        .leftJoinAndSelect('excercise.difficulty', 'difficulty')
        .orderBy('difficulty.level', 'ASC') // Ordenar por nivel de dificultad
        .addOrderBy('excercise.title', 'ASC') // Luego ordenar por título
        .getMany();
    }
  }

  async update(id: string, updateExcerciseDto: UpdateExcerciseDto) {
    const { memoryId, role, ...updateData } = updateExcerciseDto;
    if (updateData.name.length > 255) {
      throw new BadRequestException(
        'El nombre del ejercicio no puede exceder 255 caracteres'
      );
    }
    if (updateData.clue && updateData.clue.length > 65535) {
      throw new BadRequestException(
        'La pista no puede exceder 65535 caracteres'
      );
    }
    if (updateData.constraints && updateData.constraints.length > 255) {
      throw new BadRequestException(
        'Las restricciones no pueden exceder 255 caracteres'
      );
    }
    if (updateData.solution && updateData.solution.length > 65535) {
      throw new BadRequestException(
        'La solución no puede exceder 65535 caracteres'
      );
    }

    const memory = memoryId
      ? await this.memoryRepository.findOneBy({ id: memoryId })
      : null;

    const existingExercise = await this.exerciseRepository.findOneBy({
      id: id
    });
    if (!existingExercise) {
      throw new BadRequestException('El ejercicio no existe');
    }

    const user = await this.userRepository.findOneBy({
      userName: updateData.userAuthor
    });

    if (role === 'admin') {
      const newTime = updateData.time
        ? await this.timeRepository.findOneBy({ id: updateData.time.id })
        : null;
      const newCategory = await this.categoryRepository.findOneBy({
        id: updateData.category.id
      });
      const newDifficulty = await this.difficultyRepository.findOneBy({
        id: updateData.difficulty.id
      });
      const newTags = await this.tagRepository
        .createQueryBuilder('tag')
        .where({
          id: In(updateData.tags.map(tag => tag.id))
        })
        .getMany();
      // Actualizar directamente las propiedades del ítem original
      existingExercise.title = updateData.name || existingExercise.title;
      existingExercise.category = newCategory || existingExercise.category;
      existingExercise.tags = newTags || existingExercise.tags;
      existingExercise.difficulty =
        newDifficulty || existingExercise.difficulty;
      existingExercise.time = updateData.time ? newTime : null;
      existingExercise.memoryId = memoryId ? memory : null;
      existingExercise.example_input = updateData.example_input || null;
      existingExercise.example_output = updateData.example_output || null;
      existingExercise.constraints =
        updateData.constraints !== undefined
          ? updateData.constraints
          : existingExercise.constraints;
      existingExercise.clue =
        updateData.clue !== undefined ? updateData.clue : existingExercise.clue;
      existingExercise.author =
        updateData.author !== undefined
          ? updateData.author
          : existingExercise.author;
      existingExercise.solution =
        updateData.solution !== undefined
          ? updateData.solution
          : existingExercise.solution;
      existingExercise.description = updateData.description || null;
      existingExercise.input = updateData.input || null;
      existingExercise.output = updateData.output || null;
      existingExercise.updated_by = user.id;

      const savedUpdatedExercise = await this.exerciseRepository.save(
        existingExercise
      );

      if (savedUpdatedExercise) {
        const commentBody = `${updateData.userAuthor} ha actualizado el ejercicio con el nombre ${existingExercise.title}`;
        const comment = this.commentRepository.create({
          body: commentBody
        });
        const commentId = await this.commentRepository.save(comment);
        const ticket = this.ticketRepository.create({
          itemType: TicketType.EXERCISE,
          operation: TicketOperation.UPDATE,
          status: TicketStatus.ACCEPTED,
          originalExerciseId: existingExercise,
          commentId: commentId
        });
        const savedTicket = await this.ticketRepository.save(ticket);
        if (savedTicket) {
          return savedUpdatedExercise;
        } else {
          throw new BadRequestException('Error al actualizar el ejercicio');
        }
      }
    } else {
      const modifiedExerciseCopy = this.exerciseRepository.create({
        ...updateData,
        created_at: existingExercise.created_at,
        created_by: existingExercise.created_by,
        title: updateData.name,
        updated_by: user.id,
        memoryId: memory,
        isVisible: false
      });

      const savedUpdatedExercise = await this.exerciseRepository.save(
        modifiedExerciseCopy
      );

      if (savedUpdatedExercise) {
        const commentBody = `${updateData.userAuthor} ha actualizado el ejercicio con el nombre ${existingExercise.title}`;
        const comment = this.commentRepository.create({
          body: commentBody
        });
        const commentId = await this.commentRepository.save(comment);
        const ticket = this.ticketRepository.create({
          itemType: TicketType.EXERCISE,
          operation: TicketOperation.UPDATE,
          status: TicketStatus.PENDING,
          originalExerciseId: existingExercise,
          modifiedExerciseId: savedUpdatedExercise,
          commentId: commentId
        });
        const savedTicket = await this.ticketRepository.save(ticket);
        if (savedTicket) {
          this.mailerService.sendMail(
            true,
            'update',
            savedUpdatedExercise.title,
            'ejercicio'
          );
          return savedUpdatedExercise;
        } else {
          throw new BadRequestException('Error al actualizar el ejercicio');
        }
      }
    }
  }
  async remove(id: string, user: string) {
    const excercise = await this.exerciseRepository.findOneBy({ id });
    const title = excercise.title;
    const userId = await this.userRepository
      .createQueryBuilder('user')
      .where('user.id = :userId', { userId: user })
      .leftJoinAndSelect('user.role', 'role')
      .getOne();
    if (userId.role.role === 'admin') {
      const commentBody = `${userId.userName} ha eliminado el ejercicio con el nombre ${excercise.title}`;
      const comment = this.commentRepository.create({
        body: commentBody
      });
      const commentId = await this.commentRepository.save(comment);
      const ticket = this.ticketRepository.create({
        itemType: TicketType.EXERCISE,
        operation: TicketOperation.DELETE,
        status: TicketStatus.ACCEPTED,
        originalExerciseId: excercise,
        commentId: commentId
      });
      const savedTicket = await this.ticketRepository.save(ticket);
      if (savedTicket) {
        return await this.exerciseRepository.remove(excercise);
      } else {
        throw new BadRequestException('Error al eliminar el ejercicio');
      }
    } else {
      const commentBody = `${userId.userName} ha eliminado el ejercicio con el nombre ${excercise.title}`;
      const comment = this.commentRepository.create({
        body: commentBody
      });
      const commentId = await this.commentRepository.save(comment);
      const ticket = this.ticketRepository.create({
        itemType: TicketType.EXERCISE,
        operation: TicketOperation.DELETE,
        status: TicketStatus.PENDING,
        originalExerciseId: excercise,
        commentId: commentId
      });
      const savedTicket = await this.ticketRepository.save(ticket);
      if (savedTicket) {
        this.mailerService.sendMail(true, 'delete', title, 'ejercicio');
        return savedTicket;
      } else {
        throw new BadRequestException('Error al eliminar el ejercicio');
      }
    }
  }

  async search(query: string): Promise<Excercise[]> {
    return await this.exerciseRepository.find({
      where: { title: Like(`%${query}%`) },
      take: 5
    });
  }

  async getCount(): Promise<number> {
    return await this.exerciseRepository.countBy({ isVisible: true });
  }
}
