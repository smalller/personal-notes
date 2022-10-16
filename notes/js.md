[toc]
## 数据类型
- 基本类型：Number、String、Boolean、Null、Undefined、Symbol、BigInt
- 引用类型：Object（Array、Function、Date、RegExp、Math）
	null表示一个值被定义了，但是这个值是空值
	undefined表示"缺少值"，就是此处应该有一个值，但是还没有定义


## 字符串
  #### 字符串操作
  1. 分割字符串
      - str.split("-") 将字符串按照指定的字符分割成数组
  2. 截取字符串
      - str.slice(0,6)  从第0位开始，截取到第6位之前
      - str.substring(3,5)  从第3位开始，截取到第5位之前
      - str.substr(3,4) 从第3位开始，截取4个字符
      - str.substr(4) 从第4位开始，一直截取到最后
  3. 替换字符串
      - str.replace("456","四五六") 第一个参数为查找要替换的字符，第二个参数为要替换成的值（只替换搜索到的第一个字符串）
      - str.replaceAll('hello','aaa')  全局替换所有'hello'字符
  4. 搜索字符串
      - str.match("456")  如果搜索到了就以数组的形式返回搜索到的值，且默认只返回首次查到的值，如果没搜索到就返回null
      - str.match(/xiaomao/ig)  全局、不区分大小写查到"xiaomao"，搜索到几个，就返回几个值
      - str.indexOf("456")  获得字符在字符串中首次出现的位置，第二个参数默认为空或0，假如为2，则表示从第二位开始查找；找不到则返回-1
      - str.search(/xiaomao/i)  用法与indexOf一样，但它可以使用正则表达式使其不区分大小写
      - str.includes("123") 查找字符串中是否包含该指定的字符
  5. 去除字符串中某些字符
      - str.trim()  去除字符串两边的空白
      - str.substring(1, demo.length - 1) 去掉字符串首位的字符
      - str.substring(0, demo.length - 1) 去掉字符串的最后一位
      - str.substring(0, demo.lastIndexOf('最后一位字符'))  去掉字符串的最后一位指定字符

  #### 强制转换
  1. Number(false)  将其他类型转换成数值类型, undefined和字母不能转换为数值类型，因为它不是一个数，结果会为NaN，但它们转换后的类型还是number类型，null会转换为0
  2. parseInt("123a") 将字符串或者数字转为整形，其他的数据返回NaN，如果要转换的字符串开头为非数字，则返回NaN，这里值为123
  3. parseFloat("123.2a") 将所有数类型转换成浮点型，用法和parseInt一样
  4. Boolean(undefined) 将所有类型转换为布尔类型
  5. str.toFixed(2);    将str的值保留2位有效数值，包括整数也可以使用
  6. String(123.2)  可以将所有类型转换为字符串类型
  7. str.toString() 可以将所有的的数据都转换为字符串，但是要排除null 和 undefined


## 数组
  - Array.from 从一个类似数组或可迭代对象创建一个新的浅拷贝的数组实例
    > Array.from('foo')
    > // [ "f", "o", "o" ]

    > Array.from([1, 2, 3], x => x + x)
    > // [2, 4, 6]
  
  - 类数组arguments转为数组的方法
      - Array.from(arguments)
      -	[...arguments]

  - 数组的相关方法
     - arr.splice(start,count) 删除或增加元素
     - arr.slice(strat,end)  截取元素
     - arr.join(',') 将数组以','相连拼接成字符串
     - arr1.concat(arr2)  连接数组的作用
     - arr.push() 向数组的末尾追加元素（返回值为数组的长度）
     - arr.unshift()  向数组的开头追加元素（返回值为数组的长度）
     - arr.pop()  删除数组末尾的元素（返回值为删除的元素值）
     - arr.shift()  删除数组开头的元素（返回值为删除的元素值）
     - arr.reverse()  把数组里的序列顺序颠倒
     - arr.sort((a,b) => a - b) 给数组里的无序数组排序
     - arr.sort(() => Math.random() - 0.5) 把一个有序数组排成乱序
     - arr.includes() 一个数组是否包含一个指定的值
     - arr.indexOf() 元素在数组中首次出现的位置
     - arr.filter() 筛选操作
     ```javascript
      arr.filter(item => item > 10});
     ```
     - arr.map()  遍历并赋值原数组为新数组，该新数组的值改变不会影响到原数组
     ```javascript
      var newPrice = price.map(item => {
        if (item > 200) {		
          return item * 0.5;
        } else {
          return item * 0.7;
        }
      })
     ```
     - arr.every()  数组中是否所有元素都符合要求
     ```javascript
      var bool = demo.every(item => {
        return 判断条件
      })
     ```
     - arr.some() 判断数组中是否包含符合要求的元素，满足一个即可
     ```javascript
      var bool = demo.some((item) => {
        return 判断条件
      })
     ```
     - arr.reduce() 汇总规约
     ```javascript
      var sum = arr.reduce((prev,item) => {
        return prev + item;
      },0)
     ```
     reduce原理：
      >1. prev：保存截止到当前元素的临时汇总值
      >2. return的值为：将当前元素item，累加到prev中，得到的新的汇总值
      >3. 0：起始值，这里写0，表示从0开始累加传进来的元素；可以写其他值作为参数，也可以写sum，以上一次汇总的值作为基数再进行汇总；也可以写其他东西，比如对象等
     - arr.fill(value,start,end) 用一个固定值填充一个数组中从起始索引到终止索引内的全部元素，不包括终止索引
     - arr.find() 返回数组中满足条件的第一个元素的值，否则返回 undefined
     - arr.findIndex()  返回数组中满足条件的第一个元素的下标
     ```javascript
      var found = arr.find(item => item > 10)
     ```
     - new Set()  进行数组去重（可以对对象类型进行去重）
     ```javascript
      let a = {a: 11}
      let array = [0, 1, 1,66, '1', '22', 22, a, a, 66]
      function uniq() {
        return Array.from(new Set(array)) // 装逼写法 [... new Set(array)]
      }
      uniq()
     ```



