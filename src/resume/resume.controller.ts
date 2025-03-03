import { Body, Controller, Get, Post, UsePipes, ValidationPipe } from '@nestjs/common'
import { ResumeService } from './resume.service'
import { UserId } from '@/user/user.guard'
import { ResumeEditDto } from './resume.dto'

@Controller('resume')
export class ResumeController {
  constructor(private resumeService: ResumeService) {}

  @Get('info')
  info(@UserId() useId: string) {
    return this.resumeService.info(useId)
  }

  @Post('edit')
  @UsePipes(new ValidationPipe({ transform: true }))
  edit(@Body() resumeEditDto: ResumeEditDto, @UserId() userId: string) {
    return this.resumeService.edit(userId, resumeEditDto)
  }
}
