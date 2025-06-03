/*
Input: title: string, body: string, imageId: string, userAuthor: string, role: string
Output: News DTO object
Return value: Instance of CreateNewsDto
Function: Data Transfer Object for creating a news item
Variables: title, body, imageId, userAuthor, role
Date: 03 - 06 - 2025
Author: Gerardo Omar Rodriguez Ramirez
*/

import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateNewsDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  body: string;

  @ApiProperty()
  @IsString()
  imageId: string;

  @ApiProperty()
  @IsString()
  userAuthor: string;

  @ApiProperty()
  @IsString()
  role: string;
}
