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
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiTags,
  ApiUnauthorizedResponse
} from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { LoggerService } from 'src/services/logger.service';

@Controller('categories')
@ApiTags('Categories')
export class CategoriesController {
  constructor(
    private readonly categoriesService: CategoriesService,
    private readonly loggerService: LoggerService
  ) {}

  /*
  Input: createCategoryDto: CreateCategoryDto, req: any
  Output: Promise<Category>
  Return value: Created category entity
  Function: Creates a new category
  Variables: createCategoryDto, req, newCategory
  Route: POST /categories
  Access: User
  Method: POST
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  @Post()
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiCreatedResponse({
    description: 'The note has been successfully created.'
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  async create(@Body() createCategoryDto: CreateCategoryDto, @Req() req: any) {
    const newCategory = await this.categoriesService.create(createCategoryDto);
    this.loggerService.logChange(
      'categories',
      'create',
      req.user.name,
      newCategory.id
    );
    return newCategory;
  }

  /*
  Input: None
  Output: Promise<Category[]>
  Return value: Array of all categories
  Function: Retrieves all categories
  Variables: None
  Route: GET /categories
  Access: Public
  Method: GET
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  @Get()
  findAll() {
    return this.categoriesService.findAll();
  }

  /*
  Input: id: string
  Output: Promise<Category>
  Return value: Category entity
  Function: Retrieves a category by id
  Variables: id
  Route: GET /categories/:id
  Access: Public
  Method: GET
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(id);
  }

  /*
  Input: id: string, updateCategoryDto: UpdateCategoryDto, req: any
  Output: Promise<Category>
  Return value: Updated category entity
  Function: Updates a category by id
  Variables: id, updateCategoryDto, req, modifiedCategory
  Route: PATCH /categories/:id
  Access: User
  Method: PATCH
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  @ApiBearerAuth()
  @Patch(':id')
  @UseGuards(AuthGuard)
  @ApiCreatedResponse({
    description: 'The note has been successfully updated.'
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @Req() req: any
  ) {
    const modifiedCategory = await this.categoriesService.update(
      id,
      updateCategoryDto
    );
    this.loggerService.logChange(
      'categories',
      'update',
      req.user.name,
      modifiedCategory.id
    );
    return modifiedCategory;
  }

  /*
  Input: id: string, req: any
  Output: Promise<Category>
  Return value: Deleted category entity
  Function: Deletes a category by id
  Variables: id, req, deletedCategory
  Route: DELETE /categories/:id
  Access: User
  Method: DELETE
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  @ApiBearerAuth()
  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiCreatedResponse({
    description: 'The note has been successfully deleted.'
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  async remove(@Param('id') id: string, @Req() req: any) {
    const deletedCategory = await this.categoriesService.remove(id);
    this.loggerService.logChange('categories', 'delete', req.user.name, id);
    return deletedCategory;
  }
}
