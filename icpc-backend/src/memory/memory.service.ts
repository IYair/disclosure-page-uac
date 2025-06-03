import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateMemoryDto } from './dto/create-memory.dto';
import { UpdateMemoryDto } from './dto/update-memory.dto';
import { Memory } from './entities/memory.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from 'src/comment/entities/comment.entity';
import {
  Ticket,
  TicketOperation,
  TicketStatus,
  TicketType
} from 'src/ticket/entities/ticket.entity';
import { Excercise } from 'src/excercises/entities/excercise.entity';

@Injectable()
export class MemoryService {
  constructor(
    @InjectRepository(Memory)
    private readonly memoryRepository: Repository<Memory>,
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
    @InjectRepository(Excercise)
    private readonly excerciseRepository: Repository<Excercise>
  ) {}

  /*
  Input: createMemoryDto: CreateMemoryDto
  Output: Promise<any>
  Return value: Created memory object or error
  Function: Creates a new memory limit, validates input, creates comment and ticket
  Variables: finalValue, memory
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  async create(createMemoryDto: CreateMemoryDto) {
    // Validate that value is not null or undefined
    if (!createMemoryDto.value) {
      throw new BadRequestException('El límite de memoria debe ser un número');
    }
    // Validate that value is a positive number and within the allowed range
    if (createMemoryDto.value <= 0) {
      throw new BadRequestException('El límite de memoria debe ser mayor a 0');
    }

    let finalValue = 0;
    // Convert the value to KB based on the unit
    switch (createMemoryDto.id) {
      // MB to KB
      case 'MB':
        finalValue = createMemoryDto.value * 1024;
        break;
      // GB to KB
      case 'GB':
        finalValue = createMemoryDto.value * 1024 * 1024;
        break;
      // Default case for KB
      default:
        finalValue = createMemoryDto.value;
        break;
    }
    // Validate if the final value exceeds the maximum allowed limit
    // The maximum allowed limit is 2147483647 KB (2 GB)
    if (finalValue > 2147483647) {
      throw new BadRequestException(
        `El límite de memoria calculado (${finalValue} KB) excede el máximo permitido (2147483647 KB)`
      );
    }

    const memory = await this.memoryRepository.findOneBy({
      memoryLimit: finalValue
    });
    // Check if a memory limit with the same value already exists
    if (memory) {
      throw new BadRequestException('Ese límite de memoria ya existe');
    } else {
      const newMemoryLimit = this.memoryRepository.create({
        memoryLimit: finalValue
      });
      const savedMemory = await this.memoryRepository.save(newMemoryLimit);
      const ticketCommentBody = `Se ha creado el límite de memoria; ${savedMemory.memoryLimit} KB`;
      const comment = this.commentRepository.create({
        body: ticketCommentBody
      });
      const savedComment = await this.commentRepository.save(comment);
      const ticket = this.ticketRepository.create({
        otherId: savedMemory.id,
        operation: TicketOperation.CREATE,
        status: TicketStatus.ACCEPTED,
        itemType: TicketType.UTILS,
        commentId: savedComment
      });
      const savedTicket = await this.ticketRepository.save(ticket);
      // If the comment and ticket are successfully saved, return the memory limit
      if (savedTicket) {
        return savedMemory;
      }
    }
  }

  /*
  Input: None
  Output: Promise<Memory[]>
  Return value: Array of all memory limits
  Function: Retrieves all memory limits ordered by value
  Variables: None
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  async findAll() {
    return await this.memoryRepository
      .createQueryBuilder('memory')
      .orderBy('memory.memoryLimit', 'ASC')
      .getMany();
  }

  /*
  Input: id: string
  Output: Promise<Memory | null>
  Return value: Memory object or null
  Function: Finds a memory limit by id
  Variables: None
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  async findOne(id: string) {
    return await this.memoryRepository.findOneBy({ id });
  }

  /*
  Input: id: string, updateMemoryDto: UpdateMemoryDto
  Output: Promise<any>
  Return value: Updated memory object or error
  Function: Updates a memory limit by id
  Variables: finalValue, memory, existingMemory, savedMemory
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  async update(id: string, updateMemoryDto: UpdateMemoryDto) {
    // Validate that value is not null or undefined
    if (!updateMemoryDto.value) {
      throw new BadRequestException('El límite de memoria debe ser un número');
    }
    // Validate that value is a positive number and within the allowed range
    if (updateMemoryDto.value <= 0) {
      throw new BadRequestException('El límite de memoria debe ser mayor a 0');
    }
    const memory = await this.memoryRepository.findOneBy({ id });

    let finalValue;
    // Convert the value to KB based on the unit
    switch (updateMemoryDto.id) {
      // MB to KB
      case 'MB':
        finalValue = updateMemoryDto.value * 1024;
        break;
      // GB to KB
      case 'GB':
        finalValue = updateMemoryDto.value * 1024 * 1024;
        break;
      // Default case for KB
      default:
        finalValue = updateMemoryDto.value;
        break;
    }

    // Validate if the final value exceeds the maximum allowed limit
    // The maximum allowed limit is 2147483647 KB (2 GB)
    if (finalValue > 2147483647) {
      throw new BadRequestException(
        `El límite de memoria calculado (${finalValue} KB) excede el máximo permitido (2147483647 KB)`
      );
    }

    const existingMemory = await this.memoryRepository.findOneBy({
      memoryLimit: finalValue
    });
    // Check if a memory limit with the same value already exists
    if (existingMemory !== null && existingMemory.id !== id) {
      throw new BadRequestException('Ese límite de memoria ya existe');
    }

    const savedMemory = await this.memoryRepository.save({
      ...memory,
      memoryLimit: finalValue
    });
    // If the memory limit is successfully saved, create a comment and ticket
    if (savedMemory) {
      const ticketCommentBody = `El límite de memoria ha sido actualizado a ${savedMemory.memoryLimit} KB`;
      const comment = this.commentRepository.create({
        body: ticketCommentBody
      });
      const savedComment = await this.commentRepository.save(comment);
      const ticket = this.ticketRepository.create({
        otherId: savedMemory.id,
        operation: TicketOperation.UPDATE,
        status: TicketStatus.ACCEPTED,
        itemType: TicketType.UTILS,
        commentId: savedComment
      });
      const savedTicket = await this.ticketRepository.save(ticket);
      // If the comment and ticket are successfully saved, return the updated memory limit
      if (savedComment && savedTicket) {
        return savedMemory;
      }
    }
  }

  /*
  Input: id: string
  Output: Promise<any>
  Return value: Removed memory object or error
  Function: Removes a memory limit by id
  Variables: allMemoryLimits, pivot, memory, ticketCommentBody, comment, savedComment
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  async remove(id: string) {
    const allMemoryLimits = await this.memoryRepository.find();
    // If there is only one memory limit, throw an error
    if (allMemoryLimits.length === 1) {
      throw new BadRequestException(
        'No se puede eliminar el único límite de memoria'
      );
    }
    let pivot = allMemoryLimits[0];
    // Select a memory limit to use as a pivot. If the pivot is the one to remove, use the next one
    if (pivot.id === id) {
      pivot = allMemoryLimits[1];
    }
    const memory = await this.memoryRepository
      .createQueryBuilder('memory')
      .where('memory.id = :id', { id })
      .leftJoinAndSelect('memory.excercises', 'excercises')
      .getOne();
    const ticketCommentBody = `El límite de memoria ${memory.memoryLimit.toString()} ha sido eliminado`;
    const comment = this.commentRepository.create({ body: ticketCommentBody });
    const savedComment = await this.commentRepository.save(comment);
    const ticket = this.ticketRepository.create({
      operation: TicketOperation.DELETE,
      status: TicketStatus.ACCEPTED,
      itemType: TicketType.UTILS,
      commentId: savedComment
    });
    const savedTicket = await this.ticketRepository.save(ticket);
    // If a ticket is successfully saved, reassign exercises to a pivot memory limit
    if (savedTicket) {
      // If there is only one memory limit, throw an error
      if (memory.excercises.length > 0) {
        // for each exercise using that memory limit, reassign it to the pivot memory limit
        for (const exercise of memory.excercises) {
          exercise.memoryId = pivot;
          await this.excerciseRepository.save(exercise);
        }
      }
      return await this.memoryRepository.remove(memory);
    } else {
      return null;
    }
  }
}
