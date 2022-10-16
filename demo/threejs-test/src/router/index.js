import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [{
    path: "/",
    name: "demo1",
    component: () =>
      import( /* webpackChunkName: "demo1" */ "../views/demo1.vue"),
  },
  // {
  //   path: "/demo1",
  //   name: "demo1",
  //   component: () =>
  //     import(/* webpackChunkName: "demo1" */ "../views/demo1.vue"),
  // },
  {
    path: "/demo2",
    name: "demo2",
    component: () =>
      import( /* webpackChunkName: "demo2" */ "../views/demo2.vue"),
  },
  {
    path: "/demo3",
    name: "demo3",
    component: () =>
      import( /* webpackChunkName: "demo3" */ "../views/demo3.vue"),
  },
  {
    path: "/demo4",
    name: "demo4",
    component: () =>
      import( /* webpackChunkName: "demo3" */ "../views/demo4.vue"),
  },
];

const router = new VueRouter({
  routes,
});

export default router;