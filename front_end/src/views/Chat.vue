<template>
  <div
    class="chat"
    :style="{
      '--bg-image': `url('${background}')`,
    }"
  >
    <!-- 左侧导航栏 -->
    <div class="chat-part1" v-if="visibleNav">
      <Nav @logout="logout"></Nav>
    </div>
    <!-- 左侧列表 -->
    <div class="chat-part2">
      <template v-if="activeTabName === 'message'">
        <Search> </Search>
      </template>
      <template v-else>
        <Contact></Contact>
      </template>
    </div>
    <!-- 登录注册 -->
    <Login @register="handleRegister" @login="handleLogin" :showModal="showModal"></Login>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import Nav from '@/components/Guide.vue';
import Login from '@/components/Login.vue';
import Search from '@/components/Search.vue';
import Contact from '@/components/Contact.vue';

const appModule = namespace('app');
const chatModule = namespace('chat');

@Component({
  components: {
    Nav,
    Login,
    Search,
    Contact,
  },
})
export default class Chat extends Vue {
  @appModule.Getter('user') user: User;

  @appModule.Mutation('clear_user') clearUser: Function;

  @appModule.Action('login') login: Function;

  @appModule.Action('register') register: Function;

  @appModule.Getter('background') background: string;

  @appModule.Getter('activeTabName') activeTabName: string;

  @chatModule.Getter('socket') socket: SocketIOClient.Socket;

  @chatModule.Action('connectSocket') connectSocket: Function;

  showModal: boolean = false;

  visibleNav: boolean = true;

  created() {
    // 单点登陆 获取url链接中传递的userName,直接后台默认注册登陆
    const { userId, username } = this.$route.query;
    if (userId) {
      this.login({
        userId,
        username,
      }).then((res: any) => {
        if (res) {
          // 进入系统事件
          this.handleJoin();
        }
      });
    } else if (!this.user.userId) {
      this.showModal = true;
    } else {
      this.handleJoin();
    }
  }

  // 登录
  async handleLogin(user: User) {
    const res = await this.login(user);
    if (res) {
      // 进入系统事件
      this.handleJoin();
    }
  }

  // 注册
  async handleRegister(user: User) {
    const res = await this.register(user);
    if (res) {
      // 进入系统事件
      this.handleJoin();
    }
  }

  // 进入系统初始化事件
  async handleJoin() {
    this.showModal = false;
    this.connectSocket();
  }

  // 注销
  logout() {
    this.clearUser();
    this.$router.go(0);
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
    }
  }
}
</style>
