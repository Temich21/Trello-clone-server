import { Injectable, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hash, compare } from 'bcrypt'
import { TokenService } from 'src/auth/token/token.service';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { CredentialsDto } from './dto/credentials.dto';

interface UserResponse {
    id: string
    name: string
    email: string
}

interface AuthUser {
    accessToken: string
    refreshToken: string
    user: UserResponse
}

//Корректный ли использовал синглтон? Разобрать на созвоне
@Injectable({ scope: Scope.REQUEST })
export class AuthService {
    constructor(
        private tokenService: TokenService,
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) { }

    async singup({ name, email, password }: CreateUserDto): Promise<AuthUser> {
        const candidate = await this.userRepository.findOne({ where: { email } })
        if (candidate) {
            throw new Error(`User with this email ${email} already exist`)
        }

        const hashPassword = await hash(password, 3)
        const user = await this.userRepository.save(new User(name, email, hashPassword))

        const tokens = this.tokenService.generateTokens({ ...user })

        return { ...tokens, user: { id: user.id, name: user.name, email: user.email } }
    }

    async login({ email, password }: CredentialsDto): Promise<AuthUser> {
        const user = await this.userRepository.findOne({ where: { email } })
        if (!user) {
            throw new Error("User with this email doesn't exist")
        }

        const isPassEquals = await compare(password, user.password)
        if (!isPassEquals) {
            throw new Error("Incorrect password")
        }

        const tokens = this.tokenService.generateTokens({ ...user })

        return { ...tokens, user: { id: user.id, name: user.name, email: user.email } }
    }

    async refresh(refreshToken: string) {
        // const userDto = new UserDto()

        // const tokens = this.tokenService.generateTokens({ ...userDto })
        // await this.tokenService.saveToken(id, tokens.refreshToken)
        return
    }
}