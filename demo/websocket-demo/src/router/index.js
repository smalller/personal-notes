import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

const routes = [{
    path: '/index',
    name: 'index',
    component: () => import('../views/Index.vue'),
    meta: {
      isLogin: true
    }
  },
  {
    path: '/demo',
    name: 'demo',
    component: () => import('../views/demo.vue'),
    meta: {
      isLogin: true
    }
  },
  {
    path: '/user',
    name: 'user',
    component: () => import('../views/user.vue'),
    children: [
      {
        path: '/',
        name: 'login',
        component: () => import('../views/login.vue'),
      },
      {
        path: '/login',
        name: 'login',
        component: () => import('../views/login.vue'),
      },
      {
        path: '/resg',
        name: 'resg',
        component: () => import('../views/resg.vue'),
      },
    ]
  },
  {
    path: '/',
    name: 'user',
    component: () => import('../views/user.vue'),
    children: [
      {
        path: '/',
        name: 'login',
        component: () => import('../views/login.vue'),
      },
      {
        path: '/login',
        name: 'login',
        component: () => import('../views/login.vue'),
      },
      {
        path: '/resg',
        name: 'resg',
        component: () => import('../views/resg.vue'),
      },
    ]
  },

]

const router = new VueRouter({
  routes
})

export default router