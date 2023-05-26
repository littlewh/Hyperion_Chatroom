//http连接异常捕获
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException
} from '@nestjs/common'

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter<HttpException> {// 继承ExceptionFilter
  catch(exception: HttpException, host: ArgumentsHost) {// 重写catch方法
    const ctx = host.switchToHttp()// 获取上下文
    const response = ctx.getResponse()// 获取响应
    const request = ctx.getRequest()// 获取请求
    const status = exception.getStatus()// 获取状态码
    const exceptionRes: any = exception.getResponse()// 获取响应体
    const error = exceptionRes.error//  错误信息
    let message = exceptionRes.message// 错误信息

    if (status === 401) {// 如果是401错误，说明是身份过期
      message = '身份过期，请重新登录'
    }
    response.status(200).json({// 返回响应
      code: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      error,
      msg: message
    })
  }
}
