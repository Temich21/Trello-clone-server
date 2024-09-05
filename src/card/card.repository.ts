import { Injectable, NotFoundException } from '@nestjs/common';
import { EntityManager, DataSource } from 'typeorm';
import { Card } from './entities/card.entity';
import { CardDto } from './dto/card.dto';

@Injectable()
export class CardRepository {
  constructor(private dataSource: DataSource) {}

  async create(cardDto: CardDto): Promise<Card> {
    return await this.dataSource.transaction(async (manager: EntityManager) => {
      const newCard = manager.create(Card, {
        column: { id: cardDto.columnId },
        name: cardDto.name,
        rank: await this.newMaxRank(cardDto.columnId, manager),
      });

      return await manager.save(newCard)
    });
  }

  private async newMaxRank(columnId: string, manager: EntityManager): Promise<number> {
    const { max: maxRank } = await manager
      .createQueryBuilder(Card, 'card')
      .select('MAX(card.rank)', 'max')
      .where('card.column.id = :columnId', { columnId })
      .getRawOne()

    return maxRank !== null ? +maxRank + 1 : 1
  }

  async update(cardDto: CardDto): Promise<void> {
    await this.dataSource.transaction(async (manager: EntityManager) => {
      const updateResult = await manager.update(Card, cardDto.id, cardDto)
      if (updateResult.affected === 0) {
        throw new NotFoundException(`Cannot find card with id ${cardDto.id}`)
      }
    });
  }

  async changeRank(cardDto: CardDto): Promise<void> {
    await this.dataSource.transaction(async (manager: EntityManager) => {
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
          .set({ rank: () => 'rank - 1' })
          .where('column.id = :columnId', { columnId: cardDto.columnId })
          .andWhere('rank > :currentRank AND rank <= :newRank', { currentRank, newRank })
          .execute()
      } else {
        await manager
          .createQueryBuilder()
          .update(Card)
          .set({ rank: () => 'rank + 1' })
          .where('column.id = :columnId', { columnId: cardDto.columnId })
          .andWhere('rank < :currentRank AND rank >= :newRank', { currentRank, newRank })
          .execute()
      }

      card.rank = newRank
      await manager.save(Card, card)
    })
  }

  async remove(id: string): Promise<void> {
    await this.dataSource.transaction(async (manager: EntityManager) => {
      const deleteResult = await manager.delete(Card, id);
      if (deleteResult.affected === 0) {
        throw new NotFoundException(`Cannot find card with id ${id}`)
      }
    })
  }
}
