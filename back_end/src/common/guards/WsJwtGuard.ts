  // JWT鉴权 token身份认证
import { AuthService } from './../../modules/auth/auth.service'
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { WsException } from '@nestjs/websockets'
import { Socket } from 'socket.io'

@Injectable()
export class WsJwtGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    let client: Socket
    try {
      client = context.switchToWs().getClient<Socket>()
      const authToken: string = client.handshake?.query?.token
      const user = this.authService.verifyUser(authToken)
      return Boolean(user)
    } catch (err) {
      client.emit('unauthorized', '用户信息校验失败,请重新登录!')
      client.disconnect()
      throw new WsException(err.message)
    }
  }
}
