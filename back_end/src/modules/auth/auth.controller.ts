// 登陆
import { Body, Controller, Post } from '@nestjs/common'
import { AuthService } from './auth.service'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // 登录
  @Post('/login')
  async login(@Body() body) {
    console.log(body)
    return this.authService.login(body)
  }
  // 注册
  @Post('/register')
  async register(@Body() body) {
    console.log(body)
    return this.authService.register(body)
  }
  // 找回密码
  @Post('/retrieve')
  async retrieve(@Body() body) {
    console.log(body)
    return this.authService.retrieve(body)
  }

  @Post("/email")
  async sendmail(@Body() body) {
    console.log(body)
    return this.authService.sendmail(body)
  }
}
