/*
Input: itemType: string, description: string, operation: string, originalExerciseId: string, modifiedExerciseId: string, originalNoteId: string, modifiedNoteId: string, originalNewsId: string, modifiedNewsId: string, status: string
Output: Ticket DTO object
Return value: Instance of CreateTicketDto
Function: Data Transfer Object for creating a new ticket
Variables: itemType, description, operation, originalExerciseId, modifiedExerciseId, originalNoteId, modifiedNoteId, originalNewsId, modifiedNewsId, status
Date: 03 - 06 - 2025
Author: Gerardo Omar Rodriguez Ramirez
*/

import { ApiProperty } from '@nestjs/swagger';
import { IsString, ValidateIf } from 'class-validator';

export class CreateTicketDto {
  @ApiProperty()
  @IsString()
  itemType: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsString()
  operation: string;

  @ValidateIf(itemType => itemType === 'exercise')
  @ApiProperty()
  @IsString()
  originalExerciseId: string;

  @ValidateIf(itemType => itemType === 'exercise')
  @ApiProperty()
  @IsString()
  modifiedExerciseId: string;

  @ValidateIf(itemType => itemType === 'note')
  @ApiProperty()
  @IsString()
  originalNoteId: string;

  @ValidateIf(itemType => itemType === 'note')
  @ApiProperty()
  @IsString()
  modifiedNoteId: string;

  @ValidateIf(itemType => itemType === 'news')
  @ApiProperty()
  @IsString()
  originalNewsId: string;

  @ValidateIf(itemType => itemType === 'news')
  @ApiProperty()
  @IsString()
  modifiedNewsId: string;

  @ApiProperty()
  @IsString()
  status: string;
}
