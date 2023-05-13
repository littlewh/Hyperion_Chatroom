import cookie from 'js-cookie';

export interface AppState {
  user: User;
  token: string;
  mobile: boolean;
  background: string;
  activeTabName: 'message' | 'contacts';
  apiUrl: string;
  loading: boolean;
}

const appState: AppState = {
  user: {
    userId: '',
    username: '',
    password: '',
    avatar: '',
    email: '',
    createTime: 0,
  },
  token: cookie.get('token') as string,
  mobile: false,
  background: '',
  activeTabName: 'message',
  apiUrl: process.env.VUE_APP_API_URL, // 后台api地址,CORS解决跨域问题
  loading: false, // 全局Loading状态
};

export default appState;
