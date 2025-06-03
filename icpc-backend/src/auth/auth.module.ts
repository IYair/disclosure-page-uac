import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants/jwt.constant';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from 'src/roles/entities/role.entity';
import { User } from 'src/users/entities/user.entity';
import { RolesService } from 'src/roles/roles.service';
import { HttpModule } from '@nestjs/axios';

/**
 * AuthModule
 *
 * Handles authentication features and dependencies.
 *
 * Structure:
 * - Imports: Required modules for authentication.
 * - Providers: Auth service and related providers.
 * - Controllers: Auth API endpoints.
 * - Exports: Auth service for use in other modules.
 *
 * Date: 02 - 06 - 2025
 * Author: Gerardo Omar Rodriguez Ramirez
 */

@Module({
  controllers: [AuthController],
  providers: [AuthService, RolesService],
  exports: [AuthService],
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([User, Role]),
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1d' }
    }),
    HttpModule
  ]
})
export class AuthModule {}
