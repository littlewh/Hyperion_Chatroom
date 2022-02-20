import Vue from 'vue';
import { AxiosResponse } from 'axios';

// 服务端返回值格式
interface ServerRes {
  code: number;
  msg: string;
  data: any;
}

// 处理所有后端返回的数据
export function processReturn(res: AxiosResponse<ServerRes>) {
  // code 0:成功 1:错误 2:后端报错 3:等待下一步操作
  const { code, msg, data } = res.data;
  if (code === 1 || code === 2) {
    Vue.prototype.$message.error(msg);
    return;
  } else if (code === 3) {
    if (msg) {
      Vue.prototype.$message.success(msg);
    }
    return; // 单独处理这种情况，避免return空data使得验证误通过
  } else {
    if (msg) {
      Vue.prototype.$message.success(msg);
    }
    return data;
  }
}

// 判断str2是否包含str1
export function isContainStr(str1: string, str2: string) {
  return str2.indexOf(str1) >= 0;
}


// 屏蔽词
export function parseText(text: string) {
  if(isContainStr("党", text) || isContainStr("政", text)) {
    return "*";
  } else if (isContainStr("腾讯", text)) {
    return "tx";
  }
  return text;
}

// URL?

export function isUrl(text: string) {
  // 解析网址
  // eslint-disable-next-line no-useless-escape
  const UrlReg = new RegExp(/http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/);
  console.log("url"+UrlReg.test(text));
  return UrlReg.test(text);
}

// 消息时间格式化
export function formatTime(time: number) {
  const moment = Vue.prototype.$moment;
  // 昨天之前：年月日
  if (moment().add(-1, 'days').startOf('day') > time) {
    return moment(time).format('M/D HH:mm');
  }
  // 昨天
  if (moment().startOf('day') > time) {
    return `昨天 ${moment(time).format('HH:mm')}`;
  }
  // 大于五分钟不显示秒
  // if (new Date().valueOf() > time + 300000) {
  //   return moment(time).format('HH:mm');
  // }
  return moment(time).format('HH:mm');
}

// 昵称校验

export function nameVerify(name: string): boolean {
  const nameReg = /^(?!_)(?!.*?_$)[a-zA-Z0-9_\u4e00-\u9fa5]+$/;
  if (name.length === 0) {
    Vue.prototype.$message.error('请输入名字');
    return false;
  }
  if (!nameReg.test(name)) {
    Vue.prototype.$message.error('名字只含有汉字、字母、数字和下划线 不能以下划线开头和结尾');
    return false;
  }
  if (name.length > 16) {
    Vue.prototype.$message.error('名字太长');
    return false;
  }
  return true;
}

// 密码校验

export function passwordVerify(password: string): boolean {
  const passwordReg = /^\w+$/gis;
  if (password.length === 0) {
    Vue.prototype.$message.error('请输入密码');
    return false;
  }
  if (!passwordReg.test(password)) {
    Vue.prototype.$message.error('密码只含有字母、数字和下划线');
    return false;
  }
  if (password.length > 16) {
    Vue.prototype.$message.error('密码最多16位,请重新输入');
    return false;
  }
  return true;
}

// 邮箱校验

export function emailVerify(email: string): boolean {
  // *.com.cn *.cn
  const emailReg = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
  if (email.length === 0) {
    Vue.prototype.$message.error('邮箱不能为空');
    return false;
  }
  if (!emailReg.test(email)) {
    Vue.prototype.$message.error('邮箱格式不正确');
    return false;
  }
  if (email.length > 256) {
    Vue.prototype.$message.error('邮箱最多256位,请重新输入');
    return false;
  }
  return true;
}
