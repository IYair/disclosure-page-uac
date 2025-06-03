import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTimeDto } from './dto/create-time.dto';
import { UpdateTimeDto } from './dto/update-time.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Time } from './entities/time.entity';
import { Comment } from 'src/comment/entities/comment.entity';
import {
  Ticket,
  TicketOperation,
  TicketStatus,
  TicketType
} from 'src/ticket/entities/ticket.entity';
import { Excercise } from 'src/excercises/entities/excercise.entity';

@Injectable()
export class TimeService {
  constructor(
    @InjectRepository(Time)
    private readonly timeRepository: Repository<Time>,
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
    @InjectRepository(Excercise)
    private readonly excerciseRepository: Repository<Excercise>
  ) {}

  /*
  Input: createTimeDto: CreateTimeDto
  Output: Promise<{ id: string; timeLimit: number }>
  Return value: New time limit object
  Function: Creates a new time limit, validates input, checks for duplicates, creates comment and ticket
  Variables: existingTime, newVal, ticketBody, commentId, savedComment, ticket
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  async create(createTimeDto: CreateTimeDto) {
    // Validate that timeLimit is not null or undefined
    if (!createTimeDto.timeLimit) {
      throw new BadRequestException('El límite de tiempo debe ser un número');
    }
    // Validate that timeLimit is a positive number and within the allowed range
    if (createTimeDto.timeLimit <= 0) {
      throw new BadRequestException('El límite de tiempo debe ser mayor a 0');
    }
    // Validate that timeLimit does not exceed 900 seconds
    if (createTimeDto.timeLimit > 900) {
      throw new BadRequestException(
        'El límite de tiempo no puede ser mayor a 900 segundos'
      );
    }

    const existingTime = await this.timeRepository.findOneBy({
      timeLimit: createTimeDto.timeLimit
    });
    // Check if a time limit with the same value already exists
    if (existingTime) {
      throw new BadRequestException('Ese límite de tiempo ya existe');
    }

    const newVal = await this.timeRepository.save(createTimeDto);
    // If the time limit was created successfully, create a comment and ticket
    if (newVal) {
      const ticketBody = `Se ha creado un nuevo límite de tiempo: ${newVal.timeLimit.toString()} segundos`;
      const commentId = this.commentRepository.create({
        body: ticketBody
      });
      const savedComment = await this.commentRepository.save(commentId);
      // If the comment was saved successfully, create a ticket
      if (savedComment) {
        const ticket = this.ticketRepository.create({
          otherId: newVal.id,
          operation: TicketOperation.CREATE,
          status: TicketStatus.ACCEPTED,
          itemType: TicketType.UTILS,
          commentId: savedComment
        });
        await this.ticketRepository.save(ticket);
      }
      return {
        id: newVal.id,
        timeLimit: newVal.timeLimit
      };
    }
  }

  /*
  Input: None
  Output: Promise<Time[]>
  Return value: Array of all time limits
  Function: Retrieves all time limits ordered by value
  Variables: None
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  async findAll() {
    return await this.timeRepository
      .createQueryBuilder('time')
      .orderBy('time.timeLimit', 'ASC')
      .getMany();
  }

  /*
  Input: id: string
  Output: Promise<Time | null>
  Return value: Time object or null
  Function: Finds a time limit by id
  Variables: None
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  async findOne(id: string) {
    return await this.timeRepository.findOneBy({ id });
  }

  /*
  Input: value: number
  Output: Promise<Time | null>
  Return value: Time object or null
  Function: Finds a time limit by its value
  Variables: category
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  async findOneByValue(value: number) {
    // If no value is provided, return null
    if (!value) {
      return null;
    } else {
      const category = await this.timeRepository.findOneBy({
        timeLimit: value
      });
      // If no category is found, return null
      // If a category is found, return it
      if (!category) {
        return null;
      } else return category;
    }
  }

  /*
  Input: id: string, updateTimeDto: UpdateTimeDto
  Output: Promise<Time | undefined>
  Return value: Updated time limit object or undefined
  Function: Updates a time limit, validates input, checks for duplicates, creates comment and ticket
  Variables: existingTime, time, savedTime, ticketCommentBody, comment, savedComment, ticket, savedTicket
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  async update(id: string, updateTimeDto: UpdateTimeDto) {
    // Validate that timeLimit is not null or undefined
    if (!updateTimeDto.timeLimit) {
      throw new BadRequestException('El límite de tiempo debe ser un número');
    }
    // Validate that timeLimit is a positive number and within the allowed range
    if (updateTimeDto.timeLimit <= 0) {
      throw new BadRequestException('El límite de tiempo debe ser mayor a 0');
    }
    // Validate that timeLimit does not exceed 900 seconds
    if (updateTimeDto.timeLimit > 900) {
      throw new BadRequestException(
        'El límite de tiempo no puede ser mayor a 900 segundos'
      );
    }

    const existingTime = await this.timeRepository.findOneBy({
      timeLimit: updateTimeDto.timeLimit
    });
    // Check if a time limit with the same value already exists
    if (existingTime !== null && existingTime.id !== id) {
      throw new BadRequestException('Ese límite de tiempo ya existe');
    }

    const time = await this.timeRepository.findOneBy({ id });
    const savedTime = await this.timeRepository.save({
      ...time,
      ...updateTimeDto
    });
    // If the time limit was updated successfully, create a comment and ticket
    if (savedTime) {
      const ticketCommentBody = `El límite de tiempo ${savedTime.timeLimit.toString()} segundos ha sido actualizado`;
      const comment = this.commentRepository.create({
        body: ticketCommentBody
      });
      const savedComment = await this.commentRepository.save(comment);
      const ticket = this.ticketRepository.create({
        otherId: savedTime.id,
        operation: TicketOperation.UPDATE,
        status: TicketStatus.ACCEPTED,
        itemType: TicketType.UTILS,
        commentId: savedComment
      });
      const savedTicket = await this.ticketRepository.save(ticket);
      // If the comment and ticket were saved successfully, return the updated time limit
      if (savedComment && savedTicket) {
        return savedTime;
      }
    }
  }

  /*
  Input: id: string
  Output: Promise<Time[] | undefined>
  Return value: Removed time limit object or throws error
  Function: Removes a time limit, reassigns exercises if needed, creates comment and ticket
  Variables: allTimeLimits, pivot, time, ticketComment, commmentId, savedComment, ticket, excercise
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  async remove(id: string) {
    const allTimeLimits = await this.timeRepository.find();
    // If there is only one time limit, throw an error
    if (allTimeLimits.length === 1) {
      throw new BadRequestException(
        'No se puede eliminar el único límite de tiempo'
      );
    }
    let pivot = allTimeLimits[0];
    // Select a pivot to reassign exercises to. If the pivot is the one being deleted, select the next one
    if (pivot.id === id) {
      pivot = allTimeLimits[1];
    }
    const time = await this.timeRepository
      .createQueryBuilder('time')
      .where('time.id = :id', { id })
      .leftJoinAndSelect('time.excercises', 'excercises')
      .getOne();
    const ticketComment = `El límite de tiempo ${time.timeLimit.toString()} fue eliminado`;
    const commmentId = this.commentRepository.create({
      body: ticketComment
    });
    const savedComment = await this.commentRepository.save(commmentId);
    const ticket = this.ticketRepository.create({
      operation: TicketOperation.DELETE,
      status: TicketStatus.ACCEPTED,
      itemType: TicketType.UTILS,
      commentId: savedComment
    });
    // If the ticket was created successfully, reassign exercises and remove the time limit
    if (ticket) {
      if (time.excercises.length > 0) {
        // Reassign exercises to the pivot time limit
        for (const excercise of time.excercises) {
          excercise.time = pivot;
          await this.excerciseRepository.save(excercise);
        }
      }
      return await this.timeRepository.remove(time);
    } else {
      throw new BadRequestException('Error al eliminar el límite de tiempo');
    }
  }
}
