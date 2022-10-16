/**
 * @description router全局配置，如有必要可分文件抽离，其中asyncRoutes只有在intelligence模式下才会用到，pro版只支持remixIcon图标
 * hidden:true                        是否显示在菜单中显示路由（默认值：false）
 * alwaysShow:true                    当只有一级子路由时是否显示父路由是否显示在菜单中显示路由（默认值：false）
 * name:"Demo"                        首字母大写，一定要与vue文件的name对应起来，用于noKeepAlive缓存控制（该项特别重要）
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
const data = [
  {
    path: '/',
    component: 'Layout',
    redirect: '/index',
    meta: {
      title: '首页',
      remixIcon: 'home-4-line',
      affix: true,
    },
    children: [
      {
        path: 'user',
        name: 'User',
        component: 'cms/views/user',
        meta: {
          title: '用户管理',
          remixIcon: 'home-4-line',
          affix: true,
        },
      },
      {
        path: 'index',
        name: 'Index',
        component: 'cms/views/index',
        meta: {
          title: '首页',
          remixIcon: 'home-4-line',
          affix: true,
        },
      },
    ],
  },
  {
    path: '/course',
    component: 'Layout',
    redirect: '/index',
    meta: {
      title: '课程',
      remixIcon: 'book-3-line',
      affix: true,
    },
    children: [
      {
        path: 'liveCourse',
        name: 'liveCourse',
        component: 'cms/views/course/liveCourse',
        meta: {
          title: '直播课程',
          remixIcon: 'vidicon-line',
          affix: true,
        },
      },
      {
        path: 'recordingCourse',
        name: 'recordingCourse',
        component: 'cms/views/course/recordingCourse',
        meta: {
          title: '录播课程',
          remixIcon: 'video-line',
          affix: true,
        },
      },
      {
        path: 'teachingCenter',
        name: 'teachingCenter',
        component: 'cms/views/course/teachingCenter',
        meta: {
          title: '教学中心',
          remixIcon: 'book-open-line',
          affix: true,
        },
      },
      {
        path: 'subjectManagement',
        name: 'subjectManagement',
        component: 'cms/views/course/subjectManagement',
        meta: {
          title: '科目管理',
          remixIcon: 'archive-drawer-line',
          affix: true,
        },
      },
    ],
  },
  {
    path: '/money',
    component: 'Layout',
    redirect: '/index',
    meta: {
      title: '财务管理',
      remixIcon: 'settings-3-line',
      affix: true,
    },
    children: [
      {
        path: 'water',
        name: 'Water',
        component: 'cms/views/moneyManager/water',
        meta: {
          title: '平台交易流水',
          remixIcon: 'home-4-line',
          affix: true,
        },
      },
      {
        path: 'ticket',
        name: 'Ticket',
        component: 'cms/views/moneyManager/ticket',
        meta: {
          title: '开票管理',
          remixIcon: 'home-4-line',
          affix: true,
        },
      },
      {
        path: 'paySet',
        name: 'PaySet',
        component: 'cms/views/moneyManager/paySet',
        meta: {
          title: '支付设置',
          remixIcon: 'home-4-line',
          affix: true,
        },
      },
      {
        path: 'orderList',
        name: 'OrderList',
        component: 'cms/views/moneyManager/orderList',
        meta: {
          title: '订单管理',
          remixIcon: 'home-4-line',
          affix: true,
        },
      },
      {
        path: 'iosWater',
        name: 'IosWater',
        component: 'cms/views/moneyManager/iosWater',
        meta: {
          title: 'ios流水',
          remixIcon: 'home-4-line',
          affix: true,
        },
      },
    ],
  },
  {
    path: '/integration',
    component: 'Layout',
    redirect: '/index',
    meta: {
      title: '积分管理',
      remixIcon: 'settings-3-line',
      affix: true,
    },
    children: [
      {
        path: 'config',
        name: 'Config',
        component: 'cms/views/integration/config',
        meta: {
          title: '积分策略',
          remixIcon: 'home-4-line',
          affix: true,
        },
      },
    ],
  },
  {
    path: '/gateway',
    component: 'Layout',
    redirect: '/index',
    meta: {
      title: '门户管理',
      remixIcon: 'settings-3-line',
      affix: true,
    },
    children: [
      {
        path: 'column',
        name: 'Column',
        component: 'cms/views/gateway/column',
        meta: {
          title: '栏目管理',
          remixIcon: 'home-4-line',
          affix: true,
        },
      },
      {
        path: 'columnMsg',
        name: 'ColumnMsg',
        component: 'cms/views/gateway/columnMsg',
        meta: {
          title: '栏目内容',
          remixIcon: 'home-4-line',
          affix: true,
        },
      },
      {
        path: 'companyMsg',
        name: 'CompanyMsg',
        component: 'cms/views/gateway/companyMsg',
        meta: {
          title: '门户企业信息设置',
          remixIcon: 'home-4-line',
          affix: true,
        },
      },
      {
        path: 'adver',
        name: 'Adver',
        component: 'cms/views/gateway/adver',
        meta: {
          title: '广告管理',
          remixIcon: 'home-4-line',
          affix: true,
        },
      },
    ],
  },
  {
    path: '/set',
    component: 'Layout',
    redirect: '/index',
    meta: {
      title: '设置',
      remixIcon: 'settings-3-line',
      affix: true,
    },
    children: [
      {
        path: 'userSet',
        name: 'UserSet',
        component: 'cms/views/set/userSet',
        meta: {
          title: '角色管理',
          remixIcon: 'home-4-line',
          affix: true,
        },
      },
      {
        path: 'log',
        name: 'Log',
        component: 'cms/views/set/log',
        meta: {
          title: '操作日志',
          remixIcon: 'home-4-line',
          affix: true,
        },
      },
    ],
  },
]
module.exports = [
  {
    url: '/router/getList',
    type: 'get',
    response() {
      return {
        code: 200,
        msg: 'success',
        data,
      }
    },
  },
]
