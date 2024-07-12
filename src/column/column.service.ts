import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateColumnDto } from './dto/create-column.dto';
import { UpdateColumnDto } from './dto/update-column.dto';
import { Column } from './entities/column.entity';
import { Card } from 'src/card/entities/card.entity';
import { CardService } from 'src/card/card.service'

export interface ColumnResponse {
    id: string,
    name: string,
    cards?: Card[]
}

@Injectable()
export class ColumnService {
    constructor(
        @InjectRepository(Column)
        private columnRepository: Repository<Column>,
        private cardService: CardService,
    ) { }

    async create(CreateColumnDto: CreateColumnDto): Promise<ColumnResponse> {
        const newColumn = this.columnRepository.create({
            board: { id: CreateColumnDto.boardId },
            name: CreateColumnDto.name
        })
        const column = await this.columnRepository.save(newColumn)
        return { id: column.id, name: column.name }
    }

    async findAll(boardId: string): Promise<Column[]> {
        const columns = await this.columnRepository.find({
            where: { board: { id: boardId } },
            relations: ['board'],
        })

        columns.forEach(async (column) => {
            const cards = await this.cardService.findAll(column.id)
            column.cards = cards
            return column
        })

        return columns
    }

    async update(id: string, updateColumnDto: UpdateColumnDto) {
        return await this.columnRepository.update(id, { ...updateColumnDto })
    }

    async remove(id: string) {
        return await this.columnRepository.delete({ id })
    }
}