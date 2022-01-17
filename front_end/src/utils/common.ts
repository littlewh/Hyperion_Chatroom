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
  // code 0:成功 1:错误 2:后端报错
  const { code, msg, data } = res.data;
  if (code) {
    Vue.prototype.$message.error(msg);
    return;
  }
  if (msg) {
    Vue.prototype.$message.success(msg);
  }
  return data;
}

// 用户名校验
export function nameVerify(name: string): boolean {
  const nameReg = /^(?!_)(?!.*?_$)[a-zA-Z0-9_\u4e00-\u9fa5]+$/;
  if (name.length === 0) {
    Vue.prototype.$message.error('昵称不能为空');
    return false;
  }
  if (!nameReg.test(name)) {
    Vue.prototype.$message.error('名字只能含有汉字、字母、数字和下划线 不能以下划线开头和结尾');
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
    Vue.prototype.$message.error('密码不能为空');
    return false;
  }
  if (!passwordReg.test(password)) {
    Vue.prototype.$message.error('密码只能含有字母、数字和下划线');
    return false;
  }
  if (password.length > 16) {
    Vue.prototype.$message.error('密码最多16位,请重新输入');
    return false;
  }
  return true;
}
