import { Module } from '@nestjs/common'
import { ServeStaticModule } from '@nestjs/serve-static'
import { MongooseModule } from '@nestjs/mongoose'

import { databaseUrl, publicUrl } from './common/sercet-key'
import { UserModule } from './user/user.module'
import { JobModule } from './job/job.module'
import { CompanyModule } from './company/company.module'
import { InterviewModule } from './interview/interview.module'
import { ResumeModule } from './resume/resume.module'

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: publicUrl,
      serveRoot: '/static'
    }),
    MongooseModule.forRoot(databaseUrl),
    UserModule,
    JobModule,
    CompanyModule,
    InterviewModule,
    ResumeModule
  ]
})
export class AppModule {}
