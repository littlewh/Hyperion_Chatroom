// websocked连接异常捕获
import { Catch, ArgumentsHost } from '@nestjs/common'
import { BaseWsExceptionFilter } from '@nestjs/websockets'

@Catch()
export class WsExceptionFilter extends BaseWsExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {// 重写catch方法
    super.catch(exception, host)// 调用父类的catch方法
  }
}
