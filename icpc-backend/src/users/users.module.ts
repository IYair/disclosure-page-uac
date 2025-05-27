import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Role } from 'src/roles/entities/role.entity';
import { Comment } from 'src/comment/entities/comment.entity';
import { Ticket } from 'src/ticket/entities/ticket.entity';
import { LoggerService } from 'src/services/logger.service';
import { MailerService } from 'src/mailer/mailer.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role, Comment, Ticket])],
  controllers: [UsersController],
  providers: [UsersService, LoggerService],
  exports: [UsersService]
})
export class UsersModule {}
