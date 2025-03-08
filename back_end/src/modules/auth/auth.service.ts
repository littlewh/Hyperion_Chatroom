import {
  defaultPassword,
  defaultRobotId,
  defaultGroupId,
  defaultWelcomeMessage
} from 'src/common/constant/global'
import { Injectable, Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from '../user/entity/user.entity'
import { emailVerify, nameVerify, passwordVerify, sha256 } from 'src/common/tool/utils';
import { RCode } from 'src/common/constant/rcode'
import * as jwt from 'jsonwebtoken'
import { jwtConstants } from './constants'
import { Mail } from '../mail/mail.entity';
import { Nodemailer } from './auth.nodemailer';
import { GroupMap } from '../group/entity/group.entity';
import { FriendMessage } from '../friend/entity/friendMessage.entity';
import { UserMap } from '../friend/entity/friend.entity';
var redisClient = require('../../common/middleware/redis-client');

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Mail)
    private readonly mailRepository: Repository<Mail>,
    private readonly nodemailer: Nodemailer,
    @InjectRepository(GroupMap)
    private readonly groupUserRepository: Repository<GroupMap>,
    @InjectRepository(UserMap)
    private readonly userMapRepository: Repository<UserMap>,
    @InjectRepository(FriendMessage)
    private readonly friendMessageRepository: Repository<FriendMessage>,
    private readonly jwtService: JwtService
  ) {}

  createSixNum(){
    let Num = '';
    for(let i=0; i<6; i++)
    {
      Num+=Math.floor(Math.random()*10);
    }
    return Num;
  }

  async sendmail(mail: Mail): Promise<any> {

    // console.log("1");

    if(!emailVerify(mail.email)){
      return {
        code: RCode.FAIL,
        msg: '邮件格式不正确'
      }
    }

    const email = mail.email;//刚刚从前台传过来的邮箱

    const isHave = await this.userRepository.find({ email: mail.email })

      // await this.mailRepository.delete({email: mail.email});//保证只有一条生效

      const code = this.createSixNum();//随机六位数
      // const time = new Date().valueOf();//获取当前时间
      console.log(code);
//       await this.nodemailer.sendmail(text);
      // await nodemailer(text);//发送邮件


      // mail.email = email;
      // mail.code = code;
      // mail.time = time;
      // await this.mailRepository.save(mail);

      /*以下为redis试用*/

      // redis.set(email, code, function(err, res){
      //   console.log("set redis:" + res)
      //   // expire("key",seconds),过期时间per seconds
      //   redis.expire(email,600);//十分钟
      // });
      const promise = redisClient.setString(email,code,600);
      promise.then( res => {
         // console.log(res);
      })
        .catch( err => {
           // console.log(err);
        })
      /*以上为redis试用*/
      var amqp = require('amqplib/callback_api');


      amqp.connect('amqp://localhost', function(error0, connection) {
        if (error0) {
          throw error0;
        }
        connection.createChannel(function(error1, channel) {
          if (error1) {
            throw error1;
          }

          var queue = 'MailCode';
          let value = {
            email: email,
            code: code,
          };
          let msg = JSON.stringify(value);//将对象转换为Json串
          channel.assertQueue(queue, {//指定队列
            durable: false//非持久化队列，临时队列，不会被保存在磁盘中，Rabbit服务重启后队列就会消失
          });
          channel.sendToQueue(queue, Buffer.from(msg));//发送消息到队列

          console.log(" [x] Sent %s", msg);

        });
        setTimeout(function() {
          connection.close();
          // process.exit(0);//fix by:gyy 20230505 注意此处不能退出进程，否则后端中断了
        }, 500);
      });

      console.log("邮件发送完毕");

      return {
        code: RCode.WAIT,//处理一下jwt认证，避免刷新后chat的showmodal不显示
        msg: '邮件发送成功,请注意查收'
      }

  }
  async login(data: User): Promise<any> {
    // console.log(data.userId);
    // console.log(data.username);
    // console.log(data.password);
    if (!nameVerify(data.username)) {
      return {
        code: RCode.FAIL,
        msg: '昵称格式不正确'
      }
    }
    if (!passwordVerify(data.password)) {
      return {
        code: RCode.FAIL,
        msg: '密码格式不正确'
      }
    }

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
    } else if(user.status === 'close') {
      return { code: 1, msg: '用户已被禁止使用', data: '' }
    } else if(user.tag === 'online') { // 防止异地登录
      return { code: 1, msg: '用户已在别处登录', data: '' }
    }

    user.tag = 'online' // 防止异地登录
    await this.userRepository.update(user.userId, user);

    const payload = { userId: user.userId }
    return {
      msg: '登录成功',
      data: {
        user: user,
        token: this.jwtService.sign(payload)//生成token返回给前端
      }
    }
  }

  async register(mail: Mail): Promise<any> {
    if(!emailVerify(mail.email)){
      return {
        code: RCode.FAIL,
        msg: '邮件格式不正确'
      }
    }
    if (!nameVerify(mail.username)) {
      return {
        code: RCode.FAIL,
        msg: '昵称格式不正确'
      }
    }
    if (!passwordVerify(mail.password)) {
      return {
        code: RCode.FAIL,
        msg: '密码格式不正确'
      }
    }

    // console.log("start register");
    const isHaveEmail = await this.userRepository.find({ email: mail.email })
    // console.log(isHave);
    if (isHaveEmail.length) {    //是否被注册过
      return { code: RCode.FAIL, msg: '该邮箱已被注册', data: '' }
    }else {
      const isHaveName = await this.userRepository.find({ username: mail.username })
      if(isHaveName.length) { //昵称是否重复
        return { code: RCode.FAIL, msg: '该昵称已被使用', data: '' }
      } else {

        /*以下为redis试用*/

        const flag = await redisClient.exitsString(mail.email);
        const code = await redisClient.getString(mail.email);//fix by:gyy 解决回调函数异步问题 20230502
        // promise.then( res => {
        //   console.log('then被调用了:',res);
        //   flag = res;
        // })
        //   .catch( err => {
        //     console.log('catch 被调用了:',err);
        //   })
        // console.log("123123"+flag);
        // console.log(code);


        if(flag === true){
          if(mail.code === code) {
            const user: User = new User();
            user.avatar = `/avatar/avatar${Math.round(Math.random() * 19 + 1)}.png`
            user.username = mail.username
            user.email = mail.email
            user.password = sha256(mail.password)
            user.role = 'user'
            user.status = 'on'
            user.createTime = new Date().valueOf()
            const newUser = await this.userRepository.save(user)
            const payload = { userId: newUser.userId }
            // 默认加入群组
            await this.groupUserRepository.save({
              userId: newUser.userId,
              groupId: defaultGroupId
            })
            // 默认添加机器人为好友 双向添加
            await this.userMapRepository.save({
              userId: newUser.userId,
              friendId: defaultRobotId
            })
            await this.userMapRepository.save({
              friendId: defaultRobotId,
              userId: newUser.userId
            })
            // 机器人欢迎语(默认留言)
            await this.friendMessageRepository.save({
              userId: defaultRobotId,
              friendId: newUser.userId,
              content: defaultWelcomeMessage,
              messageType: 'text',
              time: new Date().valueOf()
            })
            return {
              msg: '注册成功',
              data: {
                user: newUser,
                token: this.jwtService.sign(payload)//生成token返回给前端
              }
            }
          } else {
            return { code: RCode.FAIL, msg: '验证码错误', data: '' }
          }
        }else {
          return { code: RCode.FAIL, msg: '验证码已超时或不存在，请重新发送', data: '' }
        }

        // var timeoutID = await setTimeout(function(){
        //
        //   var flag = redis.exists(mail.email);// exists("key") 判斷key是否过期
        //   flag2 = flag;
        //   // console.log(flag);
        // },100);//设置延迟时间，否则redis读取不出来 fix:by gyy 20230502
        // console.log(flag2);
        // if(flag2){// 是否超时 会被编译器优化掉先执行这里，再执行上面的函数
        //
        // } else{
        //
        // }

        /*以上为redis试用*/

        // const result: Mail[] = await this.mailRepository.find({ email: mail.email })
        // console.log(result[0]);//预防多条卡死
        // if(result[0].time - (new Date().valueOf()) >= 1000*60*10) {// 是否超时
        //   return { code: RCode.FAIL, msg: '验证码已超时，请重新发送', data: '' }
        // } else {
        //   if(mail.code === result[0].code) {
        //     const user: User = new User();
        //     user.avatar = `/avatar/avatar${Math.round(Math.random() * 19 + 1)}.png`
        //     user.username = mail.username
        //     user.email = mail.email
        //     user.password = sha256(mail.password)
        //     user.role = 'user'
        //     user.status = 'on'
        //     user.createTime = new Date().valueOf()
        //     const newUser = await this.userRepository.save(user)
        //     const payload = { userId: newUser.userId }
        //     // 默认加入群组
        //     await this.groupUserRepository.save({
        //       userId: newUser.userId,
        //       groupId: defaultGroupId
        //     })
        //     // 默认添加机器人为好友 双向添加
        //     await this.userMapRepository.save({
        //       userId: newUser.userId,
        //       friendId: defaultRobotId
        //     })
        //     await this.userMapRepository.save({
        //       friendId: defaultRobotId,
        //       userId: newUser.userId
        //     })
        //     // 机器人欢迎语(默认留言)
        //     await this.friendMessageRepository.save({
        //       userId: defaultRobotId,
        //       friendId: newUser.userId,
        //       content: defaultWelcomeMessage,
        //       messageType: 'text',
        //       time: new Date().valueOf()
        //     })
        //     return {
        //       msg: '注册成功',
        //       data: {
        //         user: newUser,
        //         token: this.jwtService.sign(payload)
        //       }
        //     }
        //   } else {
        //     return { code: RCode.FAIL, msg: '验证码错误', data: '' }
        //   }
        // }
      }
    }
  }

  async retrieve(mail: Mail): Promise<any> {
    if(!emailVerify(mail.email)){
      return {
        code: RCode.FAIL,
        msg: '邮件格式不正确'
      }
    }
    if (!nameVerify(mail.username)) {
      return {
        code: RCode.FAIL,
        msg: '昵称格式不正确'
      }
    }
    if (!passwordVerify(mail.password)) {
      return {
        code: RCode.FAIL,
        msg: '密码格式不正确'
      }
    }
    // console.log("start register");
    const isHaveEmail = await this.userRepository.find({ email: mail.email })
    let tempUser:User = isHaveEmail.pop();
    // console.log(isHave);
    if (!tempUser) {    //是否被注册过
      return { code: RCode.FAIL, msg: '该邮箱未被注册', data: '' }
    }else {


      if(tempUser.username !== mail.username) { //昵称是否重复
        return { code: RCode.FAIL, msg: '邮箱昵称无法对应', data: '' }
      } else {

        /*以下为redis试用*/

        const flag = await redisClient.exitsString(mail.email);
        const code = await redisClient.getString(mail.email);//fix by:gyy 解决回调函数异步问题 20230502
        // promise.then( res => {
        //   console.log('then被调用了:',res);
        //   flag = res;
        // })
        //   .catch( err => {
        //     console.log('catch 被调用了:',err);
        //   })
        // console.log("123123"+flag);
        // console.log(code);


        if(flag === true){
          if(mail.code === code) {

            try {
              if (tempUser) {
                const newUser = await this.userRepository.findOne({
                  userId: tempUser.userId
                })
                const backUser = JSON.parse(JSON.stringify(newUser))
                newUser.password = sha256(mail.password)
                await this.userRepository.update(tempUser.userId, newUser)
                return { msg: '更新用户密码成功', data: backUser }
              }
              return { code: RCode.FAIL, msg: '更新失败', data: '' }
            } catch (e) {
              return { code: RCode.ERROR, msg: '更新用户密码失败', data: e }
            }
          } else {
            return { code: RCode.FAIL, msg: '验证码错误', data: '' }
          }
        }else {
          return { code: RCode.FAIL, msg: '验证码已超时或不存在，请重新发送', data: '' }
        }

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
