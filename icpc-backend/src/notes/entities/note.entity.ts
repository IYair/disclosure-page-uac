import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany
} from 'typeorm';
import { BaseEntity } from '../../entities/base.entity';
import { Category } from 'src/categories/entities/category.entity';
import { Comment } from 'src/comment/entities/comment.entity';
import { Tag } from 'src/tags/entities/tag.entity';
import { Ticket } from 'src/ticket/entities/ticket.entity';
import { Report } from 'src/report/entities/report.entity';

@Entity()
export class Note extends BaseEntity {
  @ManyToOne(() => Category, category => category.notes)
  @JoinTable()
  category: Category;

  @Column({ nullable: false })
  title: string;

  @ManyToOne(() => Comment, comment => comment.notes)
  @JoinTable()
  commentId: Comment;

  @ManyToMany(() => Tag, tag => tag.notes)
  @JoinTable()
  tags: Tag[];

  @Column('text', { nullable: false })
  body: string;

  @Column({ nullable: false })
  isVisible: boolean;

  @OneToMany(() => Ticket, ticket => ticket.originalNoteId, {
    onDelete: 'CASCADE'
  })
  ticketOriginal: Ticket[];

  @OneToMany(() => Ticket, ticket => ticket.modifiedNoteId, {
    onDelete: 'CASCADE'
  })
  ticketModified: Ticket[];

  @OneToMany(() => Report, report => report.note, {
    onDelete: 'CASCADE'
  })
  reports: Report[];
}
