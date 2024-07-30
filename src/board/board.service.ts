import { InjectRepository } from '@nestjs/typeorm';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Repository, DataSource, QueryRunner } from 'typeorm';
import { BoardDto } from './dto/board.dto';
import { Board } from './entities/board.entity';

@Injectable()
export class BoardService {
    constructor(
        @InjectRepository(Board)
        private boardRepository: Repository<Board>,
        private dataSource: DataSource
    ) { }

    // async create(boardDto: BoardDto): Promise<BoardDto> {
    //     const queryRunner = this.dataSource.createQueryRunner()
    //     await queryRunner.connect()
    //     await queryRunner.startTransaction()

    //     try {
    //         const newBoard = this.boardRepository.create({
    //             user: { id: boardDto.userId },
    //             name: boardDto.name,
    //             rank: await this.newMaxRank(boardDto.userId, queryRunner)
    //         })

    //         const board = await queryRunner.manager.save(newBoard)

    //         await queryRunner.commitTransaction()
    //         return new BoardDto(board.id, board.name, boardDto.userId)
    //     } catch (err) {
    //         await queryRunner.rollbackTransaction()
    //         throw err
    //     } finally {
    //         await queryRunner.release()
    //     }
    // }

    // private async newMaxRank(userId: string, queryRunner: QueryRunner): Promise<number> {
    //     const { max: maxRank } = await queryRunner.manager
    //         .createQueryBuilder(Board, 'board')
    //         .select('MAX(board.rank)', 'max')
    //         .where('board.user.id = :userId', { userId: userId })
    //         .getRawOne();

    //     return maxRank !== null ? +maxRank + 1 : 1;
    // }
    // Нужен ли транзакция для create
    async create(boardDto: BoardDto): Promise<BoardDto> {
        const newBoard = this.boardRepository.create({
            user: { id: boardDto.userId },
            name: boardDto.name,
            rank: await this.newMaxRank(boardDto.userId)
        })

        const board = await this.boardRepository.save(newBoard)

        return new BoardDto(board.id, board.name, boardDto.userId)
    }

    private async newMaxRank(userId: string) {
        const { max: maxRank } = await this.boardRepository
            .createQueryBuilder('board')
            .select('MAX(board.rank)', 'max')
            .where('board.user.id = :userId', { userId: userId })
            .getRawOne()

        return maxRank !== null ? +maxRank + 1 : 1
    }

    async findAll(userId: string): Promise<Board[]> {
        return await this.boardRepository.find({
            where: { user: { id: userId } },
            relations: ['user'],
            order: { rank: 'ASC' }
        })
    }

    async findOne(id: string): Promise<Board> {
        const board = await this.boardRepository.createQueryBuilder('board')
            .leftJoinAndSelect('board.columns', 'columns')
            .leftJoinAndSelect('columns.cards', 'cards')
            .where('board.id = :id', { id })
            .orderBy('board.rank', 'ASC')
            .addOrderBy('columns.rank', 'ASC')
            .addOrderBy('cards.rank', 'ASC')
            .getOne()

        if (board == null) {
            throw new NotFoundException(`Cannot find board with id ${id}`)
        }

        return board
    }

    async update(boardDto: BoardDto): Promise<void> {
        const queryRunner = this.dataSource.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction()

        try {
            const updateResult = await queryRunner.manager.update(Board, boardDto.id, boardDto)
            if (updateResult.affected === 0) {
                throw new NotFoundException(`Cannot find board with id ${boardDto.id}`)
            }

            await queryRunner.commitTransaction()
        } catch (err) {
            await queryRunner.rollbackTransaction()
            throw new BadRequestException(err)
        } finally {
            await queryRunner.release()
        }
    }

    async remove(id: string) {
        const queryRunner = this.dataSource.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction()

        try {
            const deleteResult = await queryRunner.manager.delete(Board, id)
            if (deleteResult.affected === 0) {
                throw new NotFoundException(`Cannot find board with id ${id}`)
            }

            await queryRunner.commitTransaction()
        } catch (err) {
            await queryRunner.rollbackTransaction()
            throw new BadRequestException(err)
        } finally {
            await queryRunner.release()
        }
    }
}