#### 相关API
对象合并
```js
// 方式一
Object.assign(obj1,obj2)

// 方式二
const obj3 = {...obj1,...obj2}
```

#### Math对象
  - Math.PI 获取圆周率
  - Math.abs(19-20) 取绝对值
  - Math.pow(2,n) 计算2的n次幂
  - Math.max(123,-2,0,1,5)  取最大值
  - Math.min(123,-2,0,1,5)  取最小值
  - Math.round(4.49)  四舍五入取整
  - Math.floor(4.99)  对数进行向下取整，值为4
	- Math.ceil(5.01) 对数进行向上取整，值为6
  - Math.random() 取0到1之间的随机小数（包含0，不包含1）
		Math.random()\*10  取0到10之间的随机小数
		Math.floor(Math.random()\*(y+1-x)+x) 取x到y之间的随机整数

#### Date对象
  1. 创建Date对象
      - new Date()  创建当前系统日期
      - new Date("2020/2/26 12:17:16")  创建指定日期，时间值可以不写
      - new Date(2022,0,1,0,0,0)  创建指定日期，这里的月份值为0\~11（1月~12月），超过11就跳到下一年，时间值可以不写
  2. 获取存储日期时间对象
      - getFullYear() 年份
      - getMonth()+1  月份
      - getDate() 天数
      - getHours()  小时
      - getMinutes()  分钟
      - getSeconds()  秒钟
      - getMilliseconds() 毫秒
      - getDay()  星期（0\~6，星期日~星期六）
      - getTime() 指定日期和计算机元年之间相差的毫秒数（获取当前时间的时间戳）

  3. 获取本地字符串格式
      - toLocaleString()  将日期格式转为 xx-xx-xx  xx:xx:xx
      - toLocaleDateString()  将年月日转为 xx-xx-xx 格式
      - toLocaleTimeString()  将时间转为 xx:xx:xx 格式

  4. 修改时间日期对象
      - setFullYear(2019) 年份
      - setMonth(6) 月份
      - setDate(17) 天数
      - setHours(12)  小时
      - setMinutes(32)  分钟
      - setSecondss(47) 秒钟
      - setMilliseconds(3000) 毫秒
  ```javascript
    时间差计算：
    var nowTime = new Date();                 //创建当前日期函数
    var newTime = new Date(2033,2,26,0,0,0);  //自定义创建一个新时间    
    var sjc = newTime - nowTime;              //获得当前日期到指定日期的时间差,结果是以ms为单位 
    var days = parseInt(sjc/(24*60*60*1000)); //计算天数
    sjc = sjc%(24*60*60*1000);                //获得计算完天数后还剩余的毫秒数	
    var hours = parseInt(sjc/(60*60*1000));   //计算小时	
    sjc = sjc%(60*60*1000);                   //获得计算完小时后还剩余的毫秒数	
    var minutes = parseInt(sjc/(60*1000));    //计算分钟	
    sjc = sjc%(60*1000);                      //计算分钟后还剩余的毫秒数
    var secondes = parseInt(sjc/1000);        //计算秒数
  ```
