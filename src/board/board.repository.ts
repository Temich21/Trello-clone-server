import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { Board } from './entities/board.entity';
import { BoardDto } from './dto/board.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class BoardRepository {
  constructor(
    @InjectRepository(Board)
    private readonly boardRepository: Repository<Board>,
    private readonly dataSource: DataSource
  ) {}

  async create(boardDto: BoardDto): Promise<Board> {
    return await this.dataSource.transaction(async (manager: EntityManager) => {
      const newBoard = this.boardRepository.create({
        user: { id: boardDto.userId },
        name: boardDto.name,
        rank: await this.newMaxRank(boardDto.userId, manager),
      });

      return await manager.save(newBoard)
    })
  }

  private async newMaxRank(userId: string, manager: EntityManager): Promise<number> {
    const { max: maxRank } = await manager
      .createQueryBuilder(Board, 'board')
      .select('MAX(board.rank)', 'max')
      .where('board.user.id = :userId', { userId })
      .getRawOne()

    return maxRank !== null ? +maxRank + 1 : 1
  }

  async update(boardDto: BoardDto): Promise<void> {
    await this.dataSource.transaction(async (manager: EntityManager) => {
      const updateResult = await manager.update(Board, boardDto.id, boardDto)
      if (updateResult.affected === 0) {
        throw new NotFoundException(`Cannot find board with id ${boardDto.id}`)
      }
    });
  }

  async changeRank(boardDto: BoardDto): Promise<void> {
    await this.dataSource.transaction(async (manager: EntityManager) => {
      const board = await manager.findOne(Board, { where: { id: boardDto.id } })
      if (!board) {
        throw new NotFoundException(`Cannot find board with id ${boardDto.id}`)
      }

      const currentRank = board.rank
      const newRank = boardDto.rank

      if (currentRank === newRank) {
        return;
      }

      if (currentRank < newRank) {
        await manager
          .createQueryBuilder()
          .update(Board)
          .set({ rank: () => 'rank - 1' })
          .where('user.id = :userId', { userId: boardDto.userId })
          .andWhere('rank > :currentRank AND rank <= :newRank', { currentRank, newRank })
          .execute();
      } else {
        await manager
          .createQueryBuilder()
          .update(Board)
          .set({ rank: () => 'rank + 1' })
          .where('user.id = :userId', { userId: boardDto.userId })
          .andWhere('rank < :currentRank AND rank >= :newRank', { currentRank, newRank })
          .execute();
      }

      board.rank = newRank
      await manager.save(Board, board)
    });
  }

  async remove(id: string): Promise<void> {
    await this.dataSource.transaction(async (manager: EntityManager) => {
      const deleteResult = await manager.delete(Board, id)
      if (deleteResult.affected === 0) {
        throw new NotFoundException(`Cannot find board with id ${id}`)
      }
    })
  }

  async findAll(userId: string): Promise<Board[]> {
    return await this.boardRepository.find({
      where: { user: { id: userId } },
      relations: ['user'],
      order: { rank: 'ASC' }
    });
  }

  async findOne(id: string): Promise<Board> {
    const board = await this.boardRepository.createQueryBuilder('board')
      .leftJoinAndSelect('board.columns', 'columns')
      .leftJoinAndSelect('columns.cards', 'cards')
      .where('board.id = :id', { id })
      .orderBy('board.rank', 'ASC')
      .addOrderBy('columns.rank', 'ASC')
      .addOrderBy('cards.rank', 'ASC')
      .getOne();

    if (board == null) {
      throw new NotFoundException(`Cannot find board with id ${id}`)
    }

    return board
  }
}
