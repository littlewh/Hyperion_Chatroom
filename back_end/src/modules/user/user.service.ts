// 增删改查
import { Injectable } from '@nestjs/common'
import { Repository, Like } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from './entity/user.entity'
import { createWriteStream } from 'fs'
import { join } from 'path'
import { RCode } from 'src/common/constant/rcode'
import { sha256 } from 'src/common/tool/utils'
import { Group, GroupMap } from '../group/entity/group.entity';
import { GroupMessage } from '../group/entity/groupMessage.entity';
import { FriendMessage } from '../friend/entity/friendMessage.entity';
import { UserMap } from '../friend/entity/friend.entity';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
    @InjectRepository(GroupMap)
    private readonly groupUserRepository: Repository<GroupMap>,
    @InjectRepository(GroupMessage)
    private readonly groupMessageRepository: Repository<GroupMessage>,
    @InjectRepository(UserMap)
    private readonly friendRepository: Repository<UserMap>,
    @InjectRepository(FriendMessage)
    private readonly friendMessageRepository: Repository<FriendMessage>,
    private readonly authService: AuthService
  ) {}

  async getUser(userId: string) {
    try {
      let data
      if (userId) {
        data = await this.userRepository.findOne({
          where: { userId: userId }
        })
        return { msg: '获取用户成功', data }
      }
    } catch (e) {
      return { code: RCode.ERROR, msg: '获取用户失败', data: e }
    }
  }

  async postUsers(userIds: string) {
    try {
      if (userIds) {
        const userIdArr = userIds.split(',')
        const userArr = []
        for (const userId of userIdArr) {
          if (userId) {
            const data = await this.userRepository.findOne({
              where: { userId: userId }
            })
            userArr.push(data)
          }
        }
        return { msg: '获取用户信息成功', data: userArr }
      }
      return { code: RCode.FAIL, msg: '获取用户信息失败', data: null }
    } catch (e) {
      return { code: RCode.ERROR, msg: '获取用户信息失败', data: e }
    }
  }

  async updateUserName(oldUser: User, username: string) {
    try {
      if (oldUser) {
        const isHaveName = await this.userRepository.findOne({
          username
        })
        if (isHaveName) {
          return { code: 1, msg: '用户名重复', data: '' }
        }
        const newUser = await this.userRepository.findOne({
          userId: oldUser.userId
        })
        newUser.username = username
        await this.userRepository.update(oldUser.userId, newUser)
        return { msg: '更新用户名成功', data: newUser }
      }
      return { code: RCode.FAIL, msg: '更新失败', data: '' }
    } catch (e) {
      return { code: RCode.ERROR, msg: '更新用户名失败', data: e }
    }
  }

  async updatePassword(user: User, password: string) {
    try {
      if (user) {
        const newUser = await this.userRepository.findOne({
          userId: user.userId
        })
        const backUser = JSON.parse(JSON.stringify(newUser))
        newUser.password = sha256(password)
        await this.userRepository.update(user.userId, newUser)
        return { msg: '更新用户密码成功', data: backUser }
      }
      return { code: RCode.FAIL, msg: '更新失败', data: '' }
    } catch (e) {
      return { code: RCode.ERROR, msg: '更新用户密码失败', data: e }
    }
  }

  async delUser(user: User, did: string) {
    try {
      const verifyuser = await this.userRepository.findOne({userId: user.userId})
      console.log("delete：role"+verifyuser.role)
      if (verifyuser.role === 'admin') { // 验证身份
        const newUser = await this.userRepository.findOne({ userId: did })
        newUser.status = "close";
        await this.userRepository.update(did,newUser)
        return { msg: '用户删除成功', data: newUser }
      }
      return { code: RCode.FAIL, msg: '用户删除失败', data: ''}
    } catch (e) {
      return { code: RCode.ERROR, msg: '用户删除失败', data: e }
    }
  }

  async getUsersByName(username: string) {
    try {
      console.log(username)
      if (username) {
        const users = await this.userRepository.find({
          where: { username: Like(`%${username}%`) }
        })
        // console.log(users)
        return { data: users }
      }
      return { code: RCode.FAIL, msg: '请输入用户名', data: null }
    } catch (e) {
      return { code: RCode.ERROR, msg: '查找用户错误', data: null }
    }
  }

  async setUserAvatar(user: User, file) {
    const newUser = await this.userRepository.findOne({
      userId: user.userId
    })
    if (newUser) {
      const random = Date.now() + '&'
      const stream = createWriteStream(
        join('deploy/public/avatar', random + file.originalname)
      )
      stream.write(file.buffer)
      newUser.avatar = `/avatar/${random}${file.originalname}`
      await this.userRepository.save(newUser)
      return { msg: '修改头像成功', data: newUser }
    } else {
      return { code: RCode.FAIL, msg: '修改头像失败' }
    }
  }
}
