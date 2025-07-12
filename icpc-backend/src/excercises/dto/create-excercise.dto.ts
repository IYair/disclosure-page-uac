/*
Input: name: string, category: { name: string; id: string }, difficulty: { name: string; id: string }, time: { value: number; id: string }, memoryId: string, input: string, output: string, constraints: string, clue: string, tags: any[], isVisible: boolean, userAuthor: string, role: string
Output: Exercise DTO object
Return value: Instance of CreateExcerciseDto
Function: Data Transfer Object for creating a new exercise
Variables: name, category, difficulty, time, memoryId, input, output, constraints, clue, tags, isVisible, userAuthor, role
Date: 03 - 06 - 2025
Author: Gerardo Omar Rodriguez Ramirez
*/

import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsObject,
  IsOptional,
  IsString
} from 'class-validator';

export class CreateExcerciseDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsObject()
  category: { name: string; id: string };

  @ApiProperty()
  @IsObject()
  difficulty: { name: string; id: string };

  @ApiProperty()
  @IsObject()
  @IsOptional()
  time: { value: number; id: string };

  @ApiProperty()
  @IsString()
  @IsOptional()
  memoryId: string;

  @ApiProperty()
  @IsString()
  input: string;

  @ApiProperty()
  @IsString()
  output: string;

  @ApiProperty()
  @IsString()
  constraints: string;

  @ApiProperty()
  @IsString()
  clue: string;

  @ApiProperty()
  @IsArray()
  tags: any;

  @ApiProperty()
  @IsString()
  author: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsString()
  example_input: string;

  @ApiProperty()
  @IsString()
  example_output: string;

  @ApiProperty()
  @IsString()
  solution: string;

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
