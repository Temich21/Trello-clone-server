import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { User } from './auth/entities/user.entity';
import { TokenModule } from './auth/token/token.module';
import { BoardModule } from './board/board.module';
import { Board } from './board/entities/board.entity';
import { ColumnModule } from './column/column.module';
import { CardModule } from './card/card.module';
import { Column } from './column/entities/column.entity';
import { Card } from './card/entities/card.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      password: '12345',
      username: 'postgres',
      entities: [User, Board, Column, Card],
      database: 'postgres',
      synchronize: true,
      schema: 'trello-clone'
    }),
    AuthModule,
    TokenModule,
    BoardModule,
    ColumnModule,
    CardModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }