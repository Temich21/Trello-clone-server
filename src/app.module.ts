import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { User } from './auth/entities/user.entity';
import { Token } from './auth/token/token.entity';
import { TokenModule } from './auth/token/token.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      password: '12345',
      username: 'postgres',
      entities: [User, Token],
      database: 'postgres',
      synchronize: true,
      schema:'trello-clone'
    }),
    AuthModule,
    TokenModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}