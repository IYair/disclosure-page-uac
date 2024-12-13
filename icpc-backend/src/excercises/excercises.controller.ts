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

@Controller('excercises')
@ApiTags('Excercises')
export class ExcercisesController {
  constructor(private readonly excercisesService: ExcercisesService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiCreatedResponse({
    description: 'The exercise has been successfully created.'
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  create(@Body() createExcerciseDto: CreateExcerciseDto) {
    return this.excercisesService.create(createExcerciseDto);
  }

  @Get()
  @ApiCreatedResponse({
    description: 'Los ejercicios se han obtenido exitosamente.'
  })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  findAll() {
    return this.excercisesService.findAll();
  }

  @Get(':id')
  @ApiCreatedResponse({
    description: 'El ejercicio se ha obtenido exitosamente.'
  })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  findOne(@Param('id') id: string) {
    return this.excercisesService.findOne(id);
  }

  @Post('/list')
  getList(@Body() body: GetExerciseListDto) {
    return this.excercisesService.getList(body);
  }

  @Post('search/:query')
  @ApiCreatedResponse({
    description: 'Los ejercicios se han obtenido exitosamente.'
  })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  search(@Param('query') query: string) {
    return this.excercisesService.search(query);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiCreatedResponse({
    description: 'The exercise has been successfully updated.'
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  update(
    @Param('id') id: string,
    @Body() updateExcerciseDto: UpdateExcerciseDto
  ) {
    return this.excercisesService.update(id, updateExcerciseDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiCreatedResponse({
    description: 'The exercise has been successfully deleted.'
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  remove(@Param('id') id: string) {
    return this.excercisesService.remove(id);
  }
}