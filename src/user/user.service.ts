import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { AES, enc } from 'crypto-js'
import { sercetKey } from '@/common/sercet-key'
import { User } from './schema/user.schema'

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async login(encryptedUsername: string, encryptedPassword: string) {
    const uname = AES.encrypt(encryptedUsername, sercetKey).toString()
    const pword = AES.encrypt(encryptedPassword, sercetKey).toString()
    const username = AES.decrypt(uname, sercetKey).toString(enc.Utf8)
    const password = AES.decrypt(pword, sercetKey).toString(enc.Utf8)
    const result = await this.userModel.findOne({ username, password }).exec()
    console.log(result, result?.id, result?._id)
  }
}
