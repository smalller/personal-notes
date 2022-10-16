import { RoutesDataItem } from "@/utils/routes";
import BlankLayout from '@/layouts/BlankLayout.vue';

const resourceList = JSON.parse(localStorage.getItem('vuex') as string)?.user?.currentUser?.resourceList

// 点击面包屑跳转到对应目录的第一个路由去
function toMenuIndex(path: string) {
  let res = '/user/login' // 默认为登录页面
  resourceList?.forEach(item => {
    if (path === item.path) {
      res = item.children[0].path
    }
  })
  return res
}

const IndexLayoutRoutes: Array<RoutesDataItem> = [
  {
    icon: 'permissions',
    title: 'index-layout.menu.roles',
    path: '/roles',
    redirect: '/roles/all',
    component: BlankLayout,
    children: [
      {
        title: 'index-layout.menu.roles.all',
        path: 'all',
        component: () => import('@/views/roles/all/index.vue'),
      },
      {
        roles: ['user'],
        title: 'index-layout.menu.roles.user',
        path: 'user',
        component: () => import('@/views/roles/user/index.vue'),
      },
      {
        roles: ['test'],
        title: 'index-layout.menu.roles.test',
        path: 'test',
        component: () => import('@/views/roles/test/index.vue'),
      },
    ],
  },

  {
    icon: 'merchant',
    title: '商户管理',
    path: '/merchantManage',
    component: () => BlankLayout,
    redirect: toMenuIndex('/merchantManage'),
    children: [
      {
        title: '商户列表',
        path: '/merchantManage/merchantList',
        component: () => import('@/views/merchantManage/merchantList/index.vue'),
      },
      {
        title: '商户申请',
        path: '/merchantManage/merchantApplyFor',
        component: () => import('@/views/merchantManage/merchantApplyFor/index.vue'),
      },
      {
        title: '商户审核',
        path: '/merchantManage/merchantCheck',
        component: () => import('@/views/merchantManage/merchantCheck/index.vue'),
      },
    ]
  },

  {
    icon: 'operate',
    title: '运营管理',
    path: '/operaManage',
    component: () => BlankLayout,
    redirect: toMenuIndex('/operaManage'),
    children: [
      {
        title: '数据统计',
        path: '/operaManage/dataStatis',
        component: () => import('@/views/operaManage/dataStatis/index.vue'),
      },
      {
        title: '订单列表',
        path: '/operaManage/orderManage',
        component: () => import('@/views/operaManage/orderManage/index.vue'),
      }
    ]
  },

  {
    icon: 'set',
    title: '系统设置',
    path: '/systemSetting',
    component: () => BlankLayout,
    redirect: toMenuIndex('/systemSetting'),
    children: [
      {
        title: '人员管理',
        path: '/systemSetting/staffManage',
        component: () => import('@/views/systemSetting/staffManage/index.vue'),
      },
      {
        title: '权限设置',
        path: '/systemSetting/rolesSetting',
        component: () => import('@/views/systemSetting/rolesSetting/index.vue'),
      }
    ]
  },

  {
    icon: 'bank-audit',
    title: '银行审核',
    path: '/bankCheck',
    component: () => BlankLayout,
    redirect: toMenuIndex('/bankCheck'),
    children: [
      {
        title: '审核列表',
        path: '/bankCheck/checkList',
        component: () => import('@/views/bankCheck/checkList/index.vue'),
      },
      {
        title: '审核记录表',
        path: '/bankCheck/bankRecordList',
        component: () => import('@/views/bankCheck/bankRecordList/index.vue'),
      }
    ]
  },

  {
    icon: 'bank-list',
    title: '银行管理',
    path: '/bankManage',
    component: () => BlankLayout,
    redirect: toMenuIndex('/bankManage'),
    children: [
      {
        title: '银行列表',
        path: '/bankManage/bankList',
        component: () => import('@/views/bankManage/bankList/index.vue'),
      },
    ]
  },

];

export default IndexLayoutRoutes;