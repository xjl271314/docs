# H5直播Video在实际开发过程中爬的坑

- 2020.05.26


## video的一些问题

`HTML5`的`video`已经出来很久了。在`ios`上使用基本上没什么毛病，但是安卓下就是一个重灾区了，各种体验差,特别是微信环境下。


### 常用的一些属性和方法

```js
video.error // null正常
video.error.code // 1用户终止 2网络错误 3解码错误 4URL无效
video.currentTime // 当前播放的位置，赋值可改变位置
video.duration // 当前资源长度，流返回无限
video.paused // 是否暂停
video.ended // 是否结束
video.autoPlay // 是否自动播放
loadstart // 客户端开始请求数据
error // 请求数据时遇到错误（可以通过上一页的属性video.error.code查看具体错误原因）
play // 开始播放时触发
pause // 暂停时触发
loadeddata // 数据已加载
waiting // 等待数据，并非错误
playing // play触发后执行一次
canplaythrough // 可以播放，已加载好
timeupdate // 播放时间改变
durationchange // 资源长度改变
...
```

### 自动播放的问题

```
x5-video-player-type = "h5-page"
```
控制网页内部同层播放，可以在视频上方显示`html元素`。

- 在ios上会自动全屏播放，需要在`video`标签上设置一个属性 `webkit-playsinline`，ios10及以上版本属性名改成 `playsinline`,因此这两个属性可以都加上。

- 在安卓上，无法自动播放，必须手动触发视频的播放。调用任何方法都没用，据说这个为了帮用户省流量而设定的。但是安卓在首次触发之后，再次触发可以通过调用 `play()方法` 来触发播放视频。因此做兼容的时候可以设一个判断是否首次播放的标志来处理。


### 默认样式

安卓下，不能自动播放，因此视频在播放前会带有视频的默认白色加圆圈播放按钮且背景是纯黑色，可以说是非常丑陋了。为了好点的用户体验就是可以在视频的最上层覆盖一张引导用户点击播放视频的引导图，这样既不丑陋又让用户知道这里需要点一下才有东西出现。

我的做法是增加一个手指引导图，然后让该元素可穿透(即设置 `pointer-events:none;` 让其不会成为任何鼠标事件的target)，这样点击元素的时候就相当于点击了视频播放。然后监听 `playing` 事件，如果视频开始播放了则把引导图隐藏。具体如下：

```html
<div class="entry_video" id="entry_video">
  <video class="entry_video_con" id="video" webkit-playsinline playsinline src="//wq.360buyimg.com/fd/h5/1707/entryvideo/images/meirenyu_7f7e46da.mp4" autoplay="true"></video>
  <div class="guide" style="width: 100%;height: 100%;top: 0;left:0;position: absolute;pointer-events:none;">
    <img src="//img11.360buyimg.com/jdphoto/s750x1334_jfs/t5668/219/7883436652/42409/2a1e4cc0/5976a71bN212dfa7b.png" alt="" style="width:100%;height:100%;pointer-events:none;">
  </div>
</div>

<script>
    vi.addEventListener('playing',function(){
        $('.guide').hide();
    })
</script>
```

### 全屏播放

若页面中没有其他内容，只是播放一个视频的话，这个问题很好处理。设置`webkit-playsinline`，如果是在X5内核浏览器的话，设置 `x5-video-player-type="h5" x5-video-player-fullscreen="true"`。

那么问题来了，如果页面上不只有视频，还有其他内容呢，例如视频是在一个弹出层中。这样设置的话，页面原有内容会有一个1s左右的非常明显拉伸过程，这个拉伸过程就是为全屏播放视频做准备的。

但是这样的体验可以说是非常糟糕了。于是这种情况下，必须舍弃设置全屏播放了，但是在X5浏览器非全屏播放模式下，安卓会在视频页面右上角自动生成一个全屏按钮，这个怎么都去不掉。若用户点击了进入全屏模式，视频播放完毕并不会停留在视频最后一帧，而是出现腾讯的一些视频推送，你懂的。这个时候退出了全屏播放的话，视频会自动隐藏，所以最好做一张视频底图，不然就尴尬了。

### x5下检测全屏

