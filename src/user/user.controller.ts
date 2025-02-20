import { Body, Controller, Get, Post } from '@nestjs/common'
import { UserService } from './user.service'
import { PublicRoute, Token, JwtPayload } from './user.guard'
import { ChangePasswordDto } from './uset.dto'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @PublicRoute()
  @Post('login')
  login(@Body('username') username: string, @Body('password') password: string) {
    return this.userService.login(username, password)
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
}
