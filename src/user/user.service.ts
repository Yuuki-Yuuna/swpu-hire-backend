import { Injectable, HttpStatus } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { AES, enc } from 'crypto-js'
import { UserType } from '@/common/enum'
import { createResponse } from '@/common/response'
import { cryptoKey } from '@/common/sercet-key'
import { BlackListService } from './black-list.service'
import { Company } from '@/company/schema/company.schema'
import { User } from './schema/user.schema'
import { ChangePasswordDto } from './uset.dto'
import { JwtPayload } from './user.guard'

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Company.name) private companyModel: Model<Company>,
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

  async sign(encUsername: string, encPassword: string) {
    const username = AES.decrypt(encUsername, cryptoKey).toString(enc.Utf8)
    const password = AES.decrypt(encPassword, cryptoKey).toString(enc.Utf8)
    const exist = await this.userModel.exists({ username })
    if (exist) {
      return createResponse(null, { code: HttpStatus.BAD_REQUEST, message: '用户名重复' })
    }

    // 只能注册企业的，别的身份直接在数据库加
    const company = await this.companyModel.create({
      companyName: '未认证企业',
      companySize: 0,
      companySizeName: '0-20人',
      companyNature: 5,
      companyNatureName: '民企',
      companyType: '无类型',
      creditCode: '10000'
    })
    const result = await this.userModel.create({
      username,
      password,
      userType: UserType.Company,
      company: company._id
    })

    const payload = { sub: result.id as string, username: result.username }
    return createResponse({ token: this.jwtService.sign(payload) })
  }

  async quit(payload: JwtPayload) {
    await this.blackListService.addTokenToBlacklist(payload) // token黑名单
    return createResponse(null)
  }

  async info(id: string) {
    const result = await this.userModel.findById(id).select('-password').exec()
    if (!result) {
      return createResponse(null, { code: HttpStatus.BAD_REQUEST, message: '用户不存在' })
    }
    if (result.userType === UserType.Company) {
      await result.populate('company')
    }

    return createResponse(result)
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

  async uploadAvatar(id: string, httpUrl: string, avatar: Express.Multer.File) {
    const userResult = await this.userModel.findById(id).exec()
    if (!userResult) {
      return createResponse(null, { code: HttpStatus.BAD_REQUEST, message: '用户不存在' })
    }

    const { filename } = avatar
    const avatarUrl = `${httpUrl}/static/image/${filename}`

    await this.userModel.findByIdAndUpdate(id, { $set: { avatar: avatarUrl } })

    if (userResult.userType === UserType.Company) {
      await this.companyModel.findByIdAndUpdate(userResult.company, {
        $set: { companyLogo: avatarUrl }
      })
    }

    return createResponse(null)
  }
}
