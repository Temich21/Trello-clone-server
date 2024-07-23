import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { ResponseBoardDto } from './dto/response-board.dto';
import { Board } from './entities/board.entity';

@Injectable()
export class BoardService {
    constructor(
        @InjectRepository(Board)
        private boardRepository: Repository<Board>,
    ) { }

    async create(createBoardDto: CreateBoardDto): Promise<ResponseBoardDto> {
        const { max: maxRank } = await this.boardRepository
            .createQueryBuilder('board')
            .select('MAX(board.rank)', 'max')
            .where('board.user.id = :userId', { userId: createBoardDto.userId })
            .getRawOne()

        const newRank = maxRank !== null ? +maxRank + 1 : 1

        const newBoard = this.boardRepository.create({
            user: { id: createBoardDto.userId },
            name: createBoardDto.name,
            rank: newRank
        })

        const board = await this.boardRepository.save(newBoard)

        return new ResponseBoardDto(board.id, board.name)
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

    async update(updateBoardDto: UpdateBoardDto) {
        return await this.boardRepository.update(updateBoardDto.id, { ...updateBoardDto })
    }

    async remove(id: string) {
        return await this.boardRepository.delete({ id })
    }
}