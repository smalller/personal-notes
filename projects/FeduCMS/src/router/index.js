/**
 * @description router全局配置，如有必要可分文件抽离，其中asyncRoutes只有在intelligence模式下才会用到，pro版只支持remixIcon图标
 * hidden:true                        是否显示在菜单中显示路由（默认值：false）
 * alwaysShow:true                    当只有一级子路由时是否显示父路由是否显示在菜单中显示路由（默认值：false）
 * name:"Demo"                        首字母大写，一定要与vue文件的name对应起来，用于noKeepAlive缓存控制（该项特别重要）
 * menuHidden:true                    常规/横向/纵向模式中，隐藏根布局，仅适用于第一层路由
 * meta:{
    title:"title"                     菜单、面包屑、多标签页显示的名称
    roles:["admin","..."]             当config/settings.js中rolesControl配置开启时，用于控制角色
    roles: {
      role: ["admin"],                role: ["admin"]
      ability: ["READ","WRITE"],      ability: ["READ","WRITE"],
      mode: "allOf"                   allOf: 数组内所有角色都拥有，返回True
                                      oneOf: 数组内拥有任一角色，返回True(等价第1种数据)
                                      except: 不拥有数组内任一角色，返回True(取反)
    }
    remixIcon:""                      remix图标
    isCustomSvgIcon:false,            是否是自定义svg图标（默认值：false，如果设置true，那么需要把你的svg拷贝到icon/remixIcon下，然后remixIcon字段配置上你的图标名）
    noKeepAlive:true                  当前路由是否不缓存（默认值：false）
    affix:true                        当前路由是否固定多标签页
    badge:"New"                       badge小标签（只支持子级）
    tagHidden:true                    当前路由是否不显示多标签页
   }
 */
import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from '@/vab/layouts'
import { publicPath, routerMode } from '@/config'

//TODO 前端路由开发写死
Vue.use(VueRouter)
export const constantRoutes = [
  {
    path: '/login/user',
    component: () => import('@/cms/views/login'),
    hidden: true,
  },
  {
    path: '/login',
    component: () => import('@/cms/views/login/agentIndex'),
    hidden: true,
  },
  {
    path: '/register',
    component: () => import('@/views/register'),
    hidden: true,
  },
  {
    path: '/callback',
    component: () => import('@/views/callback'),
    hidden: true,
  },
  {
    path: '/403',
    name: '403',
    component: () => import('@/views/403'),
    hidden: true,
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/404'),
    hidden: true,
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/cms/views/agent/largeScreen/index.vue'),
  },
]

