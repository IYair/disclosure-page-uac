/*
Input: role: RoleEnum
Output: Role DTO object
Return value: Instance of CreateRoleDto
Function: Data Transfer Object for creating a new role
Variables: role
Date: 03 - 06 - 2025
Author: Gerardo Omar Rodriguez Ramirez
*/

import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { RoleEnum } from 'src/common/enums/role.enum';

export class CreateRoleDto {
  @ApiProperty({
    enum: RoleEnum,
    default: RoleEnum.USER
  })
  @IsEnum(RoleEnum)
  role: RoleEnum;
}
