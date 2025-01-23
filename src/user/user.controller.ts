import { Body, Controller, Post } from '@nestjs/common'
import { UserService } from './user.service'
import { PublicRoute } from './user.guard'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @PublicRoute()
  @Post('login')
  login(@Body('username') username: string, @Body('password') password: string) {
    return this.userService.login(username, password)
  }
}
