import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
  Req
} from '@nestjs/common';
import { TicketService } from './ticket.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { TicketType } from './entities/ticket.entity';
import { Auth } from 'src/common/decorators/auth.decorator';
import { RoleEnum } from 'src/common/enums/role.enum';
import { LoggerService } from 'src/services/logger.service';

enum ItemType {
  EXERCISE = 'Ejercicios',
  NOTE = 'Apuntes',
  NEWS = 'Noticias',
  UTILS = 'Utilidades',
  USER = 'Usuarios'
}

@Controller('ticket')
@ApiTags('Ticket')
export class TicketController {
  constructor(
    private readonly ticketService: TicketService,
    private readonly loggerService: LoggerService
  ) {}

  /*
  Input: createTicketDto: CreateTicketDto
  Output: Promise<Ticket>
  Return value: Created ticket entity
  Function: Creates a new ticket
  Variables: createTicketDto
  Route: POST /ticket
  Access: Public
  Method: POST
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  @Post()
  async create(@Body() createTicketDto: CreateTicketDto) {
    return this.ticketService.create(createTicketDto);
  }

  /*
  Input: None
  Output: Promise<Ticket[]>
  Return value: Array of all tickets
  Function: Retrieves all tickets
  Variables: None
  Route: GET /ticket
  Access: Public
  Method: GET
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  @Get()
  findAll() {
    return this.ticketService.findAll();
  }

  /*
  Input: None
  Output: Promise<Ticket[]>
  Return value: Array of pending tickets
  Function: Retrieves all pending tickets
  Variables: None
  Route: GET /ticket/pending
  Access: Public
  Method: GET
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  @Get('pending')
  findPending() {
    return this.ticketService.findPending();
  }

  /*
  Input: itemId: string, itemType: string
  Output: Promise<{ hasPendingTicket: boolean }>
  Return value: Object indicating if item has pending ticket
  Function: Checks if an item has a pending ticket
  Variables: itemId, itemType, hasPending
  Route: GET /ticket/hasPending/:itemId/:itemType
  Access: Public
  Method: GET
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  @Get('hasPending/:itemId/:itemType')
  async hasPendingTicket(
    @Param('itemId') itemId: string,
    @Param('itemType') itemType: string
  ) {
    if (!Object.values(ItemType).includes(itemType as ItemType)) {
      throw new BadRequestException(`Invalid itemType: ${itemType}`);
    }

    const itemTypeMapping: { [key in ItemType]: TicketType } = {
      [ItemType.EXERCISE]: TicketType.EXERCISE,
      [ItemType.NOTE]: TicketType.NOTE,
      [ItemType.NEWS]: TicketType.NEWS,
      [ItemType.UTILS]: TicketType.UTILS,
      [ItemType.USER]: TicketType.USER
    };

    const hasPending = await this.ticketService.hasPendingTicket(
      itemId,
      itemTypeMapping[itemType as ItemType]
    );

    return { hasPendingTicket: hasPending };
  }

  /*
  Input: id: string
  Output: Promise<Ticket>
  Return value: Ticket entity
  Function: Retrieves a ticket by id
  Variables: id
  Route: GET /ticket/:id
  Access: Public
  Method: GET
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ticketService.findOne(id);
  }

  /*
  Input: id: string, req: any
  Output: Promise<Ticket>
  Return value: Approved ticket entity
  Function: Approves a ticket by id
  Variables: id, req
  Route: POST /ticket/approve/:id
  Access: Admin
  Method: POST
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  @ApiBearerAuth()
  @Auth(RoleEnum.ADMIN)
  @Post('approve/:id')
  approve(@Param('id') id: string, @Req() req: any) {
    this.loggerService.logChange('ticket', 'approve', req.user.name, id);
    return this.ticketService.approve(id);
  }

  /*
  Input: id: string, req: any
  Output: Promise<Ticket>
  Return value: Rejected ticket entity
  Function: Rejects a ticket by id
  Variables: id, req
  Route: POST /ticket/reject/:id
  Access: Admin
  Method: POST
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  @ApiBearerAuth()
  @Auth(RoleEnum.ADMIN)
  @Post('reject/:id')
  reject(@Param('id') id: string, @Req() req: any) {
    this.loggerService.logChange('ticket', 'reject', req.user.name, id);
    return this.ticketService.reject(id);
  }

  /*
  Input: id: string, updateTicketDto: UpdateTicketDto
  Output: Promise<Ticket>
  Return value: Updated ticket entity
  Function: Updates a ticket by id
  Variables: id, updateTicketDto
  Route: PATCH /ticket/:id
  Access: Admin
  Method: PATCH
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  @ApiBearerAuth()
  @Auth(RoleEnum.ADMIN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTicketDto: UpdateTicketDto) {
    return this.ticketService.update(id, updateTicketDto);
  }

  /*
  Input: id: string
  Output: Promise<Ticket>
  Return value: Deleted ticket entity
  Function: Deletes a ticket by id
  Variables: id
  Route: DELETE /ticket/:id
  Access: Admin
  Method: DELETE
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  @ApiBearerAuth()
  @Auth(RoleEnum.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ticketService.remove(id);
  }
}