#### 函数
  1. 重载：多个同名的函数，不同形参列表，在调用时，可根据传入实参列表的不同，动态选择匹配的函数执行
  2. 闭包：即重用一个变量，又保护变量不被污染的一种编程方法；外层函数的作用域对象，被内层函数对象引用着，无法释放。
  3. new的原理
      - 创建一个新对象
      - 将构造函数的作用域，原型对象赋给新对象，使this指向新对象
      - 执行构造函数中的代码（为这个新对象添加属性）
      - 返回新对象
  4. 原型：
      - prototype叫做原型，本身就是一种对象，也是所有对象的祖先，每新建一个对象，就会有他自己的原型，所有对象都可以继承它的对象和属性
      - 当构造函数自己有的属性，就先调用自己对象的属性，自己没有的对象，才去调用原型的对象
      - 给原型添加新的属性并赋值：Student.prototype.say = function() {}
      - 实例化对象调用原型中的属性：student1.\_\_proto__.say()
      - 实例化的构造函数的__proto__指向构造函数的prototype
      - 构造函数的prototype指向Object的prototype
  5. 重写：在子对象中定义和父对象中成员完全相同的成员，来覆盖父对象中的成员
      - 只更换一个子对象的父对象：Object.setPrototypeOf(子对象,新父对象)
      - 同时换多个对象的父对象：构造函数.prototype = 新父对象（要在创建子对象之前就要换掉父对象）
  6. 严格模式
      - 禁止给未声明的变量赋值，否则会报错
      - 静默失败（执行不成功，也不报错）升级为报错
      - 普通函数调用和匿名函数自调用中的this不再默认指向window，而是指向undefined
      - 禁止使用arguments.callee（指函数运行时，专门获得当前正在执行的函数本身，即调用函数本身）
  7. apply、call、bind原理
      > 1. 三者是挂在Function对象上的三个方法，调用者必须是一个函数
      > 2. 当自己需要使用某个方法时，别人有该方法，就不需要自己单独写一个，可以直接借用别人的该方法
      - call：改变this的指向，指向call里的第一个参数
          - 方法：fn.call(要替换的this的对象,其他参数,...) 
          - 注：如果fn.call() 里面不传任何参数，那么该对象指向的就是全局window
          - 形参必须根据实参的个数传进去，且要按照顺序传值
          - 本质：借用别人的函数，实现自己的功能。前提是自己的需求必须完全涵盖别人的需求
      - apply：改变this的指向
          - 方法：fn.apply(要替换的this的对象,数组)
          - 本质和call差不多，call可以传多个参数，apply只能传一个，且是数组形式
      - bind：不调用函数，而是基于原函数，创建一个新函数副本，并永久替换新函数中的this为指定的对象
          - 方法
          >var 新函数 = 旧函数.bind(要替换的this的对象,[要绑定的实参值])
		      >调用方式： 新函数(实参值,...)
          - 结果
          >新函数的功能和旧函数的是完全一样的，但新函数中的this和开头部分形参已被永久替换为固定的对象和固定的参数值，今后调用新函数时，只要传入可能变化的剩余几个实参值即可
  8. call、apply、bind三者的区别
      - call和apply是临时绑定一次，临时替换一次this的指向，可以实现继承
      - bind是永久绑定，永久替换this的指向
      - call是传入的实参值，而apply传入的是数组
  9. call、apply、bind的异同点总结
  
  | 特性 | call | apply | bind |
  | --- | --- | --- | --- |
  | 方法参数 | 多个 | 单个数组 | 多个 |
  | 方法功能 | 函数调用改变this | 函数调用改变this | 函数调用改变this |
  | 返回结果 | 直接执行 | 直接执行 | 返回待执行函数 |
  | 底层实现 | 通过eval | 通过eval | 间接调用apply |

  10. this指向问题
  一、普通函数
  （1）默认情况下，全局直接调用，this指向window
  （2）严格模式下，全局直接调用，this指向undefined
  （3）谁调用了它，它就指向谁，如obj.fn()，fn的this就指向obj
  （4）当使用call，apply，bind绑定时，this指向绑定对象
  二、箭头函数
  （1）箭头函数的this被强行绑定到上下文中，由外层（函数或全局）作用域来决定
  （2）默认情况和严格模式下，全局直接调用，this都指向window
  三、匿名函数
  （1）匿名函数的this永远指向window，如setTimeout
  三、构造函数
  （1）通过 new 操作符来构建一个构造函数的实例对象，这个构造函数中的 this 就指向这个新的实例对象。同时构造函数 prototype 属性下面方法中的 this 也指向这个新的实例对象
  （2）如果构造函数中显式返回一个值，且返回的是一个对象，那么 this 就指向返回的对象，如果返回的不是一个对象，而是基本类型，那么 this 仍然指向实例





## DOM
#### 元素节点关系
1. 父子关系
    - 元素.parentElement  获得当前元素的父元素
    - 父元素.children 获得当前父元素下的所有直接子元素的集合
    - 父元素.firstElementChild  获得当前父元素下的第一个直接子元素
    - 父元素.lastElementChild 获得当前父元素下的最后一个直接子元素
2. 兄弟关系
    - 元素.previousElementSibling 获得当前元素的上一个相邻兄弟元素
    - 元素.nextElementSibling 获得当前元素的下一个相邻兄弟元素
3. nodeType属性
    - 值为1：表示该元素为一个标签节点
    - 值为3：表示该元素为一个纯文本节点

#### 操作DOM
1. 操作元素属性
    - 元素.attributes 获取当前元素上所有的属性（包含属性名和属性值）
    - 元素.getAttribute("属性名") 获取属性值
    - 元素.属性名（如：ele.title）  获取属性值
    - 元素.setAttribute("属性名","新值")  修改或添加属性值
    - 元素.属性名 = "值"（如：ele.href="xxx"）  修改或添加属性值
    - 元素.removeAttribute("属性名")  移除元素上的指定属性
    - 元素.属性名 = ""（如：ele.id=""） 移除元素上的指定属性
    - 元素.hasAttribute("属性名") 判断元素是否包含该属性
    - 元素.属性名 !== ""（如：ele.src !== ""）  判断元素上是否包含该属性，因为属性值默认为空字符串
    - 元素.classList.add("xxx") 添加某个样式名到class属性里
    - 元素.classList.remove("xxx")  移除class属性里的某个样式名
    - 元素.classList.toggle('xxx')  如果classList中存在给定的值，删除它，否则，添加它
    - 元素.classList.contains('xxx') 确定元素中是否包含指定的类名，返回值为true 、false
    - 元素.classList.replace('oldClassName','newClassName')  类名替换
2. 自定义扩展属性
    - <标签名 data-自定义属性名 = "属性值"> 为元素添加自定义扩展属性
    - document.querySelector("[data-type = d1]")  用自定义扩展属性作为查询条件
    - 元素.dataset.type 可以自动收集页面中所有以data- 开头的自定义扩展属性
