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
import { MemoryService } from './memory.service';
import { CreateMemoryDto } from './dto/create-memory.dto';
import { UpdateMemoryDto } from './dto/update-memory.dto';
import {
  ApiBearerAuth,
  ApiResponse,
  ApiInternalServerErrorResponse,
  ApiTags,
  ApiUnauthorizedResponse
} from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { LoggerService } from 'src/services/logger.service';

@Controller('memory')
@ApiTags('Memory')
export class MemoryController {
  constructor(
    private readonly memoryService: MemoryService,
    private readonly loggerService: LoggerService
  ) {}

  /*
  Input: createMemoryDto: CreateMemoryDto, req: any
  Output: Promise<Memory>
  Return value: Created memory entity
  Function: Creates a new memory limit
  Variables: createMemoryDto, req, newMemory
  Route: POST /memory
  Access: User
  Method: POST
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  @ApiBearerAuth()
  @Post()
  @UseGuards(AuthGuard)
  @ApiResponse({
    description: 'The memory limit has been successfully created.'
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  async create(@Body() createMemoryDto: CreateMemoryDto, @Req() req: any) {
    const newMemory = await this.memoryService.create(createMemoryDto);
    this.loggerService.logChange(
      'memory',
      'create',
      req.user.name,
      newMemory.id
    );
    return newMemory;
  }

  /*
  Input: None
  Output: Promise<Memory[]>
  Return value: Array of all memory limits
  Function: Retrieves all memory limits
  Variables: None
  Route: GET /memory
  Access: Public
  Method: GET
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  @Get()
  @ApiResponse({
    description: 'The memory limit list has been successfully retrieved.'
  })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  findAll() {
    return this.memoryService.findAll();
  }

  /*
  Input: id: string
  Output: Promise<Memory>
  Return value: Memory entity
  Function: Retrieves a memory limit by id
  Variables: id
  Route: GET /memory/:id
  Access: Public
  Method: GET
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  @Get(':id')
  @ApiResponse({
    description: 'The memory limit has been successfully retrieved.'
  })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  findOne(@Param('id') id: string) {
    return this.memoryService.findOne(id);
  }

  /*
  Input: id: string, updateMemoryDto: UpdateMemoryDto, req: any
  Output: Promise<Memory>
  Return value: Updated memory entity
  Function: Updates a memory limit by id
  Variables: id, updateMemoryDto, req, modifiedMemory
  Route: PATCH /memory/:id
  Access: User
  Method: PATCH
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  @ApiBearerAuth()
  @Patch(':id')
  @UseGuards(AuthGuard)
  @ApiResponse({
    description: 'The memory limit has been successfully updated.'
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  async update(
    @Param('id') id: string,
    @Body() updateMemoryDto: UpdateMemoryDto,
    @Req() req: any
  ) {
    const modifiedMemory = await this.memoryService.update(id, updateMemoryDto);
    this.loggerService.logChange('memory', 'update', req.user.name, id);
    return modifiedMemory;
  }

  /*
  Input: id: string, req: any
  Output: Promise<Memory>
  Return value: Deleted memory entity
  Function: Deletes a memory limit by id
  Variables: id, req, deletedMemory
  Route: DELETE /memory/:id
  Access: User
  Method: DELETE
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  @ApiBearerAuth()
  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiResponse({
    description: 'The memory limit has been successfully deleted.'
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  async remove(@Param('id') id: string, @Req() req: any) {
    const deletedMemory = await this.memoryService.remove(id);
    this.loggerService.logChange('memory', 'delete', req.user.name, id);
    return deletedMemory;
  }
}
