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
import { sha256 } from 'src/common/tool/utils'
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
    const email = mail.email;//刚刚从前台传过来的邮箱

    const isHave = await this.userRepository.find({ email: mail.email })

    if (isHave.length) {
      return { code: RCode.FAIL, msg: '该邮箱已被注册', data: '' }
    } else {
      // await this.mailRepository.delete({email: mail.email});//保证只有一条生效

      const code = this.createSixNum();//随机六位数
      // const time = new Date().valueOf();//获取当前时间
      console.log(code);
      // console.log("2");
//       const text = {
//         // 发件人
//         from: '休伯利安<2313722687@qq.com>',
//         // 主题
//         subject: '休伯利安新人指引',//邮箱主题
//         // bcc: '密送',
//         // 收件人
//         to:email,//前台传过来的邮箱
//         // 邮件内容
//         html:  `
//             <table cellpadding="0" cellspacing="0" border="0" width="750" class="table750" style="width: 100%; max-width: 750px; min-width: 350px; background: #f3f3f3;">
//               <tr>
//                 <td class="mob_pad" width="25" style="width: 25px; max-width: 25px; min-width: 25px;">&nbsp;</td>
//                 <td align="center" valign="top" style="background: #ffffff;">
//                   <table cellpadding="0" cellspacing="0" border="0" width="100%" style="width: 100% !important; min-width: 100%; max-width: 100%; background: #f3f3f3;">
//                     <tr>
//                       <td align="right" valign="top">
//                         <div class="top_pad" style="height: 25px; line-height: 25px; font-size: 23px;">&nbsp;</div>
//                       </td>
//                     </tr>
//                   </table
//                   <table cellpadding="0" cellspacing="0" border="0" width="88%" style="width: 88% !important; min-width: 88%; max-width: 88%;">
// <!--            logo-->
//                     <table cellpadding="0" cellspacing="0" border="0" width="88%" style="width: 88% !important; min-width: 88%; max-width: 88%;">
//                       <tr>
//                         <td align="left" valign="top">
//                           <div style="height: 39px; line-height: 39px; font-size: 37px;">&nbsp;</div>
//                           <font class="mob_title1" face="'Source Sans Pro', sans-serif" color="#1a1a1a" style="font-size: 52px; line-height: 55px; font-weight: 300; letter-spacing: -1.5px;">
//                             <a
//                               href="https://github.com/littlewh/Hyperion_Chatroom"
//                               style="text-decoration:none">
//                                 <span
//                                   class="mob_title1"
//                                   style="font-family: 'Impact MT Std', Arial, Tahoma, Geneva,
//                                   sans-serif;
//                                   color: #6777ef;
//                                   font-size: 48px;
//                                   line-height: 55px;
//                                   font-weight: 700;
//                                   letter-spacing: -1.5px;"
//                                   >Hyperion_Chatroom
//                                 </span>
//                               </a>
//                           </font>
//                           <div style="height: 73px; line-height: 73px; font-size: 71px;">&nbsp;</div>
//                         </td>
//                       </tr>
//                     </table>
// <!--            context-->
//                     <table cellpadding="0" cellspacing="0" border="0" width="88%" style="position: center width: 88% !important; min-width: 88%; max-width: 88%;">
//                       <tr>
//                         <td align="left" valign="top">
//                           <font face="'Nunito', sans-serif" color="#1a1a1a" style="font-size: 52px; line-height: 60px; font-weight: 300; letter-spacing: -1.5px;">
//                             <span
//                               style="font-family: 'Nunito', Arial, Tahoma, Geneva,
//                               sans-serif;
//                               color: #1a1a1a;
//                               font-size: 52px;
//                               line-height: 60px;
//                               font-weight: 300;
//                               letter-spacing: -1.5px;"
//                               >Captain On The Bridge!
//                             </span>
//                           </font>
//                           <div style="height: 33px; line-height: 33px; font-size: 31px;">&nbsp;</div>
//                           <font
//                             face="'Microsoft JhengHei', sans-serif" color="#585858"
//                             style="font-size: 24px;
//                             line-height: 32px;">
//                             <span
//                               style="font-family: 'Microsoft JhengHei', Arial, Tahoma, Geneva, sans-serif;
//                               color: #585858;
//                               font-size: 24px;
//                               line-height: 32px;"
//                               >您正在申请接入休伯利安聊天室,本次操作的验证码是
//                             </span>
//                           </font>
// <!--                  code-->
//                           <div style="height: 33px; line-height: 33px; font-size: 31px;">&nbsp;</div>
//                           <table class="mob_btn" cellpadding="0" cellspacing="0" border="0" style="background: #6777ef; border-radius: 4px;">
//                             <tr>
//                               <td align="center" valign="top">
//                                   <span style="display: block; border: 1px solid #6777ef; border-radius: 0px; padding: 6px 12px; font-family: 'Nunito', Arial, Verdana, Tahoma, Geneva, sans-serif; color: #ffffff; font-size: 20px; line-height: 30px; text-decoration: none; white-space: nowrap; font-weight: 600;">
//                                     <font
//                                       face="'Nunito', sans-serif" color="#ffffff" style="font-size: 20px;
//                                       line-height: 30px;
//                                       text-decoration: none;
//                                       white-space: nowrap;
//                                       font-weight: 600;">
//                                       <span
//                                         style="font-family: 'Nunito', Arial, Verdana, Tahoma, Geneva, sans-serif;
//                                         color: #ffffff;
//                                         font-size: 20px;
//                                         line-height: 30px;
//                                         text-decoration: none;
//                                         white-space: nowrap;
//                                         font-weight: 600;"
//                                         >${code}
//                                         </span>
//                                     </font>
//                                   </span>
//                               </td>
//                             </tr>
//                           </table>
// <!--                  tips-->
//                           <div style="height: 18px; line-height: 33px; font-size: 31px;">&nbsp;</div>
//                           <font
//                             face="'Microsoft JhengHei', sans-serif" color="#585858" style="font-size: 24px;
//                             line-height: 32px;">
//                             <span
//                               style="font-family: 'Microsoft JhengHei', Arial, Tahoma, Geneva, sans-serif;
//                               color: #aaaaaa;
//                               font-size: 16px;
//                               line-height: 32px;"
//                               >
//                                 <p>这验证码十分的珍贵</p>
//                                 <p>请在10分钟内用掉它</p>
//                                 <p>打死都不能告诉别人哦(ᗜ ˰ ᗜ)</p>
//                             </span>
//                           </font>
//                         </td>
//                       </tr>
//                     </table>
//                   </table>
//                 </td>
//               </tr>
//             </table>
//           `
//       };
//       // console.log("3");
//
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
          let msg = JSON.stringify(value);
          channel.assertQueue(queue, {
            durable: false
          });
          channel.sendToQueue(queue, Buffer.from(msg));

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
  }
  async login(data: User): Promise<any> {
    // console.log(data.userId);
    // console.log(data.username);
    // console.log(data.password);
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
        token: this.jwtService.sign(payload)
      }
    }
  }

  async register(mail: Mail): Promise<any> {
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
                token: this.jwtService.sign(payload)
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

 // 获取当前token携带信息
  verifyUser(token): User {
    if (!token) return null
    const user = jwt.verify(token, jwtConstants.secret) as User
    return user
  }
}
