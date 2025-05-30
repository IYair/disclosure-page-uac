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

  async create(createMemoryDto: CreateMemoryDto) {
    if (!createMemoryDto.value) {
      throw new BadRequestException('El límite de memoria debe ser un número');
    }

    if (createMemoryDto.value <= 0) {
      throw new BadRequestException('El límite de memoria debe ser mayor a 0');
    }

    let finalValue = 0;
    switch (createMemoryDto.id) {
      case 'MB':
        finalValue = createMemoryDto.value * 1024;
        break;
      case 'GB':
        finalValue = createMemoryDto.value * 1024 * 1024;
        break;
      default:
        finalValue = createMemoryDto.value;
        break;
    }
      // Validar si el valor excede el máximo permitido
    if (finalValue > 2147483647) {
      throw new BadRequestException(
        `El límite de memoria calculado (${finalValue} KB) excede el máximo permitido (2147483647 KB)`
      );
    }

    const memory = await this.memoryRepository.findOneBy({
      memoryLimit: finalValue
    });
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
      if (savedTicket) {
        return savedMemory;
      }
    }
  }

  async findAll() {
    return await this.memoryRepository
      .createQueryBuilder('memory')
      .orderBy('memory.memoryLimit', 'ASC')
      .getMany();
  }

  async findOne(id: string) {
    return await this.memoryRepository.findOneBy({ id });
  }

  async update(id: string, updateMemoryDto: UpdateMemoryDto) {
    if (!updateMemoryDto.value) {
      throw new BadRequestException('El límite de memoria debe ser un número');
    }
    if (updateMemoryDto.value <= 0) {
      throw new BadRequestException('El límite de memoria debe ser mayor a 0');
    }
    const memory = await this.memoryRepository.findOneBy({ id });
  
    let finalValue;
    switch (updateMemoryDto.id) {
      case 'MB':
        finalValue = updateMemoryDto.value * 1024;
        break;
      case 'GB':
        finalValue = updateMemoryDto.value * 1024 * 1024;
        break;
      default:
        finalValue = updateMemoryDto.value;
        break;
    }
  
    // Validar si el valor excede el máximo permitido
    if (finalValue > 2147483647) {
      throw new BadRequestException(
        `El límite de memoria calculado (${finalValue} KB) excede el máximo permitido (2147483647 KB)`
      );
    }
  
    const existingMemory = await this.memoryRepository.findOneBy({
      memoryLimit: finalValue
    });
    if (existingMemory !== null && existingMemory.id !== id) {
      throw new BadRequestException('Ese límite de memoria ya existe');
    }
  
    const savedMemory = await this.memoryRepository.save({
      ...memory,
      memoryLimit: finalValue
    });
  
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
      if (savedComment && savedTicket) {
        return savedMemory;
      }
    }
  }

  async remove(id: string) {
    const allMemoryLimits = await this.memoryRepository.find();
    if (allMemoryLimits.length === 1) {
      throw new BadRequestException(
        'No se puede eliminar el único límite de memoria'
      );
    }
    let pivot = allMemoryLimits[0];
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
    if (savedTicket) {
      if (memory.excercises.length > 0) {
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
