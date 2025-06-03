import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../entities/base.entity';
import { Role } from '../../roles/entities/role.entity';
import { Excercise } from '../../excercises/entities/excercise.entity';

/**
 * User Entity
 *
 * Represents a user in the system, including authentication and profile information.
 *
 * Structure:
 * - Fields: name, lastName, userName, email, password, role, excercises and those inherited from BaseEntity.
 * - Relations: Role, Excercise
 *
 * Date: 02 - 06 - 2025
 * Author: Gerardo Omar Rodriguez Ramirez
 */

@Entity()
export class User extends BaseEntity {
  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  lastName: string;

  @Column({ unique: true, nullable: false })
  userName: string;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ nullable: false })
  password: string;

  @ManyToOne(() => Role, role => role.users)
  role: Role;
  user: Role[];

  @OneToMany(() => Excercise, excercise => excercise.user)
  excercises: Excercise[];
}
