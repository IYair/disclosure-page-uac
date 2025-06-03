/*
Input: body: string
Output: Comment DTO object
Return value: Instance of CreateCommentDto
Function: Data Transfer Object for creating a new comment
Variables: body
Date: 03 - 06 - 2025
Author: Gerardo Omar Rodriguez Ramirez
*/

import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty()
  @IsString()
  body: string;
}
