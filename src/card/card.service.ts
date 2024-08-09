import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { CardDto } from './dto/card.dto';
import { Card } from './entities/card.entity';

@Injectable()
export class CardService {
  constructor(
    private dataSource: DataSource
  ) { }

  async create(cardDto: CardDto): Promise<CardDto> {
    return await this.dataSource.transaction(async (manager: EntityManager) => {
      const newCard = manager.create(Card, {
        column: { id: cardDto.columnId },
        name: cardDto.name,
        rank: await this.newMaxRank(cardDto.columnId, manager)
      });

      const card = await manager.save(newCard)
      return new CardDto(card.id, card.name, card.column.id)
    })
  }

  private async newMaxRank(CardId: string, manager: EntityManager) {
    const { max: maxRank } = await manager
      .createQueryBuilder(Card, 'card')
      .select('MAX(card.rank)', 'max')
      .where('card.column.id = :CardId', { CardId })
      .getRawOne()

    return maxRank !== null ? +maxRank + 1 : 1
  }

  async update(cardDto: CardDto) {
    return await this.dataSource.transaction(async (manager: EntityManager) => {
      const updateResult = await manager.update(Card, cardDto.id, cardDto)
      if (updateResult.affected === 0) {
        throw new NotFoundException(`Cannot find card with id ${cardDto.id}`)
      }
    })
  }

  async changeRank(cardDto: CardDto): Promise<void> {
    return await this.dataSource.transaction(async (manager: EntityManager) => {
      const card = await manager.findOne(Card, { where: { id: cardDto.id } })
      if (!card) {
        throw new NotFoundException(`Cannot find card with id ${cardDto.id}`)
      }

      const currentRank = card.rank
      const newRank = cardDto.rank

      if (currentRank === newRank) {
        return
      }

      if (currentRank < newRank) {
        await manager
          .createQueryBuilder()
          .update(Card)
          .set({ rank: () => "rank - 1" })
          .where("column.id = :columnId", { columnId: cardDto.columnId })
          .andWhere("rank > :currentRank AND rank <= :newRank", { currentRank, newRank })
          .execute()
      } else {
        await manager
          .createQueryBuilder()
          .update(Card)
          .set({ rank: () => "rank + 1" })
          .where("column.id = :columnId", { columnId: cardDto.columnId })
          .andWhere("rank < :currentRank AND rank >= :newRank", { currentRank, newRank })
          .execute()
      }

      card.rank = newRank
      await manager.save(Card, card)
    })
  }

  async remove(id: string) {
    return await this.dataSource.transaction(async (manager: EntityManager) => {
      const deleteResult = await manager.delete(Card, id)
      if (deleteResult.affected === 0) {
        throw new NotFoundException(`Cannot find card with id ${id}`)
      }
    })
  }
}