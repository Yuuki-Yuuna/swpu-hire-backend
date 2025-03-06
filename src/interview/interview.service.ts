import { HttpStatus, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import { Job } from '@/job/schema/job.schema'
import { User } from '@/user/schema/user.schema'
import { Resume } from '@/resume/schema/resume.schema'
import { Company } from '@/company/schema/company.schema'
import { Interview } from './schema/interview.schema'
import { createResponse } from '@/common/response'
import { ApplyStatus, UserType } from '@/common/enum'
import { InterViewApplyProcessDto } from './interview.dto'

@Injectable()
export class InterviewService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Job.name) private jobModel: Model<Job>,
    @InjectModel(Resume.name) private resumeModel: Model<Resume>,
    @InjectModel(Interview.name) private interviewModel: Model<Interview>
  ) {}

  async info(userId: string) {
    const user = await this.userModel.findById(userId).exec()
    if (user?.userType !== UserType.Student) {
      return createResponse(null, { code: HttpStatus.BAD_REQUEST, message: '非法用户' })
    }

    const data = await this.interviewModel.find({ userId }).exec()
    return createResponse(data)
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
    const { _id: companyId, companyName } = company as Company

    await this.interviewModel.create({
      userId,
      jobId,
      jobName,
      companyId,
      companyName,
      applyTime: Date.now(),
      status: ApplyStatus.Apply
    })

    const candidateTotal = (await this.interviewModel.find({ jobId }).exec()).length
    await this.jobModel.findByIdAndUpdate(jobId, { $set: { candidateTotal } })

    return createResponse(null)
  }

  async listByCompany(userId: string) {
    const user = await this.userModel.findById(userId).populate('company').exec()
    if (user?.userType !== UserType.Company || !user.company) {
      return createResponse(null, { code: HttpStatus.BAD_REQUEST, message: '非法用户' })
    }

    const { _id: companyId } = user.company as Company
    const result = await this.interviewModel.find({ companyId }).exec()

    const data = await Promise.all(
      result.map(async (item) => ({
        ...item.toObject(),
        student: await this.userModel.findById(item.userId).select('-password').lean().exec()
      }))
    )

    return createResponse(data)
  }

  async studentResume(userId: string, jobId: string, studentId: string) {
    const user = await this.userModel.findById(userId).populate('company').exec()
    if (user?.userType !== UserType.Company || !user.company) {
      return createResponse(null, { code: HttpStatus.BAD_REQUEST, message: '非法用户' })
    }

    const result = await this.interviewModel.findOne({ jobId, userId: studentId }).exec()
    const companyId = result?.companyId as unknown as Types.ObjectId | undefined
    if (!result || !(user.company._id as Types.ObjectId).equals(companyId)) {
      return createResponse(null, { code: HttpStatus.BAD_REQUEST, message: '非法用户' })
    }

    const resume = await this.resumeModel.findOne({ userId: studentId }).exec()
    return createResponse({ resume, interview: result })
  }

  async applyProcess(userId: string, applyProcessDto: InterViewApplyProcessDto) {
    const user = await this.userModel.findById(userId).populate('company').exec()
    if (user?.userType !== UserType.Company || !user.company) {
      return createResponse(null, { code: HttpStatus.BAD_REQUEST, message: '非法用户' })
    }

    const { jobId, studentId, status, description = '' } = applyProcessDto
    const result = await this.interviewModel.findOne({ jobId, userId: studentId }).exec()
    const companyId = result?.companyId as unknown as Types.ObjectId | undefined
    if (!result || !(user.company._id as Types.ObjectId).equals(companyId)) {
      return createResponse(null, { code: HttpStatus.BAD_REQUEST, message: '非法用户' })
    }

    await result.updateOne({ $set: { status, description } })
    return createResponse(null)
  }
}
