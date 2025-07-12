import { BaseEntity } from 'src/entities/base.entity';
import { Excercise } from 'src/excercises/entities/excercise.entity';
import { Note } from 'src/notes/entities/note.entity';
import { Column, Entity, ManyToMany } from 'typeorm';

/**
 * Tag Entity
 *
 * Represents a tag for categorizing notes, exercises, etc.
 *
 * Structure:
 * - Fields: name, color, notes, excercises and those inherited from BaseEntity.
 * - Relations: Note, Excercise.
 *
 * Date: 02 - 06 - 2025
 * Author: Gerardo Omar Rodriguez Ramirez
 */

@Entity()
export class Tag extends BaseEntity {
  @Column({ nullable: false, unique: true })
  name: string;

  @Column({ nullable: false, unique: true })
  color: string;

  @ManyToMany(() => Excercise, excercise => excercise.tags)
  excercises: Excercise[];

  @ManyToMany(() => Note, note => note.tags)
  notes: Note[];
}
