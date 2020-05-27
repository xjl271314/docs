# H5直播方案分析讲解

- 2020.05.25


## 直播的流程

在研究方案前我们先来了解下直播的大致流程:

![直播流程](https://img-blog.csdnimg.cn/20200525115522476.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

## 视频流协议HLS与RTMP

目前 `WEB`项目 上主流的视频直播方案有 `HLS` 和 `RTMP`，`H5`上目前以 `HLS` 为主（`HLS`存在延迟性问题，也可以借助 `video.js` 采用`RTMP`），PC端则以 `RTMP` 为主实时性较好。

实际的直播和用户播放的直播会有10秒左右或者更高的延迟,如何降低这个延时提高体验的关键。

### HTTP Live Streaming

> `HLS(HTTP Live Streaming)`是一个基于 `HTTP` 的视频流协议，由 `Apple` 公司实现，`Mac OS` 上的 `QuickTime`、`Safari` 以及 `iOS` 上的 `Safari` 都能很好的支持 `HLS`，高版本 `Android` 也增加了对 `HLS` 的支持。一些常见的客户端如：`MPlayerX`、`VLC` 也都支持 `HLS` 协议。

**提供 HLS 的服务器需要做两件事**：
 
1. `编码`: 以 `H.263` 格式对图像进行编码，以 `MP3` 或者 `HE-AAC` 对声音进行编码，最终打包到 `MPEG-2 TS（Transport Stream）`容器之中。

2. `分割`: 把编码好的 `TS` 文件等长切分成后缀为 `ts` 的小文件，并生成一个 `.m3u8` 的纯文本索引文件。

### m3u8文件

浏览器使用的是 `m3u8` 文件。

> `m3u8` 跟`音频列表格式 m3u` 很像，可以简单的认为 `m3u8` 就是包含多个 `ts` 文件的播放列表(采用utf-8编码)。

### 播放流程

播放器会按顺序逐个播放，全部放完再请求一下 `m3u8` 文件，获得包含最新 `ts` 文件的播放列表继续播放，周而复始。整个直播过程就是依靠一个不断更新的 `m3u8` 和一堆小的 ts 文件组成，`m3u8` 必须动态更新，`ts` 可以走 `CDN`。一个典型的 `m3u8` 文件格式如下：

```json
#EXTM3U
#EXT-X-VERSION:3
#EXT-X-MEDIA-SEQUENCE:753
#EXT-X-TARGETDURATION:6
#EXTINF:6.099,
pili-live-rtmp.xxx.com_1708021247HmBHAG-1590389214780.ts
#EXTINF:6.050,
pili-live-rtmp.xxx.com_1708021247HmBHAG-1590389220884.ts
#EXTINF:6.096,
pili-live-rtmp.xxx.com_1708021247HmBHAG-1590389226932.ts
```

可以看到 `HLS` 协议本质还是一个个的 `HTTP 请求 / 响应`，所以适应性很好，不会受到防火墙影响。

:::warning
但它也有一个致命的弱点：延迟现象非常明显。如果每个 `ts`文件 按照 `5` 秒来切分，一个 `m3u8` 放 6 个 `ts 索引`，那么至少就会带来 `30 秒`的延迟。

如果减少每个 `ts` 的长度，减少 `m3u8` 中的索引数，延时确实会减少，但会带来更频繁的缓冲，对服务端的请求压力也会成倍增加。

苹果官方推荐的 `ts` 时长是`10s`，所以这样就会大该有`30s`的延迟。所以服务器接收流，转码，保存，切块，再分发给客户端，这里就延时的根本原因,所以只能根据实际情况找到一个折中的点。
:::

**对于支持 `HLS` 的浏览器来说，直接这样写就能播放了：**

```html
<video src=”./bipbopall.m3u8″ height=”300″ width=”400″  preload=”auto” autoplay=”autoplay” loop=”loop” webkit-playsinline=”true”></video>
```

:::tip
`HLS` 在 `PC` 端仅支持`safari`浏览器，类似`chrome`浏览器使用`HTML5 video`
标签无法播放 `m3u8` 格式，需要其他插件辅助转化,可采用目前网上一些比较成熟的方案。

- `sewise-player([Flash和HTML5播放器]Flash播放m3u8文件)`

- `MediaElement([Flash和Sliverlight播放器] )`

- `videojs-contrib-hls(解码m3u8文件)`

- `jwplayer([Flash和HTML5播放器]  网页媒体播放器)`

- `videojs(可能会出现 跨域 问题，需要服务端的配合，让视频允许跨域)`。
:::

**`video.js`方案部分代码展示**

```html
<!-- 引入的文件 -->
<link href="https://unpkg.com/video.js/dist/video-js.css" rel="stylesheet">
<script src="https://unpkg.com/video.js/dist/video.js"></script>
<script src="https://unpkg.com/videojs-contrib-hls/dist/videojs-contrib-hls.js"></script>

<!-- html部分 -->
<video id="my_video_1" class="video-js vjs-default-skin" controls preload="auto" width="640" height="268" 
  data-setup='{}'>
    <source src="http://www.tony.com/hls/test.m3u8" type="application/x-mpegURL">
 </video>
```
```js
var player=videojs('#my_video_1');
player.play();

// 视频播放 
var myPlayer = videojs('my_video_1<%=i%>',{
    bigPlayButton : true,
    textTrackDisplay : true,
    posterImage: true,
    errorDisplay : true,
    controlBar : true
},function(){
    //ready 加载
	var _that = this;
    this.on('loadedmetadata',function(){
    })
    this.on('ended',function(){
    })
    this.on('firstplay',function(){
    })
    this.on('loadstart',function(){
        //开始加载
    })
    this.on('loadeddata',function(){
    })
    this.on('seeking',function(){
        //正在去拿视频流的路上
    })
    this.on('seeked',function(){
        //已经拿到视频流,可以播放
    })
    this.on('waiting',function(){
    })
    this.on('pause',function(){
    })
    this.on('play',function(){
    })
});
myPlayer.play(); //视频播放
```

### Real Time Messaging Protocol

> `Real Time Messaging Protocol（简称 RTMP）`是 `Macromedia` 开发的一套视频直播协议，现在属于 `Adobe`。这套方案需要搭建专门的 `RTMP` 流媒体服务如 `Adobe Media Server`，并且在浏览器中只能使用 `Flash` 实现播放器。它的实时性非常好，延迟很小，但无法支持`移动端 WEB` 播放是它的硬伤。

虽然无法在`iOS`的`H5`页面播放，但是对于`iOS`原生应用是可以自己写解码去解析的, `RTMP` 延迟低、实时性较好。

浏览器端，`HTML5 video` 标签无法播放 `RTMP` 协议的视频，可以通过 `video.js` 来实现。

```html
<link href=“http://vjs.zencdn.net/5.8.8/video-js.css” rel=“stylesheet”>
<video id=“example_video_1″ class=“video-js vjs-default-skin” controls preload=“auto” width=“640” height=“264” loop=“loop” webkit-playsinline>
<source src=“rtmp://10.14.221.17:1935/rtmplive/home” type='rtmp/flv'>
</video>

<script src=“http://vjs.zencdn.net/5.8.8/video.js”></script>
<script>
videojs.options.flash.swf = ‘video.swf’;
videojs(‘example_video_1′).ready(function() {
this.play();
});
</script>
```

## 视频流协议HLS与RTMP对比

| 方式 | 协议 | 原理 | 延时 | 优点 | 使用场景
| :--- | :--- | :--- | :--- | :--- | :--- |
| `HLS` | 短链接HTTP | 集合一段时间数据生成ts切片文件更新`m3u8`文件 | 10s - 30s | 跨平台 | 移动端为主
| `RTMP` | 长链接Tcp | 每个时刻的数据收到后立即发送 | 2s | 延时低、实时性好 | PC + 直播 + 实时性要求高 + 互动性强


## H5 录制视频

> 对于`H5视频录制`，可以使用强大的 `webRTC （Web Real-Time Communication）`是一个支持网页浏览器进行实时语音对话或视频对话的技术，缺点是只在 `PC` 的 `Chrome` 上支持较好，移动端支持不太理想。

**使用 `webRTC` 录制视频基本流程是：**

1. 调用`window.navigator.webkitGetUserMedia();`获取用户的PC摄像头视频数据。

2. 将获取到视频流数据转换成`window.webkitRTCPeerConnection(一种视频流数据格式)`。

3. 利用 `webscoket` 将视频流数据传输到服务端。

:::tip
由于许多方法都要加上浏览器前缀，所以很多移动端的浏览器还不支持 `webRTC`，所以真正的视频录制还是要靠客户端`（iOS,Android）`来实现,效果会好一些。
:::


## iOS 采集（录制）音视频数据OS

**关于音视频采集录制，首先明确下面几个概念：**

- `视频编码`: 所谓视频编码就是指通过特定的压缩技术，将某个视频格式的文件转换成另一种视频格式文件的方式，我们使用的 `iPhone` 录制的视频，必须要经过`编码`，`上传`，`解码`，才能真正的在用户端的播放器里播放。

- `编解码标准`: 视频流传输中最为重要的编解码标准有国际电联的 `H.261`、`H.263`、`H.264`，其中 `HLS` 协议支持 `H.264` 格式的编码。

- `音频编码`: 同视频编码类似，将原始的音频流按照一定的标准进行编码，上传，解码，同时在播放器里播放，当然音频也有许多编码标准，例如 `PCM 编码`，`WMA 编码`，`AAC 编码`等等，这里我们 `HLS` 协议支持的音频编码方式是 `AAC 编码`。

**利用 iOS 上的摄像头，进行音视频的数据采集，主要分为以下几个步骤：**

1. 音视频的采集，利用`AVCaptureSession`和`AVCaptureDevice`可以采集到原始的音视频数据流。

2. 对视频进行`H264编码`，对音频进行`AAC编码`，在`iOS`中分别有已经封装好的编码库（`x264编码`、`faac编码`、`ffmpeg编码`）来实现对音视频的编码。

3. 对编码后的音、视频数据进行组装封包。

4. 建立`RTMP`连接并上推到服务端。


![IOS采集流程](https://img-blog.csdnimg.cn/20200525161931467.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

## 直播间状态分析

直播业务中常常会涉及到很多场景,比如说直播过程中主播离开了直播间,直播结束,当前推流断了等，建议可以按照以下场景切分不同业务类型。

- 页面初始化
- 直播中
- 主播暂时离开
- 直播结束
- 自己的直播间
- 主播正赶来
- 子账号
- 回放
- 预展中

## H5直播开发注意事项


1. `Video`标签兼容问题

比如： 在微信和QQ的内置浏览器里，播放视频会自动全屏，`video标签`也是永远浮在页面最上层，你根本控制不了。 浮在最上层不只是`X5浏览器`，还有些手机只带的浏览器。 视频源出现问题的表现，播放按钮的问题，都有不同。 因此需要我们对video标签的属性就行兼容处理:

```html
<video 
  id="video" 
  style="object-fit:fill" 
  autoplay
  webkit-playsinline 
  playsinline 
  x5-video-player-type="h5"
  x5-video-player-fullscreen="true"
  x5-video-orientation="portraint" 
  src="video.mp4" 
  poster="img.jpg"
/></video>
<!-- object-fit: fill   视频内容充满整个video容器
poster:"img.jpg" 视频封面
autoplay： 自动播放
    auto - 当页面加载后载入整个视频
    meta - 当页面加载后只载入元数据
    none - 当页面加载后不载入视频
muted：当设置该属性后，音频输出为静音
webkit-playsinline playsinline:   内联播放
x5-video-player-type="h5-page" :  启用x5内核H5播放器
x5-video-player-fullscreen="true"  全屏设置。ture和false的设置会导致布局上的不一样
x5-video-orientation="portraint" ：声明播放器支持的方向，可选值landscape 横屏,portraint竖屏。
                                   默认值portraint。无论是直播还是全屏H5一般都是竖屏播放，
                                   但是这个属性需要x5-video-player-type开启H5模式 -->
```

2. `Video`推流监听问题

推流会有一些不可控的情况，主播关闭摄像头，推送断流等，客户端断网。 这个时候在H5端的表现就是卡住，一旦卡住之后，就算推流又重新开始了，video依然会卡在那里，不会有任何重新播放的样子。 如果推流重新开始，用户自己点击控制条的暂停，再点击播放，又可以正常播放了。 

可我们不可能让用户一直点，因为你也不知道推流什么时候重新开始，或者什么时候不再是断网状态。 通过点击控制条的暂停，再点击播放便可以播放的规律，我们可以自己检查当前的状态，再用JS控制video暂停，再播放。

```js
const video = document.getElementById('video');

video.pause();
video.play();
```

如何检查当前是卡住的状态呢？这里需要用到`timeupdate`事件。一旦用户是播放状态，监听`timeupdate`，通过对比`currentTime`轮询着来检查当前是否卡住。

```js
var checkTime = null;
var checkLastTime = null;
var check = setInterval(function(){
    if(checkTime != null){
        if(video.paused){
            //如果是暂停状态
        }
        if(checkTime == checkLastTime || (checkTime== 0 && checkLastTime==0)){
            if(!video.paused){//如果是暂停状态，就忽略
                Message.tip('主播暂时'); // 提示一下用户
                video.pause();
                video.src = video.src;// 重置src，否则ios不会再次播放
                video.play();
            }
            
        }
    }
    checkLastTime = checkTime;
}, 10000);

video.addEventListener('timeupdate', function(e){
    //每次play()都会触发一次timeupdate,所以需要加个条件判断
    if(checkTime != checkLastTime) hideShowTip();//隐藏上面 主播 离开的提示
    checkTime = e.target.currentTime;
});
```

但是这样仍然会有一些问题，比如当前检测到视频卡住了，JS控制重新播放，而当前还是没有获取到推流的话。 浏览器会先loading获取视频，最后会x显示加载失败。 我们的检查会轮询执行，所以我们可以在视频正常播放前使用一些提示类组件。


4. 播放兼容问题 

```js
playsinline="true" webkit-playsinline="true  // 解决ios自动播放全屏问题

x5-video-player-type="h5" x5-video-player-fullscreen="true" // 解决安卓同层级播放

```