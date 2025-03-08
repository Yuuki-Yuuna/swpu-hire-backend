import { HttpStatus, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, PipelineStage, Types } from 'mongoose'
import { createQuery } from '@/common/query'
import { createResponse } from '@/common/response'
import { User } from '@/user/schema/user.schema'
import { Interview } from '@/interview/schema/interview.schema'
import { Job } from './schema/job.schema'
import { JobListDto, JobPublishDto, JobRecommendDto } from './job.dto'
import { UserType } from '@/common/enum'

@Injectable()
export class JobService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Job.name) private jobModel: Model<Job>,
    @InjectModel(Interview.name) private interviewModal: Model<Interview>
  ) {}

  private createPipeline(jobListDto: JobListDto) {
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

    return [
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
    ] as PipelineStage[]
  }

  async list(jobListDto: JobListDto) {
    const pipeline = this.createPipeline(jobListDto)
    const total = await this.jobModel.countDocuments().exec()
    const data = await this.jobModel.aggregate(pipeline)

    return createResponse({ list: data, total })
  }

  async lastestList(jobListDto: JobListDto) {
    const pipeline = this.createPipeline(jobListDto)
    pipeline.unshift({ $sort: { updatedAt: -1 } })

    const total = await this.jobModel.countDocuments().exec()
    const data = await this.jobModel.aggregate(pipeline)

    return createResponse({ list: data, total })
  }

  // todo: 根据user做推荐，先全返回
  async recommend(id: string, recommendDto: JobRecommendDto) {
    const { page, limit } = recommendDto
    const skip = (page - 1) * limit

    const data = await this.jobModel.find().skip(skip).limit(limit).populate('company').exec()
    const total = await this.jobModel.countDocuments().exec()

    return createResponse({ list: data, total })
  }

  async detail(jobId: string, userId: string) {
    const result = await this.jobModel.findById(jobId).populate('company').exec()
    if (!result) {
      return createResponse(null, { code: HttpStatus.BAD_REQUEST, message: '职位不存在' })
    }

    const isApply = await this.interviewModal.exists({ userId, jobId: result.id })

    return createResponse({ ...result.toObject(), isApply: !!isApply })
  }

  async detailByCompany(jobId: string, userId: string) {
    const user = await this.userModel.findById(userId).populate('company').exec()
    if (user?.userType !== UserType.Company || !user.company) {
      return createResponse(null, { code: HttpStatus.BAD_REQUEST, message: '非法用户' })
    }

    const result = await this.jobModel.findById(jobId).exec()
    return createResponse(result)
  }

  async listByCompany(userId: string) {
    const user = await this.userModel.findById(userId).populate('company').exec()
    if (user?.userType !== UserType.Company || !user.company) {
      return createResponse(null, { code: HttpStatus.BAD_REQUEST, message: '非法用户' })
    }

    const { _id: companyId } = user.company
    const result = await this.jobModel.find({ company: companyId }).exec()
    return createResponse(result)
  }

  async publish(userId: string, jobPublishDto: JobPublishDto) {
    const user = await this.userModel.findById(userId).populate('company').exec()
    if (user?.userType !== UserType.Company || !user.company) {
      return createResponse(null, { code: HttpStatus.BAD_REQUEST, message: '非法用户' })
    }

    const { _id: companyId } = user.company
    const { jobId, ...rest } = jobPublishDto
    const jobData = { ...rest, company: companyId, userId }
    const result = await this.jobModel.findById(jobId)
    if (result && !(result.company as Types.ObjectId).equals(companyId as Types.ObjectId)) {
      return createResponse(null, { code: HttpStatus.BAD_REQUEST, message: '非法操作' })
    }

    if (!result) {
      await this.jobModel.create(jobData)
    } else {
      await this.jobModel.findByIdAndUpdate(jobId, { $set: jobData })
    }

    return createResponse(null)
  }

  async delete(userId: string, jobId: string) {
    const user = await this.userModel.findById(userId).populate('company').exec()
    if (user?.userType !== UserType.Company || !user.company) {
      return createResponse(null, { code: HttpStatus.BAD_REQUEST, message: '非法用户' })
    }

    const { _id: companyId } = user.company
    const result = await this.jobModel.findById(jobId)
    if (result && !(result.company as Types.ObjectId).equals(companyId as Types.ObjectId)) {
      return createResponse(null, { code: HttpStatus.BAD_REQUEST, message: '非法操作' })
    }

    await this.jobModel.findByIdAndDelete(jobId)

    return createResponse(null)
  }
}
