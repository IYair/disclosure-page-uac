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

  /*
  Input: createReportDto: CreateReportDto
  Output: Promise<any>
  Return value: Created report object or error
  Function: Creates a new report, validates input, creates ticket and sends mail
  Variables: itemId, itemType, report, item, savedReport
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  async create(createReportDto: CreateReportDto) {
    const itemId = createReportDto.itemId;
    const itemType = createReportDto.itemType;
    const report = this.reportRepository.create();
    let item;

    // Validate the length of the report's summary
    if (createReportDto.summary.length > 128) {
      throw new BadRequestException('Summary must not exceed 128 characters');
    }
    // Create the report with the correct item type
    switch (itemType) {
      // If it's a report on a news article, fetch the news item and store the reference
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
      // If it's a report on a note, fetch the note item and store the reference
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
      // If it's a report on an exercise, fetch the exercise item and store the reference
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
      // If the item type is invalid, throw an error
      default:
        throw new BadRequestException('Invalid item type');
    }
    // If the item exists, add the report to it and save
    if (item !== null) {
      item.reports.push(report);
      report.summary = createReportDto.summary;
      report.report = createReportDto.report;
      const savedReport = await this.reportRepository.save(report);
      // Send a mail notification to all accounts
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

  /*
  Input: None
  Output: Promise<Report[]>
  Return value: Array of all reports
  Function: Retrieves all reports
  Variables: None
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  async findAll() {
    return await this.reportRepository.find();
  }

  /*
  Input: None
  Output: Promise<Report[]>
  Return value: Array of open reports
  Function: Retrieves all open reports
  Variables: None
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  async list() {
    return await this.reportRepository.findBy({ isOpen: true });
  }

  /*
  Input: id: string
  Output: Promise<Report | null>
  Return value: Report object or null
  Function: Finds a report by id with joined entities
  Variables: None
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  async findOne(id: string) {
    return await this.reportRepository
      .createQueryBuilder('report')
      .where('report.id = :id', { id })
      .leftJoinAndSelect('report.news', 'news')
      .leftJoinAndSelect('report.note', 'note')
      .leftJoinAndSelect('report.excercise', 'excercise')
      .getOne();
  }

  /*
  Input: id: string, updateReportDto: UpdateReportDto
  Output: Promise<any>
  Return value: Updated report object or error
  Function: Updates a report by id
  Variables: report
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  async update(id: string, updateReportDto: UpdateReportDto) {
    const report = await this.reportRepository.findOneBy({ id });
    // search for the item associated to the report by item type
    switch (updateReportDto.itemType) {
      // If the item type is news, fetch the news item
      case 'news':
        report.news = await this.newsRepository.findOneBy({
          id: updateReportDto.itemId
        });
        report.itemType = ItemType.NEWS;
        break;
      // If the item type is note, fetch the note item
      case 'note':
        report.note = await this.noteRepository.findOneBy({
          id: updateReportDto.itemId
        });
        report.itemType = ItemType.NOTE;
        break;
      // If the item type is exercise, fetch the exercise item
      case 'exercise':
        report.excercise = await this.excerciseRepository.findOneBy({
          id: updateReportDto.itemId
        });
        report.itemType = ItemType.EXCERCISE;
        break;
      // If the item type is invalid, throw an error
      default:
        throw new BadRequestException('Invalid item type');
    }
    return await this.reportRepository.save({ ...report });
  }

  /*
  Input: id: string
  Output: Promise<Report>
  Return value: Removed report object or error
  Function: Removes a report by id
  Variables: report
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  async remove(id: string) {
    const report = await this.reportRepository.findOneBy({ id });
    return await this.reportRepository.remove(report);
  }

  /*
  Input: id: string
  Output: Promise<Report>
  Return value: Closed report object or error
  Function: Closes a report by id
  Variables: report
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  async close(id: string) {
    const report = await this.reportRepository.findOneBy({ id });
    report.isOpen = false;
    return await this.reportRepository.save(report);
  }
}
