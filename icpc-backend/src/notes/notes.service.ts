import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Note } from './entities/note.entity';
import { Category } from '../categories/entities/category.entity';
import { Comment } from '../comment/entities/comment.entity';
import { GetNoteListDto } from './dto/get-note-list.dto';
import { Tag } from 'src/tags/entities/tag.entity';

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
    private readonly tagRepository: Repository<Tag>
  ) {}

  async create(createNoteDto: CreateNoteDto) {
    const title = await this.findOneByTitle(createNoteDto.title); // check if title exists
    const description = await this.commentRepository.findOneBy({
      body: createNoteDto.description // check if comment exists
    });
    if (title !== null) {
      throw new BadRequestException('Title already exists'); // throw error if title exists
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
    const newNote = await this.noteRepository.save(article); // save the note object to the database
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
        .getMany();
    } else {
      return this.noteRepository
        .createQueryBuilder('note')
        .where('isVisible = :isVisible', { isVisible: true })
        .leftJoinAndSelect('note.category', 'category')
        .leftJoinAndSelect('note.tags', 'tags')
        .getMany();
    }
  }

  async findOne(id: string) {
    const note = await this.noteRepository
      .createQueryBuilder('note')
      .leftJoinAndSelect('note.tags', 'tags')
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
    const note = await this.noteRepository.findOneBy({ id: String(id) });
    return await this.noteRepository.save({ ...note, ...updateNoteDto });
  }

  async remove(id: string) {
    const note = await this.noteRepository.findOneBy({ id });
    return await this.noteRepository.remove(note);
  }
}
