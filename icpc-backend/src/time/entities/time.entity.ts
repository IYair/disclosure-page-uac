import { BaseEntity } from 'src/entities/base.entity';
import { Excercise } from 'src/excercises/entities/excercise.entity';
import { Column, Entity, OneToMany } from 'typeorm';

/**
 * Time Entity
 *
 * Represents a time limit for exercises in the system.
 *
 * Structure:
 * - Fields: timeLimit, excercises and those inherited from BaseEntity.
 * - Relations: Excercise.
 *
 * Date: 02 - 06 - 2025
 * Author: Gerardo Omar Rodriguez Ramirez
 */

@Entity()
export class Time extends BaseEntity {
  @Column({ nullable: false, unique: true })
  timeLimit: number;

  @OneToMany(() => Excercise, excercise => excercise.time)
  excercises: Excercise[];
}
