import { ActionTree } from 'vuex';
import io from 'socket.io-client';
import Vue from 'vue';
import { SET_LOADING, CLEAR_USER } from '../app/mutation-types';
import { ChatState } from './state';
import { RootState } from '../../index';
import {
  SET_SOCKET,
  USER_ONLINE,
  USER_OFFLINE,
} from './mutation-types';

const actions: ActionTree<ChatState, RootState> = {
  // 初始化socket连接和监听socket事件
  async connectSocket({ commit, state, dispatch, rootState }) {
    const { user, token } = rootState.app;
    const socket: SocketIOClient.Socket = io.connect(`ws://${process.env.VUE_APP_API_URL.split('http://')[1]}`, {
      reconnection: true,
      query: {
        token,
        userId: user.userId,
      },
    });
    // token校验,失败则要求重新登录
    socket.on('unauthorized', (msg: string) => {
      Vue.prototype.$message.error(msg);
      // 清空token,socket
      commit(`app/${CLEAR_USER}`, {}, { root: true });
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    });

    socket.on('connect', async () => {
      console.log('连接成功');
      // 获取聊天室所需所有信息
      socket.emit('chatData', token);

      // 先保存好socket对象
      commit(SET_SOCKET, socket);
    });
    // 用户上线
    socket.on('userOnline', (data: any) => {
      console.log('userOnline', data);
      commit(USER_ONLINE, data.data);
    });

    // 用户下线
    socket.on('userOffline', (data: any) => {
      console.log('userOffline', data);
      commit(USER_OFFLINE, data.data);
    });
  },

};

export default actions;
