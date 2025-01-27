import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { Column } from './entities/column.entity';
import { ColumnDto } from './dto/column.dto';

@Injectable()
export class ColumnRepository {
  constructor(private readonly dataSource: DataSource) {}

  async create(columnDto: ColumnDto): Promise<Column> {
    return await this.dataSource.transaction(async (manager: EntityManager) => {
      const newColumn = manager.create(Column, {
        board: { id: columnDto.boardId },
        name: columnDto.name,
        rank: await this.newMaxRank(columnDto.boardId, manager),
      })

      return await manager.save(newColumn)
    })
  }

  private async newMaxRank(boardId: string, manager: EntityManager): Promise<number> {
    const { max: maxRank } = await manager
      .createQueryBuilder(Column, 'column')
      .select('MAX(column.rank)', 'max')
      .where('column.board.id = :boardId', { boardId })
      .getRawOne()

    return maxRank !== null ? +maxRank + 1 : 1
  }

  async update(columnDto: ColumnDto): Promise<void> {
    await this.dataSource.transaction(async (manager: EntityManager) => {
      const updateResult = await manager.update(Column, columnDto.id, columnDto)
      if (updateResult.affected === 0) {
        throw new NotFoundException(`Cannot find column with id ${columnDto.id}`)
      }
    })
  }

  async changeRank(columnDto: ColumnDto): Promise<void> {
    await this.dataSource.transaction(async (manager: EntityManager) => {
      const column = await manager.findOne(Column, { where: { id: columnDto.id } })
      if (!column) {
        throw new NotFoundException(`Cannot find column with id ${columnDto.id}`)
      }

      const currentRank = column.rank
      const newRank = columnDto.rank

      if (currentRank === newRank) {
        return;
      }

      if (currentRank < newRank) {
        await manager
          .createQueryBuilder()
          .update(Column)
          .set({ rank: () => 'rank - 1' })
          .where('board.id = :boardId', { boardId: columnDto.boardId })
          .andWhere('rank > :currentRank AND rank <= :newRank', { currentRank, newRank })
          .execute()
      } else {
        await manager
          .createQueryBuilder()
          .update(Column)
          .set({ rank: () => 'rank + 1' })
          .where('board.id = :boardId', { boardId: columnDto.boardId })
          .andWhere('rank < :currentRank AND rank >= :newRank', { currentRank, newRank })
          .execute()
      }

      column.rank = newRank;
      await manager.save(Column, column);
    })
  }

  async remove(id: string): Promise<void> {
    await this.dataSource.transaction(async (manager: EntityManager) => {
      const deleteResult = await manager.delete(Column, id);
      if (deleteResult.affected === 0) {
        throw new NotFoundException(`Cannot find column with id ${id}`);
      }
    })
  }
}
