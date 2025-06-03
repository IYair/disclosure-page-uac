import { PartialType } from '@nestjs/swagger';
import { CreateTimeDto } from './create-time.dto';

// Inherits all properties from CreateTimeDto via PartialType (see CreateTimeDto for details)
export class UpdateTimeDto extends PartialType(CreateTimeDto) {}
