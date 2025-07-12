import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Note } from './entities/note.entity';
import { Category } from '../categories/entities/category.entity';
import { Comment } from '../comment/entities/comment.entity';
import { GetNoteListDto } from './dto/get-note-list.dto';
import { Tag } from 'src/tags/entities/tag.entity';
import {
  Ticket,
  TicketOperation,
  TicketStatus,
  TicketType
} from 'src/ticket/entities/ticket.entity';
import { User } from 'src/users/entities/user.entity';
import { MailerService } from 'src/mailer/mailer.service';

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Note)
    private readonly noteRepository: Repository<Note>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly mailerService: MailerService
  ) {}

  /*
  Input: createNoteDto: CreateNoteDto
  Output: Promise<any>
  Return value: Created note object or error
  Function: Creates a new note, validates input, creates ticket and sends mail
  Variables: MAX_DESCRIPTION_LENGTH, title, description, article, noteCategory, user, commentBody, ticketComment, commentId
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  async create(createNoteDto: CreateNoteDto) {
    const MAX_DESCRIPTION_LENGTH = 255;

    // Validate the length of the description
    if (
      createNoteDto.description &&
      createNoteDto.description.length > MAX_DESCRIPTION_LENGTH
    ) {
      throw new BadRequestException('La descripción excede el límite');
    }

    const title = await this.findOneByTitle(createNoteDto.title);
    const description = await this.commentRepository.findOneBy({
      body: createNoteDto.description // check if comment exists
    });
    // If a note with the same title already exists, throw an error
    if (title !== null) {
      throw new BadRequestException('Un apunte con ese título ya existe');
    }
    const article = this.noteRepository.create(createNoteDto);
    const noteCategory = await this.categoryRepository.findOneBy({
      id: createNoteDto.categoryId.id,
      name: createNoteDto.categoryId.name
    });
    if (noteCategory) {
      article.category = noteCategory;
    }
    if (description !== null) {
      // if comment already exists
      article.commentId = description;
    } else {
      // if comment doesn't exist, create a new one
      const comment = this.commentRepository.create({
        body: createNoteDto.description
      });
      const newComment = await this.commentRepository.save(comment);
      article.commentId = newComment;
    }
    const user = await this.userRepository.findOneBy({
      userName: createNoteDto.userAuthor
    });
    article.created_by = user.name;
    // If the user is an admin, set the visibility of the note to true
    article.isVisible = createNoteDto.role === 'admin';
    const newNote = await this.noteRepository.save(article);
    const commentBody = `${user.userName} ha creado un nuevo apunte con el título ${article.title}`;
    const ticketComment = this.commentRepository.create({
      body: commentBody
    });
    const commentId = await this.commentRepository.save(ticketComment);
    const ticket = this.ticketRepository.create({
      itemType: TicketType.NOTE,
      operation: TicketOperation.CREATE,
      status:
        // If the user is an admin, set the status to ACCEPTED; otherwise, set it to PENDING
        createNoteDto.role === 'admin'
          ? TicketStatus.ACCEPTED
          : TicketStatus.PENDING,
      originalNoteId: newNote,
      commentId: commentId
    });
    const savedTicket = await this.ticketRepository.save(ticket);
    // If the ticket is successfully saved and the note is created, send a mail notification
    if (newNote && savedTicket) {
      this.mailerService.sendMail(true, 'create', newNote.title, 'apunte');
      return {
        id: newNote.id,
        categoryId: newNote.category,
        title: newNote.title,
        commentId: newNote.commentId,
        tags: newNote.tags,
        body: newNote.body,
        isVisible: newNote.isVisible
      };
      // throw error if note creation fails
    } else {
      throw new BadRequestException('Error al crear el apunte');
    }
  }

  /*
  Input: None
  Output: Promise<Note[]>
  Return value: Array of all notes
  Function: Retrieves all notes
  Variables: None
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  async findAll() {
    return await this.noteRepository.find();
  }

  /*
  Input: categoryId: string
  Output: Promise<Note[]>
  Return value: Array of notes in the category
  Function: Retrieves all notes in a specific category
  Variables: None
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  async findAllInCategory(categoryId: string) {
    const notes = await this.noteRepository
      .createQueryBuilder('note')
      .leftJoinAndSelect('note.category', 'category')
      .where('category.id = :categoryId', { categoryId })
      .getMany();
    // If no notes are found, return null
    if (notes.length === 0) {
      return null;
    }
    return notes;
  }

  /*
  Input: noteListDto: GetNoteListDto
  Output: Promise<any>
  Return value: List of notes matching criteria
  Function: Gets a list of notes based on filters
  Variables: None
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  async findNoteList(noteListDto: GetNoteListDto) {
    // If both category and tags are provided
    if (noteListDto.category && noteListDto.tags.length > 0) {
      const category = await this.categoryRepository.findOneBy({
        name: noteListDto.category
      });
      const tags = await this.tagRepository
        .createQueryBuilder('tag')
        .where('tag.name IN (:...tags)', {
          tags: noteListDto.tags.map(tag => tag.name)
        })
        .getMany();
      const res = await this.noteRepository
        .createQueryBuilder('note')
        .where('note.categoryId = :categoryId', { categoryId: category.id })
        .andWhere('isVisible = :isVisible', { isVisible: true })
        .leftJoinAndSelect('note.category', 'category')
        .leftJoinAndSelect('note.tags', 'tags')
        .leftJoinAndSelect('note.commentId', 'comment')
        .getMany();
      const sent = [];
      const names = tags.map(tag => tag.name);
      // For every note in the resulting list
      for (const note of res) {
        // For every tag in the note
        for (const tag of note.tags) {
          // If the tag name is in the list of tags provided, add the note to the sent list
          if (names.includes(tag.name)) {
            sent.push(note);
          }
        }
      }
      return sent;
      // If only tags are provided
    } else if (!noteListDto.category && noteListDto.tags.length > 0) {
      const tags = await this.tagRepository
        .createQueryBuilder('tag')
        .where('tag.name IN (:...tags)', {
          tags: noteListDto.tags.map(tag => tag.name)
        })
        .getMany();
      const res = await this.noteRepository
        .createQueryBuilder('note')
        .where('isVisible = :isVisible', { isVisible: true })
        .leftJoinAndSelect('note.category', 'category')
        .leftJoinAndSelect('note.tags', 'tags')
        .leftJoinAndSelect('note.commentId', 'comment')
        .getMany();
      const sent = [];
      const names = tags.map(tag => tag.name);
      // For every note in the resulting list
      for (const note of res) {
        // For every tag in the note
        for (const tag of note.tags) {
          // If the tag name is in the list of tags provided, add the note to the sent list
          if (names.includes(tag.name)) {
            sent.push(note);
          }
        }
      }
      return sent;
      // If only category is provided
    } else if (noteListDto.category && noteListDto.tags.length === 0) {
      const category = await this.categoryRepository.findOneBy({
        name: noteListDto.category
      });
      return await this.noteRepository
        .createQueryBuilder('note')
        .where('note.categoryId = :categoryId', { categoryId: category.id })
        .andWhere('isVisible = :isVisible', { isVisible: true })
        .leftJoinAndSelect('note.category', 'category')
        .leftJoinAndSelect('note.tags', 'tags')
        .leftJoinAndSelect('note.commentId', 'comment')
        .getMany();
      // If no filters are provided, return all visible notes
    } else {
      return this.noteRepository
        .createQueryBuilder('note')
        .where('isVisible = :isVisible', { isVisible: true })
        .leftJoinAndSelect('note.category', 'category')
        .leftJoinAndSelect('note.tags', 'tags')
        .leftJoinAndSelect('note.commentId', 'comment')
        .getMany();
    }
  }

  /*
  Input: id: string
  Output: Promise<Note | null>
  Return value: Note object or null
  Function: Finds a note by id
  Variables: res
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  async findOne(id: string) {
    const note = await this.noteRepository
      .createQueryBuilder('note')
      .leftJoinAndSelect('note.tags', 'tags')
      .leftJoinAndSelect('note.category', 'category')
      .where('note.id = :id', { id })
      .leftJoinAndSelect('note.commentId', 'comment')
      .getOne();
    return note;
  }

  /*
  Input: title: string
  Output: Promise<Note | null>
  Return value: Note object or null
  Function: Finds a note by title
  Variables: None
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  async findOneByTitle(title: string) {
    // return null if title is not provided
    if (!title) {
      return null;
    }
    return await this.noteRepository.findOneBy({ title }); // find the note in the 'note' table by the title
  }

  /*
  Input: id: string, updateNoteDto: UpdateNoteDto
  Output: Promise<any>
  Return value: Updated note object or error
  Function: Updates a note by id
  Variables: None
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  async update(id: string, updateNoteDto: UpdateNoteDto) {
    const { title, tags, role, categoryId, description, ...updateData } =
      updateNoteDto;
    const noteByTitle = await this.noteRepository.findOneBy({ title });
    // If a note with the same title exists and its id is not the same as the one being updated, throw an error
    if (noteByTitle && noteByTitle.id !== id) {
      throw new BadRequestException('El título ya existe');
    }
    // Verify if a note with the provided id exists. If not, throw an error
    const existingNote = await this.noteRepository.findOneBy({ id });
    if (!existingNote) {
      throw new BadRequestException('La nota no existe');
    }
    // Verify that the provided tags exist
    const noteTags = await this.tagRepository
      .createQueryBuilder('tag')
      .where('tag.id IN (:...tagIds)', { tagIds: tags.map(tag => tag.id) })
      .getMany();
    // If the number of tags found does not match the number of tags provided, throw an error
    if (noteTags.length !== tags.length) {
      throw new BadRequestException('Uno o más tags no existen');
    }
    let noteDescription = await this.commentRepository.findOneBy({
      body: description
    });
    // If the description is not provided or does not exist, create a new comment
    if (!noteDescription) {
      noteDescription = await this.commentRepository.save({
        body: description
      });
    }
    // Find the user by username to update the note
    const user = await this.userRepository.findOneBy({
      userName: updateData.userAuthor
    });
    // Find the category associated with the note
    const noteCategory = await this.categoryRepository.findOneBy({
      id: categoryId.id,
      name: categoryId.name
    });
    // If the category does not exist, throw an error
    if (!noteCategory) {
      throw new BadRequestException('La categoría no existe');
    }
    // If the user is an admin, update the note directly; otherwise, create a copy of the note with the updated data
    if (role === 'admin') {
      // Update the properties of the original item directly
      existingNote.title = title || existingNote.title;
      existingNote.body = updateData.body || existingNote.body;
      existingNote.updated_by = user.name;
      existingNote.category = noteCategory;
      existingNote.tags = noteTags;
      existingNote.commentId = noteDescription;

      const savedModifiedNote = await this.noteRepository.save(existingNote);
      // If the note is successfully saved, create a comment and ticket
      if (savedModifiedNote) {
        const commentBody = `${updateData.userAuthor} ha actualizado el apunte con el título ${existingNote.title}`;
        const comment = this.commentRepository.create({
          body: commentBody
        });
        const commentId = await this.commentRepository.save(comment);
        const ticket = this.ticketRepository.create({
          itemType: TicketType.NOTE,
          operation: TicketOperation.UPDATE,
          status: TicketStatus.ACCEPTED,
          originalNoteId: existingNote,
          commentId: commentId
        });
        const savedTicket = await this.ticketRepository.save(ticket);
        // If the ticket is successfully saved, send a mail notification and return the updated note
        if (savedTicket) {
          return savedModifiedNote;
        } else {
          throw new BadRequestException('Error al actualizar el apunte');
        }
      } else {
        throw new BadRequestException('Error al actualizar el apunte');
      }
      // If the user is not an admin, create a copy of the modified note
    } else {
      const modifiedNoteCopy = this.noteRepository.create({
        ...updateData,
        created_at: existingNote.created_at,
        created_by: existingNote.created_by,
        tags: noteTags,
        category: noteCategory,
        title: title,
        updated_by: user.name,
        commentId: noteDescription
      });
      const savedModifiedNote = await this.noteRepository.save(
        modifiedNoteCopy
      );
      // If the modified note is successfully saved, create a comment and ticket
      if (savedModifiedNote) {
        const commentBody = `${updateData.userAuthor} ha actualizado el apunte con el título ${existingNote.title}`;
        const comment = this.commentRepository.create({
          body: commentBody
        });
        const commentId = await this.commentRepository.save(comment);
        const ticket = this.ticketRepository.create({
          itemType: TicketType.NOTE,
          operation: TicketOperation.UPDATE,
          status: TicketStatus.PENDING,
          originalNoteId: existingNote,
          modifiedNoteId: savedModifiedNote,
          commentId: commentId
        });
        const savedTicket = await this.ticketRepository.save(ticket);
        // If the ticket is successfully saved, send a mail notification and return the updated note
        if (savedTicket) {
          this.mailerService.sendMail(
            true,
            'update',
            savedModifiedNote.title,
            'apunte'
          );
          return savedModifiedNote;
        } else {
          throw new BadRequestException('Error al actualizar el apunte');
        }
      }
    }
  }

  /*
  Input: id: string, user: string
  Output: Promise<any>
  Return value: Removed note object or error
  Function: Removes a note by id and user
  Variables: None
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  async remove(id: string, user: string) {
    const note = await this.noteRepository.findOneBy({ id });
    const userId = await this.userRepository
      .createQueryBuilder('user')
      .where('user.id = :userId', { userId: user })
      .leftJoinAndSelect('user.role', 'role')
      .getOne();
    // If the user performing the deletion is an admin, delete the item; otherwise just create a pending ticket
    if (userId.role.role === 'admin') {
      const commentBody = `${userId.userName} ha eliminado el apunte con el título ${note.title}`;
      const comment = this.commentRepository.create({
        body: commentBody
      });
      const commentId = await this.commentRepository.save(comment);
      const ticket = this.ticketRepository.create({
        itemType: TicketType.NOTE,
        operation: TicketOperation.DELETE,
        status: TicketStatus.ACCEPTED,
        originalNoteId: note,
        commentId: commentId
      });
      const savedTicket = await this.ticketRepository.save(ticket);
      // If the ticket is successfully saved, remove the note
      if (savedTicket) {
        return await this.noteRepository.remove(note);
      } else {
        throw new BadRequestException('Error al eliminar el apunte');
      }
      // If the user is not an admin, create a pending ticket
    } else {
      const commentBody = `${userId.userName} ha eliminado el apunte con el título ${note.title}`;
      const comment = this.commentRepository.create({
        body: commentBody
      });
      const commentId = await this.commentRepository.save(comment);
      const ticket = this.ticketRepository.create({
        itemType: TicketType.NOTE,
        operation: TicketOperation.DELETE,
        status: TicketStatus.PENDING,
        originalNoteId: note,
        commentId: commentId
      });
      const savedTicket = await this.ticketRepository.save(ticket);
      // If the ticket is successfully saved, send a mail notification and return the note
      if (savedTicket) {
        this.mailerService.sendMail(true, 'delete', note.title, 'apunte');
        return note;
      } else {
        throw new BadRequestException('Error al eliminar el apunte');
      }
    }
  }

  /*
  Input: query: string
  Output: Promise<Note[]>
  Return value: Array of notes matching the query
  Function: Searches notes by query string
  Variables: None
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  async search(query: string): Promise<Note[]> {
    return this.noteRepository.find({
      where: { title: Like(`%${query}%`) },
      take: 5
    });
  }

  /*
  Input: None
  Output: Promise<number>
  Return value: Count of notes
  Function: Gets the total count of notes
  Variables: None
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  async getCount(): Promise<number> {
    return await this.noteRepository.countBy({ isVisible: true });
  }
}
