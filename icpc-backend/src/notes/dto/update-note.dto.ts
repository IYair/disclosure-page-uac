import { PartialType } from '@nestjs/swagger';
import { CreateNoteDto } from './create-note.dto';

// Inherits all properties from CreateNoteDto via PartialType (see CreateNoteDto for details)
export class UpdateNoteDto extends PartialType(CreateNoteDto) {}
