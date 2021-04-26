# H5 直播 Video 在实际开发过程中爬的坑

- 2020.05.26

## video 的一些问题

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

- 在 ios 上会自动全屏播放，需要在`video`标签上设置一个属性 `webkit-playsinline`，ios10 及以上版本属性名改成 `playsinline`,因此这两个属性可以都加上。

- 在安卓上，无法自动播放，必须手动触发视频的播放。调用任何方法都没用，据说这个为了帮用户省流量而设定的。但是安卓在首次触发之后，再次触发可以通过调用 `play()方法` 来触发播放视频。因此做兼容的时候可以设一个判断是否首次播放的标志来处理。

- PC 设备上,由于没有事件触发,需要用户操作之后才能有声播放。

:::tip
针对实现自动播放的问题,在 ios 上就可以使用`video`的方案,在`android`上可以使用采用`canvas`绘制的方案。如果考虑到`canvas`的性能问题,在安卓上建议做一个点击按钮,第一次点击后播放,后续的话可实现自动播放。
:::

### 默认样式

安卓下，不能自动播放，因此视频在播放前会带有视频的默认白色加圆圈播放按钮且背景是纯黑色，可以说是非常丑陋了。为了好点的用户体验就是可以在视频的最上层覆盖一张引导用户点击播放视频的引导图，这样既不丑陋又让用户知道这里需要点一下才有东西出现。

我的做法是增加一个手指引导图，然后让该元素可穿透(即设置 `pointer-events:none;` 让其不会成为任何鼠标事件的 target)，这样点击元素的时候就相当于点击了视频播放。然后监听 `playing` 事件，如果视频开始播放了则把引导图隐藏。具体如下：

```html
<div class="entry_video" id="entry_video">
  <video
    class="entry_video_con"
    id="video"
    webkit-playsinline
    playsinline
    src="//wq.360buyimg.com/fd/h5/1707/entryvideo/images/meirenyu_7f7e46da.mp4"
    autoplay="true"
  ></video>
  <div
    class="guide"
    style="width: 100%;height: 100%;top: 0;left:0;position: absolute;pointer-events:none;"
  >
    <img
      src="//img11.360buyimg.com/jdphoto/s750x1334_jfs/t5668/219/7883436652/42409/2a1e4cc0/5976a71bN212dfa7b.png"
      alt=""
      style="width:100%;height:100%;pointer-events:none;"
    />
  </div>
</div>

<script>
  vi.addEventListener("playing", function() {
    $(".guide").hide();
  });
</script>
```

### 全屏播放

若页面中没有其他内容，只是播放一个视频的话，这个问题很好处理。设置`webkit-playsinline`，如果是在 X5 内核浏览器的话，设置 `x5-video-player-type="h5" x5-video-player-fullscreen="true"`。

那么问题来了，如果页面上不只有视频，还有其他内容呢，例如视频是在一个弹出层中。这样设置的话，页面原有内容会有一个 1s 左右的非常明显拉伸过程，这个拉伸过程就是为全屏播放视频做准备的。

但是这样的体验可以说是非常糟糕了。于是这种情况下，必须舍弃设置全屏播放了，但是在 X5 浏览器非全屏播放模式下，安卓会在视频页面右上角自动生成一个全屏按钮，这个怎么都去不掉。若用户点击了进入全屏模式，视频播放完毕并不会停留在视频最后一帧，而是出现腾讯的一些视频推送，你懂的。这个时候退出了全屏播放的话，视频会自动隐藏，所以最好做一张视频底图，不然就尴尬了。

### x5 下检测全屏

```js
vi.addEventListener("x5videoenterfullscreen", function() {
  //进入全屏
});
vi.addEventListener("x5videoexitfullscreen", function() {
  //退出全屏
});
```

用 `video.addEventListener("x5videoexitfullscreen", function(){….})`; 可以检测到视频什么时候退出了全屏，但是若在这个监听到退出之后隐藏整个视频，则再次触发播放视频事件失效。且在这个监听中直接调用 `.play` 方法并不能使视频重新播放。也就是说在检测过程中不能对视频进行一些隐藏，删除的操作。可以说，这检测也没什么意义了。

### 诡异的坑

安卓下，若是摇一摇在弹出层播放视频，若弹出层中有外链，点击了跳转，再返回，这个时候 video 会有一个诡异的 bug，具体表现为返回后第一次能正常触发，第二次之后触发都直接播到视频最后一帧，设置 `currentTime`、`start` 为 0 再播放，或者先 pause 再 play 都没有用，必须销毁重建。

