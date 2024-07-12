import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, Next, Res } from '@nestjs/common';
import { CardService } from './card.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';

@Controller('card')
export class CardController {
  constructor(private readonly cardService: CardService) { }

  @Post()
  async create(
    @Body() createCardDto: CreateCardDto,
  ) {
    return await this.cardService.create(createCardDto)
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCardDto: UpdateCardDto
  ) {
    await this.cardService.update(id, updateCardDto)
    return { id, ...updateCardDto }
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
  ) {
    await this.cardService.remove(id)
    return id
  }
}