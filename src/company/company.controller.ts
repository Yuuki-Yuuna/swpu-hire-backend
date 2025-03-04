import { Body, Controller, Get, Post } from '@nestjs/common'
import { UserId } from '@/user/user.guard'
import { CompanyService } from './company.service'
import { CompanyEditDto } from './company.dto'

@Controller('company')
export class CompanyController {
  constructor(private companyService: CompanyService) {}

  @Get('info')
  info(@UserId() userId: string) {
    return this.companyService.info(userId)
  }

  @Get('info-examine')
  infoExamine(@UserId() userId: string) {
    return this.companyService.infoExamine(userId)
  }

  @Post('edit')
  edit(@Body() companyEditDto: CompanyEditDto, @UserId() userId: string) {
    return this.companyService.edit(userId, companyEditDto)
  }
}
