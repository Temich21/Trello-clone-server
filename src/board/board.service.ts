import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { Board } from './entities/board.entity';
import { Column } from 'src/column/entities/column.entity';
import { ColumnService } from 'src/column/column.service'

export interface BoardResponse {
    id: string,
    name: string
    columns?: Column[]
}

@Injectable()
export class BoardService {
    constructor(
        @InjectRepository(Board)
        private boardRepository: Repository<Board>,
        private columnService: ColumnService,
    ) { }

    async create(createBoardDto: CreateBoardDto): Promise<BoardResponse> {
        const newBoard = this.boardRepository.create({
            user: { id: createBoardDto.userId },
            name: createBoardDto.name
        })
        const board = await this.boardRepository.save(newBoard)
        return { id: board.id, name: board.name }
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

        // board!!.columns = await this.columnService.findAll(id)
        
        return board!!
    }

    async update(id: string, updateBoardDto: UpdateBoardDto) {
        return await this.boardRepository.update(id, { ...updateBoardDto })
    }

    async remove(id: string) {
        return await this.boardRepository.delete({ id })
    }
}