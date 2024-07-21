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

    async create(createColumnDto: CreateColumnDto): Promise<ColumnResponse> {
        const newColumn = this.columnRepository.create({
            board: { id: createColumnDto.boardId },
            name: CreateColumnDto.name
        })
        // Add response dto
        const column = await this.columnRepository.save(newColumn)
        return { id: column.id, name: column.name }
    }

    async findAll(boardId: string): Promise<Column[]> {
        const columns = await this.columnRepository.find({
            where: { board: { id: boardId } },
            relations: ['board'],
        })

        const columnsWithCards = await Promise.all(
            columns.map(async (column) => {
                const cards = await this.cardService.findAll(column.id)
                return { ...column, cards }
            })
        )

        return columnsWithCards
    }

    async update(updateColumnDto: UpdateColumnDto) {
        return await this.columnRepository.update(updateColumnDto.id, { ...updateColumnDto })
    }

    async remove(id: string) {
        return await this.columnRepository.delete({ id })
    }
}