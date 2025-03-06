import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Resume, ResumeSchema } from '@/resume/schema/resume.schema'
import { User, UserSchema } from '@/user/schema/user.schema'
import { Job, JobSchema } from '@/job/schema/job.schema'
import { Interview, InterviewSchema } from './schema/interview.schema'
import { InterviewController } from './interview.controller'
import { InterviewService } from './interview.service'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Resume.name, schema: ResumeSchema },
      { name: Interview.name, schema: InterviewSchema },
      { name: Job.name, schema: JobSchema }
    ])
  ],
  controllers: [InterviewController],
  providers: [InterviewService]
})
export class InterviewModule {}
