import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Excercise } from 'src/excercises/entities/excercise.entity';
import { Category } from './entities/category.entity';
import { Comment } from 'src/comment/entities/comment.entity';
import { Ticket } from 'src/ticket/entities/ticket.entity';
import { Note } from 'src/notes/entities/note.entity';
import { LoggerService } from 'src/services/logger.service';

/**
 * CategoriesModule
 *
 * Handles category-related features and dependencies.
 *
 * Structure:
 * - Imports: Required modules for category management.
 * - Providers: Category service and related providers.
 * - Controllers: Category API endpoints.
 * - Exports: Category service for use in other modules.
 *
 * Date: 02 - 06 - 2025
 * Author: Gerardo Omar Rodriguez Ramirez
 */

@Module({
  imports: [
    TypeOrmModule.forFeature([Category, Excercise, Comment, Ticket, Note])
  ],
  controllers: [CategoriesController],
  providers: [CategoriesService, LoggerService],
  exports: [CategoriesService]
})
export class CategoriesModule {}
