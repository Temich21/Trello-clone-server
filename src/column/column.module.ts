import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CardModule } from 'src/card/card.module';
import { ColumnController } from './column.controller';
import { ColumnService } from './column.service';
import { Column } from './entities/column.entity';
import { Card } from 'src/card/entities/card.entity';
import { ColumnRepository } from './column.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Column, Card]), CardModule],
  controllers: [ColumnController],
  providers: [ColumnService, ColumnRepository],
  exports: [ColumnService],
})
export class ColumnModule { }
