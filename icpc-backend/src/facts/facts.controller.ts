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

  @ApiBearerAuth()
  @Post()
  create(@Body() createFactDto: CreateFactDto) {
    return this.factsService.create(createFactDto);
  }

  @Get()
  findAll() {
    return this.factsService.findRandomOne();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.factsService.findOne(+id);
  }

  @ApiBearerAuth()
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFactDto: UpdateFactDto) {
    return this.factsService.update(+id, updateFactDto);
  }

  @ApiBearerAuth()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.factsService.remove(+id);
  }
}
