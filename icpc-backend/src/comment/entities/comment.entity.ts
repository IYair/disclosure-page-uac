import { BaseEntity } from 'src/entities/base.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class Comment extends BaseEntity {
  @Column({ nullable: false })
  body: string;
}
