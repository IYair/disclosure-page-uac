import { Category } from 'src/categories/entities/category.entity';
import { BaseEntity } from 'src/entities/base.entity';
import { Note } from 'src/notes/entities/note.entity';
import { Ticket } from 'src/ticket/entities/ticket.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity()
export class Comment extends BaseEntity {
  @Column({ nullable: false })
  body: string;

  // un comentario solo puede pertenecer a una categoria
  @OneToMany(() => Category, category => category.comment)
  category: Category[];

  @OneToMany(() => Note, note => note.commentId, { onDelete: 'SET NULL' })
  notes: Note[];

  @OneToMany(() => Ticket, ticket => ticket.commentId)
  tickets: Ticket[];
}
