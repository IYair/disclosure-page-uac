import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Column
} from 'typeorm';

/**
 * Base Entity
 *
 * Provides common fields for all entities (e.g., id, timestamps).
 *
 * Structure:
 * - Fields: id, created_at, created_by, updated_at, updated_by, deleted_at, deleted_by.
 * - Relations: None (this is a base entity).
 * - Decorators: TypeORM entity and column decorators.
 *
 * Date: 02 - 06 - 2025
 * Author: Gerardo Omar Rodriguez Ramirez
 */

export class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  created_at: Date;

  @Column({ name: 'created_by', default: null, nullable: true })
  created_by: string;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updated_at: Date;

  @Column({ name: 'updated_by', default: null, nullable: true })
  updated_by: string;

  @DeleteDateColumn({ type: 'timestamp', name: 'deleted_at' })
  deleted_at: Date;

  @Column({ name: 'deleted_by', default: null, nullable: true })
  deleted_by: string;
}
