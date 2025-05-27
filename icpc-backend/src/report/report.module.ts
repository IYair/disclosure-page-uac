import { Module } from '@nestjs/common';
import { ReportService } from './report.service';
import { ReportController } from './report.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { News } from 'src/news/entities/news.entity';
import { Note } from 'src/notes/entities/note.entity';
import { Excercise } from 'src/excercises/entities/excercise.entity';
import { Report } from './entities/report.entity';
import { LoggerService } from 'src/services/logger.service';
import { MailerService } from 'src/mailer/mailer.service';
import { MailerModule } from 'src/mailer/mailer.module';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';
import { Role } from 'src/roles/entities/role.entity';
import { Comment } from 'src/comment/entities/comment.entity';
import { Ticket } from 'src/ticket/entities/ticket.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Report,
      News,
      Note,
      Excercise,
      User,
      Role,
      Comment,
      Ticket
    ]),
    MailerModule
  ],
  controllers: [ReportController],
  providers: [ReportService, LoggerService, MailerService, UsersService],
  exports: [ReportService]
})
export class ReportModule {}
