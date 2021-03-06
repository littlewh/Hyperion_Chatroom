import { GroupService } from '../group/group.service'
import {
  defaultGroupId,
  defaultRobotId,
  FILE_SAVE_PATH,
  IMAGE_SAVE_PATH,
  defaultGroupMessageTime
} from './../../common/constant/global'
import { AuthService } from './../auth/auth.service'
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  ConnectedSocket
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, getRepository } from 'typeorm'
import { Group, GroupMap } from '../group/entity/group.entity'
import { GroupMessage } from '../group/entity/groupMessage.entity'
import { UserMap } from '../friend/entity/friend.entity'
import { FriendMessage } from '../friend/entity/friendMessage.entity'
import { createWriteStream } from 'fs'
import { join } from 'path'
import { RCode } from 'src/common/constant/rcode'
import { formatBytes, nameVerify } from 'src/common/tool/utils'
import { defaultPassword } from 'src/common/constant/global'
import { UseGuards } from '@nestjs/common'
import { User } from './../user/entity/user.entity'
import { WsJwtGuard } from './../../common/guards/WsJwtGuard'
import { Ai } from '../Ai/ai.entity';
const axios = require('axios')
// const nodejieba = require('nodejieba')

// const axios = require('axios');

@WebSocketGateway()
export class ChatGateway {
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
    @InjectRepository(Ai)
    private readonly aiRepository: Repository<Ai>,
    private readonly authService: AuthService,
    private readonly groupService: GroupService
  ) {}

  @WebSocketServer()
  server: Server

  // socket????????????
  async handleConnection(client: Socket): Promise<string> {
    const token = client.handshake.query.token
    const user = this.authService.verifyUser(token)
    const { userId } = user
    // ??????????????????DEFAULG_GROUP
    // TODO ?????????
    client.join(defaultGroupId)
    // ??????????????????????????????

    const newUser = await this.userRepository.findOne({userId: userId});
    newUser.tag = 'online';
    await this.userRepository.update(userId, newUser);

    console.log('????????????', userId)
    // ??????????????????????????????
    client.broadcast.emit('userOnline', {
      code: RCode.OK,
      msg: 'userOnline',
      data: userId
    })

    // ???????????????????????? ??????userId
    if (userId) {
      client.join(userId)
    }
    return '????????????'
  }

  // socket????????????
  async handleDisconnect(client: Socket): Promise<any> {
    const userId = client.handshake.query.userId

    const newUser = await this.userRepository.findOne({userId: userId});
    newUser.tag = 'offline';
    await this.userRepository.update(userId, newUser);

    console.log('????????????', userId)
    // ??????????????????????????????
    client.broadcast.emit('userOffline', {
      code: RCode.OK,
      msg: 'userOffline',
      data: userId
    })
  }

  // ????????????
  @UseGuards(WsJwtGuard)
  @SubscribeMessage('addGroup')
  async addGroup(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: GroupDto
  ): Promise<any> {
    const isUser = await this.userRepository.findOne({ userId: data.userId })
    if (isUser.status === 'on') {
      const isHaveGroup = await this.groupRepository.findOne({
        groupName: data.groupName
      })
      if (isHaveGroup) {
        this.server.to(data.userId).emit('addGroup', {
          code: RCode.FAIL,
          msg: '?????????????????????',
          data: isHaveGroup
        })
        return
      }
      if (!nameVerify(data.groupName)) {
        return
      }
      data = await this.groupRepository.save(data)
      client.join(data.groupId)
      const group = await this.groupUserRepository.save(data)
      const member = isUser as FriendDto
      member.online = 1
      member.isManager = 1
      data.members = [member]
      this.server.to(group.groupId).emit('addGroup', {
        code: RCode.OK,
        msg: `???????????????${data.groupName}`,
        data: group
      })
    } else {
      this.server
        .to(data.userId)
        .emit('addGroup', { code: RCode.FAIL, msg: `?????????????????????` })
    }
  }

  // ????????????
  @UseGuards(WsJwtGuard)
  @SubscribeMessage('joinGroup')
  async joinGroup(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: GroupMap
  ): Promise<any> {
    const isUser = await this.userRepository.findOne({ userId: data.userId })
    if (isUser.status === 'on') { // ???????????????????????????
      const group = await this.groupRepository.findOne({
        groupId: data.groupId
      })
      let userGroup = await this.groupUserRepository.findOne({
        groupId: group.groupId,
        userId: data.userId
      })
      const user = await this.userRepository.findOne({ userId: data.userId })
      if (group && user) {
        if (!userGroup) {
          data.groupId = group.groupId
          userGroup = await this.groupUserRepository.save(data)
        }
        client.join(group.groupId)
        const res = { group: group, user: user }
        this.server.to(group.groupId).emit('joinGroup', {
          code: RCode.OK,
          msg: `${user.username}?????????${group.groupName}`,
          data: res
        })
      } else {
        this.server
          .to(data.userId)
          .emit('joinGroup', { code: RCode.FAIL, msg: '????????????', data: '' })
      }
    } else {
      this.server
        .to(data.userId)
        .emit('joinGroup', { code: RCode.FAIL, msg: '??????????????????' })
    }
  }

  // ???????????????socket??????
  @UseGuards(WsJwtGuard)
  @SubscribeMessage('joinGroupSocket')
  async joinGroupSocket(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: GroupMap
  ): Promise<any> {
    const group = await this.groupRepository.findOne({ groupId: data.groupId })
    const user = await this.userRepository.findOne({ userId: data.userId })
    if (group && user) {
      client.join(group.groupId)
      const res = { group: group, user: user }
      this.server.to(group.groupId).emit('joinGroupSocket', {
        code: RCode.OK,
        msg: `${user.username}?????????${group.groupName}`,
        data: res
      })
    } else {
      this.server.to(data.userId).emit('joinGroupSocket', {
        code: RCode.FAIL,
        msg: '????????????',
        data: ''
      })
    }
  }

  // ???????????????
  @UseGuards(WsJwtGuard)
  @SubscribeMessage('groupMessage')
  async sendGroupMessage(@MessageBody() data: GroupMessageDto): Promise<any> {
    const isUser = await this.userRepository.findOne({ userId: data.userId })
    console.log(data)
    if (isUser.status === 'on') {
      const userGroupMap = await this.groupUserRepository.findOne({
        userId: data.userId,
        groupId: data.groupId
      })
      if (!userGroupMap || !data.groupId) {
        this.server.to(data.userId).emit('groupMessage', {
          code: RCode.FAIL,
          msg: '?????????????????????',
          data: ''
        })
        return
      }
      if (
        data.messageType === 'file' ||
        data.messageType === 'image' ||
        data.messageType === 'video'
      ) {
        // ????????????????????????????????????
        const SAVE_PATH =
          data.messageType === 'image' ? IMAGE_SAVE_PATH : FILE_SAVE_PATH
        const saveName =
          data.messageType === 'image'
            ? `${Date.now()}$${data.userId}$${data.width}$${data.height}$${
              data.fileName
            }`
            : `${Date.now()}$${data.userId}$${formatBytes(data.size)}$${
                data.fileName
              }`
        console.log(data.content)
        const stream = createWriteStream(join(SAVE_PATH, saveName))
        stream.write(data.content)
        data.content = saveName
      }
      console.log(data.groupId)

      data.time = new Date().valueOf() // ?????????????????????
      await this.groupMessageRepository.save(data)
      this.server.to(data.groupId).emit('groupMessage', {
        code: RCode.OK,
        msg: '',
        data: {
          ...data,
          username: isUser.username // ??????????????????????????????
        }
      })
    } else {
      this.server
        .to(data.userId)
        .emit('groupMessage', { code: RCode.FAIL, msg: '?????????????????????' })
    }
  }

  // ????????????
  @UseGuards(WsJwtGuard)
  @SubscribeMessage('addFriend')
  async addFriend(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: UserFriendMap
  ): Promise<any> {
    const isUser = await this.userRepository.findOne({ userId: data.userId })
    if (isUser) {
      if (data.friendId && data.userId) {
        if (data.userId === data.friendId) {
          this.server.to(data.userId).emit('addFriend', {
            code: RCode.FAIL,
            msg: '???????????????????????????',
            data: ''
          })
          return
        }
        const relation1 = await this.friendRepository.findOne({
          userId: data.userId,
          friendId: data.friendId
        })
        const relation2 = await this.friendRepository.findOne({
          userId: data.friendId,
          friendId: data.userId
        })
        const roomId =
          data.userId > data.friendId
            ? data.userId + data.friendId
            : data.friendId + data.userId

        if (relation1 || relation2) {
          this.server.to(data.userId).emit('addFriend', {
            code: RCode.FAIL,
            msg: '??????????????????',
            data: data
          })
          return
        }

        const friend = (await this.userRepository.findOne({
          userId: data.friendId
        })) as FriendDto
        const user = (await this.userRepository.findOne({
          userId: data.userId
        })) as FriendDto
        if (!friend) {
          this.server.to(data.userId).emit('addFriend', {
            code: RCode.FAIL,
            msg: '??????????????????',
            data: ''
          })
          return
        }

        // ????????????????????? ??????????????????
        await this.friendRepository.save(data)
        const friendData = JSON.parse(JSON.stringify(data))
        const friendId = friendData.friendId
        friendData.friendId = friendData.userId
        friendData.userId = friendId
        delete friendData._id
        await this.friendRepository.save(friendData)
        client.join(roomId)

        // ?????????????????????????????????, ??????????????????????????????
        let messages = await getRepository(FriendMessage)
          .createQueryBuilder('friendMessage')
          .orderBy('friendMessage.time', 'DESC')
          .where(
            'friendMessage.userId = :userId AND friendMessage.friendId = :friendId',
            { userId: data.userId, friendId: data.friendId }
          )
          .orWhere(
            'friendMessage.userId = :friendId AND friendMessage.friendId = :userId',
            { userId: data.userId, friendId: data.friendId }
          )
          .take(30)
          .getMany()
        messages = messages.reverse()

        if (messages.length) {
          // @ts-ignore
          friend.messages = messages
          // @ts-ignore
          user.messages = messages
        }
        // @ts-ignore;
        let onlineUserIdArr = Object.values(this.server.engine.clients).map(
          item => {
            // @ts-ignore;
            return item.request._query.userId
          }
        )
        // ??????????????????userId
        // ????????????
        onlineUserIdArr = Array.from(new Set(onlineUserIdArr))
        // ??????????????????
        friend.online = onlineUserIdArr.includes(friend.userId) ? 1 : 0
        this.server.to(data.userId).emit('addFriend', {
          code: RCode.OK,
          msg: `????????????${friend.username}??????`,
          data: friend
        })
        // ??????????????????????????????
        user.online = 1
        this.server.to(data.friendId).emit('addFriend', {
          code: RCode.OK,
          msg: `${user.username}??????????????????`,
          data: user
        })
      }
    } else {
      this.server
        .to(data.userId)
        .emit('addFriend', { code: RCode.FAIL, msg: '?????????????????????' })
    }
  }

  // ???????????????socket??????
  @UseGuards(WsJwtGuard)
  @SubscribeMessage('joinFriendSocket')
  async joinFriend(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: UserMap
  ): Promise<any> {
    if (data.friendId && data.userId) {
      const relation = await this.friendRepository.findOne({
        userId: data.userId,
        friendId: data.friendId
      })
      const roomId =
        data.userId > data.friendId
          ? data.userId + data.friendId
          : data.friendId + data.userId
      if (relation) {
        client.join(roomId)
        this.server.to(data.userId).emit('joinFriendSocket', {
          code: RCode.OK,
          msg: '????????????socket??????',
          data: relation
        })
      }
    }
  }

  // ??????????????????
  @UseGuards(WsJwtGuard)
  @SubscribeMessage('friendMessage')
  async friendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: FriendMessageDto
  ): Promise<any> {
    const isUser = await this.userRepository.findOne({ userId: data.userId })
    if (isUser) {
      if (data.userId && data.friendId) {
        const roomId =
          data.userId > data.friendId
            ? data.userId + data.friendId
            : data.friendId + data.userId
        // ????????????????????????????????????
        if (
          data.messageType === 'file' ||
          data.messageType === 'image' ||
          data.messageType === 'video'
        ) {
          const SAVE_PATH =
            data.messageType === 'image' ? IMAGE_SAVE_PATH : FILE_SAVE_PATH
          const saveName =
            data.messageType === 'image'
              ? `${Date.now()}$${data.userId}$${data.width}$${data.height}$${
                data.fileName
              }`
              : `${Date.now()}$${data.userId}$${formatBytes(data.size)}$${
                  data.fileName
                }`
          console.log(data.content)
          const stream = createWriteStream(join(SAVE_PATH, saveName))
          stream.write(data.content)
          data.content = saveName
          console.log(roomId)
          console.log(data.friendId)
        }

        data.time = new Date().valueOf()
        await this.friendMessageRepository.save(data)
        this.server
          .to(roomId)
          .emit('friendMessage', { code: RCode.OK, msg: '', data })
        // ??????friendID ????????????,?????????????????????
        // ????????????????????????
        if (data.friendId === defaultRobotId) {
          this.autoReply(data, roomId)
        }
      }
    } else {
      this.server.to(data.userId).emit('friendMessage', {
        code: RCode.FAIL,
        msg: '?????????????????????',
        data
      })
    }
  }

  // async getElasticData(splitWords: string) {
  //   console.log("splitWords"+splitWords)
  //   const replication: Ai[] = await this.aiRepository.find({ key: splitWords });
  //   let n = replication.length;
  //   if(!n) {
  //     return null;
  //   } else {
  //     const i = Math.round(Math.random() * n);
  //     return replication[i].reply;
  //   }
  // }

  // // ????????????????????????????????????????????????
  // async getReplyMessage(content: string) {
  //   const failMessage = '?????????????????????????????????'
  //   try {
  //     // jieba??????????????????
  //     // https://github.com/yanyiwu/nodejieba
  //     const splitWords = nodejieba.cut(content).join(' ')
  //     // console.log("splitWords"+splitWords)
  //     const askWords: string[] = splitWords.split(' ')
  //     const n = askWords.length
  //     let i = 0
  //
  //     let reply: string[]
  //     let cnt = 0
  //     while(i < n) {
  //       i++
  //       const res = await this.getElasticData(splitWords)
  //       console.log("reply:"+res)
  //       if (res != null) {
  //         cnt++// ???1????????????0?????????????????????
  //         reply[cnt] = res
  //       }
  //     }
  //     console.log(cnt)
  //     if(cnt) {
  //       const i = Math.round(Math.random() * cnt + 1);
  //       return reply[i]
  //     }
  //
  //     return failMessage
  //   } catch (e) {
  //     return failMessage
  //   }
  // }
  // // ?????????????????????
  // async autoReply(data, roomId) {
  //   // ????????????????????????
  //   const message = await this.getReplyMessage(data.content)
  //
  //   const reply = {
  //     time: new Date().valueOf(),
  //     content: message,
  //     userId: defaultRobotId,
  //     friendId: data.userId,
  //     messageType: 'text'
  //   }
  //   // ????????????????????????
  //   await this.friendMessageRepository.save(reply)
  //   this.server
  //     .to(roomId)
  //     .emit('friendMessage', { code: RCode.OK, msg: '', data: reply })
  // }

  // ?????????????????????
  async autoReply(data, roomId) {
    const url =
      'http://i.itpk.cn/api.php?api_key=68b8fafef36d3906f8f8b0e71b29d277&api_secret=4rdiunvqd0xw'
    const res = await axios({
      url,
      method: 'get',
      params: {
        question: data.content
      }
    })
    res.data.replace("??????","??????")
    if(data.content === "????????????") {
      res.data = "??????...???D???"
    }
    const reply = {
      time: new Date().valueOf(),
      content: res.data,
      userId: defaultRobotId,
      friendId: data.userId,
      messageType: 'text'
    }
    // ????????????????????????
    await this.friendMessageRepository.save(reply)
    this.server
      .to(roomId)
      .emit('friendMessage', { code: RCode.OK, msg: '', data: reply })
  }

  // ??????????????????????????????
  @UseGuards(WsJwtGuard)
  @SubscribeMessage('chatData')
  async getAllData(@MessageBody() token: string): Promise<any> {
    const user = this.authService.verifyUser(token)
    if (user) {
      const isUser = await this.userRepository.findOne({
        userId: user.userId
      })
      let groupArr: GroupDto[] = []
      let friendArr: FriendDto[] = []
      const userGather: { [key: string]: User } = {}
      let userArr: FriendDto[] = []
      // @ts-ignore;
      let onlineUserIdArr = Object.values(this.server.engine.clients).map(
        item => {
          // @ts-ignore;
          return item.request._query.userId
        }
      )
      // ??????????????????userId
      // ????????????
      onlineUserIdArr = Array.from(new Set(onlineUserIdArr))

      // ????????????????????????
      const groups: GroupDto[] = await getRepository(Group)
        .createQueryBuilder('group')
        .innerJoin(
          'group_map',
          'group_map',
          'group_map.groupId = group.groupId'
        )
        .select('group.groupName', 'groupName')
        .addSelect('group.groupId', 'groupId')
        .addSelect('group.notice', 'notice')
        .addSelect('group.userId', 'userId')
        .addSelect('group_map.createTime', 'createTime') // ????????????????????????
        .where('group_map.userId = :id', { id: isUser.userId })
        .getRawMany()
      // ????????????????????????
      const friends: FriendDto[] = await getRepository(User)
        .createQueryBuilder('user')
        .select('user.userId', 'userId')
        .addSelect('user.username', 'username')
        .addSelect('user.avatar', 'avatar')
        .addSelect('user.role', 'role')
        .where((qb: any) => {
          const subQuery = qb
            .subQuery()
            .select('s.userId')
            .innerJoin('user_map', 'p', 'p.friendId = s.userId')
            .from(`user`, 's')
            .where('p.userId = :userId', { userId: isUser.userId })
            .getQuery()
          // tslint:disable-next-line:prefer-template
          return 'user.userId IN ' + subQuery
        })
        .getRawMany()
      // ????????????????????????
      const groupMessagePromise = groups.map(async item => {
        const createTime = item.createTime // ??????????????????
        const groupMessage = await getRepository(GroupMessage)
          .createQueryBuilder('group_message')
          .innerJoin('user', 'user', 'user.userId = group_message.userId')
          .select('group_message.*')
          .addSelect('user.username', 'username')
          .orderBy('group_message.time', 'DESC')
          .where('group_message.groupId = :id', { id: item.groupId })
          .andWhere('group_message.time >= :createTime', {
            createTime: createTime - defaultGroupMessageTime // ????????????????????????????????????24????????????
          })
          .limit(10)
          .getRawMany()
        groupMessage.reverse()
        // ???????????????????????????????????????????????????
        for (const message of groupMessage) {
          if (!userGather[message.userId]) {
            userGather[message.userId] = await this.userRepository.findOne({
              userId: message.userId
            })
          }
        }
        return groupMessage
      })

      // ????????????
      const friendMessagePromise = friends.map(async item => {
        const messages = await getRepository(FriendMessage)
          .createQueryBuilder('friendMessage')
          .orderBy('friendMessage.time', 'DESC')
          .where(
            'friendMessage.userId = :userId AND friendMessage.friendId = :friendId',
            { userId: user.userId, friendId: item.userId }
          )
          .orWhere(
            'friendMessage.userId = :friendId AND friendMessage.friendId = :userId',
            { userId: user.userId, friendId: item.userId }
          )
          .take(10)
          .getMany()
        return messages.reverse()
      })

      const groupsMessage: Array<GroupMessageDto[]> = await Promise.all(
        groupMessagePromise
      )

      await Promise.all(
        groups.map(async (group, index) => {
          if (groupsMessage[index] && groupsMessage[index].length) {
            group.messages = groupsMessage[index]
          }
          group.members = []
          // ?????????????????????
          const groupUserArr = await this.groupUserRepository.find({
            groupId: group.groupId
          })
          if (groupUserArr.length) {
            for (const u of groupUserArr) {
              const _user: FriendDto = await this.userRepository.findOne({
                userId: u.userId
              })
              if (_user) {
                // ???????????????????????????
                onlineUserIdArr.includes(_user.userId)
                  ? ((_user as FriendDto).online = 1)
                  : ((_user as FriendDto).online = 0)
                // ?????????????????????
                _user.isManager = _user.userId === group.userId ? 1 : 0
                if(_user.status === 'on') { //???????????????????????????
                  group.members.push(_user)
                }

              }
            }
          }
          return Promise.resolve(group)
        })
      )

      groupArr = groups
      const friendsMessage: Array<FriendMessageDto[]> = await Promise.all(
        friendMessagePromise
      )

      friends.map((friend, index) => {
        if (friendsMessage[index] && friendsMessage[index].length) {
          friend.messages = friendsMessage[index]
        }
        // ????????????????????????
        friend.online = onlineUserIdArr.includes(friend.userId) ? 1 : 0
      })
      friendArr = friends
      userArr = [...Object.values(userGather), ...friendArr]
      this.server.to(user.userId).emit('chatData', {
        code: RCode.OK,
        msg: '????????????????????????',
        data: {
          groupData: groupArr,
          friendData: friendArr,
          userData: userArr
        }
      })
    }
  }

  // ??????
  @UseGuards(WsJwtGuard)
  @SubscribeMessage('exitGroup')
  async exitGroup(
    @ConnectedSocket() client: Socket,
    @MessageBody() groupMap: GroupMap
  ): Promise<any> {
    if (groupMap.groupId === defaultGroupId) {
      return this.server
        .to(groupMap.userId)
        .emit('exitGroup', { code: RCode.FAIL, msg: '??????????????????' })
    }
    const user = await this.userRepository.findOne({ userId: groupMap.userId })
    const group = await this.groupRepository.findOne({
      groupId: groupMap.groupId
    })
    const map = await this.groupUserRepository.findOne({
      userId: groupMap.userId,
      groupId: groupMap.groupId
    })
    if (user && group && map) {
      await this.groupUserRepository.remove(map)
      return this.server
        .to(groupMap.groupId)
        .emit('exitGroup', { code: RCode.OK, msg: '????????????', data: groupMap })
    }
    this.server
      .to(groupMap.userId)
      .emit('exitGroup', { code: RCode.FAIL, msg: '????????????' })
  }

  // ?????????
  @UseGuards(WsJwtGuard)
  @SubscribeMessage('exitFriend')
  async exitFriend(
    @ConnectedSocket() client: Socket,
    @MessageBody() userMap: UserMap
  ): Promise<any> {
    const user = await this.userRepository.findOne({ userId: userMap.userId })
    const friend = await this.userRepository.findOne({
      userId: userMap.friendId
    })
    const map1 = await this.friendRepository.findOne({
      userId: userMap.userId,
      friendId: userMap.friendId
    })
    const map2 = await this.friendRepository.findOne({
      userId: userMap.friendId,
      friendId: userMap.userId
    })
    if (user && friend && map1 && map2) {
      await this.friendRepository.remove(map1)
      await this.friendRepository.remove(map2)
      return this.server.to(userMap.userId).emit('exitFriend', {
        code: RCode.OK,
        msg: '???????????????',
        data: userMap
      })
    }
    this.server
      .to(userMap.userId)
      .emit('exitFriend', { code: RCode.FAIL, msg: '???????????????' })
  }

  // ????????????
  @UseGuards(WsJwtGuard)
  @SubscribeMessage('revokeMessage')
  async revokeMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() messageDto: GroupMessageDto & FriendMessageDto
  ): Promise<any> {
    // ?????????groupId????????????,????????????????????????????????????
    if (messageDto.groupId) {
      const groupMessage = await this.groupMessageRepository.findOne(
        messageDto._id
      )
      await this.groupMessageRepository.remove(groupMessage)
      return this.server.to(messageDto.groupId).emit('revokeMessage', {
        code: RCode.OK,
        msg: '????????????????????????',
        data: messageDto
      })
    } else {
      const friendMessage = await this.friendMessageRepository.findOne(
        messageDto._id
      )
      const roomId =
        messageDto.userId > messageDto.friendId
          ? messageDto.userId + messageDto.friendId
          : messageDto.friendId + messageDto.userId
      console.log('????????????---' + messageDto._id)
      await this.friendMessageRepository.remove(friendMessage)
      return this.server.to(roomId).emit('revokeMessage', {
        code: RCode.OK,
        msg: '????????????????????????',
        data: messageDto
      })
    }
  }

  // ???????????????(??????,??????)
  @UseGuards(WsJwtGuard)
  @SubscribeMessage('updateGroupInfo')
  async updateGroupNotice(@MessageBody() data: GroupDto): Promise<any> {
    console.log(data)
    const group = await this.groupRepository.findOne(data.groupId)
    group.groupName = data.groupName
    group.notice = data.notice
    const res = await this.groupService.update(group)
    this.server.to(data.groupId).emit('updateGroupInfo', res)
    return
  }

  // ??????????????????(??????\?????????)
  @UseGuards(WsJwtGuard)
  @SubscribeMessage('updateUserInfo')
  async updateUserInfo(
    @ConnectedSocket() client: Socket,
    @MessageBody() userId
  ): Promise<any> {
    const user = await this.userRepository.findOne({
      userId
    })
    // ??????????????????????????????????????????
    client.broadcast.emit('updateUserInfo', {
      code: RCode.OK,
      msg: 'userOnline',
      data: user
    })
  }
  // ??????????????????
  @UseGuards(WsJwtGuard)
  @SubscribeMessage('inviteFriendsIntoGroup')
  async inviteFriendsIntoGroup(
    @MessageBody() data: FriendsIntoGroup
  ): Promise<any> {
    try {
      // ????????????????????????
      const isUser = await this.userRepository.findOne({ userId: data.userId })
      const group = await this.groupRepository.findOne({
        groupId: data.groupId
      })
      const res = {
        group: group,
        friendIds: data.friendIds,
        userId: data.userId,
        invited: true // ?????????,???????????????????????????
      }
      if (isUser) {
        for (const friendId of data.friendIds) {
          if (group) {
            data.groupId = group.groupId
            await this.groupUserRepository.save({
              groupId: data.groupId,
              userId: friendId
            })
            // ???????????????????????? (???????????????????????????????????????,????????????,???????????????)
            this.server.to(friendId).emit('joinGroup', {
              code: RCode.OK,
              msg: isUser.username + '?????????????????????' + group.groupName,
              data: res
            })
          }
        }
        console.log('inviteFriendsIntoGroup', res)
        this.server.to(group.groupId).emit('joinGroup', {
          code: RCode.OK,
          msg: '??????' + data.friendIds.length + '?????????????????????',
          data: res
        })
      }
    } catch (error) {
      this.server.to(data.userId).emit('joinGroup', {
        code: RCode.FAIL,
        msg: '????????????:' + error,
        data: null
      })
    }
  }
}
