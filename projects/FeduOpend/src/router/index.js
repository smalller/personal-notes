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
    path: '/login',
    component: () => import('@/cms/views/login'),
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
]

export const asyncRoutes = [
  {
    path: '/',
    component: Layout,
    redirect: '/index',
    meta: {
      title: '订单管理',
      remixIcon: 'home-4-line',
    },
    children: [
      {
        path: 'index',
        name: 'Index',
        component: () => import('@/cms/views/order'),
        meta: {
          title: '订单管理',
          remixIcon: 'home-2-line',
          affix: true,
        },
      },
      {
        path: 'finance',
        name: 'Finance',
        component: () => import('@/cms/views/FinanceManage'),
        meta: {
          title: '财务明细',
          remixIcon: 'money-cny-box-line',
          affix: true,
        },
      },
    ],
  },
  {
    path: '/NvrManager',
    component: Layout,
    redirect: '/index',
    meta: {
      title: 'NVR管理',
      remixIcon: 'money-cny-box-line',
    },
    children: [
      {
        path: 'index',
        name: 'Index',
        component: () => import('@/cms/views/nvrManager'),
        meta: {
          title: 'NVR管理',
          remixIcon: 'money-cny-box-line',
          affix: true,
        },
      },
    ],
  },
  {
    path: '/gardenList',
    component: Layout,
    redirect: '/index',
    meta: {
      title: '园所列表',
      remixIcon: 'barcode-box-line',
    },
    children: [
      {
        path: 'index',
        name: 'gardenList',
        component: () => import('@/cms/views/gardenList'),
        meta: {
          title: '园所列表',
          remixIcon: 'barcode-box-line',
          affix: true,
        },
      },
    ],
  },
  {
    path: '/schoolList',
    component: Layout,
    redirect: '/index',
    meta: {
      title: '学校列表',
      remixIcon: 'barcode-box-line',
    },
    children: [
      {
        path: 'index',
        name: 'gardenList',
        component: () => import('@/cms/views/schoolList'),
        meta: {
          title: '学校列表',
          remixIcon: 'barcode-box-line',
          affix: true,
        },
      },
    ],
  },
  // {
  //   path: '/liveManger',
  //   component: Layout,
  //   redirect: '/liveManger/AddLive',
  //   meta: {
  //     title: '直播管理',
  //     remixIcon: 'battery-fill',
  //   },
  //   children: [
  //     {
  //       path: 'AddLive',
  //       name: 'gardenList',
  //       component: () => import('@/cms/views/liveManger'),
  //       meta: {
  //         title: '直播管理',
  //         remixIcon: 'battery-fill',
  //         affix: true,
  //       },
  //     },
  //   ],
  // },
  {
    path: '/articleMange',
    component: Layout,
    redirect: '/articleMange/articleList',
    meta: {
      title: '内容管理',
      remixIcon: 'book-line',
    },
    children: [
      {
        path: 'findManage',
        name: 'findManage',
        component: () => import('@/cms/views/findManage'),
        meta: {
          title: '发现页配置',
          remixIcon: 'book-line',
          affix: true,
        },
      },
      {
        path: 'articleList',
        name: 'articleList',
        component: () => import('@/cms/views/article'),
        meta: {
          title: '图文新闻',
          remixIcon: 'book-line',
          affix: true,
        },
      },
      {
        path: 'categoryList',
        name: 'categoryList',
        component: () => import('@/cms/views/category'),
        meta: {
          title: '栏目管理',
          remixIcon: 'book-line',
          affix: true,
        },
      },
      {
        path: 'liveManger',
        name: 'liveManger',
        component: () => import('@/cms/views/liveManger'),
        meta: {
          title: '直播管理',
          remixIcon: 'coupon-3-line',
          affix: true,
        },
      },
      {
        path: 'videoSettings',
        name: 'videoSettings',
        component: () => import('@/cms/views/mediaSetting'),
        meta: {
          type: 1,
          title: '视频专辑',
          remixIcon: 'book-line',
          affix: true,
        },
      },
      {
        path: 'addAlbum',
        name: 'addAlbum',
        component: () => import('@/cms/views/mediaSetting/addAlbum'),
        hidden: true,
        meta: {
          title: '添加专辑',
        },
      },
      {
        path: 'insert',
        name: 'mediaSettingInsert',
        component: () => import('@/cms/views/mediaSetting/sectionMmanagement'),
        hidden: true,
        meta: {
          title: '小节管理',
        },
      },
      {
        path: 'audioSettings',
        name: 'audioSettings',
        component: () => import('@/cms/views/mediaSetting'),
        meta: {
          type: 2,
          title: '音频专辑',
          remixIcon: 'book-line',
          affix: true,
        },
      },
      {
        path: 'indexRecommend',
        name: 'indexRecommend',
        component: () => import('@/cms/views/indexRecommend'),
        meta: {
          title: '首页推荐',
          remixIcon: 'book-line',
          affix: true,
        },
      },
    ],
  },
  {
    path: '/activityMange',
    component: Layout,
    redirect: '/activityMange/schoolList',
    meta: {
      title: '动态管理',
      remixIcon: 'book-line',
    },
    children: [
      {
        path: 'activityList',
        name: 'activityList',
        component: () => import('@/cms/views/activityManage'),
        meta: {
          title: '园所动态',
          remixIcon: 'book-line',
          affix: true,
        },
      },
      // {
      //   path: 'schoolList',
      //   name: 'schoolList',
      //   component: () => import('@/cms/views/camera.vue'),
      //   meta: {
      //     title: '运营动态111',
      //     remixIcon: 'book-line',
      //     affix: true,
      //   },
      // },
      {
        path: 'commentList',
        name: 'commentList',
        component: () => import('@/cms/views/commentManage'),
        meta: {
          title: '评论管理',
          remixIcon: 'book-line',
          affix: true,
        },
      },
      {
        path: 'muteList',
        name: 'muteList',
        component: () => import('@/cms/views/muteManage'),
        meta: {
          title: '禁言管理',
          remixIcon: 'book-line',
          affix: true,
        },
      },
    ],
  },
  // {
  //   //不确定需求
  //   path: '/referenceRecommend',
  //   component: Layout,
  //   redirect: '/referenceRecommend/index',
  //   meta: {
  //     title: '引用推荐',
  //     remixIcon: 'coupon-3-line',
  //   },
  //   children: [
  //     {
  //       path: 'index',
  //       name: 'referenceRecommend',
  //       component: () => import('@/cms/views/liveManger'),
  //       meta: {
  //         title: '引用推荐',
  //         remixIcon: 'coupon-3-line',
  //         affix: true,
  //       },
  //     },
  //   ],
  // },
  {
    path: '/visionManage',
    component: Layout,
    redirect: '/visionManage/index',
    meta: {
      title: '版本管理',
      remixIcon: 'android-line',
    },
    children: [
      {
        path: 'index',
        name: 'visionManage',
        component: () => import('@/cms/views/visionManage'),
        meta: {
          title: '版本管理',
          remixIcon: 'android-line',
          affix: true,
        },
      },
    ],
  },
  // {
  //   path: '/videoNew',
  //   component: Layout,
  //   redirect: '/videoNew/list',
  //   meta: {
  //     title: '视频新闻',
  //     remixIcon: 'live-line',
  //   },
  //   children: [
  //     {
  //       path: 'list',
  //       name: 'videoNew',
  //       component: () => import('@/cms/views/videoNew'),
  //       meta: {
  //         title: '视频新闻列表',
  //         remixIcon: 'live-line',
  //         affix: true,
  //       },
  //     },
  //   ],
  // },

  {
    path: '/picManage',
    component: Layout,
    redirect: '/picManage/list',
    meta: {
      title: '图片管理',
      remixIcon: 'camera-3-line',
    },
    children: [
      {
        path: 'list',
        name: 'picManage',
        component: () => import('@/cms/views/picManage'),
        meta: {
          title: '图片管理列表',
          remixIcon: 'camera-3-line',
          affix: true,
        },
      },
      {
        path: 'deleteList',
        name: 'picDeleteManage',
        component: () => import('@/cms/views/picDeleteManage'),
        meta: {
          title: '已删除图片列表',
          remixIcon: 'camera-3-line',
          affix: true,
        },
      },
    ],
  },
  {
    path: '/agentManage',
    component: Layout,
    redirect: '/agentManage/index',
    meta: {
      title: '代理商',
      remixIcon: 'dropbox-line',
    },
    children: [
      {
        path: 'index',
        name: 'agentManage',
        component: () => import('@/cms/views/agentManage'),
        meta: {
          title: '代理商管理',
          remixIcon: 'dropbox-line',
          affix: true,
        },
      },
    ],
  },
  {
    path: '/userManage',
    component: Layout,
    redirect: '/userManage/userList',
    meta: {
      title: '用户管理',
      remixIcon: 'team-line',
    },
    children: [
      {
        path: 'userList',
        name: 'userList',
        component: () => import('@/cms/views/userManage'),
        meta: {
          title: '系统用户管理',
          remixIcon: 'team-line',
          affix: true,
        },
      },
      {
        path: 'customerList',
        name: 'customerList',
        component: () => import('@/cms/views/customerManage'),
        meta: {
          title: '注册用户管理',
          remixIcon: 'team-line',
          affix: true,
        },
      },
      {
        path: 'childrenList',
        name: 'childrenList',
        component: () => import('@/cms/views/childrenManage'),
        meta: {
          title: '幼儿管理',
          remixIcon: 'team-line',
          affix: true,
        },
      },
    ],
  },
  {
    path: '/courseManagement',
    component: Layout,
    redirect: '/courseManagement/courseList',
    meta: {
      title: '兴趣班管理',
      remixIcon: 'calendar-2-line',
    },
    children: [
      {
        path: 'courseList',
        name: '课程资源',
        component: () => import('@/cms/views/course/courseList'),
        meta: {
          title: '课程资源',
          remixIcon: 'calendar-2-line',
          affix: true,
        },
      },
      {
        path: 'addCourse',
        name: '新增课程',
        component: () => import('@/cms/views/course/addCourse'),
        meta: {
          title: '新增课程',
          remixIcon: 'calendar-2-line',
          affix: true,
        },
        hidden: true,
      },
      {
        path: 'classManagement',
        name: '课节管理',
        hidden: true,
        component: () => import('@/cms/views/course/classManagement'),
        meta: {
          title: '课节管理',
          remixIcon: 'calendar-2-line',
          affix: true,
        },
      },
      {
        path: 'accountManagement',
        name: '科目管理',
        component: () => import('@/cms/views/course/accountManagement'),
        meta: {
          title: '科目管理',
          remixIcon: 'calendar-2-line',
          affix: true,
        },
      },
    ],
  },
  {
    path: '/attendanceManage',
    component: Layout,
    redirect: '/attendanceManage/attendanceList',
    meta: {
      title: '考勤管理',
      remixIcon: 'calendar-2-line',
    },
    children: [
      {
        path: 'attendanceList',
        name: 'attendanceList',
        component: () => import('@/cms/views/attendanceManage'),
        meta: {
          title: '考勤管理',
          remixIcon: 'calendar-2-line',
          affix: true,
        },
      },
      {
        path: 'faceDevice',
        name: 'faceDevice',
        component: () => import('@/cms/views/attendanceEquipment'),
        meta: {
          title: '人脸考勤设备',
          remixIcon: 'live-line',
          affix: true,
        },
      },
      {
        path: 'attendanceRobot',
        name: 'attendanceRobot',
        component: () => import('@/cms/views/attendanceRobot'),
        meta: {
          title: '外接考勤设备',
          remixIcon: 'live-line',
          affix: true,
        },
      },
    ],
  },
  {
    path: '/advertisingManagement',
    component: Layout,
    redirect: '/advertisingManagement/advertisingManagement',
    meta: {
      title: '广告管理',
      remixIcon: 'calendar-2-line',
    },
    children: [
      {
        path: 'advertisingManagement',
        name: '广告管理',
        component: () => import('@/cms/views/advertisingManagement'),
        meta: {
          title: '广告管理',
          remixIcon: 'calendar-2-line',
          affix: true,
        },
      },
      {
        path: 'advertisingPosition',
        name: '广告管理',
        component: () =>
          import('@/cms/views/advertisingManagement/advertisingPosition'),
        meta: {
          title: '广告位管理',
          remixIcon: 'calendar-2-line',
          affix: true,
        },
      },
      {
        path: 'openScreenAdvertising',
        name: '开屏广告',
        component: () => import('@/cms/views/openScreenAdvertising'),
        meta: {
          title: '开屏广告',
          remixIcon: 'calendar-2-line',
          affix: true,
        },
      },
    ],
  },
  {
    path: '/reportManagement',
    component: Layout,
    redirect: '/reportManage/report',
    meta: {
      title: '举报反馈',
      remixIcon: 'calendar-2-line',
    },
    children: [
      {
        path: 'advertisingManagement',
        name: 'advertisingManagement',
        component: () => import('@/cms/views/reportManage/report'),
        meta: {
          title: '举报管理',
          remixIcon: 'calendar-2-line',
          affix: true,
        },
      },
      {
        path: 'advertisingPosition',
        name: '举报反馈',
        component: () => import('@/cms/views/feedbackManagement'),
        meta: {
          title: '反馈管理',
          remixIcon: 'calendar-2-line',
          affix: true,
        },
      },
    ],
  },
  {
    path: '*',
    redirect: '/404',
    hidden: true,
  },
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
