/*
Input: category: string, tags: { id: string; name: string; color: string }[], difficulty: string
Output: Exercise list filter DTO object
Return value: Instance of GetExerciseListDto
Function: Data Transfer Object for filtering exercise list
Variables: category, tags, difficulty
Date: 03 - 06 - 2025
Author: Gerardo Omar Rodriguez Ramirez
*/

import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';

export class GetExerciseListDto {
  @ApiProperty()
  @IsString()
  category: string;

  @ApiProperty()
  @IsArray()
  tags: {
    id: string;
    name: string;
    color: string;
  }[];

  @ApiProperty()
  @IsString()
  difficulty: string;
}
