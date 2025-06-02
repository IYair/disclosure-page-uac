import { Module } from '@nestjs/common';
import { Ticket } from './entities/ticket.entity';
import { TicketService } from './ticket.service';
import { TicketController } from './ticket.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Excercise } from 'src/excercises/entities/excercise.entity';
import { Note } from 'src/notes/entities/note.entity';
import { News } from 'src/news/entities/news.entity';
import { Comment } from 'src/comment/entities/comment.entity';
import { Image } from 'src/image/entities/image.entity';
import { LoggerService } from 'src/services/logger.service';

/**
 * TicketModule
 *
 * Handles ticket-related features and dependencies for moderation and tracking.
 *
 * Structure:
 * - Imports: Required modules for ticket management.
 * - Providers: Ticket service and related providers.
 * - Controllers: Ticket API endpoints.
 * - Exports: Ticket service for use in other modules.
 *
 * Date: 02 - 06 - 2025
 * Author: Gerardo Omar Rodriguez Ramirez
 */

@Module({
  imports: [
    TypeOrmModule.forFeature([Ticket, Excercise, Note, News, Comment, Image])
  ],
  controllers: [TicketController],
  providers: [TicketService, LoggerService],
  exports: [TicketService]
})
export class TicketModule {}
