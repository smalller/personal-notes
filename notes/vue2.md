[toc]
## 生命周期钩子函数
1. beforeCreate() 组件创建前执行
2. created()  组件创建后执行（该阶段没有虚拟DOM树，不能做DOM操作）
3. beforeMount()  页面首次加载之前执行
4. mounted()  页面首次加载完后执行
5. beforeUpdate() data中的变量值更新之前执行
6. updated()  data中的变量值更新之后执行
7. beforeDestroy()  销毁组件之前执行
8. destroyed()  销毁组件之后执行
9. activated()  被 keep-alive 缓存的组件激活时调用
10. deactivated() 被 keep-alive 缓存的组件停用时调用
11. errorCaptured() 当捕获一个来自子孙组件的错误时被调用

生命周期流程图如下：
![生命周期流程图](https://vue-js.com/learn-vue/assets/img/1.6e1e57be.jpg)


## 实例和方法

### $nextTick
在DOM更新完成后再执行括号里的回调函数，一般在修改数据之后使用该方法，以便获取更新后的DOM

### $set
动态添加对象属性
```js
this.$set(对象名,"属性名","属性值")
```

### $delete
动态删除对象中的某个属性
```js
this.$delete(对象名,"属性名")
```



### key
>作用：主要是为了高效的更新虚拟DOM。另外vue中在使用相同标签名元素的过渡切换时，也会使用到key属性，其目的也是为了让vue可以区分它们

> vue为什么不用index作为key？
例如一个数组有4个值，他们都是依据index来绑定的，我把其中第二个删除了，那么原有的index绑定关系都会发生改变，都会往前移，所以被删除数据的后面都会重新被渲染，就会影响性能。

### 计算属性（computed）
不实际保存属性值，根据其他属性的值，动态计算获得自己的属性
与普通方法区别：
- 计算属性是基于它的依赖变量进行更新的，只有在相关依赖发生改变时才能更新变化
- 计算属性是有缓存的，只要相关依赖变量没有改变，多次访问计算属性得到的值都是之前缓存的计算结果，除非它依赖的值改变了，计算结果才会跟着改变
- 无法通过外部函数修改计算属性的结果
```js
// 计算属性由两部分组成，get和set，分别用来获取计算属性和操作计算属性，默认只有get，如果需要set，则要自己添加
computed : {
  num : {
    get() {
      ... 通过依赖变量，计算获得统计结果，并返回
      return 计算结果
    },
    set() {
      修改依赖变量的值
    }
  }
}
```

### 侦听属性（watch）
如果当一个变量值改变时，就立刻自动执行相关操作
```js
watch : {
  num(newVal,oldVal) {
    ...
  }
}

//深度监视：常用于监视对象中的属性变化情况，但是它只能监视到改变后的值，原来的值监视不到
user: {
  handler(newVal) {
    ...
  },
  deep: true
}

//第一个参数为要监听的变量，第二个参数为一个回调函数
this.$watch("age",(newVal,oldVal)=> {
  ...
});
```

### 过滤器
```js
// 全局使用
Vue.filter("filterName",function(oldVal) {
  let newVal = '';
  ...
  return newVal
})

// 组件里单独引入
export function filterName(oldVal) {
  let newVal = '';
  ...
  return newVal
}
filters : {
  filterName
}
```

## 组件

### 组件间通信方式
- **props**：父传子
- **emit**：子传父
- **$refs**：获取子组件实例
- **$parent**：获取父组件实例
- **$children**：获取子组件实例
- **event bus**
  ```js
  // 发布
  this.$root.$emit("test",this.obj)

  // 订阅
  this.$root.$on("test",res => { ... })

  // 只接收一次（应用场景：首屏加载广告等）
  this.$root.$once("test",res => { ... })

  //销毁
  this.$root.$off("test")
  ```
- **$attrs**


  ```js
  // 父组件中
  <com1 :obj="obj" />

  // 子组件中
  console.log(this.$attrs)
  <grandson v-bind="$attrs" />

  // 孙子组件中
  console.log(this.$attrs)
  ```
  1.   当一个组件没有声明任何 prop 时，这里会包含所有父作用域的属性 (class 和 style 除外)，并且可以通过 v-bind="$attrs" 传入内部组件。即：接收除了props声明外的所有绑定属性（class、style除外）
  2. 在 grandson.vue 上通过 v-bind="$attrs"， 可以将属性继续向下传递，让 grandson.vue 也能访问到父组件的属性，这在传递多个属性时会显得很便捷，而不用一条条的进行绑定。
  3. 如果想要添加其他属性，可继续绑定属性。但要注意的是，继续绑定的属性和 $attrs 中的属性有重复时，继续绑定的属性优先级会更高

- **$listeners**

 
  ```js
  // 父组件中
  <com1 @myEvent="myEvent" />

  // 子组件中
  console.log(this.$listeners)  // { customEvent: fn }
  this.$emit('myEvent') //调用
  <grandson v-on="$listeners" />

  // 孙子组件中
  this.$emit('myEvent')
  ```
  1. 包含了父作用域中的 (不含 .native 修饰器的) v-on 事件监听器。它可以通过 v-on="$listeners" 传入内部组件。即：接收除了带有.native事件修饰符的所有事件监听器
  2. 同 attrs 属性一样，可以通过 v-on="\$listeners"，将事件监听器继续向下传递，让 grandson.vue 访问到事件，且可以使用 \$emit 触发 parent.vue 的函数。
  3. 如果想要添加其他事件监听器，可继续绑定事件。但要注意的是，继续绑定的事件和 $listeners 中的事件有重复时，不会被覆盖。当 grandson.vue 触发 customEvent 时，child.vue 和 parent.vue 的事件都会被触发，触发顺序类似于冒泡，先到 child.vue 再到 parent.vue

- **provide/inject**

  ```js
  // 父组件中
  export default {
    provide() {
      return {
          app: this
      }
    } 
  }

  // 子孙组件中
  export default {
    inject: ['app'],
    created() {
      console.log(this.app)
    }
  }
  ```
  这对选项需要一起使用，以允许一个祖先组件向其所有子孙后代注入一个依赖，不论组件层次有多深，并在其上下游关系成立的时间里始终生效。简单来说，一个组件将自己的属性通过 provide 暴露出去，其下面的子孙组件 inject 即可接收到暴露的属性

- **小型状态管理器（observable）**
  ```js
  // store.js
  import Vue from 'vue'
  export const state = Vue.observable({ 
    count: 0 
  })

  // 使用
  <div @click="setCount">{{ count }}</div>

  import {state} from '../store.js'
  export default {
    computed: {
      count() {
          return state.count
      }
    },
    methods: {
      setCount() {
          state.count++
      }
    }
  }
  ```

### 动态组件
```html
<keep-alive>
  <component :is="flag"></component>
</keep-alive>
```

### 单向数据流
1. props是单向绑定的，当父组件的属性变化时，传给子组件相应的值也会跟着改变
2. 子组件修改传过来的值，不会影响的父组件中的值，但是会报错；如果子组件想把传过来的数据作为局部数据来使用，可以将这个数据赋给另一个变量，再进行操作
3. 子组件想修改父组件传过来的数据，并且想同步更新到父组件中的方法
```js
// 方法一
// 父组件中，传值方式加上修饰符.sync
<com1 :name.sync="name"></com1>

// 子组件中
this.$emit('update:要修改的属性名','要修改成的值')

// 方法二
可以将父组件中的数据包装成对象，然后在子组件中修改对象的属性
```


## 路由

### $router
>路由实例对象：专门执行跳转动作的对象

### $route
>路由信息对象：是封装地址栏信息的对象，是保存数据的，不执行相关操作

### 嵌套路由（子路由）
```js
{
  path : '/index',
  name : 'index',
  component : index,
  children : [
    {
      path: '',	//默认访问的子路由，就写''
      name: 'agencyList',
      component: agencyList,
    },
    {
      path: 'agencyList', //子路由的地址都不加 /
      name: 'agencyList',
      component: agencyList,
    },
    ...
  ]
}

// 在要展示该子路由的地方，写上
<router-view></router-view>
```

### 路由跳转
```js
<router-link to="path">文本</router-link>

<router-link :to="{name:'组件对应的name值',params:{要携带的参数:xx}"></router-link>

this.$router.push(path);

// 路由自己跳自己
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
```

### 路由传参
```js
为了能给让组件既能接收 props 传递的参数，也能接收 $route.params 传递的参数，需要对 路由 也进行一些改造
{
  path: '/details/:id',
  name: 'details',
  component: details,
  props: true
}
当 props 设置 为 true，那么 route.params 中的数据自动就会被设置为组件属性与组件原有 props 进行合并

this.$router.push({path,query:{...}});  //相当于get显式传参，页面刷新数据不会丢失
this.$route.query //接收

this.$router.push({name,params:{...}});  //相当于post隐式传参，页面刷新数据会丢失
this.$route.params  //接收
```

### 路由导航守卫
每个守卫方法都有三个参数
- to：即将要进入的目标路由对象
- from：当前导航正要离开的路由
- next：路由确认回调函数，一定要调用该方法来执行后续操作
  - next()：进行管道中的下一个钩子
  - next(false)：中断当前的导航
  - next('/') 或者 next({ path: '/' })：跳转到一个不同的地址，当前的导航会被中断，进入一个新的导航

#### 组件路由守卫
组件内的三个钩子函数
```js
//当路由解析完成，组件beforeCreate渲染之前触发，这里不能获取this，需要通过next()回调进行调用，所以一般不会在这里操作路由
beforeRouteEnter(to,from,next) {
  next();
  
  //可以在next的回调里进行操作和获取this，这里的vm就相当于this
  next(vm => {...})
}

//在当前路由改变，但是该组件被复用时调用，可以获取this
beforeRouteUpdate(to,from,next) {
  next();
}

//当导航离开该组件的对应路由时调用
beforeRouteLeave(to,from,next) {
  next();
}
```

#### 全局守卫
注册在router对象（new VueRouter({...})）上的
```js
router.beforeEach((to, from, next) => {
  //当全局任意一个导航触发时，会按照创建顺序调用，一般用作登录权限验证
})

router.beforeResolve((to, from, next) => {
  //在导航被确认之前，同时在所有组件内守卫和异步路由组件被解析之后，解析守卫就被调用
})

router.afterEach((to, from) => {
  //导航被确认后调用，因为导航被确认，所以此处没有next()
})
```

#### 路由独享守卫
可以在路由配置上直接定义beforeEnter守卫，但应用不多
```js
routes:[
  {
    path:'/',
    component:index,
    beforeEnter:(to,from,next) => { 
      //只要访问该路由都会执行相关操作 
    }
  }
]
```

#### nprogress
> 官网：http://ricostacruz.com/nprogress/
> 安装：npm i nprogress
使用：可以在axios响应拦截器里操作，也可以在路由全局守卫里操作
```js
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
 
router.beforeEach((to, from, next) => {
  NProgress.start()
  next()
})

router.afterEach((to, from, next) => {
  NProgress.done()
})
```

#### 路由动效
利用 transition 组件，可以给路由导航加上动效
```html
<!-- App.vue -->
<template>
  ...
  <transition name="fade">
    <router-view />
  </transition>
  ...
</template>

<style>
  .fade-enter-active {
    transition: opacity .5s;
  }
  .fade-leave-active {
    transition: none;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
</style>
```

#### 滚动行为
前端路由并没有重载整个浏览器，只是通过 DOM 进行了局部更新。当我们在一个页面中滚动滚动条，然后跳转到另外一个页面，滚动条会保持在上一个页面中，我们其实更希望滚动条能回到页面顶部，就像重载了整个页面一样
```js
// 解决方式
const router = new VueRouter({
  routes: [...],
  scrollBehavior: () => ({ y: 0 })
});
```

针对后退/前进 行为，会提供一个 savedPosition 参数，通过该参数返回历史记录中的滚动值
```js
scrollBehavior (to, from, savedPosition) {
  if (savedPosition) {
    return savedPosition
  } else {
    return { x: 0, y: 0 }
  }
}
```

#### 路由元信息
定义路由的时候可以配置 `meta` 字段，例如通过 meta 定义要验证的路由
```js
const router = new Router({
  routes: [
    {
      path: '/user',
      component: User,
      children: [
        {
          path: '',
          name: 'user',
          component: Profile,
          meta: { requiresAuth: true }
        },
        {
          path: 'cart',
          name: 'user-cart',
          component: Cart,
          meta: { requiresAuth: true }
        }
      ]
    }
  ]
})

const isLogin = true;
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !isLogin) {
      next({
        name: 'login',
      })
  } else {
    next()
  }
})
```

#### hash和history路由模式的区别
hash模式：
>1.hash虽然包含在URL中，但不被包括在HTTP请求中；
>2.hash模式不会重新加载页面，是通过监听hashchange事件(#)的变化来执行js代码，从而实现页面的改变；
>3.对后端来说，即使没有做到对路由的全覆盖，也不会返回404错误

history模式：
>1.h5推出的history API，仅对浏览器支持H5的才会生效；
>2.前端的URL必须和实际向后端发起请求的URL一致，如果后端缺少对 /book/id 的路由处理，将返回404错误

## vuex
vuex是vue的状态管理器，其中包含：
- State：状态数据源
- View：使用状态数据源的视图
- Actions：修改更新数据源的操作

这种状态管理模式遵循的是单向数据流模式

### vuex的工作流
- State：存储应用状态数据
- Vue Component：使用State中的数据
- Actions：提交修改State的动作（包括异步行为）
- Mutations：唯一更改的位置，即在这里操作数据

### 创建Store仓库
```js
// ./store/index.js
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {},
    getters: {},
    mutations: {},
    actions: {}
})

export default store
```

### 核心概念
- state
- getters
- mutations
- actions

#### state
state 的更新并不会更新视图
解决：使用计算属性自动更新
通过对象扩展运算符，可以把 mapState 返回的 state 属性与组件已有计算属性进行融合
```js
<script>
import {mapState} from 'vuex'

export default {
  computed: {
      computed() {/.../},
      ...mapState({
          // ...
      })
  }
}
</script>
```

#### getters
有时候我们需要从 store 中的 state 中派生出一些状态，类似组件的 data 与 computed，store 也提供了一个 getters 对象来处理派生数据
##### getters 函数
与组件属性一样，我们是通过定义一个函数的形式来返回派生数据的，getters 函数接受两个参数
- 第一个参数：state 对象
- 第二个参数：getters 对象
###### 通过属性访问
与组件计算属性一样，默认是通过属性的方式去访问getters中的数据的，这种方式与组件的计算属性一样，也是会缓存结果的

###### 通过方法访问
还可以通过闭包函数的形式返回一个函数，来实现给getters函数传参，需要注意的是这种方式不支持结果缓存

#### mutations
更改 Vuex 的 store 中的状态的唯一方法是提交 mutation；
Vuex 中的 mutation 非常类似于事件：每个 mutation 都有一个字符串的 事件类型 (type) 和 一个 回调函数 (handler)
```js
/*
 type：要提交的 mutation 回调函数名称
 payload：载荷：提交的额外数据，任意格式
*/
store.commit(type, payload)
```
mutation 函数必须是同步的，commit方法没有返回值

#### actions
action 中的函数与 mutation 中的函数类似，但是它主要用来进行异步任务的处理，然后通过提交 mutation 来修改 state
>注意：action 中的函数不要直接修改 state
```js
store.dispatch(type, payload)
```
action 任务需要通过 dispatch 方法来提交（派发），与 commit 类似，dispatch 方法有返回值，且返回一个 promise 对象

### vue优化：
1. 对路由使用异步加载方式，减少首屏加载时间
2. Vue3使用defineAsyncComponent，进行异步加载组件，减少首屏加载时间