import { Controller, Get, Query } from '@nestjs/common'
import { UserId } from '@/user/user.guard'
import { JobService } from './job.service'
import { JobListDto, RecommendDto } from './job.dto'

@Controller('job')
export class JobController {
  constructor(private jobService: JobService) {}

  @Get('list')
  list(@Query() jobListDto: JobListDto) {
    return this.jobService.list(jobListDto)
  }

  @Get('recommend')
  recommend(@Query() recommendDto: RecommendDto, @UserId() userId: string) {
    return this.jobService.recommend(userId, recommendDto)
  }

  @Get('detail')
  detail(@Query('id') campanyId: string, @UserId() userId: string) {
    return this.jobService.detail(campanyId, userId)
  }
}
