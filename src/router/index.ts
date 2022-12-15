import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CameraView from '../views/CameraView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: CameraView
    },
    // {
    //   path: '/camera',
    //   name: 'camera',
    //   component: () => import('../views/CameraView.vue')
    // }
  ]
})

export default router
