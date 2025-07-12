import { PartialType } from '@nestjs/swagger';
import { CreateTagDto } from './create-tag.dto';

// Inherits all properties from CreateTagDto via PartialType (see CreateTagDto for details)
export class UpdateTagDto extends PartialType(CreateTagDto) {}
