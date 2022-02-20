import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Chat',
    component: () => import('@/views/Chat.vue'),
  },
  {
    path: '/',
    name: 'Test1',// 注册功能需要依赖此bug运行，不过这行注释可以删
    component: () => import('@/views/Prechat.vue'),
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
