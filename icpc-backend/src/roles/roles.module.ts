import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';

/**
 * RolesModule
 *
 * Handles role-related features and dependencies.
 *
 * Structure:
 * - Imports: Required modules for role management.
 * - Providers: Role service and related providers.
 * - Controllers: Role API endpoints.
 * - Exports: Role service for use in other modules.
 *
 * Date: 02 - 06 - 2025
 * Author: Gerardo Omar Rodriguez Ramirez
 */

@Module({
  imports: [TypeOrmModule.forFeature([Role])],
  controllers: [RolesController],
  providers: [RolesService],
  exports: [RolesService]
})
export class RolesModule {}
