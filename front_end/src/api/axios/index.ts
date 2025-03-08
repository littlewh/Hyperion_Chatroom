import axios, { AxiosInstance } from 'axios';
import { requestSuccess, requestFail, responseSuccess, responseFail } from './interceptors';

const fetch: AxiosInstance = axios.create({
  timeout: 60000, // 超时时间一分钟
  baseURL: process.env.VUE_APP_API_URL,// VUE_APP_API_URL=http://localhost:3000/api
  headers: {
    'Cache-Control': 'no-cache',// no-cache: 不使用缓存，只有在缓存中不存在对应资源时，才会向服务器请求
    Pragma: 'no-cache',
  },
  withCredentials: false,// 不携带cookie，防止跨站点请求伪造（CSRF）攻击
});

fetch.interceptors.request.use(requestSuccess, requestFail);// 请求拦截器
fetch.interceptors.response.use(responseSuccess, responseFail);// 响应拦截器

export default fetch;
