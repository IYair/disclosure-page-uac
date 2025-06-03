import { Module } from '@nestjs/common';
import { ImageService } from './image.service';
import { ImageController } from './image.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Image } from './entities/image.entity';

/**
 * ImageModule
 *
 * Handles image upload and management features and dependencies.
 *
 * Structure:
 * - Imports: Required modules for image management.
 * - Providers: Image service and related providers.
 * - Controllers: Image API endpoints.
 * - Exports: Image service for use in other modules.
 *
 * Date: 02 - 06 - 2025
 * Author: Gerardo Omar Rodriguez Ramirez
 */

@Module({
  imports: [TypeOrmModule.forFeature([Image])],
  controllers: [ImageController],
  providers: [ImageService],
  exports: [ImageService]
})
export class ImageModule {}
