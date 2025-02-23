import { Controller, Get, Query, ValidationPipe } from '@nestjs/common'
import { JwtPayload, Token } from '@/user/user.guard'
import { JobService } from './job.service'
import { RecommendDto } from './job.dto'

@Controller('job')
export class JobController {
  constructor(private jobService: JobService) {}

  @Get('recommend')
  recommend(
    @Query(new ValidationPipe({ transform: true })) recommendDto: RecommendDto,
    @Token() payload: JwtPayload
  ) {
    const { sub } = payload
    return this.jobService.recommend(sub, recommendDto)
  }
}
