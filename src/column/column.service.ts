import { Injectable } from '@nestjs/common';
import { ColumnRepository } from './column.repository';
import { ColumnDto } from './dto/column.dto';

@Injectable()
export class ColumnService {
  constructor(private readonly columnRepository: ColumnRepository) {}

  async create(columnDto: ColumnDto): Promise<ColumnDto> {
    const column = await this.columnRepository.create(columnDto)
    return new ColumnDto(column.id, column.name, column.board.id)
  }

  async update(columnDto: ColumnDto): Promise<void> {
    await this.columnRepository.update(columnDto)
  }

  async changeRank(columnDto: ColumnDto): Promise<void> {
    await this.columnRepository.changeRank(columnDto)
  }

  async remove(id: string): Promise<void> {
    await this.columnRepository.remove(id)
  }
}
