import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength, Matches } from 'class-validator';

/*
Input: name: string, color: string
Output: Tag DTO object
Return value: Instance of CreateTagDto
Function: Data Transfer Object for creating a new tag
Variables: name, color
Date: 03 - 06 - 2025
Author: Gerardo Omar Rodriguez Ramirez
*/

// create-tag.dto.ts
export class CreateTagDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  @MinLength(6)
  @MaxLength(6)
  @Matches(/^[0-9A-Fa-f]{6}$/i)
  color: string;
}
