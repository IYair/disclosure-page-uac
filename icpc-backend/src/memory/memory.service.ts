import { Injectable } from '@nestjs/common';
import { CreateMemoryDto } from './dto/create-memory.dto';
import { UpdateMemoryDto } from './dto/update-memory.dto';
import { Memory } from './entities/memory.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class MemoryService {
  constructor(
    @InjectRepository(Memory)
    private readonly memoryRepository: Repository<Memory>
  ) {}

  async create(createMemoryDto: CreateMemoryDto) {
    let finalValue = 0;
    switch (createMemoryDto.id) {
      case 'MB':
        finalValue = createMemoryDto.value * 1024;
        break;
      case 'GB':
        finalValue = createMemoryDto.value * 1024 * 1024;
        break;
      default:
        finalValue = createMemoryDto.value;
        break;
    }
    const memory = await this.memoryRepository.findOneBy({
      memoryLimit: finalValue
    });
    if (memory) {
      return memory;
    } else return await this.memoryRepository.save({ memoryLimit: finalValue });
  }

  async findAll() {
    return await this.memoryRepository
      .createQueryBuilder('memory')
      .orderBy('memory.memoryLimit', 'ASC')
      .getMany();
  }

  async findOne(id: string) {
    return await this.memoryRepository.findOneBy({ id });
  }

  async update(id: string, updateMemoryDto: UpdateMemoryDto) {
    const memory = await this.memoryRepository.findOneBy({ id });
    return await this.memoryRepository.save({ ...memory, ...updateMemoryDto });
  }

  async remove(id: string) {
    const memory = await this.memoryRepository.findOneBy({ id });
    return await this.memoryRepository.remove(memory);
  }
}
