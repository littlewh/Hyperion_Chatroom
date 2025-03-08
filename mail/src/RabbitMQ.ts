/* eslint-disable */
const authNodemailer = require('nodemailer');
var amqp = require('amqplib/callback_api');

//创建一个smtp服务器
const config = {
  host: 'smtp.qq.com',
  port: 465,
  auth: {
    user: '2313722687@qq.com', //注册邮箱账号
    pass: 'fztyhfwddrikecig' //邮箱的授权码
  }
};
// 创建一个SMTP客户端对象
const transporter = authNodemailer.createTransport(config);

/**
 * RabbitMQ sendCode function
 * @param codeString
 */

const sendCode = () => {
  return new Promise((resolve, reject) => {
    amqp.connect('amqp://localhost', function(error0, connection) {
      if (error0) {
        console.log(error0);
        const flag = false;
        reject(flag);
      }
      connection.createChannel(function(error1, channel) {
        if (error1) {
          console.log(error1);
          const flag = false;
          reject(flag);
        }

        var queue = 'MailCode';
        channel.assertQueue(queue, {
          durable: false
        });
        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);

        channel.consume(queue, function(msg) {
          console.log(" [x] Received %s", msg.content.toString());
          let json = JSON.parse(msg.content.toString());
          const text = {
            // 发件人
            from: '休伯利安<2313722687@qq.com>',
            // 主题
            subject: '休伯利安新人指引',//邮箱主题
            // bcc: '密送',
            // 收件人
            to:json.email,//前台传过来的邮箱
            // 邮件内容
            html:  `
            <table cellpadding="0" cellspacing="0" border="0" width="750" class="table750" style="width: 100%; max-width: 750px; min-width: 350px; background: #f3f3f3;">
              <tr>
                <td class="mob_pad" width="25" style="width: 25px; max-width: 25px; min-width: 25px;">&nbsp;</td>
                <td align="center" valign="top" style="background: #ffffff;">
                  <table cellpadding="0" cellspacing="0" border="0" width="100%" style="width: 100% !important; min-width: 100%; max-width: 100%; background: #f3f3f3;">
                    <tr>
                      <td align="right" valign="top">
                        <div class="top_pad" style="height: 25px; line-height: 25px; font-size: 23px;">&nbsp;</div>
                      </td>
                    </tr>
                  </table
                  <table cellpadding="0" cellspacing="0" border="0" width="88%" style="width: 88% !important; min-width: 88%; max-width: 88%;">
<!--            logo-->             
                    <table cellpadding="0" cellspacing="0" border="0" width="88%" style="width: 88% !important; min-width: 88%; max-width: 88%;">
                      <tr>
                        <td align="left" valign="top">
                          <div style="height: 39px; line-height: 39px; font-size: 37px;">&nbsp;</div>
                          <font class="mob_title1" face="'Source Sans Pro', sans-serif" color="#1a1a1a" style="font-size: 52px; line-height: 55px; font-weight: 300; letter-spacing: -1.5px;">
                            <a 
                              href="https://github.com/littlewh/Hyperion_Chatroom" 
                              style="text-decoration:none">
                                <span 
                                  class="mob_title1" 
                                  style="font-family: 'Impact MT Std', Arial, Tahoma, Geneva, 
                                  sans-serif; 
                                  color: #6777ef; 
                                  font-size: 48px; 
                                  line-height: 55px; 
                                  font-weight: 700; 
                                  letter-spacing: -1.5px;"
                                  >Hyperion_Chatroom
                                </span>
                              </a>
                          </font>
                          <div style="height: 73px; line-height: 73px; font-size: 71px;">&nbsp;</div>
                        </td>
                      </tr>
                    </table>     
<!--            context-->                  
                    <table cellpadding="0" cellspacing="0" border="0" width="88%" style="position: center width: 88% !important; min-width: 88%; max-width: 88%;">
                      <tr>
                        <td align="left" valign="top">
                          <font face="'Nunito', sans-serif" color="#1a1a1a" style="font-size: 52px; line-height: 60px; font-weight: 300; letter-spacing: -1.5px;">
                            <span 
                              style="font-family: 'Nunito', Arial, Tahoma, Geneva, 
                              sans-serif; 
                              color: #1a1a1a; 
                              font-size: 52px; 
                              line-height: 60px; 
                              font-weight: 300; 
                              letter-spacing: -1.5px;"
                              >Captain On The Bridge!
                            </span>
                          </font>                
                          <div style="height: 33px; line-height: 33px; font-size: 31px;">&nbsp;</div>
                          <font 
                            face="'Microsoft JhengHei', sans-serif" color="#585858" 
                            style="font-size: 24px; 
                            line-height: 32px;">
                            <span 
                              style="font-family: 'Microsoft JhengHei', Arial, Tahoma, Geneva, sans-serif; 
                              color: #585858; 
                              font-size: 24px; 
                              line-height: 32px;"
                              >您正在申请接入休伯利安聊天室,本次操作的验证码是
                            </span>
                          </font>
<!--                  code-->
                          <div style="height: 33px; line-height: 33px; font-size: 31px;">&nbsp;</div>
                          <table class="mob_btn" cellpadding="0" cellspacing="0" border="0" style="background: #6777ef; border-radius: 4px;">
                            <tr>
                              <td align="center" valign="top">
                                  <span style="display: block; border: 1px solid #6777ef; border-radius: 0px; padding: 6px 12px; font-family: 'Nunito', Arial, Verdana, Tahoma, Geneva, sans-serif; color: #ffffff; font-size: 20px; line-height: 30px; text-decoration: none; white-space: nowrap; font-weight: 600;">
                                    <font 
                                      face="'Nunito', sans-serif" color="#ffffff" style="font-size: 20px; 
                                      line-height: 30px; 
                                      text-decoration: none; 
                                      white-space: nowrap; 
                                      font-weight: 600;">
                                      <span 
                                        style="font-family: 'Nunito', Arial, Verdana, Tahoma, Geneva, sans-serif; 
                                        color: #ffffff; 
                                        font-size: 20px; 
                                        line-height: 30px; 
                                        text-decoration: none; 
                                        white-space: nowrap; 
                                        font-weight: 600;"
                                        >${json.code}
                                        </span>
                                    </font>
                                  </span>
                              </td>
                            </tr>
                          </table>
<!--                  tips-->
                          <div style="height: 18px; line-height: 33px; font-size: 31px;">&nbsp;</div>
                          <font
                            face="'Microsoft JhengHei', sans-serif" color="#585858" style="font-size: 24px; 
                            line-height: 32px;">
                            <span 
                              style="font-family: 'Microsoft JhengHei', Arial, Tahoma, Geneva, sans-serif; 
                              color: #aaaaaa; 
                              font-size: 16px; 
                              line-height: 32px;"
                              >
                                <p>这验证码十分的珍贵</p>
                                <p>请在10分钟内用掉它</p>
                                <p>打死都不能告诉别人哦(ᗜ ˰ ᗜ)</p>
                            </span>
                          </font>
                        </td>
                      </tr>
                    </table>
                  </table>
                </td>
              </tr>
            </table>        
          `
          };
          try {
            transporter.sendMail(text);
            channel.ack(msg)
          }
          catch (e) {
            channel.nack(msg,false,true)
          }
        }, {
          noAck: false//
        });
      });
      // setTimeout(function() {
      //   connection.close();
      //   process.exit(0);
      // }, 500);
    });
  })
}

module.exports = {
  sendCode,
}
