/*
Input: timeLimit: number
Output: Time DTO object
Return value: Instance of CreateTimeDto
Function: Data Transfer Object for creating a new time limit
Variables: timeLimit
Date: 03 - 06 - 2025
Author: Gerardo Omar Rodriguez Ramirez
*/

import { IsOptional, IsNumber } from 'class-validator';

export class CreateTimeDto {
  @IsOptional()
  @IsNumber()
  timeLimit: number;
}
