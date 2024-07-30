import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { BoardDto } from './dto/board.dto';
import { Board } from './entities/board.entity';

@Injectable()
export class BoardService {
    constructor(
        @InjectRepository(Board)
        private boardRepository: Repository<Board>,
    ) { }

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

    async update(boardDto: BoardDto) {
        return await this.boardRepository.update(boardDto.id, boardDto)
    }

    async remove(id: string) {
        return await this.boardRepository.delete({ id })
    }
}