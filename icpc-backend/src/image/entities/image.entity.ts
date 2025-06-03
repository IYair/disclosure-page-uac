import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../entities/base.entity';
import { News } from '../../news/entities/news.entity';

/**
 * Image Entity
 *
 * Represents an image uploaded to the system.
 *
 * Structure:
 * - Fields: assetName, hash, size, mimeType, news and those inherited from BaseEntity.
 * - Relations: News.
 *
 * Date: 02 - 06 - 2025
 * Author: Gerardo Omar Rodriguez Ramirez
 */

@Entity()
export class Image extends BaseEntity {
  @Column({ nullable: false })
  assetName: string;

  @Column({ nullable: false })
  hash: string;

  @Column({ nullable: false })
  mimeType: string;

  @Column({ nullable: false })
  size: number;

  @OneToMany(() => News, news => news.imageId)
  news: News[];
}
