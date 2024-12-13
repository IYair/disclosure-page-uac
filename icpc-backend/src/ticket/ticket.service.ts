import { Injectable } from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Ticket,
  TicketType,
  TicketStatus,
  TicketOperation
} from './entities/ticket.entity';
import { Repository } from 'typeorm';
import { Excercise } from 'src/excercises/entities/excercise.entity';
import { Note } from 'src/notes/entities/note.entity';
import { News } from 'src/news/entities/news.entity';
import { Comment } from 'src/comment/entities/comment.entity';
import { Image } from 'src/image/entities/image.entity';

@Injectable()
export class TicketService {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
    @InjectRepository(Excercise)
    private readonly excerciseRepository: Repository<Excercise>,
    @InjectRepository(Note)
    private readonly notesRepository: Repository<Note>,
    @InjectRepository(News)
    private readonly newsRepository: Repository<News>,
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>
  ) {}
  async create(createTicketDto: CreateTicketDto) {
    const ticketType = createTicketDto.itemType;
    let originalId = '';
    let modifiedId = '';
    let ticket: Ticket;
    let original;
    let modified;
    let comment = await this.commentRepository.findOneBy({
      body: createTicketDto.description
    });
    if (comment === null) {
      comment = this.commentRepository.create();
      comment.body = createTicketDto.description;
      comment = await this.commentRepository.save(comment);
    }
    switch (ticketType) {
      case 'exercise':
        originalId = createTicketDto.originalExerciseId;
        modifiedId = createTicketDto.modifiedExerciseId;
        original = await this.excerciseRepository.findOneBy({ id: originalId });
        modified = await this.excerciseRepository.findOneBy({ id: modifiedId });
        ticket = await this.ticketRepository.findOneBy({
          originalExerciseId: original,
          modifiedExerciseId: modified,
          commentId: comment
        });
        break;
      case 'note':
        originalId = createTicketDto.originalNoteId;
        modifiedId = createTicketDto.modifiedNoteId;
        original = await this.notesRepository.findOneBy({ id: originalId });
        modified = await this.notesRepository.findOneBy({ id: modifiedId });
        ticket = await this.ticketRepository.findOneBy({
          originalNoteId: original,
          modifiedNoteId: modified,
          commentId: comment
        });
        break;
      case 'news':
        originalId = createTicketDto.originalNewsId;
        modifiedId = createTicketDto.modifiedNewsId;
        original = await this.newsRepository.findOneBy({ id: originalId });
        modified = await this.newsRepository.findOneBy({ id: modifiedId });
        ticket = await this.ticketRepository.findOneBy({
          originalNewsId: original,
          modifiedNewsId: modified,
          commentId: comment
        });
        break;
    }
    if (ticket === null) {
      let res = this.ticketRepository.create();
      res.commentId = comment;
      res.status = TicketStatus.PENDING;
      switch (ticketType) {
        case 'exercise':
          res.originalExerciseId = original;
          res.modifiedExerciseId = modified;
          res.itemType = TicketType.EXERCISE;
          break;
        case 'note':
          res.originalNoteId = original;
          res.modifiedNoteId = modified;
          res.itemType = TicketType.NOTE;
          break;
        case 'news':
          res.originalNewsId = original;
          res.modifiedNewsId = modified;
          res.itemType = TicketType.NEWS;
          break;
      }
      res = await this.ticketRepository.save(res);
      return res;
    }
    return ticket;
  }

  async findAll() {
    return await this.ticketRepository
      .createQueryBuilder('ticket')
      .leftJoinAndSelect('ticket.commentId', 'comment')
      .getMany();
  }

  async findPending() {
    return await this.ticketRepository
      .createQueryBuilder('ticket')
      .where('ticket.status = :status', { status: TicketStatus.PENDING })
      .leftJoinAndSelect('ticket.commentId', 'comment')
      .getMany();
  }

  async findOne(id: string) {
    const ticket = await this.ticketRepository.findOneBy({ id: id });
    switch (ticket.itemType) {
      case TicketType.EXERCISE:
        return ticket.operation == TicketOperation.UPDATE
          ? await this.ticketRepository
              .createQueryBuilder('ticket')
              .where('ticket.id = :id', { id: id })
              .leftJoinAndSelect(
                'ticket.originalExerciseId',
                'originalExerciseId'
              )
              .leftJoinAndSelect('originalExerciseId.category', 'category')
              .leftJoinAndSelect('originalExerciseId.tags', 'tags')
              .leftJoinAndSelect('originalExerciseId.memoryId', 'memory')
              .leftJoinAndSelect('originalExerciseId.difficulty', 'difficulty')
              .leftJoinAndSelect('originalExerciseId.time', 'time')
              .leftJoinAndSelect(
                'ticket.modifiedExerciseId',
                'modifiedExerciseId'
              )
              .leftJoinAndSelect('modifiedExerciseId.category', 'category')
              .leftJoinAndSelect('modifiedExerciseId.tags', 'tags')
              .leftJoinAndSelect('modifiedExerciseId.memoryId', 'memory')
              .leftJoinAndSelect('modifiedExerciseId.difficulty', 'difficulty')
              .leftJoinAndSelect('modifiedExerciseId.time', 'time')
              .getOne()
          : await this.ticketRepository
              .createQueryBuilder('ticket')
              .where('ticket.id = :id', { id: id })
              .leftJoinAndSelect(
                'ticket.originalExerciseId',
                'originalExerciseId'
              )
              .leftJoinAndSelect('originalExerciseId.category', 'category')
              .leftJoinAndSelect('originalExerciseId.tags', 'tags')
              .leftJoinAndSelect('originalExerciseId.difficulty', 'difficulty')
              .leftJoinAndSelect('originalExerciseId.time', 'time')
              .leftJoinAndSelect('originalExerciseId.memoryId', 'memory')
              .getOne();
      case TicketType.NOTE:
        return ticket.operation == TicketOperation.UPDATE
          ? await this.ticketRepository
              .createQueryBuilder('ticket')
              .where('ticket.id = :id', { id: id })
              .leftJoinAndSelect('ticket.originalNoteId', 'originalNoteId')
              .leftJoinAndSelect('originalNoteId.commentId', 'comment')
              .leftJoinAndSelect('originalNoteId.category', 'category')
              .leftJoinAndSelect('originalNoteId.tags', 'tags')
              .leftJoinAndSelect('ticket.modifiedNoteId', 'modifiedNoteId')
              .leftJoinAndSelect('modifiedNoteId.commentId', 'comment')
              .leftJoinAndSelect('modifiedNoteId.category', 'category')
              .leftJoinAndSelect('originalNoteId.tags', 'tags')
              .getOne()
          : await this.ticketRepository
              .createQueryBuilder('ticket')
              .where('ticket.id = :id', { id: id })
              .leftJoinAndSelect('ticket.originalNoteId', 'originalNoteId')
              .leftJoinAndSelect('originalNoteId.commentId', 'comment')
              .leftJoinAndSelect('originalNoteId.category', 'category')
              .leftJoinAndSelect('originalNoteId.tags', 'tags')
              .getOne();
      case TicketType.NEWS:
        return ticket.operation == TicketOperation.UPDATE
          ? await this.ticketRepository
              .createQueryBuilder('ticket')
              .where('ticket.id = :id', { id: id })
              .leftJoinAndSelect('ticket.originalNewsId', 'originalNewsId')
              .leftJoinAndSelect('ticket.modifiedNewsId', 'modifiedNewsId')
              .getOne()
          : await this.ticketRepository
              .createQueryBuilder('ticket')
              .where('ticket.id = :id', { id: id })
              .leftJoinAndSelect('ticket.originalNewsId', 'originalNewsId')
              .getOne();
    }
  }

  async update(id: string, updateTicketDto: UpdateTicketDto) {
    const ticket = await this.ticketRepository.findOneBy({ id: id });
    let comment = await this.commentRepository.findOneBy({
      body: updateTicketDto.description
    });
    switch (updateTicketDto.status) {
      case TicketStatus.ACCEPTED:
        ticket.status = TicketStatus.ACCEPTED;
        break;
      case TicketStatus.REJECTED:
        ticket.status = TicketStatus.REJECTED;
        break;
      case TicketStatus.PENDING:
        ticket.status = TicketStatus.PENDING;
        break;
      default:
        ticket.status = TicketStatus.PENDING;
        break;
    }
    if (comment !== null) {
      ticket.commentId = comment;
    } else {
      comment = this.commentRepository.create();
      comment.body = updateTicketDto.description;
      ticket.commentId = await this.commentRepository.save(comment);
    }
    switch (ticket.itemType) {
      case TicketType.EXERCISE:
        ticket.originalExerciseId = await this.excerciseRepository.findOneBy({
          id: updateTicketDto.originalExerciseId
        });
        ticket.modifiedExerciseId = await this.excerciseRepository.findOneBy({
          id: updateTicketDto.modifiedExerciseId
        });
        break;
      case TicketType.NOTE:
        ticket.originalNoteId = await this.notesRepository.findOneBy({
          id: updateTicketDto.originalNoteId
        });
        ticket.modifiedNoteId = await this.notesRepository.findOneBy({
          id: updateTicketDto.modifiedNoteId
        });
        break;
      case TicketType.NEWS:
        ticket.originalNewsId = await this.newsRepository.findOneBy({
          id: updateTicketDto.originalNewsId
        });
        ticket.modifiedNewsId = await this.newsRepository.findOneBy({
          id: updateTicketDto.modifiedNewsId
        });
        break;
    }
    return await this.ticketRepository.save(ticket);
  }

  async remove(id: string) {
    const ticket = await this.ticketRepository.findOneBy({ id: id });
    return await this.ticketRepository.remove(ticket);
  }

  async approve(id: string) {
    const ticket = await this.ticketRepository.findOneBy({ id: id });
    ticket.status = TicketStatus.ACCEPTED;
    let res;
    let item: Excercise | Note | News;
    switch (ticket.operation) {
      case TicketOperation.CREATE:
        switch (ticket.itemType) {
          case TicketType.EXERCISE:
            item = await this.excerciseRepository.findOneBy({
              id: ticket.originalExerciseId.id
            });
            item.isVisible = true;
            res = await this.excerciseRepository.save(item);
            break;
          case TicketType.NOTE:
            item = await this.notesRepository.findOneBy({
              id: ticket.originalNoteId.id
            });
            item.isVisible = true;
            res = await this.notesRepository.save(item);
            break;
          case TicketType.NEWS:
            item = await this.newsRepository.findOneBy({
              id: ticket.originalNewsId.id
            });
            item.isVisible = true;
            res = await this.newsRepository.save(item);
            break;
        }
        break;
      case TicketOperation.UPDATE:
        let original: Excercise | Note | News;
        let modified: Excercise | Note | News;
        switch (ticket.itemType) {
          case TicketType.EXERCISE:
            original = await this.excerciseRepository.findOneBy({
              id: ticket.originalExerciseId.id
            });
            modified = await this.excerciseRepository.findOneBy({
              id: ticket.modifiedExerciseId.id
            });
            original.isVisible = false;
            modified.isVisible = true;
            this.excerciseRepository.save(original);
            res = await this.excerciseRepository.save(modified);
            break;
          case TicketType.NOTE:
            original = await this.notesRepository.findOneBy({
              id: ticket.originalNoteId.id
            });
            modified = await this.notesRepository.findOneBy({
              id: ticket.modifiedNoteId.id
            });
            original.isVisible = false;
            modified.isVisible = true;
            this.notesRepository.save(original);
            res = await this.notesRepository.save(modified);
            break;
          case TicketType.NEWS:
            original = await this.newsRepository.findOneBy({
              id: ticket.originalNewsId.id
            });
            modified = await this.newsRepository.findOneBy({
              id: ticket.modifiedNewsId.id
            });
            original.isVisible = false;
            modified.isVisible = true;
            this.newsRepository.save(original);
            res = await this.newsRepository.save(modified);
            break;
        }
        break;
      case TicketOperation.DELETE:
        switch (ticket.itemType) {
          case TicketType.EXERCISE:
            item = await this.excerciseRepository.findOneBy({
              id: ticket.originalExerciseId.id
            });
            res = await this.excerciseRepository.remove(item);
            break;
          case TicketType.NOTE:
            item = await this.notesRepository.findOneBy({
              id: ticket.originalNoteId.id
            });
            res = await this.notesRepository.remove(item);
            break;
          case TicketType.NEWS:
            item = await this.newsRepository.findOneBy({
              id: ticket.originalNewsId.id
            });
            res = await this.newsRepository.remove(item);
            break;
        }
        break;
    }
    return res;
  }

  async reject(id: string) {
    const ticket = await this.ticketRepository.findOneBy({ id: id });
    ticket.status = TicketStatus.REJECTED;
    let item: Excercise | Note | News;
    let res;
    switch (ticket.operation) {
      case TicketOperation.CREATE:
        switch (ticket.itemType) {
          case TicketType.EXERCISE:
            item = await this.excerciseRepository.findOneBy({
              id: ticket.originalExerciseId.id
            });
            res = await this.excerciseRepository.remove(item);
            break;
          case TicketType.NOTE:
            item = await this.notesRepository.findOneBy({
              id: ticket.originalNoteId.id
            });
            const comment = await this.commentRepository.findOneBy({
              id: item.commentId.id
            });
            if (comment.notes.length === 1) {
              await this.commentRepository.remove(comment);
            }
            res = await this.notesRepository.remove(item);
            break;
          case TicketType.NEWS:
            item = await this.newsRepository.findOneBy({
              id: ticket.originalNewsId.id
            });
            const image = await this.imageRepository.findOneBy({
              id: item.imageId
            });
            if (image.news.length === 1) {
              await this.imageRepository.remove(image);
            }
            res = await this.newsRepository.remove(item);
            break;
        }
        break;
      case TicketOperation.UPDATE:
        switch (ticket.itemType) {
          case TicketType.EXERCISE:
            item = await this.excerciseRepository.findOneBy({
              id: ticket.modifiedExerciseId.id
            });
            res = await this.excerciseRepository.remove(item);
            break;
          case TicketType.NOTE:
            item = await this.notesRepository.findOneBy({
              id: ticket.modifiedNoteId.id
            });
            res = await this.notesRepository.remove(item);
            break;
          case TicketType.NEWS:
            item = await this.newsRepository.findOneBy({
              id: ticket.modifiedNewsId.id
            });
            res = await this.newsRepository.remove(item);
            break;
        }
        break;
    }
    return res;
  }
}
