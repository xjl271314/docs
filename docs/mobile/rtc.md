# WebRtc 技术在H5直播中的运用

- 2021.01.07

![rtc架构图](https://static001.geekbang.org/resource/image/c5/a0/c536a1dd0ed50008d2ada594e052d6a0.png)

**上图是整个 `WebRTC 1 对 1` 音视频实时通话的过程图。**

这幅图从大的方面可以分为 4 部分，即两个 `WebRTC 终端`（上图中的两个大方框）、一个 `Signal（信令）服务器`和一个 `STUN/TURN 服务器`。

- `WebRTC 终端`，负责音视频采集、编解码、NAT 穿越、音视频数据传输。

- `Signal 服务器`，负责信令处理，如加入房间、离开房间、媒体协商消息的传递等。

- `STUN/TURN 服务器`，负责获取 WebRTC 终端在公网的 IP 地址，以及 NAT 穿越失败后的数据中转。

**下面我们将描述一下 `WebRTC` 进行音视频通话的大体过程。**

当一端（WebRTC 终端）进入房间之前，它首先会检测自己的设备是否可用。如果此时设备可用，则进行音视频数据采集。

采集到的数据一方面可以做预览，也就是让自己可以看到自己的视频；

另一方面，可以将其录制下来保存成文件，等到视频通话结束后，上传到服务器让用户回看之前的内容。

在获取音视频数据就绪后，WebRTC 终端要发送 “加入” 信令到 Signal 服务器。Signal 服务器收到该消息后会创建房间。在另外一端，也要做同样的事情，只不过它不是创建房间，而是加入房间了。待第二个终端成功加入房间后，第一个用户会收到 “另一个用户已经加入成功” 的消息。

此时，第一个终端将创建 “媒体连接” 对象，即 RTCPeerConnection（该对象会在后面的文章中做详细介绍），并将采集到的音视频数据通过 RTCPeerConnection 对象进行编码，最终通过 P2P 传送给对端。

当然，在进行 P2P 穿越时很有可能失败。所以，当 P2P 穿越失败时，为了保障音视频数据仍然可以互通，则需要通过 TURN 服务器（TURN 服务会在后面文章中专门介绍）进行音视频数据中转。

这样，当音视频数据 “历尽千辛万苦” 来到对端后，对端首先将收到的音视频数据进行解码，最后再将其展示出来，这样就完成了一端到另一端的单通。如果双方要互通，那么，两方都要通过 RTCPeerConnection 对象传输自己一端的数据，并从另一端接收数据。

以上，就是这幅图大体所描述的含义。

## 音视频采集基本概念

在正式介绍 JavaScript 采集音视频数据的 API 之前，我们还需要了解一些基本概念。这些概念虽然都不难理解，但在后面讲解 API 时都会用到它们，很是重要，所以在这里我还是给你着重汇总和强调下。

- 摄像头。用于捕捉（采集）图像和视频。

- 帧率。现在的摄像头功能已非常强大，一般情况下，一秒钟可以采集 30 张以上的图像，一些好的摄像头甚至可以采集 100 张以上。我们把`摄像头一秒钟采集图像的次数称为帧率`。帧率越高，视频就越平滑流畅。然而，在直播系统中一般不会设置太高的帧率，因为帧率越高，占的网络带宽就越多。

- 分辨率。摄像头除了可以设置帧率之外，还可以调整分辨率。我们常见的分辨率有 2K、1080P、720P、420P 等。分辨率越高图像就越清晰，但同时也带来一个问题，即占用的带宽也就越多。所以，在直播系统中，分辨率的高低与网络带宽有紧密的联系。也就是说，分辨率会跟据你的网络带宽进行动态调整。

- 宽高比。分辨率一般分为两种宽高比，即 16:9 或 4:3。4:3 的宽高比是从黑白电视而来，而 16:9 的宽高比是从显示器而来。现在一般情况下都采用 16:9 的比例。

- 麦克风。用于采集音频数据。它与视频一样，可以指定一秒内采样的次数，称为采样率。每个采样用几个 bit 表示，称为采样位深或采样大小。

- 轨（Track）。WebRTC 中的“轨”借鉴了多媒体的概念。火车轨道的特性你应该非常清楚，两条轨永远不会相交。“轨”在多媒体中表达的就是每条轨数据都是独立的，不会与其他轨相交，如 MP4 中的音频轨、视频轨，它们在 MP4 文件中是被分别存储的。

- 流（Stream）。可以理解为容器。在 WebRTC 中，“流”可以分为媒体流（MediaStream）和数据流（DataStream）。其中，媒体流可以存放 0 个或多个音频轨或视频轨；数据流可以存 0 个或多个数据轨。

## 音视频采集

接下来，就让我们来具体看看在浏览器下采集音视频的 API 格式以及如何控制音视频的采集吧。

### 1. getUserMedia 

方法在浏览器中访问音视频设备非常简单，只要调用 getUserMedia 这个 API 即可。该 API 的基本格式如下：

```js

var promise = navigator.mediaDevices.getUserMedia(constraints);

```

:::tip

如果 getUserMedia 调用成功，则可以通过 Promise 获得 MediaStream 对象，也就是说现在我们已经从音视频设备中获取到音视频数据了。

如果调用失败，比如用户拒绝该 API 访问媒体设备（音频设备、视频设备），或者要访问的媒体设备不可用，则返回的 Promise 会得到 PermissionDeniedError 或 NotFoundError 等错误对象。

:::

### 2. MediaStreamConstraints 参数

从上面的调用格式中可以看到，getUserMedia 方法有一个输入参数 constraints，其类型为 MediaStreamConstraints。它可以指定 MediaStream 中包含哪些类型的媒体轨（音频轨、视频轨），并且可为这些媒体轨设置一些限制。

WebRTC 1.0 规范对 MediaStreamConstraints的定义，其格式如下：

```js

dictionary MediaStreamConstraints {
    (boolean or MediaTrackConstraints) video = false,
    (boolean or MediaTrackConstraints) audio = false
};

```

从上面的代码中可以看出，该结构可以指定采集音频还是视频，或是同时对两者进行采集。

比如你只想采集视频，则可以像下面这样定义 constraints：

```js

const mediaStreamContrains = {
    video: true
};

```

或者，同时采集音视和视频：

```js

const mediaStreamContrains = {
    video: true,
    audio: true
};

```

其实，你还可以通过 MediaTrackConstraints 进一步对每一条媒体轨进行限制，比如下面的代码示例：

```js

const mediaStreamContrains = {
    video: {
        frameRate: {min: 20},
        width: {min: 640, ideal: 1280},
        height: {min: 360, ideal: 720},
      aspectRatio: 16/9
    },
    audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true
    }
};

```

### 如何使用 getUserMedia API?

接下来，我们看一下如何使用上面介绍的 API 来采集视频数据吧。

下面的 HTML 代码非常简单，它引入一段 JavaScript 代码用于捕获音视频数据，然后将采集到的音视频数据通过 video 标签播放出来。

```html

<!DOCTYPE html>
<html>
    <head>
        <title>Realtime communication with WebRTC</title>
        <link rel="stylesheet", href="css/client.css" />
    </head>
    <body>
        <h1>Realtime communication with WebRTC </h1>
        <video autoplay playsinline></video>
        <script src="js/client.js"></script>
    </body>
</html>

```

client.js:

```js
'use strict';

const mediaStreamContrains = {
    video: true
};

const localVideo = document.querySelector('video');

function gotLocalMediaStream(mediaStream){
    localVideo.srcObject = mediaStream;
}

function handleLocalMediaStreamError(error){
    console.log('navigator.getUserMedia error: ', error);
}

navigator.mediaDevices.getUserMedia(mediaStreamContrains).then(
    gotLocalMediaStream
).catch(
    handleLocalMediaStreamError
);
```

## 音视频设备的基本原理

既然说到音视频设备，那么我们再顺便介绍一下音视频设备的基本工作原理，对于这些设备工作原理的了解，会为你后续学习音视频相关知识提供很大的帮助。

### 1. 音频设备

音频有`采样率`和`采样大小`的概念，实际上这两个概念就与音频设备密不可分。

音频输入设备的主要工作是采集音频数据，而采集音频数据的本质就是`模数转换（A/D）`，即将模似信号转换成数字信号。

模数转换使用的采集定理称为**奈奎斯特定理**，其内容如下：

> 在进行模拟 / 数字信号的转换过程中，当采样率大于信号中最高频率的 2 倍时，采样之后的数字信号就完整地保留了原始信号中的信息。

对于日常语音交流（像电话），8kHz 采样率就可以满足人们的需求。

但为了追求高品质、高保真，你需要将音频输入设备的采样率设置在 40kHz 以上，这样才能完整地将原始信号保留下来。

例如我们平时听的数字音乐，一般其采样率都是 44.1k、48k 等，以确保其音质的无损。

采集到的数据再经过量化、编码，最终形成数字信号，这就是音频设备所要完成的工作。在量化和编码的过程中，采样大小（保存每个采样的二进制位个数）决定了每个采样最大可以表示的范围。如果采样大小是 8 位，则它表示的最大值是就是 2^8 -1，即 255；如果是 16 位，则其表示的最大数值是 65535。

### 2. 视频设备

至于视频设备，则与音频输入设备很类似。当实物光通过镜头进行到摄像机后，它会通过视频设备的模数转换（A/D）模块，即光学传感器， 将光转换成数字信号，即 RGB（Red、Green、Blue）数据。

获得 RGB 数据后，还要通过 `DSP（Digital Signal Processer）`进行优化处理，如自动增强、白平衡、色彩饱和等都属于这一阶段要做的事情。

通过 DSP 优化处理后，你就得到了 24 位的真彩色图片。因为每一种颜色由 8 位组成，而一个像素由 RGB 三种颜色构成，所以一个像素就需要用 24 位表示，故称之为 24 位真彩色。

另外，此时获得的 RGB 图像只是临时数据。因最终的图像数据还要进行压缩、传输，而编码器一般使用的输入格式为 YUV I420，所以在摄像头内部还有一个专门的模块用于将 RGB 图像转为 YUV 格式的图像。

那什么是 YUV 呢？YUV 也是一种色彩编码方法，主要用于电视系统以及模拟视频领域。它将亮度信息（Y）与色彩信息（UV）分离，即使没有 UV 信息一样可以显示完整的图像，只不过是黑白的，这样的设计很好地解决了彩色电视机与黑白电视的兼容问题。

### 3.获取音视频设备列表

首先，我们来看浏览器上 WebRTC 获取音视频设备列表的接口，其格式如下：

```js
//判断浏览器是否支持这些 API
if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
  console.log("enumerateDevices() not supported.");
  return;
}

// 枚举 cameras and microphones.
navigator.mediaDevices.enumerateDevices()
.then(function(deviceInfos) {

  //打印出每一个设备的信息
  deviceInfos.forEach(function(deviceInfo) {
    console.log(deviceInfo.kind + ": " + deviceInfo.label +
                " id = " + deviceInfo.deviceId);
  });
})
.catch(function(err) {
  console.log(err.name + ": " + err.message);
});

```

**总结起来，上面的代码中做了以下几件事儿：**

-  首先，判断浏览器是否支持 MediaDevice 接口（老版本浏览器可能不支持）。

- 如果支持，则调用navigator.mediaDevices.enumerateDevices()方法获取音视频设备列表，该方法会返回一个 Promise 对象。

- 如果返回 Promise 对象成功，则执行 then 中的函数。而 then 分支中的函数非常简单，它遍历每一个 MediaDeviceInfo，并将每个 MediaDeviceInfo 中的基本信息打印出来，也就是我们想要的每个音视频设备的基本信息。

- 但如果失败的话，则执行 catch 中的函数。


## 如何使用浏览器给自己拍照呢？


### 基础知识

在正式讲解如何进行拍照之前，你需要先了解非编码帧（解码帧）和编码帧这两个知识点，这会有利于你对后面拍照实现内容的理解。


#### 1.非编码帧

好多人小时候应该都学过，在几张空白的纸上画同一个物体，并让物体之间稍有一些变化，然后连续快速地翻动这几张纸，它就形成了一个小动画。

`音视频播放器`就是利用这样的原理来播放音视频文件的。当你要播放某个视频文件时，播放器会按照一定的时间间隔连续地播放从音视频文件中`解码后的视频帧`，这样视频就动起来了。同理，播放从摄像头获取的视频帧也是如此，只不过从摄像头获取的本来就是非编码视频帧，所以就不需要解码了。

**通过上面的描述，你应该能得到以下两点信息：**

- 播放的视频帧之间的时间间隔是非常小的。如按每秒钟 20 帧的帧率计算，每帧之间的间隔是 50ms。

- 播放器播的是`非编码帧（解码后的帧）`，这些非编码帧就是一幅幅独立的图像。

从摄像头里采集的帧或通过解码器解码后的帧都是非编码帧。非编码帧的格式一般是 YUV 格式或是 RGB 格式。

#### 2. 编码帧

相对于非编码帧，通过编码器（如 H264/H265、VP8/VP9）压缩后的帧称为编码帧。这里我们以 H264 为例，经过 H264 编码的帧包括以下三种类型。

- `I 帧`：关键帧。压缩率低，可以单独解码成一幅完整的图像。

- `P 帧`：参考帧。压缩率较高，解码时依赖于前面已解码的数据。

- `B 帧`：前后参考帧。压缩率最高，解码时不光依赖前面已经解码的帧，而且还依赖它后面的 P 帧。换句话说就是，B 帧后面的 P 帧要优先于它进行解码，然后才能将 B 帧解码。

通过上面的介绍，现在你应该已经清楚地知道了：`从播放器里获取的视频帧一定是非编码帧。也就是说，拍照的过程其实是从连续播放的一幅幅画面中抽取正在显示的那张画面。`

### 如何获取视频流?

在获得照片之前，你首先要通过浏览器的 API 获取视频流，并通过 HTML5 的 `<video>` 标签将视频播放出来。

```html

<html>
<head>
  <title>WebRTC take picture</title>
</head>
<body>
   <video autoplay playsinline id="player">
   <script src="./js/client.js"></script>
</body>
</html>

```

上面这段代码很简单，就是定义了一个 video 标签，用于播放从摄像头获取到的视频流。另外，它还引入了一段 JavaScript 脚本：

```js
'use strict'

// 获取HTML页面中的video标签  
var videoplay = document.querySelector('video#player');

// 播放视频流
function gotMediaStream(stream) {
    videoplay.srcObject = stream;
}

function handleError(err) {
    console.log('getUserMedia error:', err);
}

// 对采集的数据做一些限制
var constraints = {
    video: {
        width: 1280,
        height: 720,
        frameRate: 15,
    },
    audio: false
}

// 采集音视频数据流
navigator.mediaDevices.getUserMedia(constraints)
    .then(gotMediaStream)
    .catch(handleError);

```

在这段脚本中，我们调用了之前所讲的 `getUserMedia` 方法，该方法会打开摄像头，并通过它采集音视频流。然后再将采集到的视频流赋值给 HTML 中定义的 `video` 标签的 `srcObject` 字段，这样 `video` 标签就可以从摄像头源源不断地获得视频帧，并将它播放出来了。

## 如何将采集到的音视频数据录制下来?

在音视频会议、在线教育等系统中，录制是一个特别重要的功能。尤其是在线教育系统，基本上每一节课都要录制下来，以便学生可以随时回顾之前学习的内容。

实现录制功能有很多方式，一般分为`服务端录制`和`客户端录制`，具体使用哪种方式还要结合你自己的业务特点来选择。

- `服务端录制`：优点是不用担心客户因自身电脑问题造成录制失败（如磁盘空间不足），也不会因录制时抢占资源（CPU 占用率过高）而导致其他应用出现问题等；缺点是实现的复杂度很高。

- `客户端录制`：优点是方便录制方（如老师）操控，并且所录制的视频清晰度高，实现相对简单。这里可以和服务端录制做个对比，一般客户端摄像头的分辨率都非常高的（如 1280x720），所以客户端录制可以录制出非常清晰的视频；但服务端录制要做到这点就很困难了，本地高清的视频在上传服务端时由于网络带宽不足，视频的分辨率很有可能会被自动缩小到了 640x360，这就导致用户回看时视频特别模糊，用户体验差。不过客户端录制也有很明显的缺点，其中最主要的缺点就是录制失败率高。因为客户端在进行录制时会开启第二路编码器，这样会特别耗 CPU。而 CPU 占用过高后，就很容易造成应用程序卡死。除此之外，它对内存、硬盘的要求也特别高。

### 音视频采集录制基本原理

录制的基本原理还是蛮简单的，但要做好却很不容易，主要有以下三个重要的问题需要你搞清楚。

**第一个，录制后音视频流的存储格式是什么呢？** 比如，是直接录制原始数据，还是录制成某种多媒体格式（如 MP4 ）？你可能会想，为什么要考虑存储格式问题呢？直接选择一个不就好了？但其实存储格式的选择对于录制后的回放至关重要，这里我先留个悬念不细说，等看到后面的内容你自然就会理解它的重要性与局限性了。

**第二个，录制下来的音视频流如何播放？** 是使用普通的播放器播放，还是使用私有播放器播呢？其实，这与你的业务息息相关。如果你的业务是多人互动类型，且回放时也要和直播时一样，那么你就必须使用私有播放器，因为普通播放器是不支持同时播放多路视频的。还有，如果你想让浏览器也能观看回放，那么就需要提供网页播放器。

**第三个，启动录制后多久可以回放呢？**这个问题又分为以下三种情况。

- 边录边看，即开始录制几分钟之后用户就可以观看了。比如，我们观看一些重大体育赛事时（如世界杯），一般都是正式开始一小段时间之后观众才能看到，以确保发生突发事件时可以做紧急处理。

- 录制完立即回放，即当录制结束后，用户就可以回看录制了。比较常见的是一些技术比较好的教育公司的直播课，录制完成后就可以直接看回放了。

- 录完后过一段时间可观看。大多数的直播系统都是录制完成后过一段时间才可以看回放，因为录制完成后还要对音视频做一些剪辑、转码，制作各种不同的清晰度的回放等等。


## WebRTC 是如何进行客户端录制的?

为便于你更好地理解，在学习如何使用 WebRTC 实现客户端录制之前，你还需要先了解一些基础知识。

在 JavaScript 中，有很多用于存储二进制数据的类型，这些类型包括：ArrayBuffer、ArrayBufferView 和 Blob。那这三者与我们今天要讲的录制音视频流有什么关系呢？

**WebRTC 录制音视频流之后，最终是通过 Blob 对象将数据保存成多媒体文件的**; 而 Blob 又与 ArrayBuffer 有着很密切的关系。那 ArryaBuffer 与 ArrayBufferView 又有什么联系呢？接下来，我们就了解一下这 3 种二进制数据类型，以及它们之间的关系吧。

### 1. ArrayBuffer

> ArrayBuffer 对象表示通用的、固定长度的二进制数据缓冲区。因此，你可以直接使用它存储图片、视频等内容。

但你并不能直接对 ArrayBuffer 对象进行访问，类似于 Java 语言中的抽象类，在物理内存中并不存在这样一个对象，必须使用其封装类进行实例化后才能进行访问。

也就是说， ArrayBuffer 只是描述有这样一块空间可以用来存放二进制数据，但在计算机的内存中并没有真正地为其分配空间。只有当具体类型化后，它才真正地存在于内存中。如下所示：

```js
let buffer = new ArrayBuffer(16); // 创建一个长度为 16 的 buffer
let view = new Uint32Array(buffer);

let buffer = new Uint8Array([255, 255, 255, 255]).buffer;
let dataView = new DataView(buffer);
```

:::tip
在上面的例子中，一开始生成的 buffer 是不能被直接访问的。只有将 buffer 做为参数生成一个具体的类型的新对象时（如 Uint32Array 或 DataView），这个新生成的对象才能被访问。
:::

### 2. ArrayBufferView

ArrayBufferView 并不是一个具体的类型，而是代表不同类型的 Array 的描述。这些类型包括：Int8Array、Uint8Array、DataView 等。也就是说 Int8Array、Uint8Array 等才是 JavaScript 在内存中真正可以分配的对象。

以 Int8Array 为例，当你对其实例化时，计算机就会在内存中为其分配一块空间，在该空间中的每一个元素都是 8 位的整数。再以 Uint8Array 为例，它表达的是在内存中分配一块每个元素大小为 8 位的无符号整数的空间。

:::tip
通过这上面的描述，我们可以看到 `ArrayBuffer` 与 `ArrayBufferView` 的区别:

ArrayBufferView 指的是 Int8Array、Uint8Array、DataView 等类型的总称，而这些类型都是使用 ArrayBuffer 类实现的，因此才统称他们为 ArrayBufferView。
:::

### 3. Blob

> Blob（Binary Large Object）是 JavaScript 的大型二进制对象类型，WebRTC 最终就是使用它将录制好的音视频流保存成多媒体文件的。而它的底层是由上面所讲的 ArrayBuffer 对象的封装类实现的，即 Int8Array、Uint8Array 等类型。

Blob 对象的格式如下：

```js
var aBlob = new Blob( array, options );
```

其中，array 可以是 ArrayBuffer、ArrayBufferView、Blob、DOMString 等类型 ；option，用于指定存储成的媒体类型。

## 如何录制本地音视频？

WebRTC 为我们提供了一个非常方便的类，即 MediaRecorder。创建 MediaRecorder 对象的格式如下：

```js
var mediaRecorder = new MediaRecorder(stream[, options]);
```

**参数说明:**

| 字段 | 解释
|:--------| :-------------|
| `stream` | 通过 getUserMedia 获取的本地视频流或通过 RTCPeerConnection 获取的远程视频流。
| `options` | 可选项，指定视频格式、编解码器、码率等相关信息，如 mimeType: 'video/webm;codecs=vp8'。

MediaRecorder 对象还有一个特别重要的事件，即 **ondataavailable** 事件。当 MediaRecoder 捕获到数据时就会触发该事件。通过它，我们才能将音视频数据录制下来。

接下来，我们看一下具体该如何使用上面的对象来录制音视频流吧！

### 1.录制音视频流

首先是获取本地音视频流,之前我已经讲过如何通过浏览器采集音视频数据，具体就是调用浏览器中的 getUserMedia 方法。

获取到音视频流后，你可以将该流当作参数传给 MediaRecorder 对象，并实现 **ondataavailable** 事件，最终将音视频流录制下来。具体代码如下所示，我们先看一下 HTML 部分：

```html
<html>
...
<body>
    ...
    <button id="record">Start Record</button>
    <button id="recplay" disabled>Play</button>
    <button id="download" disabled>Download</button>
    ...
</body>
</html>
```

上面的 HTML 代码片段定义了三个 button，一个用于开启录制，一个用于播放录制下来的内容，最后一个用于将录制的视频下载下来。然后我们再来看一下 JavaScript 控制部分的代码：

```js
var buffer;

// 当该函数被触发后，将数据压入到blob中
function handleDataAvailable(e){
    if(e && e.data && e.data.size > 0){
        buffer.push(e.data);
    }
}

function startRecord(){
    buffer = [];

    // 设置录制下来的多媒体格式 
    var options = {
        mimeType: 'video/webm;codecs=vp8'
    }

    // 判断浏览器是否支持录制
    if(!MediaRecorder.isTypeSupported(options.mimeType)){
        console.error(`${options.mimeType} is not supported!`);
        return;
    }

    try{
        // 创建录制对象
        mediaRecorder = new MediaRecorder(window.stream, options);
    }catch(e){
        console.error('Failed to create MediaRecorder:', e);
        return;
    }

    // 当有音视频数据来了之后触发该事件
    mediaRecorder.ondataavailable = handleDataAvailable;
    // 开始录制
    mediaRecorder.start(10);
}

...
```

当你点击 Record 按钮的时候，就会调用 startRecord 函数。在该函数中首先判断浏览器是否支持指定的多媒体格式，如 webm。 如果支持的话，再创建MediaRecorder 对象，将音视频流录制成指定的媒体格式文件。

实际存储时，是通过 `ondataavailable` 事件操作的。每当 `ondataavailable` 事件触发时，就会调用 handleDataAvailable 函数。该函数的实现就特别简单了，直接将数据 push 到 buffer 中，实际在浏览器底层使用的是 Blob 对象。

另外，在开启录制时，可以设置一个毫秒级的时间片，这样录制的媒体数据会按照你设置的值分割成一个个单独的区块，否则默认的方式是录制一个非常大的整块内容。分成一块一块的区块会提高效率和可靠性，如果是一整块数据，随着时间的推移，数据块越来越大，读写效率就会变差，而且增加了写入文件的失败率。

### 2. 回放录制文件

通过上面的方法录制好内容后，又该如何进行回放呢？让我们来看一下代码吧！

```html
<video id="recvideo"></video>
```

```js
 var blob = new Blob(buffer, {type: 'video/webm'});
 recvideo.src = window.URL.createObjectURL(blob);
 recvideo.srcObject = null;
 recvideo.controls = true;
 recvideo.play();
 ```

 在上面的代码中，首先根据 buffer 生成 Blob 对象；然后，根据 Blob 对象生成 URL，并通过`<video>`标签将录制的内容播放出来了。

### 3. 下载录制好的文件

那如何将录制好的视频文件下载下来呢？代码如下：

```js
btnDownload.onclick = ()=> {
    var blob = new Blob(buffer, {type: 'video/webm'});
    var url = window.URL.createObjectURL(blob);
    var a = document.createElement('a');

    a.href = url;
    a.style.display = 'none';
    a.download = 'aaa.webm';
    a.click();
}
```

将录制好的视频下载下来还是比较简单的，点击 download 按钮后，就会调用上面的代码。在该代码中，也是先创建一个 Blob 对象，并根据 Blob 对象创建 URL；然后再创建一个`<a>`标签，设置 A 标签的 href 和 download 属性。这样当用户点击该标签之后，录制好的文件就下载下来了。

## 共享桌面的基本原理

共享桌面的基本原理其实非常简单，我们可以分“两头”来说明：

- 对于**共享者**，每秒钟抓取多次屏幕（可以是 3 次、5 次等），每次抓取的屏幕都与上一次抓取的屏幕做比较，取它们的差值，然后对差值进行压缩；如果是第一次抓屏或切幕的情况，即本次抓取的屏幕与上一次抓取屏幕的变化率超过 80% 时，就做全屏的帧内压缩，其过程与 JPEG 图像压缩类似（有兴趣的可以自行学习）。最后再将压缩后的数据通过传输模块传送到观看端；数据到达观看端后，再进行解码，这样即可还原出整幅图片并显示出来。

- 对于**远程控制端**，当用户通过鼠标点击共享桌面的某个位置时，会首先计算出鼠标实际点击的位置，然后将其作为参数，通过信令发送给共享端。共享端收到信令后，会模拟本地鼠标，即调用相关的 API，完成最终的操作。一般情况下，当操作完成后，共享端桌面也发生了一些变化，此时就又回到上面共享者的流程了，我就不再赘述了。

:::tip
通过上面的描述，可以总结出共享桌面的处理过程为：**抓屏、压缩编码、传输、解码、显示、控制**这几步，你应该可以看出它与音视频的处理过程几乎是一模一样的。
:::

### RDP 协议 与 VNC 协议

对于共享桌面，很多人比较熟悉的可能是 `RDP（Remote Desktop Protocal）`协议，它是 Windows 系统下的共享桌面协议；还有一种更通用的远程桌面控制协议——`VNC（Virtual Network Console）`，它可以实现在不同的操作系统上共享远程桌面，像 TeamViewer、RealVNC 都是使用的该协议。

以上的远程桌面协议一般分为桌面数据处理与信令控制两部分:

- **桌面数据**：包括了桌面的抓取 (采集)、编码（压缩）、传输、解码和渲染。

- **信令控制**：包括键盘事件、鼠标事件以及接收到这些事件消息后的相关处理等。

其实在 WebRTC 中也可以实现共享远程桌面的功能。但由于共享桌面与音视频处理的流程是类似的，且 WebRTC 的远程桌面又不需要远程控制，所以其处理过程使用了视频的方式，而非传统意义上的 RDP/VNC 等远程桌面协议。

## 如何共享桌面？

学习完共享桌面相关的理论知识，接下来，就让我们实践起来，一起来学习如何通过浏览器来抓取桌面吧！

### 1. 抓取桌面

首先我们先来了解一下在浏览器下抓取桌面的 API 的基本格式：

```js
var promise = navigator.mediaDevices.getDisplayMedia(constraints);
```

我们可以再看一下采集视频的 API 的样子：

```js
var promise = navigator.mediaDevices.getUserMedia(constraints);
```

:::tip

二者唯一的区别就是：一个是 `getDisaplayMedia`，另一个是 `getUserMedia`。

这两个 API 都需要一个 `constraints` 参数来对采集的桌面 / 视频做一些限制。

但需要注意的是，在采集视频时，参数 `constraints` 也是可以对音频做限制的，而在桌面采集的参数里却不能对音频进行限制了。

**也就是说，不能在采集桌面的同时采集音频。这一点要特别注意。**

:::

下面我们就来看一下**如何通过 getDisplayMedia API 来采集桌面：**

```js
...
//得到桌面数据流
function getDeskStream(stream){
    localStream = stream;
}

//抓取桌面
function shareDesktop(){
    // 只有在 PC 下才能抓取桌面
    if(IsPC()){
        // 开始捕获桌面数据
        navigator.mediaDevices.getDisplayMedia({video: true})
            .then(getDeskStream)
            .catch(handleError);

        return true;
    } 
         
     return false;     
}  
...
```

通过上面的方法，就可以获得桌面数据了，让我们来看一下效果图吧：

![Chrome 浏览器共享桌面图](https://img-blog.csdnimg.cn/2021011210581377.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)


### 2. 桌面的展示

桌面采集后，就可以通过 HTML 中的 `<video>`标签将采集到的桌面展示出来，具体代码如下所示。

```html
<video autoplay playsinline id="deskVideo"></video>
```

```js
var deskVideo = document.querySelect("video/deskVideo");

function getDeskStream(stream){ 
    localStream = stream; 
    deskVideo.srcObject = stream; 
}
```

在 JavaScript 中调用 **getDisplayMedia** 方法抓取桌面数据，当桌面数据被抓到之后，会触发 getDeskStream 函数。我们再在该函数中将获取到的 stream 与 video 标签联系起来，这样当数据获取到时就从播放器里显示出来了。

### 3. 录制桌面

首先通过 getDisplayMedia 方法获取到本地桌面数据，然后将该流当作参数传给 MediaRecorder 对象，并实现 ondataavailable 事件，最终将音视频流录制下来。

```html
<html>
...
<body>
    ...
    <button id="record">Start Record</button>
    ...
</body>
</html>
```

我们在上面的 HTML 代码片段定义了一个开启录制的 button，当用户点击该 button 后，就触发录制：

```js
...
var buffer;
...

function handleDataAvailable(e){
    if(e && e.data && e.data.size > 0){
        buffer.push(e.data);
    }
}

function startRecord(){
    //定义一个数组，用于缓存桌面数据，最终将数据存储到文件中
    buffer = [];

    var options = {
        mimeType: 'video/webm;codecs=vp8'
    }

    if(!MediaRecorder.isTypeSupported(options.mimeType)){
        console.error(`${options.mimeType} is not supported!`);
        return;
    }

    try{
        //创建录制对象，用于将桌面数据录制下来
        mediaRecorder = new MediaRecorder(localStream, options);
    }catch(e){
        console.error('Failed to create MediaRecorder:', e);
        return;
    }

    //当捕获到桌面数据后，该事件触发
    mediaRecorder.ondataavailable = handleDataAvailable;
    mediaRecorder.start(10);
}
...
```

当用户点击 Record 按钮的时候，就会调用 `startRecord` 函数。在该函数中首先判断浏览器是否支持指定的多媒体格式，如 webm。 如果支持的话，再创建 MediaRecorder 对象，将桌面流录制成指定的媒体格式文件。

当从 localStream 获取到数据后，会触发 `ondataavailable` 事件。也就是会调用 handleDataAvailable 方法，最终将数据存放到 Blob 中。

## WebRTC中的RTP及RTCP详解

可以毫不夸张地说，WebRTC 是一个 “宝库”，它里面有各种各样的 “好东西”。无论你从事什么行业，几乎都可以从它里边吸取能量。

在学习 WebRTC 时，你不光要学习如何使用它，还应该多去看它底层的代码，多去了解它都能做些什么，争取对它的原理和使用都了然于心。如此一来，当遇到某个恰当的时机，你就可以从 WebRTC 库中抽取一点“精髓”放到你自己的项目中，让你的项目大放异彩。

比如，你是搞音频的，你就可以从 WebRTC 中提取 `3A（AEC、AGC、ANC）`的算法用到自己的项目中，这些算法可是目前世界上最顶级处理音频的算法；

如果你是搞网络的，网络带宽的评估、平滑处理、各种网络协议的实现在 WebRTC 中真是应有尽有，你完全可以从中抽取你想用的。

鉴于 WebRTC 的强大“光环”，接下来将讲解学习 WebRTC 时你不得不知道的几个与网络相关的基本知识:

### UDP 还是 TCP？

如果抛开 WebRTC，让你自己实现一套实时互动直播系统，在选择网络传输协议时，你会选择使用 `UDP` 协议还是 `TCP` 协议呢？

UDP 虽然传输快，但不可靠，尤其是在用户的网络质量很差的情况下，基本无法保障音视频的服务质量。

如果采用 UDP 作为底层传输协议，那就使用 RUDP（可靠性 UDP），只有这样才能保障传输过程中不丢包。但有人提出反对意见，认为如果想不丢包，就该使用 TCP，因为 RUDP 可靠性做到极致就变成 TCP 了，那为什么不直接使用 TCP 呢？

现在让我告诉你正确答案：**必须使用 UDP**，**必须使用 UDP**，**必须使用 UDP**，重要的事情说三遍。

为什么一定要使用 UDP 呢？关于这个问题，你可以反向思考下，假如使用 TCP 会怎样呢？

:::tip
**在极端网络情况下，TCP 为了传输的可靠性，它是如何做的呢？简单总结起来就是“发送 -> 确认；超时 -> 重发”的反复过程。**
:::

举个例子，A 与 B 通讯，A 首先向 B 发送数据，并启动一个定时器。当 B 收到 A 的数据后，B 需要给 A 回一个 ACK（确认）消息，反复这样操作，数据就源源不断地从 A 流向了 B。如果因为某些原因，A 一直收不到 B 的确认消息会怎么办呢？当 A 的定时器超时后，A 将重发之前没有被确认的消息，并重新设置定时器。

在 TCP 协议中，为了避免重传次数过多，定时器的超时时间会按 2 的指数增长。也就是说，假设第一次设置的超时时间是 1 秒，那么第二次就是 2 秒，第三次是 4 秒……第七次是 64 秒。如果第七次之后仍然超时，则断开 TCP 连接。你可以计算一下，从第一次超时，到最后断开连接，这之间一共经历了 2 分 07 秒，是不是很恐怖？

如果遇到前面的情况，A 与 B 之间的连接断了，那还算是个不错的情况，因为还可以再重新建立连接。但如果在第七次重传后，A 收到了 B 的 ACK 消息，那么 A 与 B 之间的数据传输的延迟就达到 1 分钟以上。对于这样的延迟，实时互动的直播系统是根本无法接受的。

:::tip
基于以上的原因，在实现**实时互动直播系统的时候你必须使用 UDP 协议**。
:::

### RTP/RTCP

一般情况下，在实时互动直播系统传输音视频数据流时，我们并不直接将音视频数据流交给 UDP 传输，而是先给音视频数据加个 RTP 头，然后再交给 UDP 进行传输。为什么要这样做呢？

我们以视频帧为例，一个 I 帧的数据量是非常大的，最少也要几十K。而以太网的最大传输单元是多少呢？ 1.5K，所以要传输一个 I 帧需要几十个包。并且这几十个包传到对端后，还要重新组装成 I 帧，这样才能进行解码还原出一幅幅的图像。

如果是我们自己实现的话，要完成这样的过程，至少需要以下几个标识。

- **序号**：用于标识传输包的序号，这样就可以知道这个包是第几个分片了。

- **起始标记**：记录分帧的第一个 UDP 包。

- **结束标记**：记录分帧的最后一个 UDP 包。

有了上面这几个标识字段，我们就可以在发送端进行拆包，在接收端将视频帧重新再组装起来了。

#### 1. RTP 协议

![RTP 协议规范图](https://static001.geekbang.org/resource/image/ae/89/aec03cf4e1b76296c3e21ebbc54a2289.png)

如图所示，RTP 协议非常简单，我这里按字段的重要性从高往低的顺序讲解一下。

- **sequence number**：序号，用于记录包的顺序。这与上面我们自己实现拆包、组包是同样的道理。

- **timestamp**：时间戳，同一个帧的不同分片的时间戳是相同的。这样就省去了前面所讲的起始标记和结束标记。一定要记住，不同帧的时间戳肯定是不一样的。

- **PT**：Payload Type，数据的负载类型。音频流的 PT 值与视频的 PT 值是不同的，通过它就可以知道这个包存放的是什么类型的数据。

- **SSRC**：共享媒体流的源。它是全局唯一的，不同的SSRC表示不同的共享源。

- **CC**：CSRS count。CSRS的个数。

- **CSRC**：共享源。一般用在混音或者混屏上。举个例子，在一路音流中混合了好几个人的声音，那么这每一个人的声音就是一个CSRC。

- **X**：RTP扩展头标记。如果该位置为1，说明此RTP包还有扩展头。如果有扩展头，它就被放在CSRC之后。扩展头相关的具体内容等待我们后期使用到后再做详细介绍。

- **M**：Mark位。一般用于界定视频帧边界，但具体含义是由profile定义。

- **P**：填充位。包的末尾包含了一个或多个填充字节。其中填充的第一个字节后括了后面填充字节的总字节数，当然也包括它自己。

:::warning
**如果你想做音视频传输相关的工作，RTP 头中的每个字段的含义你都必须全部清楚。**
:::

知道了上面这些字段的含义后，下面我们还是来看一个具体的例子吧！假设你从网上接收到一组音视频数据，如下：

```
...
{V=2,P=0,X=0,CC=0,M=0,PT:98,seq:13,ts:1122334455,ssrc=2345},
{V=2,P=0,X=0,CC=0,M=0,PT:111,seq:14,ts:1122334455,ssrc=888},
{V=2,P=0,X=0,CC=0,M=0,PT:98,seq:14,ts:1122334455,ssrc=2345},
{V=2,P=0,X=0,CC=0,M=0,PT:111,seq:15,ts:1122334455,ssrc=888},
{V=2,P=0,X=0,CC=0,M=0,PT:98,seq:15,ts:1122334455,ssrc=2345},
{V=2,P=0,X=0,CC=0,M=0,PT:111,seq:16,ts:1122334455,ssrc=888},
{V=2,P=0,X=0,CC=0,M=0,PT:98,seq:16,ts:1122334455,ssrc=2345},
{V=2,P=0,X=0,CC=0,M=0,PT:111,seq:17,ts:1122334455,ssrc=888},
{V=2,P=0,X=0,CC=0,M=0,PT:98,seq:17,ts:1122334455,ssrc=2345},
{V=2,P=0,X=0,CC=0,M=0,PT:111,seq:18,ts:1122334455,ssrc=888},
{V=2,P=0,X=0,CC=0,M=0,PT:98,seq:18,ts:1122334455,ssrc=2345},
{V=2,P=0,X=0,CC=0,M=0,PT:111,seq:19,ts:1122334455,ssrc=888},
{V=2,P=0,X=0,CC=0,M=0,PT:98,seq:19,ts:1122334455,ssrc=2345},
{V=2,P=0,X=0,CC=0,M=0,PT:111,seq:20,ts:1122334455,ssrc=888},
{V=2,P=0,X=0,CC=0,M=1,PT:98,seq:20,ts:1122334455,ssrc=2345},
...

```

假设 PT=98 是视频数据，PT=111 是音频数据，那么按照上面的规则你是不是很容易就能将视频帧组装起来呢？

#### 2. RTCP 协议

在使用 RTP 包传输数据时，难免会发生丢包、乱序、抖动等问题，下面我们来看一下使用的网络一般都会在什么情况下出现问题：

- 网络线路质量问题引起丢包率高；

- 传输的数据超过了带宽的负载引起的丢包问题；

- 信号干扰（信号弱）引起的丢包问题；

- 跨运营商引入的丢包问题 ;

WebRTC 对这些问题在底层都有相应的处理策略，但在处理这些问题之前，它首先要让各端都知道它们自己的网络质量到底是怎样的，这就是 **RTCP** 的作用。



**RTCP 有两个最重要的报文：RR（Reciever Report）和 SR(Sender Report)。通过这两个报文的交换，各端就知道自己的网络质量到底如何了。**

- **SR 报文信息**

![SR报文信息](https://img-blog.csdnimg.cn/20210112160829428.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70#pic_center)

下面我们简要说明一下该报文中字段的含义：

- `V=2`，指报文的版本。

- `P`，表示填充位，如果该位置 1，则在 RTCP 报文的最后会有填充字节（内容是按字节对齐的）。

- `RC`，全称 Report Count，指 RTCP 报文中接收报告的报文块个数。

- `PT=200`，Payload Type，也就是说 SR 的值为 200。

- `length`：该长度包括了RTCP头、报文内容以及填充字节。

- `NTP timestamp`：每个发送包文的NTP时间戳。

- `RTP timestamp`：RTP时间戳。

- `sender's packet count`：发送的总包数。

- `sender's octet count`：发送的总字节数。

- `SSRC_n`：数据源n。

- `fraction lost`：8位，SSRC_n从上一次报告到本次报告的丢包比例。

- `cumulative number of packet lost`：SSRC_1的总丢包数。

- `extended highest sequence number received`：低16位表示收到的最大seq，高16位表示seq循环次数。

- `interarrival jitter`：RTP包到达时间间隔的统计方差。

- `LSR`：最后一个SR的时间戳。它是NTP时间戳中间的32位。如果没有收到SR，此段设为零。

- `DLSR`：32位，延迟以1 / 65536秒为单位，记录源SSRC_n 接收SR的实际与发送SR的时间差。

同样的，对于 RTCP 头中的每个字段也必须都非常清楚，只有这样以后你在看 WebRTC 带宽评估相关的代码时，才不至于晕头转向。

从上图中我们可以了解到，SR 报文分成三部分：`Header`、`Sender info` 和 `Report block`。

在 NTP 时间戳之上的部分为 SR 报文的 Header 部分，SSRC_1 字段之上到 Header 之间的部分为 Sender info 部分，剩下的就是一个一个的 Report Block 了。那这每一部分是用于干什么的呢？

- **Header** 部分用于标识该报文的类型，比如是 SR 还是 RR。

- **Sender info** 部分用于指明作为发送方，到底发了多少包。

- **Report block** 部分指明发送方作为接收方时，它从各个 SSRC 接收包的情况。

通过以上的分析，你可以发现 SR 报文并不仅是指发送方发了多少数据，它还报告了作为接收方，它接收到的数据的情况。当发送端收到对端的接收报告时，它就可以根据接收报告来评估它与对端之间的网络质量了，随后再根据网络质量做传输策略的调整。

**SR 报文与 RR 报文无疑是 RTCP 协议中最重要的两个报文，不过 RTCP 中的其他报文也都非常重要的，如果你想学好 WebRTC ，那么 RTCP 中的每个报文你都必须掌握。**

比如，RTCP 类型为 206、子类型为 4 的 FIR 报文，其含义是 Full Intra Request (FIR) Command，即**完整帧请求**命令。它起什么作用？又在什么时候使用呢？

该报文也是一个特别关键的报文，我为什么这么说呢？试想一下，在一个房间里有 3 个人进行音视频聊天，然后又有一个人加入到房间里，这时如果不做任何处理的话，那么第四个人进入到房间后，在一段时间内很难直接看到其他三个人的视频画面了，这是为什么呢？

原因就在于解码器在解码时有一个上下文。在该上下文中，必须先拿到一个 IDR 帧之后才能将其后面的 P 帧、B 帧进行解码。也就是说，在没有 IDR 帧的情况下，对于收到的 P 帧、B 帧解码器只能干瞪眼了。

如何解决这个问题呢？这就引出了 `FIR 报文`。当第四个人加入到房间后，它首先发送 FIR 报文，当其他端收到该报文后，便立即产生各自的 IDR 帧发送给新加入的人，这样当新加入的人拿到房间中其他的 IDR 帧后，它的解码器就会解码成功，于是其他人的画面也就一下子全部展示出来了。所以你说它是不是很重要呢？

:::tip
通过上面的介绍想我们应该已经对 RTP/ RTCP 有了比较深刻的认识了。

实际上，在 WebRTC 中还可以对 RTCP 做许多精确的控制，比如是否支持 FIR、NACK，以及 SR 和 RR 的发送间隔等，这些都是可以控制的， 在SDP篇将有更加详细的介绍。

在 WebRTC 中， RTP/RTCP 只是众多协议中的比较重要的两个，还有 SRTP/SRTCP、DTLS、STUN/TURN 协议等。
:::

#### RTCP PT类型介绍

| 编码 | 类型 | 含义 | 备注
|:--------| :-------------|:-------------|:-------------|
| `192` | FIR | full INTRA-frame request，关键帧请求 | RFC2032,已淘汰 |
| `193` | NACK | negative acknowledegment，未确认，丢白请求 | RFC2032,已淘汰 |
| `195` | IJ | Extended inter-arrival jitter report，jitter报告 | RFC5450 |
| `200` | SR | sender report，发送者报告 | RFC3550 |
| `201` | RR | receiver report，接收者报告 | RFC3550|
| `202` | SDES | source description，源描述项 | RFC3550 |
| `203` | BYE | goodbye，参与者结束会话 | RFC3550 |
| `204` | APP | application-defined，应用自定义 | RFC3550 |
| `205` | RTPFB | Transport layer FB message，传输层反馈 | RFC4585 |
| `206` | PSFB | Payload-Specific FeedBack，Payload反馈 | RFC4585 |

对于 205和 206两种不同的反馈消息，又在RFC5104中做了更详细的定义:

| 编码 | 子码 | 类型 | 含义 | 备注
|:---| :-----|:---|:----|:----------------|
| `205` | 1 | NACK | negarive acknowledement，未确认，丢包请求，替换192 | RFC5104 |
| `205` | 3 | TMMBR | Temporary Maximum Media Stream Bit Rate Request，临时最大媒体流码率请求 | RFC5104 |
| `205` | 4 | TMMBN | Temporary Maximum Media Stream Bit Rate Notification，临时最大媒体流码率通知，即TMMBR的响应 | RFC5104 |
| `205` | 15 | TW | Transport-wide RTCP Feedback Message，传输带宽反馈信息 | RFC5104 |
| `206` | 1 | PLI | Picture Loss Indication，图像丢失指示 | RFC5104 |
| `206` | 2 | SLI | Slice Lost Indication，片丢失指示 | RFC5104 |
| `206` | 3 | RPSI | Reference Picture Selection Indication| RFC5104 |
| `206` | 4 | FIR | Full Intra Request Command，完整帧请求  | RFC5104 |
| `206` | 5 | TSTR | Temporal-Spatial Trade-off Request，时空交换请求 | RFC5104 |
| `206` | 6 | TSTN | Temporal-Spatial Trade-off Notification，时空交换响应 | RFC5104 |
| `206` | 7 | VBCM | Video Back Channel Message | RFC5104 |
| `206` | 15 | - | Application Layer FB message | RFC5104 |

## WebRTC核心——SDP

说到 WebRTC 运转的核心，不同的人可能有不同的理解：有的人认为 WebRTC 的核心是音视频引擎，有的人认为是网络传输，而我则认为 WebRTC 之所以能很好地运转起来，完全是由 SDP 驱动的，**因此 SDP 才是 WebRTC 的核心。**

掌握了这个核心，你就知道 WebRTC 都支持哪些编解码器、每次通话时都有哪些媒体（通话时有几路音频 / 视频）以及底层网络使用的是什么协议，也就是说你就相当于拿到了打开 WebRTC 大门的一把钥匙。

> SDP（Session Description Protocal）说直白点就是用文本描述的各端（PC 端、Mac 端、Android 端、iOS 端等）的能力。这里的能力指的是各端所支持的音频编解码器是什么，这些编解码器设定的参数是什么，使用的传输协议是什么，以及包括的音视频媒体是什么等等。

下面是一个真实的 SDP 片段:

```
v=0
o=- 3409821183230872764 2 IN IP4 127.0.0.1
...
m=audio 9 UDP/TLS/RTP/SAVPF 111 103 104 9 0 8 106 105 13 110 112 113 126
...
a=rtpmap:111 opus/48000/2
a=rtpmap:103 ISAC/16000
a=rtpmap:104 ISAC/32000
...
```

上述SDP 中描述了一路音频流，即 m=audio，该音频支持的 Payload ( 即数据负载 ) 类型包括 111、103、104 等等。

在该 SDP 片段中又进一步对 111、103、104 等 Payload 类型做了更详细的描述，

如 a=rtpmap:111 opus/48000/2 表示 Payload 类型为 111 的数据是 OPUS 编码的音频数据，并且它的采样率是 48000，使用双声道。

以此类推，你也就可以知道 a=rtpmap:104 ISAC/32000 的含义是音频数据使用 ISAC 编码，采样频率是 32000，使用单声道。

### 交换 SDP 信息

交换 SDP 的目的是为了让对方知道彼此具有哪些能力，然后根据双方各自的能力进行协商，协商出大家认可的音视频编解码器、编解码器相关的参数（如音频通道数，采样率等）、传输协议等信息。

举个例子，A 与 B 进行通讯，它们先各自在 SDP 中记录自己支持的音频参数、视频参数、传输协议等信息，然后再将自己的 SDP 信息通过信令服务器发送给对方。当一方收到对端传来的 SDP 信息后，它会将接收到的 SDP 与自己的 SDP 进行比较，并取出它们之间的交集，这个交集就是它们协商的结果，也就是它们最终使用的音视频参数及传输协议了。

### 标准 SDP 规范

标准 SDP 规范主要包括 **SDP 描述格式** 和 **SDP 结构**，而 SDP 结构由**会话描述**和**媒体信息描述**两个部分组成。

其中，媒体信息描述是整个 SDP 规范中最重要的知识，它又包括了：

- 媒体类型
- 媒体格式
- 传输协议
- 传输的 IP 和端口

#### 1. SDP 的格式

SDP 是由多个 `<type>`=`<value>` 这样的表达式组成的。其中，`<type>`是一个字符，`<value>`是一个字符串。**需要特别注意的是，“=” 两边是不能有空格的**。如下所示：

```
v=0
o=- 7017624586836067756 2 IN IP4 127.0.0.1
s=-
t=0 0
...
```

SDP 由一个`会话级描述（session level description）`和多个`媒体级描述（media level description`）`组成。

- 会话级（session level）的作用域是整个会话，其位置是从 v= 行开始到第一个媒体描述为止。

- 媒体级（media level）是对单个的媒体流进行描述，其位置是从 m= 行开始到下一个媒体描述（即下一个 m=）为止。

另外，除非媒体部分重新对会话级的值做定义，否则会话级的值就是各个媒体的缺省默认值。让我们看个例子吧。

```
v=0
o=- 7017624586836067756 2 IN IP4 127.0.0.1
s=-
t=0 0

//下面 m= 开头的两行，是两个媒体流：一个音频，一个视频。
m=audio 9 UDP/TLS/RTP/SAVPF 111 103 104 9 0 8 106 105 13 126
...
m=video 9 UDP/TLS/RTP/SAVPF 96 97 98 99 100 101 102 122 127 121 125 107 108 109 124 120 123 119 114 115 116
...
```

从“v=”开始一直到“m=audio”，这之间的描述是会话级的；而后面的两个“m=”为媒体级。从中可以看出，在该 SDP 描述中有两个媒体流，一个是音频流，另一个是视频流。

#### 2. SDP 的结构

了解了 SDP 的格式，下面我们来看一下 SDP 的结构，它由**会话描述**和**媒体描述**两部分组成。

1. **会话描述**

    会话描述的字段比较多，下面四个字段比较重要，我们来重点介绍一下。

    **第一个，v=（protocol version，必选）**。例子：v=0 ，表示 SDP 的版本号，但不包括次版本号。

    **第二个，o=（owner/creator and session identifier，必选）**。例子：o=
    ，该例子是对一个会话发起者的描述。其中，

    - o= 表示的是对会话发起者的描述；

    - `<username>`: 用户名，当不关心用户名时，可以用 “－” 代替 ；

    - `<session id>`: 数字串，在整个会话中，必须是唯一的，建议使用 NTP 时间戳；

    - `<version>`: 版本号，每次会话数据修改后，该版本值会递增；

    - `<network type>`: 网络类型，一般为“IN”，表示“internet”；

    - `<address type>`: 地址类型，一般为 IP4；

    - `<address>`: IP 地址。

    **第三个，Session Name（必选）**。例子：s=，该例子表示一个会话，在整个 SDP 中有且只有一个会话，也就是只有一个 s=。

    **第四个，t=（time the session is active，必选）**。例子：t= ，该例子描述了会话的开始时间和结束时间。其中， 和 为 NTP 时间，单位是秒；当和均为零时，表示持久会话。

2. **媒体描述**

    媒体描述的字段也不少，下面我们也重点介绍四个。

    **第一个，m=（media name and transport address，可选）**。例子：m= `<media> <port> <transport> <fmt list>`，表示一个会话。在一个 SDP 中一般会有多个媒体描述。每个媒体描述以“m=”开始到下一个“m=”结束。其中，

    - `<media>`：媒体类型，比如 audio/video 等；

    - `<port>`：端口；

    - `<transport>`：传输协议，有两种——RTP/AVP 和 UDP；

    - `<fmt list>`：媒体格式，即数据负载类型 (Payload Type) 列表。

    **第二个，a=*（zero or more media attribute lines，可选）**。例子：a=`<TYPE>`或 a=`<TYPE>:<VALUES>`:， 表示属性，用于进一步描述媒体信息；在例子中，指属性的类型， a= 有两个特别的属性类型，即下面要介绍的 rtpmap 和 fmtp。

    **第三个，rtpmap（可选）**。例子：`a=rtpmap:<payload type> <encoding name>/<clock rate> [/<encodingparameters>]`。

    - rtpmap 是 rtp 与 map 的结合，即 RTP 参数映射表。

    - `<payload type>`: 负载类型，对应 RTP 包中的音视频数据负载类型。

    - `<encoding name>`: 编码器名称，如 VP8、VP9、OPUS 等。

    - `<sample rate>`: 采样率，如音频的采样率频率 32000、48000 等。

    - `<encodingparameters>`: 编码参数，如音频是否是双声道，默认为单声道。

    **第四个，fmtp**。例子：a=fmtp: `<payload type> <format specific parameters>`。

    - fmtp，格式参数，即 format parameters；

    - `<payload type>`，负载类型，同样对应 RTP 包中的音视频数据负载类型；

    - `<format specific parameters>` 指具体参数。

以上就是 SDP 规范的基本内容，了解了上面这些内容后，下面我们来看一下具体的例子，你就会对它有更清楚的认知了。

```js
// SDP版本号为0
v=0
// 会话相关信息 用户 - ，会话SessionID 4007659306182774937，会话版本号 2，网络类型 Internet，地址类型 IPV4，IP地址 本机
o=- 4007659306182774937 2 IN IP4 127.0.0.1
// 会话结束
s=-
// 开始时间0 结束时间0
t=0 0 
// 以上表示会话描述

...

// 下面的媒体描述，在媒体描述部分包括音频和视频两路媒体
m=audio 9 UDP/TLS/RTP/SAVPF 111 103 104 9 0 8 106 105 13 110 112 113 126
...
a=rtpmap:111 opus/48000/2 //对RTP数据的描述
a=fmtp:111 minptime=10;useinbandfec=1 //对格式参数的描述
...
a=rtpmap:103 ISAC/16000
a=rtpmap:104 ISAC/32000
...
// 上面是音频媒体描述，下面是视频媒体描述
m=video 9 UDP/TLS/RTP/SAVPF 96 97 98 99 100 101 102 122 127 121 125 107 108 109 124 120 123 119 114 115 116
...
a=rtpmap:96 VP8/90000
...
```

### WebRTC 中的 SDP

WebRTC 对标准 SDP 规范做了一些调整，它将 SDP 按功能分成几大块：

- **Session Metadata**，会话元数据

- **Network Description**，网络描述

- **Stream Description**，流描述

- **Security Descriptions**，安全描述

- **Qos Grouping Descriptions**， 服务质量描述

下图是他们之间的关系:

![关系图1](https://img-blog.csdnimg.cn/20210112175654353.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

![关系图2](https://img-blog.csdnimg.cn/20210112175654406.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

WebRTC SDP 中的会话元数据（Session Metadata）其实就是 SDP 标准规范中的会话层描述；流描述、网络描述与 SDP 标准规范中的媒体层描述是一致的；而安全描述与服务质量描述都是新增的一些属性描述。下图我们来看一个具体的例子：

```
...
//=======安全描述============
a=ice-ufrag:1uEe //进入连通性检测的用户名
a=ice-pwd:RQe+y7SOLQJET+duNJ+Qbk7z//密码，这两个是用于连通性检测的凭证
a=fingerprint:sha-256 35:6F:40:3D:F6:9B:BA:5B:F6:2A:7F:65:59:60:6D:6B:F9:C7:AE:46:44:B4:E4:73:F8:60:67:4D:58:E2:EB:9C //DTLS 指纹认证，以识别是否是合法用户
...
//========服务质量描述=========
a=rtcp-mux
a=rtcp-rsize
a=rtpmap:96 VP8/90000
a=rtcp-fb:96 goog-remb //使用 google 的带宽评估算法
a=rtcp-fb:96 transport-cc //启动防拥塞
a=rtcp-fb:96 ccm fir //解码出错，请求关键帧
a=rtcp-fb:96 nack    //启用丢包重传功能
a=rtcp-fb:96 nack pli //与fir 类似
...
```

上面的 SDP 片段是摘取的 WebRTC SDP 中的安全描述与服务质量描述，这两块描述在标准 SDP 规范中没有明确定义，它更多属于 WebRTC 业务的范畴。

:::tip

总结起来就是，SDP 是由一个会话层与多个媒体层组成，每个媒体层又分为媒体流描述、网络描述、安全描述和服务质量描述，而每种描述下面又是一堆细节的知识点。

:::

## WebRTC 是如何使用 SDP 规范进行媒体协商的？

> 简单地说，媒体协商就是看看你的设备都支持那些编解码器，我的设备是否也支持？如果我的设备也支持，那么咱们双方就算协商成功了。

此小节所涉及的内容包括创建连接和信令两部分。

- 创建连接，指的是创建 RTCPeerConnection，它负责端与端之间彼此建立 P2P 连接。在后面 RTCPeerConnection 一节中，我们还会对其做进一步的介绍。

- 信令，指的是客户端通过信令服务器交换 SDP 信息。

### WebRTC 中媒体协商的作用

在 WebRTC 1.0 规范中，在双方通信时，双方必须清楚彼此使用的编解码器是什么，也必须知道传输过来的音视频流的 SSRC信息，如果连这些最基本的信息彼此都不清楚的话，那么双方是无法正常通信的。

举个例子，如果 WebRTC 不清楚对方使用的是哪种编码器编码的数据，比如到底是 H264，还是 VP8？那 WebRTC 就无法将这些数据包正常解码，还原成原来的音视频帧，这将导致音视频无法正常显示或播放。

同样的道理，如果 WebRTC 不知道对方发过来的音视频流的 SSRC 是多少，那么 WebRTC 就无法对该音视频流的合法性做验证，这也将导致你无法观看正常的音视频。因为对于无法验证的音视频流，WebRTC 在接收音视频包后会直接将其抛弃。

:::tip

通过上面我们可以知道，媒体协商的作用就是让双方找到共同支持的媒体能力，如双方都支持的编解码器，从而最终实现彼此之间的音视频通信。

:::

### 那 WebRTC 是怎样进行媒体协商的呢？

1. 首先，通信双方将它们各自的媒体信息，如编解码器、媒体流的 SSRC、传输协议、IP 地址和端口等，按 SDP 格式整理好。

2. 然后，通信双方通过信令服务器交换 SDP 信息，并待彼此拿到对方的 SDP 信息后，找出它们共同支持的媒体能力。

3. 最后，双方按照协商好的媒体能力开始音视频通信。

WebRTC 进行媒体协商的步骤基本如上所述。接下来，我们来看看 WebRTC 具体是如何操作的。

**RTCPeerConnection**

讲到媒体协商，我们就不得不介绍一下 RTCPeerConnection 类， 顾名思义，它表示的就是端与端之间建立的连接。

该类是整个 WebRTC 库中最关键的一个类，通过它创建出来的对象可以做很多事情，如 NAT 穿越、音视频数据的接收与发送，甚至它还可以用于非音视频数据的传输等等 。

首先，我们来看一下如何创建一个 RTCPeerConnection 对象：

```js
var pcConfig = null;
var pc = new RTCPeerConnection(pcConfig);
```

在创建 RTCPeerConnection 对象时，还可以给它传一个参数 pcConfig，该参数的结构非常复杂，这里我们先将其设置为 null, 后面会再做详细的介绍。

有了 RTCPeerConnection 对象，接下来，让我们再来看看端与端之间是如何进行媒体协商的吧！

###  媒体协商的过程

**在通讯双方都创建好 RTCPeerConnection 对象后**，它们就可以开始进行媒体协商了。不过在进行媒体协商之前，有两个重要的概念，即 `Offer` 与 `Answer` ，你必须要弄清楚。

Offer 与 Answer 是什么呢？对于 1 对 1 通信的双方来说，我们称首先发送媒体协商消息的一方为呼叫方，而另一方则为被呼叫方。

- Offer，在双方通讯时，呼叫方发送的 SDP 消息称为 Offer。

- Answer，在双方通讯时，被呼叫方发送的 SDP 消息称为 Answer。

![协商过程](https://img-blog.csdnimg.cn/20210112194813729.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

首先，呼叫方创建 Offer 类型的 SDP 消息。创建完成后，调用 setLocalDescriptoin 方法将该 Offer 保存到本地 Local 域，然后通过信令将 Offer 发送给被呼叫方。

被呼叫方收到 Offer 类型的 SDP 消息后，调用 setRemoteDescription 方法将 Offer 保存到它的 Remote 域。作为应答，被呼叫方要创建 Answer 类型的 SDP 消息，Answer 消息创建成功后，再调用 setLocalDescription 方法将 Answer 类型的 SDP 消息保存到本地的 Local 域。最后，被呼叫方将 Answer 消息通过信令发送给呼叫方。至此，被呼叫方的工作就完部完成了。

接下来是呼叫方的收尾工作，呼叫方收到 Answer 类型的消息后，调用 RTCPeerConnecton 对象的 setRemoteDescription 方法，将 Answer 保存到它的 Remote 域。

至此，整个媒体协商过程处理完毕。

当通讯双方拿到彼此的 SDP 信息后，就可以进行媒体协商了。媒体协商的具体过程是在 WebRTC 内部实现的，我们就不去细讲了。你只需要记住本地的 SDP 和远端的 SDP 都设置好后，协商就算成功了。

### 媒体协商的代码实现

浏览器提供了几个非常方便的 API，这些 API 是对底层 WebRTC API 的封装。如下所示：

- createOffer ，创建 Offer；
- createAnswer，创建 Answer；
- setLocalDescription，设置本地 SDP 信息；
- setRemoteDescription，设置远端的 SDP 信息。

接下来，我们就结合上述的协商过程对这几个重要的 API 做下详细的讲解。

1. 呼叫方创建 Offer

当呼叫方发起呼叫之前，首先要创建 Offer 类型的 SDP 信息，即调用 RTCPeerConnection 的 createOffer() 方法。代码如下：

```js
function doCall() {
    console.log('Sending offer to peer');
    pc.createOffer(setLocalAndSendMessage, handleCreateOfferError);
}  
```

如果 createOffer 函数调用成功的话，浏览器会回调我们设置的 setLocalAndSendMessage 方法，你可以在 setLocalAndSendMessage 方法里获取到 RTCSessionDescription 类型的 SDP 信息；如果出错则会回调 handleCreateOfferError 方法。

最终，在 setLocalAndSendMessage 回调方法中，通过 `setLocalDescription()` 方法将本地 SDP 描述信息设置到 WebRTC 的 Local 域。然后通过信令通道将此会话描述发送给被呼叫方。代码如下所示：

```js
function setLocalAndSendMessage(sessionDescription) {
    pc.setLocalDescription(sessionDescription);
    sendMessage(sessionDescription);
}
```

2. 被呼叫方收到 Offer

被呼叫方收到 Offer 后，调用 `setRemoteDescription` 方法设置呼叫方发送给它的 Offer 作为远端描述。代码如下：

```js
socket.on('message', function(message) {
      ...
    } else if (message.type === 'offer') {
    
        pc.setRemoteDescription(new RTCSessionDescription(message));
        doAnswer();
    } else if (...) {
        ...
    }
    ....
});
```

3. 被呼叫方创建 Answer

然后，被呼叫方调用 RTCPeerConnection 对象的 createAnswer 方法，它会生成一个与远程会话兼容的本地会话，并最终将该会话描述发送给呼叫方。

```js
function doAnswer() {
    pc.createAnswer().then(
        setLocalAndSendMessage,
        onCreateSessionDescriptionError
    );
}
```

4. 呼叫方收到 Answer

当呼叫方得到被呼叫方的会话描述，即 SDP 时，调用 setRemoteDescription 方法，将收到的会话描述设置为一个远程会话。代码如下：

```js
socket.on('message', function(message) {
    ...
    } else if (message.type === 'answer') {
    
        pc.setRemoteDescription(new RTCSessionDescription(message));
    } else if (...) {
        ...
    }
    ....
});
```

此时，媒体协商过程完成。紧接着在 WebRTC 底层会收集 Candidate，并进行连通性检测，最终在通话双方之间建立起一条链路来。

以上就是通信双方交换媒体能力信息的过程。 对于你来说，如果媒体协商这个逻辑没搞清楚的话，那么，你在编写音视频相关程序时很容易出现各种问题，最常见的就是音视之间不能互通。

:::warning

另外，需要特别注意的是，通信双方链路的建立是在设置本地媒体能力，即调用 setLocalDescription 函数之后才进行的。

:::

## WebRTC连接的建立流程

在媒体协商过程中，如果双方能达成一致，也就是商量好了使用什么编解码器，确认了使用什么传输协议，那么接下来，WebRTC 就要建立连接，开始传输音视频数据了。

WebRTC 之间建立连接的过程是非常复杂的。之所以复杂，主要的原因在于它既要考虑`传输的高效性`，又要保证`端与端之间的连通率`。

换句话说，当同时存在多个有效连接时，它首先选择传输质量最好的线路，如能用内网连通就不用公网。另外，如果尝试了很多线路都连通不了，那么它还会使用服务端中继的方式让双方连通，总之，是“想尽办法，用尽手段”让双方连通。

对于**传输的效率与连通率**这一点，既是 WebRTC 的目标，也是 WebRTC 建立连接的基本策略。下面我们就来具体看一下 WebRTC 是如何达到这个目标的吧！

![WebRTC建立流程阶段](https://img-blog.csdnimg.cn/20210112205502536.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

### 连接建立的基本原则

接下来，我们将通过两个具体的场景，来了解一下 WebRTC 建立连接的基本原则。我们先设置一些假设条件，这样会更有利于我们下面的描述：

- 通信的双方我们称为 A 和 B；

- A 为呼叫方，B 为被呼叫方；

- C 为中继服务器，也称为 relay 服务器或 TURN 服务器。

#### 1. 场景一：双方处于同一网段内

A 与 B 进行通信，假设它们现在处于同一个办公区的同一个网段内。在这种情况下，A 与 B 有两种连通路径：

1. 一种是双方通过内网直接进行连接；

2. 另一种是通过公网，也就是通过公司的网关，从公网绕一圈后再进入公司实现双方的通信。

相较而言，显然第一种连接路径是最好的。 A 与 B 在内网连接就好了，谁会舍近求远呢？

但现实却并非如此简单，要想让 A 与 B 直接在内网连接，首先要解决的问题是： **A 与 B 如何才能知道它们是在同一个网段内呢？**

这个问题还真不好回答，也正是由于这个问题不太好解决，所以，现在有很多通信类产品在双方通信时，无论是否在同一个内网，它们都统一走了公网。不过，WebRTC 很好的解决了这个问题，后面我们可以看一下它是如何解决这个问题的。

#### 2. 场景二：双方处于不同点

A 与 B 进行通信，它们分别在不同的地点，比如一个在北京，一个在上海，此时 A 与 B 通信必须走公网。但走公网也有两条路径：

- 一是通过 P2P 的方式双方直接建立连接；

- 二是通过中继服务器进行中转，即 A 与 B 都先与 C 建立连接，当 A 向 B 发消息时， A 先将数据发给 C，然后 C 再转发给 B；同理， B 向 A 发消息时，B 先将消息发给 C，然后 C 再转给 A。

**对于 WebRTC 来讲，它认为通过中继的方式会增加 A 与 B 之间传输的时长，所以它优先使用 P2P 方式；如果 P2P 方式不通，才会使用中继的方式。**

通过上面的介绍，我们大致上已经知道了WebRTC 为了实现端与端之间连接的建立，做了非常多的工作。接下来我们来看看 WebRTC 建立连接的具体过程吧！

### 什么是 Candidate?

在讲解 WebRTC 建立连接的过程之前，我们要先了解一个基本概念，即 ICE Candidate （ICE 候选者）。它表示 WebRTC 与远端通信时使用的协议、IP 地址和端口，一般由以下字段组成：

- 本地 IP 地址
- 本地端口号
- 候选者类型，包括 host、srflx 和 relay
- 优先级
- 传输协议
- 访问服务的用户名

大致上长这么一个样子:

```
{
  IP: 127.0.0.1,
  port: 3333,
  type: host/srflx/relay,
  priority: number,
  protocol: UDP/TCP,
  usernameFragment: string
  ...
}
```

其中，候选者类型中的 host 表示本机候选者，srflx 表示内网主机映射的外网的地址和端口，relay 表示中继候选者。

当 WebRTC 通信双方彼此要进行连接时，每一端都会提供许多候选者，比如你的主机有两块网卡，那么每块网卡的不同端口都是一个候选者。

WebRTC 会按照上面描述的格式对候选者进行排序，然后按优先级从高到低的顺序进行连通性测试，当连通性测试成功后，通信的双方就建立起了连接。

:::tip
在众多候选者中，**host 类型的候选者优先级是最高的**。在 WebRTC 中，首先对 host 类型的候选者进行连通性检测，如果它们之间可以互通，则直接建立连接。

**其实，host 类型之间的连通性检测就是内网之间的连通性检测**。WebRTC 就是通过这种方式巧妙地解决了大家认为很困难的问题。
:::

同样的道理，如果 host 类型候选者之间无法建立连接，**那么 WebRTC 则会尝试次优先级的候选者，即 srflx 类型的候选者**。也就是尝试让通信双方直接通过 `P2P` 进行连接，如果连接成功就使用 P2P 传输数据；如果失败，就最后尝试使用 relay 方式建立连接。

### 收集 Candidate

了解了什么是 Candidate 之后，接下来，我们再来看一下端对端的连接是如何建立的吧。

实际上，端对端的建立更主要的工作是 **Candidate 的收集**。WebRTC 将 Candidate 分为三种类型：

1. host 类型，即本机内网的 IP 和端口；

2. srflx 类型, 即本机 NAT 映射后的外网的 IP 和端口；

3. relay 类型，即中继服务器的 IP 和端口。

在以上三种 Candidate 类型中，**host 类型的 Candidate 是最容易收集的**，因为它们都是本机的 IP 地址和端口。对于 host 类型的 Candidate 这里就不做过多讲解了，下面我们主要讲解一下 srflx 和 relay 这两种类型的 Candidate 的收集。

#### 1. STUN 协议

srflx 类型的 Candidate 实际上就是内网地址和端口经 NAT 映射后的外网地址和端口。如下图所示：

![STUN 协议](https://img-blog.csdnimg.cn/20210114112434196.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

我们知道，如果主机没有公网地址，是无论如何都无法访问公网上的资源的。

**而一般情况下，主机都只有内网 IP 和端口，那它是如何访问外网资源的呢？**

实际上，在内网的网关上都有 `NAT (Net Address Transport) 功能`，NAT 的作用就是进行内外网的地址转换。这样当你要访问公网上的资源时，NAT 首先会将该主机的内网地址转换成外网地址，然后才会将请求发送给要访问的服务器；服务器处理好后将结果返回给主机的公网地址和端口，再通过 NAT 最终中转给内网的主机。

上面的描述已经被定义成了一套规范，即 `RFC5389` ，也就是 `STUN` 协议，我们只要遵守这个协议就可以拿到自己的公网 IP 了。

我们再来看一个例子，看看通过 STUN 协议，主机是如何获取到自己的外网 IP 地址和端口的。

- 首先在外网搭建一个 STUN 服务器，现在比较流行的 STUN 服务器是 CoTURN，你可以到 GitHub 上自己下载源码编译安装。

- 当 STUN 服务器安装好后，从内网主机发送一个 binding request 的 STUN 消息到 STUN 服务器。

- STUN 服务器收到该请求后，会将请求的 IP 地址和端口填充到 binding response 消息中，然后顺原路将该消息返回给内网主机。此时，收到 binding response 消息的内网主机就可以解析 binding response 消息了，并可以从中得到自己的外网 IP 和端口。

#### 2. TURN 协议

:::tip
这里需要说明一点，relay 服务是通过 TURN 协议实现的。所以我们经常说的 relay 服务器或 TURN 服务器它们是同一个意思，都是指中继服务器。
:::

知道了内网主机如何通过 STUN 协议获取到 srflx 类型的候选者后，我们来看一下中继类型候选者，即 relay 型的 Candidate 又是如何获取的呢？

我们要清楚，**relay 型候选者的优先级与其他类型相比是最低的**，但在其他候选者都无法连通的情况下，relay 候选者就成了最好的选择。**因为它的连通率是所有候选者中连通率最高的**。

其实，relay 型候选者的获取也是通过 STUN 协议完成的，只不过它使用的 STUN 消息类型与获取 srflx 型候选者的 STUN 消息的类型不一样而已。

RFC5766 的 TURN 协议描述了如何获取 relay 服务器（即 TURN 服务器）的 Candidate 过程。其中最主要的是 Allocation 指令。通过向 TURN 服务器发送 Allocation 指令，relay 服务就会在服务器端分配一个新的 relay 端口，用于中转 UDP 数据报。

### NAT 打洞 /P2P 穿越

当收集到 Candidate 后，WebRTC 就开始按优先级顺序进行连通性检测了。它首先会判断两台主机是否处于同一个局域网内，如果双方确实是在同一局域网内，那么就直接在它们之间建立一条连接。

但如果两台主机不在同一个内网，WebRTC 将尝试 NAT 打洞，即 P2P 穿越。在 WebRTC 中，NAT 打洞是极其复杂的过程，它首先需要对 NAT 类型做判断，检测出其类型后，才能判断出是否可以打洞成功，只有存在打洞成功的可能性时才会真正尝试打洞。

**WebRTC 将 NAT 分类为 4 种类型，分别是：**

- 完全锥型 NATIP 
- 限制型 NAT
- 端口限制型 NAT
- 对称型 NAT

:::warning
- 对称型 NAT 与对称型 NAT 是无法进行 P2P 穿越的；

- 对称型 NAT 与端口限制型 NAT 也是无法进行 P2P 连接的。
:::

### ICE

了解上面的知识后，我们再来看下ICE。

> ICE 就是上面所讲的获取各种类型 Candidate 的过程，也就是：在本机收集所有的 host 类型的 Candidate，通过 STUN 协议收集 srflx 类型的 Candidate，使用 TURN 协议收集 relay 类型的 Candidate。

:::tip

**总结:**

WebRTC 端对端建立连接的基本过程:

1. 首先会尝试 NAT 穿越，即尝试端到端直连。如果能够穿越成功，那双方就通过直连的方式传输数据，这是最高效的。

2. 如果 NAT 穿越失败，为了保障通信双方的连通性，WebRTC 会使用中继方式，当然使用这种方式传输效率会低一些。

3. 整个过程中，WebRTC 使用**优先级**的方法去建立连接，即局域网内的优先级最高，其次是 NAT 穿越，再次是通过中继服务器进行中转，这样就巧妙地实现了“既要高效传输，又能保证连通率”这个目标。

当然这样的处理方式还有一些缺点，举个例子，对于同一级别多个 Candidate 的情况，WebRTC 就无法从中选出哪个 Candidate 更优了，它现在的做法是，在同一级别的 Candidate 中，谁排在前面就先用谁进行连接。

:::

## WebRTC NAT穿越原理

在我们真实的网络环境中，NAT 随处可见，而它的出现主要是出于两个目的。

**第一个是解决 IPv4 地址不够用的问题**

在 IPv6 短期内无法替换 IPv4 的情况下，如何能解决 IP 地址不够的问题呢？人们想到的办法是，让多台主机共用一个公网 IP 地址，然后在内部使用内网 IP 进行通信，这种方式大大减缓了 IPv4 地址不够用的问题。

**第二个是解决安全问题**

也就是主机隐藏在内网，外面有 NAT 挡着，这样的话黑客就很难获取到该主机在公网的 IP 地址和端口，从而达到防护的作用。

不过凡事有利也有弊，NAT 的引入确实带来了好处，但同时也带来了坏处。如果没有 NAT，那么每台主机都可以有一个自己的公网 IP 地址，这样每台主机之间都可以相互连接。如果设计成这样的话，互联网是不是会更加繁荣？因为有了公网 IP 地址后，大大降低了端与端之间网络连接的复杂度，我们也不用在这里理解 NAT 穿越的原理了。

![WebRTC NAT穿越阶段](https://img-blog.csdnimg.cn/20210114154740354.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

### NAT 的种类

随着人们对 NAT 使用的深入，NAT 的设置也越来越复杂。尤其是各种安全的需要，对 NAT 的复杂性起到了推波助澜的作用。

总的来说NAT 基本上可以总结成 4 种类型：完全锥型、IP 限制锥型、端口限制锥型和对称型。

1. 完全锥型 NAT

![完全锥形](https://img-blog.csdnimg.cn/20210114154916234.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

完全锥型 NAT 的特点是，当 host 主机通过 NAT 访问外网的 B 主机时，就会在 NAT 上打个“洞”，所有知道这个“洞”的主机都可以通过它与内网主机上的侦听程序通信。

这里所谓的“打洞”就是在 NAT 上建立一个内外网的映射表。你可以将该映射表简单地认为是一个 4 元组，大致上长这样：

```
{
  内网IP，
  内网端口，
  映射的外网IP，
  映射的外网端口
}
```

在 NAT 上有了这张映射表，所有发向这个“洞”的数据都会被 NAT 中转到内网的 host 主机。而在 host 主机上侦听其内网端口的应用程序就可以收到所有的数据了。

大多数的大洞都是采用 UDP 协议的，它没有连接状态的判断，也就是说只要你发送数据给它，它就能收到。而 TCP 协议就做不到这一点，它必须建立连接后，才能收发数据。

2. IP 限制锥型 NAT

![IP 限制锥型 NAT](https://img-blog.csdnimg.cn/20210114161004920.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

IP 限制锥型要比完全锥型 NAT 严格得多，它主要的特点是，host 主机在 NAT 上“打洞”后，NAT 会对穿越洞口的 IP 地址做限制。只有登记的 IP 地址才可以通过，也就是说，**只有 host 主机访问过的外网主机才能穿越 NAT**。

而其他主机即使知道“洞”的位置，也不能与 host 主机通信，因为在通过 NAT 时，NAT 会检查 IP 地址，如果发现发来数据的 IP 地址没有登记，则直接将该数据包丢弃。

结构上大致长这样:

```
{
  内网IP，
  内网端口，
  映射的外网IP，
  映射的外网端口，
  被访问主机的IP
}
```

:::warning
IP 限制型 NAT 只限制 IP 地址，如果是同一主机的不同端口穿越 NAT 是没有任何问题的。
:::

3. 端口限制锥型

![端口限制锥型](https://img-blog.csdnimg.cn/20210114161540100.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

端口限制锥型比 IP 限制锥型 NAT 更加严格，它主要的特点是，不光在 NAT 上对打洞的 IP 地址做了限制，而且还对具体的端口做了限制。其格式如下：

```
{
  内网IP，
  内网端口，
  映射的外网IP，
  映射的外网端口，
  被访问主机的IP,
  被访问主机的端口
}
```

4. 对称型 NAT

![对称型 NAT](https://img-blog.csdnimg.cn/20210114161654300.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

对称型 NAT 是所有 NAT 类型中最严格的一种类型。host 主机访问 B 时它在 NAT 上打了一个“洞”，而这个“洞”只有 B 主机上提供服务的端口发送的数据才能穿越。

:::tip
对称型 NAT 与端口限制型 NAT 最大的不同在于，如果 host 主机访问 A 时，它会在 NAT 上重新开一个“洞”，而不会使用之前访问 B 时打开的“洞”。

也就是说对称型 NAT 对每个连接都使用不同的端口，甚至更换 IP 地址，而端口限制型 NAT 的多个连接则使用同一个端口，这对称型 NAT 与端口限制型 NAT 最大的不同。
:::

它的这种特性为 NAT 穿越造成了很多麻烦，尤其是对称型 NAT 碰到对称型 NAT，或对称型 NAT 遇到端口限制型 NAT 时，基本上双方是无法穿越成功的。这也就是上述提到的无法穿越的原因。

### NAT 类型检测

通过上面的介绍，我们可以很容易判断出 NAT 是哪种类型，但对于每一台主机来说，它怎么知道自己是哪种 NAT 类型呢？

![NAT 类型检测流程](https://img-blog.csdnimg.cn/20210114162813852.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

上面这张图清楚地表达了主机进行 NAT 类型检测的流程。其中蓝框是几个重要的检测点，通过这几个检测点我们就可以很容易地检测出上面介绍的 4 种不同类型的 NAT 了。

接下里我们看下详细的解释,**这里需要注意的是，每台服务器都是双网卡的，而每个网卡都有一个自己的公网 IP 地址**。

#### 第一步，判断是否有 NAT 防护

1. 主机向服务器 #1 的某个 IP 和端口发送一个请求，服务器 #1 收到请求后，会通过同样的 IP 和端口返回一个响应消息。

2. 如果主机收不到服务器 #1 返回的消息，则说明用户的网络限制了 UDP 协议，直接退出。

3. 如果能收到包，则判断返回的主机的外网 IP 地址是否与主机自身的 IP 地址一样。如果一样，说明主机就是一台拥有公网地址的主机；如果不一样，就跳到下面的步骤 6。

4. 如果主机拥有公网 IP，则还需要进一步判断其防火墙类型。所以它会再向服务器 #1 发一次请求，此时，服务器 #1 从另外一个网卡的 IP 和不同端口返回响应消息。

5. 如果主机能收到，说明它是一台没有防护的公网主机；如果收不到，则说明有**对称型的防火墙**保护着它。

6. 继续分析第 3 步，如果返回的外网 IP 地址与主机自身 IP 不一致，说明主机是处于 NAT 的防护之下，此时就需要对主机的 NAT 防护类型做进一步探测。

#### 第二步，探测 NAT 环境

1. 在 NAT 环境下，主机向服务器 #1 发请求，服务器 #1 通过另一个网卡的 IP 和不同端口给主机返回响应消息。

2. 如果此时主机可以收到响应消息，说明它是在一个完全锥型 NAT 之下。如果收不到消息还需要再做进一步判断。

3. 如果主机收不到消息，它向服务器 #2（也就是第二台服务器）发请求，服务器 #2 使用收到请求的 IP 地址和端口向主机返回消息。

4. 主机收到消息后，判断从服务器 #2 获取的外网 IP 和端口与之前从服务器 #1 获取的外网 IP 和端口是否一致，如果不一致说明该主机是在**对称型 NAT** 之下。

5. 如果 IP 地址一样，则需要再次发送请求。此时主机向服务器 #1 再次发送请求，服务器 #1 使用同样的 IP 和不同的端口返回响应消息。

6. 此时，如果主机可以收到响应消息说明是 **IP 限制型 NAT**，否则就为**端口限制型 NAT**。

至此，主机所在的 NAT 类型就被准确地判断出来了。有了主机的 NAT 类型后，我们就很容易判断两个主机之间到底能不能成功地进行 NAT 穿越了。

:::tip

WebRTC 底层是如何进行音视频数据传输:

WebRTC 中媒体协商完成之后，就会对 Candidate pair 进行连通性检测，其中非常重要的一项工作就是进行 NAT 穿越。

首先通过上面描述的方法进行 NAT 类型检测，当检测到双方理论上是可以通过 NAT 穿越时，就开始真正的 NAT 穿越工作，如果最终真的穿越成功了，通信双方就通过该连接将音视频数据源源不断地发送给对方。

最终，我们就可以看到音视频了。

:::

通信实现方式表:

| 方式 | 解释
|:--------------| :-------------|
| `完全锥型-完全锥型` | A通过server获得B的IP:port开始通信
| `完全锥型-IP限制型` | B通过server获得A的IP:port开始通信
| `完全锥型-port限制型` | B通过server获得A的IP:port开始通信
| `完全锥型-对称型` | B通过server获得A的IP:port开始通信
| `IP限制型-IP限制型` | A通过server获得B的IP:port，A向B发送UDP包，数据通过自己的NAT时会为B建立NAT映射条目；B通过server获得A的IP:port，发送UDP包为A建立NAT映射条目，二者之后就可以开始通信。
| `IP限制型-port限制型` | A通过server获得B的IP:port，A向B发送UDP包，数据通过自己的NAT时会为B建立NAT映射条目；B通过server获得A的IP:port，发送UDP包为A建立NAT映射条目，二者之后就可以开始通信。
| `IP限制型-对称型` | A通过server获得B的IP:port1，A向B发送UDP包，数据通过自己的NAT时会为B建立NAT映射条目；B通过server获得A的IP:port，发送UDP包为A建立NAT映射条目，A收到B的UDP包，获得B新的IP:port2；A向B的新地址IP:port2发送数据，可以开始通信。
| `port限制型-对称型` | A通过server获得B的IP:port1，A向B发送UDP包，数据通过自己的NAT时会为B建立NAT映射条目；B通过server获得A的IP:port，发送UDP包为A建立NAT映射条目，但由于B更换了新端口port2，A刚建立的映射无法使用，A故此无法收到B为A通信使用的新端口，无法建立NAT映射，两者无法互通。
| `对称型-对称型` | 同上，对称型开启新端口对方无法获悉，无法建立链接。

**无法P2P就需要用TURN服务器转发数据了**。

##  如何通过Node.js实现一套最简单的信令系统？

WebRTC 1.0 规范对 WebRTC 要实现的功能、API 等相关信息做了大量的约束，比如规范中定义了如何采集音视频数据、如何录制以及如何传输等。甚至更细的，还定义了都有哪些 API，以及这些 API 的作用是什么。但这些约束只针对于客户端，并没有对服务端做任何限制。

那 WebRTC 规范中为什么不对服务器也做约束呢？其实，这样做有以下三点好处。

- **第一点，可以集中精力将 WebRTC 库做好**。WebRTC 的愿景是使浏览器能够方便地处理音视频相关的应用，规范中不限制服务端的事儿，可以使它更聚焦。

- **第二点，让用户更好地对接业务**。信令服务器一般都与公司的业务有着密切的关系，每家公司的业务都各有特色，让它们按照自已的业务去实现信令服务器会更符合它们的要求。

- **第三点，能得到更多公司的支持**。WebRTC 扩展了浏览器的基础设施及能力，而不涉及到具体的业务或产品，这样会更容易得到像苹果、微软这种大公司的支持，否则这些大公司之间就会产生抗衡。

当然，这样做也带来了一些坏处，最明显的一个就是增加了学习 WebRTC 的成本，因为我们在学习 WebRTC 的时候，必须自己去实现信令服务器，否则就没办法让 WebRTC 运转起来，这确实增加了不少学习成本。

### 在 WebRTC 处理过程中的位置

![信令服务器](https://img-blog.csdnimg.cn/20210128112649641.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

### WebRTC 信令服务器的作用

它的功能是蛮简单的，就是进行信令的交换，但作用却十分关键。在通信双方彼此连接、传输媒体数据之前，它们要通过信令服务器交换一些信息，如媒体协商。

举个例子，假设 A 与 B 要进行音视频通信，那么 A 要知道 B 已经上线了，同样，B 也要知道 A 在等着与它通信呢。**也就是说，只有双方都知道彼此存在，才能由一方向另一方发起音视频通信请求，并最终实现音视频通话**。

具体下来至少要实现下面两个功能：

1. 房间管理。即每个用户都要加入到一个具体的房间里，比如两个用户 A 与 B 要进行通话，那么它们必须加入到同一个房间里。

2. 信令的交换。即在同一个房间里的用户之间可以相互发送信令。

### 信令服务器的实现

了解了 WebRTC 信令服务器的作用，并且还知道了信令服务器要实现的功能，接下来我们就操练起来，看看如何实现信令服务器吧！我将从下面 5 个方面来逐步讲解如何实现一个信令服务器。

#### 1. 为什么选择 Node.js？

要实现信令服务器，我们可以使用 C/C++、Java 等语言一行一行从头开始编写代码，也可以以现有的、成熟的服务器为基础，做二次开发。具体使用哪种方式来实现，关键看服务器要实现什么功能，以及使用什么传输协议等信息来决策。

以上述的信令服务器为例，因它只需要传输几个简单的信令，而这些信令既可以使用 TCP、 HTTP/HTTPS 传输，也可以用 WebSocket/WSS 协议传输，所以根据它使用的传输协议，可以很容易地想到，通过 Web 服务器（如 Nginx、Node.js）来构建我们的信令服务器是最理想、最省时的、且是最优的方案。

我们可以根据自己的喜好选择不同的 Web 服务器（如 Apache、Nginx 或 Node.js）来实现，而今天我们选择的是 Node.js，所以接下来我们将要讲解的是如何使用 Node.js 来搭建信令服务器。

#### Node.js 的基本工作原理

![Node.js 的基本工作原理](https://img-blog.csdnimg.cn/20210128114833496.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

Node.js 的工作原理如上图所示，其核心是 V8 引擎。通过该引擎，可以让 JavaScript 调用 C/C++ 方法或对象。反过来讲，通过它也可以让 C/C++ 访问 JavaScript 方法和变量。

Node.js 首先将 JavaScript 写好的应用程序交给 V8 引擎进行解析，V8 理解应用程序的语义后，再调用 Node.js 底层的 C/C++ API 将服务启动起来。

**所以 Node.js 的强大就在于 JavaScript 与 C/C++ 可以相互调用，从而达到使其能力可以无限扩展的效果**。

我们以 Node.js 开发一个 HTTP 服务为例，Node.js 打开侦听的服务端口后，底层会调用 libuv 处理该端口的所有 HTTP 请求。其网络事件处理的过程就如下图所示：

![网络事件处理的过程](https://img-blog.csdnimg.cn/20210128115151838.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

当有网络请求过来时，首先会被插入到一个事件处理队列中。libuv 会监控该事件队列，当发现有事件时，先对请求做判断，如果是简单的请求，就直接返回响应了；如果是复杂请求，则从线程池中取一个线程进行异步处理。

线程处理完后，有两种可能：一种是已经处理完成，则向用户发送响应；另一种情况是还需要进一步处理，则再生成一个事件插入到事件队列中等待处理。事件处理就这样循环往复下去，永不停歇。

#### Socket.io 的使用

除了 Node.js 外，我们最终还要借助 Socket.io 来实现 WebRTC 信令服务器。Socket.io 特别适合用来开发 WebRTC 的信令服务器，通过它来构建信令服务器大大简化了信令服务器的实现复杂度，这主要是因为它内置了房间的概念。

![在这里插入图片描述](https://img-blog.csdnimg.cn/20210128115817757.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

Socket.io 分为服务端和客户端两部分。服务端由 Node.js 加载后侦听某个服务端口，客户端要想与服务端相连，首先要加载 Socket.io 的客户端库，然后调用 io.connect();即可与服务端连接上。

:::tip
Socket.io 有很多种发送消息的方式，其中最常见的有下面几种:

1. 给本次连接发消息

```
socket.emit()
```

2. 给某个房间内所有人发消息

```
io.in(room).emit()
```

3. 除本连接外，给某个房间内所有人发消息

```
socket.to(room).emit()
```

4. 除本连接外，给所有人发消息

```
socket.broadcast.emit()
```

其中 S 表示服务器，C 表示客户端，它们是发送消息与接收消息的比对。

1. 发送 command 命令

```
S: socket.emit('cmd’);
C: socket.on('cmd',function(){...});
```

2. 发送了一个 command 命令，带 data 数据

```
S: socket.emit('action', data);
C: socket.on('action',function(data){...});
```

3. 发送了 command 命令，还有两个数据

```
S: socket.emit(action,arg1,arg2);
C: socket.on('action',function(arg1,arg2){...});
```
:::

#### 实现信令服务器

这里简单介绍前后端的示例代码：

- 客户端

```js
var isInitiator;

room = prompt('Enter room name:'); //弹出一个输入窗口

const socket = io.connect(); //与服务端建立socket连接

if (room !== '') { //如果房间不空，则发送 "create or join" 消息
  console.log('Joining room ' + room);
  socket.emit('create or join', room);
}

socket.on('full', (room) => { //如果从服务端收到 "full" 消息
  console.log('Room ' + room + ' is full');
});

socket.on('empty', (room) => { //如果从服务端收到 "empty" 消息
  isInitiator = true;
  console.log('Room ' + room + ' is empty');
});

socket.on('join', (room) => { //如果从服务端收到 “join" 消息
  console.log('Making request to join room ' + room);
  console.log('You are the initiator!');
});

socket.on('log', (array) => {
  console.log.apply(console, array);
});
```

- 服务端

```js
const static = require('node-static');
const http = require('http');
const file = new(static.Server)();
const app = http.createServer(function (req, res) {
  file.serve(req, res);
}).listen(2013);

const io = require('socket.io').listen(app); //侦听 2013

io.sockets.on('connection', (socket) => {

  // convenience function to log server messages to the client
  function log(){ 
    const array = ['>>> Message from server: ']; 
    for (var i = 0; i < arguments.length; i++) {
      array.push(arguments[i]);
    } 
      socket.emit('log', array);
  }

  socket.on('message', (message) => { //收到message时，进行广播
    log('Got message:', message);
    // for a real app, would be room only (not broadcast)
    socket.broadcast.emit('message', message); //在真实的应用中，应该只在房间内广播
  });

  socket.on('create or join', (room) => { //收到 “create or join” 消息

  var clientsInRoom = io.sockets.adapter.rooms[room];
    var numClients = clientsInRoom ? Object.keys(clientsInRoom.sockets).length : 0; //房间里的人数

    log('Room ' + room + ' has ' + numClients + ' client(s)');
    log('Request to create or join room ' + room);

    if (numClients === 0){ //如果房间里没人
      socket.join(room);
      socket.emit('created', room); //发送 "created" 消息
    } else if (numClients === 1) { //如果房间里有一个人
    io.sockets.in(room).emit('join', room);
      socket.join(room);
      socket.emit('joined', room); //发送 “joined”消息
    } else { // max two clients
      socket.emit('full', room); //发送 "full" 消息
    }
    socket.emit('emit(): client ' + socket.id +
      ' joined room ' + room);
    socket.broadcast.emit('broadcast(): client ' + socket.id +
      ' joined room ' + room);
  });
});
```

## RTCPeerConnection：音视频实时通讯的核心

RTCPeerConnection 类是在浏览器下使用 WebRTC 实现 1 对 1 实时互动音视频系统最核心的类。

:::tip
SDP 是掌握 WebRTC 运行机制的钥匙，而 RTCPeerConnection 是使用 WebRTC 的钥匙
:::

### 传输要做哪些事儿?

假如我们要实现一套 1 对 1 的通话系统，首先会想到在每一端创建一个 socket，然后通过该 socket 与对端相连。

当 socket 连接成功之后，我们就可以通过 socket 向对端发送数据或者接收对端的数据了。

实际上，**RTCPeerConnection 类的工作原理与 socket 基本是一样的**，不过它的功能更强大，实现也更为复杂。因为它有很多细节需要处理。

- 端与端之间要建立连接，但它们是如何知道彼此的外网地址呢？

- 如果两台主机都是在 NAT 之后，它们又是如何穿越 NAT 进行连接的呢？

- 如果 NAT 穿越不成功，又该如何保证双方之间的连通性呢？

- 好不容易双方连通了，如果突然丢包了，该怎么办？

- 如果传输过程中，传输的数据量过大，超过了网络带宽能够承受的负载，又该如何保障音视频的服务质量呢？

- 传输的音视频要时刻保持同步，这又该如何做到呢？

- 数据在传输之前要进行音视频编码，而在接收之后又要做音视频解码，但 WebRTC 支持那么多编解码器，如 H264､ H265､ VP8､ VP9 等，它是如何选择的呢？

### 什么是 RTCPeerConnection？

了解了传输都要做哪些事之后，我们再理解什么是 RTCPeerConnection 就比较容易了。RTCPeerConnection 就与普通的 socket 一样，在通话的每一端都至少有一个 RTCPeerConnection 对象。在 WebRTC 中它负责与各端建立连接，接收、发送音视频数据，并保障音视频的服务质量。

在操作时，我们完全可以把它当作一个 socket 来用，而且还是一个具有超强能力的“SOCKET”。至于它是如何保障端与端之间的连通性，如何保证音视频的服务质量，又如何确定使用的是哪个编解码器等问题，使用时可以不必关心，因为所有的这些问题都已经在 RTCPeerConnection 对象的底层实现好了。

因此当有人问我们什么是 RTCPeerConnection时，我们可以简要的回答。**它就是一个功能超强的 socket！**。

### RTCPeerConnection 如何工作

假设 A 与 B 进行通信，那么对于每个端都要创建一个 RTCPeerConnection 对象，这样双方才可以通信。

在 WebRTC 端与端之间建立连接，包括三个任务：

1. 为连接的每个端创建一个 RTCPeerConnection 对象，并且给 RTCPeerConnection 对象添加一个本地流，该流是从 getUserMedia() 获取的；

2. 获取本地媒体描述信息，即 SDP 信息，并与对端进行交换；

3. 获得网络信息，即 Candidate（IP 地址和端口），并与远端进行交换。

:::danger
 iOS端只能用 safari，其它的浏览器都不能用 webrtc，之所以这样是因为苹果不允许其它浏览器访问底层 API，只能通过 webview实现浏览器。因此你会发现在iOS上只有 safari才能访问之前讲解的那些API.
:::

## 在WebRTC中如何控制传输速率呢？

通过 RTCPeerConnection 进行传输速率的控制实际上还是蛮简单的一件事儿，但是对掌握知识来说，我们不但要学习如何控制传输速率，同时还应该清楚为什么要对传输速率进行控制。

**之所以要进行传输速率的控制，是因为它会对音视频服务质量产生比较大的影响**。

### 音视频服务质量

虽然通过 RTCPeerConnection 在端与端之间建立连接后，音视频数据可以互通了，但你还应对传输速率有所控制。之所以要对传输速率进行控制，主要是为了提高音视频服务质量。

举个简单的例子，假设我们的带宽是 1Mbps，当我们与朋友进行音视频通话，使用的视频分辨率为 720P，帧率是 15 帧 / 秒，通话的质量将会是怎么样的?

咱们来简单计算一下，根据经验值，帧率为 15 帧 / 秒、分辨率为 720P 的视频，每秒钟大约要产生 1.2～1.5Mbps 的流量。然而我们的带宽只有1Mbps,超出带宽的数据会被直接丢弃掉，从而造成大量视频帧无法解码，所以最终效果一定会很差。

**因此，假如我们不对传输的帧率进行限制，那么最终的效果就会比较差**。

除了传输速率，以下这些因素也会对音视频质量产生影响:

- **网络质量**，包括物理链路的质量、带宽的大小、传输速率的控制等；

- **数据**，包括音视频压缩码率、分辨率大小、帧率等。

以上这些因素都会对音视频的服务质量产生影响,在真实的场景中，我们该怎么去区分它们呢?或者说怎么判断服务质量是不是由于传输速率问题引起的呢？

这里主要涉及到以下知识点:

#### 1. 物理链路质量

物理链路质量包括三个方面，即丢包、延迟和抖动。下面我们来看看它们是怎样影响服务质量的吧！

- **丢包**。这个比较好理解，如果物理链路不好，经常出现丢包，这样就会造成接收端无法组包、解码，从而对音视频服务质量产生影响。

- **延迟**。指通信双方在传输数据时，数据在物理链路上花费的时间比较长。对于实时通信来说，200ms 以内的延迟是最好的，这样通话双方的感觉就像是在面对面谈话；如果延迟是在 500 ms 以内，通话双方的体验也还不错，有点像打电话的感觉；如果延迟达到 800ms，还能接受，但有明显的迟滞现像；但如果延迟超过 1 秒，那就不是实时通话了！

- **抖动**。指的是数据一会儿快、一会儿慢，很不稳定。如果不加处理的话，你看到的视频效果就是一会儿快播了、一会儿又慢动作，给人一种眩晕的感觉，时间长了会非常难受。不过对于 WebRTC 来讲，它通过内部的 JitterBuffer（可以简单地理解为一块缓冲区）就能很好地解决该问题。

#### 2. 带宽大小

带宽大小指的是每秒钟可以传输多少数据。比如 1M 带宽，它表达的是每秒钟可以传输 1M 个 bit 位，换算成字节就是 1Mbps/8 = 128KBps，也就是说 1M 带宽实际每秒钟只能传输 128K 个 Byte。

当带宽固定的情况下，如何才能让数据传输得更快呢？

**答案是充分利用带宽**。它实际的含义是把带宽尽量占满，但千万别超出带宽的限制。

以 1M 带宽为例，如果每秒都传输 1M 的数据，这样传输数据的速度才是最快，多了、少了都不行。

#### 3. 传输速率

在实时通信中，与传输速率相关的有两个码率：`音视频压缩码率`和`传输控制码率`。

**音视频压缩码率**指的是单位时间内音视频被压缩后的数据大小，或者简单地理解为压缩后每秒的采样率。它与视频的清晰度是成反比的，也就是**压缩码率越高，清晰度越低**。

:::tip
所谓的有损压缩就是数据被压缩后，就无法再还原回原来的样子；而与有损压缩对应的是无损压缩，它是指数据解压后还能还原回来。

像我们日常中用到的 Zip、RAR、GZ 等这些压缩文件都是无损压缩。

对于有损压缩，你设备的压缩码率越高，它的损失也就越大，解码后的视频与原视频的差别就越大。
:::

**传输码率**指对网络传输速度的控制。

举个例子，假设我们发送的每个网络包都是 1500 字节，如果每秒钟发 100 个包，它的传输码率是多少呢？

即 100*1.5K = 150K 字节，再换算成带宽的话就是 150KB * 8 = 1.2M。但如果带宽是 1M，那每秒钟发 100 个包肯定是多了，这个时候就要控制发包的速度，把它控制在 1M 以内，并尽量地接近 1M，这样数据传输的速度才是最快的。

#### 4. 分辨率与帧率

我们知道，视频的分辨率越高，视频就越清晰，但同时它的数据量也就越大。

我们来简单计算一下，对于 1 帧未压缩过的视频帧，如果它的分辨率是 1280 * 720，存储成 RGB 格式，则这一帧的数据为 1280 * 720 * 3 * 8（3 表示 R、G、B 三种颜色，8 表示将 Byte 换算成 bit），约等于 22Mb；而存成 YUV420P 格式则约等于 11Mb，即 1280 * 720 * 1.5 * 8。

按照上面的公式计算，如果我们把视频的分辨率降到 640 * 360，则这一帧的数据就降到了原来的 1/4，这个效果还是非常明显的。所以，如果想降低码率，最直接的办法就是降分辨率。

当然，对帧率的控制也一样可以起到一定的效果。比如原来采集的视频是 30 帧 / 秒，还以分辨率是 1280 * 720 为例，之前 1 帧的数据是 22M，那 30 帧就是 22 * 30=660Mb。但如果改为 15 帧 / 秒，则数据就变成了 330Mb，直接减少了一半。

:::tip
实际上，通过减少帧率来控制码率的效果可能并不明显。因为在传输数据之前是要将原始音视频数据进行压缩的，在同一个 GOP（Group Of Picture）中，除了 I/IDR 帧外，B 帧和 P 帧的数据量是非常小的。
:::

### 传输速率的控制

通过上面的介绍，我们知道可以通过以下两种方式来控制传输速率。

1. 第一种是通过压缩码率这种“曲线救国”的方式进行控制；

2. 第二种则是更直接的方式，通过控制传输速度来控制速率。

第二种方式虽说很直接，但是也存在一些弊端。假设你有 10M 的数据要发送，而传输的速度却被限制为 5kbps，那它就只能一点一点地传。

:::warning
需要注意的是，由于 WebRTC 是实时传输，当它发现音视频数据的延迟太大，且数据又不能及时发出去时，它会采用主动丢数据的方法，以达到实时传输的要求。

**所以在 WebRTC 中速率的控制是使用压缩码率的方法来控制的，而不是直接通过传输包的多少来控制的**。
:::

```js
....
var vsender = null; //定义 video sender 变量
var senders = pc.getSenders(); //从RTCPeerConnection中获得所有的sender

//遍历每个sender
senders.forEach( sender => {
  if(sender && sender.track.kind === 'video'){ //找到视频的 sender
      vsender = sender; 
  }
});

var parameters = vsender.getParameters(); //取出视频 sender 的参数
if(!parameters.encodings){ //判断参数里是否有encoding域
    return;
}

//通过 在encoding中的 maxBitrate 可以限掉传输码率
parameters.encodings[0].maxBitrate = bw * 1000;

//将调整好的码率重新设置回sender中去，这样设置的码率就起效果了。
vsender.setParameters(parameters) 
       .then(()=>{
          console.log('Successed to set parameters!');
       }).catch(err => {
          console.error(err);
       })

...
```

## 如何打开/关闭音视频？

在实时互动直播系统中，打开 / 关闭音视频流是很常见的需求。作为一个直播用户，你至少会有下面几种需求:

- **将远端的声音静音**。比如来了一个电话，此时，应该先将直播中远端的声音关掉，等接完电话再将远端的声音打开，否则电话的声音与直播远端的声音会同时播放出来。

- **将自己的声音静音**。比如老板要找你谈话，这时你应该将直播中自己的声音静音，否则你与老板的一些私密谈话会被远端听到。比如被老板骂了，要是被远端听到可就尴尬了。

- **关闭远端的视频**。这个与远端声音静音差不多，只不过将声音改为视频了。比如当机子性能比较差的时候，为了节省资源，你可能会选择将远端的视频关闭掉。不过这种情况不是很多。

- **关闭自己的视频**。当你不想让对方看到自己的视频时，就可以选择关闭自己的视频。比如今天你的状态特别不好，你又特别在乎你的形象，此时你就可以选择关闭自己的视频。

针对实现上述所需的功能，我们来看看思路:

### 1. 将远端的声音静音

要实现这个功能，你可以通过在**播放端控制**和**发送端控制**两种方式实现。

- 在播放端有两种方法，一种是**不让播放器播出来**，另一种是**不给播放器喂数据，将收到的音频流直接丢弃**。在播放端控制的优点是实现简单；缺点是虽然音频没有被使用，但它仍然占用网络带宽，造成带宽的浪费。

- 在发送端控制也可以细分成两种方法实现，即**停止音频的采集**和**停止音频的发送**。对于 1 对 1 实时直播系统来说，这两种方法的效果是一样的。但对于多对多来说，它们的效果就大相径庭了。因为停止采集音频后，所有接收该音频的用户都不能收到音频了，这显然与需求不符；而停止向某个用户发送音频流，则符合用户的需求。

### 2. 将自己的声音静音

无论是 1 对 1 实时互动，还是多人实时互动，它的含义都是一样的，就是所有人都不能听到“我”的声音。因此，你只需**停止对本端音频数据的采集**就可以达到这个效果。

### 3. 关闭远端的视频

这与将“远端的声音静音”是类似的，要实现这个功能也是分为从播放端控制和从发送端控制两种方式。

不过它与“将远端的声音静音”也是有区别的，那就是：

- 从播放端控制**只能使用不给播放器喂数据这一种方法**，因为播放器不支持关闭视频播放的功能；

- 从发送端控制是**通过停止向某个用户发送视频数据**这一种方法来实现的。而另一个停止采集则不建议使用，因为这样一来，其他端就都看不到你的视频了。

### 4. 关闭自己的视频

其逻辑与“将自己的声音静音”相似。但我们不应该关闭视频的采集，而应该通过**关闭所有视频流的发送**来实现该需求。之所以要这样，是因为视频还有本地预览，只要视频设备可用，本地预览就应该一直存在。所以，“关闭自己的视频”与“将自己的声音静音”的实现是不一样的。


**代码实现部分**:

1. 将远端的声音静音

```html
<HTML>
...
<video id=remote autoplay muted playsinline/>
...
</HTML>
...
```
我们仅需要给video设置静音属性即可，需要开启的时候再开启。

```js
const remotevideo = document.querySelector('video#remote');
remotevideo.muted = false;
...
```

2. 播放端控制：丢掉音频流

当然在播放端还有另外一种办法实现远端的静音，即在收到远端的音视频流后，将远端的 AudioTrack 不添加到要展示的 MediaStream 中，也就是让媒体流中不包含音频流，这样也可以起到静音远端的作用。具体代码如下:

```js
...
var remoteVideo = document.querySelector('video#remote');
...
{
    //创建与远端连接的对象
    pc = new RTCPeerConnection(pcConfig);
    ...
    //当有远端流过来时，触发该事件
    pc.ontrack = getRemoteStream;
    ...
}
...

function getRemoteStream(e){
    //得到远端的音视频流
  remoteStream = e.streams[0];
    //找到所有的音频流
    remoteStream.getAudioTracks().forEach((track)=>{
      if (track.kind === 'audio') { //判断 track 是类型
        //从媒体流中移除音频流    
        remoteStream.removeTrack(track);
      }
    }); 
    //显示视频 
  remoteVideo.srcObject = e.streams[0];
}
...
```

3. 发送端控制：不采集音频

```js

...

//获取本地音视频流
function gotStream(stream) {
    localStream = stream;
    localVideo.srcObject = stream;
}

//获得采集音视频数据时限制条件
function getUserMediaConstraints() {
  
  var constraints =  { 
    "audio": false,
    "video": {
        "width": {
            "min": "640",
            "max": "1280"
        },
        "height": {
            "min": "360",
            "max": "720"
        }
    }
  };
  
  return constraints;
}

...
//采集音视频数据
function captureMedia() {
    ...
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }
      ...
      //采集音视频数据的 API
    navigator.mediaDevices.getUserMedia(getUserMediaConstraints())
      .then(gotStream)
      .catch(e => {
       ...
      });
}
...
```

上面的代码非常简单，captureMedia 函数用于采集音视频数据，在它里面实际是调用的浏览器 API getUserMedia 进行具体操作的。由于这里强调的是不采集音频数据，所以你可以看到在 getUserMediaConstraints 函数中，将音频关掉了，所以最后获取到的流中只有视频数据。

4. 发送端控制：关闭通道

通过远端关闭通道的方式也可以达到静音的效果。与方法 3 不采集音频类似，本地想让远端静音时，向信令服务器发送一条静音指令，信令服务器进行转发，远端收到指令后执行下面的代码：

```js
  ...
  var localStream = null;
  
  //创建peerconnection对象
  var pc = new RTCPeerConnection(server);
  ...
  
  //获得流
  function gotStream(stream){
    localStream = stream;
  }
  ...
  
  //peerconnection 与 track 进行绑定 
  function bindTrack() {
    //add all track into peer connection
    localStream.getTracks().forEach((track)=>{
      if(track.kink !== 'audio') {
        pc.addTrack(track, localStream);
      }
    });
  }
  
  ...
```

## WebRTC中的数据统计

当我们实现视频通话后，还有一个非常重要的工作需要做，那就是实现数据监控。

在 WebRTC 中可以监控很多方面的数据，比如收了多少包、发了多少包、丢了多少包，以及每路流的流量是多少，这几个是我们平常最关心的。除此之外，WebRTC 还能监控目前收到几路流、发送了几路流、视频的宽 / 高、帧率等这些信息。

有了这些信息，我们就可以评估出目前用户使用的音视频产品的服务质量是好还是坏了。当发现用户的音视频服务质量比较差时，尤其是网络带宽不足时，可以通过降低视频分辨率、减少视频帧率、关闭视频等策略来调整你的网络状况。

:::tip
实际上，要查看 WebRTC 的统计数据，我们不需要另外再开发一行代码，只要在 Chrome 浏览器下输入“chrome://webrtc-internals”这个 URL 就可以看到所有的统计信息了。

但它有一个前提条件，就是必须有页面创建了 RTCPeerConnection 对象之后，才可以通过这个 URL 地址查看相关内容。

因为在 Chrome 内部会记录每个存活的 RTCPeerConnection 对象，通过上面的访问地址，就可以从 Chrome 中取出其中的具体内容。
:::

## 此处内容待迁移

下面我们看一下，现代计算机图形处理的基本原理，如下图所示：

![现代计算机图形处理的基本原理](https://img-blog.csdnimg.cn/20210128172648217.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

图中 Graphic Memory、GPU、Video Controller 都是现代显卡的关键组成部分，具体处理过程大致可描述为如下。

- 应用程序处理的图形数据都是保存在 System Memory 中的，也就是我们经常所说的主内存中。需要硬件处理的时候，先将 System Memory 中的图形数据拷贝到 Graphic Memory 中。

- 然后，通过 CPU 指令通知 GPU 去处理图形数据。

- GPU 收到指令后，从 Graphic Memory 读取图形数据，然后进行坐标变换、着色等一系列复杂的运算后形成像素图，也就是 Video Frame，会存储在缓冲区中。

- 视频控制器从 Video Frame 缓冲区中获取 Video Frame，并最终显示在显示器上。

## 使用WebRTC进行文本聊天

WebRTC 中的数据通道（RTCDataChannel）是专门用来传输除了音视频数据之外的任何数据，它的应用非常广泛，如实时文字聊天、文件传输、远程桌面、游戏控制、P2P 加速等。

