# video.js指南

- 2021.03.10

最近在封装通用的视频播放器组件,目前采用的方案是社区推荐的`video.js`,鉴于[官方的文档](https://docs.videojs.com/currenttimedisplay)是纯英文的,而且国内相关的文档和例子都比较少,在此做一个总结及梳理,方便后期进行回顾,目前教程中的版本是`7.11.5`。

## 安装

- 推荐使用`npm`进行安装。

```js
// npm
npm install video.js
// yarn
yarn add video.js
```

- 使用`script`脚本进行安装

```html
<!-- unpkg : 使用最新版本的video.js -->
<link href="https://unpkg.com/video.js/dist/video-js.min.css" rel="stylesheet">
<script src="https://unpkg.com/video.js/dist/video.min.js"></script>

<!-- unpkg : 使用指定版本的video.js -->
<link href="https://unpkg.com/video.js@7.10.2/dist/video-js.min.css" rel="stylesheet">
<script src="https://unpkg.com/video.js@7.10.2/dist/video.min.js"></script>
```

## 使用

`video.js`有两种使用方式,推荐使用`js`进行书写,这样方便我们更加精准的进行控制。

- 使用`html`标签加上对应属性

使用`html`的方式时,我们需要在对应的`video`标签上添加`video-js`的类名并且指定`data-setup={}`。

:::warning
这里的`data-setup`属性不能缺省，否则会报错。
:::

```html
<video
    id="my-player"
    class="video-js"
    controls
    preload="auto"
    poster="//vjs.zencdn.net/v/oceans.png"
    data-setup='{}'
>
    <source src="//vjs.zencdn.net/v/oceans.mp4" type="video/mp4"></source>
    <source src="//vjs.zencdn.net/v/oceans.webm" type="video/webm"></source>
    <source src="//vjs.zencdn.net/v/oceans.ogv" type="video/ogg"></source>
    <p class="vjs-no-js">
        To view this video please enable JavaScript, and consider upgrading to a
        web browser that
        <a href="https://videojs.com/html5-video-support/" target="_blank">
        supports HTML5 video
        </a>
    </p>
</video>
```

- 使用`js`初始化

```js
<script>
    var player = videojs(document.getElementById('video'), {
    controls: true, // 是否显示控制条
    poster: 'xxx', // 视频封面图地址
    preload: 'auto', // 参见preload属性
    autoplay: false, // 是否自动播放
    fluid: true, // 自适应宽高
    language: 'zh-CN', // 设置语言
    muted: false, // 是否静音
    inactivityTimeout: false,
    controlBar: { // 设置控制条组件
        /* 设置控制条里面组件的相关属性及显示与否  */
        'currentTimeDisplay':true,
        'timeDivider':true,
        'durationDisplay':true,
        'remainingTimeDisplay':false,
        volumePanel: {
        inline: false,
        }
        /* 使用children的形式可以控制每一个控件的位置，以及显示与否 */
        children: [
            {name: 'playToggle'}, // 播放/暂停按钮
            {name: 'currentTimeDisplay'}, // 视频当前已播放时间
            {name: 'progressControl'}, // 播放进度条
            {name: 'durationDisplay'}, // 视频播放总时间
            { // 倍数播放，可以自己设置
                name: 'playbackRateMenuButton',
                'playbackRates': [0.5, 1, 1.5, 2, 2.5]
            },
            {
                name: 'volumePanel', // 音量控制
                inline: false, // 不使用水平方式
            },
            {name: 'FullscreenToggle'} // 全屏
        ],
    },
    sources:[ // 视频来源路径
        {
            src: '//vjs.zencdn.net/v/oceans.mp4',
            type: 'video/mp4',
        }
    ]
    }, function (){
        console.log('视频可以播放了',this);
    });
</script>
```

## 常用属性说明

初始化完成之后,我们使用官网上的一个例子,播放器大致上长这个样子:

![demo](https://img-blog.csdnimg.cn/20210310203219826.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)


| 属性 |  类型   | 说明 |
|:--------:| :--------:|:-------------|
| controls | `boolean`| 是否显示播放器底层的控制栏,如若关闭则不显示。
| poster   | `string`| 视频的封面。
| preload | `none`、`metadata`、`auto`| `none`: 啥也不加载。<br/> `metadata`: 当页面加载后仅加载音频的元数据。<br/> `auto`: 一旦页面加载，则开始加载音频。
| autoplay | `boolean`| 是否自动进行播放,`在H5浏览器中需要用户手动交互触发后才可以自动进行播放`。
| fluid | `boolean`| 是否自适应容器的宽高,为`true`时假如页面内只有一个播放器会自动撑满整个页面。
| language | `zh-CN`、`en`| 播放器语言
| muted | `boolean`| 控制播放器是否静音
| controlBar | `object`| 自定义播放器控制栏的属性
| sources | `object`| 自定义视频的播放来源和播放类型
| nativeControlsForTouch | `boolean`| 是否使用浏览器原生的控件
| notSupportedMessage | `boolean`| 是否允许重写默认的消息显示出来时，`video.js`无法播放媒体源
| plugins | `object` | 插件
| techOrder | `array` | 使用播放器的顺序 ['html5', 'flash'] 优先使用html5播放器，如果不支持将使用flash
| userActions | `object` | 用户自定义行为 包含`doubleClick`(是否开启双击)和`hotkeys`(是否支持热键)

### controlBar属性说明:

| 属性 |  类型   | 说明 |
|:--------:| :--------:|:-------------|
| playToggle | `boolean`| 是否显示控制栏的播放、暂停按钮。
| volumeMenuButton   | `VolumePanelOptions`、`boolean`| 如果是`boolean`值控制音量调节按钮的显示,如果是`VolumePanelOptions`则进行配置。
| currentTimeDisplay | `boolean` | 是否显示当前视频播放时间。
| timeDivider | `boolean` | 是否显示视频播放时间分隔符,目前是`/`。
| durationDisplay | `boolean` | 是否显示视频总时长。
| progressControl | `ProgressControlOptions`、`false` | 点播流时，播放进度条，seek控制。
| liveDisplay | `boolean` | 直播流时，显示LIVE。
| remainingTimeDisplay | `boolean` | 是否显示视频剩余播放时长
| playbackRateMenuButton | `boolean` | 是否显示播放速率控制按钮,目前只有`HTML5`模式下才支持设置播放速率。
| fullscreenToggle | `boolean` | 是否显示全屏控制按钮。

![controlBar属性说明](https://img-blog.csdnimg.cn/20210310211311440.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

#### VolumePanelOptions

| 属性 |  类型   | 说明 |
|:--------:| :--------:|:-------------|
| inline | `boolean`| 是否是已行的形式显示。
| volumeControl | `VolumeControlOptions` | 配置项。

#### VolumeControlOptions

| 属性 |  类型   | 说明 |
|:--------:| :--------:|:-------------|
| vertical | `boolean`| 是否垂直的形式显示。
| volumeBar | `VolumeBar` | 使用自定义组件。

#### ProgressControlOptions

| 属性 |  类型   | 说明 |
|:--------:| :--------:|:-------------|
| seekBar | `boolean`| 是否显示拖动进度条。

## 常用自定义样式修改

 - #### 修改默认的字体大小:

`video.js`采用的是`em`单位,单位可自定义,我们可以通过修改`.video-js`的`font-size`进行自定义。

```css
.video-js{
  font-size: 14px;
}
```

- #### 修改默认的播放按钮样式:

`video.js`默认的播放按钮在视频播放器的左上角,我们的习惯是默认都放在视频播放器的中间,可以通过两种方式进行修改。

![默认播放按钮位置](https://img-blog.csdnimg.cn/20210311142438647.jpg?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)


**1. 采用内置的样式名`vjs-big-play-centered`**。

```html
<video
    class='video-js vjs-default-skin vjs-big-play-centered'
    muted={muted}
    preload={preload}
    poster={poster}
>
    <source src={src} type={playerType} />
</video>
```
**2. 采用样式覆盖,自定义修改位置**。

```less
// 重新默认的播放按钮样式
:global(.video-js .vjs-big-play-button) {
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
}
```
:::tip
如果需要对默认的播放按钮进行自定义样式,也需要在 `.video-js .vjs-big-play-button`这个类名中进行覆盖。
:::

#### 修改播放按钮为圆形

`video.js`目前默认的样式是个方形带一些圆角的按钮,也需要通过修改`.video-js .vjs-big-play-button`这个类名中进行覆盖。

```less
// demo
:global(.video-js .vjs-big-play-button){
    font-size: 2.5em;
    line-height: 2.3em;
    height: 2.5em;
    width: 2.5em;
    border-radius: 50%;
    background-color: #73859f;
    border-width: 0.15em;
    margin-top: -1.25em;
    margin-left: -1.75em;
}
```

####  视频加载出错时隐藏播放按钮

通过修改`.video-js.vjs-paused .vjs-big-play-button`类名,我们可以控制当视频加载错误时隐藏播放按钮。

```less
:global(.video-js.vjs-paused .vjs-big-play-button){
    display: none;
}
```

#### 视频暂停时显示播放按钮

```less
:global(.vjs-paused .vjs-big-play-button,
.vjs-paused.vjs-has-started .vjs-big-play-button) {
    display: block;
}
```

#### 自定义加载icon隐藏默认加载图标

```less
:global(.vjs-loading-spinner),
:global(.vjs-seeking .vjs-loading-spinner),
:global(.vjs-waiting .vjs-loading-spinner) {
    display: none;
}
```

#### 修改加载圆圈

通过修改`.vjs-loading-spinner`类名,我们可以修改加载时的loading图标。

```less
// demo
:global(.vjs-loading-spinner){
    // 自定义样式
    font-size: 2.5em;
    width: 2em;
    height: 2em;
    border-radius: 1em;
    margin-top: -1em;
    margin-left: -1.5em;
}
```

#### 修改控制条默认样式

通过修改`.video-js .vjs-control-bar`类名,我们可以自定义控制条样式。

```less
:global(.video-js .vjs-control-bar){
    // 自定义样式
}
```

#### 修改控制条所有图标的样式

在`video.js`中图标是通过iconfont形式的字体图标来实现的,采用统一的`fontFamily: VideoJS;`要修改图标尺寸等信息可以在伪类样式`.vjs-button > .vjs-icon-placeholder:before`中进行修改。

![在这里插入图片描述](https://img-blog.csdnimg.cn/20210311140848867.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

```less
:global(.vjs-button > .vjs-icon-placeholder:before){
    // 自定义尺寸等信息
}
```

:::warning
一点需要注意的是:

图标字体大小最好使用`px`单位，如果使用`em`，各浏览器表现可能会不大一样。
:::

#### 修改进度条的背景色

要修改进度条的背景色,我们可以通过修改`.video-js .vjs-play-progress`类名。

```less
:global(.video-js .vjs-play-progress){
    // 修改背景色
    background-color: 颜色;
}
```

#### 控制点击屏幕播放/暂停

`pointer-events`是CSS的一个属性，用来控制鼠标的动作。它能够：

- 阻止用户的点击动作产生任何效果
- 阻止缺省鼠标指针的显示
- 阻止CSS里的hover和active状态的变化触发事件
- 阻止JavaScript点击动作触发的事件

| 属性 | 说明 |
|:--------:|:-------------|
| auto | 默认值。元素对指针事件做出反应，比如 :hover 和 click。
| none | 元素不对指针事件做出反应。

```less
.video-js.vjs-playing .vjs-tech {
    pointer-events: auto;
}
```

#### 控制进度显示当前播放时间及视频总时长

`video.js`默认是只显示当前视频的剩余时长的,如果要控制仅显示当前播放时间即视频时长我们需要进行配置并修改默认的css样式。

- 首先配置对应开关

```jsx
remainingTimeDisplay: false;
currentTimeDisplay: true;
durationDisplay: true;
```

当我们配置完发现时间还是没有显示完整,因为默认样式把当前播放时间设置为`display:none;`了。

```less
// 重置不显示时间
:global(.video-js .vjs-current-time),
:global(.video-js .vjs-duration) {
    display: inherit;
}
```

## 常用事件说明

```js
// 事件类型
const EVENTS = {
  READY: 'ready', 
  LOADED: 'loadedmetadata',
  PLAY: 'play',
  PAUSE: 'pause',
  ENDED: 'ended',
  CANPLAY: 'canplay',
  WAITING: 'waiting',
  PLAYING: 'playing',
  TIMEUPDATE: 'timeupdate',
  ERROR: 'error',
  CONTORLSVISIBLE: 'useractive',
  CONTORLSHIDE: 'userinactive',
  DURATIONCHANGE: 'durationchange', 
  FIRSTPLAY: 'firstplay',
  FULLSCREENCHANGE: 'fullscreenchange',
  LOADSTART: 'loadstart',
  LOADEDALL: 'loadedalldata',
  SEEKED: 'seeked',
  RESIZE: 'resize',

};
```

| 事件 | 说明 |
|:--------:|:-------------|
| durationchange | 视频时长改变了（只有视频加载后，时长会由“NaN”变成音频/视频的实际时长）。
| loadstart      | 当浏览器开始查找视频时，开始加载。
| loadeddata       | 当浏览器已加载视频的当前帧时
| loadedmetadata   | 当浏览器已加载视频的元数据时
| ended          | 视频播放结束（currentTime == duration）。
| error          | 视频加载出错
| fullscreenchange | 进入/退出全屏状态
| pause            | 当视频被暂停
| play             | 当视频开始播放
| progress         | 下载视频
| timeupdate       | 播放进度更新
| volumechange     | 视频音量变更时



## 常用API说明

1. ### 获取/设置视频播放进度

```js
// 返回当前播放进度
player.currentTime();

// 设置播放进度
player.currentTime(60);
```
2. ### 获取视频播放总时长

```js
player.duration();
```

:::warning
获取视频总长度需要在视频加载完成之后才可以获取到。对应`loadedmetadata`生命周期。
:::

3. ### 设置视频的声音大小

```js
// 数值为 0~1 之间的值
player.volume(0.5);
```

4. ### 调整视频的宽度、高度

```js
// 调整宽高 单位:px
player.width(640);
player.height(480);

// 使用size方法
player.size(640, 480);
```

5. ### 开启全屏、退出全屏

```js
// 进入全屏
player.enterFullScreen();

// 退出全屏
player.exitFullScreen();
```

6. ### 获取、设置播放源

```js
player.src();
player.src('www.baidu.mp4');
```



## 常见问题FAQ

1. ### 解决在iPhone中播放时自动全屏问题?

由于在Iphone设备上播放视频时,包括在微信浏览器上,视频会在动全屏,而且这种全屏是以一种类似Modal弹窗的全屏,如果我们不想自动全屏需要给`video`标签中添加`playsinline="true"`属性。

```jsx
<video
    ...
    playsinline="true"
    // 兼容早期版本
    webkit-playsinline="true" 
>
    <source src={src} type={playerType}>
</video>
```

2. ### 如何重载视频?

有的时候,比如说播放过程中产生了错误,我们需要重新去加载视频资源。

```js
video.pause()
source.setAttribute('src', '2.mp4');
video.load();
video.play();
```

3. ### 如何添加监听事件?

```jsx
const EVENTS = {
  READY: 'ready', 
  LOADED: 'loadedmetadata',
  PLAY: 'play',
  PAUSE: 'pause',
  ENDED: 'ended',
  CANPLAY: 'canplay',
  WAITING: 'waiting',
  PLAYING: 'playing',
  TIMEUPDATE: 'timeupdate',
  ERROR: 'error',
  CONTORLSVISIBLE: 'useractive',
  CONTORLSHIDE: 'userinactive',
  DURATIONCHANGE: 'durationchange',
  FIRSTPLAY: 'firstplay',
  FULLSCREENCHANGE: 'fullscreenchange',
  LOADEDALL: 'loadedalldata',
  SEEKED: 'seeked',
  RESIZE: 'resize',
};

const player = videojs(h5VideoPlayer.current, {}, () => {
    bindEvent(EVENTS.READY, ready);
    bindEvent(EVENTS.LOADED, loaded);
    bindEvent(EVENTS.PLAY, play);
    bindEvent(EVENTS.PAUSE, pause);
    bindEvent(EVENTS.TIMEUPDATE, timeupdate);
    bindEvent(EVENTS.ENDED, end);
    bindEvent(EVENTS.CANPLAY, canplay);
    bindEvent(EVENTS.WAITING, waiting);
    bindEvent(EVENTS.PLAYING, playing);
    bindEvent(EVENTS.CONTORLSVISIBLE, controlsVisible);
    bindEvent(EVENTS.CONTORLSHIDE, controlsHide);
});
```

4. ### 如何触发指定的生命周期?

```jsx
player.trigger(EVENTS.PLAY);
```
5. ### 如果我在video外层加了个div,我想要去除video.js额外加的容器我要怎么办?

当我们给元素添加了`data-vjs-player`属性之后`video.js`就不在创建额外的DOM元素来包裹了。

```js
// 处理前
<div>
    <video ref={node => this.videoNode = node} className='video-js' />
</div>

// 处理后
<div data-vjs-player>
    <video ref={node => this.videoNode = node} className='video-js' />
</div>
```

6. ### react如何使用video.js 播放rtmp流视频？

`video.js`默认是不支持`RTMP`流播放的,需要支持的话需要单独安装`videojs-flash`,若果浏览器没有启用fllash插件会有相应提示。

```npm
yarn add video.js videojs-flash
```

```jsx
import React from 'react'
//引入依赖
import 'video.js/dist/video-js.css'
import 'videojs-flash'
import videojs from 'video.js'
import './style.css'
const url = [
    {
        url:"rtmp://58.200.131.2:1935/livetv/hunantv",
        name:"湖南卫视"
    },
    {
        url:"rtmp://202.69.69.180:443/webcast/bshdlive-pc",
        name:"香港财经"
    }
]
class App extends React.Component{
    state={
        nowPlay:""
    }
//组件挂载完成之后初始化播放控件
    componentDidMount(){
        const videoJsOptions = {
            autoplay: true,
            controls: true,
            sources: [{
              src: 'rtmp://58.200.131.2:1935/livetv/hunantv',
              type: 'rtmp/flv'
            }]
        };
        this.player = videojs('my-video', videoJsOptions , function onPlayerReady() { //(id或者refs获取节点，options，回调函数)
            console.log('player is ready!');
            // In this context, `this` is the player that was created by Video.js.
            this.play();
            // How about an event listener?
            this.on('ended', function() {
              videojs.log('Awww...over so soon?!');
            });
          }); 
    }

    handleClick(item){
        if(item.name === this.state.nowPlay){
            return
        }
        this.setState({
            nowPlay:item.name
        })
        this.player.pause();
        this.player.src(item.url);
        this.player.load();
        this.player.play();
    }
    render(){
        let li = {
            background: "cadetblue",
            padding: "11px",
            width: "fit-content",
            marginBottom:"5px",
            cursor:"pointer"
        }
        let playing = {
            background: "rgb(141, 182, 28)",
            padding: "11px",
            width: "fit-content",
            marginBottom:"5px",
            cursor:"pointer"
        }
        return(
            <div
                className="main-wrap"
            >
                <div className="title">测试video.js</div>
                <div>
                    <ul style={{listStyleType: "decimal-leading-zero",float:"left"}}>
                    {
                        url.map((item,index)=>{
                            return <li style={{height:60}} key={item.name} onClick={()=>this.handleClick(item)}>
                                        <span style={this.state.nowPlay===item.name?playing:li}>{item.name}</span>
                                    </li>
                        })
                    }
                    </ul>
                    <video style={{width:"50vw",height:"50vh",margin:"0 auto"}} id="my-video" className="video-js vjs-default-skin">
                    </video>
                </div>
            </div>   
        )
    }
}

export default App;
```
## 进阶技巧

- 2021.03.11

### 1. 如何添加自定义组件?

```js
var myButton = video.controlBar.addChild('button', {
    text: "Press me",
    // other options
  });

myButton.addClass("html-classname");
```

通过上述的代码会在控制栏上加上这段代码:

```html
<div class="vjs-control html-classname" aria-live="polite" tabindex="0">
  <div class='vjs-control-content">
    <span class="vjs-control-text">Press me</span>
  </div>
</div>
```

### 2. 如何扩展`video.js`的插件功能?

比如`video.js`默认没有提供点击空格/回车键控制播放/暂停。我们可以通过写自己的插件来实现额外的功能,这里放个例子:

```jsx
// code
render () {
   // 写插件：当监听到播放器实例的播放（play）事件，就输出一条语句
   function examplePlugin(options) {
       this.on('play', function(e) {
         console.log('playback has started!');
       });
     };

   // 注册该插件
   videojs.registerPlugin('examplePlugin', examplePlugin)

   return (
     // code
   )
}
```

在组件中使用:

```jsx
const CourseVideoJsOptions = {
  autoplay: false,
  controls: true,

  ... ...

  // 使用该插件
  plugins: {
    setStateandFocusPlugin: true
  }
}
```

接下来，我们需要监听“按下空格键”这个事件。这个需求可以分为两步：

1. 监听键盘事件
2. 判断是否为空格键

针对前者我们可以使用`onKeyDown`事件进行监听,空格键的键码是`32`。

```js
videojs.registerPlugin('setStateandFocusPlugin', setStateandFocusPlugin)
// videojs.registerPlugin('handleKeyPress', handleKeyPress)

return (
  <div data-vjs-player
    onKeyDown={this.handleSpaceKeyDown}
    >
    <video
    ref={node => this.videoNode = node}
    className='video-js vjs-hqcat'
    />
    </div>
    )
  }
}
```

接下来写监听到 `onKeyDown` 事件后调用的函数：

1. 首先，我们需要判断是否为空格键。
2. 如果是，我们需要禁止原来默认的动作。
3. 然后，利用之前设置的视频播放状态，进行相应的操作：
    - 如果视频正在播放中，则暂停视频。
    - 如果视频正在暂停中，则继续播放视频。

```js
handleSpaceKeyDown = (event) => {
  // 判断是否为空格键
  if (event.which === 32) {
    event.preventDefault()
    if (this.player) {
      // 根据播放状态的不同，进行相应的操作
      switch (this.player.state.state) {
        case 'playing':
        this.player.pause()
        break
        case 'pause':
        this.player.play()
        break
        default: return
      }
    } else {
      console.log('error')
    }
  }
}

const setStateandFocusPlugin = function (options) {
  this.on('play', function (e) {
    console.log('playback has started!')
    console.log(that)
    this.setState({
      state: 'playing'
    })
  })

  this.on('pause', function (e) {
    console.log('playback has paused')
    this.setState({
      state: 'pause'
    })
  })

  this.on('timeupdate', function(e){
    that.refs.videoPlayerRef.focus()
  })
}
```









