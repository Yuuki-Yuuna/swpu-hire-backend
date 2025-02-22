import * as path from 'path'
import { Body, Controller, Get, Post, Req, UploadedFile, UseInterceptors } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { Request } from 'express'
import { diskStorage } from 'multer'
import { UserService } from './user.service'
import { PublicRoute, Token, JwtPayload } from './user.guard'
import { ChangePasswordDto } from './uset.dto'
import { publicImageUrl } from '@/common/sercet-key'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @PublicRoute()
  @Post('login')
  login(@Body('username') username: string, @Body('password') password: string) {
    return this.userService.login(username, password)
  }

  @Post('quit')
  quit(@Token() payload: JwtPayload) {
    return this.userService.quit(payload)
  }

  @Get('info')
  info(@Token() payload: JwtPayload) {
    const { sub } = payload
    return this.userService.info(sub)
  }

  @Post('change-password')
  changePassword(@Body() changePasswordDto: ChangePasswordDto, @Token() payload: JwtPayload) {
    return this.userService.changePassword(payload, changePasswordDto)
  }

  @Post('upload-avatar')
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: publicImageUrl, // 文件存储路径
        filename: (req, file, callback) => {
          const { originalname } = file
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
  uploadAvatar(
    @UploadedFile() avatar: Express.Multer.File,
    @Req() request: Request,
    @Token() payload: JwtPayload
  ) {
    const { sub } = payload
    const { protocol, host } = request
    const httpUrl = `${protocol}://${host}`
    return this.userService.uploadAvatar(sub, httpUrl, avatar)
  }
}
