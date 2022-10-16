[toc]
## self.js文件使用方式
页面稿以375px为基准，用图上的像素值/页面上html元素的font-size值（页面需以375px为准），如：180px / 23.4375px，结果的单位为rem

## css权重计算
css会对每个选择器使用三个数(x,y,z)来表示对应的权重值
- x：id选择器的数量
- y：类选择器、伪类选择器、属性选择器的数量
- z：元素选择器、伪元素选择器的数量

再对每个选择器的x,y,z三个值一一进行对比
1. x中谁值最大，谁就权重最大，然后就直接退出对比
2. 如果x都相同，那么就对y进行对比，y中谁值最大，谁就权重最大，然后直接退出对比
3. 如果y都相同，同理就对z进行对比，z中谁值最大，谁就权重最大

## css盒模型
CSS 盒模型本质上是一个盒子，它包括：padding、margin、border、content。
CSS 中的盒子模型包括 IE 盒子模型和标准的 W3C 盒子模型。
- 标准的盒子模型的width：指content部分的宽度。
- IE盒子模型的width：指content + padding + border这三个部分的宽度。

## 解决外边距叠加（外边距溢出）
父子元素外边距叠加问题：在父元素上添加下面的方法，触发BFC（Block Formatting Context），即块级格式化上下文解决方案
1. position:absolute;
2. display:inline-block;
3. float:left/right;
4. overflow:hidden;
5. 添加垂直方向上的padding
6. 添加border
7. 在子元素与父元素之间添加一个空的\<table>\</table>
8. 给父元素使用伪元素
```css
div::before {
  display:table;
  content:"";
}
```

## 处理溢出文字
单行文本：
```css
white-space:nowrap;
overflow:hidden;
text-overflow:ellipsis;
```
多行文本：
```css
display: -webkit-box;
overflow: hidden;
text-overflow: ellipsis;
-webkit-line-clamp: 4;
-webkit-box-orient: vertical;
```

处理一行文字还没占满就自动换行：
```css
word-break: break-all;
```

## 用border写三角形
```css
div {
  width:0;
  border:50px solid transparent;
  border-top:50px solid #999;
}
```

## 拖拽时其他元素不会被选中
```css
user-select: none
```

## visibility
取值：
1. visible	默认值，可见的
2. hidden		隐藏

visibility和display的区别：display会脱离文档流，后续元素上前补位；visibility不脱离文档流，虽然看不到，但是还占位置

## 弹性盒模型
#### 主轴方向（flex-direction）
1. row  默认值  主轴是x轴，主轴起点在左端
2. row-reverse  主轴是x轴，主轴起点在右端
3. column 主轴是y轴，主轴起点在顶部
4. column-reverse 主轴是y轴，主轴起点在底部

#### 项目换行（flex-wrap）
1. nowrap 默认值  空间不够时，不换行，项目会自动缩小，设置的宽度会无效
2. wrap 空间不够时，项目不缩小，换行
3. wrap-reverse 项目换行，并转换主轴的起点

#### 项目在主轴上的对齐方式（justify-content）
1. flex-start 默认值  以主轴起点对齐
2. flex-end 以主轴终点对齐
3. center 以主轴中心对齐
4. space-around 让每个项目的外边距相同，两端会有空白
5. space-between  让每个项目两端对齐，两端无空白

#### 项目在交叉轴上的对齐方式（align-items）
1. flex-start 默认值  以交叉轴起点对齐
2. flex-end 以交叉轴终点对齐
3. center 以交叉轴中心对齐
4. baseline 基线，同flex-start类似
5. stretch  当项目不写高时，项目就充满容器的整个高度

#### 项目换行后在交叉轴上的对齐方式（align-content）
1. flex-start  默认值  以交叉轴的起点对齐
2. flex-end 以交叉轴的终点对齐
3. center 以交叉轴的中心对齐
4. space-around 让每个项目的外边距相同，上下两端会有空白
5. space-between  让每个项目上下两端对齐，两端无空白
6. stretch  当项目不写高时，项目就充满容器的整个高度

### 	单个项目的相关属性（设置在项目中的属性，只会影响当前的项目，不影响其他项目）
#### 定义某一个项目的项目顺序（order）
取值：无单位的数字
order 定义项目排列的顺序，值越小，越靠近起点，默认值为0，如：order:3

#### 定义某一个项目在主轴上的放大比例（flex-grow）
取值：无单位的数字，默认值为0，取值越大，放大越快；如果容器有足够大的剩余空间，项目将按比例放大（比例不准确）

#### 定义某一个项目在主轴上的缩小比例（flex-shrink）
取值：无单位的数字，默认值为1，取值越大，缩小越快；如果容器空间不够，项目将按比例缩小（比例不准确）

#### 定义某一个项目在交叉轴上的对齐方式（align-self）
1. flex-star  默认值  以交叉轴起点对齐
2. flex-end 以交叉轴重点对齐
3. center 以交叉轴中心对齐
4. baseline 基线，同flex-start类似
5. stretch  当项目不写高时，项目就充满容器的整个高度
6. auto 使用align-items定义的值

#### 目标伪类
在锚点被激活时，让锚点元素应用相关样式
如：div:target { }	当div被点击时，执行相关操作

#### 状态伪类
1. :disabled  对被禁用的表单元素进行相关操作
2. :checked 对被选中的表单元素（checkbox）进行相关操作
2. :selected  对被选中的表单元素（select）进行相关操作

## 动画（animation）
#### 使用关键帧定义动画
```css
@keyframes  animationName {
  0% { }
  ...
  100% { }
}
```

#### 调用动画
animation:动画名  持续时长  时间曲线函数  动画延迟

#### 动画的播放次数（animation-iteration-count）
取值：
1. 具体的播放次数
2. infinite 无限次播放

#### 动画的播放顺序（animation-direction）
取值：
1. normal  默认值  0%~100%
2. reverse 100%~0%
3. alternate 轮流播放，奇数次正向，偶数次逆向

#### 动画在播放前后的显示状态（animation-fill-mode）
取值：
1. backwards  动画播放之前的延迟时间内，显示动画的第一帧
2. forwards 动画播放结束之后，停留在最后一帧
3. both 1和2的合体

#### 动画的播放与暂停（animation-play-state）
取值：
1. running	播放
2. paused	暂停

#### css优化原则
1. 尽量减少http的请求个数
2. 在页面的顶部引入css文件
3. 将css和js写在外部单独的文件中
4. 合并样式属性（能写群组，就不单写，能用简写，就不单独定义属性）
5. 缩小样式文件的大小（能重用的尽量重用，减少样式重写）
6. 避免出现空的href和src
7. 代码压缩

## 响应式布局
1. 视口（项目要在移动端运行，需要设置视口）：
  ``` css
  <meta name="viewport" content="width=device-width, initial-scale=1">
    width=device-width //设置视口宽度等于设备宽度
    initial-scale=1 //设置视口宽度初始不能被缩放
  ```
2. 所有的内容/文字/图片都尽量使用相对尺寸，少使用绝对值
3. 媒体查询（css3 Media Query）做响应式的必备技术，根据浏览网页的设备不同，有选择的执行一部分css样式，忽略其他css样式
  ```css
  @media screen and (min-width:992px) { } //屏幕尺寸大于992px的写法
  @media screen and (min-width:768px) and (max-width:991px) { } //屏幕尺寸大于768px小于991px的写法
  @media screen and (max-width:767px) { } //屏幕尺寸小于767px的写法

  常见尺寸：1440px,1024px,600px
  ```
