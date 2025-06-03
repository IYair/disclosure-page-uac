import { PartialType } from '@nestjs/swagger';
import { CreateTicketDto } from './create-ticket.dto';

// Inherits all properties from CreateTicketDto via PartialType (see CreateTicketDto for details)
export class UpdateTicketDto extends PartialType(CreateTicketDto) {}
