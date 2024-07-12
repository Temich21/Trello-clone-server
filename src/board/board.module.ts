import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ColumnModule } from 'src/column/column.module';
import { BoardController } from './board.controller';
import { BoardService } from './board.service';
import { Board } from './entities/board.entity';
import { Column } from 'src/column/entities/column.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Board, Column]), ColumnModule],
  controllers: [BoardController],
  providers: [BoardService],
})
export class BoardModule { }
