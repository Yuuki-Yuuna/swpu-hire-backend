import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Interview, InterviewSchema } from '@/interview/schema/interview.schema'
import { Job, JobSchema } from './schema/job.schema'
import { JobController } from './job.controller'
import { JobService } from './job.service'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Interview.name, schema: InterviewSchema },
      { name: Job.name, schema: JobSchema }
    ])
  ],
  controllers: [JobController],
  providers: [JobService]
})
export class JobModule {}
