import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { Category } from 'src/categories/entities/category.entity';

/**
 * CommentModule
 *
 * Handles comment-related features and dependencies.
 *
 * Structure:
 * - Imports: Required modules for comment management.
 * - Providers: Comment service and related providers.
 * - Controllers: Comment API endpoints.
 * - Exports: Comment service for use in other modules.
 *
 * Date: 02 - 06 - 2025
 * Author: Gerardo Omar Rodriguez Ramirez
 */

@Module({
  imports: [TypeOrmModule.forFeature([Comment, Category])],
  controllers: [CommentController],
  providers: [CommentService],
  exports: [CommentService]
})
export class CommentModule {}