3. 获取/修改样式
    - getComputedStyle(元素)  获得指定元素计算后的完整样式
    - style.属性  获取属性值
    - 元素.style.属性 = "xxx" 复合样式要写成驼峰式（如：margin-left 要写为 marginLeft）在操作float属性时，要写成 元素.style.cssFloat
    - 元素.style.cssText = "width:200px; height:100px"
    - 当批量修改样式时，在css里写一个样式，用className将该样式添加到元素上
4. 新增/替换
    - document.createElement("a") 创建一个新元素
    - 父元素.appendChild(新元素)  追加到一个父元素下的所有子元素的末尾
    - 父元素.insertBefore(新元素,旧元素)  插入到一个父元素下的某个子元素之前
    - 父元素.replaceChild(新元素,旧元素)  替换父元素下的一个现有的旧元素
5. 删除元素
    - 父元素.removeChild(子元素)  删除父元素里的某个子元素（删除之后还在内存里，可以随时调用）
    - 元素.remove() 删除某个元素（删除之后就没有了）
6. getBoundingClientRect()
  返回一个矩形对象，包含四个属性：left、top、right和buttom。分别表示元素各边与页面各边的距离（应用场景：鼠标移入元素，鼠标右上角就展示其他相关元素）
    - dom.getBoundingClientRect().top
    - dom.getBoundingClientRect().right
    - dom.getBoundingClientRect().bottom
    - dom.getBoundingClientRect().left

#### DOM优化
1. 查找
    - 如果只要一个条件就可以找到元素时，首选getElementByxxx这种方式
    - 如果查找条件复杂，就首选选择器查找方式
2. 修改样式
    - 修改多个CSS属性，能一句话修改的，就不用多句话
3. 添加元素
    - 为了减少DOM重排重绘，应该尽量减少操作DOM树的次数
    - 如果同时添加父元素和子元素，应该先将子元素添加到父元素，最后再将父元素一次性添加到DOM树上
    - 如果父元素已经在页面上，需要同时添加多个平级子元素时，应该临时创建文档片段对象，将子元素先加入到文档片段中，最后将文档片段对象整体一次性添加到DOM树上
4. 尽量减少事件监听的个数
    - 只要多个平级元素要绑定相同的事件时，都要用事件委托

#### BOM
1. history对象（保存当前窗口打开后，成功访问过的url的历史记录数组）
    - history.go(1) 前进一次
    - history.go(-1)  后退一次，有时后退一次不管用，就后退两次
    - history.go(0) 刷新页面
2. location对象（专门保存地址栏中的地址信息，以及提供跳转操作的方法）
    - location.href 获取完整的url
    - location.protocol 获取协议
    - location.host 主机名+端口号
    - location.hostname 获取主机名
    - location.port 获取端口号
    - location.pathname 获取文件的相对路径
    - location.search 获取?以及后面的查询字符串（常用于获取页面传值的数据）
    - location.hash #锚点地址
    - location.href = "链接"  在当前窗口打开新页面
    - location.reload() 普通刷新
    - location.reload(true) 强制刷新
3. 获取浏览器窗口的大小（包括浏览器的外边框阴影）
    - window.outerWidth
    - window.outerHeight
4. 获取文档显示区域大小（页面所展示的区域，包含滚动条）
    - window.innerWidth
    - window.innerHeight
5. 获取鼠标相对于浏览器文档显示区左上角的位置
    - e.clientX
    - e.clientY
6. 获取元素相对于左上角的位置
    - ele.offsetX
    - ele.offsetY
7. 获取元素实际的尺寸
    - ele.offsetWidth
    - ele.offsetHeight
8. 查看元素的位置（对于无定位父级的元素，返回的是相对整个页面的坐标;对于有定位父级的元素，返回的是相对于最近的有定位的父级的坐标）
    - ele.offsetLeft
    - ele.offsetTop

#### 事件
1. 绑定事件监听对象
    - 元素.addEventListener( "事件名",事件处理函数,false)	//第三个参数表示阻止冒泡
2. 移除事件监听对象
    - 元素.removeEventListener("事件名",原处理函数对象)
    - 元素.on事件名 = null
3. DOM事件模型
    - 捕获：由外向内，依次记录各级父元素上绑定的处理函数，只记录，不执行
    - 目标触发：先触发目标元素（最初想点击的那个元素）上的处理函数
    - 冒泡：由内向外，依次触发捕获阶段记录的各级父元素上的处理函数
4. 取消冒泡行为
    - e.stopPropagation()
5. 阻止默认行为
    - e.preventDefault()
6. 页面滚动事件
    - window.onscroll = function() { }  绑定页面滚动事件
    - document.body.scrollTop || document.documentElement.scrollTop 获得页面向上滚动的距离（也就是鼠标向下滑动的距离）
    - window.scrollTo(横向滚动到的位置，纵向滚动到的位置) 指定页面滚动到的位置
    - window.scrollBy(横向滚动的距离，纵向滚动的距离) 指定页面滚动的距离
    
    ```js
    // 单个元素滚动，判断是否触底
    function scrollEvent() {
      const box = document.getElementById("container");
      // 如果元素的可见高度 + 元素的滚动条的垂直位置 >= 元素内容高度，则触底
      if (box?.clientHeight + box?.scrollTop >= box?.scrollHeight) {
        ...
      }
    }

    // 监听网页滚动，判断是否触底
    window.onscroll = function () {
      const clientHeight = document.documentElement.clientHeight;// 网页可视区域高度
      const scrollTop = document.documentElement.scrollTop; // 滚动条垂直位置
      const offsetHeight = document.documentElement.offsetHeight;   // 网页高度
      if (clientHeight + scrollTop >= offsetHeight) {
        ...
      }
    }
    ```
    
7. 拖动和释放（drag & drop）
    一、拖动源对象（会动），触发三个事件
    - ondragstart 拖动开始（执行1次）
    - ondrag  拖动中（执行n次）
    - ondragend 拖动结束（执行1次）

    二、拖动目标对象（不动），触发四个事件
      - ondragenter 拖动进入（执行1次）
      - ondragover  拖动悬停（执行n次）
      ```javascript
      //注意：该事件有个默认行为，悬停事件结束后会立刻执行离开事件，永远也不会执行释放事件
      //解决：阻止事件默认行为
      demo.ondragover = function(e) {
        e.preventDefault(); //阻止事件默认行为
      }
      ```
      - ondragleave 拖动离开（执行1次）
      - ondrop  拖动释放（执行1次）

## 常见的web攻击
### XSS攻击（跨站脚本攻击）
定义：是一种代码注入攻击。攻击者通过在目标网站上注入恶意脚本，使之在用户的浏览器上运行。利用这些恶意脚本，攻击者可获取用户的敏感信息如 Cookie、SessionID 等，进而危害数据安全。
防范措施：
- 禁止加载外域代码，防止复杂的攻击逻辑
- 禁止外域提交，网站被攻击后，用户的数据不会泄露到外域
- 禁止内联脚本执行
- 禁止未授权的脚本执行

CSP：内容安全策略
> CSP是一个附加的安全层，用于帮助检查和缓解某些类型的攻击，包括xss和数据注入等攻击。
CSP本质上就是建立白名单，开发者明确告诉浏览器哪些资源可以被执行和加载，我们只需配置规则（后端配置），剩下的浏览器会自己实现。

黑名单转义字符：
> 将用户输入的引号，尖括号，斜杠等字符进行转义，能有效防止攻击。但对于富文本编辑器不实用，因为这样会把我们需要的字符给过滤掉。

白名单转义字符：
> 先将需要的字符排除掉，然后再将剩余的字符进行过滤，可以使用xss库进行操作。这样在富文本中就很实用

### CSRF（跨站请求伪造）
定义：是一种常见的web攻击，可在用户毫不知情的情况下，以用户的名义完成非法操作。

### clickjacking（点击劫持）
定义：是一种视觉欺骗的攻击手段，攻击者将需要攻击的网站通过iframe嵌套的方式嵌入自己的网页中，并将iframe设置为透明，在页面中透出一个按钮诱导用户点击。

## 防抖与节流
1. 防抖：多次执行一个函数，最终只执行一次
2. 节流：多次执行一个函数，但是能够把函数的执行限定在一个可以接受的时间范围


## ES6
#### 模块
1. CJS
    - 规范定义了模块应该怎样进行编写，从而各个模块系统之间可以进行相互操作
    - CommonJS规范用于运行时进行模块加载
    - 是同步的，适合后端
2. AMD
    - 主要为了解决异步加载模块而提出，通过define方式
    - 是异步的，适合前端
3. UMD
    - 通用模块定义模式用于兼容AMD和CommJS的规范
    - 随处可见，通常在ESM不起作用的情况下用作备用
4. ESM
    - 可以在编译阶段确定各个模块之间的依赖关系
    - 具有简单的语法，异步特性和可摇树性，因此它是最好的模块化方案

#### class
1. 每一种类型都由两部分组成：构造函数 + 原型对象
2. 构造函数：负责定义所有子对象统一的属性结构，并且负责创建子对象
3. 原型对象：负责保存所有子对象共有的成员和方法
4. ES5中的构造函数名提升为 class 名，所有构造函数从此统一更名为 constructor，类本身就指向构造函数，即Person === Person.prototype.constructor
5. 所有放在 class 中的函数，不需要加类型名.prototype 前缀，自动就是保存在构造函数的原型对象中
6. class 用法和以前的构造函数完全一样
7. 如果要使用静态static方法，就不要在该方法中使用this

#### Promise
1. promise的静态方法（里面都传数组，数组里都是要异步执行的操作）
    - Promise.all() 参数的所有返回结果为成功才返回
    - Promise.allSettled()  参数不论返回结果是否成功，都返回每个参数执行状态
    - Promise.any() 参数中只要有一个成功，就返回该成功的执行结果
    - Promise.race()  返回最先返回执行成功的参数的执行结果
2. 不足
    - 无法取消Promise,一旦新建它就会立即执行，无法中途取消。
    - 如果不设置回调函数，promise内部抛出的错误，不会反应到外部。
    - 当处于pending状态时，无法得知目前进展到哪一个阶段

#### async/await与Generator的区别
- async/await是Generator函数的语法糖
- Generator返回的是一个迭代器，而async/await返回的则是一个Promise对象，也就意味着可以使用then、 catch等方法
- Generator函数的执行依赖执行器。而async函数自带执行器，将 Generator 函数和自动执行器，包装在一个函数里，所以它不需要使用next方法来逐步控制函数的执行，和普通函数的调用是一致的

