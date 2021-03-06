# 直播概述

- 2020.07.02

## 直播的分类

从技术角度讲，映客、斗鱼、虎牙这类泛娱乐直播与在线教育、音视频会议直播有着非常大的区别。

在线教育、音视频会议这类直播属于`实时互动直播`,主要考虑`传输的实时性`，因此一般使用`UDP`作为底层传输协议。

而泛娱乐直播对实时性的要求不高、更多关注的是画面的质量、音视频是否卡顿等问题。所以一般采用`TCP`作为传输协议。

我们称之前者为`实时互动直播`，后者为`传统直播`。

## 传统直播

传统直播技术使用的传输协议是`RTMP`和`HLS`。


### RTMP

> `Real Time Messaging Protocol（简称 RTMP）`是 `Macromedia` 开发的一套视频直播协议，现在属于 `Adobe`。这套方案需要搭建专门的 `RTMP` 流媒体服务如 `Adobe Media Server`，并且在浏览器中只能使用 `Flash` 实现播放器。它的实时性非常好，延迟很小，但无法支持移动端 WEB 播放是它的硬伤。

RTMP的传输格式为`RTMP Chunk Format`,媒体流数据的传输和RTMP控制消息的传输都是基于此格式的。

:::warning
在使用RTMP协议传输数据之前，RTMP也像TCP协议一样,先进行三次握手才能将连接建立起来。

当RTMP连接建立起来之后，可以通过RTMP协议的控制消息为通信的双方设置传输窗口的大小(缓冲区的大小)、传输数据块的大小等。
:::

### HLS

> `HLS(HTTP Live Streaming)`是一个基于 `HTTP` 的视频流协议，由 `Apple` 公司实现，`Mac OS` 上的 `QuickTime`、`Safari` 以及 `iOS` 上的 `Safari` 都能很好的支持 `HLS`，高版本 `Android` 也增加了对 `HLS` 的支持。一些常见的客户端如：`MPlayerX`、`VLC` 也都支持 `HLS` 协议。

**优势:**

- RTMP协议没有使用标准的HTTP接口传输数据，在一些有访问限制的网络环境下，比如企业网防火墙，是没法访问外网的，因为企业的内部一般只允许80/443端口可以访问外网。而HLS使用的是HTTP传输协议，所以HLS协议天然就解决了这个问题。

- HLS协议本身实现了码率自适应，不同带宽的设备可以自动切换到最适合自己的码率的视频进行播放。

- 浏览器天然支持HLS协议，而RTMP协议需要安装Flash插件才能播放RTMP流。

**不足:**

- HLS最主要的问题是`实时性差`。由于HLS往往采用10s的切片，所以最小也要有10s的延时，一般是20~30s的延迟，有时候甚至更差。

- 之所以存在这么高的延时，主要是由于HLS的实现机制造成的。HLS采用的是HTTP短链接，而HTTP是基于TCP的，所以这意味着HLS需要不断地与服务器建立连接。TCP每次建立连接时都需要进行三次握手，断开连接的时候需要进行四次挥手，基于以上的这些复杂的原因，就造成了HLS延迟比较久的局面。

## 传统直播基本架构

