import { FriendMessage } from './../friend/entity/friendMessage.entity'
import { UserMap } from './../friend/entity/friend.entity'
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
import { GroupMap } from '../group/entity/group.entity'
import { Mail } from '../mail/mail.entity';
import { Nodemailer } from './auth.nodemailer';

// jwt模式下实现token授权登录
@Module({
  imports: [
    TypeOrmModule.forFeature([User, GroupMap, UserMap, FriendMessage]),// 注册User实体
    TypeOrmModule.forFeature([Mail]),// 注册Mail实体
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
  providers: [AuthService, LocalStrategy, JwtStrategy, Nodemailer],
  exports: [AuthService]
})
export class AuthModule {}
