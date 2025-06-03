/*
Input: value: number, id: string
Output: Memory DTO object
Return value: Instance of CreateMemoryDto
Function: Data Transfer Object for creating a new memory limit
Variables: value, id
Date: 03 - 06 - 2025
Author: Gerardo Omar Rodriguez Ramirez
*/

import { IsOptional, IsNumber, IsString } from 'class-validator';

export class CreateMemoryDto {
  @IsOptional()
  @IsNumber()
  value: number;

  @IsOptional()
  @IsString()
  id: string;
}
