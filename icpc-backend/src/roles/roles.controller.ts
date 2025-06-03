import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/common/decorators/auth.decorator';
import { RoleEnum } from 'src/common/enums/role.enum';

@Controller('roles')
@Auth(RoleEnum.ADMIN)
@ApiTags('Roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  /*
  Input: createRoleDto: CreateRoleDto
  Output: Promise<Role>
  Return value: Created role entity
  Function: Creates a new role
  Variables: createRoleDto
  Route: POST /roles
  Access: Admin
  Method: POST
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  @Post()
  create(@Query() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  /*
  Input: None
  Output: Promise<Role[]>
  Return value: Array of all roles
  Function: Retrieves all roles
  Variables: None
  Route: GET /roles
  Access: Admin
  Method: GET
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  @Get()
  findAll() {
    return this.rolesService.findAll();
  }

  /*
  Input: id: string
  Output: Promise<Role>
  Return value: Role entity
  Function: Retrieves a role by id
  Variables: id
  Route: GET /roles/:id
  Access: Admin
  Method: GET
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(id);
  }

  /*
  Input: id: string, updateRoleDto: UpdateRoleDto
  Output: Promise<Role>
  Return value: Updated role entity
  Function: Updates a role by id
  Variables: id, updateRoleDto
  Route: PATCH /roles/:id
  Access: Admin
  Method: PATCH
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.update(+id, updateRoleDto);
  }

  /*
  Input: id: string
  Output: Promise<Role>
  Return value: Deleted role entity
  Function: Deletes a role by id
  Variables: id
  Route: DELETE /roles/:id
  Access: Admin
  Method: DELETE
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rolesService.remove(+id);
  }
}
