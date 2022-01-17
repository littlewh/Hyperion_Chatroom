import axios from '@/api/axios';

// 更新用户名
export const patchUserName = (username: string) => axios.patch(`/user/username?username=${username}`);

// 更新用户名密码
export const patchPassword = (password: string) => axios.patch(`/user/password?password=${password}`);

// 搜索用户
export function getUsersByName(username: string) {
  return axios.get(`/user/findByName?username=${username}`);
}

// 头像上传
export function setUserAvatar(params: FormData) {
  return axios.post('/user/avatar', params, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

// 删除用户
export function deleteUser(params: any) {
  return axios.delete('/user', { params });
}
