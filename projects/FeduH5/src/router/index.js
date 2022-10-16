import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/about',
    name: 'About',
    component: () => import( '../views/About.vue')
  },
  {
    path: '/homePage',
    name: 'HomePage',
    component: () => import( '../components/homePage.vue')
  },
  {
    path: '/Pay',
    name: 'Pay',
    component: () => import('../components/Pay.vue')
  },
  {
    path: '/details',
    name: 'details',
    component: () => import('../views/details')
  },
  {
    path: '/download',
    name: 'download',
    component: () => import('../views/download')
  },
  {
    path: '/mediaDetails',
    name: 'mediaDetails',
    component: () => import('../views/mediaDetails.vue')
  },
  {
    path: '/school',
    name: 'school',
    component: () => import('../views/School')
  },
  {
    path: '/MembershipServiceAgreement',
    name: 'MembershipServiceAgreement',
    component: () => import('../views/info')
  },
  {
    path: '/weChatVipInfo',
    name: 'weChatVipInfo',
    component: () => import('../views/weChatInfo')
  },
  {
    path: '/faceInfo',
    name: 'faceInfo',
    component: () => import('../views/faceInfo')
  },
  {
    path: '/repiceShare',
    name: 'repiceShare',
    component: () => import('../views/RepiceShare.vue')
  },

  {
    path: '/boardcast',
    name: 'boardcast',
    component: () => import('../views/boardcast.vue')
  },
  {
    path: '/broadcast',
    name: 'broadcast',
    component: () => import('../views/broadcast.vue')
  },

  {
    path: '/studentFile',
    name: 'studentFile',
    component: () => import('../views/studentStatus/index'),
    children: [
      {
        path: '',
        name: 'studentFile',
        component: () => import('../views/studentStatus/studentStatus'),
      },
      {
        path: '/studentStatusDetails',
        name: 'studentStatusDetails',
        component: () => import('../views/studentStatus/studentDetails')
      },
      {
        path: '/studentPaper',
        name: 'studentPaper',
        component: () => import('../views/studentStatus/studentPaper.vue')
      },
      {
        path:  '/studentInfo',
        name: 'studentInfo',
        component: () => import('../views/studentStatus/studentInfo.vue')
      },
      {
        path: '/studentText',
        name: 'studentText',
        component: () => import('../views/studentStatus/text')
      }
    ]
  },
  {
    path: '/camera',
    component: () => import('../views/userCamera'),
    children:[
      {
        path: '',
        name: 'cameraInfo',
        component: () => import('../views/userCamera/views/cameraInfo')
      },
      {
        path: 'photo',
        name: 'photo',
        component: () => import('../views/userCamera/views/photo')
      },
      {
        path: 'imageView',
        name: 'imageView',
        component: () => import('../views/userCamera/views/imageView')
      },
      {
        path: 'student',
        name: 'student',
        component: () => import('../views/schoolApply/applyPage.vue')
      },
      {
        path: 'record',
        name: 'record',
        component: () => import('../views/schoolApply/applyList.vue')
      },
      {
        path: 'testImg',
        name: 'testImg',
        component: () => import('../views/userCamera/views/cameraTesting')
      }
    ]
  },
  {
    path: '/openId',
    name: 'openId',
    component: () => import('../views/getOpenId')
  },
  {
    path: '/recruitStudentsPlan',
    name: 'recruitStudentsPlan',
    component: () => import('../views/recruitStudentsPlan/index.vue')
  },
  {
    path: '/planDetail',
    name: 'planDetail',
    component: () => import('../views/recruitStudentsPlan/PlanDetail.vue')
  },
  {
    path: '/weChat',
    name: '',
    component: () => import('../views/weChat'),
    children: [
      {
        path: '',
        name: 'weChatLogin',
        component: () => import('../views/weChat/login')
      },
      {
        path: 'weChatBind',
        name: 'weChatBind',
        component: () => import('../views/weChat/bind')
      },
      {
        path: 'selectStudent',
        name: 'selectStudent',
        component: () => import('../views/weChat/selectStudent')
      }
    ]
  },
  {
    path: '/apply',
    component: () => import('../views/schoolApply/index.vue'),
    children:[
      {
        path: '',
        name: 'apply',
        component: () => import('../views/schoolApply/index.vue')
      },

    ]
  },
  {
    path: '/sxtfGroupSign',
    name: 'sxtfGroupSign',
    component: () => import('../views/sxtf/groupSign')
  },
  {
    path: '/feedback',
    name: 'feedback',
    component: () => import('../views/feedback/index.vue'),
    children: [
      {
        path: '',
        component: () => import('../views/feedback/feedback')
      },
      {
        path: 'success',
        component: () => import('../views/feedback/success')
      },
      {
        path: 'list',
        component: () => import('../views/feedback/list')
      }
    ]
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
