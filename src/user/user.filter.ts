import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common'
import { TokenExpiredError } from '@nestjs/jwt'
import { Response } from 'express'
import { createResponse } from '@/common/response'

@Catch(TokenExpiredError)
export class TokenExpiredErrorFilter implements ExceptionFilter {
  catch(exception: TokenExpiredError, host: ArgumentsHost) {
    const context = host.switchToHttp()
    const response = context.getResponse<Response>()

    response.json(createResponse(null, { code: 401, message: '登录过期' }))
  }
}
