// 登陆
import { Body, Controller, Post } from '@nestjs/common'
import { AuthService } from './auth.service'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // 登录
  @Post('/login')
  async login(@Body() body) {
    return this.authService.login(body)
  }
  // 注册
  @Post('/register')
  async register(@Body() body) {
    return this.authService.register(body)
  }
}
