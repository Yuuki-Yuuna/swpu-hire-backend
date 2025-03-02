import { Controller, Get, Query, UsePipes, ValidationPipe } from '@nestjs/common'
import { UserId } from '@/user/user.guard'
import { JobService } from './job.service'
import { JobListDto, RecommendDto } from './job.dto'

@Controller('job')
export class JobController {
  constructor(private jobService: JobService) {}

  @Get('list')
  @UsePipes(new ValidationPipe({ transform: true }))
  list(@Query() jobListDto: JobListDto) {
    return this.jobService.list(jobListDto)
  }

  @Get('recommend')
  @UsePipes(new ValidationPipe({ transform: true }))
  recommend(@Query() recommendDto: RecommendDto, @UserId() userId: string) {
    return this.jobService.recommend(userId, recommendDto)
  }

  @Get('detail')
  detail(@Query('id') campanyId: string, @UserId() userId: string) {
    return this.jobService.detail(campanyId, userId)
  }
}
