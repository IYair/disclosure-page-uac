import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsNotEmpty, IsObject, IsString } from 'class-validator';
import { CreateCategoryDto } from 'src/categories/dto/create-category.dto';

export class CreateNoteDto {
  // TODO: Add category id as foreign key, change type
  @ApiProperty()
  @IsObject()
  categoryId: { name: string; id: string };

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsArray()
  tags: any;

  // TODO: Add comment id as foreign key, change type
  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  body: string;

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

export class CreateNoteResponseDto extends CreateNoteDto {}

export class NoteResponseCategoryDto extends IntersectionType(
  CreateNoteDto,
  CreateCategoryDto
) {}
