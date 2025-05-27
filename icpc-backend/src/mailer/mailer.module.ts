import { Module } from '@nestjs/common';
import { MailerModule as NestMailerModule } from '@nestjs-modules/mailer';
import { MailerService } from './mailer.service';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { Role } from 'src/roles/entities/role.entity';
import { Comment } from 'src/comment/entities/comment.entity';
import { Ticket } from 'src/ticket/entities/ticket.entity';

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
