import { HttpStatus, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { UserType } from '@/common/enum'
import { createResponse } from '@/common/response'
import { User } from '@/user/schema/user.schema'
import { CompanyExamine } from './schema/company-examine.schema'
import { Company } from './schema/company.schema'
import { CompanyEditDto, ExameineReviewDto } from './company.dto'

@Injectable()
export class CompanyService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Company.name) private companyModel: Model<Company>,
    @InjectModel(CompanyExamine.name) private companyExamineModel: Model<CompanyExamine>
  ) {}

  async info(userId: string) {
    const user = await this.userModel.findById(userId)
    if (user?.userType !== UserType.Company || !user.company) {
      return createResponse(null, { code: HttpStatus.BAD_REQUEST, message: '非法用户' })
    }

    const result = await this.companyModel.findById(user.company)
    return createResponse(result)
  }

  async infoExamine(userId: string) {
    const user = await this.userModel.findById(userId)
    if (user?.userType !== UserType.Company || !user.company) {
      return createResponse(null, { code: HttpStatus.BAD_REQUEST, message: '非法用户' })
    }

    const result = await this.companyExamineModel.findById(user.company)
    return createResponse(result)
  }

  async listExamine(userId: string) {
    const user = await this.userModel.findById(userId)
    if (user?.userType !== UserType.School) {
      return createResponse(null, { code: HttpStatus.BAD_REQUEST, message: '非法用户' })
    }

    const result = await this.companyExamineModel.find()
    return createResponse(result)
  }

  async reviewExamine(userId: string, exameineReviewDto: ExameineReviewDto) {
    const user = await this.userModel.findById(userId)
    if (user?.userType !== UserType.School) {
      return createResponse(null, { code: HttpStatus.BAD_REQUEST, message: '非法用户' })
    }

    const { companyId, isApproved } = exameineReviewDto
    const company = await this.companyExamineModel.findById(companyId)
    if (!company) {
      return createResponse(null, { code: HttpStatus.BAD_REQUEST, message: '企业不存在' })
    }

    if (isApproved) {
      await this.companyModel.findByIdAndUpdate(companyId, { $set: company })
    }
    await this.companyExamineModel.findByIdAndDelete(companyId)

    return createResponse(null)
  }

  async edit(userId: string, companyEditDto: CompanyEditDto) {
    const user = await this.userModel.findById(userId)
    if (user?.userType !== UserType.Company || !user.company) {
      return createResponse(null, { code: HttpStatus.BAD_REQUEST, message: '非法用户' })
    }

    const exist = await this.companyExamineModel.findById(user.company)
    if (exist) {
      return createResponse(null, { code: HttpStatus.BAD_REQUEST, message: '修改审核中' })
    }

    await this.companyExamineModel.create({ _id: user.company, ...companyEditDto })
    return createResponse(null)
  }
}
