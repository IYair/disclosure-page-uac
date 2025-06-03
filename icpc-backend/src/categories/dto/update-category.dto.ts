import { PartialType } from '@nestjs/swagger';
import { CreateCategoryDto } from './create-category.dto';

// Inherits all properties from CreateCategoryDto via PartialType (see CreateCategoryDto for details)
export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}
