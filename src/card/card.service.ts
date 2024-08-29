import { Injectable } from '@nestjs/common';
import { CardRepository } from './card.repository';
import { CardDto } from './dto/card.dto';

@Injectable()
export class CardService {
  constructor(private readonly cardRepository: CardRepository) {}

  async create(cardDto: CardDto): Promise<CardDto> {
    const card = await this.cardRepository.create(cardDto)
    return new CardDto(card.id, card.name, card.column.id)
  }

  async update(cardDto: CardDto): Promise<void> {
    await this.cardRepository.update(cardDto)
  }

  async changeRank(cardDto: CardDto): Promise<void> {
    await this.cardRepository.changeRank(cardDto)
  }

  async remove(id: string): Promise<void> {
    await this.cardRepository.remove(id)
  }
}
