import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CardDto } from './dto/card.dto';
import { Card } from './entities/card.entity';

@Injectable()
export class CardService {
  constructor(
    @InjectRepository(Card)
    private cardRepository: Repository<Card>,
  ) { }

  async create(cardDto: CardDto): Promise<CardDto> {
    
    const { max: maxRank } = await this.cardRepository
      .createQueryBuilder('card')
      .select('MAX(card.rank)', 'max')
      .where('card.column.id = :columnId', { columnId: cardDto.columnId })
      .getRawOne()

    const newRank = maxRank !== null ? +maxRank + 1 : 1

    const newCard = this.cardRepository.create({
      column: { id: cardDto.columnId },
      name: cardDto.name,
      rank: newRank
    })

    const card = await this.cardRepository.save(newCard)

    return new CardDto(card.id, card.name, cardDto.columnId)
  }

  async update(cardDto: CardDto) {
    return await this.cardRepository.update(cardDto.id, { ...cardDto })
  }

  async remove(id: string) {
    return await this.cardRepository.delete({ id })
  }
}