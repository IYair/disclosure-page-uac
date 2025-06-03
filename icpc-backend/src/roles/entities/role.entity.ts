import { Column, Entity, OneToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { BaseEntity } from '../../entities/base.entity';
import { RoleEnum } from '../../common/enums/role.enum';
/**
 * Role Entity
 *
 * Represents a user role in the system (e.g., admin, user).
 *
 * Structure:
 * - Fields: role, users and those inherited from BaseEntity.
 * - Relations: User.
 *
 * Date: 02 - 06 - 2025
 * Author: Gerardo Omar Rodriguez Ramirez
 */

@Entity()
export class Role extends BaseEntity {
  @Column({
    type: 'enum',
    enum: RoleEnum,
    default: RoleEnum.USER
  })
  role: RoleEnum;

  @OneToMany(() => User, user => user.role)
  users: User[];
}
