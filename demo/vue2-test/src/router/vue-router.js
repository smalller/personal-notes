// 要求必须有一个install，将来会被Vue.use调用
let Vue; // 保存Vue构造函数，插件中要使用，不导入还能用
class VueRouter {
  constructor(options) {
    // 此处的this.$options指向的是VueRouter实例
    this.$options = options;

    // 把current作为响应式数据，指当前所在路由名称
    // 将来发生变化，router-view的render函数能够再次执行
    const initial = window.location.hash.slice(1) || "/";
    Vue.util.defineReactive(this, "current", initial);

    // 监听hash变化
    window.addEventListener("hashchange", () => {
      this.current = window.location.hash.slice(1);
    });
  }
}

// Vue.use会调用该方法，注册VueRouter，其中参数_Vue是Vue.use调用时传入的，即Vue实例
VueRouter.install = function(_Vue) {
  Vue = _Vue;

  // 挂载$router属性
  mountRouter();

  // 注册router-link组件
  mountRouterLink();

  // 注册router-view组件
  mountRouterView();
};

// 挂载$router属性到VueRouter上
function mountRouter() {
  // 全局混入目的：延迟下面逻辑到router创建完毕并且附加到选项上时才执行
  Vue.mixin({
    beforeCreate() {
      // 该钩子在每个组件创建实例时都会被调用
      // 当执行到根实例时，才能获取到router属性，因为只有根实例才有该选项
      // 此处的this.$options是指向的Vue实例的
      if (this.$options.router) {
        Vue.prototype.$router = this.$options.router;
      }
    }
  });
}

// 注册router-link组件
function mountRouterLink() {
  Vue.component("router-link", {
    props: {
      to: {
        type: String,
        required: true
      }
    },
    render(h) {
      // <a href="to">xxx</a>
      // return <a href={'#'+this.to}>{this.$slots.default}</a>
      return h(
        "a",
        {
          attrs: {
            href: "#" + this.to
          }
        },
        this.$slots.default
      );
    }
  });
}

// 注册router-view组件
function mountRouterView() {
  Vue.component("router-view", {
    render(h) {
      // 获取当前路由对应的组件
      let component = null;
      const route = this.$router.$options.routes.find(
        route => route.path === this.$router.current
      );
      if (route) {
        component = route.component;
      }
      return h(component);
    }
  });
}

export default VueRouter;
