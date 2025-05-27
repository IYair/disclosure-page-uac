import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { Report, ItemType } from 'src/report/entities/report.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { News } from 'src/news/entities/news.entity';
import { Note } from 'src/notes/entities/note.entity';
import { Excercise } from 'src/excercises/entities/excercise.entity';
import { MailerService } from 'src/mailer/mailer.service';

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(Report)
    private readonly reportRepository: Repository<Report>,
    @InjectRepository(News)
    private readonly newsRepository: Repository<News>,
    @InjectRepository(Note)
    private readonly noteRepository: Repository<Note>,
    @InjectRepository(Excercise)
    private readonly excerciseRepository: Repository<Excercise>,
    private readonly mailerService: MailerService
  ) {}

  async create(createReportDto: CreateReportDto) {
    const itemId = createReportDto.itemId;
    const itemType = createReportDto.itemType;
    const report = this.reportRepository.create();
    let item;

    // Validar longitud de summary
    if (createReportDto.summary.length > 128) {
      throw new BadRequestException('Summary must not exceed 128 characters');
    }

    switch (itemType) {
      case 'news':
        item = await this.newsRepository
          .createQueryBuilder('news')
          .where('news.id = :id', { id: itemId })
          .leftJoinAndSelect('news.reports', 'reports')
          .getOne();
        report.itemType = ItemType.NEWS;
        report.news = item;
        report.isOpen = true;
        break;
      case 'note':
        item = await this.noteRepository
          .createQueryBuilder('note')
          .where('note.id = :id', { id: itemId })
          .leftJoinAndSelect('note.reports', 'reports')
          .getOne();
        report.itemType = ItemType.NOTE;
        report.note = item;
        report.isOpen = true;
        break;
      case 'exercise':
        item = await this.excerciseRepository
          .createQueryBuilder('excercise')
          .where('excercise.id = :id', { id: itemId })
          .leftJoinAndSelect('excercise.reports', 'reports')
          .getOne();
        report.itemType = ItemType.EXCERCISE;
        report.excercise = item;
        report.isOpen = true;
        break;
      default:
        throw new BadRequestException('Invalid item type');
    }

    if (item !== null) {
      item.reports.push(report);
      report.summary = createReportDto.summary;
      report.report = createReportDto.report;
      const savedReport = await this.reportRepository.save(report);
      this.mailerService.sendMail(
        false,
        'report',
        createReportDto.summary,
        'reporte'
      );
      return {
        id: savedReport.id,
        summary: savedReport.summary,
        report: savedReport.report
      };
    } else {
      throw new BadRequestException('Item not found');
    }
  }

  async findAll() {
    return await this.reportRepository.find();
  }

  async list() {
    return await this.reportRepository.findBy({ isOpen: true });
  }

  async findOne(id: string) {
    return await this.reportRepository
      .createQueryBuilder('report')
      .where('report.id = :id', { id })
      .leftJoinAndSelect('report.news', 'news')
      .leftJoinAndSelect('report.note', 'note')
      .leftJoinAndSelect('report.excercise', 'excercise')
      .getOne();
  }

  async update(id: string, updateReportDto: UpdateReportDto) {
    const report = await this.reportRepository.findOneBy({ id });
    switch (updateReportDto.itemType) {
      case 'news':
        report.news = await this.newsRepository.findOneBy({
          id: updateReportDto.itemId
        });
        report.itemType = ItemType.NEWS;
        break;
      case 'note':
        report.note = await this.noteRepository.findOneBy({
          id: updateReportDto.itemId
        });
        report.itemType = ItemType.NOTE;
        break;
      case 'exercise':
        report.excercise = await this.excerciseRepository.findOneBy({
          id: updateReportDto.itemId
        });
        report.itemType = ItemType.EXCERCISE;
        break;
      default:
        throw new BadRequestException('Invalid item type');
    }
    return await this.reportRepository.save({ ...report });
  }

  async remove(id: string) {
    const report = await this.reportRepository.findOneBy({ id });
    return await this.reportRepository.remove(report);
  }

  async close(id: string) {
    const report = await this.reportRepository.findOneBy({ id });
    report.isOpen = false;
    return await this.reportRepository.save(report);
  }
}
