import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { Comment } from '../comment/entities/comment.entity';
import {
  Ticket,
  TicketOperation,
  TicketStatus,
  TicketType
} from 'src/ticket/entities/ticket.entity';
import { Note } from 'src/notes/entities/note.entity';
import { Excercise } from 'src/excercises/entities/excercise.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
    @InjectRepository(Note)
    private readonly notesRepository: Repository<Note>,
    @InjectRepository(Excercise)
    private readonly excerciseRepository: Repository<Excercise>
  ) {}

  /*
  Input: createCategoryDto: CreateCategoryDto
  Output: Promise<any>
  Return value: Created category object or error
  Function: Creates a new category, validates input, creates comment and ticket
  Variables: trimmedName, name, comment, newCategory, ticketCommentBody, ticketComment, ticketCommentId, ticket, savedTicket
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  async create(createCategoryDto: CreateCategoryDto) {
    const trimmedName = createCategoryDto.name.trim();
    // If the trimmed string is empty, throw an error
    if (trimmedName.length === 0) {
      throw new BadRequestException(
        'El nombre de la categoría no puede estar vacío o contener solo espacios.'
      );
    }
    // If the trimmed string exceeds 255 characters, throw an error
    if (trimmedName.length > 255) {
      throw new BadRequestException(
        'El nombre de la categoría no puede exceder los 255 caracteres.'
      );
    }

    const name = await this.findOneByName(trimmedName);
    // If a category with the same name already exists, throw an error
    if (name !== null) {
      throw new BadRequestException('Esa categoría ya existe');
    }

    let comment = await this.commentRepository.findOneBy({
      body: createCategoryDto.commentId
    });
    // If no comment is found, create a new one
    comment ??= this.commentRepository.create({
      body: createCategoryDto.commentId
    });

    const newCategory = this.categoryRepository.create({
      ...createCategoryDto,
      name: trimmedName
    });
    newCategory.comment = comment;
    const category = await this.categoryRepository.save(newCategory);
    const ticketCommentBody = `La categoría ${category.name} ha sido creada`;
    const ticketComment = this.commentRepository.create({
      body: ticketCommentBody
    });
    const ticketCommentId = await this.commentRepository.save(ticketComment);
    const ticket = this.ticketRepository.create({
      otherId: category.id,
      operation: TicketOperation.CREATE,
      status: TicketStatus.ACCEPTED,
      itemType: TicketType.UTILS,
      commentId: ticketCommentId
    });
    const savedTicket = await this.ticketRepository.save(ticket);
    // If the category and ticket are successfully saved, return the category details
    // Otherwise, throw an error
    if (category && savedTicket) {
      return {
        id: category.id,
        name: category.name,
        commentId: comment
      };
    } else {
      throw new BadRequestException('Error al crear la categoría');
    }
  }

  /*
  Input: None
  Output: Promise<Category[]>
  Return value: Array of all categories
  Function: Retrieves all categories ordered by name
  Variables: None
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  async findAll() {
    return await this.categoryRepository
      .createQueryBuilder('category')
      .orderBy('category.name', 'ASC')
      .getMany();
  }

  /*
  Input: id: string
  Output: Promise<Category | null>
  Return value: Category object or null
  Function: Finds a category by id
  Variables: None
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  async findOne(id: string) {
    return await this.categoryRepository.findOneBy({ id });
  }

  /*
  Input: name: string
  Output: Promise<Category | null>
  Return value: Category object or null
  Function: Finds a category by name
  Variables: category
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  async findOneByName(name: string) {
    // If no name is provided, return null
    if (!name) {
      return null;
    }
    const category = await this.categoryRepository
      .createQueryBuilder('category')
      .leftJoinAndSelect('comment', 'comment')
      .where('category.name = :name', { name })
      .getMany();
    // If no category is found, return null
    if (category.length === 0) {
      return null;
    }
    return category[0];
  }

  /*
  Input: id: string, updateCategoryDto: UpdateCategoryDto
  Output: Promise<any>
  Return value: Updated category object or error
  Function: Updates a category by id
  Variables: trimmedName
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const trimmedName = updateCategoryDto.name.trim();
    // If the trimmed string is empty, throw an error
    if (trimmedName.length === 0) {
      throw new BadRequestException(
        'El nombre de la categoría no puede estar vacío o contener solo espacios.'
      );
    }
    // If the trimmed string exceeds 255 characters, throw an error
    if (trimmedName.length > 255) {
      throw new BadRequestException(
        'El nombre de la categoría no puede exceder los 255 caracteres.'
      );
    }

    const category = await this.categoryRepository.findOneBy({ id });
    const existingCategory = await this.findOneByName(trimmedName);
    // If a category with the same name already exists and it's not the current category, throw an error
    if (existingCategory !== null && existingCategory.id !== id) {
      throw new BadRequestException('Esa categoría ya existe');
    }

    const savedCategory = await this.categoryRepository.save({
      ...category,
      ...updateCategoryDto,
      name: trimmedName
    });
    // If the category is successfully saved, create a comment and ticket
    if (savedCategory) {
      const ticketCommentBody = `La categoría ${savedCategory.name} ha sido actualizada`;
      const comment = this.commentRepository.create({
        body: ticketCommentBody
      });
      const savedComment = await this.commentRepository.save(comment);
      const ticket = this.ticketRepository.create({
        otherId: savedCategory.id,
        operation: TicketOperation.UPDATE,
        status: TicketStatus.ACCEPTED,
        itemType: TicketType.UTILS,
        commentId: savedComment
      });
      const savedTicket = await this.ticketRepository.save(ticket);
      // If the comment and ticket are successfully saved, return the updated category
      if (savedComment && savedTicket) {
        return savedCategory;
      }
    }
  }

  /*
  Input: id: string
  Output: Promise<any>
  Return value: Removed category object or error
  Function: Removes a category by id
  Variables: None
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  async remove(id: string) {
    const category = await this.categoryRepository
      .createQueryBuilder('category')
      .leftJoinAndSelect('category.excercises', 'excercises')
      .leftJoinAndSelect('category.notes', 'notes')
      .where('category.id = :id', { id })
      .getOne();
    const ticketCommentBody = `La categoría ${category.name} ha sido eliminada`;
    const ticketComment = this.commentRepository.create({
      body: ticketCommentBody
    });
    const ticketCommentId = await this.commentRepository.save(ticketComment);
    const ticket = this.ticketRepository.create({
      operation: TicketOperation.DELETE,
      status: TicketStatus.ACCEPTED,
      itemType: TicketType.UTILS,
      commentId: ticketCommentId
    });
    const savedTicket = await this.ticketRepository.save(ticket);
    const categories = await this.categoryRepository.find({});
    let pivot = categories[0];
    // If there is only one category, throw an error
    if (pivot.id === category.id) {
      pivot = categories[1];
    }
    // If a ticket is successfully saved, reassign exercises and notes to a pivot category
    if (savedTicket) {
      // If there is only one category, throw an error
      if (categories.length === 1) {
        throw new BadRequestException(
          'No se puede eliminar la única categoría'
        );
      } else {
        // Reassign exercises and notes to the pivot category
        if (category.excercises.length > 0) {
          for (const exercise of category.excercises) {
            exercise.category = pivot;
            await this.excerciseRepository.save(exercise);
          }
        }
        // If the category has notes, reassign them to the pivot category
        if (category.notes.length > 0) {
          // For every note, reassign its category to the pivot category
          for (const note of category.notes) {
            note.category = pivot;
            await this.notesRepository.save(note);
          }
        }
        return await this.categoryRepository.remove(category);
      }
    }
  }
}
