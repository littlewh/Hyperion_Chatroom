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
    path: '/Test1',
    name: 'Test1',
    component: () => import('@/views/Test1.vue'),
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
