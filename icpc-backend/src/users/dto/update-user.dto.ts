/*
Input: editorId: string, role: string, plus all CreateUserDto fields (partial)
Output: User DTO object (updated)
Return value: Instance of UpdateUserDto
Function: Data Transfer Object for updating a user
Variables: editorId, role, plus all CreateUserDto fields (partial)
Date: 03 - 06 - 2025
Author: Gerardo Omar Rodriguez Ramirez
*/

import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty()
  @IsString()
  editorId: string;

  @ApiProperty()
  @IsString()
  role: string;
}
