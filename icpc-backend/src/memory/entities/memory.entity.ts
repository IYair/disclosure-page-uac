import { BaseEntity } from 'src/entities/base.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { Excercise } from 'src/excercises/entities/excercise.entity';

/**
 * Memory Entity
 *
 * Represents a memory limit for exercises in the system.
 *
 * Structure:
 * - Fields: memoryLimit, excercises and those inherited from BaseEntity.
 * - Relations: Excercise.
 *
 * Date: 02 - 06 - 2025
 * Author: Gerardo Omar Rodriguez Ramirez
 */

@Entity()
export class Memory extends BaseEntity {
  @Column({ nullable: false, unique: true })
  memoryLimit: number;

  @OneToMany(() => Excercise, excercise => excercise.memoryId)
  excercises: Excercise[];
}
