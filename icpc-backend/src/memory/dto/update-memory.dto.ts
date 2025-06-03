import { PartialType } from '@nestjs/swagger';
import { CreateMemoryDto } from './create-memory.dto';

// Inherits all properties from CreateMemoryDto via PartialType (see CreateMemoryDto for details)
export class UpdateMemoryDto extends PartialType(CreateMemoryDto) {}
