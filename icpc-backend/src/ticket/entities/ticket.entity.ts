import { BaseEntity } from 'src/entities/base.entity';
import { Excercise } from 'src/excercises/entities/excercise.entity';
import { News } from 'src/news/entities/news.entity';
import { Note } from 'src/notes/entities/note.entity';
import { Comment } from 'src/comment/entities/comment.entity';
import { Column, Entity, JoinTable, ManyToOne } from 'typeorm';

/**
 * Ticket Entity
 *
 * Represents a moderation or tracking ticket in the system.
 *
 * Structure:
 * - Fields: originalExerciseId, modifiedExerciseId, originalNewsId, modifiedNewsId, originalNoteId, modifiedNoteId, itemType, commentId, status, operation, otherId and those inherited from BaseEntity.
 * - Relations: Comment, Excercise, Note, News.
 *
 * Date: 02 - 06 - 2025
 * Author: Gerardo Omar Rodriguez Ramirez
 */

export enum TicketOperation {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete'
}

export enum TicketType {
  EXERCISE = 'exercise',
  NOTE = 'note',
  NEWS = 'news',
  UTILS = 'utils',
  USER = 'user'
}

export enum TicketStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected'
}

@Entity()
export class Ticket extends BaseEntity {
  @ManyToOne(() => Excercise, excercise => excercise.ticketOriginal, {
    onDelete: 'SET NULL'
  })
  @JoinTable()
  originalExerciseId: Excercise;

  @ManyToOne(() => Excercise, excercise => excercise.ticketModified, {
    onDelete: 'SET NULL'
  })
  @JoinTable()
  modifiedExerciseId: Excercise;

  @ManyToOne(() => News, news => news.ticketOriginal, {
    onDelete: 'SET NULL'
  })
  @JoinTable()
  originalNewsId: News;

  @ManyToOne(() => News, news => news.ticketModified, {
    onDelete: 'SET NULL'
  })
  @JoinTable()
  modifiedNewsId: News;

  @ManyToOne(() => Note, note => note.ticketOriginal, {
    onDelete: 'SET NULL'
  })
  @JoinTable()
  originalNoteId: Note;

  @ManyToOne(() => Note, note => note.ticketModified, {
    onDelete: 'SET NULL'
  })
  @JoinTable()
  modifiedNoteId: Note;

  @Column('enum', { nullable: false, enum: TicketType })
  itemType: TicketType;

  @ManyToOne(() => Comment, comment => comment.tickets)
  commentId: Comment;

  @Column('enum', {
    nullable: false,
    enum: TicketStatus,
    default: TicketStatus.PENDING
  })
  status: TicketStatus;

  @Column('enum', {
    nullable: false,
    enum: TicketOperation,
    default: TicketOperation.CREATE
  })
  operation: TicketOperation;

  @Column({ nullable: true })
  otherId: string;
}
