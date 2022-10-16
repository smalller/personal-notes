[toc]
## 音视频
音视频兼容写法：(浏览器会逐一查看视频格式，如果都不支持，就会显示最下面的内容)
```html
<video controls loop id="vid">
  <source src="video.mp4">
  <source src="video.ogg">
  <source src="video.webm">
  您的浏览器版本太低，请升级。
</video>
```

#### 常用属性
- controls  一些播放控件，如快进，暂停等
- loop  循环播放
- muted 音视频为静音
- poster="" 给视频添加封面（通常用作广告）
- autoplay  自动播放属性
- preload 预加载策略（三个属性值）
  - none  不预加载任何数据
  - metadata  只预加载元数据（视频时长/视频第一个画面/视频高度和宽度）
  - auto  加载元数据并且加载一定时长视频（默认值）

#### JS的相关属性与方法（操作多媒体专用）
```javascript
vid.play(); //播放视频
vid.pause();  //暂停视频

vid.paused; //获取当前视频播放状态（true表示视频暂停，false表示视频正在播放）
vid.playbackRate = 2; //回放速率（整数：大于1就快放；小于1就慢放）

vid.currentTime;  //获取当前播放到的时间，单位S
vid.currentTime += 5; //快进
vid.currentTime  -= 5;  //快退

vid.muted;  //获取视频是否静音，是为ture，否为false
vid.muted = !vid.muted; //点一下就静音，再点一下就非静音

vid.volume; //获取当前视频音量，音量最高为1，最低为0
vid.volume += 0.1;  //加音量
vid.volume -= 0.1;  //减音量

vid.onplay; //获取当前视频是否正在播放
v.duraion;  //获取视频的总长度

//实现进度条效果：（首先要自己写一个进度条样式）
v.onplay = function() {
  setInterval(function() {
    var ctime = v.currentTime;  //获取当前的播放位置
    var alltime = v.duraion;  //获取视频的总长度
    var lsl = ctime/alltime*300;  //当前进度条的位置 = 当前播放位置 / 视频的总长度 * 进度条的总宽度
    ls.style.width = lsl + "px";  //再把当前进度条的位置赋给ls进度条，这样就能实现进度条效果
  },1000); 
}

//实现点击进度条的位置，视频就跳转到该位置：
pro.onclick = function(e) { //鼠标点击进度条触发的事件
  var ev = window.event || e; //获取事件对象
  var mx = ev.layerX || offseX; //获取当前鼠标点击时的X轴位置
  var ctime = mx/600*v.duraion; //计算当前视频播放的位置
  v.currentTime = ctime;  //设置视频播放的时间
  ls.style.width = mx + "px"; //将当前鼠标的位置赋给进度条，这样鼠标点哪儿，进度条也会在哪儿
}
```

#### video相关的样式
object-fit：指定视频在区域内如何显示
1. fit：填充（默认值），将视频拉伸操作填充满整个父元素
2. contain：包含，保持原有视频比例，父元素会有空白区域
3. conver：覆盖，保持原有视频比例，宽度或高度至少有一个与父元素一致


## canvas
绘制矩形的方法
  - fillRect(x, y, width, height) 绘制一个填充的矩形
  - strokeRect(x, y, width, height) 绘制一个矩形的边框
  - clearRect(x, y, width, height)  清除指定矩形区域，让清除部分完全透明
