import { Injectable, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { Token } from './token.entity'
import { User } from 'src/auth/entities/user.entity';

interface AuthTokens {
    accessToken: string
    refreshToken: string
}

//Scope?
@Injectable()
export class TokenService {
    constructor(
        @InjectRepository(Token)
        private tokenRepository: Repository<Token>,
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

    async saveToken(userId: string, refreshToken: string, deviceIP: string): Promise<void> {
        const existingToken = await this.tokenRepository.findOne({
            where: { user: { id: userId }, deviceIP },
            relations: ['user']
        })

        if (existingToken) {
            existingToken.token = refreshToken
            await this.tokenRepository.save(existingToken)
        } else {
            const newToken = this.tokenRepository.create({
                user: { id: userId },
                token: refreshToken,
                deviceIP
            })
            await this.tokenRepository.save(newToken)
        }
    }

    async removeToken(refreshToken: string, deviceIP: string): Promise<void> {
        await this.tokenRepository.delete({ token: refreshToken, deviceIP })
    }

    validateAccessToken(token: string) {
        return this.jwtService.verify(token, { secret: process.env.JWT_ACCESS_SECRET })
    }

    async findToken(refreshToken: string, deviceIP: string): Promise<Token> {
        return this.tokenRepository.findOne({
            where: { token: refreshToken, deviceIP }
        })
    }

}