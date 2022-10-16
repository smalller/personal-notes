[toc]
#### Buffer对象（缓冲区）
在内存中存储数据的区域，常用于网络传输时的资源，一句话概括：描述二进制
```js
//创建Buffer
let buf = Buffer.alloc(5,"abcde");  //第一个参数为空间大小，第二个参数为要存储的数据
let buf = Buffer.alloc('中文')  //直接存数据

//将Buffer数据转为字符串
String(buf);  //或者buf.toString();
```

#### 模块
在nodejs下，模块分为：自定义模块、核心模块、第三方模块

一、自定义模块
1. 在nodejs里，每一个文件都是一个模块
```js
function(exports,require,module,__filename,__dirname) {
  //__filename（当前模块的绝对路径和模块名称）
  //__dirname（目录名称）
  ...
}
```
2. require（引入模块/文件）
```js
require("./demo1.js");
```
3. module（指代当前模块的导出对象）
module.exports：当前模块的导出对象，在被引入的文件/模块中，就要将相关变量，函数等导出，可以让其在引入的页面使用
```js
//如
let a = 1;
function fn() {
  console.log(123);
}
exports.a = a;  //方式一，导出变量a（exports和module.exports指向同一个地址）
module.exports.fn = fn; //方式二，导出函数fn
module.exports.fn2 = function() {...} //方式三，直接导出匿名函数形式
module.exports = {  //方式四，直接导出一个对象（exports和module.exports就不再指向同一个对象，也就是说现在的module.exports把之前的给覆盖掉了）
  name : "small l",
  say() {
    console.log("我是" + this.name);
  }
}
```
4. 核心模块
    - querystring 模块：查询字符串：浏览器向服务器发起请求，传递数据的一种方式