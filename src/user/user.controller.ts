import { Body, Controller, Post } from '@nestjs/common'
import { UserService } from './user.service'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('login')
  login(@Body('username') username: string, @Body('password') password: string) {
    return this.userService.login(username, password)
  }
}
