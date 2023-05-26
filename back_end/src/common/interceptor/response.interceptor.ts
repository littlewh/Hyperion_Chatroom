// 服务器返回值
import {
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Injectable
} from '@nestjs/common'
// 利用rxjs编写异步
import { map } from 'rxjs/operators'
import { RCode } from '../constant/rcode'

@Injectable()
export class ResponseInterceptor implements NestInterceptor {// 拦截器
  intercept(// 重写intercept方法
    context: ExecutionContext,
    next: CallHandler<any>
  ): import('rxjs').Observable<any> | Promise<import('rxjs').Observable<any>> {// 返回值
    return next.handle().pipe(// 利用rxjs的pipe方法对返回值进行处理
      map(content => {// 利用rxjs的map方法对返回值进行处理
        return {// 返回值
          data: content.data || {},
          code: content.code || RCode.OK,
          msg: content.msg || null
        }
      })
    )
  }
}
