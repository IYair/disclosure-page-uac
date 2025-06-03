import { PartialType } from '@nestjs/swagger';
import { CreateFactDto } from './create-fact.dto';

// Inherits all properties from CreateFactDto via PartialType (see CreateFactDto for details)
export class UpdateFactDto extends PartialType(CreateFactDto) {
  text?: string;
}
