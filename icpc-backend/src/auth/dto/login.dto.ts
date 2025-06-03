/*
Input: username?: string, email?: string, password: string
Output: Login DTO object
Return value: Instance of LoginDto
Function: Data Transfer Object for user login
Variables: username, email, password
Date: 03 - 06 - 2025
Author: Gerardo Omar Rodriguez Ramirez
*/

import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class LoginDto {
  @ApiProperty()
  @Transform(({ value }) => value.trim())
  @IsString()
  @IsOptional()
  username?: string;

  @ApiProperty()
  @Transform(({ value }) => value.trim())
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty()
  @Transform(({ value }) => value.trim())
  @IsString()
  @MinLength(8)
  password: string;
}

// LoginResponseDto: Contains user info and token (see LoginDto for details)
export class LoginResponseDto {
  @ApiProperty({
    type: 'object',
    properties: {
      userName: { type: 'string' },
      email: { type: 'string' },
      role: { type: 'string' }
    }
  })
  user: {
    userName: string;
    email: string;
    role: string;
  };
  @ApiProperty()
  token: string;
}
