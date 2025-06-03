import { PartialType } from '@nestjs/swagger';
import { CreateImageDto } from './create-image.dto';

// Inherits all properties from CreateImageDto via PartialType (see CreateImageDto for details)
export class UpdateImageDto extends PartialType(CreateImageDto) {}
