import { HttpStatus, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import { User } from '@/user/schema/user.schema'
import { Company } from '@/company/schema/company.schema'
import { Interview } from '@/interview/schema/interview.schema'
import { Protocol } from './schema/protocol.schema'
import { createResponse } from '@/common/response'
import { ApplyStatus, SignStatus, UserType } from '@/common/enum'
import { ProToColReviewDto } from './protocol.dto'

@Injectable()
export class ProtocolService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Interview.name) private interviewModel: Model<Interview>,
    @InjectModel(Protocol.name) private protocolModal: Model<Protocol>
  ) {}

  async list(userId: string) {
    const user = await this.userModel.findById(userId).exec()
    if (user?.userType !== UserType.Student) {
      return createResponse(null, { code: HttpStatus.BAD_REQUEST, message: '非法用户' })
    }

    const data: any[] = []
    const protocolData = await this.protocolModal
      .find({ user: new Types.ObjectId(userId) })
      .populate('company')
      .exec()
    for (const dataItem of protocolData) {
      const company = dataItem.company as Company
      data.push({
        _id: dataItem.id as string,
        companyId: company.id as string,
        userId: dataItem.user as Types.ObjectId,
        companyName: company.companyName,
        status: dataItem.status,
        file: dataItem.file,
        filename: dataItem.filename,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        updatedAt: (dataItem as any).updatedAt
      })
    }
    return createResponse(data)
  }

  async listByCompany(userId: string) {
    const user = await this.userModel.findById(userId).populate('company').exec()
    if (user?.userType !== UserType.Company || !user.company) {
      return createResponse(null, { code: HttpStatus.BAD_REQUEST, message: '非法用户' })
    }

    const { _id: companyId } = user.company
    const interviewData = await this.interviewModel
      .find({ companyId, status: ApplyStatus.Hire })
      .select('userId status')
      .exec()

    const data: any[] = []

    for (const dataItem of interviewData) {
      const itemUser = await this.userModel.findById(dataItem.userId).select('studentName').exec()
      if (!itemUser) {
        continue
      }
      data.push({
        _id: dataItem.id as string,
        companyId: companyId as string,
        userId: itemUser.id as string,
        studentName: itemUser.studentName,
        status: SignStatus.Wait,
        updatedAt: new Date().toLocaleDateString()
      })
    }

    const protocolData = await this.protocolModal.find({ company: companyId }).exec()
    for (const dataItem of protocolData) {
      const itemUser = await this.userModel.findById(dataItem.user).select('studentName').exec()
      if (!itemUser) {
        continue
      }
      data.push({
        _id: dataItem.id as string,
        companyId: companyId as string,
        userId: itemUser.id as string,
        studentName: itemUser.studentName,
        status: dataItem.status,
        file: dataItem.file,
        filename: dataItem.filename,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        updatedAt: (dataItem as any).updatedAt
      })
    }

    return createResponse(data)
  }

  async listBySchool(userId: string) {
    const user = await this.userModel.findById(userId).exec()
    if (user?.userType !== UserType.School) {
      return createResponse(null, { code: HttpStatus.BAD_REQUEST, message: '非法用户' })
    }

    const data: any[] = []
    const protocolData = await this.protocolModal
      .find({ status: SignStatus.Review })
      .populate('user')
      .populate('company')
      .exec()
    for (const dataItem of protocolData) {
      const company = dataItem.company as Company
      const itemUser = dataItem.user as User
      data.push({
        _id: dataItem.id as string,
        companyId: company.id as string,
        userId: itemUser.id as string,
        studentName: itemUser.studentName,
        companyName: company.companyName,
        status: dataItem.status,
        file: dataItem.file,
        filename: dataItem.filename,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        updatedAt: (dataItem as any).updatedAt
      })
    }
    return createResponse(data)
  }

  async create(userId: string, studentId: string, file: Express.Multer.File, httpUrl: string) {
    const user = await this.userModel.findById(userId).populate('company').exec()
    if (user?.userType !== UserType.Company || !user.company) {
      return createResponse(null, { code: HttpStatus.BAD_REQUEST, message: '非法用户' })
    }

    const { _id: companyId } = user.company
    await this.interviewModel.findOneAndUpdate(
      { companyId, userId: studentId },
      { $set: { status: ApplyStatus.Sign } }
    )

    const { filename, originalname } = file
    const fileUrl = `${httpUrl}/static/file/${filename}`
    await this.protocolModal.create({
      user: new Types.ObjectId(userId),
      company: companyId,
      status: SignStatus.Check,
      filename: originalname,
      file: fileUrl
    })

    return createResponse(null)
  }

  // 学校和学生公用
  async review(userId: string, reviewDto: ProToColReviewDto) {
    const user = await this.userModel.findById(userId).exec()
    if (user?.userType !== UserType.Student && user?.userType !== UserType.School) {
      return createResponse(null, { code: HttpStatus.BAD_REQUEST, message: '非法用户' })
    }

    const { protocolId, isApproved } = reviewDto
    const result = await this.protocolModal.findById(protocolId).exec()
    const studentUserCheck =
      result &&
      user.userType === UserType.Student &&
      (result.user as Types.ObjectId)?.equals(new Types.ObjectId(userId))
    const schoolCheck = result && user.userType == UserType.School
    if (!studentUserCheck && !schoolCheck) {
      return createResponse(null, { code: HttpStatus.BAD_REQUEST, message: '非法用户' })
    }

    const status = isApproved
      ? user.userType === UserType.School
        ? SignStatus.Done
        : SignStatus.Review
      : SignStatus.Cancel
    await result.updateOne({ $set: { status } })
    return createResponse(null)
  }

  async signInfo(userId: string) {
    const user = await this.userModel.findById(userId).exec()
    if (user?.userType !== UserType.Student) {
      return createResponse(null, { code: HttpStatus.BAD_REQUEST, message: '非法用户' })
    }

    const result = await this.protocolModal
      .findOne({ user: new Types.ObjectId(userId), status: SignStatus.Done })
      .populate('company')
      .exec()
    if (!result) {
      return createResponse(null)
    }

    const { _id, status, file, filename } = result
    const { _id: companyId, companyName } = result.company as Company
    return createResponse({
      _id,
      userId,
      companyId,
      companyName,
      status,
      file,
      filename,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      updatedAt: (result as any).updatedAt
    })
  }
}