### 区分设备

由于 video 在 ios 下表现良好，所以做兼容的时候，可以通过 `userAgent` 来做分别做处理。如：

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

### 微信固定入口的一些奇特 bug

1. 必须要等到微信的`jsbridge ready`了才能触发`play()`，否则不会自动执行,且只支持 ios 端的自动播放。

```js
if (os.ua.ios && os.device == "wechat") {
  const { wx } = window;
  wx &&
    wx.ready &&
    wx.ready(() => {
      wx.getNetworkType({
        success: () => {
          play();
        },
      });
    });
}
```

2. 在固定入口内，且 `jsbridge ready`了，如果使用`摇一摇`，也无法触发 `play()`。需要在摇一摇之前预先加载如下:

```js
document.addEventListener("WeixinJSBridgeReady", function() {
  var vi = document.getElementsByTagName("video")[0];
  vi.load();
  vi.pause();
  window.addEventListener("devicemotion", deviceMotionHandler, false);
});
```

3. 微信固定入口在没有使用`jsbridge`，而是通过点击来播放的点击事件，只能是`click`事件，不能是`touchstart`事件。

## video 在手机百度上遇到的的播放问题

在微信环境及其他 X5 内核的浏览器内,设置视频行内播放,全屏播放等都可以通过以下方式进行配置,但是这个配置在百度小程序和手机百度 app 上被流氓失效了。

```html
<video
  controls
  width="100%"
  preload="auto"
  x5-video-player-type="h5"
  webkit-playsinline="true"
  playsinline="true"
  x5-playsinline="true"
>
  <source src="www.otherserver.mp4" type="video/mp4" />
</video>
```

在手机百度 app 里面，会存在视频层级最高，遮挡导航栏的情况。`x5-video-player-type="h5"`这个属性解决不了。如何页面上底部存在着一些类似 tab 的导航栏或者是底部按钮的话,就会被遮挡住。

### 安卓

安卓手机百度中，视频只要播放，会被手百接管，此时层级最高。如果视频上面还有层级，比如弹出层，千万不要自动播放视频。

万幸的是安卓手百，`video`能操作位置，所以给出了一种处理思路，特定的时候可以调整位置，或者隐藏，假装不遮挡。比如当点击导航栏图标，导航跳出来的时候，视频跟着下移，这样视频就不会遮住导航栏

### ios

ios 手百，video 只要一播放，视频就被被手百接管，此时无论对视频进行移动，隐藏，删除都无效。
无意间发现，貌似是`<source src="www.otherserver.mp4" type="video/mp4">`以及`video.js`引起的需要将跨域域名改成不跨域的，然后不要用`video.js`，改用原生写。

```html
// 去掉video.js
<source src="./1.mp4" type="video/mp4" />
```

## 在 IOS 设备上使用 HTML5 来播放 Video 和 Audio 的注意事项

- 2021.04.26

### 小屏幕的优化

当前，`Safari` 通过使用全屏播放视频来优化 `iPhone` 或 `iPod touch` 上较小屏幕的视频显示效果-触摸屏幕时会出现视频控件，并且视频会按纵向或横向模式缩放以适合屏幕。在网页上视频不会默认全屏,在 `height` 和 `width` 属性影响仅分配网页上的空间，`controls` 属性将被忽略。这仅适用于小屏幕设备上的 Safari。

在 `Mac OS X`，`Windows` 和 `iPad` 上，`Safari` 浏览器内嵌播放嵌入在网页中的视频。

:::warning
在`iOS 4.0`之前，`iPhone` 和 `iPod touch` 不能内联播放音频。音频以全屏模式显示。音频可以在所有设备上的`iOS 4.0`及更高版本上内联播放。
:::

### 用户通过蜂窝网络控制下载

在 `iOS` 上的 `Safari`（适用于包括 iPad 在内的所有设备的 Safari）中，用户可能使用`蜂窝移动网络`观看视频,此时会按照数据单元收费，因此将默认禁用`预加载` 和 `自动播放`功能。在用户启动数据之前，不会加载任何数据。这意味着在用户启动播放之前，通过`JavaScript`调用 `play()` 和 `load()` 方法也将处于非活动状态(即不会自动触发)，除非 `play()`、`load()` 方法是由用户操作触发的。换句话说，通过用户交互启动的“播放”有效，但 `onLoad="play()"`自动播放事件无效。

