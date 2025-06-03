/*
Input: name: string, commentId: string
Output: Category DTO object
Return value: Instance of CreateCategoryDto
Function: Data Transfer Object for creating a new category
Variables: name, commentId
Date: 03 - 06 - 2025
Author: Gerardo Omar Rodriguez Ramirez
*/

import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty()
  @IsString()
  @Matches(/[a-zA-Z]/)
  name: string;

  // TODO: Add comment id as foreign key, change type
  @ApiProperty()
  @IsString()
  commentId: string;
}
