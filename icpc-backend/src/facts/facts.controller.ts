import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete
} from '@nestjs/common';
import { FactsService } from './facts.service';
import { CreateFactDto } from './dto/create-fact.dto';
import { UpdateFactDto } from './dto/update-fact.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('facts')
export class FactsController {
  constructor(private readonly factsService: FactsService) {}

  /*
  Input: createFactDto: CreateFactDto
  Output: Promise<Fact>
  Return value: Created fact entity
  Function: Creates a new fact
  Variables: createFactDto
  Route: POST /facts
  Access: User
  Method: POST
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  @ApiBearerAuth()
  @Post()
  create(@Body() createFactDto: CreateFactDto) {
    return this.factsService.create(createFactDto);
  }

  /*
  Input: None
  Output: Promise<string>
  Return value: Random string
  Function: Retrieves a random fact
  Variables: None
  Route: GET /facts
  Access: Public
  Method: GET
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  @Get()
  findAll() {
    return this.factsService.findRandomOne();
  }

  /*
  Input: id: string
  Output: Promise<string>
  Return value: string
  Function: Retrieves a fact by id
  Variables: id
  Route: GET /facts/:id
  Access: Public
  Method: GET
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.factsService.findOne(+id);
  }

  /*
  Input: id: string, updateFactDto: UpdateFactDto
  Output: Promise<Fact>
  Return value: Updated fact entity
  Function: Updates a fact by id
  Variables: id, updateFactDto
  Route: PATCH /facts/:id
  Access: User
  Method: PATCH
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  @ApiBearerAuth()
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFactDto: UpdateFactDto) {
    return this.factsService.update(+id, updateFactDto);
  }

  /*
  Input: id: string
  Output: Promise<Fact>
  Return value: Deleted fact entity
  Function: Deletes a fact by id
  Variables: id
  Route: DELETE /facts/:id
  Access: User
  Method: DELETE
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  @ApiBearerAuth()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.factsService.remove(+id);
  }
}
