import Vue from 'vue'
import VueRouter from 'vue-router'
import Main from '../views/Main.vue'
import Rooms from '../views/vues/RoomList.vue'
import Room from '../views/vues/RoomDetail.vue'
import createRoom from '../views/vues/RoomCreate.vue'
import Register from '../views/vues/UserRegister.vue'

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
  },
  {
    path: '/register',
    name: 'register',
    component: Register
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  console.log(to.name, from.name)

  if ((to.name=='Room'&&from.name==null) || (to.name=='Rooms'&&from.name=='Room')) next('/')

  next()
})

export default router
