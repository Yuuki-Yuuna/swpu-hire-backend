import * as path from 'path'
import { Body, Controller, Get, Post, Req, UploadedFile, UseInterceptors } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { Request } from 'express'
import { diskStorage } from 'multer'
import { ProtocolService } from './protocol.service'
import { publicFileUrl } from '@/common/sercet-key'
import { UserId } from '@/user/user.guard'
import { ProToColReviewDto } from './protocol.dto'

@Controller('protocol')
export class ProtocolController {
  constructor(private protocolService: ProtocolService) {}

  @Get('list')
  list(@UserId() userId: string) {
    return this.protocolService.list(userId)
  }

  @Get('list-company')
  listByCompany(@UserId() userId: string) {
    return this.protocolService.listByCompany(userId)
  }

  @Get('list-school')
  listBySchool(@UserId() userId: string) {
    return this.protocolService.listBySchool(userId)
  }

  @Post('create')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: publicFileUrl, // 文件存储路径
        filename: (req, file, callback) => {
          const originalname = Buffer.from(file.originalname, 'latin1').toString('utf8')
          file.originalname = originalname
          const extname = path.extname(originalname)
          const basename = path.basename(originalname, extname)
          const timestamp = Date.now()
          const randomValue = Math.random().toString(36).substring(2, 8) // 6位随机字符串
          const filename = `${basename}-${timestamp}-${randomValue}${extname}`
          callback(null, filename)
        }
      }),
      limits: { fileSize: 1024 * 1024 * 5 }
    })
  )
  create(
    @UploadedFile() file: Express.Multer.File,
    @Req() request: Request,
    @Body('userId') studentId: string,
    @UserId() userId: string
  ) {
    const { protocol, host } = request
    const httpUrl = `${protocol}://${host}`
    return this.protocolService.create(userId, studentId, file, httpUrl)
  }

  @Post('review')
  review(@Body() reviewDto: ProToColReviewDto, @UserId() userId: string) {
    return this.protocolService.review(userId, reviewDto)
  }

  @Get('sign-info')
  signInfo(@UserId() userId: string) {
    return this.protocolService.signInfo(userId)
  }
}
