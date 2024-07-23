import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateColumnDto } from './dto/create-column.dto';
import { UpdateColumnDto } from './dto/update-column.dto';
import { ResponseColumnDto } from './dto/response-column.dto';
import { Column } from './entities/column.entity';

@Injectable()
export class ColumnService {
    constructor(
        @InjectRepository(Column)
        private columnRepository: Repository<Column>,
    ) { }

    async create(createColumnDto: CreateColumnDto): Promise<ResponseColumnDto> {
        const { max: maxRank} = await this.columnRepository
            .createQueryBuilder('column')
            .select('MAX(column.rank)', 'max')
            .where('column.board.id = :boardId', { boardId: createColumnDto.boardId })
            .getRawOne()

        const newRank = maxRank !== null ? +maxRank + 1 : 1

        const newColumn = this.columnRepository.create({
            board: { id: createColumnDto.boardId },
            name: createColumnDto.name,
            rank: newRank
        })

        const column = await this.columnRepository.save(newColumn)

        return new ResponseColumnDto(column.id, column.name)
    }

    async update(updateColumnDto: UpdateColumnDto) {
        return await this.columnRepository.update(updateColumnDto.id, { ...updateColumnDto })
    }

    async remove(id: string) {
        return await this.columnRepository.delete({ id })
    }
}