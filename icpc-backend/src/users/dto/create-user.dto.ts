/*
Input: name: string, lastName: string, userName: string, email: string, password: string, passwordVerify: string, isAdmin: boolean
Output: User DTO object
Return value: Instance of CreateUserDto
Function: Data Transfer Object for creating a new user
Variables: name, lastName, userName, email, password, passwordVerify, isAdmin
Date: 03 - 06 - 2025
Author: Gerardo Omar Rodriguez Ramirez
*/

import { ApiProperty, IntersectionType, OmitType } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsString, MinLength } from 'class-validator';
import { CreateRoleDto } from 'src/roles/dto/create-role.dto';

// This file contains all the data properties and validation requirements for the user object.

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  @MinLength(3)
  name: string;

  @ApiProperty()
  @IsString()
  @MinLength(3)
  lastName: string;

  @ApiProperty()
  @IsString()
  @MinLength(3)
  userName: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  password: string;

  @ApiProperty()
  @IsString()
  passwordVerify: string;

  @ApiProperty()
  @IsBoolean()
  isAdmin: boolean;
}

// Inherits all properties from CreateUserDto, omitting password, passwordVerify, isAdmin (see CreateUserDto for details)
export class CreateUserResponseDto extends OmitType(CreateUserDto, [
  'password',
  'passwordVerify',
  'isAdmin'
] as const) {}

// Combines properties from CreateUserDto and CreateRoleDto (see respective DTOs for details)
export class UserResponseRoleDto extends IntersectionType(
  CreateUserDto,
  CreateRoleDto
) {}
