import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { User } from './auth/entities/user.entity';
import { Token } from './auth/token/token.entity';
import { TokenModule } from './auth/token/token.module';
import { BoardModule } from './board/board.module';
import { Board } from './board/entities/board.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      password: '12345',
      username: 'postgres',
      entities: [User, Token, Board],
      database: 'postgres',
      synchronize: true,
      schema:'trello-clone'
    }),
    AuthModule,
    TokenModule,
    BoardModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}