### 概念
>就是前端和客户端的混合开发， 让App同时具备原生和Web 的技术优势。【需要前端开发人员和客户端开发人员配合完成】

### 优点
1. 可以快速迭代更新【关键】，无需APP审核（hybrid技术可以一天上线多次）
2. 减少开发和沟通成本，双端公用一套代码

### 缺点
1. 体验不如原生流畅
2. 性能问题
3. 兼容性问题 【Android 5.0+ 和 IOS 9.0+上缺点不再明显】


### webview
>是APP中的一个组件， 主要用于加载H5页面，是一个小型的浏览器内核。

### JSBridge桥接器
#### 概念
>是JS和原生之间的一种通信方式，比如JS没有本地文件读写权限、不能使用GPS、不能修改系统配置等操作，JS就要通过该方式委托原生去实现，原生完成后，再将结果通知JS。