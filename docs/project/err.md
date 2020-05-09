# 前端错误监控体系搭建

- 2020.03-30

一直以来，如何定位前端上线后的错误，都是一个很头疼的问题，因为它发生于用户的一系列操作之后。原因可能是机型，网络环境，接口请求，复杂的操作行为等等，在我们想要去解决的时候很难复现出来，自然也就无法解决。因此搭建一个良好的前端错误监控体系就显得十分重要。


**如果你家里有矿的话，可以尝试使用[`FunDebug`](https://www.fundebug.com/)直接集成，付费使用**


前端监控功能主要包含：  

- JS错误日志监控分析
- 静态资源请求报错统计
- 用户行为检索
- 接口请求报错统计
- `HTML`加载性能分析
- `PV、UV`日志分析

- https://www.cnblogs.com/warm-stranger/p/8837784.html

## 前端错误异常情况

![错误异常情况](https://img-blog.csdnimg.cn/20200509192132597.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

## 错误采集常用信息

| 字段 | 类型  | 解释
|:--------| :-------------|:--------
| requestId	| String | 一个界面产生一个requestId
| traceId	| String	| 一个阶段产生一个traceId，用于追踪和一个异常相关的所有日志记录
| hash	| String	| 这条log的唯一标识码，相当于logId，但它是根据当前日志记录的具体内容而生成的
| time	| Number	| 当前日志产生的时间（保存时刻）
| userId| 	String	| 当前用户id
| userStatus	| Number| 	当时，用户状态信息（是否可用/禁用）
| userRoles	| Array| 	当时，前用户的角色列表
| userGroups	| Array| 	当时，用户当前所在组，组别权限可能影响结果
| userLicenses| 	Array	| 当时，许可证，可能过期
| path	| String	| 所在路径，URL
| action	| String| 	进行了什么操作
| referer| 	String	| 上一个路径，来源URL
| prevAction	| String| 	上一个操作
| data| 	Object| 	当前界面的state、data
| dataSources	| `Array<Object>`	| 上游api给了什么数据
| dataSend| 	Object| 	提交了什么数据
| targetElement| 	HTMLElement	| 用户操作的DOM元素
| targetDOMPath	| `Array<HTMLElement>`	| 该DOM元素的节点路径
| targetCSS	| Object| 	该元素的自定义样式表
| targetAttrs	| Object| 	该元素当前的属性及值
| errorType	| String	| 错误类型
| errorLevel	| String| 	异常级别
| errorStack	| String| 	错误stack信息
| errorFilename	| String| 	出错文件
| errorLineNo	| Number| 	出错行
| errorColNo	| Number| 	出错列位置
| errorMessage	| String| 	错误描述（开发者定义）
| errorTimeStamp	| Number	| 时间戳
| eventType	| String| 	事件类型
| pageX	| Number	| 事件x轴坐标
| pageY	| Number| 	事件y轴坐标
| screenX	| Number| 	事件x轴坐标
| screenY	| Number| 	事件y轴坐标
| pageW	| Number| 	页面宽度
| pageH| 	Number| 	页面高度
| screenW	| Number| 	屏幕宽度
| screenH	| Number| 	屏幕高度
| eventKey	| String| 	触发事件的键
| network	| String| 	网络环境描述
| userAgent	| String| 	客户端描述
| device	| String| 	设备描述
| system	| String| 	操作系统描述
| appVersion	| String| 	应用版本
| apiVersion	| String| 	接口版本


## JS错误日志监控分析

- 2020.05.09

### 1.try...catch

通过`try...catch`我们能够知道出错的信息,并且也有堆栈信息可以知道在哪个文件第几行第几列发生错误

```js
try {
    let name = 'jartto';
    console.log(nam);
} catch (err) {
    console.log(err.message)
}
```

缺点:

1. 没法捕捉`try,catch块`，当前代码块有语法错误，JS解释器压根都不会执行当前这个代码块，所以也就没办法被`catch`住；

2. 没法捕捉到全局的错误事件，也即是只有`try,catch`的块里边运行出错才会被你捕捉到，这里的块你要理解成一个函数块.

3. 无法捕获到异常，这是需要我们特别注意的地方。

```js
try {
  setTimeout(() => {
    undefined.map(v => v);
  }, 1000)
} catch(e) {
  console.log('捕获到异常：',e);
}
```

### 2.全局捕获 window.onerror

当 JS 运行时错误发生时，`window` 会触发一个 `ErrorEvent` 接口的 `error` 事件，并执行 `window.onerror()`。

`window.onerror`一样可以拿到出错的信息以及文件名、行号、列号等信息,还可以在`window.onerror`最后`return true`让浏览器不输出错误信息到控制台.

```js
/**
 * @param {string} msg  错误信息。直观的错误描述信息，不过有时候你确实无法从这里面看出端倪，特别是压缩后脚本的报错信息，可能让你更加疑惑。
 * @param {string} url  发生错误对应的脚本路径。
 * @param {number} line 错误发生的行号。
 * @param {number} column 错误发生的列号。
 * @param {object} error  具体的 error 对象，继承自 window.Error 的某一类，部分属性和前面几项有重叠，但是包含更加详细的错误调用堆栈信息，这对于定位错误非常有帮助。
*/
window.onerror = function (msg, url, line, column, error) {
    console.log('window error catch:', msg, url, line, column, error);
    // 返回 true 则错误消息不显示在控制台，返回 false，则错误消息将会展示在控制台
    return true;
}

// 完整版
window.onerror = function (msg, url, line, col, error) {
    // 没有URL不上报！上报也不知道错误
    if (msg != "Script error." && !url) {
            return true;
    }
            
    setTimeout(function () {
        var data = {};
        // 不一定所有浏览器都支持col参数
        col = col || (window.event && window.event.errorCharacter) || 0;

        data.url = url;
        data.line = line;
        data.col = col;
        data.time = Date.now();
        if (!!error && !!error.stack) {
            // 如果浏览器有堆栈信息
            // 直接使用
            data.msg = error.stack.toString();
        } else if (!!arguments.callee) {
            // 尝试通过callee拿堆栈信息
            var ext = [];
            var f = arguments.callee.caller, c = 3;
            // 这里只拿三层堆栈信息
            while (f && (--c > 0)) {
                ext.push(f.toString());
                if (f === f.caller) {
                    break; //如果有环
                }
                f = f.caller;
            }
            ext = ext.join(",");
            data.msg = ext;
        }
        // 把data上报到后台！
            console.log(data)
    }, 0);
            
    return true;
};
```

:::warning
我们发现，不论是`语法错误`、`静态资源异常`，或者`接口异常`，通过`window.onerror`错误都无法捕获到。

`onerror` 最好写在所有 `JS` 脚本的前面，否则有可能捕获不到错误。
:::

### 3.图片等资源加载报错

```js
// img script link 资源加载出错
function dynamicSourceLoadError() {
    const links = document.querySelectorAll('link')
    const imgs = [...document.querySelectorAll('img')]
    const scripts = document.querySelectorAll('script')

    console.log(links, imgs, scripts)

    imgs.map(item => {
        item.onLoad = ()=>{
            console.log('load')
        }
        console.log(item)
    })
}
```

### 4.performance.getEntries()

`performance`是h5的新特性之一,使用该方法能获取到当前页面已经加载到的资源,返回的是一个数组对象。

![运行示例](https://img-blog.csdnimg.cn/20200509150026196.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

**例子:获取页面中没有成功加载的图片资源**

1. 通过`performance.getEntries()`获取已经加载了的图片资源

```js
const arr = [];
const reg = (/\.jpg$|\.jpeg$|.png$|\.gif$/i);

performance.getEntries().forEach(item => {
    if (reg.test(item.name)) {
        arr.push(item.name)
    }
});
```

2. 获取页面中所有的`img标签`

```js
const imgs = [...document.querySelectorAll('img')];
```

3. 利用获取到的img的长度减去已经加载到的长度,如果大于0的部分,就是加载失败的

```js
const arr = [];
const reg = (/\.jpg$|\.jpeg$|.png$|\.gif$/i);

performance.getEntries().forEach(item => {
    if (reg.test(item.name)) {
        arr.push(item.name)
    }
});
const imgs = [...document.querySelectorAll('img')];

const failNum = imgs.length - arr.length;

return failNum;
```

### 5.Error事件捕获

当一项资源（如图片或脚本）加载失败，加载资源的元素会触发一个 `Event` 接口的 `error` 事件，并执行该元素上的`onerror()`处理函数。这些 `error` 事件不会向上冒泡到 `window` ，不过（至少在 Firefox 中）能被单一的`window.addEventListener`捕获。


```js
// window.addEventListener第三个参数是true的时候是捕获的过程,false是冒泡的过程 
window.addEventListener('error',function(e){
    console.log("捕获error",e)
},true)
```

:::tip
由于网络请求异常不会事件冒泡，因此必须在捕获阶段将其捕捉到才行，但是这种方式虽然可以捕捉到网络请求的异常，但是无法判断 `HTTP` 的状态是 404 还是其他比如 500 等等，所以还需要配合服务端日志才进行排查分析才可以。
:::

:::warning
1. 不同浏览器下返回的 `error` 对象可能不同，需要注意兼容处理。

2. 需要注意避免 `addEventListener` 重复监听。
:::

### 6.Promise Catch

在 `promise` 中使用 `catch` 可以非常方便的捕获到异步 `error` ，这个很简单。

:::warning
没有写 `catch` 的 `Promise` 中抛出的错误无法被 `onerror` 或 `try-catch` 捕获到，所以我们务必要在 `Promise` 中不要忘记写 `catch` 处理抛出的异常。
:::

**解决方案： 为了防止有漏掉的 `Promise` 异常，建议在全局增加一个对 `unhandledrejection` 的监听，用来全局监听`Uncaught Promise Error`。使用方式：**

```js
window.addEventListener("unhandledrejection", function(e){
  // 去掉控制台显示的话加上
  e.preventDefault();
  console.log(e);
});
```

### 7.Vue errorHandler

```js
Vue.config.errorHandler = (err, vm, info) => {
  console.error('通过vue errorHandler捕获的错误');
  console.error(err);
  console.error(vm);
  console.error(info);
}
```

### 8.React 异常捕获

可以在发生错误的时候渲染一些错误的页面。

```js
import React, { Component } from 'react';

export default class ErrorCatch extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }
    componentDidCatch(error, info) {
        this.setState({ hasError: true });
        // 在这里可以做异常的上报
        console.log('componentDidCatch:', info)
    }
    render() {
        if (this.state.hasError) {
            return <h1>Something went wrong.</h1>;
        }
        return this.props.children;
    }
}
```

### 9.iframe 异常

对于 iframe 的异常捕获，我们还得借力 window.onerror：

```js
window.onerror = function(message, source, lineno, colno, error) {
    console.log('捕获到异常：',{message, source, lineno, colno, error});
}
```

简单的例子:

```js
<iframe src="./iframe.html" frameborder="0"></iframe>
<script>
  window.frames[0].onerror = function (message, source, lineno, colno, error) {
    console.log('捕获到 iframe 异常：',{message, source, lineno, colno, error});
    return true;
  };
</script>
```

### 10.Script error

一般情况，如果出现 `Script error` 这样的错误，基本上可以确定是出现了`跨域问题`。这时候，是不会有其他太多辅助信息的，但是解决思路无非如下：

:::tip
跨源资源共享机制( CORS )：我们为 `script` 标签添加 `crossOrigin` 属性。
:::

```js
<script src="http://jartto.wang/main.js" crossorigin></script>
```

或者动态去添加 js 脚本：

```js
const script = document.createElement('script');
script.crossOrigin = 'anonymous';
script.src = url;
document.body.appendChild(script);
```

:::warning
特别注意，服务器端需要设置：`Access-Control-Allow-Origin`
:::

### 11.崩溃和卡顿

卡顿也就是网页暂时响应比较慢， JS 可能无法及时执行。但崩溃就不一样了，网页都崩溃了，JS 都不运行了，还有什么办法可以监控网页的崩溃，并将网页崩溃上报呢。

1. 利用 `window` 对象的 `load` 和 `beforeunload` 事件实现了网页崩溃的监控。
不错的文章，推荐阅读：[Logging Information on Browser Crashes](http://jasonjl.me/blog/2015/06/21/taking-action-on-browser-crashes/)

```js
window.addEventListener('load', function () {
    sessionStorage.setItem('good_exit', 'pending');
    setInterval(function () {
        sessionStorage.setItem('time_before_crash', new Date().toString());
    }, 1000);
});

window.addEventListener('beforeunload', function () {
    sessionStorage.setItem('good_exit', 'true');
});

if(sessionStorage.getItem('good_exit') &&
    sessionStorage.getItem('good_exit') !== 'true') {
    /*
        insert crash logging code here
    */
    alert('Hey, welcome back from your crash, looks like you crashed on: ' + sessionStorage.getItem('time_before_crash'));
}
```

2. 随着 PWA 概念的流行，大家对 Service Worker 也逐渐熟悉起来。基于以下原因，我们可以使用 `Service Worker` 来实现[网页崩溃的监控](https://juejin.im/entry/5be158116fb9a049c6434f4a?utm_source=gold_browser_extension)

- `Service Worker` 有自己独立的工作线程，与网页区分开，网页崩溃了，`Service Worker` 一般情况下不会崩溃；

- `Service Worker` 生命周期一般要比网页还要长，可以用来监控网页的状态；

- 网页可以通过 `navigator.serviceWorker.controller.postMessage API` 向掌管自己的 `SW` 发送消息。

基于以上几点，我们可以实现一种基于心跳检测的监控方案：

![图片示例](https://img-blog.csdnimg.cn/20200509163957652.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)


- p1：网页加载后，通过 `postMessage API` 每 3s 给 sw 发送一个心跳，表示自己的在线，sw 将在线的网页登记下来，更新登记时间；

- p2：网页在 `beforeunload` 时，通过 `postMessage API` 告知自己已经正常关闭，sw 将登记的网页清除；

- p3：如果网页在运行的过程中 `crash` 了，sw 中的 `running` 状态将不会被清除，更新时间停留在奔溃前的最后一次心跳；

- sw：`Service Worker` 每 6s 查看一遍登记中的网页，发现登记时间已经超出了一定时间（比如 9s）即可判定该网页 `crash` 了。


部分示例代码:

```js
// 页面 JavaScript 代码
if (navigator.serviceWorker.controller !== null) {
  let HEARTBEAT_INTERVAL = 5 * 1000; // 每五秒发一次心跳
  let sessionId = uuid();
  let heartbeat = function () {
    navigator.serviceWorker.controller.postMessage({
      type: 'heartbeat',
      id: sessionId,
      data: {} // 附加信息，如果页面 crash，上报的附加数据
    });
  }
  window.addEventListener("beforeunload", function() {
    navigator.serviceWorker.controller.postMessage({
      type: 'unload',
      id: sessionId
    });
  });
  setInterval(heartbeat, HEARTBEAT_INTERVAL);
  heartbeat();
}
```

- `sessionId` 本次页面会话的唯一 id；
- `postMessage` 附带一些信息，用于上报 `crash` 需要的数据，比如当前页面的地址等等。

```js
// sw.js
const CHECK_CRASH_INTERVAL = 10 * 1000; // 每 10s 检查一次
const CRASH_THRESHOLD = 15 * 1000; // 15s 超过15s没有心跳则认为已经 crash
const pages = {};
let timer;

function checkCrash() {
  const now = Date.now();
  for (var id in pages) {
    let page = pages[id];
    if ((now - page.t) > CRASH_THRESHOLD) {
      // 上报 crash
      delete pages[id]
    }
  }
  if (Object.keys(pages).length == 0) {
    clearInterval(timer)
    timer = null
  }
}

worker.addEventListener('message', (e) => {
  const data = e.data;
  if (data.type === 'heartbeat') {
    pages[data.id] = {
      t: Date.now()
    }
    if (!timer) {
      timer = setInterval(function () {
        checkCrash()
      }, CHECK_CRASH_INTERVAL)
    }
  } else if (data.type === 'unload') {
    delete pages[data.id]
  }
})
```
### 12.压缩代码如何定位到脚本异常位置

线上的代码几乎都经过了压缩处理，几十个文件打包成了一个并丑化代码，当我们收到 a is not defined 的时候，我们根本不知道这个变量 a 究竟是什么含义，此时报错的错误日志显然是无效的。


第一想到的办法是利用 sourcemap 定位到错误代码的具体位置，详细内容可以参考：[Sourcemap 定位脚本错误](https://github.com/joeyguo/blog/issues/14)

另外也可以通过在打包的时候，在每个合并的文件之间添加几行空格，并相应加上一些注释，这样在定位问题的时候很容易可以知道是哪个文件报的错误，然后再通过一些关键词的搜索，可以快速地定位到问题的所在位置。

**示例 · 压缩代码定位错误困难**

源代码（存在错误）:

```js
function test() {
    noerror // <- 报错
}

test();
```

经 webpack 打包压缩后产生如下代码:

```js
!function(n){function r(e){if(t[e])return t[e].exports;var o=t[e]={i:e,l:!1,exports:{}};return n[e].call(o.exports,o,o.exports,r),o.l=!0,o.exports}var t={};r.m=n,r.c=t,r.i=function(n){return n},r.d=function(n,t,e){r.o(n,t)||Object.defineProperty(n,t,{configurable:!1,enumerable:!0,get:e})},r.n=function(n){var t=n&&n.__esModule?function(){return n.default}:function(){return n};return r.d(t,"a",t),t},r.o=function(n,r){return Object.prototype.hasOwnProperty.call(n,r)},r.p="",r(r.s=0)}([function(n,r){function t(){noerror}t()}]);
```

代码如期报错，并上报相关信息

```js
{ 
  msg: 'Uncaught ReferenceError: noerror is not defined',
  url: 'http://127.0.0.1:8077/main.min.js',
  row: '1',
  col: '515' 
}
```
此时，错误信息中行列数为 1 和 515。 结合压缩后的代码，肉眼观察很难定位出具体问题。

**如何定位到具体错误**

#### 1. 不压缩 js 代码

这种方式简单粗暴，但存在明显问题：1. 源代码泄漏，2. 文件的大小大大增加。

#### 2. 将压缩代码中分号变成换行

`uglifyjs` 有一个叫 `semicolons` 配置参数，设置为 `false` 时，会将压缩代码中的分号替换为换行符，提高代码可读性， 如:

```js
!function(n){function r(e){if(t[e])return t[e].exports
var o=t[e]={i:e,l:!1,exports:{}}
return n[e].call(o.exports,o,o.exports,r),o.l=!0,o.exports}var t={}
r.m=n,r.c=t,r.i=function(n){return n},r.d=function(n,t,e){r.o(n,t)||Object.defineProperty(n,t,{configurable:!1,enumerable:!0,get:e})},r.n=function(n){var t=n&&n.__esModule?function(){return n.default}:function(){return n}
return r.d(t,"a",t),t},r.o=function(n,r){return Object.prototype.hasOwnProperty.call(n,r)},r.p="",r(r.s=0)}([function(n,r){function t(){noerror}t()}])
```

此时，错误信息中行列数为 5 和 137，查找起来比普通压缩方便不少。但仍会出现一行中有很多代码，不容易定位的问题。

#### 3.js 代码半压缩 · 保留空格和换行

`uglifyjs` 的另一配置参数 `beautify` 设置为 `true` 时，最终代码将呈现压缩后进行格式化的效果（保留空格和换行），如

```js
!function(n) {
    // ...
    // ...
}([ function(n, r) {
    function t() {
        noerror;
    }
    t();
} ]);
```

此时，错误信息中行列数为 32 和 9，能够快速定位到具体位置，进而对应到源代码。但由于增加了换行和空格，所以文件大小有所增加。

#### 4.SourceMap 快速定位

`SourceMap` 是一个信息文件，存储着源文件的信息及源文件与处理后文件的映射关系。

在定位压缩代码的报错时，可以通过错误信息的行列数与对应的 SourceMap 文件，处理后得到源文件的具体错误信息。

![在这里插入图片描述](https://img-blog.csdnimg.cn/20200509184718722.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

`SourceMap` 文件中的 `sourcesContent` 字段对应源代码内容，不希望将 `SourceMap` 文件发布到外网上，而是将其存储到脚本错误处理平台上，只用在处理脚本错误中。

通过 `SourceMap` 文件可以得到源文件的具体错误信息，结合 `sourcesContent` 上源文件的内容进行可视化展示，让报错信息一目了然！

基于`SourceMap` 快速定位脚本报错方案

![在这里插入图片描述](https://img-blog.csdnimg.cn/2020050918512855.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

#### 5.开源方案 sentry

`sentry` 是一个实时的错误日志追踪和聚合平台，包含了上面 `sourcemap` 方案，并支持更多功能，如：错误调用栈，`log 信息`，`issue管理`，多项目，多用户，提供多种语言客户端等，具体介绍可以查看 [getsentry/sentry](https://github.com/getsentry/sentry)，[sentry.io](https://sentry.io/welcome/)，这里暂不展开。


### 13.错误上报

1. 通过 Ajax 发送数据

因为 Ajax 请求本身也有可能会发生异常，而且有可能会引发跨域问题，一般情况下更推荐使用动态创建 img 标签的形式进行上报。

2. 动态创建 img 标签的形式

```js
function report(error) {
  let reportUrl = 'http://xxx/report';
  new Image().src = `${reportUrl}?logs=${error}`;
}
```

收集异常信息量太多，怎么办？实际中，我们不得不考虑这样一种情况：如果你的网站访问量很大，那么一个必然的错误发送的信息就有很多条，这时候，我们需要设置采集率，从而[减缓服务器的压力](https://github.com/happylindz/blog/issues/5)

```js
Reporter.send = function(data) {
  // 只采集 30%
  if(Math.random() < 0.3) {
    send(data)      // 上报错误信息
  }
}
```
这个采集率可以通过具体实际的情况来设定，方法多样化，可以使用一个随机数，也可以具体根据用户的某些特征来进行判定。

### 14.错误上报的方式拓展

#### 1. 前端存储日志

我们并不单单采集异常本身日志，而且还会采集与异常相关的用户行为日志。单纯一条异常日志并不能帮助我们快速定位问题根源，找到解决方案。但如果要收集用户的行为日志，又要采取一定的技巧，而不能用户每一个操作后，就立即将该行为日志传到服务器。

对于具有大量用户同时在线的应用，如果用户一操作就立即上传日志，无异于对日志服务器进行`DDOS攻击`。因此，我们先将这些日志存储在用户客户端本地，达到一定条件之后，再同时打包上传一组日志。

那么，如何进行前端日志存储呢？我们不可能直接将这些日志用一个变量保存起来，这样会挤爆内存，而且一旦用户进行刷新操作，这些日志就丢失了，因此，我们自然而然想到前端数据持久化方案

目前，可用的持久化方案可选项也比较多了，主要有：`Cookie`、`localStorage`、`sessionStorage`、`IndexedDB`、`webSQL` 、`FileSystem` 等等。那么该如何选择呢？我们通过一个表来进行对比：


| 存储方式 | cookie | localStorage	| sessionStorage | IndexedDB | webSQL |	FileSystem 
|:---| :---|:---|:---|:---|:---|:---
| 类型 | key-value | key-value |	key-value | NoSQL |	SQL | \
| 数据格式	| string |	string | string | object | \ | \
| 容量 | 4k| 5M	| 5M |	500M |	60M | \
| 进程 | 同步 | 同步 | 同步 | 异步 | 异步 | \	
| 检索 | \ | key| key| key,index | field | \
| 性能 | 读快写慢 |	读快写慢 |读快写慢 | 读慢写快 | 读慢写快 | \

综合之后，`IndexedDB`是最好的选择，它具有容量大、异步的优势，异步的特性保证它不会对界面的渲染产生阻塞。

而且`IndexedDB`是分库的，每个库又分`store`，还能按照索引进行查询，具有完整的数据库管理思维，比`localStorage`更适合做结构化数据管理。但是它有一个缺点，就是api非常复杂，不像localStorage那么简单直接。

针对这一点，我们可以使用hello-indexeddb这个工具，它用Promise对复杂api进行来封装，简化操作，使IndexedDB的使用也能做到localStorage一样便捷。另外，IndexedDB是被广泛支持的HTML5标准，兼容大部分浏览器，因此不用担心它的发展前景。

接下来，我们究竟应该怎么合理使用`IndexedDB`，保证我们前端存储的合理性呢？

![在这里插入图片描述](https://img-blog.csdnimg.cn/20200509194612232.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

上图展示了前端存储日志的流程和数据库布局。当一个事件、变动、异常被捕获之后，形成一条初始日志，被立即放入暂存区（indexedDB的一个store），之后主程序就结束了收集过程，后续的事只在webworker中发生。

在一个webworker中，一个循环任务不断从暂存区中取出日志，对日志进行分类，将分类结果存储到索引区中，并对日志记录的信息进行丰富，将最终将会上报到服务端的日志记录转存到归档区。而当一条日志在归档区中存在的时间超过一定天数之后，它就已经没有价值了，但是为了防止特殊情况，它被转存到回收区，再经历一段时间后，就会被从回收区中清除。


#### 2.前端整理日志

上文讲到，在一个`webworker`中对日志进行整理后存到索引区和归档区，那么这个整理过程是怎样的呢？

由于我们下文要讲的上报，是按照索引进行的，因此，我们在前端的日志整理工作，主要就是根据日志特征，整理出不同的索引。我们在收集日志时，会给每一条日志打上一个type，以此进行分类，并创建索引，同时通过`object-hashcode`计算每个`log`对象的`hash`值，作为这个log的唯一标志。

- 将所有日志记录按时序存放在归档区，并将新入库的日志加入索引
- `BatchIndexes`：批量上报索引（包含性能等其他日志），可一次批量上报100条
- `MomentIndexes`：即时上报索引，一次全部上报
- `FeedbackIndexes`：用户反馈索引，一次上报一条
- `BlockIndexes`：区块上报索引，按异常/错误（traceId，requestId）分块，一次上报一块
- 上报完成后，被上报过的日志对应的索引删除
- 3天以上日志进入回收区
- 7天以上的日志从回收区清除

`rquestId`：同时追踪前后端日志。由于后端也会记录自己的日志，因此，在前端请求api的时候，默认带上requestId，后端记录的日志就可以和前端日志对应起来。

`traceId`：追踪一个异常发生前后的相关日志。当应用启动时，创建一个traceId，直到一个异常发生时，刷新traceId。把一个traceId相关的requestId收集起来，把这些requestId相关的日志组合起来，就是最终这个异常相关的所有日志，用来对异常进行复盘。

![在这里插入图片描述](https://img-blog.csdnimg.cn/2020050919484822.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

上图举例展示了如何利用traceId和requestId找出和一个异常相关的所有日志。

在上图中，hash4是一条异常日志，我们找到hash4对应的traceId为traceId2，在日志列表中，有两条记录具有该traceId，但是hash3这条记录并不是一个动作的开始，因为hash3对应的requestId为reqId2，而reqId2开始于hash2，因此，我们实际上要把hash2也加入到该异常发生的整个复盘备选记录中。

总结起来就是，我们要找出同一个traceId对应的所有requestId对应的日志记录，虽然有点绕，但稍理解就可以明白其中的道理。


**我们把这些和一个异常相关的所有日志集合起来，称为一个block，再利用日志的hash集合，得出这个block的hash，并在索引区中建立索引，等待上报。**


#### 3.上报日志

上报日志也在webworker中进行，为了和整理区分，可以分两个worker。上报的流程大致为：在每一个循环中，从索引区取出对应条数的索引，通过索引中的hash，到归档区取出完整的日志记录，再上传到服务器。

按照上报的频率（重要紧急度）可将上报分为四种：

#### a. 即时上报

收集到日志后，立即触发上报函数。仅用于A类异常。而且由于受到网络不确定因素影响，A类日志上报需要有一个确认机制，只有确认服务端已经成功接收到该上报信息之后，才算完成。否则需要有一个循环机制，确保上报成功。

#### b. 批量上报

将收集到的日志存储在本地，当收集到一定数量之后再打包一次性上报，或者按照一定的频率（时间间隔）打包上传。这相当于把多次合并为一次上报，以降低对服务器的压力。

#### c. 区块上报

将一次异常的场景打包为一个区块后进行上报。它和批量上报不同，批量上报保证了日志的完整性，全面性，但会有无用信息。而区块上报则是针对异常本身的，确保单个异常相关的日志被全部上报。

#### d. 用户主动提交

在界面上提供一个按钮，用户主动反馈bug。这有利于加强与用户的互动。

或者当异常发生时，虽然对用户没有任何影响，但是应用监控到了，弹出一个提示框，让用户选择是否愿意上传日志。这种方案适合涉及用户隐私数据时。

| \ | 即时上报	| 批量上报	| 区块上报	| 用户反馈
|:---| :---|:---|:---|:---|:---
| 时效 |	立即|	定时|	稍延时|	延时
| 条数 |	一次全部上报|	一次100条|	单次上报相关条目|	一次1条
| 容量 |	小|	中|	–	|–
| 紧急 |	紧急重要	|不紧急	|不紧急但重要	|不紧急

即时上报虽然叫即时，但是其实也是通过类似队列的循环任务去完成的，它主要是尽快把一些重要的异常提交给监控系统，好让运维人员发现问题，因此，它对应的紧急程度比较高。

:::tip
**批量上报和区块上报的区别：**

- 批量上报是一次上报一定条数，比如每2分钟上报1000条，直到上报完成。

- 而区块上报是在异常发生之后，马上收集和异常相关的所有日志，查询出哪些日志已经由批量上报上报过了，剔除掉，把其他相关日志上传，和异常相关的这些日志相对而言更重要一些，它们可以帮助尽快复原异常现场，找出发生异常的根源。
:::

用户提交的反馈信息，则可以慢悠悠上报上去。

为了确保上报是成功的，在上报时需要有一个确认机制，由于在服务端接收到上报日志之后，并不会立即存入数据库，而是放到一个队列中，因此，前后端在确保日志确实已经记录进数据库这一点上需要再做一些处理。

![在这里插入图片描述](https://img-blog.csdnimg.cn/20200509195458829.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

上图展示了上报的一个大致流程，在上报时，先通过hash查询，让客户端知道准备要上报的日志集合中，是否存在已经被服务端保存好的日志，如果已经存在，就将这些日志去除，避免重复上报，浪费流量。

#### 4.压缩上报数据

一次性上传批量数据时，必然遇到数据量大，浪费流量，或者传输慢等情况，网络不好的状态下，可能导致上报失败。因此，在上报之前进行数据压缩也是一种方案。

对于合并上报这种情况，一次的数据量可能要十几k，对于日 pv 大的站点来说，产生的流量还是很可观的。所以有必要对数据进行压缩上报。

`lz-string`是一个非常优秀的字符串压缩类库，兼容性好，代码量少，压缩比高，压缩时间短，压缩率达到惊人的60%。

但它基于`LZ78压缩`，如果后端不支持解压，可选择gzip压缩，一般而言后端会默认预装gzip，因此，选择gzip压缩数据也可以，工具包pako中自带了gzip压缩，可以尝试使用。



### 总结

1. 可疑区域增加 `Try-Catch`
2. 全局监控 JS 异常 `window.onerror`
3. 全局监控静态资源异常 `window.addEventListener`
4. 捕获没有 `Catch` 的 `Promise` 异常：`unhandledrejection`
5. `VUE errorHandler` 和 `React componentDidCatch`
6. 监控网页崩溃：`window` 对象的 `load` 和 `beforeunload`
7. 跨域 `crossOrigin` 解决