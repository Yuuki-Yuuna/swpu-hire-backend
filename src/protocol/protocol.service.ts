import { HttpStatus, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { User } from '@/user/schema/user.schema'
import { Interview } from '@/interview/schema/interview.schema'
import { Protocol } from './schema/protocol.schema'
import { createResponse } from '@/common/response'
import { ApplyStatus, SignStatus, UserType } from '@/common/enum'

@Injectable()
export class ProtocolService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Interview.name) private interviewModel: Model<Interview>,
    @InjectModel(Protocol.name) private protocolModal: Model<Protocol>
  ) {}

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
      user: studentId,
      company: companyId,
      status: SignStatus.Start,
      filename: originalname,
      file: fileUrl
    })

    return createResponse(null)
  }
}
