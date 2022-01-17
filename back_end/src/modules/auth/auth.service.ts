import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from '../user/entity/user.entity'
import { sha256 } from 'src/common/tool/utils'
import { RCode } from 'src/common/constant/rcode'
import * as jwt from 'jsonwebtoken'
import { jwtConstants } from './constants'
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService
  ) {}

  async login(data: User): Promise<any> {
    let user
    // 之前传userId 表示为单点登录,直接登录
    if (data.userId && !data.password) {
      user = await this.userRepository.findOne({ userId: data.userId })
    } else {
      user = await this.userRepository.findOne({
        username: data.username,
        password: sha256(data.password)
      })
    }
    if (!user) {
      return { code: 1, msg: '用户名或密码错误', data: '' }
    }
    else if(user.status == 'close')
    {
      return { code: 1, msg: '用户已被禁止使用', data: '' }
    }
    const payload = { userId: user.userId }
    return {
      msg: '登录成功',
      data: {
        user: user,
        token: this.jwtService.sign(payload)
      }
    }
  }

  async register(user: User): Promise<any> {
    const isHave = await this.userRepository.find({ username: user.username })
    if (isHave.length) {
      return { code: RCode.FAIL, msg: '用户名重复', data: '' }
    }
    user.avatar = `/avatar/avatar${Math.round(Math.random() * 19 + 1)}.png`
    user.role = 'user'
    user.userId = user.userId
    user.password = sha256(user.password)
    const newUser = await this.userRepository.save(user)
    const payload = { userId: newUser.userId }
    return {
      msg: '注册成功',
      data: {
        user: newUser,
        token: this.jwtService.sign(payload)
      }
    }
  }

// 获取当前token携带信息
  verifyUser(token): User {
    if (!token) return null
    const user = jwt.verify(token, jwtConstants.secret) as User
    return user
  }
}
