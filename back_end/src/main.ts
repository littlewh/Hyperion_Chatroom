import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import { AppModule } from './app.module'
import { HttpExceptionFilter } from './common/filters/http-exception.filter'
import { ResponseInterceptor } from './common/interceptor/response.interceptor'
import { join } from 'path'
import { IoAdapter } from '@nestjs/platform-socket.io'

async function bootstrap() {

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true
  })
  app.useWebSocketAdapter(new IoAdapter(app))


  // 全局过滤器
  app.useGlobalFilters(new HttpExceptionFilter())

  // 配置全局拦截器
  app.useGlobalInterceptors(new ResponseInterceptor())

  // 配置静态资源
  app.useStaticAssets(join(__dirname, '../public', '/'), {
    prefix: '/',
    setHeaders: res => {
      res.set('Cache-Control', 'max-age=2592000')
    }
  })

  await app.listen(3000)
}
bootstrap()
