import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { ResponseCardDto } from './dto/response-card.dto';
import { Card } from './entities/card.entity';

@Injectable()
export class CardService {
  constructor(
    @InjectRepository(Card)
    private cardRepository: Repository<Card>,
  ) { }

  async create(CreateCardDto: CreateCardDto): Promise<ResponseCardDto> {
    const { max: maxRank } = await this.cardRepository
      .createQueryBuilder('card')
      .select('MAX(card.rank)', 'max')
      .where('card.column.id = :columnId', { columnId: CreateCardDto.columnId })
      .getRawOne()

    const newRank = maxRank !== null ? +maxRank + 1 : 1

    const newCard = this.cardRepository.create({
      column: { id: CreateCardDto.columnId },
      name: CreateCardDto.name,
      rank: newRank
    })

    const card = await this.cardRepository.save(newCard)

    return new ResponseCardDto(card.id, card.name)
  }

  async update(updateCardDto: UpdateCardDto) {
    return await this.cardRepository.update(updateCardDto.id, { ...updateCardDto })
  }

  async remove(id: string) {
    return await this.cardRepository.delete({ id })
  }
}