#### 事件循环（EventLoop）
1. 宏任务：script（整体代码块），定时器，计时器，I/O，UI渲染，事件监听等
2. 微任务：process.nextTick（nodejs），promise，Object.observe，MutationObserver等
3. 事件循环执行顺序：
    - js引擎先从宏任务队列中取出第一个任务
    - 执行完毕后，再将微任务中的所有任务取出，按照顺序分别全部执行，如果在这一步中产生新的微任务，也需要执行
    - 然后再从宏任务队列中取下一个，执行完毕后，再次将微任务中的全部取出，循环往复，直到两个任务队列都取完
4. 总结：一次事件循环会处理一个宏任务和所有这次循环中产生的微任务，微任务是先进先出原则

#### Map
1. 创建映射
```javascript
const m = new Map();
```
2. 添加键值对
```javascript
m.set('name','mike');
```
3. 查询键
```javascript
m.has('name');
m.get('name');
```
4. 获取映射中的键值对数量
```javascript
m.size
```
5. 删除键值对
```javascript
m.delete('name'); //删除指定键值对
m.clear();        //清除所有键值对
```
6. Map可以使用任何JavaScript数据类型作为键，对于内存占用、插入性能、删除性能而言，Map比Object更好；对于查找速度而言，Object比Map更好

#### WeakMap
1. “弱映射”（WeakMap）是一种新的集合类型，为这门语言带来了增强的键/值对存储机制；WeakMap 是 Map 的“兄弟”类型，其 API 也是 Map 的子集，操作与Map一样
2. 如果使用弱映射，那么垃圾回收程序在一定情况下会自动释放内存，但是Map不会


## 面向对象
#### 数据属性
数据属性包含一个数据值的位置，在这个位置可以读取和写入值，数据属性有4个描述其行为的特性
1. configurable：表示能否通过delete删除属性从而重新定义属性，能否修改属性的特性，或者能否把属性修改为访问器属性。默认为true
2. enumerable：表示能否通过for-in循环返回属性。默认为true
3. writable：表示能否修改属性的值。默认为true
4. value：包含这个属性的数据值，读取属性值的时候，从这个位置读；写入属性值的时候，把新值保存到这个位置。默认为undefined
5. 要修改/创建属性默认的特性，必须使用ES5的Object.defineProperty()方法。这个方法接收三个参数：属性所在的对象、属性的名字和一个描述符对象，其中，描述符对象的属性必须是以上4种值，设置其中的一个或多个值，可以修改对应的特性值（第三个参数以对象的形式进行操作）
例如：
```javascript
var person = {};
Object.defineProperty(person,'name',{
  configurable:false,
  value:'small_l'
});
```
注：一旦把configurable属性定义为不可配置的，就不能再把它变回可配置的了，此时只能调用writable特性，其他的都会报错；也就是说，可以调用多次Object.defineProperty()方法修改同一个属性，但在把configurable设置为false后就会有限制了，除非在原来的基础上进行修改。在调用Object.defineProperty()方法创建一个新的属性时，如果不指定以上4种特性，它们默认的值都是false

#### 访问器属性
访问器属性不包含数据值；他们包含一对getter和setter函数（这两个函数都不是必须的）
在读取访问器属性时，会调用getter函数，该函数负责返回有效的值；在写入访问器属性时，会调用setter函数，并传入新值，该函数负责决定如何处理数据，访问器属性有4个特性
1. configurable：表示能否通过delete删除属性从而重新定义属性，能否修改属性的特性，或者能否把属性修改为数据属性。默认值为true
2. enumerable：表示能否通过for-in循环返回属性，对于直接在对象上定义的属性，该特性默认为true
3. get：在读取属性时调动的函数，默认为undefined
4. set：在写入属性时调用的函数，默认为undefined
例如：
```javascript
Object.defineProperty(book, 'year', {
  get: function () {
    return this._year
  },
  set: function (newVal) {
    if (newVal != this._year) {
      this._year = newVal;
      this.num++;
    }
  }
})
```
由于为对象定义多个属性的可能性很大，ES5又定义了一个Object.defineProperties()方法，利用该方法可以通过描述符一次定义多个属性
例如：
```javascript
var book = {};
Object.defineProperties(book,{
  _year: {
    writable: true,
    value : 2004
  },
  
  num: {
    writable: true,
    value: 1
  },
  
  year: {
    get: function() {
      return this._year
    },
    
    set: function(newVal) {
      if(newVal != this._year) {
        this._year = newVal;
        this.num ++;
      }
    }
  }
})
```

## 移动端
#### 事件
1. touchstart 手指点下屏幕
2. touchmove  手指点下后，在屏幕中移动
3. touchend 手指点下后，在屏幕中抬起

#### 鼠标事件在移动端的延迟
定义：当触碰一个元素时，会立即执行该元素身上的touch事件，然后记录手指触碰的坐标点，再延迟300ms左右后，在该坐标点去找元素，查看该元素上是否有鼠标事件，有的话就执行（如果之前点击的元素隐藏了，那么就会触发到当前坐标点上的其他元素身上）
解决方案：
  1. 给touch事件添加延迟操作
  2. 在移动端不使用鼠标touch事件
  3. 在touch事件中阻止默认事件，e.preventDefault()

