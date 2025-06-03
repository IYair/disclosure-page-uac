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
import { TagsService } from './tags.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import {
  ApiBearerAuth,
  ApiResponse,
  ApiUnauthorizedResponse,
  ApiInternalServerErrorResponse,
  ApiTags
} from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { LoggerService } from 'src/services/logger.service';

@ApiTags('Tags')
@Controller('tags')
export class TagsController {
  constructor(
    private readonly tagsService: TagsService,
    private readonly loggerService: LoggerService
  ) {}

  /*
  Input: createTagDto: CreateTagDto, req: any
  Output: Promise<Tag>
  Return value: Created tag entity
  Function: Creates a new tag
  Variables: createTagDto, req, newTag
  Route: POST /tags
  Access: User
  Method: POST
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  @ApiBearerAuth()
  @Post()
  @UseGuards(AuthGuard)
  @ApiResponse({
    description: 'The tag has been successfully created.'
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  async create(@Body() createTagDto: CreateTagDto, @Req() req: any) {
    const newTag = await this.tagsService.create(createTagDto);
    this.loggerService.logChange('tags', 'create', req.user.name, newTag.id);
    return newTag;
  }

  /*
  Input: None
  Output: Promise<Tag[]>
  Return value: Array of all tags
  Function: Retrieves all tags
  Variables: None
  Route: GET /tags
  Access: Public
  Method: GET
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  @Get()
  @ApiResponse({
    description: 'The tag list has been successfully retrieved.'
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  findAll() {
    return this.tagsService.findAll();
  }

  /*
  Input: id: string
  Output: Promise<Tag>
  Return value: Tag entity
  Function: Retrieves a tag by id
  Variables: id
  Route: GET /tags/:id
  Access: Public
  Method: GET
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  @Get(':id')
  @ApiResponse({
    description: 'The tag has been successfully retrieved.'
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  findOne(@Param('id') id: string) {
    return this.tagsService.findOne(id);
  }

  /*
  Input: id: string, updateTagDto: UpdateTagDto, req: any
  Output: Promise<Tag>
  Return value: Updated tag entity
  Function: Updates a tag by id
  Variables: id, updateTagDto, req, modifiedTag
  Route: PATCH /tags/:id
  Access: User
  Method: PATCH
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  @ApiBearerAuth()
  @Patch(':id')
  @UseGuards(AuthGuard)
  @ApiResponse({
    description: 'The tag has been successfully updated.'
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  async update(
    @Param('id') id: string,
    @Body() updateTagDto: UpdateTagDto,
    @Req() req: any
  ) {
    const modifiedTag = await this.tagsService.update(id, updateTagDto);
    this.loggerService.logChange(
      'tags',
      'update',
      req.user.name,
      modifiedTag.id
    );
    return modifiedTag;
  }

  /*
  Input: id: string, req: any
  Output: Promise<Tag>
  Return value: Deleted tag entity
  Function: Deletes a tag by id
  Variables: id, req, deletedTag
  Route: DELETE /tags/:id
  Access: User
  Method: DELETE
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  @ApiBearerAuth()
  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiResponse({
    description: 'The tag has been successfully deleted.'
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  async remove(@Param('id') id: string, @Req() req: any) {
    const deletedTag = await this.tagsService.remove(id);
    this.loggerService.logChange('tags', 'delete', req.user.name, id);
    return deletedTag;
  }
}
