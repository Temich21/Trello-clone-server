import { Controller, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ColumnService } from './column.service';
import { ColumnDto } from './dto/column.dto';

@Controller('column')
export class ColumnController {
  constructor(private readonly columnService: ColumnService) { }

  @Post()
  async create(
    @Body() columnDto: ColumnDto,
  ) {
    return await this.columnService.create(columnDto)
  }

  @Patch()
  async update(
    @Body() columnDto: ColumnDto
  ) {
    await this.columnService.update(columnDto)
    return columnDto
  }

  @Patch('rank')
  async changeRank(
    @Body() columnDto: ColumnDto
  ) {
    await this.columnService.changeRank(columnDto)
    return columnDto
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
  ) {
    await this.columnService.remove(id)
    return id
  }
}