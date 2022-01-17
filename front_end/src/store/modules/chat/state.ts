export interface ChatState {
  socket: SocketIOClient.Socket;
  dropped: boolean;
}

const chatState: ChatState = {
  // @ts-ignore
  socket: null, // ws实例
  dropped: false, // 是否断开连接

};

export default chatState;
