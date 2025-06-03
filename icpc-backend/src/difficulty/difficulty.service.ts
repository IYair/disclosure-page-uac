import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateDifficultyDto } from './dto/create-difficulty.dto';
import { UpdateDifficultyDto } from './dto/update-difficulty.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Difficulty } from './entities/difficulty.entity';
import { Comment } from 'src/comment/entities/comment.entity';
import {
  Ticket,
  TicketOperation,
  TicketStatus,
  TicketType
} from 'src/ticket/entities/ticket.entity';
import { Excercise } from 'src/excercises/entities/excercise.entity';

@Injectable()
export class DifficultyService {
  constructor(
    @InjectRepository(Difficulty)
    private readonly difficultyRepository: Repository<Difficulty>,
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
    @InjectRepository(Excercise)
    private readonly excerciseRepository: Repository<Excercise>
  ) {}

  /*
  Input: createDifficultyDto: CreateDifficultyDto
  Output: Promise<any>
  Return value: Created difficulty object or error
  Function: Creates a new difficulty, validates input, creates comment and ticket
  Variables: trimmedName, existingDifficulty, savedDifficulty
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  async create(createDifficultyDto: CreateDifficultyDto) {
    const trimmedName = createDifficultyDto.name.trim();
    // Validate that the trimmed name is not empty or just spaces
    if (trimmedName.length === 0) {
      throw new BadRequestException(
        'El nombre de la dificultad no puede estar vacío o contener solo espacios.'
      );
    }
    // Validate that the trimmed name does not exceed 255 characters
    if (trimmedName.length > 255) {
      throw new BadRequestException(
        'El nombre de la dificultad no puede exceder los 255 caracteres.'
      );
    }
    // Validate that the level is a positive number and within the allowed range
    if (createDifficultyDto.level < 0) {
      throw new BadRequestException(
        'El nivel de dificultad debe ser mayor a 0.'
      );
    }
    // Validate that the level does not exceed 10
    if (createDifficultyDto.level > 10) {
      throw new BadRequestException(
        'El nivel de dificultad no puede ser mayor a 10.'
      );
    }

    const existingDifficulty = await this.difficultyRepository.findOne({
      where: [{ name: trimmedName }, { level: createDifficultyDto.level }]
    });
    // Check if a difficulty with the same name or level already exists
    if (existingDifficulty) {
      throw new BadRequestException(
        'Una dificultad con ese nombre o nivel ya existe.'
      );
    }

    const savedDifficulty = await this.difficultyRepository.save({
      ...createDifficultyDto,
      name: trimmedName
    });
    // If the difficulty was created successfully, create a comment and ticket
    if (savedDifficulty) {
      const ticketCommentBody = `La dificultad ${savedDifficulty.name} ha sido creada`;
      const comment = this.commentRepository.create({
        body: ticketCommentBody
      });
      const savedComment = await this.commentRepository.save(comment);
      const ticket = this.ticketRepository.create({
        otherId: savedDifficulty.id,
        operation: TicketOperation.CREATE,
        status: TicketStatus.ACCEPTED,
        itemType: TicketType.UTILS,
        commentId: savedComment
      });
      await this.ticketRepository.save(ticket);
      return savedDifficulty;
    } else {
      throw new BadRequestException('Error al crear la dificultad');
    }
  }

  /*
  Input: None
  Output: Promise<Difficulty[]>
  Return value: Array of all difficulties
  Function: Retrieves all difficulties ordered by level
  Variables: None
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  async findAll() {
    return await this.difficultyRepository
      .createQueryBuilder('difficulty')
      .orderBy('difficulty.level', 'ASC')
      .getMany();
  }

  /*
  Input: id: string
  Output: Promise<Difficulty | null>
  Return value: Difficulty object or null
  Function: Finds a difficulty by id
  Variables: None
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  async findOne(id: string) {
    return await this.difficultyRepository.findOneBy({ id });
  }

  /*
  Input: id: string, updateDifficultyDto: UpdateDifficultyDto
  Output: Promise<any>
  Return value: Updated difficulty object or error
  Function: Updates a difficulty by id
  Variables: trimmedName, existingDifficulty, name, difficulty, savedDifficulty
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  async update(id: string, updateDifficultyDto: UpdateDifficultyDto) {
    const trimmedName = updateDifficultyDto.name.trim();
    // Validate that the trimmed name is not empty or just spaces
    if (trimmedName.length === 0) {
      throw new BadRequestException(
        'El nombre de la dificultad no puede estar vacío o contener solo espacios.'
      );
    }
    // Validate that the trimmed name does not exceed 255 characters
    if (trimmedName.length > 255) {
      throw new BadRequestException(
        'El nombre de la dificultad no puede exceder los 255 caracteres.'
      );
    }
    // Validate that the level is a positive number and within the allowed range
    if (updateDifficultyDto.level < 0) {
      throw new BadRequestException(
        'El nivel de dificultad debe ser mayor a 0.'
      );
    }
    // Validate that the level does not exceed 10
    if (updateDifficultyDto.level > 10) {
      throw new BadRequestException(
        'El nivel de dificultad no puede ser mayor a 10.'
      );
    }

    const existingDifficulty = await this.difficultyRepository.findOne({
      where: { level: updateDifficultyDto.level }
    });
    // Check if a difficulty with the same level but different id already exists
    if (existingDifficulty && existingDifficulty.id !== id) {
      throw new BadRequestException('Una dificultad con ese nivel ya existe.');
    }

    const name = await this.difficultyRepository.findOne({
      where: { name: trimmedName }
    });
    // Check if a difficulty with the same name but different id already exists
    if (name && name.id !== id) {
      throw new BadRequestException('Una dificultad con ese nombre ya existe.');
    }

    const difficulty = await this.difficultyRepository.findOneBy({ id });
    const savedDifficulty = await this.difficultyRepository.save({
      ...difficulty,
      ...updateDifficultyDto,
      name: trimmedName
    });
    // If the difficulty was updated successfully, create a comment and ticket
    if (savedDifficulty) {
      const ticketCommentBody = `La dificultad ${savedDifficulty.name} ha sido actualizada`;
      const comment = this.commentRepository.create({
        body: ticketCommentBody
      });
      const savedComment = await this.commentRepository.save(comment);
      const ticket = this.ticketRepository.create({
        otherId: savedDifficulty.id,
        operation: TicketOperation.UPDATE,
        status: TicketStatus.ACCEPTED,
        itemType: TicketType.UTILS,
        commentId: savedComment
      });
      await this.ticketRepository.save(ticket);
      return savedDifficulty;
    } else {
      throw new BadRequestException('Error al actualizar la dificultad');
    }
  }

  /*
  Input: id: string
  Output: Promise<any>
  Return value: Removed difficulty object or error
  Function: Removes a difficulty by id
  Variables: allDifficulties, pivot
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  async remove(id: string) {
    const allDifficulties = await this.difficultyRepository.find();
    // If there is only one difficulty, throw an error
    if (allDifficulties.length === 1) {
      throw new BadRequestException('No se puede eliminar la única dificultad');
    }
    let pivot = allDifficulties[0];
    // Select a pivot to reassign exercises to. If the pivot is the one being deleted, select the next one
    if (pivot.id === id) {
      pivot = allDifficulties[1];
    }
    const difficulty = await this.difficultyRepository
      .createQueryBuilder('difficulty')
      .where('difficulty.id = :id', { id })
      .leftJoinAndSelect('difficulty.excercises', 'excercises')
      .getOne();
    const ticketCommentBody = `La dificultad ${difficulty.name} ha sido eliminada`;
    const comment = this.commentRepository.create({ body: ticketCommentBody });
    const savedComment = await this.commentRepository.save(comment);
    const ticket = this.ticketRepository.create({
      operation: TicketOperation.DELETE,
      status: TicketStatus.ACCEPTED,
      itemType: TicketType.UTILS,
      commentId: savedComment
    });
    // If a ticket is successfully saved, reassign exercises to a pivot difficulty
    if (ticket) {
      // If the amount of exercises is greater than 0, reassign them to the pivot difficulty
      if (difficulty.excercises.length > 0) {
        // For every exercise, reassign its difficulty to the pivot difficulty
        for (const excercise of difficulty.excercises) {
          excercise.difficulty = pivot;
          await this.excerciseRepository.save(excercise);
        }
      }
      return await this.difficultyRepository.remove(difficulty);
    } else {
      throw new BadRequestException('Error al eliminar la dificultad');
    }
  }
}
