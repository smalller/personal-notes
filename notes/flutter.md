### Text组件
textAlign：文本对齐方式
- 如：TextAlign.center

maxLines：设置最多显示的行数
- 如：maxLines:1

overflow：文本溢出处理方式
- 如：TextOverflow.ellipsis

style：设定样式
```js
style:TextStyle(
    fontSize: 25.0,
    color: Color.fromARGB(255, 255, 150, 150),
),
```


### Container
容器，相当于html里的div

alignment：Container内child的对齐方式，也就是容器子内容的对齐方式
- 如：Alignment.center

padding：内边距，方向为左上右下
- padding: const EdgeInsets.all(100.0)  表示上右下左的内边距均为100
- padding: const EdgeInsets.fromLTRB(10.0, 30.0, 0.0, 0.0)  LTRB表示左上右下的顺序

margin：外边距，同内边距一样

decoration：是 container 的修饰器，主要的功能是设置背景和边框
> 比如你需要给背景加入一个渐变，这时候需要使用BoxDecoration这个类，代码如下（需要注意的是如果你设置了decoration，就不要再设置color属性了，因为这样会冲突）。

例如：
```js
decoration:new BoxDecoration(
  gradient:const LinearGradient(
    colors:[Colors.lightBlue,Colors.greenAccent,Colors.purple]
  ),  //设置背景色渐变
  border:Border.all(width:2.0,color:Colors.red),  //设置边框
)
```

### Image组件
引入图片的四种方式
- Image.asset：就是加载项目资源目录中的图片，相对路径。
- Image.network：网络资源图片，http协议的。
- Image.file：加载本地图片，就是加载本地文件中的图片，这个是一个绝对路径。
- Image.memory：加载Uint8List资源图片。

fit属性：可以控制图片的拉伸和挤压，这些都是根据图片的父级容器来的。
- BoxFit.fill：全图显示，图片会被拉伸，并充满父容器。
- BoxFit.contain：全图显示，显示原比例，可能会有空隙。
- BoxFit.cover：显示可能拉伸，可能裁切，充满（图片要充满整个容器，还不变形）。
- BoxFit.fitWidth：宽度充满（横向充满），显示可能拉伸，可能裁切。
- BoxFit.fitHeight：高度充满（竖向充满）,显示可能拉伸，可能裁切。
- BoxFit.scaleDown：效果和contain差不多，但是此属性不允许显示超过源图片大小，可小不可大。

图片的混合模式：colorBlendMode和color属性配合使用，能让图片改变颜色
例如：
```js
color: Colors.greenAccent,  //是要混合的颜色，如果你只设置color是没有意义的
colorBlendMode: BlendMode.darken, //是混合模式，相当于我们如何混合
```

repeat：图片重复
- ImageRepeat.repeat : 横向和纵向都进行重复，直到铺满整个画布。
- ImageRepeat.repeatX: 横向重复，纵向不重复。
- ImageRepeat.repeatY：纵向重复，横向不重复。

  