  // JWT鉴权 token身份认证
import { AuthService } from './../../modules/auth/auth.service'
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { WsException } from '@nestjs/websockets'
import { Socket } from 'socket.io'

@Injectable()// 注入依赖
export class WsJwtGuard implements CanActivate {// 继承CanActivate
  constructor(private authService: AuthService) {}// 注入AuthService

  async canActivate(context: ExecutionContext): Promise<boolean> {//  实现canActivate接口来实现守卫
    let client: Socket
    try {
      client = context.switchToWs().getClient<Socket>()// 获取 WebSocket 客户端的实例
      const authToken: string = client.handshake?.query?.token// 从客户端的握手信息中获取token
      // ？为可选链操作符，用于安全地访问可能为 null 或 undefined 的属性
      const user = this.authService.verifyUser(authToken)// 使用authService.verifyUser方法验证token
      return Boolean(user)
    } catch (err) {
      client.emit('unauthorized', '用户信息校验失败,请重新登录!')
      client.disconnect()
      throw new WsException(err.message)
    }
  }
}
