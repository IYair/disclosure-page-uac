import { Module } from '@nestjs/common';
import { FactsService } from './facts.service';
import { FactsController } from './facts.controller';

/**
 * FactsModule
 *
 * Handles random fact features and dependencies.
 *
 * Structure:
 * - Imports: Required modules for fact management.
 * - Providers: Facts service and related providers.
 * - Controllers: Facts API endpoints.
 * - Exports: Facts service for use in other modules.
 *
 * Date: 02 - 06 - 2025
 * Author: Gerardo Omar Rodriguez Ramirez
 */

@Module({
  controllers: [FactsController],
  providers: [FactsService]
})
export class FactsModule {}
