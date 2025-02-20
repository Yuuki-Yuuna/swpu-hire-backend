import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  SetMetadata,
  createParamDecorator
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { JwtService, TokenExpiredError } from '@nestjs/jwt'
import { jwtKey } from '@/common/sercet-key'
import { Request } from 'express'
import { BlackListService } from './black-list.service'

@Injectable()
export class UserGuard implements CanActivate {
  constructor(
    private balckListService: BlackListService,
    private jwtService: JwtService,
    private reflector: Reflector
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublicRoute = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_ROUTE_KEY, [
      context.getHandler(),
      context.getClass()
    ])
    if (isPublicRoute) {
      return true // 公共接口
    }

    const request = context.switchToHttp().getRequest<Request>()
    const token = this.extractTokenFromHeader(request)
    if (!token) {
      throw new UnauthorizedException()
    }

    try {
      const payload: Omit<JwtPayload, 'token'> = await this.jwtService.verifyAsync(token, {
        secret: jwtKey
      })

      if (await this.balckListService.isTokenBlacklisted(token)) {
        throw new TokenExpiredError('Token已失效', new Date())
      }

      // 在这里将 payload 挂载到请求对象上，以便可以在路由处理器中访问它
      request['user'] = { ...payload, token }
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw error
      } else {
        throw new UnauthorizedException()
      }
    }

    return true
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? []
    return type === 'Bearer' ? token : undefined
  }
}

export const IS_PUBLIC_ROUTE_KEY = 'isPublic'
export const PublicRoute = () => SetMetadata(IS_PUBLIC_ROUTE_KEY, true)

export interface JwtPayload {
  sub: string // 用户id
  username: string // 用户名
  iat: number // 签发时间
  exp: number // 过期时间
  token: string // token字符串
}
export const Token = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<Request>()
  return request['user'] as JwtPayload
})
