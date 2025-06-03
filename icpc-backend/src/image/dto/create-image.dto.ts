import { ApiProperty } from '@nestjs/swagger';

/*
Input: file: Express.Multer.File
Output: Image DTO object
Return value: Instance of CreateImageDto
Function: Data Transfer Object for creating a new image
Variables: file
Date: 03 - 06 - 2025
Author: Gerardo Omar Rodriguez Ramirez
*/

export class CreateImageDto {
  @ApiProperty()
  file: Express.Multer.File;
}