阻止默认事件后的危害：
  1. touchstart：滚动条不能滚动，不能双指缩放页面，输入框不能输入，鼠标事件失效，长按不能启动系统菜单
  2. touchmove：滚动条不能滚动，不能双指缩放页面
  3. 总结：在移动端最好不要阻止默认事件，或者不要使用touch事件

touch事件对象e：
  1. e.touches：当前屏幕上的手指列表
  2. e.targetTouches：当前元素上的手指列表
  3. e.changedTouches：触发当前事件的手指列表

获取手机的横竖屏状态：window.orientation
  1. 横屏值：90 或 -90
  2. 竖屏值：0 或 180

监听手机横竖朝向事件：orientationchange
  ```javascript
  window.addEvnetListener('orientationchange',function () {...})
  ```

监听手机的加速度发生变化：devicemotion
1. 在ios 11后，要想使用重力加速度，陀螺仪相关功能，必须是在https协议下，才能使用
2. 安卓机和ios的相关方向值是相反的，所以要做相关取反适配
  
  ```javascript
  //手机加速度检测事件
  window.addEvnetListener('devicemotion',function (e) {
    let {acceleration} = e;     //从事件对象中结构出加速度
    let {x,y,z} = acceleration; //手机目前加速度的三个方向的值
  })

  //手机重力加速度检测事件
  window.addEvnetListener('devicemotion',function (e) {
    let {accelerationIncludingGravity} = e;     //从事件对象中结构出重力加速度
    let {x,y,z} = accelerationIncludingGravity; //手机目前重力加速度的三个方向的值
  })
  ```

## Ajax
1. 创建异步对象
```javascript
var xhr = new XMLHttpRequest();
```
2. 创建异步对象
```javascript
xhr.open("get",`http://127.0.0.1?id=${xxx}`,true)
xhr.open('post','http://127.0.0.1',true)
```
3. 发送请求
```javascript
xhr.send();

//如果是post请求方式
xhr.setRequestHeader('content-type','application/json');
let data = JSON.stringify({
  username : 'xxx',
  age:20
})
xhr.send(data);
```
4. 绑定监听，接收响应数据
    - xhr.readyState：用于表示xhr对象的请求状态，值表示5个状态
        - 0：请求尚未初始化
        - 1：打开服务器连接，正在发送请求
        - 2：接收响应头
        - 3：接收响应主体
        - 4：响应接收完毕
    - 绑定监听，接收响应
    ```javascript
     xhr.onload = function () {
      //进入onload之后，只出现了状态码4。也就是说，只有处于状态码4，请求已完成
      //接收响应
      var result = xhr.responseText;
    }
    ```
5. 监控上传进度的钩子
    - onloadstart 上传开始
    - onprogress  数据传输进行中
    ```javascript
      xhr.upload.onprogress = function(evt) {
        evt.loaded  //当前文件正在上传的大小
        evt.total   //需要上传文件的总大小
        const res = (evt.loaded/evt.total*100).toFixed(0);  //上传百分比
      }
    ```
    - onabort 上传操作终止
    - onerror 上传失败
    - onload  上传成功
    - onloadend 上传完成（不论成功与否）


## 跨域
定义：一个网站下的网页，请求/使用了另一个地址的资源
跨域请求包括：
1. 域名不同
2. 二级域名不同
3. 端口不同
4. 协议不同
5. 相同端口和协议，IP和域名之间互访，也算跨域（如：localhost:3000	和 127.0.0.1:3000）

解决方式：
1. CORS：只需要服务端在返回数据时，在响应头中伪造来源地址，和客户端浏览器地址中的地址保持一致
2. JSONP
- 声明一个函数，函数形参就是要获得的目标数据；
- 创建一个script标签，把跨域的API数据接口地址给script的src，还要带上声明的函数名；
- 需要服务端的配合，把请求的数据返回给客户端；客户端调用声明的这个函数，获得返回的数据；
- 操作完以后可以删除该script标签
3. proyx代理
4. nginx反向代理
5. websocket
6. windows.postMessage()
7. iframe

## HTTP协议
通用头信息
1. Request URL：请求的URL，对应浏览器地址栏；向服务器获取相关内容
2. Request Method：请求的方法，获取内容的方法（get/post）
3. Status Code：响应状态码
    - 1xx：正在请求，提示信息
    - 2xx：如200，表示响应成功
    - 3xx：如301，表示永久重定向；302表示临时重定向；304表示请求未改变，命中缓存
    - 4xx：如404，表示请求资源不存在；403，表示权限不够，405，表示请求方法不被允许
    - 5xx：如500，服务器代码出错
4. Remote Address：请求的服务器IP地址以及端口号

响应头信息
1. Connection 连接方式，keep-alive 表示开启持久链接
2. Content-Encoding 内容压缩格式，如：gzip
3. Content-Type 响应的文件类型
4. Location 跳转的URL，常配合状态码3xx使用

HTTP性能优化
1. 减少连接创建的次数（开启持久连接）
2. 减少请求的次数（代码设计更合理）
3. 提高服务器端运行的速度
4. 尽可能减少响应数据的长度

客户端发起请求阶段
1. 用户在浏览器输入URL经过本地缓存确认是否已经存在这个网站
2. 如果没有，接着会由DNS查询从域名服务器获取这个IP地址
3. 客户端通过TCP的三次握手和TLS协商向服务器发起HTTP请求建立连接的过程

性能瓶颈点
1. 本地缓存
    - 强缓存：是指在浏览器加载资源时，根据请求头的expires和cache-control判断是否命中客户端缓存，如果命中就直接从缓存中获取资源，否则就走完整的请求逻辑
    - 协商缓存：是指浏览器会先发送一个请求到服务器，通过last-modified和etag验证资源是否命中客户端缓存，都需要从服务器中获取资源
2. DNS查询：节省DNS查询时间就是让DNS查询走缓存，可以在打开浏览器或者webview的同时就进行配置

3. HTTP请求
    - 最大瓶颈点就是请求阻塞，请求阻塞就是浏览器为保证访问速度，会默认对同一域名下的资源保持一定的连接数，请求过多就会进行阻塞
    - 浏览器的同域名的最多连接数一般是6个并发
    - 域名散列：通过不同的域名，增加请求并行连接数

## axios cache前端数据缓存
> 思路：这里我们使用axios进行接口的请求，我们要用到axios的两个功能--拦截器和cancleToken。首先我们要使用拦截器，去拦截要发送的请求，然后对比我们本地缓存池，看是否有在缓存池中存在，如果存在，则使用cancleToken直接取消请求，并从缓存池从返回数据，如果不存在则正常请求，并在响应拦截器中将该条请求存入缓存池中。当然，我们还需要一个过期时间，如果过期，则重新请求，更新缓存池的数据，避免一直在缓存池中取老数据。


## web worker
作用：创建新线程去帮助其他主线程完成相应的任务
```javascript
//创建方式
let w = new Worker("js任务路径"); //创建并自动执行传入的js任务
```
worker程序实现数据传递
1. html主线程将数据发送给worker（js任务）线程
2. worker（js任务）线程将数据发送给html主线程
```javascript
//html发数据
let w = new Worker("js任务路径");
w.postMessage("要发送的东西");

