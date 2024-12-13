import { Module } from '@nestjs/common';
import { ExcercisesService } from './excercises.service';
import { ExcercisesController } from './excercises.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Excercise } from './entities/excercise.entity';
import { Category } from 'src/categories/entities/category.entity';
import { Tag } from 'src/tags/entities/tag.entity';
import { Difficulty } from 'src/difficulty/entities/difficulty.entity';
import { Time } from 'src/time/entities/time.entity';
import { Memory } from 'src/memory/entities/memory.entity';
import { Ticket } from 'src/ticket/entities/ticket.entity';
import { User } from 'src/users/entities/user.entity';
import { Comment } from 'src/comment/entities/comment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Excercise,
      Category,
      Tag,
      Difficulty,
      Time,
      Memory,
      Ticket,
      User,
      Comment
    ])
  ],
  controllers: [ExcercisesController],
  providers: [ExcercisesService],
  exports: [ExcercisesService]
})
export class ExcercisesModule {}