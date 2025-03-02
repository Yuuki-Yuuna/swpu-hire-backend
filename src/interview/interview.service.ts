import { HttpStatus, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Job } from '@/job/schema/job.schema'
import { Company } from '@/company/schema/company.schema'
import { Interview } from './schema/interview.schema'
import { createResponse } from '@/common/response'
import { ApplyStatus } from '@/common/enum'

@Injectable()
export class InterviewService {
  constructor(
    @InjectModel(Job.name) private jobModel: Model<Job>,
    @InjectModel(Interview.name) private interviewModel: Model<Interview>
  ) {}

  async info(userId: string) {
    const data = await this.interviewModel.find({ userId }).exec()
    return createResponse({ list: data })
  }

  async createRecord(userId: string, jobId: string) {
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

    return createResponse(null)
  }
}
