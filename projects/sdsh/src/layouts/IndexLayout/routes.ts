import { RoutesDataItem } from "@/utils/routes";
import BlankLayout from "@/layouts/BlankLayout.vue";

const resourceList = JSON.parse(localStorage.getItem('vuex') as string)?.user?.currentUser?.resourceList

// 点击面包屑跳转到对应目录的第一个路由去
function toMenuIndex(path: string) {
  let res = '/user/login'  // 默认为登录页面
  resourceList?.forEach(item => {
    if (path === item.path) {
      res = item.children[0].path
    }
  })
  return res
}

const IndexLayoutRoutes: Array<RoutesDataItem> = [
  {
    icon: "home",
    title: "开户申请",
    path: "/openAccInfo",
    redirect: toMenuIndex('/openAccInfo'),
    component: BlankLayout,
    children: [
      {
        path: "/openAccInfo/addMerchant",
        title: "完善信息",
        component: () => import("@/views/addMerchant/index.vue"),
      }
    ],
  },
  {
    icon: "charge",
    title: "收费管理",
    path: "/income",
    component: BlankLayout,
    redirect: toMenuIndex('/income'),
    children: [
      {
        path: "/income/scan",
        title: "扫码收费",
        component: () => import("@/views/incomeScan/index.vue"),
      },
      {
        path: "/income/list",
        title: "按名单收费",
        component: () => import("@/views/incomeList/index.vue"),
      },
      {
        path: "/income/receipt",
        title: "电子收据",
        component: () => import("@/views/incomeReceipt/index.vue"),
      },
      {
        path: "/income/consignSale",
        title: "寄售",
        component: () => import("@/views/consignSale/index.vue"),
      },
      {
        path: "/income/check",
        title: "审核收费",
        component: () => import("@/views/incomeCheck/index.vue"),
      },
      {
        path: "/income/subAccount",
        title: "分账账户管理",
        component: () => import("@/views/subAccount/index.vue"),
      },
    ],
  },
  {
    icon: "return",
    title: "退费管理",
    path: "/returnManage",
    redirect: toMenuIndex('/returnManage'),
    component: BlankLayout,
    children: [
      {
        path: "/returnManage/manage",
        title: "退款管理",
        component: () => import("@/views/returnManage/refundManage/index.vue"),
      },
      {
        path: "/returnManage/refundDetail",
        title: "退款明细",
        component: () => import("@/views/returnManage/refundDetail/index.vue"),
      },
    ],
  },
  {
    icon: "set",
    title: "系统管理",
    path: "/systemMan",
    component: BlankLayout,
    redirect: toMenuIndex('/systemMan'),
    children: [
      {
        path: "/systemMan/character",
        title: "角色管理",
        component: () => import("@/views/systemManage/character/index.vue"),
      },
      {
        path: "/systemMan/student",
        title: "学生管理",
        component: () => import("@/views/systemManage/student/index.vue"),
      },
      {
        path: "/systemMan/grade",
        title: "年级管理",
        component: () => import("@/views/systemManage/grade/index.vue"),
      },
      {
        path: "/systemMan/class",
        title: "班级管理",
        component: () => import("@/views/systemManage/class/index.vue"),
      },
      {
        path: "/systemMan/staff",
        title: "员工管理",
        component: () => import("@/views/systemManage/staff/index.vue"),
      },
    ],
  },
  {
    icon: "message",
    title: "通知管理",
    path: "/informManage",
    component: BlankLayout,
    redirect: toMenuIndex('/informManage'),
    children: [
      {
        path: "/informManage/informNotice",
        title: "通知列表",
        component: () => import("@/views/informManage/informNotice/index.vue"),
      },
    ],
  },
  {
    icon: "close-acc",
    title: "结算中心",
    path: "/settleCenter",
    component: BlankLayout,
    redirect: toMenuIndex('/settleCenter'),
    children: [
      {
        path: "/settleCenter/balanceWater",
        title: "收支流水",
        component: () => import("@/views/settleCenter/balanceWater/index.vue"),
      },
      {
        path: "/settleCenter/balanceStatis",
        title: "收支统计",
        component: () => import("@/views/settleCenter/balanceStatis/index.vue"),
      },
      {
        path: "/settleCenter/closeCountQuery",
        title: "已结算查询",
        component: () =>
          import("@/views/settleCenter/closeCountQuery/index.vue"),
      },
      // {
      //   path: "/settleCenter/widthDraw",
      //   title: "提现",
      //   component: () => import("@/views/settleCenter/widthDraw/index.vue"),
      // },
    ],
  },

  {
    icon: "permissions",
    title: "index-layout.menu.roles",
    path: "/roles",
    component: BlankLayout,
    redirect: toMenuIndex('/roles'),
    children: [
      {
        title: "index-layout.menu.roles.all",
        path: "all",
        component: () => import("@/views/roles/all/index.vue"),
      },
      {
        roles: ["user"],
        title: "index-layout.menu.roles.user",
        path: "user",
        component: () => import("@/views/roles/user/index.vue"),
      },
      {
        roles: ["test"],
        title: "index-layout.menu.roles.test",
        path: "test",
        component: () => import("@/views/roles/test/index.vue"),
      },
    ],
  },
];

export default IndexLayoutRoutes;
