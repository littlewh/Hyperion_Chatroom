import { Controller, Injectable } from '@nestjs/common';
import { Column, PrimaryGeneratedColumn } from 'typeorm';

const authNodemailer = require('nodemailer');

//创建一个smtp服务器
const config = {
  host: 'smtp.qq.com',
  port: 465,
  auth: {
    user: '2313722687@qq.com', //注册邮箱账号
    pass: 'fztyhfwddrikecig' //邮箱的授权码
  }
};

// let mailTransport = authNodemailer.createTransport({
//   // host: 'smtp.qq.email',
//   service:'qq',
//   secure: true,	//安全方式发送,建议都加上
//   auth: {
//     user: '2313722687@qq.com',
//     pass: 'fztyhfwddrikecig'
//   }
// })


// 创建一个SMTP客户端对象
const transporter = authNodemailer.createTransport(config);

@Injectable()
export class Nodemailer {
  constructor() {}
  async sendmail(text){
    transporter.sendMail(text);
  }
}
// //发送邮件
// module.exports = function (mail){
//
//   transporter.sendMail(mail, function(error, info){
//     if(error) {
//       return console.log(error);
//     }
//     console.log('mail sent:', info.response);
//   });
// };
