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

@Injectable()
export class UserGuard implements CanActivate {
  constructor(
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
      const payload = (await this.jwtService.verifyAsync(token, { secret: jwtKey })) as unknown
      // 在这里将 payload 挂载到请求对象上，以便可以在路由处理器中访问它
      request['user'] = payload
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
}
export const Token = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<Request>()
  return request['user'] as JwtPayload
})
