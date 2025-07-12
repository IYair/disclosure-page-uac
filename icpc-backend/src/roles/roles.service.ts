import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>
  ) {}

  /*
  Input: createRoleDto: CreateRoleDto
  Output: { id: string; role: string }
  Return value: Created role object
  Function: Creates a new role and saves it
  Variables: role
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  create(createRoleDto: CreateRoleDto) {
    const role = this.roleRepository.create(createRoleDto);
    this.roleRepository.save(role);
    return {
      id: role.id,
      role: role.role
    };
  }

  /*
  Input: None
  Output: string
  Return value: String message
  Function: Returns a message for all roles (placeholder)
  Variables: None
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  findAll() {
    return `This action returns all roles`;
  }

  /*
  Input: id: string
  Output: Promise<{ id: string; role: string } | null>
  Return value: Role object or null
  Function: Finds a role by id and returns its info
  Variables: role
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  async findOne(id: string) {
    const role = await this.roleRepository.findOne({ where: { id } });
    // If no role is found, return null
    if (!role) {
      return null;
    }
    return {
      id: role.id,
      role: role.role
    };
  }

  /*
  Input: id: number, updateRoleDto: UpdateRoleDto
  Output: Promise<Role>
  Return value: Updated role object
  Function: Updates a role by id
  Variables: role
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  async update(id: number, updateRoleDto: UpdateRoleDto) {
    const role = await this.roleRepository.findOne({
      where: { id: String(id) }
    });
    return await this.roleRepository.save({ ...role, ...updateRoleDto });
  }

  /*
  Input: id: number
  Output: string
  Return value: String message
  Function: Returns a message for removing a role (placeholder)
  Variables: None
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  remove(id: number) {
    return `This action removes a #${id} role`;
  }
}
