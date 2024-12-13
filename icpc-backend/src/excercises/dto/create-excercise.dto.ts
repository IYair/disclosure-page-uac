import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsObject, IsOptional, IsString, Matches } from 'class-validator';

export class
CreateExcerciseDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsObject()
  @Matches(/[a-zA-Z]/)
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
