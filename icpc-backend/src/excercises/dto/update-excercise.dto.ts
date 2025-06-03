import { PartialType } from '@nestjs/swagger';
import { CreateExcerciseDto } from './create-excercise.dto';

// Inherits all properties from CreateExcerciseDto via PartialType (see CreateExcerciseDto for details)
export class UpdateExcerciseDto extends PartialType(CreateExcerciseDto) {}
