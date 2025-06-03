import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse
} from '@nestjs/swagger';
import { AuthGuard } from '../auth/guard/auth.guard';
import { Auth } from '../common/decorators/auth.decorator';
import { RoleEnum } from '../common/enums/role.enum';
import { LoggerService } from 'src/services/logger.service';

@Controller('users') // This is the path that will be used for all the endpoints in this controller.
@Auth(RoleEnum.ADMIN) // This is the role that will be used for all the endpoints in this controller.
@ApiTags('User') // This is the name of the tag for all the endpoints in this controller.
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly loggerService: LoggerService
  ) {}

  @ApiBearerAuth()
  @Post('') // Endpoint for a post request to create a user, at "/users/user"
  @UseGuards(AuthGuard)
  @ApiCreatedResponse({
    description: 'The user has been successfully created.'
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  /**
  Input: createUserDto: CreateUserDto, req: any
  Output: Promise<User>
  Return value: Created user object
  Function: Creates a new user (admin only)
  Variables: createUserDto, req, newUser
  Route: POST /users
  Access: Admin
  Method: POST
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  async create(@Body() createUserDto: CreateUserDto, @Req() req: any) {
    const newUser = await this.usersService.create(createUserDto);
    this.loggerService.logChange('users', 'create', req.user.name, newUser.id);
    return newUser;
  }

  @Get('')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiResponse({
    description: 'The users has been successfully retrieved.'
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  /**
  Input: None
  Output: Promise<User[]>
  Return value: Array of all users
  Function: Retrieves all users (admin only)
  Variables: None
  Route: GET /users
  Access: Admin
  Method: GET
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  async findAll() {
    return await this.usersService.findAll();
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiResponse({
    description: 'The user has been successfully retrieved.'
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  /**
  Input: id: string
  Output: Promise<User>
  Return value: User object
  Function: Retrieves a user by id (admin only)
  Variables: id
  Route: GET /users/:id
  Access: Admin
  Method: GET
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Auth(RoleEnum.USER)
  @ApiResponse({
    description: 'The user has been successfully updated.'
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  /**
  Input: id: string, updateUserDto: UpdateUserDto, req: any
  Output: Promise<User>
  Return value: Updated user object
  Function: Updates a user by id (user or admin)
  Variables: id, updateUserDto, req, modifiedUser
  Route: PATCH /users/:id
  Access: User
  Method: PATCH
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: any
  ) {
    const modifiedUser = await this.usersService.update(id, updateUserDto);
    this.loggerService.logChange('users', 'update', req.user.name, id);
    return modifiedUser;
  }

  @Delete(':id/:user')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiResponse({
    description: 'The user has been successfully deleted.'
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  /**
  Input: id: string, user: string, req: any
  Output: Promise<User>
  Return value: Deleted user object
  Function: Deletes a user by id (admin only)
  Variables: id, user, req, deletedUser
  Route: DELETE /users/:id/:user
  Access: Admin
  Method: DELETE
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  async remove(
    @Param('id') id: string,
    @Param('user') user: string,
    @Req() req: any
  ) {
    const deletedUser = await this.usersService.remove(id, user);
    this.loggerService.logChange('users', 'delete', req.user.name, id);
    return deletedUser;
  }
}
