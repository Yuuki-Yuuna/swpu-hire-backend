import { Body, Controller, Get, Post, Query } from '@nestjs/common'
import { InterviewService } from './interview.service'
import { UserId } from '@/user/user.guard'
import { InterViewApplyProcessDto } from './interview.dto'

@Controller('interview')
export class InterviewController {
  constructor(private interviewService: InterviewService) {}

  @Get('info')
  info(@UserId() userId: string) {
    return this.interviewService.info(userId)
  }

  @Post('create-record')
  createRecord(@UserId() userId: string, @Body('jobId') jobId: string) {
    return this.interviewService.createRecord(userId, jobId)
  }

  @Get('list-company')
  listByCompany(@UserId() userId: string) {
    return this.interviewService.listByCompany(userId)
  }

  @Get('student-resume')
  studentResume(
    @Query('studentId') studentId: string,
    @Query('jobId') jobId: string,
    @UserId() userId: string
  ) {
    return this.interviewService.studentResume(userId, jobId, studentId)
  }

  @Post('apply-process')
  applyProcess(@UserId() userId: string, @Body() applyProcessDto: InterViewApplyProcessDto) {
    return this.interviewService.applyProcess(userId, applyProcessDto)
  }
}
