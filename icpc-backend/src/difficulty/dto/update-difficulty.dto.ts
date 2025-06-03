import { PartialType } from '@nestjs/swagger';
import { CreateDifficultyDto } from './create-difficulty.dto';

// Inherits all properties from CreateDifficultyDto via PartialType (see CreateDifficultyDto for details)
export class UpdateDifficultyDto extends PartialType(CreateDifficultyDto) {}
