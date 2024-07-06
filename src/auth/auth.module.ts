import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service';
import { TokenModule } from 'src/auth/token/token.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User]), TokenModule],
  controllers: [AuthController],
  providers: [AuthService],
})

export class AuthModule {
  constructor(private AuthService: AuthService) { }
}