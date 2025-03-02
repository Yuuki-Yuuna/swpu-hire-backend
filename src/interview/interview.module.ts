import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Job, JobSchema } from '@/job/schema/job.schema'
import { Interview, InterviewSchema } from './schema/interview.schema'
import { InterviewController } from './interview.controller'
import { InterviewService } from './interview.service'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Interview.name, schema: InterviewSchema },
      { name: Job.name, schema: JobSchema }
    ])
  ],
  controllers: [InterviewController],
  providers: [InterviewService]
})
export class InterviewModule {}
