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
import { DifficultyService } from './difficulty.service';
import { CreateDifficultyDto } from './dto/create-difficulty.dto';
import { UpdateDifficultyDto } from './dto/update-difficulty.dto';
import {
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse
} from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { LoggerService } from 'src/services/logger.service';

@ApiTags('Difficulty')
@Controller('difficulty')
export class DifficultyController {
  constructor(
    private readonly difficultyService: DifficultyService,
    private readonly loggerService: LoggerService
  ) {}

  /*
  Input: createDifficultyDto: CreateDifficultyDto, req: any
  Output: Promise<Difficulty>
  Return value: Created difficulty entity
  Function: Creates a new difficulty level
  Variables: createDifficultyDto, req, newDifficulty
  Route: POST /difficulty
  Access: User
  Method: POST
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  @ApiBearerAuth()
  @Post()
  @UseGuards(AuthGuard)
  @ApiResponse({
    description: 'The difficulty level has been successfully created.'
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  async create(
    @Body() createDifficultyDto: CreateDifficultyDto,
    @Req() req: any
  ) {
    const newDifficulty = await this.difficultyService.create(
      createDifficultyDto
    );
    this.loggerService.logChange(
      'difficulty',
      'create',
      req.user.name,
      newDifficulty.id
    );
    return newDifficulty;
  }

  /*
  Input: None
  Output: Promise<Difficulty[]>
  Return value: Array of all difficulty levels
  Function: Retrieves all difficulty levels
  Variables: None
  Route: GET /difficulty
  Access: Public
  Method: GET
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  @Get()
  @ApiResponse({
    description: 'The difficulty level list has been successfully retrieved.'
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  findAll() {
    return this.difficultyService.findAll();
  }

  /*
  Input: id: string
  Output: Promise<Difficulty>
  Return value: Difficulty entity
  Function: Retrieves a difficulty level by id
  Variables: id
  Route: GET /difficulty/:id
  Access: Public
  Method: GET
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  @Get(':id')
  @ApiResponse({
    description: 'The difficulty level has been successfully retrieved.'
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  findOne(@Param('id') id: string) {
    return this.difficultyService.findOne(id);
  }

  /*
  Input: id: string, updateDifficultyDto: UpdateDifficultyDto, req: any
  Output: Promise<Difficulty>
  Return value: Updated difficulty entity
  Function: Updates a difficulty level by id
  Variables: id, updateDifficultyDto, req, modifiedDifficulty
  Route: PATCH /difficulty/:id
  Access: User
  Method: PATCH
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  @ApiBearerAuth()
  @Patch(':id')
  @UseGuards(AuthGuard)
  @ApiResponse({
    description: 'The difficulty level has been successfully updated.'
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  async update(
    @Param('id') id: string,
    @Body() updateDifficultyDto: UpdateDifficultyDto,
    @Req() req: any
  ) {
    const modifiedDifficulty = await this.difficultyService.update(
      id,
      updateDifficultyDto
    );
    this.loggerService.logChange(
      'difficulty',
      'update',
      req.user.name,
      modifiedDifficulty.id
    );
    return modifiedDifficulty;
  }

  /*
  Input: id: string, req: any
  Output: Promise<Difficulty>
  Return value: Deleted difficulty entity
  Function: Deletes a difficulty level by id
  Variables: id, req, deletedDifficulty
  Route: DELETE /difficulty/:id
  Access: User
  Method: DELETE
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  @ApiBearerAuth()
  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiResponse({
    description: 'The difficulty level has been successfully deleted.'
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  async remove(@Param('id') id: string, @Req() req: any) {
    const deletedDifficulty = await this.difficultyService.remove(id);
    this.loggerService.logChange('difficulty', 'delete', req.user.name, id);
    return deletedDifficulty;
  }
}
