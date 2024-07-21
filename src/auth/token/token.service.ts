import { Injectable, Scope } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { User } from 'src/auth/entities/user.entity';

interface AuthTokens {
    accessToken: string
    refreshToken: string
}

//Scope?
@Injectable()
export class TokenService {
    constructor(
        private accessSecret = process.env.JWT_ACCESS_SECRET,
        private jwtService: JwtService,
    ) { }

    generateTokens(payload: Partial<User>): AuthTokens {
        const accessToken = this.jwtService.sign(payload, {
            secret: this.accessSecret,
            expiresIn: process.env.JWT_ACCESS_TOKEN_TIME
        } as JwtSignOptions)

        const refreshToken = this.jwtService.sign(payload, {
            secret: process.env.JWT_REFRESH_SECRET,
            expiresIn: process.env.JWT_REFRESH_TOKEN_TIME
        } as JwtSignOptions)

        return { accessToken, refreshToken }
    }

    validateAccessToken(token: string) {
        return this.jwtService.verify(token, { secret: process.env.JWT_ACCESS_SECRET })
    }

}