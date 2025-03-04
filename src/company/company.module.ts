import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { User, UserSchema } from '@/user/schema/user.schema'
import { CompanyExamine, CompanyExamineSchema } from './schema/company-examine.schema'
import { Company, CompanySchema } from './schema/company.schema'
import { CompanyController } from './company.controller'
import { CompanyService } from './company.service'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: CompanyExamine.name, schema: CompanyExamineSchema },
      { name: Company.name, schema: CompanySchema }
    ])
  ],
  controllers: [CompanyController],
  providers: [CompanyService]
})
export class CompanyModule {}
