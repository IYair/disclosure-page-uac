import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { News } from './entities/news.entity';
import { Repository } from 'typeorm';
import { Like } from 'typeorm';
import {
  Ticket,
  TicketOperation,
  TicketStatus,
  TicketType
} from 'src/ticket/entities/ticket.entity';
import { Comment } from 'src/comment/entities/comment.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class NewsService {
  constructor(
    @InjectRepository(News)
    private readonly newsRepository: Repository<News>,
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}
  async create(createNewsDto: CreateNewsDto) {
    const news = await this.newsRepository.findOneBy({
      title: createNewsDto.title
    });
    if (news !== null) {
      throw new BadRequestException('Una noticia con este título ya existe');
    } else {
      const news = this.newsRepository.create(createNewsDto);
      news.isVisible = true;
      const user = await this.userRepository.findOneBy({
        userName: createNewsDto.userAuthor
      });
      news.created_by = user.name;
      const savedNews = await this.newsRepository.save(news);
      const commentBody = `${user.name} ha creado una nueva noticia con el título ${news.title}`;
      const comment = this.commentRepository.create({
        body: commentBody
      });
      const commentId = await this.commentRepository.save(comment);
      const ticket = this.ticketRepository.create({
        itemType: TicketType.NEWS,
        operation: TicketOperation.CREATE,
        status: TicketStatus.ACCEPTED,
        originalNewsId: news,
        commentId: commentId
      });
      const savedTicket = await this.ticketRepository.save(ticket);
      if (savedNews && savedTicket) {
        return savedNews;
      } else {
        throw new BadRequestException('Error al crear la noticia');
      }
    }
  }

  async findAll() {
    const res = await this.newsRepository
      .createQueryBuilder('news')
      .leftJoinAndSelect('news.imageId', 'image')
      .select(['news', 'image.id'])
      .where('news.isVisible = :isVisible', { isVisible: true })
      .orderBy('news.created_at', 'DESC')
      .getMany();
    return res;
  }

  async findOne(id: string) {
    const res = await this.newsRepository
      .createQueryBuilder('news')
      .leftJoinAndSelect('news.imageId', 'image')
      .select(['news', 'image.id'])
      .where('news.id = :newsId', { newsId: id })
      .getOne();
    return res;
  }

  async update(id: string, updateNewsDto: UpdateNewsDto) {
    const news = await this.newsRepository.findOneBy({ id: id });
    return await this.newsRepository.save({ ...news, ...updateNewsDto });
  }

  async remove(id: string) {
    const news = await this.newsRepository.findOneBy({ id: id });
    return await this.newsRepository.remove(news);
  }

  async search(query: string): Promise<News[]> {
    return this.newsRepository.find({
      where: { title: Like(`%${query}%`) },
      take: 5
    });
  }
}
