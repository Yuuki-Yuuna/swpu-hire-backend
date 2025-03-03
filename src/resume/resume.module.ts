import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Resume, ResumeSchema } from './schema/resume.schema'
import { ResumeController } from './resume.controller'
import { ResumeService } from './resume.service'

@Module({
  imports: [MongooseModule.forFeature([{ name: Resume.name, schema: ResumeSchema }])],
  controllers: [ResumeController],
  providers: [ResumeService]
})
export class ResumeModule {}
