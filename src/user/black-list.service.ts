import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { BlackList } from './schema/black-list.schema'
import { JwtPayload } from './user.guard'

@Injectable()
export class BlackListService {
  constructor(@InjectModel(BlackList.name) private blackListModal: Model<BlackList>) {}

  // 添加token到黑名单
  async addTokenToBlacklist(payload: JwtPayload) {
    const { sub: userId, username, token, exp } = payload
    const expireTime = new Date(exp * 1000) // JWT 的 exp 是秒级时间戳
    await this.blackListModal.create({ token, userId, username, expireTime })
  }

  async isTokenBlacklisted(token: string): Promise<boolean> {
    const exists = await this.blackListModal.exists({ token })
    return !!exists
  }
}
