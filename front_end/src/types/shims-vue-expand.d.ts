/* eslint-disable */
import VueRouter, { Route } from 'vue-router';
import { Store } from 'vuex';
import * as lodash from 'lodash';

// 扩充Vue自定义的类型
declare module 'vue/types/vue' {
  interface Vue {
    $router: VueRouter;
    $localforage: any
    $route: Route;
    $store: Store<any>;
    $lodash: typeof lodash;
  }
}
