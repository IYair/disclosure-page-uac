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

  /*
  Input: createExcerciseDto: CreateExcerciseDto
  Output: Promise<any>
  Return value: Created exercise object or error
  Function: Creates a new exercise, validates input, creates ticket and sends mail
  Variables: name, category, difficulty, time, memoryId, clue, constraints, solution, newExcerciseName, newExcerciseCategory, newExcerciseDifficulty, newExcerciseTime, newExcerciseMemory
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
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
    // If the name of the exercise is longer than 255 characters, throw an error
    if (name.length > 255) {
      throw new BadRequestException(
        'El nombre del ejercicio no puede exceder 255 caracteres'
      );
    }
    // If the clue is longer than 65535 characters, throw an error
    if (clue && clue.length > 65535) {
      throw new BadRequestException(
        'La pista no puede exceder 65535 caracteres'
      );
    }
    // If the constraints are longer than 255 characters, throw an error
    if (constraints && constraints.length > 255) {
      throw new BadRequestException(
        'Las restricciones no pueden exceder 255 caracteres'
      );
    }
    // If the solution is longer than 65535 characters, throw an error
    if (solution && solution.length > 65535) {
      throw new BadRequestException(
        'La solución no puede exceder 65535 caracteres'
      );
    }
    const newExcerciseName = await this.exerciseRepository.findOneBy({
      title: name
    });
    // If an exercise with the same name already exists, throw an error
    if (newExcerciseName !== null) {
      throw new BadRequestException(
        'Un ejercicio con el mismo nombre ya existe'
      );
    }
    const newExcerciseCategory = await this.categoryRepository.findOneBy({
      name: category.name,
      id: category.id
    });
    // If the category does not exist, throw an error
    if (newExcerciseCategory === null) {
      throw new BadRequestException('La categoría no existe');
    }
    const newExcerciseDifficulty = await this.difficultyRepository.findOneBy({
      name: difficulty.name
    });
    // If the difficulty does not exist, throw an error
    if (newExcerciseDifficulty === null) {
      throw new BadRequestException('El nivel de dificultad elegido no existe');
    }

    let newExcerciseTime = null;
    // If a time limit was provided, search it in the database
    if (time) {
      newExcerciseTime = await this.timeRepository.findOneBy({
        timeLimit: time.value,
        id: time.id
      });
      // If the time limit does not exist, throw an error
      if (newExcerciseTime === null) {
        throw new BadRequestException('El límite de tiempo elegido no existe');
      }
    }

    let newExcerciseMemory = null;
    // If a memory limit was provided, search it in the database
    if (memoryId !== '') {
      newExcerciseMemory = await this.memoryRepository.findOneBy({
        id: memoryId
      });
      // If the memory limit does not exist, throw an error
      if (newExcerciseMemory === null) {
        throw new BadRequestException('El límite de memoria elegido no existe');
      }
    }

    const newExcercise = this.exerciseRepository.create({
      ...createExcerciseDto,
      title: name,
      memoryId: newExcerciseMemory ?? undefined,
      time: newExcerciseTime ?? undefined,
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
        // If the role is admin, set status to ACCEPTED, otherwise set to PENDING
        createExcerciseDto.role === 'admin'
          ? TicketStatus.ACCEPTED
          : TicketStatus.PENDING,
      originalExerciseId: savedExcercise,
      commentId: commentId
    });
    const savedTicket = await this.ticketRepository.save(ticket);
    if (createExcerciseDto.role !== 'admin') {
      this.mailerService.sendMail(
        true,
        'create',
        savedExcercise.title,
        'ejercicio'
      );
    }
    // If the exercise and ticket were successfully saved, return the exercise object
    if (savedExcercise && savedTicket) {
      return savedExcercise;
    } else {
      throw new BadRequestException('Error al crear el ejercicio');
    }
  }

  /*
  Input: None
  Output: Promise<Excercise[]>
  Return value: Array of all exercises
  Function: Retrieves all exercises
  Variables: None
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  async findAll() {
    return await this.exerciseRepository.find();
  }

  /*
  Input: id: string
  Output: Promise<Excercise | null>
  Return value: Exercise object or null
  Function: Finds an exercise by id
  Variables: None
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
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

  /*
  Input: name: string
  Output: Promise<Excercise | null>
  Return value: Exercise object or null
  Function: Finds an exercise by name
  Variables: None
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  async findOneByName(name: string) {
    return await this.exerciseRepository.findOneBy({ title: name });
  }

  /*
  Input: body: GetExerciseListDto
  Output: Promise<any>
  Return value: List of exercises matching criteria
  Function: Gets a list of exercises based on filters
  Variables: None
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  async getList(body: GetExerciseListDto) {
    // If the category and tags are provided, but no difficulty
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
        .orderBy('difficulty.level', 'ASC')
        .addOrderBy('excercise.title', 'ASC')
        .getMany();
      const sent = [];
      const names = tags.map(tag => tag.name);
      // Iterate through the exercises and check if they have the tags
      for (const excercise of res) {
        // Iterate through the tags of the exercise
        for (const tag of excercise.tags) {
          // If the tag name is in the list of names and the exercise is not already in the sent array, add it
          if (names.includes(tag.name) && !sent.includes(excercise)) {
            sent.push(excercise);
          }
        }
      }
      return sent;
      //If the tags are provided but no category or difficulty, return exercises with those tags
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
        .orderBy('difficulty.level', 'ASC')
        .addOrderBy('excercise.title', 'ASC')
        .getMany();
      const sent = [];
      const names = tags.map(tag => tag.name);
      // Iterate through the exercises and check if they have the tags
      for (const excercise of res) {
        // Iterate through the tags of the exercise
        for (const tag of excercise.tags) {
          // If the tag name is in the list of names and the exercise is not already in the sent array, add it
          if (names.includes(tag.name) && !sent.includes(excercise)) {
            sent.push(excercise);
          }
        }
      }
      return sent;
      // If the category is provided but no tags or difficulty, return exercises in that category
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
        .orderBy('difficulty.level', 'ASC')
        .addOrderBy('excercise.title', 'ASC')
        .getMany();
      // If no category, tags, or difficulty are provided, return all visible exercises
    } else if (!body.category && body.tags.length === 0 && !body.difficulty) {
      return this.exerciseRepository
        .createQueryBuilder('excercise')
        .where('isVisible = :isVisible', { isVisible: true })
        .leftJoinAndSelect('excercise.category', 'category')
        .leftJoinAndSelect('excercise.tags', 'tags')
        .leftJoinAndSelect('excercise.difficulty', 'difficulty')
        .orderBy('difficulty.level', 'ASC')
        .addOrderBy('excercise.title', 'ASC')
        .getMany();
      // If the category, tags, and difficulty are provided, return exercises matching all criteria
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
        .orderBy('difficulty.level', 'ASC')
        .addOrderBy('excercise.title', 'ASC')
        .getMany();
      const sent = [];
      const names = tags.map(tag => tag.name);
      // Iterate through the exercises and check if they have the tags
      for (const excercise of res) {
        // Iterate through the tags of the exercise
        for (const tag of excercise.tags) {
          // If the tag name is in the list of names and the exercise is not already in the sent array, add it
          if (names.includes(tag.name) && !sent.includes(excercise)) {
            sent.push(excercise);
          }
        }
      }
      return sent;
      // If the category is not provided but tags and difficulty are, return exercises with those tags and difficulty
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
        .orderBy('difficulty.level', 'ASC')
        .addOrderBy('excercise.title', 'ASC')
        .getMany();
      const sent = [];
      const names = tags.map(tag => tag.name);
      // Iterate through the exercises and check if they have the tags
      for (const excercise of res) {
        // Iterate through the tags of the exercise
        for (const tag of excercise.tags) {
          // If the tag name is in the list of names and the exercise is not already in the sent array, add it
          if (names.includes(tag.name) && !sent.includes(excercise)) {
            sent.push(excercise);
          }
        }
      }
      return sent;
      // If the category and difficulty are provided but no tags, return exercises in that category and difficulty
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
        .orderBy('difficulty.level', 'ASC')
        .addOrderBy('excercise.title', 'ASC')
        .getMany();
      // If only a difficulty is provided, without tags or category
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
        .orderBy('difficulty.level', 'ASC')
        .addOrderBy('excercise.title', 'ASC')
        .getMany();
    }
  }

  /*
  Input: id: string, updateExcerciseDto: UpdateExcerciseDto
  Output: Promise<any>
  Return value: Updated exercise object or error
  Function: Updates an exercise by id
  Variables: None
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  async update(id: string, updateExcerciseDto: UpdateExcerciseDto) {
    const { memoryId, role, ...updateData } = updateExcerciseDto;
    // Validate the length of the exercise's title. If it's longer than 255, throw an error
    if (updateData.name.length > 255) {
      throw new BadRequestException(
        'El nombre del ejercicio no puede exceder 255 caracteres'
      );
    }
    // Validate the length of the clue. It should not exceed 65535 characters
    if (updateData.clue && updateData.clue.length > 65535) {
      throw new BadRequestException(
        'La pista no puede exceder 65535 caracteres'
      );
    }
    // Validate the length of the constraints. It should not exceed 255 characters
    if (updateData.constraints && updateData.constraints.length > 255) {
      throw new BadRequestException(
        'Las restricciones no pueden exceder 255 caracteres'
      );
    }
    // Validate the length of the solution. It should not exceed 65535 characters
    if (updateData.solution && updateData.solution.length > 65535) {
      throw new BadRequestException(
        'La solución no puede exceder 65535 caracteres'
      );
    }

    // If the memoryId is provided, search for the memory in the database
    const memory = memoryId
      ? await this.memoryRepository.findOneBy({ id: memoryId })
      : null;

    const existingExercise = await this.exerciseRepository.findOneBy({
      id: id
    });
    // If the exercise does not exist, throw an error
    if (!existingExercise) {
      throw new BadRequestException('El ejercicio no existe');
    }

    const user = await this.userRepository.findOneBy({
      userName: updateData.userAuthor
    });

    // If the role of the author is admin
    if (role === 'admin') {
      // Search for the new time limit in the database or set it to null
      const newTime = updateData.time
        ? await this.timeRepository.findOneBy({ id: updateData.time.id })
        : null;
      // Search for the new category in the database
      const newCategory = await this.categoryRepository.findOneBy({
        id: updateData.category.id
      });
      // Search for the new difficulty in the database
      const newDifficulty = await this.difficultyRepository.findOneBy({
        id: updateData.difficulty.id
      });
      // Search for the new tags in the database
      const newTags = await this.tagRepository
        .createQueryBuilder('tag')
        .where({
          id: In(updateData.tags.map(tag => tag.id))
        })
        .getMany();
      // Update the properties of the exercise directly
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
        // Either insert the new constraints or keep the existing ones
        updateData.constraints ?? existingExercise.constraints;
      // Either update the clue or keep the existing one
      existingExercise.clue = updateData.clue ?? existingExercise.clue;
      // Either update the author or keep the existing one
      existingExercise.author = updateData.author ?? existingExercise.author;
      // Either update the solution or keep the existing one
      existingExercise.solution =
        updateData.solution ?? existingExercise.solution;
      // Either update the description or set it to null
      existingExercise.description = updateData.description || null;
      // Either update the input or set it to null
      existingExercise.input = updateData.input || null;
      // Either update the output or set it to null
      existingExercise.output = updateData.output || null;
      existingExercise.updated_by = user.id;

      const savedUpdatedExercise = await this.exerciseRepository.save(
        existingExercise
      );
      // If the exercise was successfully updated, create a comment and a ticket
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
        // If the ticket was successfully created, send an email and return the updated exercise
        if (savedTicket) {
          return savedUpdatedExercise;
        } else {
          throw new BadRequestException('Error al actualizar el ejercicio');
        }
      }
      // If the exercise was updated by someone who is not an admin, create a duplicate
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
      // If the duplicate was saved successfully
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
        // If the ticket was successfully created, send an email and return the updated exercise
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
  /*
  Input: id: string, user: string
  Output: Promise<any>
  Return value: Removed exercise object or error
  Function: Removes an exercise by id and user
  Variables: None
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  async remove(id: string, user: string) {
    const excercise = await this.exerciseRepository.findOneBy({ id });
    const title = excercise.title;
    const userId = await this.userRepository
      .createQueryBuilder('user')
      .where('user.id = :userId', { userId: user })
      .leftJoinAndSelect('user.role', 'role')
      .getOne();
    //If the user performing the deletion is an admin, create a comment and a ticket with status ACCEPTED
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
      // If the ticket was successfully created, remove the exercise and return it
      if (savedTicket) {
        return await this.exerciseRepository.remove(excercise);
      } else {
        throw new BadRequestException('Error al eliminar el ejercicio');
      }
      // If the user performing the deletion is not an admin, create a comment and a ticket with status PENDING
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
      // If the ticket was successfully created, return the ticket and send an email
      if (savedTicket) {
        this.mailerService.sendMail(true, 'delete', title, 'ejercicio');
        return savedTicket;
      } else {
        throw new BadRequestException('Error al eliminar el ejercicio');
      }
    }
  }

  /*
  Input: query: string
  Output: Promise<Excercise[]>
  Return value: Array of exercises matching the query
  Function: Searches exercises by query string
  Variables: None
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  async search(query: string): Promise<Excercise[]> {
    return await this.exerciseRepository.find({
      where: { title: Like(`%${query}%`) },
      take: 5
    });
  }

  /*
  Input: None
  Output: Promise<number>
  Return value: Count of exercises
  Function: Gets the total count of exercises
  Variables: None
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  async getCount(): Promise<number> {
    return await this.exerciseRepository.countBy({ isVisible: true });
  }
}