//worker收数据
onmessage = function(e) {
  e.data; //接收到的数据
}

// 注意事项：
// （1）worker线程执行代码中不能包含任何DOM/BOM元素
// （2）操作网页中DOM/BOM只能交给html主线程
// （3）其他线程不能操作DOM/BOM
```

## websocket制作聊天室
一、下载第三方模块
1. 服务端：npm i socket.io
2. 客户端：需要单独下载socket.io文件

二、服务器端程序
```javascript
//创建web服务器
let app = require("http").createServer();

//创建socketio服务器端对象
let io = require("socket.io")(app); //io模块依赖于app模块

//监听端口
app.listen(3000); //端口可以自定义，只要不重复

//为io对象绑定事件 connection（当客户端连接服务器触发此事件）
io.on("connection",(socket) => {
  console.log("有客户端连接到了服务器");
  //socket 是为当前客户创建的专属“服务员”，可以获得当前客户端的相关连接信息
})
```

三、客户端程序
```javascript
//创建socket对象并且连接服务器
let clientSocket = io("ws://127.0.0.1:3000");
//ws：websocket的简写
//127.0.0.1：服务器端程序的地址
//3000：服务器运行的端口，这里是根据服务端设置的端口来写
```

四、客户端发送数据给服务器（一对一）
```javascript
//socket.io 发送与接收数据采用事件绑定方式与事件触发机制
//客户端发送
clientSocket.emit("message","要发送的消息"); //emit为触发事件的方式， message为自定义事件名，要与服务端接收时保持一致

//服务端接收
socket.on("message",(data) => {
  console.log(data);  //data为客户端发送过来的数据
})
```

五、服务器发送数据给客户端（一对一）
```javascript
//服务器发送
socket.emit("server","要发送的消息")  //server为自定义事件名，要与客户端保持一致

//客户端接收
clientSocket.on("server",(data) => {
  console.log(data);  //data为服务端发送过来的数据
})
```

六、服务器向所有客户端发送消息（广播消息）
```javascript
//服务器发送
io.emit("list","要广播的消息")

//客户端接收
clientSocket.on("list",(data) => {
  console.log(data);  //data为服务端发送过来的数据
});
```

七、客服端关闭浏览器时，会触发服务器默认事件（disconnect）
```javascript
socket.on("disconnect",(data) => {
  console.log("客户已退出群聊");
})
```

## 浏览器的渲染流程及原理
### 流程：
js（操作元素） -> style（改变样式） -> layout（布局/回流） -> paint（进行绘制） -> composite（复合图层，将不同的东西绘制在不同的图层上，提高效率，最后再合成在一起）

### 原理：

1. 浏览器将拿到的html文件，生成标签节点树，用于描述文档对象模型的结构
2. 解析css文件，根据选择器以及样式属性与对应的节点进行关联，生成css树
3. 将两个树进行合并，生成一个渲染树，将需要的东西进行渲染，不需要的东西去掉（树摇treeshaking操作）


## 重绘回流
### 回流：
1. 添加/删除元素
2. 操作styles
3. display:none
4. 获取元素的所在位置，高度等
5. 移动元素位置
6. 改变浏览器大小，字体大小

### 重绘：
1. 改变颜色，背景颜色、阴影等操作

### 减少重绘回流的操作：
1. 可以使用translate的方式去改变元素位置等，用transform去改变样式等，这就不会去进行布局与绘制的步骤，直接走复合的步骤，将该元素拆成一个单独的图层，改变的同时不会影响其他图层
2. 读写分离，使用一些插件进行更新操作（如：FastDOM）



