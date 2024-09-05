import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class AccessJwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private reflector: Reflector,
  ) {
    super()
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ])
    if (isPublic) {
      return true
    }

    const request = context.switchToHttp().getRequest()

    const authorizationHeader = request.headers.authorization
    if (!authorizationHeader) {
      throw new UnauthorizedException('Authorization header not found')
    }

    const token = authorizationHeader.split(' ')[1]
    if (!token) {
      throw new UnauthorizedException('Token not found')
    }

    try {
      this.jwtService.verify(token, { secret: this.getAccessSecret() })
    } catch (e) {
      throw new UnauthorizedException('Invalid access token')
    }

    return true
  }

  private getAccessSecret() {
    return this.configService.get<string>('JWT_ACCESS_SECRET')
  }
}

@Injectable()
export class RefreshJwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService
  ) {
    super()
  }

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest()
    console.log('RefreshJwtAuthGuard');

    const refreshToken = request.cookies['refreshToken']
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found')
    }

    const userData = this.jwtService.verify(refreshToken, { secret: this.getRefreshSecret() })
    if (!userData) {
      throw new UnauthorizedException('Invalid refresh token')
    }

    return true
  }

  private getRefreshSecret() {
    return this.configService.get<string>('JWT_REFRESH_SECRET')
  }
}