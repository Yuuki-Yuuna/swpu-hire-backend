import { Injectable, HttpStatus } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { AES, enc } from 'crypto-js'
import { createResponse } from '@/common/response'
import { cryptoKey } from '@/common/sercet-key'
import { BlackListService } from './black-list.service'
import { User } from './schema/user.schema'
import { ChangePasswordDto } from './uset.dto'
import { JwtPayload } from './user.guard'

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private blackListService: BlackListService,
    private jwtService: JwtService
  ) {}

  async login(encUsername: string, encPassword: string) {
    const username = AES.decrypt(encUsername, cryptoKey).toString(enc.Utf8)
    const password = AES.decrypt(encPassword, cryptoKey).toString(enc.Utf8)
    const result = await this.userModel.findOne({ username, password }).exec()
    if (!result) {
      return createResponse(null, { code: HttpStatus.UNAUTHORIZED, message: '用户名或密码错误' })
    }

    const payload = { sub: result.id as string, username: result.username }
    return createResponse({ token: this.jwtService.sign(payload) })
  }

  async info(id: string) {
    const result = await this.userModel.findById(id).exec()
    if (!result) {
      return createResponse(null, { code: HttpStatus.BAD_REQUEST, message: '用户不存在' })
    }
    const { username, studentName, graduationYear } = result
    return createResponse({ id, username, studentName, graduationYear })
  }

  async changePassword(payload: JwtPayload, changePasswordDto: ChangePasswordDto) {
    const { sub: id } = payload
    const { oldPassword, newPassword, confirmPassword } = changePasswordDto
    const userResult = await this.userModel.findById(id).exec()
    if (!userResult || userResult.password !== oldPassword) {
      return createResponse(null, { code: HttpStatus.BAD_REQUEST, message: '用户原密码错误' })
    }
    if (newPassword.length < 6 || newPassword.length > 20 || newPassword !== confirmPassword) {
      return createResponse(null, { code: HttpStatus.BAD_REQUEST, message: '传入了非法新密码' })
    }

    await this.userModel.findByIdAndUpdate(id, { $set: { password: newPassword } })

    await this.blackListService.addTokenToBlacklist(payload) // token黑名单

    return createResponse(null)
  }
}
