import { Module } from '@nestjs/common';
import { NotesService } from './notes.service';
import { NotesController } from './notes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Note } from './entities/note.entity';
import { Category } from '../categories/entities/category.entity';
import { Comment } from '../comment/entities/comment.entity';
import { CommentService } from 'src/comment/comment.service';
import { Tag } from 'src/tags/entities/tag.entity';
import { Ticket } from 'src/ticket/entities/ticket.entity';
import { User } from 'src/users/entities/user.entity';
import { LoggerService } from '../services/logger.service';
import { MailerService } from 'src/mailer/mailer.service';
import { MailerModule } from 'src/mailer/mailer.module';
import { UsersService } from 'src/users/users.service';
import { Role } from 'src/roles/entities/role.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Note,
      Category,
      Comment,
      Ticket,
      User,
      Tag,
      Role
    ]),
    MailerModule
  ],
  controllers: [NotesController],
  providers: [
    NotesService,
    CommentService,
    LoggerService,
    MailerService,
    UsersService
  ],
  exports: [NotesService]
})
export class NotesModule {}
