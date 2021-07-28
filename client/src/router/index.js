import Vue from 'vue'
import VueRouter from 'vue-router'
import Main from '../views/Main.vue'
import Rooms from '../views/vues/RoomList.vue'
import Room from '../views/vues/RoomDetail.vue'
import createRoom from '../views/vues/RoomCreate.vue'

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
  },
  {
    path: '/createRoom',
    name: 'createRoom',
    component: createRoom
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