export const asyncRoutes = [
  //代理商
  {
    path: '/',
    name: 'agent',
    redirect: '/information',
    component: Layout,
    meta: {
      title: '代理商',
      remixIcon: 'archive-line',
    },
    hidden: true,
    children: [
      {
        path: '/information',
        name: 'Information',
        component: () => import('@/cms/views/agent/information'),
        meta: {
          title: '园所信息',
          remixIcon: 'phone-find-line',
          affix: true,
        },
      },
      {
        path: '/nvrManager',
        name: 'NvrManager',
        component: () => import('@/cms/views/agent/nvrManager'),
        meta: {
          title: 'NVR管理',
          remixIcon: 'phone-find-line',
          affix: true,
        },
      },
      {
        path: '/order',
        name: 'Order',
        component: () => import('@/cms/views/agent/order'),
        meta: {
          title: '订单管理',
          remixIcon: 'checkbox-multiple-blank-line',
          affix: true,
        },
      },

      // {
      //   path: '/dashboard',
      //   name: 'Dashboard',
      //   component: () => import('@/cms/views/agent/largeScreen/index.vue'),
      //   meta: {
      //     title: '数据中心',
      //     remixIcon: 'checkbox-multiple-blank-line',
      //     affix: true,
      //   },
      // },
    ],
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    redirect: '/dashboard',
    component: () => import('@/cms/views/agent/largeScreen/index.vue'),
    meta: {
      title: '代理商',
      remixIcon: 'archive-line',
    },
    hidden: true,
    children: [
      {
        path: '/dashboard',
        name: 'Dashboard',
        component: () => import('@/cms/views/agent/largeScreen/index.vue'),
        meta: {
          title: '数据中心',
          remixIcon: 'checkbox-multiple-blank-line',
          affix: true,
        },
      },
    ],
  },
  {
    path: '/information',
    name: 'Information',
    component: () => import('@/cms/views/agent/information'),
    meta: {
      title: '园所信息',
      remixIcon: 'phone-find-line',
      affix: true,
    },
  },
  {
    path: '/nvrManager',
    name: 'NvrManager',
    component: () => import('@/cms/views/agent/nvrManager'),
    meta: {
      title: 'NVR管理',
      remixIcon: 'phone-find-line',
      affix: true,
    },
  },
  {
    path: '/order',
    name: 'Order',
    component: () => import('@/cms/views/agent/order'),
    meta: {
      title: '订单管理',
      remixIcon: 'checkbox-multiple-blank-line',
      affix: true,
    },
  },
  {
    path: '/largeScreen',
    name: 'largeScreen',
    component: () => import('@/cms/views/largeScreen/index.vue'),
    meta: {
      title: '数据中心',
      remixIcon: 'checkbox-multiple-blank-line',
      affix: true,
    },
    beforeEnter: (to, from, next) => {
      if (to.path === '/largeScreen' && from.path !== '/') {
        const url = router.resolve({
          path: '/largeScreen',
        }).href
        window.open(url)
      } else {
        next()
      }
    },
  },
  //园所管理
  {
    path: '/circularOffice',
    component: Layout,
    name: 'informationRoot',
    redirect: '/circularOffice/staff',
    meta: {
      title: '园所管理',
      remixIcon: 'bus-2-line',
    },
    hidden: true,
    children: [
      {
        path: '/staff',
        name: 'Staff',
        component: () => import('@/cms/views/circularOffice/staff'),
        meta: {
          title: '员工管理',
          remixIcon: 'admin-line',
          affix: false,
        },
      },
      {
        path: '/class',
        name: 'Class',
        component: () => import('@/cms/views/circularOffice/class'),
        meta: {
          title: '班级管理',
          remixIcon: 'award-line',
          affix: false,
        },
      },
      {
        path: '/teachers',
        name: 'Teachers',
        component: () => import('@/cms/views/circularOffice/teachers'),
        meta: {
          title: '教师管理',
          remixIcon: 'user-2-line',
          affix: false,
        },
      },
      {
        path: '/children',
        name: 'Children',
        component: () => import('@/cms/views/circularOffice/children'),
        meta: {
          title: '幼儿管理',
          remixIcon: 'emotion-happy-line',
          affix: false,
        },
      },
      // {
      //   path: '/camera',
      //   name: 'Camera',
      //   component: () => import('@/cms/views/circularOffice/camera'),
      //   meta: {
      //     title: '摄像头管理',
      //     remixIcon: 'coreos-line',
      //     affix: true,
      //   },
      // },
      {
        path: '/video',
        name: 'Video',
        component: () => import('@/cms/views/circularOffice/videoManager'),
        meta: {
          title: '视频管理',
          remixIcon: 'coreos-line',
          affix: false,
        },
      },
      {
        path: '/scene',
        name: 'Scene',
        component: () => import('@/cms/views/circularOffice/scene'),
        meta: {
          title: '场景管理',
          remixIcon: 'coreos-line',
          affix: false,
        },
      },
      {
        path: '/childrenAttendance',
        name: 'childrenAttendance',
        component: () =>
          import('@/cms/views/circularOffice/childrenAttendance'),
        meta: {
          title: '幼儿考勤',
          remixIcon: 'calendar-2-line',
          affix: false,
        },
      },
      {
        path: '/staffAttendance',
        name: 'staffAttendance',
        component: () => import('@/cms/views/circularOffice/staffAttendance'),
        meta: {
          title: '员工考勤',
          remixIcon: 'calendar-2-line',
          affix: false,
        },
      },
      {
        path: '/enrollmentManager',
        name: 'enrollmentManager',
        component: () => import('@/cms/views/circularOffice/enrollmentManager'),
        meta: {
          title: '招生管理',
          remixIcon: 'advertisement-line',
          affix: false,
        },
      },
      // {
      //   path: '/test',
      //   name: 'Test',
      //   component: () => import('@/cms/views/circularOffice/test'),
      //   meta: {
      //     title: '测试导出',
      //     remixIcon: 'home-2-line',
      //     affix: true,
      //   },
      // },
    ],
  },
  {
    path: '*',
    redirect: '/404',
    hidden: true,
  },
  // {
  //   path: '/dashboard',
  //   name: 'Dashboard',
  //   meta: {
  //     title: '数据中心',
  //     remixIcon: 'checkbox-multiple-blank-line',
  //     affix: true,
  //   },
  // },
]

const router = createRouter()

export function resetRouter(routes = constantRoutes) {
  router.matcher = createRouter(routes).matcher
}

function createRouter(routes = constantRoutes) {
  return new VueRouter({
    base: publicPath,
    mode: routerMode,
    scrollBehavior: () => ({
      y: 0,
    }),
    routes: routes,
  })
}

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject)
    return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch((err) => err)
}

export default router
