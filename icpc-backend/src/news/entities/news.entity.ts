import { BaseEntity } from 'src/entities/base.entity';
import { Column, Entity, JoinTable, ManyToOne, OneToMany } from 'typeorm';
import { Image } from 'src/image/entities/image.entity';
import { Ticket } from 'src/ticket/entities/ticket.entity';
import { Report } from 'src/report/entities/report.entity';

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
  imageId: string;

  @OneToMany(() => Ticket, ticket => ticket.originalNoteId, {
    onDelete: 'CASCADE'
  })
  ticketOriginal: Ticket[];

  @OneToMany(() => Ticket, ticket => ticket.modifiedNoteId, {
    onDelete: 'CASCADE'
  })
  ticketModified: Ticket[];

  @OneToMany(() => Report, report => report.news, {
    onDelete: 'CASCADE'
  })
  reports: Report[];
}
