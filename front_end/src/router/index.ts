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
    path: '/RegisterForChat',
    name: 'RegisterForChat',
    component: () => import('@/views/RegisterForChat.vue'),
  },
  {
    path: '/RetrievePasswordChat',
    name: 'RetrievePasswordChat',
    component: () => import('@/views/RetrievePasswordChat.vue'),
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
