import { Module } from '@nestjs/common';
import { MailerModule as NestMailerModule } from '@nestjs-modules/mailer';
import { MailerService } from './mailer.service';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from 'src/roles/entities/role.entity';
import { Comment } from 'src/comment/entities/comment.entity';
import { Ticket } from 'src/ticket/entities/ticket.entity';

/**
 * MailerModule
 *
 * Handles email notification features and dependencies.
 *
 * Structure:
 * - Imports: Required modules for mailer integration.
 * - Providers: Mailer service and related providers.
 * - Exports: Mailer service for use in other modules.
 *
 * Date: 02 - 06 - 2025
 * Author: Gerardo Omar Rodriguez Ramirez
 */

@Module({
  imports: [
    NestMailerModule.forRootAsync({
      useFactory: () => ({
        transport: {
          service: 'gmail',
          auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASSWORD
          }
        }
      })
    }),
    TypeOrmModule.forFeature([User, Role, Comment, Ticket])
  ],
  providers: [MailerService, UsersService],
  controllers: []
})
export class MailerModule {}
