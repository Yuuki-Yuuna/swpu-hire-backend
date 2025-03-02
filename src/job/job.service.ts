import { HttpStatus, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { createQuery } from '@/common/query'
import { createResponse } from '@/common/response'
import { Job } from './schema/job.schema'
import { JobListDto, RecommendDto } from './job.dto'

@Injectable()
export class JobService {
  constructor(@InjectModel(Job.name) private jobModel: Model<Job>) {}

  async list(jobListDto: JobListDto) {
    const { page, limit, input, city, companySize, salaryRequirement } = jobListDto
    const { query } = createQuery({ location: city, 'company.companySize': companySize })

    const salaryMap = new Map([
      [0, [0, 3]], // 3K以下
      [1, [3, 5]], // 3-5K
      [2, [5, 10]], // 5-10K
      [3, [10, 15]], // 10-15K
      [4, [15, 20]], // 15-20K
      [5, [20, 30]], // 20-30K
      [6, [30, 50]], // 30-50K
      [7, [50, Infinity]] // 50K以上
    ])
    const salary = salaryRequirement !== undefined ? salaryMap.get(salaryRequirement) : undefined
    const [salaryMin, salaryMax] = salary || [-Infinity, Infinity]

    const total = await this.jobModel.countDocuments().exec()
    const data = await this.jobModel.aggregate<unknown>([
      {
        $lookup: {
          from: 'company',
          localField: 'company',
          foreignField: '_id',
          as: 'company'
        }
      },
      { $unwind: '$company' },
      {
        $match: {
          ...query,
          $and: [
            {
              $or: [
                { salaryMin: { $gte: salaryMin, $lte: salaryMax } },
                { salaryMax: { $gte: salaryMin, $lte: salaryMax } }
              ]
            },
            {
              $or: [
                { jobName: { $regex: input, $options: 'i' } },
                { 'company.companyName': { $regex: input, $options: 'i' } }
              ]
            }
          ]
        }
      },
      { $skip: (page - 1) * limit },
      { $limit: limit }
    ])

    return createResponse({ list: data, total })
  }

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
