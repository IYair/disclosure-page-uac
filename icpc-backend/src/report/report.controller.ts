import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards
} from '@nestjs/common';
import { ReportService } from './report.service';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { LoggerService } from 'src/services/logger.service';

@Controller('report')
@ApiTags('Report')
export class ReportController {
  constructor(
    private readonly reportService: ReportService,
    private readonly loggerService: LoggerService
  ) {}

  /*
  Input: createReportDto: CreateReportDto
  Output: Promise<Report>
  Return value: Created report entity
  Function: Creates a new report
  Variables: createReportDto
  Route: POST /report
  Access: Public
  Method: POST
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  @Post()
  create(@Body() createReportDto: CreateReportDto) {
    return this.reportService.create(createReportDto);
  }

  /*
  Input: id: string, closeReportDto: { user: string }
  Output: Promise<Report>
  Return value: Closed report entity
  Function: Closes a report by id
  Variables: id, closeReportDto
  Route: POST /report/:id
  Access: User
  Method: POST
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  @Post(':id')
  @UseGuards(AuthGuard)
  closeReport(
    @Param('id') id: string,
    @Body() closeReportDto: { user: string }
  ) {
    this.loggerService.logChange('Report', 'close', closeReportDto.user, id);
    return this.reportService.close(id);
  }

  /*
  Input: None
  Output: Promise<Report[]>
  Return value: Array of all reports
  Function: Retrieves all reports
  Variables: None
  Route: GET /report
  Access: User
  Method: GET
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  @Get()
  @UseGuards(AuthGuard)
  findAll() {
    return this.reportService.findAll();
  }

  /*
  Input: None
  Output: Promise<Report[]>
  Return value: Array of all reports (list)
  Function: Retrieves a list of reports
  Variables: None
  Route: GET /report/list
  Access: User
  Method: GET
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  @Get('list')
  @UseGuards(AuthGuard)
  list() {
    return this.reportService.list();
  }

  /*
  Input: id: string
  Output: Promise<Report>
  Return value: Report entity
  Function: Retrieves a report by id
  Variables: id
  Route: GET /report/:id
  Access: User
  Method: GET
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: string) {
    return this.reportService.findOne(id);
  }

  /*
  Input: id: string, updateReportDto: UpdateReportDto
  Output: Promise<Report>
  Return value: Updated report entity
  Function: Updates a report by id
  Variables: id, updateReportDto
  Route: PATCH /report/:id
  Access: User
  Method: PATCH
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  @Patch(':id')
  @UseGuards(AuthGuard)
  update(@Param('id') id: string, @Body() updateReportDto: UpdateReportDto) {
    return this.reportService.update(id, updateReportDto);
  }

  /*
  Input: id: string
  Output: Promise<Report>
  Return value: Confirmation of deletion
  Function: Deletes a report by id
  Variables: id
  Route: DELETE /report/:id
  Access: User
  Method: DELETE
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string) {
    return this.reportService.remove(id);
  }
}
