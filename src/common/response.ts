import { HttpStatus } from '@nestjs/common'

export interface IResponse<T = any> {
  code: number
  message: string
  data: T
}

class Response<T = any> implements IResponse<T> {
  code: number
  message: string
  data: T

  constructor(data: T, code: number, message: string) {
    this.data = data
    this.code = code
    this.message = message
  }
}

export const createResponse = <T = any>(data: T, params?: { code?: number; message?: string }) => {
  const { code, message } = { code: HttpStatus.OK, message: '请求成功', ...params }
  return new Response(data, code, message)
}
