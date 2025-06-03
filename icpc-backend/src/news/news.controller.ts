import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UploadedFile,
  UseInterceptors,
  Req
} from '@nestjs/common';
import { NewsService } from './news.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiTags,
  ApiUnauthorizedResponse
} from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { LoggerService } from '../services/logger.service';
import { ImageService } from 'src/image/image.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('news')
@ApiTags('News')
export class NewsController {
  constructor(
    private readonly imageService: ImageService,
    private readonly newsService: NewsService,
    private readonly loggerService: LoggerService
  ) {}

  /*
  Input: createNewsDto: CreateNewsDto, req: any
  Output: Promise<News>
  Return value: Created news entity
  Function: Creates a news item
  Variables: createNewsDto, req, createdNews
  Route: POST /news
  Access: User
  Method: POST
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  @Post()
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiCreatedResponse({
    description: 'La noticia ha sido creada exitosamente.'
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async create(@Body() createNewsDto: CreateNewsDto, @Req() req: any) {
    const createdNews = await this.newsService.create(createNewsDto);
    this.loggerService.logChange(
      'news',
      'create',
      req.user.name,
      createdNews.id
    );
    return createdNews;
  }

  /*
  Input: None
  Output: Promise<News[]>
  Return value: Array of all news items
  Function: Retrieves all news items
  Variables: None
  Route: GET /news
  Access: Public
  Method: GET
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  @Get()
  @ApiCreatedResponse({
    description: 'Las noticias se han obtenido exitosamente.'
  })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  findAll() {
    return this.newsService.findAll();
  }

  /*
  Input: None
  Output: Promise<number>
  Return value: Count of news items
  Function: Gets the total count of news items
  Variables: None
  Route: GET /news/count
  Access: Public
  Method: GET
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  @Get('count')
  async getCount(): Promise<number> {
    return this.newsService.getCount();
  }

  /*
  Input: id: string
  Output: Promise<News>
  Return value: News entity
  Function: Retrieves a news item by id
  Variables: id
  Route: GET /news/:id
  Access: Public
  Method: GET
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  @Get(':id')
  @ApiCreatedResponse({
    description: 'La noticia se ha obtenido exitosamente.'
  })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  findOne(@Param('id') id: string) {
    return this.newsService.findOne(id);
  }

  /*
  Input: query: string
  Output: Promise<News[]>
  Return value: Array of news items matching the query
  Function: Searches news items by query string
  Variables: query
  Route: POST /news/search/:query
  Access: Public
  Method: POST
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  @Post('search/:query')
  @ApiCreatedResponse({
    description: 'Las noticias se han obtenido exitosamente.'
  })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  search(@Param('query') query: string) {
    return this.newsService.search(query);
  }

  /*
  Input: id: string, file: Express.Multer.File
  Output: Promise<News>
  Return value: News entity with updated image
  Function: Swaps the image of a news item
  Variables: id, file, image
  Route: PATCH /news/image/:id
  Access: User
  Method: PATCH
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  @UseInterceptors(FileInterceptor('file'))
  @Patch('image/:id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiCreatedResponse({
    description: 'La imagen se ha actualizado exitosamente.'
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Archivo a subir',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary'
        }
      }
    }
  })
  async swapImage(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File
  ) {
    const image = await this.imageService.create(file);
    return this.newsService.swapImage(id, image.id);
  }

  /*
  Input: id: string, updateNewsDto: UpdateNewsDto, req: any
  Output: Promise<News>
  Return value: Updated news entity
  Function: Updates a news item by id
  Variables: id, updateNewsDto, req, updatedNews
  Route: PATCH /news/:id
  Access: User
  Method: PATCH
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiCreatedResponse({
    description: 'La noticia se ha actualizado exitosamente.'
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async update(
    @Param('id') id: string,
    @Body() updateNewsDto: UpdateNewsDto,
    @Req() req: any
  ) {
    const updatedNews = await this.newsService.update(id, updateNewsDto);
    this.loggerService.logChange('news', 'update', req.user.name, id);
    return updatedNews;
  }

  /*
  Input: id: string, user: string, req: any
  Output: Promise<News>
  Return value: Deleted news entity
  Function: Deletes a news item by id
  Variables: id, user, req, deletedNews
  Route: DELETE /news/:id/:user
  Access: User
  Method: DELETE
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  @Delete(':id/:user')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiCreatedResponse({
    description: 'La noticia se ha borrado exitosamente.'
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async remove(
    @Param('id') id: string,
    @Param('user') user: string,
    @Req() req: any
  ) {
    const deletedNews = await this.newsService.remove(id, user);
    this.loggerService.logChange('news', 'delete', req.user.name, id);
    return deletedNews;
  }
}
