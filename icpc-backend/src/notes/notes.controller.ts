import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  Req
} from '@nestjs/common';
import { NotesService } from './notes.service';
import { CommentService } from 'src/comment/comment.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiTags,
  ApiUnauthorizedResponse
} from '@nestjs/swagger';
import { AuthGuard } from '../auth/guard/auth.guard';
import { GetNoteListDto } from './dto/get-note-list.dto';
import { LoggerService } from '../services/logger.service';

@Controller()
@ApiTags('Notes')
export class NotesController {
  constructor(
    private readonly notesService: NotesService,
    private readonly commentService: CommentService,
    private readonly loggerService: LoggerService
  ) {}

  /**
  Input: createNoteDto: CreateNoteDto, req: any
  Output: Promise<any>
  Return value: Created note object
  Function: Creates a new note
  Variables: createNoteDto, req, createdNote
  Route: POST /notes
  Access: User, Admin
  Method: POST
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  @Post('notes')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiCreatedResponse({
    description: 'The note has been successfully created.'
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  async create(@Body() createNoteDto: CreateNoteDto, @Req() req: any) {
    const createdNote = await this.notesService.create(createNoteDto);
    this.loggerService.logChange(
      'notes',
      'create',
      req.user.name,
      createdNote.id
    );
    return createdNote;
  }

  /**
  Input: None
  Output: Promise<Note[]>
  Return value: Array of all notes
  Function: Retrieves all notes
  Variables: None
  Route: GET /notes
  Access: Public
  Method: GET
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  @Get('notes')
  @ApiCreatedResponse({
    description: 'The notes have been successfully retrieved.'
  })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  findAll() {
    return this.notesService.findAll();
  }

  /**
  Input: id: string
  Output: Promise<Note>
  Return value: Note object
  Function: Retrieves a note by id
  Variables: id
  Route: GET /note/:id
  Access: Public
  Method: GET
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  @Get('note/:id')
  @ApiCreatedResponse({
    description: 'The note has been successfully retrieved.'
  })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  findOne(@Param('id') id: string) {
    return this.notesService.findOne(id);
  }

  /**
  Input: noteListDto: GetNoteListDto
  Output: Promise<Note>
  Return value: List of notes matching criteria
  Function: Gets a list of notes based on filters
  Variables: noteListDto
  Route: POST /notes/list
  Access: Public
  Method: POST
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  @Post('notes/list/')
  @ApiCreatedResponse({
    description: 'The notes have been successfully retrieved.'
  })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  list(@Body() noteListDto: GetNoteListDto) {
    return this.notesService.findNoteList(noteListDto);
  }

  /**
  Input: query: string
  Output: Promise<Note[]>
  Return value: Array of notes matching the query
  Function: Searches notes by query string
  Variables: query
  Route: POST /notes/search/:query
  Access: Public
  Method: POST
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  @Post('notes/search/:query')
  @ApiCreatedResponse({
    description: 'The notes have been successfully retrieved.'
  })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  search(@Param('query') query: string) {
    return this.notesService.search(query);
  }

  /**
  Input: id: string
  Output: Promise<boolean>
  Return value: True if log was successful, false otherwise
  Function: Logs a read event for a note
  Variables: id, item
  Route: POST /notes/log/:id
  Access: Public
  Method: POST
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  @Post('notes/log/:id')
  @ApiCreatedResponse({
    description: 'La lectura se ha registrado exitosamente.'
  })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  async logRead(@Param('id') id: string) {
    const item = await this.findOne(id);
    try {
      this.loggerService.logRead(
        'notes',
        item.id,
        `${item.category.name} ${item.category.id}`,
        item.tags.map(tag => `${tag.name} ${tag.id}`).join(', ')
      );
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
  Input: categoryId: string
  Output: Promise<Note[]>
  Return value: Array of notes in the category
  Function: Retrieves all notes in a specific category
  Variables: categoryId
  Route: GET /notes/category/:categoryId
  Access: Public
  Method: GET
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  @Get('notes/category/:categoryId')
  @ApiCreatedResponse({
    description: 'The notes have been successfully retrieved.'
  })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  findAllInCategory(@Param('categoryId') categoryId: string) {
    return this.notesService.findAllInCategory(categoryId);
  }

  /**
  Input: None
  Output: Promise<number>
  Return value: Count of notes
  Function: Gets the total count of notes
  Variables: None
  Route: GET /notes/count
  Access: Public
  Method: GET
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  @Get('notes/count')
  @ApiCreatedResponse({
    description: 'The number of notes has been successfully recovered.'
  })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error.' })
  getCount() {
    return this.notesService.getCount();
  }

  /**
  Input: id: string, updateNoteDto: UpdateNoteDto, req: any
  Output: Promise<Note>
  Return value: Updated note object
  Function: Updates a note by id
  Variables: id, updateNoteDto, req, updatedNote
  Route: PATCH /note/:id
  Access: User
  Method: PATCH
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  @Patch('note/:id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiCreatedResponse({
    description: 'The note has been successfully updated.'
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  async update(
    @Param('id') id: string,
    @Body() updateNoteDto: UpdateNoteDto,
    @Req() req: any
  ) {
    const updatedNote = await this.notesService.update(id, updateNoteDto);
    this.loggerService.logChange('notes', 'update', req.user.name, id);
    return updatedNote;
  }

  /**
  Input: id: string, user: string, req: any
  Output: Promise<Note>
  Return value: Deleted note object
  Function: Deletes a note by id
  Variables: id, user, req, deletedNote
  Route: DELETE /note/:id/:user
  Access: User
  Method: DELETE
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  @Delete('note/:id/:user')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiCreatedResponse({
    description: 'The note has been successfully deleted.'
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  async remove(
    @Param('id') id: string,
    @Param('user') user: string,
    @Req() req: any
  ) {
    const deletedNote = await this.notesService.remove(id, user);
    this.loggerService.logChange('notes', 'delete', req.user.name, id);
    return deletedNote;
  }
}
