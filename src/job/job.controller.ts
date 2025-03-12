import { Body, Controller, Get, Post, Query } from '@nestjs/common'
import { UserId } from '@/user/user.guard'
import { JobService } from './job.service'
import { JobListDto, JobPublishDto, JobRecommendDto } from './job.dto'

@Controller('job')
export class JobController {
  constructor(private jobService: JobService) {}

  @Get('list')
  list(@Query() jobListDto: JobListDto) {
    return this.jobService.list(jobListDto)
  }

  @Get('lastest-list')
  lastestList(@Query() jobListDto: JobListDto) {
    return this.jobService.lastestList(jobListDto)
  }

  @Get('collect-list')
  collectList(@UserId() userId: string, @Query() jobListDto: JobListDto) {
    return this.jobService.collectList(userId, jobListDto)
  }

  @Get('recommend')
  recommend(@Query() recommendDto: JobRecommendDto, @UserId() userId: string) {
    return this.jobService.recommend(userId, recommendDto)
  }

  @Get('detail')
  detail(@Query('id') jobId: string, @UserId() userId: string) {
    return this.jobService.detail(jobId, userId)
  }

  @Get('list-company')
  listByCompany(@UserId() userId: string) {
    return this.jobService.listByCompany(userId)
  }

  @Get('detail-company')
  detailByCompany(@Query('id') jobId: string, @UserId() userId: string) {
    return this.jobService.detailByCompany(jobId, userId)
  }

  @Post('publish')
  publish(@UserId() userId: string, @Body() jobPublishDto: JobPublishDto) {
    return this.jobService.publish(userId, jobPublishDto)
  }

  @Post('delete')
  delete(@UserId() userId: string, @Body('id') jobId: string) {
    return this.jobService.delete(userId, jobId)
  }

  @Post('collect')
  collect(@UserId() userId: string, @Body('id') jobId: string) {
    return this.jobService.collect(userId, jobId)
  }
}
