import { Body, Controller, Get, HttpException, HttpStatus, Next, Post, Req, Res, UsePipes } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response, NextFunction } from 'express';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

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
            const deviceIP = req.ip
            const userData = await this.authService.singup(createUserDto, deviceIP)
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
        @Body() loginUserDto: LoginUserDto,
        @Res({ passthrough: true }) res: Response,
        @Next() next: NextFunction
    ) {
        try {
            const deviceIP = req.ip
            const userData = await this.authService.login(loginUserDto, deviceIP)
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

    @Get('logout')
    async logout(
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response,
        @Next() next: NextFunction
    ) {
        try {
            const { refreshToken } = req.cookies
            const deviceIP = req.ip
            await this.authService.logout(refreshToken, deviceIP)
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
            const deviceIP = req.ip
            const userData = await this.authService.refresh(refreshToken, deviceIP)
            res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })
            return res.json(userData)
        } catch (e) {
            return next(new HttpException({
                status: HttpStatus.FORBIDDEN,
                error: 'Error during logout',
            }, HttpStatus.FORBIDDEN, {
                cause: e
            }))
        }
    }
}