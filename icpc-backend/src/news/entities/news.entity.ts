import { BaseEntity } from 'src/entities/base.entity';
import { Column, Entity, JoinTable, ManyToOne, OneToMany } from 'typeorm';
import { Image } from 'src/image/entities/image.entity';
import { Ticket } from 'src/ticket/entities/ticket.entity';
import { Report } from 'src/report/entities/report.entity';

/**
 * News Entity
 *
 * Represents a news item in the system.
 *
 * Structure:
 * - Fields: title, body, isVisible, imageId, ticketOriginal, ticketModified, reports and those inherited from BaseEntity.
 * - Relations: Image, Ticket, Report.
 *
 * Date: 02 - 06 - 2025
 * Author: Gerardo Omar Rodriguez Ramirez
 */

@Entity()
export class News extends BaseEntity {
  @Column({ nullable: false })
  title: string;

  @Column('text', { nullable: false })
  body: string;

  @Column({ nullable: false })
  isVisible: boolean;

  @ManyToOne(() => Image, image => image.news)
  @JoinTable()
  imageId: Image;

  @OneToMany(() => Ticket, ticket => ticket.originalNewsId, {
    onDelete: 'CASCADE'
  })
  ticketOriginal: Ticket[];

  @OneToMany(() => Ticket, ticket => ticket.modifiedNewsId, {
    onDelete: 'CASCADE'
  })
  ticketModified: Ticket[];

  @OneToMany(() => Report, report => report.news, {
    onDelete: 'CASCADE'
  })
  reports: Report[];
}
