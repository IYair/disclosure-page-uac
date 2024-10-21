import { Module } from '@nestjs/common';
import { TagsService } from './tags.service';
import { TagsController } from './tags.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tag } from './entities/tag.entity';
import { Note } from 'src/notes/entities/note.entity';
import { Excercise } from 'src/excercises/entities/excercise.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Tag, Note, Excercise])],
  controllers: [TagsController],
  providers: [TagsService],
  exports: [TagsService]
})
export class TagsModule {}
