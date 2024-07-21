import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { Card } from './entities/card.entity';

export interface CardResponse {
  id: string,
  name: string
}

@Injectable()
export class CardService {
  constructor(
    @InjectRepository(Card)
    private cardRepository: Repository<Card>,
  ) { }

  async create(CreateCardDto: CreateCardDto): Promise<CardResponse> {
    const newCard = this.cardRepository.create({
      column: { id: CreateCardDto.columnId },
      name: CreateCardDto.name
    })
    const card = await this.cardRepository.save(newCard)
    return { id: card.id, name: card.name }
  }

  async findAll(columnId: string): Promise<Card[]> {
    return await this.cardRepository.find({
      where: { column: { id: columnId } },
      // order: { rank: "ASC"},
      relations: ['column'],
    })
  }

  async update(id: string, updateCardDto: UpdateCardDto) {
    return await this.cardRepository.update(id, { ...updateCardDto })
  }

  async remove(id: string) {
    return await this.cardRepository.delete({ id })
  }
}