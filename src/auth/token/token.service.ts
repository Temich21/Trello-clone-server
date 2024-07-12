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
        private jwtService: JwtService,
    ) { }

    generateTokens(payload: Partial<User>): AuthTokens {
        const accessToken = this.jwtService.sign(payload, {
            secret: process.env.JWT_ACCESS_SECRET,
            expiresIn: '30m'
        } as JwtSignOptions)

        const refreshToken = this.jwtService.sign(payload, {
            secret: process.env.JWT_REFRESH_SECRET,
            expiresIn: '30d'
        } as JwtSignOptions)

        return { accessToken, refreshToken }
    }
    
    validateAccessToken(token: string) {
        return this.jwtService.verify(token, { secret: process.env.JWT_ACCESS_SECRET })
    }

}