```html
<!-- 此段代码有效 -->
<input type="button" value="Play" onclick="document.myMovie.play()" />

<!-- 此段代码在ios上无效 -->
<body onload="document.myMovie.play()"></body>
```

:::warning
此要求适用于`<audio>`标签，`<video>`标签和 Web 音频播放的媒体。
:::

### iOS 上的默认高度和宽度

由于在加载视频元数据之前，视频的原始尺寸是未知的，因此，如果未指定高度或宽度，在运行 iOS 的设备上将默认的高度和宽度分配为 150 x 300。在加载视频时如果不指定，默认的高度和宽度不会更改，因此您应该指定首选的高度和宽度，以在 iOS 上（尤其是在视频在分配的空间中播放的 iPad）上获得最佳的用户体验。

### iPhone 视频占位符

在`iPhone` 和 `iPod touch` 上，显示带有播放按钮的占位符，直到用户启动播放为止。占位符是半透明的，因此背景或任何海报图像都可以显示出来。占位符为用户提供了一种播放媒体的方式。如果 iOS 设备无法播放指定的媒体，则控件中会出现一个对角线，表示该设备无法播放。

在台式机和 iPad 上，视频的第一帧一出现就显示出来。没有占位符。

### 媒体播放控件

当在`iPhone` 和 `iPod touch` 上进行全屏播放期间，播放控件会一直存在，并且占位符允许用户启动全屏播放。在台式机或 iPad 上，必须包含`controls`属性或使用`JavaScript`提供播放控件。在`iPad`上提供用户控件尤为重要，因为禁用了自动播放功能以防止未经请求的手机下载。

### 支持的媒体

桌面上的`Safari`支持已安装的`QuickTime`版本可以播放的任何媒体。这包括使用编解码器编码的媒体，如果编解码器作为`QuickTime`编解码器组件安装在用户计算机上，则`QuickTime`本身不支持。

- iOS（包括 iPad）上的 Safari 当前支持未压缩的 WAV 和 AIF 音频，MP3 音频以及 AAC-LC 或 HE-AAC 音频。HE-AAC 是首选格式。
- iOS（包括 iPad）上的 Safari 当前支持 MPEG-4 视频（基线配置文件）以及用 H.264 视频（基线配置文件）和一种受支持的音频类型编码的 QuickTime 电影。
- iPad 和 iPhone 3G 及更高版本支持 H.264 基准配置文件 3.1。iPhone 的早期版本支持 H.264 Baseline profile 3.0。

### 多个同时音频或视频流

当前，所有运行 iOS 的设备仅限于随时播放`单个音频或视频流`。当前不支持在 iOS 设备上播放并排，部分重叠或完全重叠的多个视频。也不支持同时播放多个音频流。但是，您可以动态更改音频或视频源。

### 使用 JavaScript 控制音量

在桌面浏览器上,我们可以设置、读取`<audio>`、`<video>`的`volume`属性。我们可以通过设置该属性的值大小来控制音视频的音量,默认值是 1,这时会以正常音量播放,属性的范围为 0~1,我们可以在此范围内调整音量大小。

此方式非常有实用价值,这允许我们在听音乐的同时可以玩游戏,设置游戏的音量为静音。

但是,在 ios 设备上,音频是在用户的物理控制之外的。我们只能进行访问,并且返回值永远是 1,无法使用`javascript`进行音量的修改。

### 使用 JavaScript 控制视频播放速率

在桌面浏览器上我们可以使用`javascript`设置音视频的`playbackRate`属性,来更改音视频的播放速率,该属性的大小是一个 0~1 之间的数值。**但是在 ios 上目前无法设置改属性值。**

### 循环播放属性 Loop

在`Safari`桌面浏览器和`IOS5.0`之后的版本,我们可以设置音视频的`loop`属性用来控制视频的播放次数是 1 次还是循环播放。如果要兼容早期的 ios,我们可以通过给音视频注册播放结束的事件,并在`end`事件上绑定`play`事件。

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Looping Audio</title>
    <script type="text/javascript">
      function init() {
        var myAudio = document.getElementById("audio");
        myAudio.addEventListener("ended", loopAudio, false);
      }
      function loopAudio() {
        var myAudio = document.getElementById("audio");
        myAudio.play();
      }
    </script>
  </head>
  <body onload="init();">
    <audio id="audio" src="myAudio.m4a" controls></audio>
  </body>
</html>
```
