#### 生命周期钩子函数
- setup() {}  组件创建之前执行，实际上是在beforeCreate之后 created之前执行
- onBeforeMount(() => {}) 组件挂载到页面之前执行
- onMounted(() => {}) 组件挂载到页面之后执行
- onBeforeUpdate(() => {})  组件更新之前执行
- onUpdated(() => {})  组件更新之后执行
- onBeforeUnmount(() => {}) 组件卸载之前执行
- onUnmounted(() => {}) 组件卸载之后执行
- onActivated(() => {}) 被 keep-alive 缓存的组件激活时执行
- onDeactivated(() => {}) 被 keep-alive 缓存的组件停用时执行
- onErrorCaptured(() => {}) 当捕获一个来自子孙组件的错误时被执行
- onRenderTracked((event) => {})  全局跟踪钩子函数，只要全局有任何东西发生改变都会被执行，event为返回的跟踪对象
- onRenderTriggered((event) => {})  状态跟踪钩子函数，只精确跟踪一个会发生改变的值，event为返回的跟踪对象

#### ref与toRef的区别
- ref 是对传入数据的拷贝；toRef 是对传入数据的引用
- ref 的值改变会更新视图；toRef 的值改变不会更新视图