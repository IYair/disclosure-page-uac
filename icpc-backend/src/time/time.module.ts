/**
 * TimeModule
 *
 * Manages time limit features and dependencies for exercises.
 *
 * Structure:
 * - Imports: Required modules for time management.
 * - Providers: Time service and related providers.
 * - Controllers: Time API endpoints.
 * - Exports: Time service for use in other modules.
 *
 * Date: 02 - 06 - 2025
 * Author: Gerardo Omar Rodriguez Ramirez
 */

import { Module } from '@nestjs/common';
import { TimeService } from './time.service';
import { TimeController } from './time.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Time } from './entities/time.entity';
import { Comment } from 'src/comment/entities/comment.entity';
import { Ticket } from 'src/ticket/entities/ticket.entity';
import { Excercise } from 'src/excercises/entities/excercise.entity';
import { LoggerService } from 'src/services/logger.service';

@Module({
  imports: [TypeOrmModule.forFeature([Time, Comment, Ticket, Excercise])],
  controllers: [TimeController],
  providers: [TimeService, LoggerService],
  exports: [TimeService]
})
export class TimeModule {}
