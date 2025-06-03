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
import { ExcercisesService } from './excercises.service';
import { CreateExcerciseDto } from './dto/create-excercise.dto';
import { UpdateExcerciseDto } from './dto/update-excercise.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiTags,
  ApiUnauthorizedResponse
} from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { GetExerciseListDto } from './dto/get-exercise-list.dto';
import { LoggerService } from '../services/logger.service'; // Importa el LoggerService

@Controller('excercises')
@ApiTags('Exercises')
export class ExcercisesController {
  constructor(
    private readonly exercisesService: ExcercisesService,
    private readonly loggerService: LoggerService // Inyecta el LoggerService
  ) {}

  /*
  Input: createExcerciseDto: CreateExcerciseDto, req: any
  Output: Promise<Excercise>
  Return value: Created exercise object
  Function: Creates a new exercise
  Variables: createExcerciseDto, req, createdExercise
  Route: POST /excercises
  Access: User, Admin
  Method: POST
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  @Post()
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiCreatedResponse({
    description: 'The exercise has been successfully created.'
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  async create(
    @Body() createExcerciseDto: CreateExcerciseDto,
    @Req() req: any
  ) {
    const createdExercise = await this.exercisesService.create(
      createExcerciseDto
    );
    this.loggerService.logChange(
      'excercises',
      'create',
      req.user.name,
      createdExercise.id
    );
    return createdExercise;
  }

  /*
  Input: None
  Output: Promise<Excercise[]>
  Return value: Array of all exercises
  Function: Retrieves all exercises
  Variables: None
  Route: GET /excercises
  Access: Public
  Method: GET
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  @Get()
  @ApiCreatedResponse({
    description: 'Los ejercicios se han obtenido exitosamente.'
  })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  findAll() {
    return this.exercisesService.findAll();
  }

  /*
  Input: None
  Output: Promise<number>
  Return value: Count of exercises
  Function: Gets the total count of exercises
  Variables: None
  Route: GET /excercises/count
  Access: Public
  Method: GET
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  @Get('/count')
  @ApiCreatedResponse({
    description: 'The exercise count has been successfully obtained.'
  })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  count() {
    return this.exercisesService.getCount();
  }

  /*
  Input: id: string
  Output: Promise<Excercise>
  Return value: Exercise object
  Function: Retrieves an exercise by id
  Variables: id
  Route: GET /excercises/:id
  Access: Public
  Method: GET
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  @Get(':id')
  @ApiCreatedResponse({
    description: 'El ejercicio se ha obtenido exitosamente.'
  })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  findOne(@Param('id') id: string) {
    return this.exercisesService.findOne(id);
  }

  /*
  Input: body: GetExerciseListDto
  Output: Promise<Excercise[]>
  Return value: List of exercises matching criteria
  Function: Gets a list of exercises based on filters
  Variables: body
  Route: POST /excercises/list
  Access: Public
  Method: POST
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  @Post('/list')
  getList(@Body() body: GetExerciseListDto) {
    return this.exercisesService.getList(body);
  }

  /*
  Input: query: string
  Output: Promise<Excercise[]>
  Return value: Array of exercises matching the query
  Function: Searches exercises by query string
  Variables: query
  Route: POST /excercises/search/:query
  Access: Public
  Method: POST
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  @Post('search/:query')
  @ApiCreatedResponse({
    description: 'Los ejercicios se han obtenido exitosamente.'
  })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  async search(@Param('query') query: string) {
    return await this.exercisesService.search(query);
  }

  /*
  Input: id: string
  Output: Promise<boolean>
  Return value: True if log was successful, false otherwise
  Function: Logs a read event for an exercise
  Variables: id, item
  Route: POST /excercises/log/:id
  Access: Public
  Method: POST
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  @Post('/log/:id')
  @ApiCreatedResponse({
    description: 'La lectura se ha registrado exitosamente.'
  })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  async logRead(@Param('id') id: string) {
    const item = await this.findOne(id);
    try {
      this.loggerService.logRead(
        'exercises',
        item.id,
        `${item.category.name} ${item.category.id}`,
        item.tags.map(tag => `${tag.name} ${tag.id}`).join(', ')
      );
      return true;
    } catch (error) {
      return false;
    }
  }

  /*
  Input: id: string, updateExcerciseDto: UpdateExcerciseDto, req: any
  Output: Promise<Excercise>
  Return value: Updated exercise object
  Function: Updates an exercise by id
  Variables: id, updateExcerciseDto, req, updatedExercise
  Route: PATCH /excercises/:id
  Access: User
  Method: PATCH
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiCreatedResponse({
    description: 'The exercise has been successfully updated.'
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  async update(
    @Param('id') id: string,
    @Body() updateExcerciseDto: UpdateExcerciseDto,
    @Req() req: any
  ) {
    const updatedExercise = await this.exercisesService.update(
      id,
      updateExcerciseDto
    );
    this.loggerService.logChange('excercises', 'update', req.user.name, id);
    return updatedExercise;
  }

  /*
  Input: id: string, user: string, req: any
  Output: Promise<Excercise>
  Return value: Deleted exercise object
  Function: Deletes an exercise by id
  Variables: id, user, req, deletedExercise
  Route: DELETE /excercises/:id/:user
  Access: User
  Method: DELETE
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  @Delete(':id/:user')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiCreatedResponse({
    description: 'The exercise has been successfully deleted.'
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  async remove(
    @Param('id') id: string,
    @Param('user') user: string,
    @Req() req: any
  ) {
    const deletedExercise = await this.exercisesService.remove(id, user);
    this.loggerService.logChange('excercises', 'delete', req.user.name, id);
    return deletedExercise;
  }
}
