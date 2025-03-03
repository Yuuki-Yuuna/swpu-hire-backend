import { HttpStatus, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { createResponse } from '@/common/response'
import { Resume } from './schema/resume.schema'
import { ResumeEditDto } from './resume.dto'

@Injectable()
export class ResumeService {
  constructor(@InjectModel(Resume.name) private resumeModel: Model<Resume>) {}

  async info(userId: string) {
    const result = await this.resumeModel.findOne({ userId }).exec()
    if (!result) {
      return createResponse(null, { code: HttpStatus.BAD_REQUEST, message: '简历不存在' })
    }

    return createResponse(result)
  }

  async edit(userId: string, resumeEditDto: ResumeEditDto) {
    const result = await this.resumeModel.findOne({ userId }).exec()
    if (!result) {
      await this.resumeModel.create({ userId, ...resumeEditDto })
    } else {
      await this.resumeModel.updateOne({ userId }, { $set: resumeEditDto }).exec()
    }

    return createResponse(null)
  }
}
