import { Module } from '@nestjs/common';
import { DifficultyService } from './difficulty.service';
import { DifficultyController } from './difficulty.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Difficulty } from './entities/difficulty.entity';
import { Comment } from 'src/comment/entities/comment.entity';
import { Ticket } from 'src/ticket/entities/ticket.entity';
import { Excercise } from 'src/excercises/entities/excercise.entity';
import { LoggerService } from 'src/services/logger.service';

/**
 * DifficultyModule
 *
 * Handles difficulty level features and dependencies for exercises.
 *
 * Structure:
 * - Imports: Required modules for difficulty management.
 * - Providers: Difficulty service and related providers.
 * - Controllers: Difficulty API endpoints.
 * - Exports: Difficulty service for use in other modules.
 *
 * Date: 02 - 06 - 2025
 * Author: Gerardo Omar Rodriguez Ramirez
 */

@Module({
  imports: [TypeOrmModule.forFeature([Difficulty, Comment, Ticket, Excercise])],
  controllers: [DifficultyController],
  providers: [DifficultyService, LoggerService],
  exports: [DifficultyService]
})
export class DifficultyModule {}
