import { Body, Controller, Get, HttpException, HttpStatus, Next, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response, NextFunction } from 'express';
import { CreateUserDto } from './dto/create-user.dto';
import { CredentialsDto } from './dto/credentials.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('singup')
    async singup(
        @Req() req: Request,
        @Body() createUserDto: CreateUserDto,
        @Res({ passthrough: true }) res: Response,
        @Next() next: NextFunction
    ) {
        try {
            const userData = await this.authService.singup(createUserDto)
            res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })
            return res.json(userData)
        } catch (e) {
            return next(new HttpException({
                status: HttpStatus.FORBIDDEN,
                error: 'Error during registration',
            }, HttpStatus.FORBIDDEN, {
                cause: e
            }))
        }
    }

    @Post('login')
    async login(
        @Req() req: Request,
        @Body() loginUserDto: CredentialsDto,
        @Res({ passthrough: true }) res: Response,
        @Next() next: NextFunction
    ) {
        try {
            const userData = await this.authService.login(loginUserDto)
            res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })
            return res.json(userData)
        } catch (e) {
            return next(new HttpException({
                status: HttpStatus.FORBIDDEN,
                error: 'Error during login',
            }, HttpStatus.FORBIDDEN, {
                cause: e
            }))
        }
    }

    @Get('logout')
    async logout(
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response,
        @Next() next: NextFunction
    ) {
        try {
            res.clearCookie('refreshToken')
        } catch (e) {
            return next(new HttpException({
                status: HttpStatus.FORBIDDEN,
                error: 'Error during logout',
            }, HttpStatus.FORBIDDEN, {
                cause: e
            }))
        }
    }

    @Get('refresh')
    async refresh(
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response,
        @Next() next: NextFunction
    ) {
        try {
            const { refreshToken } = req.cookies
            const userData = await this.authService.refresh(refreshToken)
            res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })
            return res.json(userData)
        } catch (e) {
            return next(new HttpException({
                status: HttpStatus.FORBIDDEN,
                error: 'Error during refresh',
            }, HttpStatus.FORBIDDEN, {
                cause: e
            }))
        }
    }
}