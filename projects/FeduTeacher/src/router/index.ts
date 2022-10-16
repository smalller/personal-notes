import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import micell from "micell";
import $store from "@/store/index";
import layout from "@/Layout/index.vue";
import { User } from "@/base/interface";
import RecipeDetail from "@/Layout/RecipeDetail.vue";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

const routes: RouteRecordRaw[] = [
  {
    path: "/login",
    name: "login",
    meta: {
      hidden: true,
    },
    component: () => import("@/views/login/index.vue"),
  },
  {
    path: "/agreement",
    name: "agreement",
    meta: {
      hidden: true,
      type: "new",
    },
    component: () => import("@/views/agreement/index.vue"),
  },
  {
    path: "/",
    name: "首页",
    meta: {
      icon: "icon-a-2",
    },
    component: layout,
    redirect: "/",
    children: [
      {
        path: "",
        name: "首页",
        meta: {
          icon: "icon-a-2",
        },
        component: () => import("@/views/home/index.vue"),
      },
    ],
    beforeEnter: (to, from, next) => {
      if (
        !($store.state as User).user.token ||
        !($store.state as User).user.schoolId
      ) {
        next("/login");
      }
      next();
    },
  },
  {
    path: "/recipeDetail",
    name: "recipeDetail",
    meta: {
      hidden: true,
    },
    redirect: "",
    component: RecipeDetail,
    children: [
      {
        path: "",
        name: "食谱详情",
        meta: {
          type: 1,
        },
        component: () =>
          import("@/views/informationIssue/recipeDetail/index.vue"),
      },
      {
        path: "school",
        name: "编辑校园官网",
        meta: {
          type: 2,
        },
        component: () =>
          import("@/views/enrollmentManage/addProject/index.vue"),
      },
      {
        path: "EditLive",
        name: "发布直播",
        meta: {
          type: 3,
        },
        component: () =>
          import("@/views/informationIssue/liveStream/components/EditLive.vue"),
      },
      {
        path: "EditNotice",
        name: "发布通知",
        meta: {
          type: 4,
        },
        component: () =>
          import(
            "@/views/informationIssue/noticeManage/components/addNotice.vue"
          ),
      },
      {
        path: "EditCourse",
        name: "新增课程",
        meta: {
          type: 5,
        },
        component: () =>
          import("@/views/otherClass/classCenter/components/editCourse.vue"),
      },
    ],
  },
  {
    path: "/staffManage",
    name: "人员管理",
    meta: {
      icon: "icon-a-3",
    },
    component: layout,
    redirect: "",
    children: [
      {
        path: "",
        name: "班级管理",
        meta: {},
        component: () => import("@/views/staffManage/classManage/index.vue"),
      },
      {
        path: "student",
        name: "幼儿管理",
        meta: {},
        component: () => import("@/views/staffManage/infantManage/index.vue"),
      },
      {
        path: "staff",
        name: "教职工管理",
        meta: {},
        component: () => import("@/views/staffManage/teachingManage/index.vue"),
      },
      {
        path: "parent",
        name: "家长管理",
        meta: {},
        component: () => import("@/views/staffManage/parentManage/index.vue"),
      },
    ],
  },
  {
    path: "/educManage",
    name: "教务管理",
    meta: {
      icon: "icon-vuesax-outline-directbox-notif",
      hidden: false,
    },
    component: layout,
    redirect: "",
    children: [
      {
        path: "",
        name: "学籍信息",
        meta: {},
        component: () => import("@/views/educManage/schoolRollInfo/index.vue"),
      },
      {
        path: "classroomManage",
        name: "上课教室",
        meta: {
          hidden: false,
        },
        component: () => import("@/views/educManage/classroomManage/index.vue"),
      },
    ],
  },
  {
    path: "/attendanceManagement",
    name: "考勤管理",
    meta: {
      icon: "icon-a-7",
    },
    component: layout,
    redirect: "",
    children: [
      {
        path: "",
        name: "幼儿考勤",
        meta: {},
        component: () => import("@/views/attendanceManagement/toddler.vue"),
      },
      // {
      //   path: "stranger",
      //   name: "陌生人",
      //   meta: {},
      //   component: () => import("@/views/attendanceManagement/stranger.vue"),
      // },
      {
        path: "faculty",
        name: "教职工考勤",
        meta: {
          hidden: true,
        },
        component: () => import("@/views/attendanceManagement/faculty.vue"),
      },
      {
        path: "timecard",
        name: "考勤卡管理",
        meta: {
          hidden: true,
        },
        component: () => import("@/views/attendanceManagement/timecard.vue"),
      },
      {
        path: "AttendanceEquipment",
        name: "考勤设备管理",
        meta: {
          hidden: true,
        },
        component: () =>
          import("@/views/attendanceManagement/attendanceEquipment.vue"),
      },
      {
        path: "attendanceEquipments",
        name: "考勤设备管理",
        meta: {},
        component: () => import("@/views/attendanceEquipment/index.vue"),
      },
      {
        path: "userFaceManagement",
        name: "人脸入库管理",
        meta: {},
        component: () => import("@/views/userFaceManagement/index.vue"),
      },
    ],
  },
  {
    path: "/yssf",
    name: "园所收费 ",
    meta: {
      icon: "icon-yssf",
    },
    component: layout,
    redirect: "/",
    children: [
      {
        path: "",
        name: "园所收费",
        meta: {
          icon: "icon-a-2",
        },
        component: () => import("@/views/yssf/index.vue"),
      },
    ],
  },
  {
    path: "/surveillanceVideo",
    name: "监控视频",
    meta: {
      icon: "icon-a-4",
    },
    component: layout,
    redirect: "",
    children: [
      {
        path: "",
        name: "视频管理",
        meta: {},
        component: () =>
          import("@/views/surveillanceVideo/videoManagement.vue"),
      },
      {
        path: "faculty",
        name: "班级视频管理",
        meta: {},
        component: () =>
          import("@/views/surveillanceVideo/classVideoManagement.vue"),
      },
    ],
  },
  {
    path: "/enrollmentManage",
    name: "招生宣传",
    meta: {
      icon: "icon-a-zu2013",
      hidden: false,
    },
    component: layout,
    redirect: "",
    children: [
      {
        path: "",
        name: "校园手机官网",
        meta: {
          hidden: false,
        },
        component: () =>
          import("@/views/enrollmentManage/schoolEnrollment/index.vue"),
      },
      {
        path: "registration",
        name: "报名幼儿管理",
        meta: {
          hidden: true,
        },
        component: () =>
          import("@/views/enrollmentManage/registrationManage/index.vue"),
      },
      {
        path: "project",
        name: "校宣计划",
        meta: {
          hidden: false,
        },
        component: () =>
          import("@/views/enrollmentManage/enrollProject/index.vue"),
      },
      // {
      //   path: "adv",
      //   name: "招生简章",
      //   meta: {},
      //   component: () =>
      //     import("@/views/enrollmentManage/enrollmentManager.vue"),
      // },
      // {
      //   path: "project",
      //   name: "招生计划",
      //   meta: {
      //     hidden: false,
      //   },
      //   component: () =>
      //     import("@/views/enrollmentManage/enrollProject/index.vue"),
      // },
    ],
  },
  {
    path: "/informationIssue",
    name: "信息发布",
    meta: {
      icon: "icon-a-5",
    },
    component: layout,
    redirect: "",
    children: [
      {
        path: "",
        name: "评论管理",
        meta: {},
        component: () =>
          import("@/views/informationIssue/reviewManage/index.vue"),
      },
      {
        path: "notice",
        name: "通知",
        meta: {
          hidden: false,
        },
        component: () =>
          import("@/views/informationIssue/noticeManage/index.vue"),
      },
      {
        path: "liveStream",
        name: "直播",
        meta: {
          hidden: false,
        },
        component: () =>
          import("@/views/informationIssue/liveStream/index.vue"),
      },
    ],
  },
  {
    path: "/outClass",
    name: "兴趣课程",
    meta: {
      icon: "icon-a-vuesaxoutlinebook",
    },
    component: layout,
    redirect: "",
    children: [
      {
        path: "",
        name: "选课中心",
        meta: {},
        component: () => import("@/views/otherClass/classCenter/index.vue"),
      },
      {
        path: "recruitStudentsPlan",
        name: "招生计划",
        meta: {
          hidden: false,
        },
        component: () =>
          import("@/views/otherClass/recruitStudentsPlan/index.vue"),
      },
      {
        path: "viewCourse",
        name: "查看课程",
        meta: {
          hidden: true,
        },
        component: () =>
          import(
            "@/views/otherClass/recruitStudentsPlan/components/ViewCourse.vue"
          ),
      },
      {
        path: "signUpDetail",
        name: "报名详情",
        meta: {
          hidden: true,
        },
        component: () =>
          import(
            "@/views/otherClass/recruitStudentsPlan/components/SignUpDetail.vue"
          ),
      },
    ],
  },
  {
    path: "/largeScreen",
    name: "数据中心",
    meta: {
      icon: "icon-a-5",
      type: "new",
    },
    component: () => import("@/views/largeScreen/index.vue"),
  },
  {
    path: "/setFocus",
    name: "设置中心",
    meta: {
      icon: "icon-a-6",
      hidden: false,
    },
    component: layout,
    redirect: "",
    children: [
      {
        path: "",
        name: "系统设置",
        meta: {},
        component: () => import("@/views/setFocus/systemSettings.vue"),
      },
      {
        path: "journal",
        name: "操作日志",
        meta: {},
        component: () => import("@/views/journal/index.vue"),
      },
    ],
  },
  {
    path: "/schoolBus",
    name: "校车管理",
    meta: {
      icon: "icon-a-6",
      hidden: false,
    },
    component: layout,
    redirect: "",
    children: [
      {
        path: "",
        name: "校车管理",
        meta: {},
        component: () => import("@/views/bus/busManagement/index.vue"),
      },
      {
        path: "tripManagement",
        name: "行程管理",
        meta: {},
        component: () => import("@/views/bus/tripManagement/index.vue"),
      },
      {
        path: "carFollowingRecord",
        name: "跟车记录",
        meta: {},
        component: () => import("@/views/bus/carFollowingRecord/index.vue"),
      },
    ],
  },
];
const routerArr: RouteRecordRaw[] = routes.map((item: any) => {
  if (item?.children?.length > 0) {
    item.children = item.children.map((child: any) => {
      child.meta.uuid = micell.uuid();
      return child;
    });
  }
  item["meta"].uuid = micell.uuid();
  return item;
});
const router = createRouter({
  history: createWebHashHistory(),
  routes: routerArr,
});

let loginStatus = false;

NProgress.configure({
  showSpinner: false,
});

router.beforeEach((to, form, next) => {
  NProgress.start();
  if (to.matched.length > 1) {
    $store.dispatch("activeRouteChange", to.matched[0].meta.uuid);
    $store.dispatch("activeRouterChildChange", to.matched[1].meta.uuid);
  }

  if (
    !($store.state as User).user.token ||
    !($store.state as User).user.schoolId
  ) {
    if (loginStatus) {
      loginStatus = false;
      $store.dispatch("loginOut");
      next("/login");
    }
    next();
  } else {
    loginStatus = true;
    next();
  }
  // if (to.path === form.path) {
  //   return;
  // }
  // if (to.path.split("/").length > 2) {
  //   $store.dispatch("activeRouterChildChange", to.meta.uuid);
  // } else {
  //   $store.dispatch("activeRouteChange", to.meta.uuid);
  // }
});
router.afterEach(() => {
  NProgress.done();
});
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export function createRoute(): RouteRecordRaw[] {
  return routerArr;
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export default router;
