# 移动端Hybrid开发相关知识

- 2020-07-06

## 什么是Hybrid App

> `Hybrid App`其实指的是那些在原生应用开发(ios应用、android应用)中嵌入了H5技术等的app。

早在`Google`推出`Android`,`Apple`推出`iOS`后，就有了App开发工程师。早期的app基本上都是以原生开发为主，对应工程师开发对应的平台。直到H5技术的出现,可以说把`Hybrid App`带上了高潮。

## H5部分概念

`HTML5`是在2014年9月份正式发布的,对标早期的HTML版本做了很大的升级，可以说是新开门派了。`HTML5`正式火爆应该算是在2015年之后，正是由于H5技术热，带动了原生应用对H5技术的升级。

## 原生应用中的webview

我们都知道原生应用中提供了一个用来显示网页的组件，在`android`中提供的是`webview`，`ios7`以下是`UIWebview`，`ios7`以上是`WKWebview`。

在HTML5大火之前，这些`webview`可能只是用来承载一些规则页等静态资源，大火之后一些酷炫的功能也可以通过H5技术来实现，然后让元生应用来承载这个页面，这样大大提高了开发效率，也增加了别样的用户体验。

## Hybrid的开发形式

- 半Native 半web开发模式

这种模式下,底层功能API均由原生容器通过某种方式提供,然后业务逻辑由H5页面完成,最终原生容器加载H5页面,完成整个App。

- 纯web开发模式

这种模式下,意味着Native侧各种类型的api都很完善,那么这时候几乎所有与业务相关的逻辑都是放在H5页面中的,原生只作为容器存在。

## 市场上现有App开发技术方案

1. ### Native App

这种模式即传统的原生APP开发模式,`Android`基于`Java`语言,底层调用`Google`的 API;`iOS`基于`Object-C`或者`Swift`语言,底层调用`App`官方提供的API。

**优点**

- 直接依托于操作系统,交互性最强,性能最好,开发出来的体验最好。

- 功能最为强大,特别是在与系统交互中,几乎所有功能都能实现。

**缺点**

- 开发成本高,开发周期长,无法跨平台,不同平台`Android`和`iOS`需要各自独立开发。

- 门槛较高,原生人员有一定的入门门槛,而且需要学习不同的语言。

- 更新缓慢,特别是发布应用商店后,需要等待商店审核,特别是ios这块。

- 后期维护成本高,需要维护两套代码。

2. ### Web App

这种模式即移动端的网站,将页面部署在服务器上,然后用户使用各大浏览器访问。一般泛指 `SPA(Single Page Application)`模式开发出的网站。现有技术一般也会将其只作为`PWA`模式。

**优点**

- 开发成本低,可以跨平台,调试方便,一套代码可以在所有浏览器上跑。

- 维护成本低,可以自由的进行发版和修复,无需等待审核。

- 无需安装对应的app,一个网站就可以轻松访问。

**缺点**

- 性能低,用户体验差,直接通过浏览器访问,一些原生的api无法使用。

- 过渡依赖于网络状况,网络差的时候就会产生长时间的白屏等问题,消耗的流量比较大。

- 临时性入口,用户留存率低,由于无需安装对应的应用,用户可能使用了一次之后忘记了入口。

3. ### Hybrid App

这种模式即本文的混合开发,由`Native`通过`JSBridge`提供统一的`API`,然后用`HTML5+JS`来写实际的逻辑,调用API,这种模式下,由于`Android`,`iOS`的API一般有一致性,而且最终的页面也是在`webview`中显示,所以可以达到跨平台开发的效果。

**优点**

- 相对原生开发,开发成本较低,可以跨平台,调试方便。

- 维护成本低,功能可复用,而且没有更新的限制(指app仅提供api且api没有变更的场景)。

- 功能更加完善,性能和体验要比起web app好许多,一些原生的方法都可以使用。

- 部分对性能要求较高,或者功能上大都是与原生系统交互的页面可以选择使用原生开发,比较灵活。

**缺点**

- 相比原生应用,性能仍然有较大损耗,瓶颈主要在`webview`的加载与注入以及本身对`webview`的限制。

- 不适用于交互性较强的app,如那些对原生系统依赖较多,动画要求较高的一些应用。

4. ### React Native、Flutter等第三方框架

