import { PartialType } from '@nestjs/swagger';
import { CreateRoleDto } from './create-role.dto';

// Inherits all properties from CreateRoleDto via PartialType (see CreateRoleDto for details)
export class UpdateRoleDto extends PartialType(CreateRoleDto) {}
