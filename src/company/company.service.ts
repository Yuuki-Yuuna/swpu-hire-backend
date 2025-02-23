import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Company } from './schema/company.schema'
import { Model } from 'mongoose'

@Injectable()
export class CompanyService {
  constructor(@InjectModel(Company.name) private companyModel: Model<Company>) {}
}
