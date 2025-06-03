import { Module } from '@nestjs/common';
import { MemoryService } from './memory.service';
import { MemoryController } from './memory.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Memory } from './entities/memory.entity';
import { Excercise } from 'src/excercises/entities/excercise.entity';
import { Comment } from 'src/comment/entities/comment.entity';
import { Ticket } from 'src/ticket/entities/ticket.entity';
import { LoggerService } from 'src/services/logger.service';

/**
 * MemoryModule
 *
 * Handles memory limit features and dependencies for exercises.
 *
 * Structure:
 * - Imports: Required modules for memory management.
 * - Providers: Memory service and related providers.
 * - Controllers: Memory API endpoints.
 * - Exports: Memory service for use in other modules.
 *
 * Date: 02 - 06 - 2025
 * Author: Gerardo Omar Rodriguez Ramirez
 */

@Module({
  imports: [TypeOrmModule.forFeature([Memory, Excercise, Comment, Ticket])],
  controllers: [MemoryController],
  providers: [MemoryService, LoggerService],
  exports: [MemoryService]
})
export class MemoryModule {}
