import { InjectRepository } from '@nestjs/typeorm';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { ColumnDto } from './dto/column.dto';
import { Column } from './entities/column.entity';

@Injectable()
export class ColumnService {
    constructor(
        @InjectRepository(Column)
        private columnRepository: Repository<Column>,
        private dataSource: DataSource
    ) { }

    //Transaction?
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
        const queryRunner = this.dataSource.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction()

        try {
            const updateResult = await queryRunner.manager.update(Column, columnDto.id, columnDto)
            if (updateResult.affected === 0) {
                throw new NotFoundException(`Cannot find column with id ${columnDto.id}`)
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
            const deleteResult = await queryRunner.manager.delete(Column, id)
            if (deleteResult.affected === 0) {
                throw new NotFoundException(`Cannot find column with id ${id}`)
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