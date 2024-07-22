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
        const newBoard = this.boardRepository.create({
            user: { id: createBoardDto.userId },
            name: createBoardDto.name
        })
        
        const board = await this.boardRepository.save(newBoard)
        
        return new ResponseBoardDto(board.id, board.name)
    }

    async findAll(userId: string): Promise<Board[]> {
        return await this.boardRepository.find({
            where: { user: { id: userId } },
            relations: ['user'],
        })
    }

    async findOne(id: string): Promise<Board> {
        const board = await this.boardRepository.findOne({
            where: { id },
            relations: ['columns', 'columns.cards'],
        })

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