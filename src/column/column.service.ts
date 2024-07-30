import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ColumnDto } from './dto/column.dto';
import { Column } from './entities/column.entity';

@Injectable()
export class ColumnService {
    constructor(
        @InjectRepository(Column)
        private columnRepository: Repository<Column>,
    ) { }

    async create(columnDto: ColumnDto): Promise<ColumnDto> {
        const { max: maxRank } = await this.columnRepository
            .createQueryBuilder('column')
            .select('MAX(column.rank)', 'max')
            .where('column.board.id = :boardId', { boardId: columnDto.boardId })
            .getRawOne()

        const newRank = maxRank !== null ? +maxRank + 1 : 1

        const newColumn = this.columnRepository.create({
            board: { id: columnDto.boardId },
            name: columnDto.name,
            rank: newRank
        })

        const column = await this.columnRepository.save(newColumn)

        return new ColumnDto(column.id, column.name, columnDto.boardId)
    }

    async update(columnDto: ColumnDto) {
        await this.columnRepository.update(columnDto.id, { ...columnDto })
    }

    async remove(id: string) {
        return await this.columnRepository.delete({ id })
    }
}