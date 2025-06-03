import { Excercise } from 'src/excercises/entities/excercise.entity';
import { BaseEntity } from '../../entities/base.entity';
import { Column, Entity, JoinTable, ManyToOne, OneToMany } from 'typeorm';
import { Comment } from 'src/comment/entities/comment.entity';
import { Note } from 'src/notes/entities/note.entity';

/**
 * Category Entity
 *
 * Represents a category for notes, exercises, etc.
 *
 * Structure:
 * - Fields: name and those inherited from BaseEntity.
 * - Relations: Note, Excercise, Comment.
 *
 * Date: 02 - 06 - 2025
 * Author: Gerardo Omar Rodriguez Ramirez
 */

@Entity()
export class Category extends BaseEntity {
  @Column({ nullable: false })
  name: string;

  @OneToMany(() => Excercise, excercise => excercise.category)
  excercises: Excercise[];

  @OneToMany(() => Note, note => note.category)
  notes: Note[];

  // una categoria puede tener solo un comentario
  @ManyToOne(() => Comment, comment => comment.category)
  @JoinTable()
  comment: Comment;
}
