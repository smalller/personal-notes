### 部分文件作用
#### vue\src\platforms\web\entry-runtime-with-compiler.js
- 开发环境打包的入口文件
- 处理template或者el选项，处理编译这件事

#### vue\src\platforms\web\runtime\index.js
- 安装补丁函数（patch更新函数）：将vdom转为dom
- 实现$mount函数：将vdom转为dom，再将其append到宿主元素上

#### vue\src\core\index.js
- 初始化全局API

#### vue\src\core\instance\index.js
- Vue构造函数声明的地方
- 初始化各种实例方法和属性

#### vue\src\core\instance\init.js
- 初始化函数声明的地方


### 初始化的整体流程：
初始化 => 创建根实例 => 挂载到根实例 => 将模板语法转为render函数执行 => 转为vdom => patch(vdom) => 转为dom => append到根节点上去

### new Vue()的作用：

1. 初始化实例方法和属性，如：beforeCreate，created，data，method，wtach，computed等
2. 创建根实例，并且将new Vue()挂载到根实例
3. 将templete语法转换为render函数，再转为vdom


### $mount的作用：
其中new Vue()的挂载部分即为\$mount，作用如下：
1. 处理new Vue传入的配置项，处理顺序为：render => template => el选项，只要满足其中一个，后面的都不再执行
2. 通过patch函数，将vdom传入，并且转为真实dom
3. 将真实dom append到根节点上
4. 为每个组件添加一个watcher，为后续的组件更新操作做准备；每个组件有一个自带的watcher，如果后续用户使用了watch方法那么就会新建一个watcher

### 响应式原理
1. 获取data中所有的属性，对每个属性进行defineProperty拦截操作
2. 每个对象都会对应一个observe和一个dep，只要该对象发生了新增/删除属性，dep就会去通知更新对象
3. 对象中的每一个键都会对应一个小的dep，只要键发生了变化，小的dep就会去通知更新键对应的值
4.通过递归的方式，将data里的值更新到对应的视图中

### 数组响应式原理
1. vue将数组原型上的7个方法进行了重写
2. 不仅保留了数组方法的原始行为，还为每个方法添加了observe通知更新
3. 将更新后的方法添加到当前实例的__proto__上，不会影响到其他地方


### vue3的相关优化
1. 在vdom上做了优化，添加了静态标记，vue2在更新虚拟DOM时，会将组件中所有元素进行diff更新，而vue3不会，会将静态元素进行标记，这样就不用对所有元素都进行diff，减少性能损耗

### vdom的优点
1. 提高编译性能，减少性能损耗，不直接对dom进行操作，直接预编译操作
2. 跨平台，vodm就是一个ast语法树，可以在任何平台进行编译处理