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
  /*
  Input: createTicketDto: CreateTicketDto
  Output: Promise<Ticket>
  Return value: Created or found ticket object
  Function: Creates a new ticket or returns an existing one based on the item type and ids, creates comment if needed
  Variables: ticketType, originalId, modifiedId, ticket, original, modified, comment, res
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
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
    // If no comment exists with the provided description, create a new one
    if (comment === null) {
      comment = this.commentRepository.create();
      comment.body = createTicketDto.description;
      comment = await this.commentRepository.save(comment);
    }
    // Determine the original and modified ids based on the ticket type
    switch (ticketType) {
      // If the ticket is for an exercise, find the original and modified exercises
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
      // If the ticket is for a note, find the original and modified notes
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
      // If the ticket is for news, find the original and modified news articles
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
    // If a ticket with the same ids and comment was not found
    if (ticket === null) {
      let res = this.ticketRepository.create();
      res.commentId = comment;
      res.status = TicketStatus.PENDING;
      // Save the ids in the ticket according to the item type
      switch (ticketType) {
        // If the item type is exercise, save the original and modified exercise ids
        case 'exercise':
          res.originalExerciseId = original;
          res.modifiedExerciseId = modified;
          res.itemType = TicketType.EXERCISE;
          break;
        // If the item type is note, save the original and modified note ids
        case 'note':
          res.originalNoteId = original;
          res.modifiedNoteId = modified;
          res.itemType = TicketType.NOTE;
          break;
        // If the item type is news, save the original and modified news ids
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

  /*
  Input: None
  Output: Promise<Ticket[]>
  Return value: Array of all tickets
  Function: Retrieves all tickets with their comments
  Variables: None
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  async findAll() {
    return await this.ticketRepository
      .createQueryBuilder('ticket')
      .leftJoinAndSelect('ticket.commentId', 'comment')
      .getMany();
  }

  /*
  Input: None
  Output: Promise<Ticket[]>
  Return value: Array of pending tickets
  Function: Retrieves all pending tickets ordered by creation date
  Variables: None
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  async findPending() {
    return await this.ticketRepository
      .createQueryBuilder('ticket')
      .where('ticket.status = :status', { status: TicketStatus.PENDING })
      .leftJoinAndSelect('ticket.commentId', 'comment')
      .orderBy('ticket.created_at', 'ASC')
      .getMany();
  }

  /*
  Input: id: string
  Output: Promise<any>
  Return value: Ticket object with joined related entities
  Function: Finds a ticket by id and returns detailed info based on item type and operation
  Variables: ticket, res, originalItem, modifiedItem, originalNote, modifiedNote, image
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  async findOne(id: string) {
    const ticket = await this.ticketRepository.findOneBy({ id: id });
    // Get the associated items according to type and operation
    switch (ticket.itemType) {
      // If the item type is an exercise
      case TicketType.EXERCISE:
        switch (ticket.operation) {
          // If the operation is an update in an exercise
          case TicketOperation.UPDATE:
            const res = await this.ticketRepository
              .createQueryBuilder('ticket')
              .where('ticket.id = :id', { id: id })
              .leftJoinAndSelect('ticket.commentId', 'commentId')
              .leftJoinAndSelect(
                'ticket.originalExerciseId',
                'originalExerciseId'
              )
              .leftJoinAndSelect(
                'ticket.modifiedExerciseId',
                'modifiedExerciseId'
              )
              .getOne();
            const originalItem = await this.excerciseRepository
              .createQueryBuilder('excercise')
              .where('excercise.id = :id', { id: res.originalExerciseId.id })
              .leftJoinAndSelect('excercise.category', 'category')
              .leftJoinAndSelect('excercise.time', 'time')
              .leftJoinAndSelect('excercise.memoryId', 'memory')
              .leftJoinAndSelect('excercise.difficulty', 'difficulty')
              .leftJoinAndSelect('excercise.tags', 'tags')
              .getOne();
            const modifiedItem = await this.excerciseRepository
              .createQueryBuilder('excercise')
              .where('excercise.id = :id', { id: res.modifiedExerciseId.id })
              .leftJoinAndSelect('excercise.category', 'category')
              .leftJoinAndSelect('excercise.time', 'time')
              .leftJoinAndSelect('excercise.memoryId', 'memory')
              .leftJoinAndSelect('excercise.tags', 'tags')
              .leftJoinAndSelect('excercise.difficulty', 'difficulty')
              .getOne();
            return {
              ...res,
              originalExerciseId: originalItem,
              modifiedExerciseId: modifiedItem
            };
          // if the operation is a create or delete in an exercise
          default:
            return await this.ticketRepository
              .createQueryBuilder('ticket')
              .where('ticket.id = :id', { id: id })
              .leftJoinAndSelect('ticket.commentId', 'commentId')
              .leftJoinAndSelect(
                'ticket.originalExerciseId',
                'originalExerciseId'
              )
              .leftJoinAndSelect('originalExerciseId.category', 'category')
              .leftJoinAndSelect('originalExerciseId.time', 'time')
              .leftJoinAndSelect('originalExerciseId.memoryId', 'memory')
              .leftJoinAndSelect('originalExerciseId.tags', 'tags')
              .leftJoinAndSelect('originalExerciseId.difficulty', 'difficulty')
              .getOne();
        }
      // If the item type is a note
      case TicketType.NOTE:
        switch (ticket.operation) {
          // If the operation is an update in a note
          case TicketOperation.UPDATE:
            const res = await this.ticketRepository
              .createQueryBuilder('ticket')
              .where('ticket.id = :id', { id: id })
              .leftJoinAndSelect('ticket.commentId', 'commentId')
              .leftJoinAndSelect('ticket.originalNoteId', 'originalNoteId')
              .leftJoinAndSelect('ticket.modifiedNoteId', 'modifiedNoteId')
              .getOne();
            const originalNote = await this.notesRepository
              .createQueryBuilder('note')
              .where('note.id = :id', { id: res.originalNoteId.id })
              .leftJoinAndSelect('note.commentId', 'comment')
              .leftJoinAndSelect('note.category', 'category')
              .leftJoinAndSelect('note.tags', 'tags')
              .getOne();
            const modifiedNote = await this.notesRepository
              .createQueryBuilder('note')
              .where('note.id = :id', { id: res.modifiedNoteId.id })
              .leftJoinAndSelect('note.commentId', 'comment')
              .leftJoinAndSelect('note.category', 'category')
              .leftJoinAndSelect('note.tags', 'tags')
              .getOne();
            return {
              ...res,
              originalNoteId: originalNote,
              modifiedNoteId: modifiedNote
            };
          // If the operation is a create or delete in a note
          default:
            return await this.ticketRepository
              .createQueryBuilder('ticket')
              .where('ticket.id = :id', { id: id })
              .leftJoinAndSelect('ticket.commentId', 'commentId')
              .leftJoinAndSelect('ticket.originalNoteId', 'originalNoteId')
              .leftJoinAndSelect('originalNoteId.commentId', 'comment')
              .leftJoinAndSelect('originalNoteId.category', 'category')
              .leftJoinAndSelect('originalNoteId.tags', 'tags')
              .getOne();
        }
      // If the item type is news
      case TicketType.NEWS:
        // If the operation is an update in news
        return ticket.operation == TicketOperation.UPDATE
          ? await this.ticketRepository
              .createQueryBuilder('ticket')
              .where('ticket.id = :id', { id: id })
              .leftJoinAndSelect('ticket.commentId', 'commentId')
              .leftJoinAndSelect('ticket.originalNewsId', 'originalNewsId')
              .leftJoinAndSelect('ticket.modifiedNewsId', 'modifiedNewsId')
              .getOne()
          : // If the operation is either a create or a delete
            await this.ticketRepository
              .createQueryBuilder('ticket')
              .where('ticket.id = :id', { id: id })
              .leftJoinAndSelect('ticket.commentId', 'commentId')
              .leftJoinAndSelect('ticket.originalNewsId', 'originalNewsId')
              .getOne();
    }
  }

  /*
  Input: id: string, updateTicketDto: UpdateTicketDto
  Output: Promise<Ticket>
  Return value: Updated ticket object
  Function: Updates a ticket's status, comment, and related ids based on item type
  Variables: ticket, comment
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  async update(id: string, updateTicketDto: UpdateTicketDto) {
    const ticket = await this.ticketRepository.findOneBy({ id: id });
    let comment = await this.commentRepository.findOneBy({
      body: updateTicketDto.description
    });
    // Set the new status of the ticket based on the provided status
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
    // If no comment exists with the provided description, create a new one
    if (comment !== null) {
      ticket.commentId = comment;
    } else {
      comment = this.commentRepository.create();
      comment.body = updateTicketDto.description;
      ticket.commentId = await this.commentRepository.save(comment);
    }
    // set the item ids according to the item type
    switch (ticket.itemType) {
      // If the item type is an exercise, update the exercise id columns
      case TicketType.EXERCISE:
        ticket.originalExerciseId = await this.excerciseRepository.findOneBy({
          id: updateTicketDto.originalExerciseId
        });
        ticket.modifiedExerciseId = await this.excerciseRepository.findOneBy({
          id: updateTicketDto.modifiedExerciseId
        });
        break;
      // If the item type is a note, update the note id columns
      case TicketType.NOTE:
        ticket.originalNoteId = await this.notesRepository.findOneBy({
          id: updateTicketDto.originalNoteId
        });
        ticket.modifiedNoteId = await this.notesRepository.findOneBy({
          id: updateTicketDto.modifiedNoteId
        });
        break;
      // If the item type is news, update the news id columns
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

  /*
  Input: id: string
  Output: Promise<Ticket>
  Return value: Removed ticket object
  Function: Removes a ticket by id
  Variables: ticket
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  async remove(id: string) {
    const ticket = await this.ticketRepository.findOneBy({ id: id });
    return await this.ticketRepository.remove(ticket);
  }

  /*
  Input: id: string
  Output: Promise<any>
  Return value: Result of approving the ticket and updating related entities
  Function: Approves a ticket, updates status, and applies changes to related items based on operation and type
  Variables: ticket, res, item, original, modified
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  async approve(id: string) {
    const ticket = await this.ticketRepository
      .createQueryBuilder('ticket')
      .where('ticket.id = :id', { id })
      .leftJoinAndSelect('ticket.originalExerciseId', 'originalExerciseId')
      .leftJoinAndSelect('ticket.modifiedExerciseId', 'modifiedExerciseId')
      .leftJoinAndSelect('ticket.originalNoteId', 'originalNoteId')
      .leftJoinAndSelect('ticket.modifiedNoteId', 'modifiedNoteId')
      .leftJoinAndSelect('ticket.originalNewsId', 'originalNewsId')
      .leftJoinAndSelect('ticket.modifiedNewsId', 'modifiedNewsId')
      .getOne();
    ticket.status = TicketStatus.ACCEPTED;
    this.ticketRepository.save(ticket);
    let res;
    let item: Excercise | Note | News;
    // Depending on the operation, update or remove the related item
    switch (ticket.operation) {
      // if the operation is a create
      case TicketOperation.CREATE:
        switch (ticket.itemType) {
          // If the operation is a create in an exercise, make the exercise visible
          case TicketType.EXERCISE:
            item = await this.excerciseRepository.findOneBy({
              id: ticket.originalExerciseId.id
            });
            item.isVisible = true;
            res = await this.excerciseRepository.save(item);
            break;
          // If the item type is a note, make the note visible
          case TicketType.NOTE:
            item = await this.notesRepository.findOneBy({
              id: ticket.originalNoteId.id
            });
            item.isVisible = true;
            res = await this.notesRepository.save(item);
            break;
          // If the item type is news, make the news item visible
          case TicketType.NEWS:
            item = await this.newsRepository.findOneBy({
              id: ticket.originalNewsId.id
            });
            item.isVisible = true;
            res = await this.newsRepository.save(item);
            break;
        }
        break;
      // if the operation is an update
      case TicketOperation.UPDATE:
        let original: Excercise | Note | News;
        let modified: Excercise | Note | News;
        // Depending on the item type, update the original and modified items
        switch (ticket.itemType) {
          // If the item type is an exercise, update the exercise and make it visible
          case TicketType.EXERCISE:
            original = await this.excerciseRepository.findOneBy({
              id: ticket.originalExerciseId.id
            });
            modified = await this.excerciseRepository.findOneBy({
              id: ticket.modifiedExerciseId.id
            });
            modified.isVisible = true;
            res = await this.excerciseRepository.save(modified);
            this.excerciseRepository.remove(original);
            break;
          // If the item type is a note, update the note and make it visible
          case TicketType.NOTE:
            original = await this.notesRepository.findOneBy({
              id: ticket.originalNoteId.id
            });
            modified = await this.notesRepository.findOneBy({
              id: ticket.modifiedNoteId.id
            });
            modified.isVisible = true;
            res = await this.notesRepository.save(modified);
            this.notesRepository.remove(original);
            break;
          case TicketType.NEWS:
            // If the item type is news, update the news and make it visible
            original = await this.newsRepository.findOneBy({
              id: ticket.originalNewsId.id
            });
            modified = await this.newsRepository.findOneBy({
              id: ticket.modifiedNewsId.id
            });
            modified.isVisible = true;
            res = await this.newsRepository.save(modified);
            this.newsRepository.delete(original);
            break;
        }
        break;
      // if the operation is a delete
      case TicketOperation.DELETE:
        switch (ticket.itemType) {
          // If the item type is an exercise, find the exercise and remove it
          case TicketType.EXERCISE:
            item = await this.excerciseRepository.findOneBy({
              id: ticket.originalExerciseId.id
            });
            res = await this.excerciseRepository.remove(item);
            break;
          // If the item type is a note, find the note and remove it
          case TicketType.NOTE:
            item = await this.notesRepository.findOneBy({
              id: ticket.originalNoteId.id
            });
            res = await this.notesRepository.remove(item);
            break;
          // If the item type is news, find the news item and remove it
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

  /*
  Input: id: string
  Output: Promise<any>
  Return value: Result of rejecting the ticket and updating/removing related entities
  Function: Rejects a ticket, updates status, and removes or updates related items based on operation and type
  Variables: ticket, res, item, comment, image
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  async reject(id: string) {
    const ticket = await this.ticketRepository
      .createQueryBuilder('ticket')
      .where('ticket.id = :id', { id })
      .leftJoinAndSelect('ticket.originalExerciseId', 'originalExerciseId')
      .leftJoinAndSelect('ticket.modifiedExerciseId', 'modifiedExerciseId')
      .leftJoinAndSelect('ticket.originalNoteId', 'originalNoteId')
      .leftJoinAndSelect('ticket.modifiedNoteId', 'modifiedNoteId')
      .leftJoinAndSelect('ticket.originalNewsId', 'originalNewsId')
      .leftJoinAndSelect('ticket.modifiedNewsId', 'modifiedNewsId')
      .getOne();

    ticket.status = TicketStatus.REJECTED;
    const res = await this.ticketRepository.save(ticket);
    let item: Excercise | Note | News;
    // Depending on the operation, update or remove the related item
    switch (ticket.operation) {
      // if the operation is a create
      case TicketOperation.CREATE:
        // Update the information according to the item type
        switch (ticket.itemType) {
          // If the item type is an exercise, find the exercise and remove it
          case TicketType.EXERCISE:
            item = await this.excerciseRepository.findOneBy({
              id: ticket.originalExerciseId.id
            });
            await this.excerciseRepository.remove(item);
            break;
          // If the item type is a note, find the note and remove it
          case TicketType.NOTE:
            item = await this.notesRepository
              .createQueryBuilder('note')
              .leftJoinAndSelect('note.commentId', 'commentId')
              .where('note.id = :id', { id: ticket.originalNoteId.id })
              .getOne();
            const comment = await this.commentRepository
              .createQueryBuilder('comment')
              .leftJoinAndSelect('comment.notes', 'notes')
              .where('comment.id = :id', { id: item.commentId.id })
              .getOne();
            if (comment.notes.length === 1) {
              item.commentId = null;
              await this.notesRepository.save(item);
              await this.commentRepository.remove(comment);
            }
            await this.notesRepository.remove(item);
            break;
          // If the item type is news, find the news item and remove it
          case TicketType.NEWS:
            item = await this.newsRepository
              .createQueryBuilder('news')
              .where('news.id = :id', { id: ticket.originalNewsId.id })
              .leftJoinAndSelect('news.imageId', 'imageId')
              .getOne();
            const image = await this.imageRepository.findOneBy({
              id: item.imageId.id
            });
            if (image.news) {
              await this.imageRepository.remove(image);
            }
            await this.newsRepository.remove(item);
            break;
        }
        break;
      // if the operation is an update
      case TicketOperation.UPDATE:
        // delete information according to the item type
        switch (ticket.itemType) {
          // if the item is an exercise, find the modified exercise and remove it
          case TicketType.EXERCISE:
            item = await this.excerciseRepository.findOneBy({
              id: ticket.modifiedExerciseId.id
            });
            await this.excerciseRepository.remove(item);
            break;
          // if the item is a note, find the modified note and remove it
          case TicketType.NOTE:
            item = await this.notesRepository.findOneBy({
              id: ticket.modifiedNoteId.id
            });
            await this.notesRepository.remove(item);
            break;
          // if the item is news, find the modified news and remove it
          case TicketType.NEWS:
            item = await this.newsRepository.findOneBy({
              id: ticket.modifiedNewsId.id
            });
            await this.newsRepository.remove(item);
            break;
        }
        break;
    }
    return res;
  }

  /*
  Input: itemId: string, itemType: TicketType
  Output: Promise<boolean>
  Return value: True if a pending ticket exists for the item, false otherwise
  Function: Checks if there is a pending ticket for a given item and type
  Variables: pendingTicket
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  async hasPendingTicket(
    itemId: string,
    itemType: TicketType
  ): Promise<boolean> {
    const pendingTicket = await this.ticketRepository.findOne({
      where: {
        itemType,
        status: TicketStatus.PENDING,
        originalExerciseId:
          // check the exercise table for the original exercise id
          itemType === TicketType.EXERCISE ? { id: itemId } : undefined,
        originalNoteId:
          // check the note table for the original note id
          itemType === TicketType.NOTE ? { id: itemId } : undefined,
        originalNewsId:
          // check the news table for the original news id
          itemType === TicketType.NEWS ? { id: itemId } : undefined
      }
    });

    return !!pendingTicket;
  }
}
