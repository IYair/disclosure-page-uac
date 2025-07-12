import { Category } from 'src/categories/entities/category.entity';
import { BaseEntity } from 'src/entities/base.entity';
import { Note } from 'src/notes/entities/note.entity';
import { Ticket } from 'src/ticket/entities/ticket.entity';
import { Column, Entity, OneToMany } from 'typeorm';

/**
 * Comment Entity
 *
 * Represents a comment in the system, used for notes, tickets, etc.
 *
 * Structure:
 * - Fields: body, category, notes, tickets and those inherited from BaseEntity.
 * - Relations: Category, Note, Ticket.
 *
 * Date: 02 - 06 - 2025
 * Author: Gerardo Omar Rodriguez Ramirez
 */
@Entity()
export class Comment extends BaseEntity {
  @Column({ nullable: false })
  body: string;

  @OneToMany(() => Category, category => category.comment)
  category: Category[];

  @OneToMany(() => Note, note => note.commentId, { onDelete: 'SET NULL' })
  notes: Note[];

  @OneToMany(() => Ticket, ticket => ticket.commentId)
  tickets: Ticket[];
}
