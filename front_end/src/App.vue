<template>
  <div id="app">
    <a-config-provider :locale="locale">
      <router-view />
    </a-config-provider>
    <img class="background" v-if="background" :src="background" alt="" />
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN';
import { DEFAULT_BACKGROUND } from '@/images';

const appModule = namespace('app');

@Component
export default class Chat extends Vue {
  @appModule.Getter('background') background: string;

  @appModule.Mutation('set_mobile') setMobile: Function;

  @appModule.Mutation('set_background') set_background: Function;

  locale: any = zhCN;

  // 钩子函数
  mounted() {
    if (!this.background || !this.background.trim().length) {
      this.set_background(DEFAULT_BACKGROUND);
    }
  }
}
</script>
<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  height: 100%;
  width: 100%;
  overflow: hidden;
  background-size: cover;
  color: rgba(255, 255, 255, 0.55);
  background-color: #fff;
  .background {
    position: absolute;
    object-fit: cover;
    width: 100%;
    height: 100%;
  }
}
</style>
