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

  /*
  Input: createNewsDto: CreateNewsDto
  Output: Promise<any>
  Return value: Created news object or error
  Function: Creates a new news item, validates input, creates ticket and sends mail
  Variables: news
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  async create(createNewsDto: CreateNewsDto) {
    const news = await this.newsRepository.findOneBy({
      title: createNewsDto.title
    });
    // Validate that the title is not already used
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
          // If the user is an admin, set status to ACCEPTED, otherwise PENDING
          createNewsDto.role === 'admin'
            ? TicketStatus.ACCEPTED
            : TicketStatus.PENDING,
        originalNewsId: news,
        commentId: commentId
      });
      const savedTicket = await this.ticketRepository.save(ticket);
      // If the ticket is successfully saved, send a mail notification and return the new item
      if (savedNews && savedTicket) {
        if (createNewsDto.role !== 'admin') {
          this.mailerService.sendMail(
            true,
            'create',
            savedNews.title,
            'noticia'
          );
        }
        return savedNews;
      } else {
        throw new BadRequestException('Error al crear la noticia');
      }
    }
  }

  /*
  Input: None
  Output: Promise<News[]>
  Return value: Array of all news
  Function: Retrieves all news with images, ordered by creation date
  Variables: res
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
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

  /*
  Input: id: string
  Output: Promise<News | null>
  Return value: News object or null
  Function: Finds a news item by id with image
  Variables: res
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  async findOne(id: string) {
    const res = await this.newsRepository
      .createQueryBuilder('news')
      .leftJoinAndSelect('news.imageId', 'image')
      .select(['news', 'image.id'])
      .where('news.id = :newsId', { newsId: id })
      .getOne();
    return res;
  }

  /*
  Input: id: string, updateNewsDto: UpdateNewsDto
  Output: Promise<any>
  Return value: Updated news object or error
  Function: Updates a news item by id
  Variables: imageId, role, updateData, existingNews, image, user
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  async update(id: string, updateNewsDto: UpdateNewsDto) {
    const { imageId, role, ...updateData } = updateNewsDto;

    // Verify that the news with the id exists
    const existingNews = await this.newsRepository.findOneBy({ id });
    // If the news does not exist, throw an error
    if (!existingNews) {
      throw new BadRequestException('La noticia no existe');
    }

    // Verify that the image exists
    const image = await this.imageRepository.findOneBy({ id: imageId });
    // If the image does not exist, throw an error
    if (!image) {
      throw new BadRequestException('La imagen no existe');
    }

    const user = await this.userRepository.findOneBy({
      userName: updateData.userAuthor
    });
    // If the user performing the update is an admin
    if (role === 'admin') {
      // Update the properties of the original item directly
      existingNews.title = updateData.title || existingNews.title;
      existingNews.body = updateData.body || existingNews.body;
      existingNews.updated_by = user.id;
      existingNews.imageId = image;

      const savedUpdatedNews = await this.newsRepository.save(existingNews);
      // If the news is successfully updated, create a comment and ticket
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
      // If the user performing the update is not an admin
    } else {
      // Create a copy of the modified news
      const modifiedNewsCopy = this.newsRepository.create({
        ...updateData,
        created_at: existingNews.created_at,
        created_by: existingNews.created_by,
        updated_by: user.id,
        imageId: image,
        isVisible: false
      });
      const savedUpdatedNews = await this.newsRepository.save(modifiedNewsCopy);
      // If the modified news is successfully saved, create a comment and ticket
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
        // If the ticket is successfully saved, send a mail notification and return the new item
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

  /*
  Input: id: string, user: string
  Output: Promise<any>
  Return value: Removed news object or error
  Function: Removes a news item by id and user
  Variables: news, userId
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  async remove(id: string, user: string) {
    const news = await this.newsRepository.findOneBy({ id: id });
    const userId = await this.userRepository
      .createQueryBuilder('user')
      .where('user.id = :userId', { userId: user })
      .leftJoinAndSelect('user.role', 'role')
      .getOne();
    // If the user performing the deletion is an admin, delete the item; otherwise just create a pending ticket
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
      // If the ticket is successfully saved, remove the news item
      if (savedTicket) {
        return await this.newsRepository.remove(news);
      } else {
        throw new BadRequestException('Error al eliminar la noticia');
      }
      // If the user performing the deletion is not an admin, create a pending ticket
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
      // If the ticket is successfully saved, send a mail notification and return the ticket
      if (savedTicket) {
        this.mailerService.sendMail(true, 'delete', news.title, 'noticia');
        return savedTicket;
      }
    }
  }

  /*
  Input: query: string
  Output: Promise<News[]>
  Return value: Array of news matching the query
  Function: Searches news by query string
  Variables: None
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  async search(query: string): Promise<News[]> {
    return this.newsRepository.find({
      where: { title: Like(`%${query}%`) },
      take: 5
    });
  }

  /*
  Input: None
  Output: Promise<number>
  Return value: Count of news
  Function: Gets the total count of news
  Variables: None
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  async getCount(): Promise<number> {
    return await this.newsRepository.countBy({ isVisible: true });
  }

  /*
  Input: newsId: string, imageId: string
  Output: Promise<News>
  Return value: Result of swapping image for news
  Function: Swaps the image of a news item
  Variables: None
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  async swapImage(newsId: string, imageId: string) {
    const news = await this.newsRepository.findOneBy({ id: newsId });
    const image = await this.imageRepository.findOneBy({ id: imageId });
    news.imageId = image;
    return await this.newsRepository.save(news);
  }
}
