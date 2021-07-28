import Vue from 'vue'
import VueRouter from 'vue-router'
import Main from '../views/Main.vue'
import Rooms from '../views/vues/RoomList.vue'
import Room from '../views/vues/RoomDetail.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Main',
    component: Main
  },
  {
    path: '/rooms',
    name: 'Rooms',
    // component: () => import('../views/waitingRoom.vue')
    component: Rooms
  },
  {
    path: '/rooms/:id',
    name: 'Room',
    component: Room
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
