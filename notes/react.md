## React的生命周期钩子函数
- componentWillMount    组件即将挂载完成
- componentDidMount     组件挂载完成
- componentWillUnmount  组件即将卸载
- shouldComponentUpdate 组件是否应该被更新，默认true，可自定义返回false，那么每次修改组件的值都会被拦截，不准修改
- componentWillUpdate   组件即将更新
- componentDidUpdate    组件更新完成
- componentWillReceiveProps 组件即将接收到新的props时，首次渲染时不会执行，后续更新渲染才会执行

![xSxX1H.md.jpg](https://s1.ax1x.com/2022/09/17/xSxX1H.md.jpg)

![xpS3If.png](https://s1.ax1x.com/2022/09/17/xpS3If.png)

## ReactDOM.render(<Demo />, ...) 做了什么事
1. React解析组件标签，找到对应的组件
2. 发现组件是类定义的，随后new出该组件的实例，并通过该实例调用到原型上的render方法
3. 将render返回的虚拟DOM转为真实DOM，随后渲染到页面上

## React Hooks 的实现原理
1. React Hooks 的实现原理就是把相应的函数组件里面使用的 Hooks 产生的状态逻辑数据通过链表的数据结构挂载到对应的函数组件的 Fiber 节点上。
2. 其中 useState 是在 useReducer 的基础上实现的，useReducer 里面返回的 dispatch 函数是通过闭包的形式把相应的 Fiber 节点进行了缓存，在将来用户进行调用相应的 dispatch 函数时，依然可以触发对应的函数组件的 Fiber 节点进行更新。

## 受控组件与非受控组件
### 受控组件
>用onChange事件实时对表单值进行更新存储的方式，类似于vue中的双向绑定，要用到的时候直接进行访问

### 非受控组件
>用ref的方式去实时获取表单的值，随用随取

## 高阶函数
- 如果一个函数接收的参数是一个函数，那么这个函数可以称之为高阶函数，如Promise，定时器等
- 如果一个函数调用之后的返回值是一个函数，那么这个函数也可以称之为高阶函数，如闭包函数

## 函数的柯里化
>通过函数调用继续返回函数的形式，实现多次接收参数，最后统一处理的函数编码形式
```js
function sum(a) {
    return (b) => {
        return (c) => {
            return a + b + c
        }
    }
}
sum(1)(2)(3)    // 计算1 + 2 + 3的值
```