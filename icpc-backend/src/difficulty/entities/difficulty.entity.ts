import { BaseEntity } from 'src/entities/base.entity';
import { Excercise } from 'src/excercises/entities/excercise.entity';
import { Column, Entity, OneToMany } from 'typeorm';

/**
 * Difficulty Entity
 *
 * Represents a difficulty level for exercises in the system.
 *
 * Structure:
 * - Fields: name, level, excercises and those inherited from BaseEntity.
 * - Relations: Excercise.
 *
 * Date: 02 - 06 - 2025
 * Author: Gerardo Omar Rodriguez Ramirez
 */

@Entity()
export class Difficulty extends BaseEntity {
  @Column({ nullable: false, unique: true })
  level: number;

  @Column({ nullable: false, unique: true })
  name: string;

  @OneToMany(() => Excercise, excercise => excercise.difficulty)
  excercises: Excercise[];
}
