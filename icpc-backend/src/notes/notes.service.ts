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

  async create(createNoteDto: CreateNoteDto) {
    const MAX_DESCRIPTION_LENGTH = 255;

    // Validar la longitud de la descripción
    if (
      createNoteDto.description &&
      createNoteDto.description.length > MAX_DESCRIPTION_LENGTH
    ) {
      throw new BadRequestException('La descripción excede el límite');
    }

    const title = await this.findOneByTitle(createNoteDto.title); // check if title exists
    const description = await this.commentRepository.findOneBy({
      body: createNoteDto.description // check if comment exists
    });
    if (title !== null) {
      throw new BadRequestException('Un apunte con ese título ya existe'); // throw error if title exists
    }
    const article = this.noteRepository.create(createNoteDto); // create note object
    const noteCategory = await this.categoryRepository.findOneBy({
      id: createNoteDto.categoryId.id,
      name: createNoteDto.categoryId.name
      // find the note's category in the 'category' table by the note's category id
    });
    if (noteCategory) {
      article.category = noteCategory; // assign the note's category to the note object
    }
    if (description !== null) {
      // if comment already exists
      article.commentId = description; // assign the comment to the note object
    } else {
      // if comment doesn't exist
      const comment = this.commentRepository.create({
        body: createNoteDto.description
      }); // pass the 'body' property as a string
      const newComment = await this.commentRepository.save(comment); // save the comment object to the database if it doesn't exist
      article.commentId = newComment; // assign the comment to the note object
    }
    const user = await this.userRepository.findOneBy({
      userName: createNoteDto.userAuthor
    });
    article.created_by = user.name; // assign the user's name to the note object
    article.isVisible = createNoteDto.role === 'admin'; // if the author is an admin, the note is visible
    const newNote = await this.noteRepository.save(article); // save the note object to the database
    const commentBody = `${user.userName} ha creado un nuevo apunte con el título ${article.title}`;
    const ticketComment = this.commentRepository.create({
      body: commentBody
    });
    const commentId = await this.commentRepository.save(ticketComment); // save the comment object to the database
    const ticket = this.ticketRepository.create({
      itemType: TicketType.NOTE,
      operation: TicketOperation.CREATE,
      status:
        createNoteDto.role === 'admin'
          ? TicketStatus.ACCEPTED
          : TicketStatus.PENDING,
      originalNoteId: newNote,
      commentId: commentId
    });
    const savedTicket = await this.ticketRepository.save(ticket); // save the ticket object to the database
    if (newNote && savedTicket) {
      this.mailerService.sendMail(true, 'create', newNote.title, 'apunte');
      return {
        // return the note object
        id: newNote.id,
        categoryId: newNote.category,
        title: newNote.title,
        commentId: newNote.commentId,
        tags: newNote.tags,
        body: newNote.body,
        isVisible: newNote.isVisible
      };
    } else {
      throw new BadRequestException('Error al crear el apunte'); // throw error if note creation fails
    }
  }

  async findAll() {
    return await this.noteRepository.find();
  }

  async findAllInCategory(categoryId: string) {
    const notes = await this.noteRepository
      .createQueryBuilder('note')
      .leftJoinAndSelect('note.category', 'category')
      .where('category.id = :categoryId', { categoryId })
      .getMany();
    if (notes.length === 0) {
      return null;
    }
    return notes;
  }

  async findNoteList(noteListDto: GetNoteListDto) {
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
      for (const note of res) {
        for (const tag of note.tags) {
          if (names.includes(tag.name)) {
            sent.push(note);
          }
        }
      }
      return sent;
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
      for (const note of res) {
        for (const tag of note.tags) {
          if (names.includes(tag.name)) {
            sent.push(note);
          }
        }
      }
      return sent;
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

  async findOneByTitle(title: string) {
    if (!title) {
      return null; // return null if title is not provided
    }
    return await this.noteRepository.findOneBy({ title }); // find the note in the 'note' table by the title
  }

  async update(id: string, updateNoteDto: UpdateNoteDto) {
    const { title, tags, role, categoryId, description, ...updateData } =
      updateNoteDto;
    const noteByTitle = await this.noteRepository.findOneBy({ title });
    if (noteByTitle && noteByTitle.id !== id) {
      throw new BadRequestException('El título ya existe'); // throw error if title exists
    }
    // Verificar si la nota existe
    const existingNote = await this.noteRepository.findOneBy({ id });
    if (!existingNote) {
      throw new BadRequestException('La nota no existe');
    }
    // Verificar si los tags existen
    const noteTags = await this.tagRepository
      .createQueryBuilder('tag')
      .where('tag.id IN (:...tagIds)', { tagIds: tags.map(tag => tag.id) })
      .getMany();
    if (noteTags.length !== tags.length) {
      throw new BadRequestException('Uno o más tags no existen');
    }
    let noteDescription = await this.commentRepository.findOneBy({
      body: description
    });
    if (!noteDescription) {
      noteDescription = await this.commentRepository.save({
        body: description
      });
    }

    const user = await this.userRepository.findOneBy({
      userName: updateData.userAuthor
    });
    const noteCategory = await this.categoryRepository.findOneBy({
      id: categoryId.id,
      name: categoryId.name
    });
    if (!noteCategory) {
      throw new BadRequestException('La categoría no existe');
    }

    if (role === 'admin') {
      // Actualizar directamente las propiedades del ítem original
      existingNote.title = title || existingNote.title;
      existingNote.body = updateData.body || existingNote.body;
      existingNote.updated_by = user.name;
      existingNote.category = noteCategory;
      existingNote.tags = noteTags;
      existingNote.commentId = noteDescription;

      const savedModifiedNote = await this.noteRepository.save(existingNote);

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
        if (savedTicket) {
          return savedModifiedNote;
        } else {
          throw new BadRequestException('Error al actualizar el apunte');
        }
      } else {
        throw new BadRequestException('Error al actualizar el apunte');
      }
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

  async remove(id: string, user: string) {
    const note = await this.noteRepository.findOneBy({ id });
    const userId = await this.userRepository
      .createQueryBuilder('user')
      .where('user.id = :userId', { userId: user })
      .leftJoinAndSelect('user.role', 'role')
      .getOne();
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
      if (savedTicket) {
        return await this.noteRepository.remove(note);
      } else {
        throw new BadRequestException('Error al eliminar el apunte');
      }
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
      if (savedTicket) {
        this.mailerService.sendMail(true, 'delete', note.title, 'apunte');
        return note;
      } else {
        throw new BadRequestException('Error al eliminar el apunte');
      }
    }
  }

  async search(query: string): Promise<Note[]> {
    return this.noteRepository.find({
      where: { title: Like(`%${query}%`) },
      take: 5
    });
  }

  async getCount(): Promise<number> {
    return await this.noteRepository.countBy({ isVisible: true });
  }
}
