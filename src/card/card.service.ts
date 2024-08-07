import { InjectRepository } from '@nestjs/typeorm';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { CardDto } from './dto/card.dto';
import { Card } from './entities/card.entity';

@Injectable()
export class CardService {
  constructor(
    @InjectRepository(Card)
    private cardRepository: Repository<Card>,
    private dataSource: DataSource
  ) { }

  //Transaction?
  async create(cardDto: CardDto): Promise<CardDto> {
    const { max: maxRank } = await this.cardRepository
      .createQueryBuilder('card')
      .select('MAX(card.rank)', 'max')
      .where('card.column.id = :columnId', { columnId: cardDto.columnId })
      .getRawOne()

    const newRank = maxRank !== null ? +maxRank + 1 : 1

    const newCard = this.cardRepository.create({
      column: { id: cardDto.columnId },
      name: cardDto.name,
      rank: newRank
    })

    const card = await this.cardRepository.save(newCard)

    return new CardDto(card.id, card.name, cardDto.columnId)
  }

  async update(cardDto: CardDto) {
    const queryRunner = this.dataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()

    try {
      const updateResult = await queryRunner.manager.update(Card, cardDto.id, cardDto)
      if (updateResult.affected === 0) {
        throw new NotFoundException(`Cannot find card with id ${cardDto.id}`)
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
      const deleteResult = await queryRunner.manager.delete(Card, id)
      if (deleteResult.affected === 0) {
        throw new NotFoundException(`Cannot find card with id ${id}`)
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