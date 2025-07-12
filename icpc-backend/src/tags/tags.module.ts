import { Module } from '@nestjs/common';
import { TagsService } from './tags.service';
import { TagsController } from './tags.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tag } from './entities/tag.entity';
import { Comment } from 'src/comment/entities/comment.entity';
import { Ticket } from 'src/ticket/entities/ticket.entity';
import { Note } from 'src/notes/entities/note.entity';
import { Excercise } from 'src/excercises/entities/excercise.entity';
import { LoggerService } from 'src/services/logger.service';

/**
 * TagsModule
 *
 * Handles tag-related features and dependencies.
 *
 * Structure:
 * - Imports: Required modules for tag management.
 * - Providers: Tag service and related providers.
 * - Controllers: Tag API endpoints.
 * - Exports: Tag service for use in other modules.
 *
 * Date: 02 - 06 - 2025
 * Author: Gerardo Omar Rodriguez Ramirez
 */

@Module({
  imports: [TypeOrmModule.forFeature([Tag, Comment, Ticket, Note, Excercise])],
  controllers: [TagsController],
  providers: [TagsService, LoggerService],
  exports: [TagsService]
})
export class TagsModule {}
