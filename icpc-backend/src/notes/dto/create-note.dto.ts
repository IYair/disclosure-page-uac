/*
Input: categoryId: { name: string; id: string }, title: string, tags: any, description: string, body: string, isVisible: boolean, userAuthor: string, role: string
Output: Note DTO object
Return value: Instance of CreateNoteDto
Function: Data Transfer Object for creating a new note
Variables: categoryId, title, tags, description, body, isVisible, userAuthor, role
Date: 03 - 06 - 2025
Author: Gerardo Omar Rodriguez Ramirez
*/

import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsObject,
  IsString
} from 'class-validator';
import { CreateCategoryDto } from 'src/categories/dto/create-category.dto';

export class CreateNoteDto {
  // TODO: Add category id as foreign key, change type
  @ApiProperty()
  @IsObject()
  categoryId: { name: string; id: string };

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsArray()
  tags: any;

  // TODO: Add comment id as foreign key, change type
  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  body: string;

  @ApiProperty()
  @IsBoolean()
  isVisible: boolean;

  @ApiProperty()
  @IsString()
  userAuthor: string;

  @ApiProperty()
  @IsString()
  role: string;
}
// Inherits all properties from CreateNoteDto (see CreateNoteDto for details)
export class CreateNoteResponseDto extends CreateNoteDto {}

// Combines properties from CreateNoteDto and CreateCategoryDto (see respective DTOs for details)
export class NoteResponseCategoryDto extends IntersectionType(
  CreateNoteDto,
  CreateCategoryDto
) {}
