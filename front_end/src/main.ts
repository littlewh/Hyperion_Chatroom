import Vue from 'vue';
import Viewer from 'v-viewer'; // 图片预览插件
import moment from 'moment'; // 引入moment
import contentmenu from 'v-contextmenu';
import lodash from 'lodash';
import localforage from 'localforage';
import App from './App.vue';
import router from './router';
import store from './store';
// eslint-disable-next-line import/no-extraneous-dependencies
import 'viewerjs/dist/viewer.css';
import './antd/ant-desigin'; // 引入ant-desigin
import 'v-contextmenu/dist/index.css';

Vue.config.productionTip = false;
// 使用中文时间
Vue.prototype.$moment = moment;
// lodash
Vue.prototype.$lodash = lodash;

Vue.prototype.$localforage = localforage;

Vue.use(contentmenu);
Vue.use(Viewer, {
  defaultOptions: {
    navbar: false,
    title: false,
    toolbar: {
      zoomIn: 1,
      zoomOut: 1,
      oneToOne: 4,
      reset: 4,
      prev: 0,
      next: 0,
      rotateLeft: 4,
      rotateRight: 4,
      flipHorizontal: 4,
      flipVertical: 4,
    },
  },
});

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app'); // 挂载到app.vue,与钩子函数mounted联系到一起
