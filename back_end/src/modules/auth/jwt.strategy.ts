import { Strategy, ExtractJwt } from 'passport-jwt'
import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { jwtConstants } from './constants'
import { User } from '../user/entity/user.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {// jwt策略
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {
    super({// jwt策略配置
      jwtFromRequest: ExtractJwt.fromHeader('token'),// 从请求头中获取token
      ignoreExpiration: false,// 不忽略过期
      secretOrKey: jwtConstants.secret// jwt加密因子
    })
  }

  async validate(payload: User) {// 验证 JWT 令牌，并在验证成功后提供用户信息
    const user = this.userRepository.findOne({// 通过id查找用户
      userId: payload.userId,
      password: payload.password
    })
    if (!user) {
      return false
    }
    return { username: payload.username, password: payload.password }
  }
}
