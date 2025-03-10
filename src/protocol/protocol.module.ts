import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { User, UserSchema } from '@/user/schema/user.schema'
import { Company, CompanySchema } from '@/company/schema/company.schema'
import { Interview, InterviewSchema } from '@/interview/schema/interview.schema'
import { Protocol, ProtocolSchema } from './schema/protocol.schema'
import { ProtocolController } from './protocol.controller'
import { ProtocolService } from './protocol.service'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Company.name, schema: CompanySchema },
      { name: Interview.name, schema: InterviewSchema },
      { name: Protocol.name, schema: ProtocolSchema }
    ])
  ],
  controllers: [ProtocolController],
  providers: [ProtocolService]
})
export class ProtocolModule {}
