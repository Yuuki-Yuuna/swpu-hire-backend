import { HttpStatus, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Job } from '@/job/schema/job.schema'
import { User } from '@/user/schema/user.schema'
import { Company } from '@/company/schema/company.schema'
import { Interview } from './schema/interview.schema'
import { createResponse } from '@/common/response'
import { ApplyStatus, UserType } from '@/common/enum'

@Injectable()
export class InterviewService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Job.name) private jobModel: Model<Job>,
    @InjectModel(Interview.name) private interviewModel: Model<Interview>
  ) {}

  async info(userId: string) {
    const data = await this.interviewModel.find({ userId }).exec()
    return createResponse({ list: data })
  }

  async createRecord(userId: string, jobId: string) {
    const user = await this.userModel.findById(userId).exec()
    if (user?.userType !== UserType.Student) {
      return createResponse(null, { code: HttpStatus.BAD_REQUEST, message: '非法用户' })
    }

    const jobResult = await this.jobModel.findById(jobId).populate('company').exec()
    if (!jobResult) {
      return createResponse(null, { code: HttpStatus.BAD_REQUEST, message: '职位不存在' })
    }

    const { jobName, company } = jobResult
    const { companyName } = company as Company

    await this.interviewModel.create({
      userId,
      jobId,
      jobName,
      companyName,
      applyTime: Date.now(),
      status: ApplyStatus.Apply
    })

    const candidateTotal = (await this.interviewModel.find({ jobId }).exec()).length
    await this.jobModel.findByIdAndUpdate(jobId, { $set: { candidateTotal } })

    return createResponse(null)
  }
}
