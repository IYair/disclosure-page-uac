import { Injectable } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from './entities/tag.entity';
import { Excercise } from 'src/excercises/entities/excercise.entity';
import { Note } from 'src/notes/entities/note.entity';
import e from 'express';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
    @InjectRepository(Excercise)
    private readonly excerciseRepository: Repository<Excercise>,
    @InjectRepository(Note)
    private readonly noteRepository: Repository<Note>
  ) {}

  async create(createTagDto: CreateTagDto) {
    return await this.tagRepository.save(createTagDto);
  }

  async findAll() {
    return await this.tagRepository
      .createQueryBuilder('tag')
      .orderBy('tag.name', 'ASC')
      .getMany();
  }

  async findOne(id: string) {
    return await this.tagRepository.findOneBy({ id });
  }

  async update(id: string, updateTagDto: UpdateTagDto) {
    const tag = await this.tagRepository.findOneBy({ id });
    return await this.tagRepository.save({ ...tag, ...updateTagDto });
  }

  async remove(id: string) {
    const tag = await this.tagRepository.findOneBy({ id });
    const res = await this.removeTag(tag);
    for (const note of res.notes) {
      await this.noteRepository.save(note);
    }
    for (const exercise of res.exercises) {
      await this.excerciseRepository.save(exercise);
    }
    return await this.tagRepository.remove(tag);
  }

  async removeTag(tag: Tag) {
    try {
      const notes = await this.noteRepository
        .createQueryBuilder('note')
        .leftJoinAndSelect('note.tags', 'tags')
        .getMany();
      const filteredNotes: Note[] = [];
      for (const note of notes) {
        for (const t of note.tags) {
          if (t.id === tag.id) {
            filteredNotes.push(note);
          }
        }
      }
      for (const note of filteredNotes) {
        note.tags = note.tags.filter(t => t.id !== tag.id);
      }

      const exercises = await this.excerciseRepository
        .createQueryBuilder('excercise')
        .leftJoinAndSelect('excercise.tags', 'tags')
        .getMany();
      const filteredExercises: Excercise[] = [];
      for (const exercise of exercises) {
        for (const t of exercise.tags) {
          if (t.id === tag.id) {
            filteredExercises.push(exercise);
          }
        }
      }
      for (const exercise of filteredExercises) {
        exercise.tags = exercise.tags.filter(t => t.id !== tag.id);
      }

      return { exercises: filteredExercises, notes: filteredNotes };
    } catch (e) {
      console.error(e);
      return { exercises: [], notes: [] };
    }
  }
}
