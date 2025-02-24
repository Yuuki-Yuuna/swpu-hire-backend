import { HttpStatus, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { createResponse } from '@/common/response'
import { Job } from './schema/job.schema'
import { RecommendDto } from './job.dto'

@Injectable()
export class JobService {
  constructor(@InjectModel(Job.name) private jobModel: Model<Job>) {}

  // todo: 根据user做推荐，先全返回
  async recommend(id: string, recommendDto: RecommendDto) {
    const { page, limit } = recommendDto
    const skip = (page - 1) * limit

    const data = await this.jobModel.find().skip(skip).limit(limit).populate('company').exec()
    const total = await this.jobModel.countDocuments().exec()

    return createResponse({ list: data, total })
  }

  async detail(id: string) {
    const result = await this.jobModel.findById(id).populate('company').exec()
    if (!result) {
      return createResponse(null, { code: HttpStatus.BAD_REQUEST, message: '职位不存在' })
    }

    return createResponse(result)
  }
}