```js
vi.addEventListener("x5videoenterfullscreen", function(){
     //进入全屏  
});  
vi.addEventListener("x5videoexitfullscreen", function(){                          
     //退出全屏 
});
```

用 `video.addEventListener("x5videoexitfullscreen", function(){….})`; 可以检测到视频什么时候退出了全屏，但是若在这个监听到退出之后隐藏整个视频，则再次触发播放视频事件失效。且在这个监听中直接调用 `.play` 方法并不能使视频重新播放。也就是说在检测过程中不能对视频进行一些隐藏，删除的操作。可以说，这检测也没什么意义了。

### 诡异的坑

安卓下，若是摇一摇在弹出层播放视频，若弹出层中有外链，点击了跳转，再返回，这个时候 video 会有一个诡异的bug，具体表现为返回后第一次能正常触发，第二次之后触发都直接播到视频最后一帧，设置 `currentTime`、`start` 为0再播放，或者先 pause 再 play 都没有用，必须销毁重建。

### 区分设备

由于video在ios下表现良好，所以做兼容的时候，可以通过 `userAgent` 来做分别做处理。如：

```js
var vi = document.getElementsByTagName('video')[0];
var ua = navigator.userAgent;
if(ua.indexOf('iPhone') <= -1){
   shakeWrap.show();
   if(!firstVideoLoad){
      vi.currentTime = 0;
      vi.start = 0;
      vi.play();
   }
   vi.addEventListener('playing',function(){
       firstVideoLoad = false;
       $('.guide').hide();
   })         
 }else{
      vi.play();
 }
}
```

### 微信固定入口的一些奇特bug

1. 必须要等到微信的`jsbridge ready`了才能触发`play()`，否则不会自动执行,且只支持ios端的自动播放。

```js
if (os.ua.ios && os.device == 'wechat') {
    const { wx } = window;
    wx && wx.ready && wx.ready(() => {
        wx.getNetworkType({
             success: () => {
                play();
             },
        });
    });
}
```

2. 在固定入口内，且 `jsbridge ready `了，如果使用`摇一摇`，也无法触发 `play()`。需要在摇一摇之前预先加载如下:

```js
document.addEventListener("WeixinJSBridgeReady", function() {
  var vi = document.getElementsByTagName('video')[0];
  vi.load(); 
  vi.pause(); 
  window.addEventListener('devicemotion', deviceMotionHandler, false);
});
```

3. 微信固定入口在没有使用`jsbridge`，而是通过点击来播放的点击事件，只能是`click`事件，不能是`touchstart`事件。


## video在手机百度上遇到的的播放问题


在微信环境及其他X5内核的浏览器内,设置视频行内播放,全屏播放等都可以通过以下方式进行配置,但是这个配置在百度小程序和手机百度app上被流氓失效了。

```html
<video 
  controls
  width="100%"
  preload="auto"
  x5-video-player-type="h5"
  webkit-playsinline="true"
  playsinline="true"
  x5-playsinline="true">
  <source src="www.otherserver.mp4" type="video/mp4">
</video>
```

在手机百度app里面，会存在视频层级最高，遮挡导航栏的情况。`x5-video-player-type="h5"`这个属性解决不了。如何页面上底部存在着一些类似tab的导航栏或者是底部按钮的话,就会被遮挡住。

### 安卓

安卓手机百度中，视频只要播放，会被手百接管，此时层级最高。如果视频上面还有层级，比如弹出层，千万不要自动播放视频。

万幸的是安卓手百，`video`能操作位置，所以给出了一种处理思路，特定的时候可以调整位置，或者隐藏，假装不遮挡。比如当点击导航栏图标，导航跳出来的时候，视频跟着下移，这样视频就不会遮住导航栏

### ios

ios手百，video只要一播放，视频就被被手百接管，此时无论对视频进行移动，隐藏，删除都无效。
无意间发现，貌似是`<source src="www.otherserver.mp4" type="video/mp4">`以及`video.js`引起的需要将跨域域名改成不跨域的，然后不要用`video.js`，改用原生写。

```html
// 去掉video.js
<source src="./1.mp4" type="video/mp4">
```