import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ColumnService } from './column.service';
import { CreateColumnDto } from './dto/create-column.dto';
import { UpdateColumnDto } from './dto/update-column.dto';

@Controller('column')
export class ColumnController {
  constructor(private readonly columnService: ColumnService) { }

  @Post()
  async create(
    @Body() createColumndDto: CreateColumnDto,
  ) {
    return await this.columnService.create(createColumndDto)
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateColumnDto: UpdateColumnDto
  ) {
    await this.columnService.update(id, updateColumnDto)
    return { id, ...updateColumnDto }
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
  ) {
    await this.columnService.remove(id)
    return id
  }
}