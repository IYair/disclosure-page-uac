import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from './entities/tag.entity';
import { Comment } from 'src/comment/entities/comment.entity';
import {
  Ticket,
  TicketOperation,
  TicketStatus,
  TicketType
} from 'src/ticket/entities/ticket.entity';
import { Excercise } from 'src/excercises/entities/excercise.entity';
import { Note } from 'src/notes/entities/note.entity';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
    @InjectRepository(Excercise)
    private readonly excerciseRepository: Repository<Excercise>,
    @InjectRepository(Note)
    private readonly noteRepository: Repository<Note>
  ) {}

  /*
  Input: createTagDto: CreateTagDto
  Output: Promise<any>
  Return value: Created tag object or error
  Function: Creates a new tag, validates input, creates comment and ticket
  Variables: trimmedName, name, existingTag, savedTag
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  async create(createTagDto: CreateTagDto) {
    const trimmedName = createTagDto.name.trim();
    // Validate that the trimmed name is not empty or just spaces
    if (trimmedName.length === 0) {
      throw new BadRequestException(
        'El nombre de la etiqueta no puede estar vacío o contener solo espacios.'
      );
    }
    // Validate that the trimmed name does not exceed 255 characters
    if (trimmedName.length > 255) {
      throw new BadRequestException(
        'El nombre de la etiqueta no puede exceder los 255 caracteres.'
      );
    }
    const name = await this.tagRepository.findOneBy({
      name: trimmedName
    });
    // If a tag with the same name already exists, throw an error
    if (name) {
      throw new BadRequestException('Ya existe una etiqueta con ese nombre.');
    }
    const existingTag = await this.tagRepository.findOneBy({
      color: createTagDto.color
    });
    // If a tag with the same color already exists, throw an error
    if (existingTag) {
      throw new BadRequestException('Ya existe una etiqueta con este color.');
    }
    const savedTag = await this.tagRepository.save({
      ...createTagDto,
      name: trimmedName
    });
    // If the tag was created successfully, create a comment and ticket
    if (savedTag) {
      const ticketCommentBody = `La etiqueta ${savedTag.name} ha sido creada`;
      const comment = this.commentRepository.create({
        body: ticketCommentBody
      });
      const savedComment = await this.commentRepository.save(comment);
      const ticket = this.ticketRepository.create({
        otherId: savedTag.id,
        operation: TicketOperation.CREATE,
        status: TicketStatus.ACCEPTED,
        itemType: TicketType.UTILS,
        commentId: savedComment
      });
      await this.ticketRepository.save(ticket);
      // If the comment and ticket are successfully saved, return the created tag
      if (savedComment && ticket) {
        return savedTag;
      }
    } else {
      throw new BadRequestException('Error al crear la etiqueta');
    }
  }

  /*
  Input: None
  Output: Promise<Tag[]>
  Return value: Array of all tags
  Function: Retrieves all tags ordered by name
  Variables: None
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  async findAll() {
    return await this.tagRepository
      .createQueryBuilder('tag')
      .orderBy('tag.name', 'ASC')
      .getMany();
  }

  /*
  Input: id: string
  Output: Promise<Tag | null>
  Return value: Tag object or null
  Function: Finds a tag by id
  Variables: None
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  async findOne(id: string) {
    return await this.tagRepository.findOneBy({ id });
  }

  /*
  Input: id: string, updateTagDto: UpdateTagDto
  Output: Promise<any>
  Return value: Updated tag object or error
  Function: Updates a tag by id
  Variables: trimmedName, existingTag, existingColorTag, tag, savedTag
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  async update(id: string, updateTagDto: UpdateTagDto) {
    const trimmedName = updateTagDto.name.trim();
    // Validate that the trimmed name is not empty or just spaces
    if (trimmedName.length === 0) {
      throw new BadRequestException(
        'El nombre de la etiqueta no puede estar vacío o contener solo espacios.'
      );
    }
    // Validate that the trimmed name does not exceed 255 characters
    if (trimmedName.length > 255) {
      throw new BadRequestException(
        'El nombre de la etiqueta no puede exceder los 255 caracteres.'
      );
    }
    const existingTag = await this.tagRepository.findOneBy({
      name: trimmedName
    });
    // If a tag with the same name already exists and it's not the current tag, throw an error
    if (existingTag !== null && existingTag.id !== id) {
      throw new BadRequestException('Ya existe una etiqueta con ese nombre.');
    }
    const existingColorTag = await this.tagRepository.findOneBy({
      color: updateTagDto.color
    });
    // If a tag with the same color already exists and it's not the current tag, throw an error
    if (existingColorTag && existingColorTag.id !== id) {
      throw new BadRequestException('Ya existe una etiqueta con este color');
    }
    const tag = await this.tagRepository.findOneBy({ id });
    const savedTag = await this.tagRepository.save({
      ...tag,
      ...updateTagDto,
      name: trimmedName
    });
    // If the tag was updated successfully, create a comment and ticket
    if (savedTag) {
      const ticketCommentBody = `La etiqueta ${savedTag.name} ha sido actualizada`;
      const comment = this.commentRepository.create({
        body: ticketCommentBody
      });
      const savedComment = await this.commentRepository.save(comment);
      const ticket = this.ticketRepository.create({
        otherId: savedTag.id,
        operation: TicketOperation.UPDATE,
        status: TicketStatus.ACCEPTED,
        itemType: TicketType.UTILS,
        commentId: savedComment
      });
      const savedTicket = await this.ticketRepository.save(ticket);
      // If the comment and ticket are successfully saved, return the updated tag
      if (savedComment && savedTicket) {
        return savedTag;
      }
    } else {
      throw new BadRequestException('Error al actualizar la etiqueta');
    }
  }

  /*
  Input: id: string
  Output: Promise<any>
  Return value: Removed tag object or error
  Function: Removes a tag by id
  Variables: allTags, pivot
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  async remove(id: string) {
    const allTags = await this.tagRepository.find();
    // If there is only one tag, throw an error
    if (allTags.length === 1) {
      throw new BadRequestException('No se puede eliminar la única etiqueta');
    }
    let pivot = allTags[0];
    // Select a tag to use as a pivot for reassigning exercises and notes. If the pivot is the one being deleted, select the next one
    if (pivot.id === id) {
      pivot = allTags[1];
    }
    const tag = await this.tagRepository
      .createQueryBuilder('tag')
      .leftJoinAndSelect('tag.excercises', 'excercises')
      .leftJoinAndSelect('excercises.tags', 'exerciseTags')
      .leftJoinAndSelect('tag.notes', 'notes')
      .leftJoinAndSelect('notes.tags', 'noteTags')
      .where('tag.id = :id', { id: id })
      .getOne();
    const ticketCommentBody = `La etiqueta ${tag.name} ha sido eliminada`;
    const comment = this.commentRepository.create({ body: ticketCommentBody });
    const ticket = this.ticketRepository.create({
      operation: TicketOperation.DELETE,
      status: TicketStatus.ACCEPTED,
      itemType: TicketType.UTILS,
      commentId: comment
    });
    const savedTicket = await this.ticketRepository.save(ticket);
    // If a ticket is successfully saved, reassign exercises and notes to a pivot tag
    if (savedTicket) {
      // If the amount of exercises is greater than 0, remove the tag to be deleted
      if (tag.excercises.length > 0) {
        // For every exercise associated with the tag, remove the tag to be deleted
        for (const exercise of tag.excercises) {
          exercise.tags = exercise.tags.filter(t => t.id !== id);
          // If the exercise has no tags left, assign the pivot tag
          if (exercise.tags.length === 0) {
            exercise.tags.push(pivot);
          }
          await this.excerciseRepository.save(exercise);
        }
      }
      // If the tag has notes, remove the tag to be deleted
      if (tag.notes.length > 0) {
        // For every note associated with the tag, remove the tag to be deleted
        for (const note of tag.notes) {
          note.tags = note.tags.filter(t => t.id !== id);
          // If the note has no tags left, assign the pivot tag
          if (note.tags.length === 0) {
            note.tags.push(pivot);
          }
          await this.noteRepository.save(note);
        }
      }
      return await this.tagRepository.remove(tag);
    } else {
      throw new BadRequestException('Error al eliminar la etiqueta');
    }
  }
}
