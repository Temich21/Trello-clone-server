import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, Next, Res } from '@nestjs/common';
import { CardService } from './card.service';
import { CardDto } from './dto/card.dto';

@Controller('card')
export class CardController {
  constructor(private readonly cardService: CardService) { }

  @Post()
  async create(
    @Body() cardDto: CardDto,
  ) {
    return await this.cardService.create(cardDto)
  }

  @Patch()
  async update(
    @Body() cardDto: CardDto
  ) {
    await this.cardService.update(cardDto)
    return cardDto
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
  ) {
    await this.cardService.remove(id)
    return id
  }
}