import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { AuthController } from './auth.controller'
import { LocalStrategy } from './local.strategy'
import { JwtStrategy } from './jwt.strategy'
import { jwtConstants } from './constants'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from '../user/entity/user.entity'

// jwt模式下实现token授权登录
@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    // 注册jwt
    JwtModule.register({
      // jwt加密因子
      secret: jwtConstants.secret,
      // 时效3天
      signOptions: { expiresIn: '3d' }
    }),
    PassportModule
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService]
})
export class AuthModule {}