![直播基础架构图](https://img-blog.csdnimg.cn/20200702134856899.jpg?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

从上图可以看出，直播体系由`直播客户端`、`聊天服务器`和`CDN 网络`组成。


### 直播客户端

> 直播客户端主要包括音视频数据的采集、编码、推流、拉流、解码与播放这几个功能。

:::tip
实际上这几个功能不是放置在一个客户端实现的。

作为主播来说，他不需要看到观众的视频或者听到观众的声音。

作为用户而言，他们与主播的互动是通过直播间内文字或者其他操作进行的。
:::

对于主播客户端来说，他可以从PC或者移动设备的摄像头、麦克风采集数据，然后对采集到的音视频数据进行编码，最后将编码的音视频数据按照RTMP协议推送给`CDN`源节点。

对于观众客户端来说，他首先从直播管理系统中获取到房间的流媒体地址，然后通过`RTMP`协议从边缘节点拉取音视频数据，并对获取到的音视频数据进行编码，最后进行视频的渲染与音频的播放。

### 聊天服务器

主要用于接口信令，并根据信令处理一些和业务相关的逻辑，如创建房间、加入房间、离开房间、送礼物、文字聊天等。

### CDN网络

主要用于媒体数据的分发。它内部的实现非常复杂，我们姑且先把它当作是一个黑盒子,只需要知道传给他的媒体数据可以很快传送给世界每一个角落。


## 主播的视频生成及推流

主播在客户端分享自己的音视频媒体流之前，首先要向聊天服务器发送"创建房间"的命令，服务器收到该命令之后给主播返回一个推流地址(CDN网络源站地址)；

此时主播客户端就可以通过音频设备进行音视频数据的采集和编码，生成RTMP消息，最终将媒体流推送给CDN网络。


## 用户的视频生成

当用户观看某个直播视频的时候，首先也像服务器发送请求，然后返回与之对应的最接近的CDN边缘节点，收到直播的地址后就可以从该地址拉取媒体流了。

:::tip
在传统直播系统中,一般推流都使用`RTMP`协议，而拉流可以选择`RTMP`或者`HLS`协议。
:::

## CDN网络的实现

> CDN网络的构造十分复杂(大致如下图)，一般情况下，它先在各运营商内构件云服务，然后将不同运营商的云服务通过光纤连接起来，从而实现跨运营商的全网CDN云服务。

![CDN网络的实现](https://img-blog.csdnimg.cn/20200702174905250.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

每个运营商云服务内部包含了多个节点,按照功能分为3类:

1. `源节点`: 用于接收用户推送的媒体流。

2. `主干节点`: 起到媒体数据快速传输的作用，比如与其他运营商传送媒体流。

3. `边缘节点`: 用于用户主动推流。一般边缘节点的数量众多，它会被部署到各地级市，主要解决网络最后一公里的问题。

## CDN网络的处理流程

当一个主播想将自己的音视频共享出去的时候，首先通过直播系统的信令服务器获取到可以推送媒体流的CDN源节点。CDN网络从源节点接收到媒体数据之后，会主动向各个主干节点传送流媒体数据，这样各个主干节点就会将媒体数据缓存起来了。当然这个缓冲区的大小是有限的，随着时间的流逝，缓冲区中的数据也在不断更替中。

当有用户想看某个直播节目时，会从直播系统的服务器中获取离自己最近的CDN边缘节点，然后到这个边缘节点去拉流。由于它是第一个在该节点拉流的用户，因此该CDN节点还没有用户想要的媒体流。

怎么办呢？这时候就要向主干节点发送请求。主干节点收到请求后，从自己的缓冲区中取出数据流源源不断的发送给边缘节点，这时边缘节点再将媒体数据发送给观众。

当第二个用户再次到改CDN边缘节点接流时，该节点发现该流已经在自己的缓存里了，就不在向主干节点请求，直接将媒体流下发下去了。因此，观众在使用CDN网络时会发现，第一个观众在接流时需要花很长的时间才能将流拉下来，可是后来的用户很快就会将流拉下来进行播放了。

以上就是 CDN 网络的基本原理，接下来我们再来看看 `RTMP` 协议与 `HLS` 协议的比较。

## RTMP 介绍

`RTMP`，全称 `Real Time Messaging Protocol` ，即`实时消息协议`。但它实际上并不能做到真正的实时，一般情况最少都会有几秒到几十秒的延迟，底层是基于 TCP 协议的。

RTMP 的传输格式为 `RTMP Chunk Format`，媒体流数据的传输和 RTMP 控制消息的传输都是基于此格式的。

:::tip

需要注意的是，在使用 RTMP 协议传输数据之前，RTMP 也像 TCP 协议一样，先进行三次握手才能将连接建立起来。

当 RTMP 连接建立起来后，你可以通过 RTMP 协议的控制消息为通信的双方设置传输窗口的大小（缓冲区大小）、传输数据块的大小等。

:::

## RTMP优势

- **RTMP 协议底层依赖于 TCP 协议**，不会出现丢包、乱序等问题，因此音视频业务质量有很好的保障。

- **使用简单，技术成熟**。有现成的 RTMP 协议库实现，如 FFmpeg 项目中的 librtmp 库，用户使用起来非常方便。而且 RTMP 协议在直播领域应用多年，技术已经相当成熟。

- **市场占有率高**。在日常的工作或生活中，我们或多或少都会用到 RTMP 协议。如常用的 FLV 文件，实际上就是在 RTMP 消息数据的最前面加了 FLV 文件头。

- **相较于 HLS 协议，它的实时性要高很多。**

## HLS 介绍

`HLS`，全称 `HTTP Live Streaming`，是苹果公司实现的基于 HTTP 的流媒体传输协议。它可以支持流媒体的直播和点播，主要应用在 iOS 系统和 HTML5 网页播放器中。

HLS 的基本原理非常简单，它是将多媒体文件或直接流进行切片，形成一堆的 ts 文件和 m3u8 索引文件并保存到磁盘。

当播放器获取 HLS 流时，它首先根据时间戳，通过 HTTP 服务，从 m3u8 索引文件获取最新的 ts 视频文件切片地址，然后再通过 HTTP 协议将它们下载并缓存起来。当播放器播放 HLS 流时，播放线程会从缓冲区中读出数据并进行播放。

通过上面的描述我们可以知道，**HLS 协议的本质就是通过 HTTP 下载文件，然后将下载的切片缓存起来**。由于切片文件都非常小，所以可以实现边下载边播的效果。HLS 规范规定，播放器至少下载一个 ts 切片才能播放，所以 HLS 理论上至少会有一个切片的延迟。

## HLS 直播架构

下面我们来看一下 HLS 直播系统的架构图，如下所示：

![HLS直播架构图](https://static001.geekbang.org/resource/image/c8/7a/c824a7d2fc85aa9583e10bc0dbff407a.png)

如上图所示，客户端采集媒体数据后，通过 RTMP 协议将音视频流推送给 CDN 网络的源节点（接入节点）。源节点收到音视频流后，再通过 Convert 服务器将 RTMP 流切割为 HLS 切片文件，即 .ts 文件。同时生成与之对应的 m3u8 文件，即 HLS 播放列表文件。

切割后的 HLS 分片文件（.ts 文件）和 HLS 列表文件（.m3u8 文件）经 CDN 网络转发后，客户端就可以从离自己最近的 CDN 边缘节点拉取 HLS 媒体流了。

在拉取 HLS 媒体流时，客户端首先通过 HLS 协议将 m3u8 索引文件下载下来，然后按索引文件中的顺序，将 .ts 文件一片一片下载下来，然后一边播放一边缓冲。此时，你就可以在 PC、手机、平板等设备上观看直播节目了。

对于使用 HLS 协议的直播系统来说，最重要的一步就是**切片**。源节点服务器收到音视频流后，先要数据缓冲起来，保证到达帧的所有分片都已收到之后，才会将它们切片成 TS 流。

为了便于分析，本文是通过 FFmpeg 工具将 MP4 文件切割成 HLS 格式的文件切片。但不管选择使用哪一种切割文件的方法或工具，生成的切片和索引文件的格式都是一致的。

## FFmpeg 生成 HLS 切片

这里我们是通过 FFmpeg 工具将一个 MP4 文件转换为 HLS 切片和索引文件的。所以，你需要预先准备一个 MP4 文件，并且下载好 FFmpeg 工具。你可以从FFmpeg 官网下载二进制包，也可以通过下载源码自行编译出 FFmpeg 工具。FFmpeg 用于将 MP4 切片成 HLS 的命令如下：

```sh
ffmpeg -i test.mp4 -c copy -start_number 0 -hls_time 10 -hls_list_size 0 -hls_segment_filename test%03d.ts index.m3u8
```

**参数说明:**

| 字段 | 解释
|:--------| :-------------|
| `-i` | 输入文件选项，可以是磁盘文件，也可以是媒体设备。
| `-c` | copy，表示只是进行封装格式的转换。不需要将多媒体文件中的音视频数据重新进行编码。
| `-start_number` | 表示 .ts 文件的起始编号，这里设置从 0 开始。当然，你也可以设置其他数字。 
| `-hls_time` | 表示每个 .ts 文件的最大时长，单位是秒。这里设置的是 10s，表示每个切片文件的时长，为 10 秒。当然，由于没有进行重新编码，所以这个时长并不准确。
| `-hls_list_size` | 表示播放列表文件的长度，0 表示不对播放列表文件的大小进行限制。
| `-hls_segment_filename` | 表示指定 TS 文件的名称。
| `index.m3u8` | 表示索引文件名称。

## m3u8 格式分析

HLS 必须要有一个 .m3u8 的索引文件 。它是一个播放列表文件，文件的编码必须是 UTF-8 格式。一个典型的文件格式如下:

```js
#EXTM3U
#EXT-X-VERSION:3            // 版本信息
#EXT-X-MEDIA-SEQUENCE:753   //分片起始编号
#EXT-X-TARGETDURATION:6     //每个分片的目标时长
#EXTINF:6.099,              //分片实际时长
pili-live-rtmp.xxx.com_1708021247HmBHAG-1590389214780.ts //分片文件
#EXTINF:6.050,              //第二个分片实际时长
pili-live-rtmp.xxx.com_1708021247HmBHAG-1590389220884.ts //第二个分片文件
#EXTINF:6.096,              //第三个分片实际时长
pili-live-rtmp.xxx.com_1708021247HmBHAG-1590389226932.ts //第三个分片文件
```

RFC8216 规定，.m3u8 文件内容以#字母开头的行是注释和 TAG，其中 TAG 必须是#EXT 开头，如上面示例中的内容所示。

接下来，我们对这几个 TAG 做一下说明：

- `EXTM3U` 表示文件是第一个扩展的 M3U8 文件，此 TAG 必须放在索引文件的第一行。

- `EXT-X-VERSION`: n 表示索引文件支持的版本号，后面的数字 n 是版本号数字。需要注意的是，一个索引文件只能有一行版本号 TAG，否则播放器会解析报错。

- `EXT-X-TARGETDURATION`: s 表示 .ts 切片的最大时长，单位是秒（s）。

- `EXT-X-MEDIA-SEQUENCE`: number 表示第一个 .ts 切片文件的编号。若不设置此项，就是默认从 0 开始的。

- `EXTINF`: duration, title 表示 .ts 文件的时长和文件名称。文件时长不能超过#EXT-X-TARGETDURATION中设置的最大时长，并且时长的单位应该采用浮点数来提高精度。

## TS 格式分析

TS 流最早应用于数字电视领域，其格式非常复杂，包含的配置信息表多达十几个。TS 流中的视频格式是 MPEG2 TS ，格式标准是在 ISO-IEC 13818-1 中定义的。

苹果推出的 HLS 协议对 MPEG2 规范中的 TS 流做了精减，只保留了两个最基本的配置表 PAT 和 PMT，再加上音视频数据流就形成了现在的 HLS 协议。也就是说， HLS 协议是由 PAT + PMT + TS 数据流组成的。其中，TS 数据中的视频数据采用 H264 编码，而音频数据采用 AAC/MP3 编码。TS 数据流示意图如下所示：

![](https://static001.geekbang.org/resource/image/21/3b/218e0c1907aa9454fc52f09971f72d3b.png)

我们再进一步细化，TS 数据流由 TS Header 和 TS Payload 组成。其中，TS Header 占 4 字节，TS Payload 占 184 字节，即 TS 数据流总长度是 188 字节。

TS Payload 又由 PES Header 和 PES Payload 组成。其中，PES Payload 是真正的音视频流，也称为 ES 流。

- PES（Packet Elementary Stream）是将 ES 流增加 PES Header 后形成的数据包。

- ES（Elementary Stream），中文可以翻译成基流，是编码后的音视频数据。

**下面我们就来分析一下 TS 数据流的格式，如下图所示：**

![](https://static001.geekbang.org/resource/image/da/b3/daa454df3de7549315e23c8c6aba90b3.png)

这是 TS Header 各个字段的详细说明，图中数字表示长度，如果数字后面带有 bytes ，单位就是 bytes；否则，单位都是 bit。

**TS Header 分为 8 个字段，下面我们分别解释一下：**

![](https://static001.geekbang.org/resource/image/69/d5/694380ee55bd65f07bc8add74d7cf6d5.png)

**PES Packet 作为 TS 数据流的 Payload，也有自己的 Header，如下图所示：**

![](https://static001.geekbang.org/resource/image/53/6f/53b0c557047c1074cc649abe34159e6f.png)

下面我们就对这些常用的字段一一做下解释，当然也还有很多不常用的字段，我们这里就不列出来了，如有需求，可参考 ISO-IEC 13818-1 2.4.3.7 节。

PES Header 长度是 6 字节，字段说明如下：

![](https://static001.geekbang.org/resource/image/da/96/da31564a8c42e24a1b3538ccdf307e96.png)

另外，PTS（Presentation Tmestamp） 字段总共包含了 40 bit，高 4 个 bit 固定取值是 0010；剩下的 36 个 bit 分三部分，分别是：3 bit+1 bit 标记位；15 bit+1 bit 标记位；15 bit+1 bit 标记位。

### 思考时间

每个 TS 格式数据包是 188 字节长，不够 188 字节就需要用 Padding 填充，那为什么要限制成 188 字节呢？

## HLS优势

1. RTMP 协议没有使用标准的 HTTP 接口传输数据，在一些有访问限制的网络环境下，比如企业网防火墙，是没法访问外网的，因为企业内部一般只允许 80/443 端口可以访问外网。而 HLS 使用的是 HTTP 协议传输数据，所以 HLS 协议天然就解决了这个问题。

2. HLS 协议本身实现了码率自适应，不同带宽的设备可以自动切换到最适合自己码率的视频进行播放。

3. 浏览器天然支持 HLS 协议，而 RTMP 协议需要安装 Flash 插件才能播放 RTMP 流。

## HLS劣势

HLS 最主要的问题就是实时性差。由于 HLS 往往采用 10s 的切片，所以最小也要有 10s 的延迟，一般是 20～30s 的延迟，有时甚至更差。

HLS 之所以能达到 20～30s 的延迟，主要是由于 HLS 的实现机制造成的。HLS 使用的是 HTTP 短连接，且 HTTP 是基于 TCP 的，所以这就意味着 HLS 需要不断地与服务器建立连接。TCP 每次建立连接时都要进行三次握手，而断开连接时，也要进行四次挥手，基于以上这些复杂的原因，就造成了 HLS 延迟比较久的局面。

## 如何选择 RTMP 和 HLS

- 流媒体接入，也就是推流，应该使用 RTMP 协议。

- 流媒体系统内部分发使用 RTMP 协议。因为内网系统网络状况好，使用 RTMP 更能发挥它的高效本领。

- 在 PC 上，尽量使用 RTMP 协议，因为 PC 基本都安装了 Flash 播放器，直播效果要好很多。

- 移动端的网页播放器最好使用 HLS 协议。

- iOS 要使用 HLS 协议，因为不支持 RTMP 协议。

- 点播系统最好使用 HLS 协议。因为点播没有实时互动需求，延迟大一些是可以接受的，并且可以在浏览器上直接观看。

## video.js

`video.js` 对大多数的浏览器做了兼容。它设计了自己的播放器 UI，接管了浏览器默认的`<video>`标签，提供了统一的 HTML5/CSS 皮肤。因此，通过 `video.js` 实现的播放器，在大多数浏览器上运行时都是统一的风格和操作样式，这极大地提高了我们的开发效率。

**除了上面介绍的特点外，`video.js` 还有以下优势：**

- 开源、免费的。不管你是学习、研究，还是产品应用，video.js 都是不错的选择。

- 轻量。浏览器 UI 的展现全部是通过 HTML5/CSS 完成，没有图片的依赖。

- 完善的 API 接口文档，让你容易理解和使用。

- 统一的 UI 设计，不管在哪个浏览器，你都看不出任何差异。

- 皮肤可以任意更换，很灵活。

- 开放灵活的插件式设计，让你可以集成各种媒体格式的播放器。

- 支持多种文字语言，如中文、英文等。

### video.js 的架构

HTML5 为媒体播放新增了很多新的元素，比如`<audio>`、`<video>`、`<source>`等，这些内置标签基本上可以满足我们日常的需求。而 `video.js` 把这些组件统统都实现了一遍，其主要目的是为了适配不同浏览器的差异，为各浏览器提供统一的 UI 展示和个性化定制。

接下来，我们来看看 `video.js` 都包含了哪些主要组件，如下图所示：

![video.js架构](https://static001.geekbang.org/resource/image/a1/fc/a1bce32b2e8d47b6a13214cda9d5fdfc.png)

通过该图可以看到，video.js 主要包括对多种文字语言支持、CSS 样式定制、控件部分、媒体内嵌元素部分和外部插件五大部分。下面我们来简要介绍下这每一部分的相关信息。

1. 第一部分是 Language。它在 `video.js/language` 目录下面，支持多种文字语言切换。

2. 第二部分是 CSS 样式。video.js 的 CSS 样式是可以更换的，支持个性化定制。

3. 第三部分是 Component。Component 是 video.js 中 UI 控件的抽象类，在 Component 中封装了 HTML 元素。Control Bar、Menu、Slider、Tech 都是继承自 Component，叫做子组件，子组件也可以有子组件，这样就形成了一棵树。这样设计的目的就是将播放器相关控件模拟成 DOM 树模型。下面是子组件的功能：

    - Control Bar，播放器的控制模块。调节音量、播放进度拖动等都由该模块完成。

    - Menu，播放器右键菜单的实现。

    - Slider，滚动条控件。可以是垂直滚动条，也可以是水平滚动条。音量滚动条、进度滚动条都是它的子类。
    - Tech，是 Technique 的缩写，表示采用的播放器技术。其实它就是为播放器插件提供抽象接口。video.js 默认使用的是 HTML5 播放器。

4. 第四部分是 EventTarget。HTML5 除了提供了`<audio>`、`<video>`、`<source>`这些可见元素，还包括了 Media Source 的概念。像 AudioTrack、VideoTrack、TextTrack、Track 都继承自 Media Source，video.js 把它们也都进行了抽象，这些对象都统一实现了 EventTarget 接口。这几个 Track 的作用如下：

    - `AudioTrack`，音频轨，也是音频媒体源。
    
    - `VideoTrack`，视频轨，也是视频媒体源。
    
    - `TextTrack`，文字轨，也是文字媒体源。比如给视频添加字幕就可以使用它，对应于`<track>`标签。
    
    - `Track` ，媒体源的公共抽象。你一定要将它与 区分开来，这两个不是同一回事。这一点需要你注意一下。

5. 第五部分是插件。video.js 支持播放器插件开发，目前已经有很多插件实现了。在上图中我们只列举了 3 个插件：

    - `HTTP Streaming`，可以播放 HLS 协议、DASH 协议的媒体流。
    
    - `Flash`，用于播放 RTMP 媒体流。但目前各大浏览器默认都是禁止使用 Flash 的。经测试，Chrome 浏览器和 IE 新版本浏览器都已不能使用 Flash 播放 RTMP 流了。
    
    - `YouTube`，是企业定制插件。


### video.js 播放 MP4

接下来我们就来实战一下，使用 video.js 播放一个本地 MP4 文件，具体代码如下：

```js
//引入video.js库
<link href="https://unpkg.com/video.js/dist/video-js.min.css" rel="stylesheet">
<script src="https://unpkg.com/video.js/dist/video.min.js"></script>

//使用 video 标签描述MP4文件
<video
    id="local_mp4"
    class="video-js"
    controls
    preload="auto"
    poster="//vjs.zencdn.net/v/oceans.png"
    data-setup='{}'>
    <source src="d:/test.mp4" type="video/mp4"></source>
</video>
```

### video.js 播放 HLS

在使用 video.js 播放 HLS 媒体流之前，我们需要先创建一个 HTML5 文件，如 play_hls.html，在 HTML5 文件中的内容如下：

```js

//引入 video.js 库 
<link href="https://unpkg.com/video.js/dist/video-js.min.css" rel="stylesheet">
<script src="https://unpkg.com/video.js/dist/video.min.js"></script>

//设置video标签
<video id="my-hls-player" class="video-js">
  <source src="http://localhost:8000/live/test/index.m3u8" type="application/x-mpegURL"></source>
</video>

<script>
//创建 HLS 播放器实例
var player = videojs('my-hls-player', {
  controls:true,
  autoplay:true,
  preload:'auto'
});

player.ready(function(){
  console.log('my-hls-player ready...');
});
</script>

```

video.js 的官方文档对如何使用 video.js 描述得非常详细，你可以自行查阅使用手册。这里我们只简要分析一下代码片段中用到的接口：

- 从官方指定的 CDN 获取 video.min.js 和 video-js.min.css 文件。需要注意的是，从 video.js 7 开始，HLS 插件默认包含在 video.js 里了。此时，我们就不需要再单独引入 HLS 插件了。

- `<video>`标签中需要指定 ID，这个 ID 是可以随便起的，我们这里设置的是 my-hls-player。`<video>`标签的 CSS 样式采用的是官方提供的默认样式 video-js。当然，你也可以定制自己喜欢的样式。

- `<source>`标签中的 src 属性，指定了 m3u8 播放地址。我们这里设置的地址是 `http://localhost:8000/live/test/index.m3u8` 。需要注意的是，type 属性必须是 application/x-mpegURL。

- 在代码的最后实现了 player 实例的 ready 回调函数口，这样当播放器加载完成后触发 ready 事件时，player 的 ready 函数就会被调用。

现在我们就来测试一下吧。通过 FFmpeg 工具向地址 `rtmp://IP/live/test` 推流，而 HLS 协议媒体流的播放地址为 `http://IP:port/live/test/index.m3u8`，再通过浏览器打开 `play_hls.html` 页面，就可以看到 HLS 协议的画面了。


