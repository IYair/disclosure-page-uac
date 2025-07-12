/*
Input: level: number, name: string
Output: Difficulty DTO object
Return value: Instance of CreateDifficultyDto
Function: Data Transfer Object for creating a new difficulty level
Variables: level, name
Date: 03 - 06 - 2025
Author: Gerardo Omar Rodriguez Ramirez
*/

import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateDifficultyDto {
  @ApiProperty()
  @IsNumber()
  level: number;

  @ApiProperty()
  @IsString()
  name: string;
}
