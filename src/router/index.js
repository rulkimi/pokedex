import { createWebHashHistory, createRouter } from 'vue-router';

const routes = [
  { path: '/', component: () => import('@/views/ThePokedex.vue') },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router;