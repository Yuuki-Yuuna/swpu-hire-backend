import { Body, Controller, Get, Post } from '@nestjs/common'
import { InterviewService } from './interview.service'
import { UserId } from '@/user/user.guard'

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
}
