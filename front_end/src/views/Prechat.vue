<template>
  <div
    class="chat"
    :style="{
      '--bg-image': `url('${background}')`,
    }"
  >
    <div id="magicalDragScene" class="mc-root mc-ui-absolute-pane" style="width: 103%">
      <div
        class="mc-ui-geometry-rectangle mc-ui-flex-center"
        style="
          border-radius: 25px;
          background-color: rgba(255, 255, 255, 0.66);
          width: 400px;
          height: 440px;
          position: absolute;
          left: 30%;
          top: 10%;
        "
      ></div>
      <a-text
        style="font-size: 15px; color: #3094fc; position: absolute; left: 55%; top: 25%; cursor: pointer; text-decoration-line: underline"
        @click="back"
        >已有帐号？直接登录</a-text
      >

      <!--      <a-text style=" font-size: 15px; color:#3094fc; position: absolute; left: 55%; top: 67%; cursor: pointer; text-decoration-line: underline;" @click="back">已有帐号？直接登录</a-text>-->
      <a-text style="font-family: 幼圆; font-size: 33px; color: #3094fc; position: absolute; left: 47.5%; top: 15%">注册</a-text>
      <!--      register里type是register，所以使用@register-->
      <Register style="position: absolute; left: 40%; top: 30%; width: 25%" @register="handleRegister"></Register>

      <!--      <a-text style="color: rgb(100, 100, 100); position: absolute; left: 35%; top: 31%">昵称 :</a-text>-->
      <!--      <a-input id="username" style="position: absolute; left: 40%; top: 30%; width: 25%"  placeholder="请输入昵称"></a-input>-->

      <!--      <a-text style="color: rgb(100, 100, 100); position: absolute; left: 35%; top: 41%">密码 :</a-text>-->
      <!--      <a-input id="password" style="position: absolute; left: 40%; top: 40%; width: 25%" placeholder="请输入密码"></a-input>-->

      <!--      <a-text style="color: rgb(100, 100, 100); position: absolute; left: 35%; top: 51%">邮箱 :</a-text>-->
      <!--      <a-input id="email" style="position: absolute; left: 40%; top: 50%; width: 25%" placeholder="请输入邮箱"></a-input>-->

      <!--      <a-text style="color: rgb(100, 100, 100); position: absolute; left: 33.5%; top: 61%">验证码 :</a-text>-->
      <!--      <a-input-->
      <!--        id="checkcode"-->
      <!--        style="position: absolute; left: 40%; top: 60%; width: 12.6506%"-->
      <!--        placeholder="验证码"-->
      <!--      ></a-input>-->
      <!--      <a-button style="position: absolute; border: 0px; left: 54.75%; top: 60%" @click="sendmail">获取验证码</a-button>-->
      <!--      <a-button-->
      <!--        shape="round"-->
      <!--        style="-->
      <!--          border-color: #66b1ff;-->
      <!--          color: rgba(255, 255, 255, 1);-->
      <!--          background-color: #66b1ff;-->
      <!--          position: absolute;-->
      <!--          left: 35.5%;-->
      <!--          top: 75%;-->
      <!--          width: 30%;-->
      <!--          height: 40px;-->
      <!--        "-->
      <!--        @submit="submitRegister"-->
      <!--        >注册-->
      <!--      </a-button>-->
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import Nav from '@/components/Guide.vue';
import Register from '@/components/Register.vue';
import Login from '@/components/Login.vue';

const appModule = namespace('app');
const chatModule = namespace('chat');

@Component({
  components: {
    Login,
    Register,
    Nav,
  },
})
export default class Chat extends Vue {
  @appModule.Getter('user') user: User;

  @appModule.Getter('background') background: string;

  @appModule.Action('register') register: Function;

  @appModule.Action('send') send: Function;

  @chatModule.Getter('socket') socket: SocketIOClient.Socket;

  @chatModule.Action('connectSocket') connectSocket: Function;

  async back() {
    await this.$router.push({ name: 'Chat' });
  }

  // 发验证码 注册

  async handleRegister(email: Email) {// 1.共用一个按钮，根据code有无去更改按钮文字，2.两个按钮一个事件 但不一定发送
    console.log('handleregister');
    console.log(email);
    if (email.code == undefined || email.code === '') {
      // 验证码
      const res = await this.send(email);
      if (res) {
        // 进入系统事件
        await this.handleJoin();
      }
    } else {
      const res = await this.register(email);
      if (res) {
        // 进入系统事件
        await this.handleJoin();
        this.$router.go(0); // 刷新页面
      }
    }
  }
  // async sendmail(user: User) {
  //   const res = await this.send(user);
  //   if (res) {
  //     this.handleJoin();
  //   }
  // }

  async handleJoin() {
    // 进入系统初始化事件
    this.connectSocket();
  }
}
</script>
<style lang="scss" scoped>
@import '@/styles/theme';
.chat {
  font-size: 16px;
  z-index: 999;
  max-width: 1000px;
  min-width: 300px;
  width: 100%;
  height: 80%;
  max-height: 800px;
  min-height: 470px;
  position: relative;
  margin: auto 20px;
  box-shadow: 10px 20px 80px rgba(0, 0, 0, 0.8);
  display: flex;
  border-radius: 8px;
  overflow: hidden;
  .chat-part1 {
    width: 74px;
    height: 100%;
    background-color: rgb(0, 0, 0, 0.7);
  }
  .chat-part2 {
    width: 260px;
    height: 100%;
    background-color: rgb(0, 0, 0, 0.3);
    border-right: 1px solid #d6d6d6;
    background: $room-bg-color;
    overflow: auto;
  }
  .chat-part3 {
    flex: 1;
    height: 100%;
    background: $room-bg-color;
    // background-color: rgb(0, 0, 0, 0.2);
    overflow-y: hidden;
    position: relative;
    .chat-group {
      height: 53px;
      border-bottom: 1px solid #ccc;
      line-height: 50px;
      font-weight: bold;
    }
  }
  .chat-team {
    display: none;
  }
  .chat-nav {
    display: none;
  }
}
.chat::after {
  content: '';
  background: var(--bg-image) 0 / cover fixed;
  position: absolute;
  object-fit: cover;
  width: 100%;
  height: 100%;
  filter: blur(10px);
  transform: scale(1.08);
  z-index: -1;
}

@media screen and (max-width: 768px) {
  .chat {
    margin: 0;
    height: 100%;
    .chat-part2 {
      display: none;
    }
    .chat-team {
      display: block !important;
      position: absolute;
      font-size: 20px;
      top: 20px;
      color: #080808;
      right: 100px;
      z-index: 999;
      &:active {
        color: $primary-color;
      }
    }
    .chat-nav {
      display: block !important;
      position: absolute;
      font-size: 20px;
      top: 16px;
      color: #080808;
      right: 62px;
      z-index: 999;
      &:active {
        color: $primary-color;
      }
      &:hover {
        color: #0e7def;
      }
    }
  }
}
</style>
