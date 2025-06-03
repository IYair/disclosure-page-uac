import { PartialType } from '@nestjs/swagger';
import { CreateCommentDto } from './create-comment.dto';

// Inherits all properties from CreateCommentDto via PartialType (see CreateCommentDto for details)
export class UpdateCommentDto extends PartialType(CreateCommentDto) {}
