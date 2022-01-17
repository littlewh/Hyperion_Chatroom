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
export class ResponseInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>
  ): import('rxjs').Observable<any> | Promise<import('rxjs').Observable<any>> {
    return next.handle().pipe(
      map(content => {
        return {
          data: content.data || {},
          code: content.code || RCode.OK,
          msg: content.msg || null
        }
      })
    )
  }
}
