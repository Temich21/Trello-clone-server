import { BadRequestException, Injectable } from '@nestjs/common';
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
            secret: this.getAccessSecret(),
            expiresIn: this.getAccessTokenTime(),
        } as JwtSignOptions)

        const refreshToken = this.jwtService.sign(payload, {
            secret: this.getRefreshSecret(),
            expiresIn: this.getRefreshTokenTime(),
        } as JwtSignOptions)

        return { accessToken, refreshToken }
    }

    validateRefresh(refreshToken: string): User {
        const user = this.jwtService.verify(refreshToken, { secret: this.configService.get<string>('JWT_REFRESH_SECRET') })

        if (!user) {
            throw new BadRequestException('Invalid refresh token')
        }

        return user
    }

    private getAccessSecret() {
        return this.configService.get<string>('JWT_ACCESS_SECRET')
    }

    private getAccessTokenTime() {
        return this.configService.get<string>('JWT_ACCESS_TOKEN_TIME')
    }

    private getRefreshSecret() {
        return this.configService.get<string>('JWT_REFRESH_SECRET')
    }

    private getRefreshTokenTime() {
        return this.configService.get<string>('JWT_REFRESH_TOKEN_TIME')
    }

}