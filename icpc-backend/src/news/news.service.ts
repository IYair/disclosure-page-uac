import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { News } from './entities/news.entity';
import { Image } from '../image/entities/image.entity';
import { Repository, Like } from 'typeorm';
import {
  Ticket,
  TicketOperation,
  TicketStatus,
  TicketType
} from 'src/ticket/entities/ticket.entity';
import { Comment } from 'src/comment/entities/comment.entity';
import { User } from 'src/users/entities/user.entity';
import { MailerService } from 'src/mailer/mailer.service';

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
    private readonly userRepository: Repository<User>,
    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>,
    private readonly mailerService: MailerService
  ) {}
  async create(createNewsDto: CreateNewsDto) {
    const news = await this.newsRepository.findOneBy({
      title: createNewsDto.title
    });
    if (news !== null) {
      throw new BadRequestException('Una noticia con este título ya existe');
    } else {
      const image = await this.imageRepository.findOneBy({
        id: createNewsDto.imageId
      });
      const news = this.newsRepository.create({
        ...createNewsDto,
        imageId: image
      });
      news.isVisible = true;
      const user = await this.userRepository.findOneBy({
        userName: createNewsDto.userAuthor
      });
      news.created_by = user.name;
      const savedNews = await this.newsRepository.save(news);
      const commentBody = `${user.userName} ha creado una nueva noticia con el título ${news.title}`;
      const comment = this.commentRepository.create({
        body: commentBody
      });
      const commentId = await this.commentRepository.save(comment);
      const ticket = this.ticketRepository.create({
        itemType: TicketType.NEWS,
        operation: TicketOperation.CREATE,
        status:
          createNewsDto.role === 'admin'
            ? TicketStatus.ACCEPTED
            : TicketStatus.PENDING,
        originalNewsId: news,
        commentId: commentId
      });
      const savedTicket = await this.ticketRepository.save(ticket);
      if (savedNews && savedTicket) {
        this.mailerService.sendMail(true, 'create', savedNews.title, 'noticia');
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
    const { imageId, role, ...updateData } = updateNewsDto;

    // Verificar si la noticia existe
    const existingNews = await this.newsRepository.findOneBy({ id });
    if (!existingNews) {
      throw new BadRequestException('La noticia no existe');
    }

    // Verificar si la imagen existe
    const image = await this.imageRepository.findOneBy({ id: imageId });
    if (!image) {
      throw new BadRequestException('La imagen no existe');
    }

    const user = await this.userRepository.findOneBy({
      userName: updateData.userAuthor
    });

    if (role === 'admin') {
      // Actualizar directamente las propiedades del ítem original
      existingNews.title = updateData.title || existingNews.title;
      existingNews.body = updateData.body || existingNews.body;
      existingNews.updated_by = user.id;
      existingNews.imageId = image;

      const savedUpdatedNews = await this.newsRepository.save(existingNews);

      if (savedUpdatedNews) {
        const commentBody = `${updateData.userAuthor} ha actualizado la noticia con el título ${existingNews.title}`;
        const comment = this.commentRepository.create({
          body: commentBody
        });
        const commentId = await this.commentRepository.save(comment);
        const ticket = this.ticketRepository.create({
          itemType: TicketType.NEWS,
          operation: TicketOperation.UPDATE,
          status: TicketStatus.ACCEPTED,
          originalNewsId: existingNews,
          commentId: commentId
        });
        const savedTicket = await this.ticketRepository.save(ticket);
        if (savedTicket) {
          return savedUpdatedNews;
        } else {
          throw new BadRequestException('Error al actualizar la noticia');
        }
      }
    } else {
      // Crear una copia de la noticia modificada
      const modifiedNewsCopy = this.newsRepository.create({
        ...updateData,
        created_at: existingNews.created_at,
        created_by: existingNews.created_by,
        updated_by: user.id,
        imageId: image,
        isVisible: false
      });
      const savedUpdatedNews = await this.newsRepository.save(modifiedNewsCopy);

      if (savedUpdatedNews) {
        const commentBody = `${updateData.userAuthor} ha actualizado la noticia con el título ${existingNews.title}`;
        const comment = this.commentRepository.create({
          body: commentBody
        });
        const commentId = await this.commentRepository.save(comment);
        const ticket = this.ticketRepository.create({
          itemType: TicketType.NEWS,
          operation: TicketOperation.UPDATE,
          status: TicketStatus.PENDING,
          originalNewsId: existingNews,
          modifiedNewsId: savedUpdatedNews,
          commentId: commentId
        });
        const savedTicket = await this.ticketRepository.save(ticket);
        if (savedTicket) {
          this.mailerService.sendMail(
            true,
            'update',
            savedUpdatedNews.title,
            'noticia'
          );
          return savedUpdatedNews;
        } else {
          throw new BadRequestException('Error al actualizar la noticia');
        }
      }
    }
  }

  async remove(id: string, user: string) {
    const news = await this.newsRepository.findOneBy({ id: id });
    const userId = await this.userRepository
      .createQueryBuilder('user')
      .where('user.id = :userId', { userId: user })
      .leftJoinAndSelect('user.role', 'role')
      .getOne();
    if (userId.role.role === 'admin') {
      const commentBody = `${userId.userName} ha eliminado la noticia con el título ${news.title}`;
      const comment = this.commentRepository.create({
        body: commentBody
      });
      const commentId = await this.commentRepository.save(comment);
      const ticket = this.ticketRepository.create({
        itemType: TicketType.NEWS,
        operation: TicketOperation.DELETE,
        status: TicketStatus.ACCEPTED,
        originalNewsId: news,
        commentId: commentId
      });
      const savedTicket = await this.ticketRepository.save(ticket);
      if (savedTicket) {
        return await this.newsRepository.remove(news);
      } else {
        throw new BadRequestException('Error al eliminar la noticia');
      }
    } else {
      const commentBody = `${userId.userName} ha eliminado la noticia con el título ${news.title}`;
      const comment = this.commentRepository.create({
        body: commentBody
      });
      const commentId = await this.commentRepository.save(comment);
      const ticket = this.ticketRepository.create({
        itemType: TicketType.NEWS,
        operation: TicketOperation.DELETE,
        status: TicketStatus.PENDING,
        originalNewsId: news,
        commentId: commentId
      });
      const savedTicket = await this.ticketRepository.save(ticket);
      if (savedTicket) {
        this.mailerService.sendMail(true, 'delete', news.title, 'noticia');
        return savedTicket;
      }
    }
  }

  async search(query: string): Promise<News[]> {
    return this.newsRepository.find({
      where: { title: Like(`%${query}%`) },
      take: 5
    });
  }

  async getCount(): Promise<number> {
    return await this.newsRepository.countBy({ isVisible: true });
  }

  async swapImage(newsId: string, imageId: string) {
    const news = await this.newsRepository.findOneBy({ id: newsId });
    const image = await this.imageRepository.findOneBy({ id: imageId });
    news.imageId = image;
    return await this.newsRepository.save(news);
  }
}
