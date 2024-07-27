import { Injectable, Scope } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { User } from 'src/auth/entities/user.entity';

interface AuthTokens {
    accessToken: string
    refreshToken: string
}

@Injectable()
export class TokenService {
    constructor(
        private jwtService: JwtService,
        private configService: ConfigService,
    ) { }

    generateTokens(payload: Partial<User>): AuthTokens {
        const accessToken = this.jwtService.sign(payload, {
            secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
            expiresIn: this.configService.get<string>('JWT_ACCESS_TOKEN_TIME'),
        } as JwtSignOptions)

        const refreshToken = this.jwtService.sign(payload, {
            secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
            expiresIn: this.configService.get<string>('JWT_REFRESH_TOKEN_TIME'),
        } as JwtSignOptions)

        return { accessToken, refreshToken }
    }
}