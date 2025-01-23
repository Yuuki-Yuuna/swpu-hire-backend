import { Injectable, HttpStatus } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { AES, enc } from 'crypto-js'
import { createResponse } from '@/common/response'
import { cryptoKey } from '@/common/sercet-key'
import { User } from './schema/user.schema'

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService
  ) {}

  async login(encryptedUsername: string, encryptedPassword: string) {
    const uname = AES.encrypt(encryptedUsername, cryptoKey).toString()
    const pword = AES.encrypt(encryptedPassword, cryptoKey).toString()
    const username = AES.decrypt(uname, cryptoKey).toString(enc.Utf8)
    const password = AES.decrypt(pword, cryptoKey).toString(enc.Utf8)
    const result = await this.userModel.findOne({ username, password }).exec()
    if (!result) {
      return createResponse(null, { code: HttpStatus.UNAUTHORIZED, message: '用户名或密码错误' })
    }

    const payload = { sub: result.id as string, username: result.username }
    return createResponse({ token: this.jwtService.sign(payload) })
  }
}
