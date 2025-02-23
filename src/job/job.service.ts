import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { createResponse } from '@/common/response'
import { Job } from './schema/job.schema'
import { RecommendJobData } from './job.interface'
import { RecommendDto } from './job.dto'

@Injectable()
export class JobService {
  constructor(@InjectModel(Job.name) private jobModel: Model<Job>) {}

  // todo: 根据user做推荐，先全返回
  async recommend(id: string, recommendDto: RecommendDto) {
    const { page, limit } = recommendDto
    const skip = (page - 1) * limit

    const [result] = await this.jobModel.aggregate<{
      data: RecommendJobData[]
      count: [{ total: number }]
    }>([
      {
        $facet: {
          data: [
            { $skip: skip }, // 跳过前面的文档
            { $limit: limit }, // 限制返回的文档数量
            {
              $lookup: {
                from: 'company',
                localField: 'companyId',
                foreignField: '_id',
                as: 'company'
              }
            },
            { $unwind: '$company' }
          ],
          count: [{ $count: 'total' }]
        }
      }
    ])

    const { data, count } = result
    const [{ total }] = count

    return createResponse({ list: data, total })
  }
}
