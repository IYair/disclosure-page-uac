import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req
} from '@nestjs/common';
import { TimeService } from './time.service';
import { CreateTimeDto } from './dto/create-time.dto';
import { UpdateTimeDto } from './dto/update-time.dto';
import {
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse
} from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { LoggerService } from 'src/services/logger.service';

@Controller('time')
@ApiTags('Time')
export class TimeController {
  constructor(
    private readonly timeService: TimeService,
    private readonly loggerService: LoggerService
  ) {}

  /*
  Input: createTimeDto: CreateTimeDto, req: any
  Output: Promise<Time>
  Return value: Created time entity
  Function: Creates a new time limit
  Variables: createTimeDto, req, newTime
  Route: POST /time
  Access: User
  Method: POST
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  @ApiBearerAuth()
  @Post()
  @UseGuards(AuthGuard)
  @ApiResponse({
    description: 'The time limit has been successfully created.'
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  async create(@Body() createTimeDto: CreateTimeDto, @Req() req: any) {
    const newTime = await this.timeService.create(createTimeDto);
    this.loggerService.logChange('time', 'create', req.user.name, newTime.id);
    return newTime;
  }

  /*
  Input: None
  Output: Promise<Time[]>
  Return value: Array of all time limits
  Function: Retrieves all time limits
  Variables: None
  Route: GET /time
  Access: Public
  Method: GET
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  @Get()
  @ApiResponse({
    description: 'The time limit list has been successfully retrieved.'
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  findAll() {
    return this.timeService.findAll();
  }

  /*
  Input: id: string
  Output: Promise<Time>
  Return value: Time entity
  Function: Retrieves a time limit by id
  Variables: id
  Route: GET /time/:id
  Access: Public
  Method: GET
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  @Get(':id')
  @ApiResponse({
    description: 'The time limit has been successfully retrieved.'
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  findOne(@Param('id') id: string) {
    return this.timeService.findOne(id);
  }

  /*
  Input: id: string, updateTimeDto: UpdateTimeDto, req: any
  Output: Promise<Time>
  Return value: Updated time entity
  Function: Updates a time limit by id
  Variables: id, updateTimeDto, req, modifiedTime
  Route: PATCH /time/:id
  Access: User
  Method: PATCH
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  @ApiBearerAuth()
  @Patch(':id')
  @UseGuards(AuthGuard)
  @ApiResponse({
    description: 'The time limit has been successfully updated.'
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  async update(
    @Param('id') id: string,
    @Body() updateTimeDto: UpdateTimeDto,
    @Req() req: any
  ) {
    const modifiedTime = await this.timeService.update(id, updateTimeDto);
    this.loggerService.logChange('time', 'update', req.user.name, id);
    return modifiedTime;
  }

  /*
  Input: id: string, req: any
  Output: Promise<Time>
  Return value: Deleted time entity
  Function: Deletes a time limit by id
  Variables: id, req, deletedTime
  Route: DELETE /time/:id
  Access: User
  Method: DELETE
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  @ApiBearerAuth()
  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiResponse({
    description: 'The time limit has been successfully deleted.'
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  async remove(@Param('id') id: string, @Req() req: any) {
    const deletedTime = await this.timeService.remove(id);
    this.loggerService.logChange('time', 'delete', req.user.name, id);
    return deletedTime;
  }
}