这种模式下基本都是实现了Js开发(RN)或者 Data语言开发原生app的技术，对应的都有一套自己的AST树转化规则和生成UI视图的机制。可以通过js等编写出跨平台app。

**优点**

- 拥有接近原生应用的用户体验,在可以使用原生功能的基础上,开发效率大大提升。

- 跨平台开发,一套代码可以跑通多端,更新比较方便(指不涉及原生改动),可以直接热修复。

- 社区比较繁荣,很多功能已有现成轮子,遇到问题可以去社区中找寻答案。

**缺点**

- 虽然是跨平台开发,但是某些功能可能单个平台才支持,适配和一些api仍需两端独立开发。

- 学习成本较高,需要额外掌握对应的跨平台开发语言。

:::tip
具体要选择什么样的开发模式需要根据实际的业务场景进行选择。

相对于原生开发，Hybrid开发效率提高了很大，但是同时也损耗了一些用户体验。
:::


## Hybrid通信基本架构

最简单的通信方式如下所示:

![Hybrid通信基本架构](https://img-blog.csdnimg.cn/20200706114445553.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

## Hybrid通信实现

在实现与Native侧交互前,涉及到两个概念。

1. app基本上都是与版本有关的,某些版本可能才支持某些特有的功能。

2. 如何知道当前是处于app环境中,并且如何获得真实的app版本号。

实际开发过程中,我们会把对应的app版本等信息挂载到user-agent属性上。

<!-- ### Javascript Core实现
```js
// native侧定义方法
const NativeBridge = {};
NativeBridge.getAddress = function(callback){
    // h5与native通信的方式
    callNative({
        name: 'getAddress',
        callback: function(data){
            callback(data);
        }
    })
    // hybrid://getAddress?callback=func
}

// js侧
NativeBridge.getAddress(function(){
    // ...other code
})

function callNative(name, data) {
    if (!isNotInApp) {
        logError('请检查当前环境');
        return;
    }

    if (typeof name !== 'string') {
        logError('调用的方法名必须为string');
        return;
    }

    if (isIos) {
        if (!window.webkit || !window.webkit.messageHandlers || !window.webkit.messageHandlers[name]) {
            logError(`请检查ios方法是否挂载成功,${name}`);
            return;
        }
        window.webkit.messageHandlers[name].postMessage(data);
        return;
    }

    if (isAndroid) {
        if (!window.wxx || !window.wxx[name]) {
            logError(`请检查android方法是否挂载成功,${name}`);
            return;
        }
        window.wxx[name](data);
    }
}
``` -->

<!-- ### URL Schema

这是一种在早期版本中使用较多的方法,因为在hybrid刚出来时，很多低版本都需要兼容，因此几乎都使用该种方式。

**基本原理:**

H5 -> 触发一个url（每一个功能代表的url都不同）-> Native端捕获到url -> Native端分析属于哪一个功能并执行 -> Native端调用H5中的方法将执行结果回调给H5

![描述](https://img-blog.csdnimg.cn/20200706220445875.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70) -->


<!-- #### 第一步:设计出一个Native与JS交互的全局桥对象

我们规定,JS和Native之间的通信必须通过一个H5全局对象`JSbridge`来实现,该对象有如下特点:

- 该对象名为`JSBridge`,是H5页面中全局对象`window`的一个属性。

```js
var JSBridge = window.JSBridge || (window.JSBridge = {});
```

- 该对象有如下方法:

    - `registerHandler(name,func)`H5注册本地JS方法,注册后`Native`可通过`JSBridge`调用。调用后会将方法注册到本地变量`messageHandlers`中。

    - `callHandler(name,params,func)`H5调用原生开放的api,调用后实际上还是本地通过`url scheme`触发。调用时会将回调id存放到本地变量`responseCallbacks`中。

    - `_handleMessageFromNative(params)`Native调用原生调用H5页面注册的方法,或者通知H5页面执行回调方法。

![调用流程](https://img-blog.csdnimg.cn/20200706221451714.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)


#### 第二步:JS如何调用Native

在第一步中,我们定义好了全局桥对象,可以我们是通过它的`callHandler`方法来调用原生的api,那么它内部经历了一个怎么样的过程呢？

1. 判断是否有回调函数,如果有,生成一个回调函数id,并将id和对应回调添加进入回调函数集合`responseCallbacks`中。

2. 通过特定的参数转换方法,将传入的数据,方法名一起,拼接成一个`url scheme`

```js
// url scheme的格式示例
// 基本有用信息就是后面的callbackId,handlerName与data
// 原生捕获到这个scheme后会进行分析
var uri = CUSTOM_PROTOCOL_SCHEME://API_Name:callbackId/handlerName?data
```

3. 使用内部早就创建好的一个隐藏`iframe`来触发`scheme`

```js
// 创建隐藏iframe过程
var messagingIframe = document.createElement('iframe');
messagingIframe.style.display = 'none';
document.documentElement.appendChild(messagingIframe);

// 触发scheme
messagingIframe.src = uri;
```

#### 第三步:Native如何得知api被调用

在上一步中,我们已经成功在H5页面中触发scheme,那么Native如何捕获scheme被触发呢？

根据系统不同,Android和iOS分别有自己的处理方式。

:::tip
这里暂未找到合适的示例代码,等待后期更新
:::

### JsCore实现

在H5端调用方式不变,只是原生端把对scheme的解析都换成了对应实现的`javascriptCore`。 -->


<!-- ## api.js

```js
import { wptBridgeJsCallNative, wptBridgeRegisterForNativeJs, wptBridgeJsCallBack } from './core';

export default {
    // 注册方法用于让APP调用
    register(name, cb) {
        return wptBridgeRegisterForNativeJs(name, cb);
    },
    // js调用app中的方法，支持超时
    call(name, param, success, fail, timeout = 3000) {
        let timer = setTimeout(() => {
            fail && fail();
            timer = null;
        }, timeout);
        wptBridgeJsCallNative(
            name,
            param,
            (res) => {
                if (timer === null) {
                    return;
                }
                clearTimeout(timer);
                success && success(res);
            },
            () => {
                if (timer === null) {
                    return;
                }
                clearTimeout(timer);
                fail && fail();
            }
        );
    },
    // js回调app的方法
    callBack(name, params) {
        wptBridgeJsCallBack({ eventId: name, params });
    },
    // call方法的promise版本
    send(name, param, timeout = 3000) {
        return new Promise((resolve, reject) => {
            this.call(
                name,
                param,
                ({ code, msg, data }) => {
                    if (code === 0) {
                        resolve(data);
                    } else {
                        reject(msg);
                    }
                },
                reject,
                timeout
            );
        });
    },
};
```

## core.js

```js
import { HEAD_OF_CALLBACK, VERSION } from './config';
import {
    isWPTIos, isWPTAndroid, getUuid, logError, isWPTApp
} from './util';
import CallbackAggregate from './class/CallbackAggregate';
import ForNativeJsAggregete from './class/ForNativeJsAggregete';

/**
 *处理回调函数
 *
 * @param {*} callBack
 * @param {*} failCallBack
 */
function handleCallBack(callBack, failCallBack = null) {
    let CB_NAME;
    if (callBack) {
        CB_NAME = HEAD_OF_CALLBACK + getUuid();
        CallbackAggregate.add(CB_NAME, callBack, failCallBack);
    }

    return CB_NAME || '';
}

/**
 *处理Js传递给原生的参数
 *
 * @param {*} data
 * @param {number} [type=1] 1:js调用原生方法，2：js回调原生
 * @returns
 */
function handleJsParams(data, type = 1) {
    const { name, params, eventId } = data;
    if (typeof name !== 'string' && type === 1) {
        logError('错误的方法名类型');
        return '';
    }

    if (typeof eventId !== 'string') {
        logError('eventId 必须是字符串');
        return '';
    }

    return type === 1
        ? JSON.stringify({
            name,
            eventId,
            global: false,
            params,
            version: VERSION,
        })
        : JSON.stringify({
            eventId,
            object: {
                code: 0,
                meg: '',
                data: params,
            },
            version: VERSION,
        });
}

/**
 *调用原生挂载的方法
 *
 * @param {*} data
 * @param {*} name
 */
function callNative(name, data) {
    if (!isWPTApp) {
        logError('请检查当前环境');
        return;
    }

    if (typeof name !== 'string') {
        logError('调用的方法名必须为string');
        return;
    }

    if (isWPTIos) {
        if (!window.webkit || !window.webkit.messageHandlers || !window.webkit.messageHandlers[name]) {
            logError(`请检查ios方法是否挂载成功,${name}`);
            return;
        }
        window.webkit.messageHandlers[name].postMessage(data);
        return;
    }

    if (isWPTAndroid) {
        if (!window.wxx || !window.wxx[name]) {
            logError(`请检查android方法是否挂载成功,${name}`);
            return;
        }
        window.wxx[name](data);
    }
}

/**
 * 统一处理业务调用
 *
 * @param {*} name
 * @param {*} params
 * @param {*} callBack
 * @param {*} failCallBack
 */
function wptBridgeJsCallNative(name, params, callBack, failCallBack) {
    if (typeof params === 'function' && typeof failCallBack === 'undefined') {
        [failCallBack, callBack, params] = [callBack, params, {}];
    }

    const eventId = handleCallBack(callBack, failCallBack);
    const rParams = handleJsParams({
        eventId,
        name,
        params,
    });

    if (!rParams) {
        CallbackAggregate.remove(eventId);
        return;
    }

    callNative('wptBridgeJsCallNative', rParams);
}

/**
 *从回调函数池中调用回调函数
 *
 * @param {*} eventId
 * @param {*} complete
 * @param {*} object
 * @returns
 */
function wptBridgeCbHandle(eventId, complete, object) {
    if (typeof eventId !== 'string') {
        logError('eventId值有误');
        return;
    }

    CallbackAggregate.call({
        CB_NAME: eventId,
        type: object.code,
        object,
    });

    if (complete) {
        CallbackAggregate.remove(eventId);
    }
}

/**
 *原生回调js方法
 *
 * @param {*} data
 */
function wptBridgeNativeCallBack(data) {
    if (!(typeof data !== 'object' || typeof data !== 'string')) {
        logError('回传数据有误');
        return;
    }

    let tmp;
    if (typeof data === 'string') {
        tmp = JSON.parse(data);
    } else {
        tmp = data;
    }

    const { eventId, complete, object } = tmp;

    wptBridgeCbHandle(eventId, complete, object);
}

/**
 *原生直接调用js方法
 *
 * @param {*} data
 */
function wptBridgeNativeCallJs(data) {
    if (typeof data !== 'object' || !data.name) {
        logError('传递参数错误或未传递调用的方法名');
        return;
    }

    ForNativeJsAggregete.call(data);
}

/**
 *js回调原生
 *
 * @param {*} data
 * @returns
 */
function wptBridgeJsCallBack(data) {
    const { eventId, params } = data;
    const rParams = handleJsParams(
        {
            eventId,
            params,
        },
        2
    );

    if (!rParams) return;

    callNative('wptBridgeJsCallBack', rParams);
}

/**
 * 注册给原生调用的全局方法
 *
 * @param {string} NAME
 * @param {Function} callback
 * @returns {Function} unRegistryFn
 */
function wptBridgeRegisterForNativeJs(NAME, callback = () => undefined) {
    if (!isWPTApp) {
        return () => undefined;
    }

    ForNativeJsAggregete.add(NAME, callback);

    return () => {
        ForNativeJsAggregete.remove(NAME, callback);
    };
}

export {
    wptBridgeJsCallNative,
    wptBridgeJsCallBack,
    handleCallBack,
    handleJsParams,
    wptBridgeNativeCallBack,
    wptBridgeNativeCallJs,
    wptBridgeCbHandle,
    wptBridgeRegisterForNativeJs
};
```

## config.js

```js
const HEAD_OF_CALLBACK = 'wpt_bridge_cb_';
const CALLBACK_AGGREGATE = '_wpt_bridge_cbs_';
const FOR_NATIVE_JS = '_wpt_bridge_native_js_';
const VERSION = '1.0';

export {
    HEAD_OF_CALLBACK, 
    CALLBACK_AGGREGATE, 
    FOR_NATIVE_JS, 
    VERSION
};
```

## utils.js

```js
const UA = window.navigator.userAgent;
const isWPTApp = UA.match(/wptmessenger/i);
const isWPTIos = UA.match(/iphone|ipad|ipod/i) && UA.match(/wptmessenger/i);
const isWPTAndroid = UA.match(/android/i) && UA.match(/wptmessenger/i);

const getUuid = () => Math.random().toString(36).substr(2);

const logError = (err) => {
    console.error(`wptBridge: ${err}`);
};

export { getUuid, isWPTApp, isWPTIos, isWPTAndroid, logError };
```

## global.js

```js
import { wptBridgeNativeCallBack, wptBridgeNativeCallJs, wptBridgeJsCallBack } from './core';
import ForNativeJsAggregete from './class/ForNativeJsAggregete';
import importOldVersionJSBridge from './oldVersion';
import { isWPTApp, logError } from './util';

const gFunctions = {
    a: (data, eventId) => {
        console.log('a Function called');
        if (eventId) {
            wptBridgeJsCallBack({
                eventId,
                params: {
                    b: 2,
                },
            });
        }
    },
};

/**
 *设置全局函数
 *
 * @param {*} functions
 */
function addGlobalFunction(functions) {
    Object.keys(functions).forEach(key => {
        if (typeof functions[key] === 'function') {
            ForNativeJsAggregete.add(key, functions[key]);
        } else {
            logError('设置ForNativeJsAggregete的值必须为函数');
        }
    });
}

function initWptBridge() {
    if (isWPTApp) {
        addGlobalFunction(gFunctions);
        window.wptBridgeNativeCallBack = wptBridgeNativeCallBack;
        window.wptBridgeNativeCallJs = wptBridgeNativeCallJs;
        // 引入版本376之前的 jsBridge 文件
        importOldVersionJSBridge();
    }
}

export { initWptBridge };
```

## index.js

```js
import os from '@packages/lib-os';

import JSBridge from './api';
import { wptBridgeJsCallNative, wptBridgeRegisterForNativeJs } from './core';
import share from './share';
import { isWPTApp } from './util';

export { initWptBridge } from './global';

export const wptBridge = {
    ...share,
    bridgeTest: () =>
        wptBridgeJsCallNative(
            'bridgeTest',
            { a: 1, b: [1, 2, 3] },
            (res) => console.log(res.data.c, res.data.num),
            () => console.log('fail')
        ),
    /**
     * app设置消息推送函数
     * @param {0|1|2} param 参数：0 查询状态 1 弹出弹层 2 跳转原生页面 3 签到界面弹窗 4 出价完成之后弹窗
     * @param {(open: number) => void} successFn 查询状态参数回调，0未开启 1已开启
     */
    handleAppNotification: (param, successFn) => {
        if (os.wptAppVerison >= 350) {
            wptBridgeJsCallNative('handleAppNotification', { action: param }, successFn);
        }
    },

    /**
     * app播放视频
     * @param {{ src: string; cover: string; }} param 参数：src 视频地址 url 视频封面 cover
     */
    playVideo: ({ src, cover }) => {
        if (os.wptAppVerison >= 352 && os.ios) {
            wptBridgeJsCallNative('wptAppVideoPlay', { src, cover });
            return true;
        }
        return false;
    },

    /**
     * APP内视频预加载
     * @param videos [{url: '', cover: ''}]
     */
    preloadVideo: (videos = []) => {
        const videoInfos = videos
            .map(({ url: videoUrl = '', cover: videoCover = '' } = {}) => ({
                videoUrl,
                videoCover,
            }))
            .filter((item) => !!item.videoUrl);
        os.wptAppVerison >= 365 &&
            videoInfos.length &&
            wptBridgeJsCallNative('wptVideoPreCache', {
                videoInfos,
            });
    },

    setVideoPosition: (position = {}) => {
        const { x = 0, y = 0, width = 0, height = 0 } = position;
        os.ios &&
            os.wptAppVerison >= 365 &&
            wptBridgeJsCallNative('wptVideoCellLocation', {
                x,
                y,
                width,
                height,
            });
    },

    closeWebView: (param, successFn) => {
        if (os.wptAppVerison >= 355) {
            wptBridgeJsCallNative('closeWebView', { action: param }, successFn);
            return true;
        }
        return false;
    },

    // 手机号绑定成功后将 userinfo 传给 APP
    bindTelCallAPP: (param) => {
        if (os.wptAppVerison >= 358) {
            wptBridgeJsCallNative('userInfoFromBindTel', { userinfo: param });
        }
    },

    // 新增/编辑地址
    editAddress: (address, success) => {
        if (os.wptAppVerison >= 360) {
            wptBridgeJsCallNative('editAddress', { address }, success);
            return true;
        }
        return false;
    },

    /**
     * app唤起微信支付分
     */
    handleWeixinPayScore: ({ query, businessType }, successFn) => {
        if (os.wptAppVerison >= 361) {
            wptBridgeJsCallNative('handleWeixinPayScore', { query, businessType }, successFn);
            return true;
        }
        return false;
    },

    // 风险用户校验结果通知 APP
    riskverifyCallAPP: (param) => {
        if (os.wptAppVerison >= 360) {
            wptBridgeJsCallNative('userVerifyFinished', { code: param });
            return true;
        }
        return false;
    },

    // native 视频上传
    uploadVideo: ({ bType, timeLimit, callback, needNickname = true, deleteWptWaterMark = false }) => {
        if (os.wptAppVerison >= 361) {
            wptBridgeJsCallNative(
                'uploadVideo',
                { bType, timeLimit, watermarkName: needNickname ? WPT.userinfo.nickname : '', deleteWptWaterMark },
                callback
            );
        }
    },

    /**
     * 检测用户是否安装微信app
     * @param {(open: number) => void} successFn 查询状态参数回调，0未安装 1已安装
     */
    checkWeixinAppInstalled: (successFn) => {
        if (os.wptAppVerison >= 367) {
            wptBridgeJsCallNative('checkWeixinAppInstalled', {}, successFn);
        }
    },
    // 改变statusBar主题
    changeStatusBarTheme: ({ isBlack = 1, backgroundColor = null }) => {
        if (os.wptAppVerison >= 367) {
            wptBridgeJsCallNative('wptUpdateStatusBarStyle', { isBlack, backgroundColor });
        }
    },
    // 传递需要改变webview底色的配置
    updateWebViewBackgroundConfig: (config) => {
        if (os.wptAppVerison >= 367) {
            wptBridgeJsCallNative('wptUpdateWebViewBackgroundConfig', { config });
        }
    },
    // 重置页面底色
    resetWebViewBackgroundColor: () => {
        if (os.wptAppVerison >= 367) {
            wptBridgeJsCallNative('wptResetWebViewBackgroundColor');
        }
    },
    // 通知app js已经准备好了
    wptH5JSPrepareed: () => {
        if (os.wptAppVerison >= 377) {
            wptBridgeJsCallNative('wptH5JSPrepareed');
        }
    },

    // app保存视频功能
    /**
     * @param videoUrl  视频链接
     * @param { videoUrl: '', tips: '' } path
     * @returns
     */
    wptDownloadVideo: (path) => {
        if (!path) return;
        let params = {};
        if (typeof path === 'string') {
            params.videoUrl = path;
        } else if (typeof path === 'object' && path.videoUrl) {
            params = {
                ...path,
            };
        }
        wptBridgeJsCallNative('wptDownloadVideo', { ...params });
    },

    // app保存图片功能
    /**
     * @param imgUrl  视频链接
     * @param { imgUrl: '', tips: '' } path
     * @returns
     */
    wptDownloadImage: (path) => {
        if (!path) return;
        let params = {};
        if (typeof path === 'string') {
            params.imgUrl = path;
        } else if (typeof path === 'object' && path.imgUrl) {
            params = {
                ...path,
            };
        }
        if (os.wptAppVerison >= 371) {
            wptBridgeJsCallNative('wptDownloadImage', { ...params });
        } else {
            window.wx &&
                window.wx.downloadImage &&
                window.wx.downloadImage({
                    serverId: params.imgUrl,
                });
        }
    },

    /**
     * 支付弹窗sdk
     * @param {Boolean} onlyForEnsure 检查是否可用
     * @param {String} orderNo 订单号
     * @param {String} title 支付弹窗标题
     * @param {String} tips 弹窗中部提示
     * @param {Function} success 回调
     */
    paySdk: ({ orderNo, title, tips, onlyForEnsure = false }, success) => {
        const enable = (os.wjb && os.wjbVersion >= 114) || os.wptAppVerison >= 373;
        if (onlyForEnsure) {
            return enable;
        }
        if (enable) {
            wptBridgeJsCallNative(
                'wptPaySdk',
                {
                    orderNo,
                    title,
                    tips,
                },
                success
            );
            return true;
        }
        return false;
    },
    // 通知APP进入验证码解锁
    enterNetUnlock: () => {
        wptBridgeJsCallNative('wptH5EnterIPDeblocking');
    },
    /**
     * app播放视频
     * @param {{ enable:'yes'|'no'; }} param 参数：direct: 弹性方向 enable: yes开启 no禁用
     */
    wptBounceEnable: ({ enable }) => {
        if (os.wptAppVerison >= 378 && os.ios) {
            wptBridgeJsCallNative('wptBounceEnable', { enable });
        }
    },
    openNewWebview: (url) => {
        if (os.wpt && !os.wjb && os.wptAppVerison >= 384) {
            wptBridgeJsCallNative('wptOpenNewWindowWebView', {
                url: !/^http(s?)/.test(url) ? `https://${window.location.host}${url}` : url,
            });
            return true;
        }
        return false;
    },

    /**
     * 获取本地通讯录
     */
    wptContactsBook: (successFn) => {
        if (os.wptAppVerison >= 385) {
            wptBridgeJsCallNative('wptContactsBook', successFn);
        }
    },

    /**
     * 获取腾讯地图
     */
    wptLocation: (successFn) => {
        if (os.wptAppVerison >= 385 && !os.wjb) {
            wptBridgeJsCallNative('wptLocation', successFn);
        }
    },

    /**
     * 省市区选择列表
     */
    wptCityList: (addressParams, successFn) => {
        if (os.wptAppVerison >= 390 && !os.wjb) {
            wptBridgeJsCallNative('wptCityList', addressParams, successFn);
            return true;
        }
        return false;
    },

    /**
     * 从app获取用户当前真实手机号
     * @param {type:'token'} 获取accessToken
     * @param {type:'phone'} 获取手机号
     */
    requestRealPhone(params, success, fail) {
        // ios >= 385 或者 android >= 387 才能使用一键登录功能
        if (os.wptAppVerison >= 387 || (os.wptAppVerison >= 385 && os.ios)) {
            wptBridgeJsCallNative('getPhoneCode', params, success, fail);
        } else {
            fail && fail();
        }
    },

    /**
     * 检测用户是否安装微博app
     * @param {(open: number) => void} successFn 查询状态参数回调，0未安装 1已安装
     */
    checkWeiboAppInstalled: (successFn) => {
        if (os.wptAppVerison >= 385) {
            wptBridgeJsCallNative('checkWeiboAppInstalled', {}, successFn);
        }
    },

    // app 检查是否有最新版本
    checkNativeUpdate: () => {
        if (os.wptAppVerison >= 389) {
            wptBridgeJsCallNative('wptCheckNativeUpdate');
        }
    },

    // 查询 app 缓存大小
    getNativeCacheSize: (successFn) => {
        if (os.wptAppVerison >= 389) {
            wptBridgeJsCallNative('wptNativeCacheSize', successFn);
        }
    },

    // 清除 app 缓存
    clearNativeCache: (successFn) => {
        if (os.wptAppVerison >= 389) {
            wptBridgeJsCallNative('wptClearNativeCache', successFn);
        }
    },

    // app 提供的 webview 返回方法
    webviewBack: () => {
        if (os.wptAppVerison >= 389) {
            wptBridgeJsCallNative('wptWebviewBack');
        }
    },

    // 获取粘贴板内容
    readNativeClipboard: (successFn) => {
        if (os.wptAppVerison >= 389) {
            wptBridgeJsCallNative('wptReadNativeClipboard', successFn);
        }
    },

    /**
     * 新app用户登录方法
     */
    newAppLogin: ({ reportPosition = '', success = () => undefined, fail = () => undefined }) => {
        if (os.wptAppVerison >= 390) {
            window.successLogin = success;
            window.failLogin = fail;

            wptBridgeJsCallNative('wptNewAppLogin', { loginSource: reportPosition });
        } else {
            WPT.showLogin(success, fail);
        }
    },
};

/**
 * 业务代码中注册函数给app调用同时调用原生方法
 *
 * @param {string} NAME 保证NAME和wptBridge中的NAME保持一致
 * @param {Function} callback
 * @returns {Function} unRegistryFn
 */
export function wptBridgeListener(NAME, callback = () => undefined, { callAtOnce = false, params = '' } = {}) {
    if (!isWPTApp) {
        return () => undefined;
    }

    const removeFuc = wptBridgeRegisterForNativeJs(NAME, callback);

    if (callAtOnce && wptBridge[NAME]) {
        wptBridge[NAME](params, callback);
    }

    return removeFuc;
}

export { wptBridgeRegisterForNativeJs };
//把JSBridge挂载到wptBridge上，方便进行全局调用
for (const key in JSBridge) {
    wptBridge[key] = JSBridge[key];
}
export default wptBridge;
``` -->