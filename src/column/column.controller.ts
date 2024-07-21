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

  @Patch()
  async update(
    @Body() updateColumnDto: UpdateColumnDto
  ) {
    await this.columnService.update(updateColumnDto)
    return { ...updateColumnDto }
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
  ) {
    await this.columnService.remove(id)
    return id
  }
}