import { PartialType } from '@nestjs/swagger';
import { CreateNewsDto } from './create-news.dto';

// Inherits all properties from CreateNewsDto via PartialType (see CreateNewsDto for details)
export class UpdateNewsDto extends PartialType(CreateNewsDto) {}
