# admin-element-vue-typescript

此分支是 Webpack + Vue3.x + Element Plus 版本 ， Vite 版本请查看 Vite.ts (分支)（[github](https://github.com/lqsong/admin-element-vue/tree/vite.ts)、[gitee](https://gitee.com/lqsong/admin-element-vue/tree/vite.ts)）

## Demo

**注意：Demo 用的是在线mock服务，不稳定，若在线登录不了pull到本地可直接运行查看demo**

| **[http://tsv2-demo.admin-element-vue.liqingsong.cc](http://tsv2-demo.admin-element-vue.liqingsong.cc/)**             |
:-------------------------:
| ![Home](https://gitee.com/lqsong/public/raw/master/admin-element-vue-typescript/home.png)  |
| ![Home](https://gitee.com/lqsong/public/raw/master/admin-element-vue-typescript/home2.png)  |


## 实战案例

- lqsblog-frontend-admin-vue（[Github](https://github.com/lqsong/lqsblog-frontend-admin-vue) 、 [Gitee](https://gitee.com/lqsong/lqsblog-frontend-admin-vue)）



## 使用文档

 - [http://admin-element-vue.liqingsong.cc/tsv2/](http://admin-element-vue.liqingsong.cc/tsv2/)
 - [Github](https://github.com/lqsong/admin-element-vue) 
 - [Gitee](https://gitee.com/lqsong/admin-element-vue)



## 后台前端解决方案列表

 - admin-element-vue（[GitHub](https://github.com/lqsong/admin-element-vue)、[Gitee](https://gitee.com/lqsong/admin-element-vue)）
 - admin-antd-vue（[GitHub](https://github.com/lqsong/admin-antd-vue)、[Gitee](https://gitee.com/lqsong/admin-antd-vue)）
 - admin-antd-react（[GitHub](https://github.com/lqsong/admin-antd-react)、[Gitee](https://gitee.com/lqsong/admin-antd-react)）
 - electron-admin-element-vue（[GitHub](https://github.com/lqsong/electron-admin-element-vue)、[Gitee](https://gitee.com/lqsong/electron-admin-element-vue)）
 - electron-admin-antd-vue（[GitHub](https://github.com/lqsong/electron-admin-antd-vue)、[Gitee](https://gitee.com/lqsong/electron-admin-antd-vue)）
 - electron-admin-antd-react（[GitHub](https://github.com/lqsong/electron-admin-antd-react)、[Gitee](https://gitee.com/lqsong/electron-admin-antd-react)）
 - admin-vue3-micro-qiankun（[GitHub](https://github.com/lqsong/admin-vue3-micro-qiankun)、[Gitee](https://gitee.com/lqsong/admin-vue3-micro-qiankun)）



## 功能

```
- 登录 / 注销 / 注册

- 权限验证
  - 页面权限
  - 按钮操作
  - 权限配置

- 全局功能
  - 国际化多语言
  - 动态顶级菜单（支持设置是否启用）
  - 动态侧边栏（支持多级路由嵌套）
  - 动态面包屑（支持自定义配置）
  - Svg Sprite 图标
  - Mock 数据

- 综合实例
  - 引导页
  - 组件示例
    - 编辑器
      - CKEditor
      - tui-editor
    - 图标
      - IconSvg
      - IconFont
  - 页面示例
    - 列表页面
      - 表格列表
      - 高度自适应表格
      - 搜索列表
    - 表单页面
      - 基础表单
      - 高级表单      
    - 详情页面
      - 基础详情
      - 模块详情
      - 表格详情
  - 权限验证
```


## 自定义配置

### **(建议)** 本地或开发模式下，不要直接修改 '.env.development'
复制 '.env.development' 重命名为 ' .env.development.local' , 修改对应的参数.

### **(建议)** 生产模式下，不要直接修改 '.env.production'
复制 '.env.production' 重命名为 ' .env.production.local' , 修改对应的参数.


## 项目设置

### 一、Install dependencies,

```bash
$ yarn
```

or

```
$ npm install
```

> 推荐使用 yarn , **[yarn安装与常用命令](http://liqingsong.cc/article/detail/9)** 。

### 二、Compiles and hot-reloads for development

```bash
$ yarn serve
```

or

```
$ npm run serve
```


### 三、Compiles and minifies for production

```bash
$ yarn build
```
or

```
$ npm run build
```

### 四、精简 svg icon

```
$ yarn svgo
```

or

```
$ npm run svgo
```

### 五、Run your unit tests
```
yarn test:unit

#

npm run test:unit
```

### 六、Lints and fixes files
```
yarn lint

#

npm run lint
```


## 捐赠

如果你觉得这个项目帮助到了你，请帮助点击 Star，你也可以请作者喝咖啡表示鼓励.

**ALIPAY**             |  **WECHAT**
:-------------------------:|:-------------------------:
![Alipay](http://uploads.liqingsong.cc/20210430/f62d2436-8d92-407d-977f-35f1e4b891fc.png)  |  ![Wechat](http://uploads.liqingsong.cc/20210430/3e24efa9-8e79-4606-9bd9-8215ce1235ac.png)

### 3 分钟了解如何进入开发

欢迎使用云效 Codeup，通过阅读以下内容，你可以快速熟悉 Codeup ，并立即开始今天的工作。

### 提交**文件**

首先，你需要了解在 Codeup 中如何提交代码文件，跟着文档「[__提交第一行代码__](https://thoughts.aliyun.com/sharespace/5e8c37eb546fd9001aee8242/docs/5e8c37e7546fd9001aee81fd)」一起操作试试看吧。

### 开启扫描

开发过程中，为了更好的管理你的代码资产，Codeup 内置了「[__代码规约扫描__](https://thoughts.aliyun.com/sharespace/5e8c37eb546fd9001aee8242/docs/5e8c37e8546fd9001aee821c)」和「[__敏感信息检测__](https://thoughts.aliyun.com/sharespace/5e8c37eb546fd9001aee8242/docs/5e8c37e8546fd9001aee821b)」服务，你可以在代码库设置-集成与服务中一键开启，开启后提交或合并请求的变更将自动触发扫描，并及时提供结果反馈。

![](https://img.alicdn.com/tfs/TB1nRDatoz1gK0jSZLeXXb9kVXa-1122-380.png "")

![](https://img.alicdn.com/tfs/TB1PrPatXY7gK0jSZKzXXaikpXa-1122-709.png "")

### 代码评审

功能开发完毕后，通常你需要发起「[__代码合并和评审__](https://thoughts.aliyun.com/sharespace/5e8c37eb546fd9001aee8242/docs/5e8c37e8546fd9001aee8216)」，Codeup 支持多人协作的代码评审服务，你可以通过「[__保护分支__](https://thoughts.aliyun.com/sharespace/5e8c37eb546fd9001aee8242/docs/5e8c37e9546fd9001aee8221)」策略及「[__合并请求设置__](https://thoughts.aliyun.com/sharespace/5e8c37eb546fd9001aee8242/docs/5e8c37e9546fd9001aee8224)」对合并过程进行流程化管控，同时提供 WebIDE 在线代码评审及冲突解决能力，让你的评审过程更加流畅。

![](https://img.alicdn.com/tfs/TB1XHrctkP2gK0jSZPxXXacQpXa-1432-887.png "")

![](https://img.alicdn.com/tfs/TB1V3fctoY1gK0jSZFMXXaWcVXa-1432-600.png "")

### 编写文档

项目推进过程中，你的经验和感悟可以直接记录到 Codeup 代码库的「[__文档__](https://thoughts.aliyun.com/sharespace/5e8c37eb546fd9001aee8242/docs/5e8c37e8546fd9001aee8213)」内，让智慧可视化。

![](https://img.alicdn.com/tfs/TB1BN2ateT2gK0jSZFvXXXnFXXa-1432-700.png "")

### 成员协作

是时候邀请成员一起编写卓越的代码工程了，请点击右上角「成员」邀请你的小伙伴开始协作吧！

### 更多

Git 使用教学、高级功能指引等更多说明，参见[__Codeup帮助文档__](https://thoughts.aliyun.com/sharespace/5e8c37eb546fd9001aee8242/docs/5e8c37e6546fd9001aee81fa)。
