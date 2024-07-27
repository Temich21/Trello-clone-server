import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AccessJwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService
  ) {
    super()
  }

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest()

    const authorizationHeader = request.headers.authorization
    if (!authorizationHeader) {
      throw new UnauthorizedException('Authorization header not found')
    }

    const token = authorizationHeader.split(' ')[1]
    if (!token) {
      throw new UnauthorizedException('Token not found')
    }

    const userData = this.jwtService.verify(token, { secret: this.configService.get<string>('JWT_ACCESS_SECRET') })
    if (!userData) {
      throw new UnauthorizedException('Invalid token')
    }

    return true
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

    const refreshToken = request.cookies['refreshToken']
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found')
    }

    const userData = this.jwtService.verify(refreshToken, { secret: this.configService.get<string>('JWT_REFRESH_SECRET') })
    if (!userData) {
      throw new UnauthorizedException('Invalid refresh token')
    }

    return true
  }
}