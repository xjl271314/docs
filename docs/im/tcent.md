# 腾讯云即时通讯IM(H5端)

- 2020.04.16

最近项目中有使用到即时通讯类sdk，目前的方案是腾讯云IM这块，在此做一个快速踩坑-腾讯云IM即时通信总结。

## 前言

腾讯云的IM是(Web和小程序)公用一套的,官方的[SDK下载地址](https://cloud.tencent.com/document/product/269/36887)。

:::tip
目前这里描述的是`1.7.3`版本，官方目前最新为`2.6.2`版本。
:::

## 开始

推荐使用H5项目Demo,[一分钟跑通Demo](https://cloud.tencent.com/document/product/269/36838#.E6.AD.A5.E9.AA.A41.EF.BC.9A.E5.88.9B.E5.BB.BA.E5.BA.94.E7.94.A8)。


## 初始化

可以自己手动下载引入到项目中或者通过`npm`包安装。

```js
// IM Web SDK
npm install tim-js-sdk --save
// 发送图片、文件等消息需要的 COS SDK
npm install cos-js-sdk-v5 --save
```

在项目脚本里引入模块。

```js
import TIM from 'tim-js-sdk';
import COS from "cos-js-sdk-v5";

let options = {
  SDKAppID: 0 // 接入时需要将0替换为您的即时通信 IM 应用的 SDKAppID
};

// 创建 SDK 实例，`TIM.create()`方法对于同一个 `SDKAppID` 只会返回同一份实例
let tim = TIM.create(options); // SDK 实例通常用 tim 表示

/**
 * 设置 SDK 日志输出级别，详细分级
 * 0 普通级别，日志量较多，接入时建议使用
 * 1 release级别，SDK 输出关键信息，生产环境时建议使用
 * 2 告警级别，SDK 只输出告警和错误级别的日志
 * 3 错误级别，SDK 只输出错误级别的日志s
 * 4 无日志级别，SDK 将不打印任何日志
 */
tim.setLogLevel(0);

// 注册 COS SDK 插件
tim.registerPlugin({'cos-wx-sdk': COS});
```

## 登录鉴权流程

用户登录 `IM SDK` 才能正常收发消息，登录需要用户提供 `UserID`、`UserSig` 等信息，具体含义请参见下方的流程图，通过`sdkAppID`请求后端接口获取对应的 `userSig`。

登录成功后，需要先等 `SDK` 处于 `ready` 状态才能调用 `sendMessage` 等需要鉴权的接口，您可以通过监听事件 `TIM.EVENT.SDK_READY` 获取 `SDK` 状态。

![登录鉴权流程](https://img-blog.csdnimg.cn/20200416150532155.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

### 服务端计算userSig

采用服务端计算 `UserSig`，可以最大限度地保障计算 `UserSig` 所用的密钥信息不被泄露。您只需将计算代码部署在您的服务器上，并提供面向 `App` 的服务端接口，在需要 `UserSig` 时由您的 `App` 向业务服务器发起请求获取动态 `UserSig`。完整的代码可以参考[腾讯的文档](https://cloud.tencent.com/document/product/269/32688),下面的示例是`Node.js`版本。

```js

/**
 * @param sdkappid 应用 SDKAppID，可在即时通信 IM 控制台 的应用卡片中获取。
 * @param userId 用户 ID,可以选择自己服务内对应的唯一id。
 * @param expire UserSig 的有效期，单位为秒。
 * @param userbuf 即时通信 IM 中均默认使用不带 UserBuf 的接口，即该参数默认填写为null。。
 * @param key 密钥信息，可在即时通信 IM 控制台 的应用详情页面中获取。
 * 
 */
var crypto = require('crypto');
var zlib = require('zlib');

var base64url = {};

var newBuffer = function (fill, encoding) {
    return Buffer.from ? Buffer.from(fill, encoding) : new Buffer(fill, encoding)
};

base64url.unescape = function unescape(str) {
    return (str + Array(5 - str.length % 4))
        .replace(/_/g, '=')
        .replace(/\-/g, '/')
        .replace(/\*/g, '+');
};

base64url.escape = function escape(str) {
    return str.replace(/\+/g, '*')
        .replace(/\//g, '-')
        .replace(/=/g, '_');
};

base64url.encode = function encode (str) {
    return this.escape(newBuffer(str).toString('base64'));
};

base64url.decode = function decode (str) {
    return newBuffer(this.unescape(str), 'base64').toString();
};

function base64encode(str) {
    return newBuffer(str).toString('base64')
}
function base64decode(str) {
    return newBuffer(str, 'base64').toString()
}

var Api = function(sdkappid, key) {
    this.sdkappid  = sdkappid;
    this.key = key;
};

/**
 * 通过传入参数生成 base64 的 hmac 值
 * @param identifier
 * @param currTime
 * @param expire
 * @returns {string}
 * @private
 */
Api.prototype._hmacsha256 = function(identifier, currTime, expire, base64UserBuf){
    var contentToBeSigned = "TLS.identifier:" + identifier + "\n";
    contentToBeSigned += "TLS.sdkappid:"+ this.sdkappid + "\n";
    contentToBeSigned += "TLS.time:" + currTime + "\n";
    contentToBeSigned += "TLS.expire:" + expire + "\n";
    if (null != base64UserBuf) {
        contentToBeSigned += "TLS.userbuf:" + base64UserBuf + "\n";
    }
    const hmac = crypto.createHmac("sha256", this.key);
    return hmac.update(contentToBeSigned).digest('base64');
};

/**
 * 生成 usersig
 * @param string $identifier 用户名
 * @return string 生成的失败时为false
 */
/**
 * 生成 usersig
 * @param identifier 用户账号
 * @param expire 有效期，单位秒
 * @returns {string} 返回的 sig 值
 */
Api.prototype.genSig = function(identifier, expire){
    return this.genSigWithUserbuf(identifier, expire, null);
};

/**
 * 生成带 userbuf 的 usersig
 * @param identifier  用户账号
 * @param expire 有效期，单位秒
 * @param userBuf 用户数据
 * @returns {string} 返回的 sig 值
 */
Api.prototype.genSigWithUserbuf = function(identifier, expire, userBuf){

    var currTime = Math.floor(Date.now()/1000);

    var sigDoc = {
        'TLS.ver': "2.0",
        'TLS.identifier': ""+identifier,
        'TLS.sdkappid': Number(this.sdkappid),
        'TLS.time': Number(currTime),
        'TLS.expire': Number(expire)
    };

    var sig = '';
    if (null != userBuf) {
        var base64UserBuf = base64encode(userBuf);
        sigDoc['TLS.userbuf'] = base64UserBuf;
        sig = this._hmacsha256(identifier, currTime, expire, base64UserBuf);
    } else {
        sig = this._hmacsha256(identifier, currTime, expire, null);
    }
    sigDoc['TLS.sig'] = sig;

    var compressed = zlib.deflateSync(newBuffer(JSON.stringify(sigDoc))).toString('base64');
    return base64url.escape(compressed);
};

exports.Api = Api;
```

userSig的值可以参考上面的生成。

```js
const url = '后台提供的生成用户userSig的接口地址';
// 登录的用户信息
const loginUserInfo = {
    sdkAppID, // 用户所属应用id,必填
    appIDAt3rd: sdkAppID, // 用户所属应用id，必填
    accountType, // 用户所属应用帐号类型，必填
    identifier: null, // 当前用户ID,必须是否字符串类型，选填
    identifierNick: '', // 当前用户昵称，选填
    userSig: null, // 当前用户身份凭证，必须是字符串类型，选填
    headurl: '', // 当前用户默认头像，选填
}
// 后端返回的userSig
const userSig = fetch(url, { userId });
loginInfo.userSig = data.userSig;

// 进行用户的登录操作
webim.login(
    loginInfo,
    listeners,// 选填 其他监听事件
    options, // 选填 其他选项
    res => {
        // identifierNick为登录用户昵称(没有设置时，为帐号)，无登录态时为空
        loginInfo.identifierNick = res.identifierNick; // 设置当前用户昵称
        loginInfo.headurl = res.headurl; // 设置当前用户头像
        webim.Log.info('webim登录成功', resp.identifierNick);
        retryConnect = 0;
        // 选填 登录成功的回调
        cb && cb();
    },
    err => {
        webim.Log.info(err.ErrorInfo);
        // 可以尝试重新登录
    }
);
```

:::warning
默认情况下，不支持多实例登录，即如果此帐号已在其他页面登录，若继续在当前页面登录成功，有可能会将其他页面踢下线。用户被踢下线时会触发事件`TIM.EVENT.KICKED_OUT`，用户可在监听到事件后做相应处理。多端登录监听示例如下：

```js
let onKickedOut = function (event) {
  console.log(event.data.type); // mutipleAccount(同一设备，同一帐号，多页面登录被踢)
};
tim.on(TIM.EVENT.KICKED_OUT, onKickedOut);
```

如需支持多实例登录（允许在多个网页中同时登录同一帐号），请登录 [即时通信 IM 控制台](https://cloud.tencent.com/login?s_url=https%3A%2F%2Fconsole.cloud.tencent.com%2Fim)，找到相应 `SDKAppID`，选择【应用配置】>【功能配置】>【登录与消息】>【Web端实例同时在线】配置实例个数。配置将在50分钟内生效。

:::

## 发送文本消息

```js
tim.createTextMessage(options);
```
参数`options`为`Object`类型，包含的属性值如下表所示：

| 参数名  | 类型 | 描述
| :--- | :---- | :----
| `to`   | String | 消息的接收方
| `conversationType` | String | 会话类型，取值TIM.TYPES.CONV_C2C(端到端)或TIM.TYPES.CONV_GROUP(群发消息)
| `payload` | Object | 消息内容的容器

其中 paylaod的描述如下表所示:

| 参数名  | 类型 | 描述
| :--- | :---- | :----
| `text` | String | 消息文本内容

```js
// 1.7.3
function sendMsg(msg, customObj, successCallBack, errorCallBack) {
    // 未登录
    if (!isLogin) {
        console.log('未登录');
        // 去登陆
        return sdkLogin();
    }
    // 当前选中聊天id（当聊天类型为私聊时，该值为好友帐号，否则为群号）
    if (!selToID) {
        console.log('您还没有进入房间，暂不能聊天');
        return;
    }
    if (msg?.trim()?.length === 0) {
        console.log('发送的消息不能为空!');
        return;
    }
    // 当前聊天会话
    if (!selSess) {
        selSess = new webim.Session(
            selType,
            selToID,
            selToID,
            selSessHeadUrl,
            Math.round(new Date().getTime() / 1000)
        );
    }

    const isSend = true; // 是否为自己发送
    const seq = -1; // 消息序列，-1表示sdk自动生成，用于去重
    const random = Math.round(Math.random() * 4294967296); // 消息随机数，用于去重
    const msgTime = Math.round(new Date().getTime() / 1000); // 消息时间戳
    let subType; // 消息子类型
    if (selType == webim.SESSION_TYPE.GROUP) {
        // 群消息子类型如下：
        // webim.GROUP_MSG_SUB_TYPE.COMMON-普通消息,
        // webim.GROUP_MSG_SUB_TYPE.LOVEMSG-点赞消息，优先级最低
        // webim.GROUP_MSG_SUB_TYPE.TIP-提示消息(不支持发送，用于区分群消息子类型)，
        // webim.GROUP_MSG_SUB_TYPE.REDPACKET-红包消息，优先级最高
        subType = webim.GROUP_MSG_SUB_TYPE.COMMON;
    } else {
        // C2C消息子类型如下：
        // webim.C2C_MSG_SUB_TYPE.COMMON-普通消息,
        subType = webim.C2C_MSG_SUB_TYPE.COMMON;
    }

    const msg = new webim.Msg(
        selSess,
        isSend,
        seq,
        random,
        msgTime,
        loginInfo.identifier,
        subType,
        loginInfo.identifierNick
    );

    // 解析文本和表情
    const expr = /\[[^[\]]{1,3}\]/gm;
    const emotions = msgtosend.match(expr);
    let text_obj;
    let face_obj;
    let tmsg;
    let emotionIndex;
    let emotion;
    let restMsgIndex;

    if (!emotions || emotions.length < 1) {
        text_obj = new webim.Msg.Elem.Text(msgtosend);
        msg.addText(text_obj);
    } else {
        // 有表情
        for (let i = 0; i < emotions.length; i++) {
            tmsg = msgtosend.substring(0, msgtosend.indexOf(emotions[i]));
            if (tmsg) {
                text_obj = new webim.Msg.Elem.Text(tmsg);
                msg.addText(text_obj);
            }
            emotionIndex = webim.EmotionDataIndexs[emotions[i]];
            emotion = webim.Emotions[emotionIndex];
            if (emotion) {
                face_obj = new webim.Msg.Elem.Face(emotionIndex, emotions[i]);
                msg.addFace(face_obj);
            } else {
                text_obj = new webim.Msg.Elem.Text(emotions[i]);
                msg.addText(text_obj);
            }
            restMsgIndex = msgtosend.indexOf(emotions[i]) + emotions[i].length;
            msgtosend = msgtosend.substring(restMsgIndex);
        }
        if (msgtosend) {
            text_obj = new webim.Msg.Elem.Text(msgtosend);
            msg.addText(text_obj);
        }
    }

    if (customObj) {
        const customElem = new webim.Msg.Elem.Custom(JSON.stringify(customObj), null, null);
        msg.addCustom(customElem);
    }
    webim.sendMsg(
        msg,
        res => {
            if (selType == webim.SESSION_TYPE.C2C) {
                // 私聊时，在聊天窗口手动添加一条发的消息，群聊时，长轮询接口会返回自己发的消息
                showMsg(msg);
            }
            webim.Log.info('发消息成功');
            successCallBack && successCallBack();
        },
        err => {
            webim.Log.error(`发消息失败:${err.ErrorInfo}`);
            // 其他自定义的失败处理
            errorCallBack && errorCallBack(err);
        }
    );
};

// 2.6.2

// 1. 创建消息实例
let message = webim.createTextMessage({
  to: 'user1',
  conversationType: webim.TYPES.CONV_C2C,
  payload: {
    text: 'Hello world!'
  }
});
// 2. 发送消息
let promise = tim.sendMessage(message);
promise.then(function(imResponse) {
  // 发送成功
  console.log(imResponse);
}).catch(function(imError) {
  // 发送失败
  console.warn('sendMessage error:', imError);
});
```
## 发送图片消息

```js
tim.createImageMessage(options);
```

参数`options`为`Object`类型，包含的属性值如下表所示：

| 参数名  | 类型 | 描述
| :--- | :---- | :----
| `to`   | String | 消息的接收方
| `conversationType` | String | 会话类型，取值TIM.TYPES.CONV_C2C(端到端)或TIM.TYPES.CONV_GROUP(群发消息)
| `payload` | Object | 消息内容的容器
| `onProgress`  | function | 获取上传进度的回调函数

其中 paylaod的描述如下表所示:

| 参数名  | 类型 | 描述
| :--- | :---- | :----
| `file` | HTMLInputElement 或 Object | 用于选择图片的 DOM 节点（Web）或者 File 对象（Web）或者微信小程序 wx.chooseImage 接口的 success 回调参数。SDK 会读取其中的数据并上传图片

**Web 端发送图片消息示例:**

```js
// 1. 创建消息实例，接口返回的实例可以上屏
let message = tim.createImageMessage({
  to: 'user1',
  conversationType: TIM.TYPES.CONV_C2C,
  // 消息优先级，用于群聊（v2.4.2起支持）。如果某个群的消息超过了频率限制，后台会优先下发高优先级的消息，详细请参考 消息优先级与频率控制
  // 支持的枚举值：TIM.TYPES.MSG_PRIORITY_HIGH, TIM.TYPES.MSG_PRIORITY_NORMAL（默认）, TIM.TYPES.MSG_PRIORITY_LOW, TIM.TYPES.MSG_PRIORITY_LOWEST
  // priority: TIM.TYPES.MSG_PRIORITY_NORMAL,
  payload: {
    file: document.getElementById('imagePicker'),
  },
  onProgress: function(event) { console.log('file uploading:', event) }
});
// 2. 发送消息
let promise = tim.sendMessage(message);
promise.then(function(imResponse) {
  // 发送成功
  console.log(imResponse);
}).catch(function(imError) {
  // 发送失败
  console.warn('sendMessage error:', imError);
});
```

**Web 端发送图片消息示例2- 传入 File 对象:**

```js
// 先在页面上添加一个 ID 为 "testPasteInput" 的消息输入框，例如 <input type="text" id="testPasteInput" placeholder="截图后粘贴到输入框中" size="30" />
document.getElementById('testPasteInput').addEventListener('paste', function(e) {
  let clipboardData = e.clipboardData;
  let file;
  let fileCopy;
  if (clipboardData && clipboardData.files && clipboardData.files.length > 0) {
    file = clipboardData.files[0];
    // 图片消息发送成功后，file 指向的内容可能被浏览器清空，如果接入侧有额外的渲染需求，可以提前复制一份数据
    fileCopy = file.slice();
  }

  if (typeof file === 'undefined') {
    console.warn('file 是 undefined，请检查代码或浏览器兼容性！');
    return;
  }

  // 1. 创建消息实例，接口返回的实例可以上屏
  let message = tim.createImageMessage({
    to: 'user1',
    conversationType: TIM.TYPES.CONV_C2C,
    payload: {
      file: file
    },
    onProgress: function(event) { console.log('file uploading:', event) }
  });

  // 2. 发送消息
  let promise = tim.sendMessage(message);
  promise.then(function(imResponse) {
    // 发送成功
    console.log(imResponse);
  }).catch(function(imError) {
    // 发送失败
    console.warn('sendMessage error:', imError);
  });
});
```

## 发送音频消息

> 创建音频消息实例的接口，此接口返回一个消息实例，可以在需要发送音频消息时调用 发送消息 接口发送消息。 目前 `createAudioMessage` 只支持在`微信小程序环境`使用。

```js
tim.createAudioMessage(options)
```

参数`options`为`Object`类型，包含的属性值如下表所示：

| 参数名  | 类型 | 描述
| :--- | :---- | :----
| `to`   | String | 消息的接收方
| `conversationType` | String | 会话类型，取值TIM.TYPES.CONV_C2C(端到端)或TIM.TYPES.CONV_GROUP(群发消息)
| `payload` | Object | 消息内容的容器

其中 paylaod的描述如下表所示:

| 参数名  | 类型 | 描述
| :--- | :---- | :----
| `file` | Object | 录音后得到的文件信息

**小程序示例：使用微信官方的 RecorderManager 进行录音，参考 RecorderManager.start(Object object):**

```js
// 1. 获取全局唯一的录音管理器 RecorderManager
const recorderManager = wx.getRecorderManager();

// 录音部分参数
const recordOptions = {
  duration: 60000, // 录音的时长，单位 ms，最大值 600000（10 分钟）
  sampleRate: 44100, // 采样率
  numberOfChannels: 1, // 录音通道数
  encodeBitRate: 192000, // 编码码率
  format: 'aac' // 音频格式，选择此格式创建的音频消息，可以在即时通信 IM 全平台（Android、iOS、微信小程序和 Web）互通
};

// 2.1 监听录音错误事件
recorderManager.onError(function(errMsg) {
  console.warn('recorder error:', errMsg);
});
// 2.2 监听录音结束事件，录音结束后，调用 createAudioMessage 创建音频消息实例
recorderManager.onStop(function(res) {
  console.log('recorder stop', res);

  // 4. 创建消息实例，接口返回的实例可以上屏
  const message = tim.createAudioMessage({
    to: 'user1',
    conversationType: TIM.TYPES.CONV_C2C,
    payload: {
      file: res
    }
  });

  // 5. 发送消息
  let promise = tim.sendMessage(message);
  promise.then(function(imResponse) {
    // 发送成功
    console.log(imResponse);
  }).catch(function(imError) {
    // 发送失败
    console.warn('sendMessage error:', imError);
  });
});

// 3. 开始录音
recorderManager.start(recordOptions);
```

## 发送文件消息

> 创建文件消息的接口，此接口返回一个消息实例，可以在需要发送文件消息时调用 发送消息 接口发送消息实例。

:::warning
! v2.3.1版本开始支持传入 File 对象，使用前需要将 SDK 升级至v2.3.1或以上。
! v2.4.0版本起，上传文件大小最大值调整为100MB。
! 微信小程序目前不支持选择文件的功能，故该接口暂不支持微信小程序端。
:::

```js
tim.createFileMessage(options)
```

参数`options`为`Object`类型，包含的属性值如下表所示：

| 参数名  | 类型 | 描述
| :--- | :---- | :----
| `to`   | String | 消息的接收方
| `conversationType` | String | 会话类型，取值TIM.TYPES.CONV_C2C(端到端)或TIM.TYPES.CONV_GROUP(群发消息)
| `payload` | Object | 消息内容的容器
| `onProgress` | function | 获取上传进度的回调函数

其中 paylaod的描述如下表所示:

| 参数名  | 类型 | 描述
| :--- | :---- | :----
| `file` | HTMLInputElement | 	用于选择文件的 DOM 节点（Web）或者 File 对象（Web），SDK 会读取其中的数据并上传文件

**Web 端发送文件消息示例1- 传入 DOM 节点:**

```js
// Web 端发送文件消息示例1 - 传入 DOM 节点
// 1. 创建文件消息实例，接口返回的实例可以上屏
let message = createFileMessage({
  to: 'user1',
  conversationType: TIM.TYPES.CONV_C2C,
  // 消息优先级，用于群聊（v2.4.2起支持）。如果某个群的消息超过了频率限制，后台会优先下发高优先级的消息，详细请参考 消息优先级与频率控制
  // 支持的枚举值：TIM.TYPES.MSG_PRIORITY_HIGH, TIM.TYPES.MSG_PRIORITY_NORMAL（默认）, TIM.TYPES.MSG_PRIORITY_LOW, TIM.TYPES.MSG_PRIORITY_LOWEST
  // priority: TIM.TYPES.MSG_PRIORITY_NORMAL,
  payload: {
    file: document.getElementById('filePicker'),
  },
  onProgress: function(event) { console.log('file uploading:', event) }
});
// 2. 发送消息
let promise = tim.sendMessage(message);
promise.then(function(imResponse) {
  // 发送成功
  console.log(imResponse);
}).catch(function(imError) {
  // 发送失败
  console.warn('sendMessage error:', imError);
});
```

**Web 端发送文件消息示例2- 传入 File 对象:**

```js
// 先在页面上添加一个 ID 为 "testPasteInput" 的消息输入框，如 <input type="text" id="testPasteInput" placeholder="截图后粘贴到输入框中" size="30" />
document.getElementById('testPasteInput').addEventListener('paste', function(e) {
  let clipboardData = e.clipboardData;
  let file;
  let fileCopy;
  if (clipboardData && clipboardData.files && clipboardData.files.length > 0) {
    file = clipboardData.files[0];
    // 图片消息发送成功后，file 指向的内容可能被浏览器清空，如果接入侧有额外的渲染需求，可以提前复制一份数据
    fileCopy = file.slice();
  }
  if (typeof file === 'undefined') {
    console.warn('file 是 undefined，请检查代码或浏览器兼容性！');
    return;
  }
  // 1. 创建消息实例，接口返回的实例可以上屏
  let message = tim.createFileMessage({
    to: 'user1',
    conversationType: TIM.TYPES.CONV_C2C,
    payload: {
      file: file
    },
    onProgress: function(event) { console.log('file uploading:', event) }
  });
  // 2. 发送消息
  let promise = tim.sendMessage(message);
  promise.then(function(imResponse) {
    // 发送成功
    console.log(imResponse);
  }).catch(function(imError) {
    // 发送失败
    console.warn('sendMessage error:', imError);
  });
});
```
## 发送自定义消息

> 创建自定义消息实例的接口，此接口返回一个消息实例，可以在需要发送自定义消息时调用 发送消息 接口发送消息实例。当 SDK 提供的能力不能满足您的需求时，可以使用自定义消息进行个性化定制，例如投骰子功能。

```js
tim.createCustomMessage(options)
```

参数`options`为`Object`类型，包含的属性值如下表所示：

| 参数名  | 类型 | 描述
| :--- | :---- | :----
| `to`   | String | 消息的接收方
| `conversationType` | String | 会话类型，取值TIM.TYPES.CONV_C2C(端到端)或TIM.TYPES.CONV_GROUP(群发消息)
| `payload` | Object | 消息内容的容器

其中 paylaod的描述如下表所示:

| 参数名  | 类型 | 描述
| :--- | :---- | :----
| `data` | String | 自定义消息的数据字段
| `description` | String | 	自定义消息的说明字段
| `extension` | String | 自定义消息的扩展字段

**利用自定义消息实现投骰子功能示例:**

```js
// 1. 定义随机函数
function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
// 2. 创建消息实例，接口返回的实例可以上屏
let message = tim.createCustomMessage({
  to: 'user1',
  conversationType: TIM.TYPES.CONV_C2C,
  // 消息优先级，用于群聊（v2.4.2起支持）。如果某个群的消息超过了频率限制，后台会优先下发高优先级的消息，详细请参考 消息优先级与频率控制
  // 支持的枚举值：TIM.TYPES.MSG_PRIORITY_HIGH, TIM.TYPES.MSG_PRIORITY_NORMAL（默认）, TIM.TYPES.MSG_PRIORITY_LOW, TIM.TYPES.MSG_PRIORITY_LOWEST
  // priority: TIM.TYPES.MSG_PRIORITY_HIGH,
  payload: {
    data: 'dice', // 用于标识该消息是骰子类型消息
    description: String(random(1,6)), // 获取骰子点数
    extension: ''
  }
});
// 3. 发送消息
let promise = tim.sendMessage(message);
promise.then(function(imResponse) {
  // 发送成功
  console.log(imResponse);
}).catch(function(imError) {
  // 发送失败
  console.warn('sendMessage error:', imError);
});
```

## 发送视频消息

> 创建视频消息实例的接口，此接口返回一个消息实例，可以在需要发送视频消息时调用 发送消息 接口发送消息。

:::warning
- 使用该接口前，需要将SDK版本升级至v2.2.0或以上。

- `createVideoMessage` 支持在微信小程序环境使用，从v2.6.0起，支持在 Web 环境使用。

- 微信小程序录制视频，或者从相册选择视频文件，没有返回视频缩略图信息。为了更好的体验，SDK 在创建视频消息时会设置默认的缩略图信息。如果接入侧不想展示默认的缩略图，可在渲染的时候忽略缩图相关信息，自主处理。

- 全平台互通视频消息，移动端请升级使用 最新的 TUIKit 或 SDK。
:::

```js
tim.createVideoMessage(options)
```

参数`options`为`Object`类型，包含的属性值如下表所示：

| 参数名  | 类型 | 描述
| :--- | :---- | :----
| `to`   | String | 消息的接收方
| `conversationType` | String | 会话类型，取值TIM.TYPES.CONV_C2C(端到端)或TIM.TYPES.CONV_GROUP(群发消息)
| `payload` | Object | 消息内容的容器

其中 paylaod的描述如下表所示:

| 参数名  | 类型 | 描述
| :--- | :---- | :----
| `file` | HTMLInputElement、File 或 Object | 用于选择视频文件的 DOM 节点（Web）或者 File 对象（Web），或微信小程序录制或者从相册选择的视频文件。SDK 会读取其中的数据并上传。

**小程序端发送视频消息示例 `wx.chooseVideo`:**

```js
// 1. 调用小程序接口选择视频，接口详情请查阅 
wx.chooseVideo({
  sourceType: ['album', 'camera'], // 来源相册或者拍摄
  maxDuration: 60, // 设置最长时间60s
  camera: 'back', // 后置摄像头
  success (res) {
    // 2. 创建消息实例，接口返回的实例可以上屏
    let message = tim.createVideoMessage({
      to: 'user1',
      conversationType: TIM.TYPES.CONV_C2C,
      payload: {
        file: res
      },
      onProgress: function(event) { console.log('video uploading:', event) }
    })
    // 3. 发送消息
    let promise = tim.sendMessage(message);
    promise.then(function(imResponse) {
      // 发送成功
      console.log(imResponse);
    }).catch(function(imError) {
      // 发送失败
      console.warn('sendMessage error:', imError);
    });
  }
})
```

**web 端发送视频消息示例（v2.6.0起支持）：**

```js
// 1. 获取视频：传入 DOM 节点
// 2. 创建消息实例
const message = tim.createVideoMessage({
  to: 'user1',
  conversationType: TIM.TYPES.CONV_C2C,
  payload: {
    file: document.getElementById('videoPicker') // 或者用event.target
  },
  onProgress: function(event) { console.log('file uploading:', event) }
});
// 3. 发送消息
let promise = tim.sendMessage(message);
promise.then(function(imResponse) {
  // 发送成功
  console.log(imResponse);
}).catch(function(imError) {
  // 发送失败
  console.warn('sendMessage error:', imError);
});
```

## 发送表情消息

> 创建表情消息实例的接口，此接口返回一个消息实例，可以在需要发送表情消息时调用 发送消息 接口发送消息。

:::warning
使用该接口前，需要将 SDK 版本升级至`v2.3.1`或以上。
:::

```js
tim.createFaceMessage(options)
```

参数`options`为`Object`类型，包含的属性值如下表所示：

| 参数名  | 类型 | 描述
| :--- | :---- | :----
| `to`   | String | 消息的接收方
| `conversationType` | String | 会话类型，取值TIM.TYPES.CONV_C2C(端到端)或TIM.TYPES.CONV_GROUP(群发消息)
| `payload` | Object | 消息内容的容器

其中 paylaod的描述如下表所示:

| 参数名  | 类型 | 描述
| :--- | :---- | :----
| `index` | Number | 表情索引，用户自定义
| `data` | String | 额外数据

**发送表情消息示例，Web 端与小程序端相同**

```js
// 1. 创建消息实例，接口返回的实例可以上屏
let message = tim.createFaceMessage({
  to: 'user1',
  conversationType: TIM.TYPES.CONV_C2C,
  // 消息优先级，用于群聊（v2.4.2起支持）。如果某个群的消息超过了频率限制，后台会优先下发高优先级的消息，详细请参考 消息优先级与频率控制
  // 支持的枚举值：TIM.TYPES.MSG_PRIORITY_HIGH, TIM.TYPES.MSG_PRIORITY_NORMAL（默认）, TIM.TYPES.MSG_PRIORITY_LOW, TIM.TYPES.MSG_PRIORITY_LOWEST
  // priority: TIM.TYPES.MSG_PRIORITY_NORMAL,
  payload: {
    index: 1, // Number 表情索引，用户自定义
    data: 'tt00' // String 额外数据
  }
});
// 2. 发送消息
let promise = tim.sendMessage(message);
promise.then(function(imResponse) {
  // 发送成功
  console.log(imResponse);
}).catch(function(imError) {
  // 发送失败
  console.warn('sendMessage error:', imError);
});
```

## 撤回消息

> 撤回单聊消息或者群聊消息。撤回成功后，消息对象的 `isRevoked` 属性值为 `true`。

:::warning
- 使用该接口前，需要将 SDK 版本升级至v2.4.0或以上。

- 消息可撤回时间默认为2分钟。可通过 控制台 调整消息可撤回时间。

- 被撤回的消息，可以调用 `getMessageList` 接口从单聊或者群聊消息漫游中拉取到。接入侧需根据消息对象的 `isRevoked` 属性妥善处理被撤回消息的展示。例如，单聊会话内可展示为 "对方撤回了一条消息"，群聊会话内可展示为 "张三撤回了一条消息"。

- 可使用 `REST API` 撤回单聊消息 或 撤回群聊消息。
:::

```js
tim.revokeMessage(options)
```

参数`options`为`Object`类型，包含的属性值如下表所示：

| 参数名  | 类型 | 描述
| :--- | :---- | :----
| `message`   | Message | 消息实例

**主动撤回消息示例:**

```js
let promise = tim.revokeMessage(message);
promise.then(function(imResponse) {
  // 消息撤回成功
}).catch(function(imError) {
  // 消息撤回失败
  console.warn('revokeMessage error:', imError);
});
```

**收到消息被撤回的通知：**

```js
tim.on(TIM.EVENT.MESSAGE_REVOKED, function(event) {
  // 使用前需要将 SDK 版本升级至v2.4.0或以上。
  // event.name - TIM.EVENT.MESSAGE_REVOKED
  // event.data - 存储 Message 对象的数组 - [Message] - 每个 Message 对象的 isRevoked 属性值为 true
});
```

**获取会话的消息列表时遇到被撤回的消息:**

```js
let promise = tim.getMessageList({conversationID: 'C2Ctest', count: 15});
promise.then(function(imResponse) {
  const messageList = imResponse.data.messageList; // 消息列表
  messageList.forEach(function(message) {
    if (message.isRevoked) {
      // 处理被撤回的消息
    } else {
      // 处理普通消息
    }
  });
});
```

## 重发消息

> 重发消息的接口，当消息发送失败时，调用该接口进行重发。

```js
tim.resendMessage(options)
```

参数`options`为`Object`类型，包含的属性值如下表所示：

| 参数名  | 类型 | 描述
| :--- | :---- | :----
| `message`   | Message | 消息实例

**重发消息示例:**

```js
let promise = tim.resendMessage(message); // 传入需要重发的消息实例
promise.then(function(imResponse) {
  // 重发成功
  console.log(imResponse.data.message);
}).catch(function(imError) {
  // 重发失败
  console.warn('resendMessage error:', imError);
});
```

## 接收消息

> 接受消息的接口，接收消息需要通过事件监听实现：

```js
// 1.7.3
function showMsg(msg) {
    webim.Log.info(msg);
    // 不是同一个房间，不接收
    if (msg.getSession().id() != avChatRoomId) {
        return;
    }

    let isSelfSend;
    let sessType;
    let subType;
    let fromAccount = msg.getFromAccount() || '';
    let fromAccountNick = msg.getFromAccountNick() || '未知用户';

    // 解析消息
    // 获取会话类型，目前只支持群聊
    // webim.SESSION_TYPE.GROUP-群聊，
    // webim.SESSION_TYPE.C2C-私聊，
    sessType = msg.getSession().type();

    // 获取消息子类型
    // 会话类型为群聊时，子类型为：webim.GROUP_MSG_SUB_TYPE
    // 会话类型为私聊时，子类型为：webim.C2C_MSG_SUB_TYPE
    subType = msg.getSubType();

    isSelfSend = msg.getIsSend(); // 消息是否为自己发的
    const elems = msg.getElems() || []; // 获取消息包含的元素数组
    const [el0, el1] = elems;

    try {
        if (el0 && el0.getType() == webim.MSG_ELEMENT_TYPE.TEXT) {
            const content = el0.getContent(); // 获取元素对象
            let buyerLevel = 0;
            let user_img = '';
            let streamType = 1;
            let userRoleType = 0;

            if (el1 && el1.getType() == webim.MSG_ELEMENT_TYPE.CUSTOM) {
                const contentCustom = el1.getContent(); // 获取元素对象
                const contentData = JSON.parse(contentCustom.getData());
                buyerLevel = contentData.buyerLevel;
                user_img = contentData.user_img;
                streamType = contentData.streamType;
                userRoleType = contentData.userRoleType;
            }

            // 文本类型，默认为聊天消息
            acceptCallBack &&
                acceptCallBack({
                    type: MsgType.chatText,
                    message_string: content.getText(),
                    user_img,
                    user_nickname: fromAccountNick,
                    user_uri: fromAccount,
                    buyerLevel,
                    streamType,
                    userRoleType,
                });
        } else if (el0 && el0.getType() == webim.MSG_ELEMENT_TYPE.CUSTOM) {
            const content = el0.getContent(); // 获取元素对象
            const contentData = JSON.parse(content.getData());

            const { type, show, userinfoUri } = contentData;

            // 只接受指定的自定义类型
            if ([9, 12].includes(type)) {
                contentData.data.map(data => {
                    acceptCallBack &&
                        acceptCallBack({
                            type,
                            data,
                            show,
                            userinfoUri,
                        });
                });
            }
        }
    } catch (err) {
        // ...
    }
};

// 2.7.0
let onMessageReceived = function(event) {
  // event.data - 存储 Message 对象的数组 - [Message]
};
tim.on(TIM.EVENT.MESSAGE_RECEIVED, onMessageReceived);
```

## 解析文本消息

> 如果文本消息仅是文字的话，直接渲染 'xxxx'文字即可，如果文本中带有类似emoji的表情，则需要解析表情

**解析emoji的示例:**

```js
const emojiMap = {         // 根据[呲牙]可匹配的路径地址
  '[微笑]': 'emoji_0.png',
  '[呲牙]': 'emoji_1.png',
  '[下雨]': 'emoji_2.png'
}

// <img src="https://main.qcloudimg.com/raw/6be88c30a4552b5eb93d8eec243b6593.png" style="margin:0;">图片的地址
const emojiUrl = 'http://xxxxxxxx/emoji/'   

function parseText (payload) {
  let renderDom = []
  // 文本消息
    let temp = payload.text
    let left = -1
    let right = -1
    while (temp !== '') {
      left = temp.indexOf('[')
      right = temp.indexOf(']')
      switch (left) {
        case 0:
          if (right === -1) {
            renderDom.push({
              name: 'text',
              text: temp
            })
            temp = ''
          } else {
            let _emoji = temp.slice(0, right + 1)
            if (emojiMap[_emoji]) {    // 如果您需要渲染表情包，需要进行匹配您对应[呲牙]的表情包地址
              renderDom.push({
                name: 'img',
                src: emojiUrl + emojiMap[_emoji]
              })
              temp = temp.substring(right + 1)
            } else {
              renderDom.push({
                name: 'text',
                text: '['
              })
              temp = temp.slice(1)
            }
          }
          break
        case -1:
          renderDom.push({
            name: 'text',
            text: temp
          })
          temp = ''
          break
        default:
          renderDom.push({
            name: 'text',
            text: temp.slice(0, left)
          })
          temp = temp.substring(left)
          break
      }
    }
  return renderDom
}

// 最后的 renderDom 结构为[{name: 'text', text: 'XXX'}, {name: 'img', src: 'http://xxx'}......]
// 渲染当前数组即可得到想要的 UI 结果，如：XXX<img src="https://main.qcloudimg.com/raw/6be88c30a4552b5eb93d8eec243b6593.png"  style="margin:0;">XXX<img src="https://main.qcloudimg.com/raw/6be88c30a4552b5eb93d8eec243b6593.png"  style="margin:0;">XXX[呲牙XXX]
```

## 解析系统消息

```js
function parseGroupSystemNotice (payload) {
  const groupName =
      payload.groupProfile.groupName || payload.groupProfile.groupID
  switch (payload.operationType) {
    case 1:
      return `${payload.operatorID} 申请加入群组：${groupName}`
    case 2:
      return `成功加入群组：${groupName}`
    case 3:
      return `申请加入群组：${groupName}被拒绝`
    case 4:
      return `被管理员${payload.operatorID}踢出群组：${groupName}`
    case 5:
      return `群：${groupName} 已被${payload.operatorID}解散`
    case 6:
      return `${payload.operatorID}创建群：${groupName}`
    case 7:
      return `${payload.operatorID}邀请你加群：${groupName}`
    case 8:
      return `你退出群组：${groupName}`
    case 9:
      return `你被${payload.operatorID}设置为群：${groupName}的管理员`
    case 10:
      return `你被${payload.operatorID}撤销群：${groupName}的管理员身份`
    case 255:
      return '自定义群系统通知'
  }
}
```
## 解析群提示消息

```js
function parseGroupTipContent (payload) {
  switch (payload.operationType) {
    case this.TIM.TYPES.GRP_TIP_MBR_JOIN:
      return `群成员：${payload.userIDList.join(',')}，加入群组`
    case this.TIM.TYPES.GRP_TIP_MBR_QUIT:
      return `群成员：${payload.userIDList.join(',')}，退出群组`
    case this.TIM.TYPES.GRP_TIP_MBR_KICKED_OUT:
      return `群成员：${payload.userIDList.join(',')}，被${payload.operatorID}踢出群组`
    case this.TIM.TYPES.GRP_TIP_MBR_SET_ADMIN:
      return `群成员：${payload.userIDList.join(',')}，成为管理员`
    case this.TIM.TYPES.GRP_TIP_MBR_CANCELED_ADMIN:
      return `群成员：${payload.userIDList.join(',')}，被撤销管理员`
    default:
      return '[群提示消息]'
  }
}
```

## 获取某会话的消息列表

> 分页拉取指定会话的消息列表的接口，当用户进入会话首次渲染消息列表或者用户“下拉查看更多消息”时，需调用该接口。

```js
tim.getMessageList(options)
```

参数`options`为`Object`类型，包含的属性值如下表所示：

| 参数名  | 类型 | 属性 | 描述
| :--- | :---- | :---- | :----
| `conversationID`   | String | `<optional>` | 会话 ID。会话 ID 组成方式：C2C+userID（单聊）GROUP+groupID（群聊）@TIM#SYSTEM（系统通知会话）
| `nextReqMessageID`   | String | `<optional>` | 用于分页续拉的消息 ID。第一次拉取时该字段可不填，每次调用该接口会返回该字段，续拉时将返回字段填入即可
| `count`   | Number | `<optional>` | 需要拉取的消息数量，默认值和最大值为15，即一次拉取至多返回15条消息

```js
// 打开某个会话时，第一次拉取消息列表
let promise = tim.getMessageList({conversationID: 'C2Ctest', count: 15});
promise.then(function(imResponse) {
  const messageList = imResponse.data.messageList; // 消息列表。
  const nextReqMessageID = imResponse.data.nextReqMessageID; // 用于续拉，分页续拉时需传入该字段。
  const isCompleted = imResponse.data.isCompleted; // 表示是否已经拉完所有消息。
});

// 下拉查看更多消息
let promise = tim.getMessageList({conversationID: 'C2Ctest', nextReqMessageID, count: 15});
promise.then(function(imResponse) {
  const messageList = imResponse.data.messageList; // 消息列表。
  const nextReqMessageID = imResponse.data.nextReqMessageID; // 用于续拉，分页续拉时需传入该字段。
  const isCompleted = imResponse.data.isCompleted; // 表示是否已经拉完所有消息。
});
```

## 将会话设置为已读

> 将某会话下的未读消息状态设置为已读，置为已读的消息不会计入到未读统计，当打开会话或切换会话时调用该接口。如果在打开/切换会话时，不调用该接口，则对应的消息会一直是未读的状态。

```js
tim.setMessageRead(options)
```

参数`options`为`Object`类型，包含的属性值如下表所示：

| 参数名  | 类型 | 描述
| :--- | :---- | :----
| `options`   | Object | 消息内容的容器

其中 paylaod的描述如下表所示:

| 参数名  | 类型 | 描述
| :--- | :---- | :----
| `conversationID` | String | 	会话 ID。会话 ID 组成方式：C2C+userID（单聊）GROUP+groupID（群聊）@TIM#SYSTEM（系统通知会话）

**将某会话下所有未读消息已读上报示例:**

```js
tim.setMessageRead({conversationID: 'C2Cexample'});
```

## 获取会话的列表

> 获取会话列表的接口，该接口拉取最近的100条会话，当需要刷新会话列表时调用该接口。

:::warning
- 该接口获取的会话列表中的资料是不完整的（仅包括头像、昵称等，能够满足会话列表的渲染需求），若要查询详细会话资料，请参考 [getConversationProfile](https://imsdk-1252463788.file.myqcloud.com/IM_DOC/Web/SDK.html?_ga=1.40889829.652217193.1589250417#getConversationProfile)。

- 会话保存时长跟会话最后一条消息保存时间一致，消息默认保存7天，即会话默认保存7天。
:::

```js
tim.getConversationList()
```

**拉取会话列表示例:**

```js
let promise = tim.getConversationList();
promise.then(function(imResponse) {
  const conversationList = imResponse.data.conversationList; // 会话列表，用该列表覆盖原有的会话列表
}).catch(function(imError) {
  console.warn('getConversationList error:', imError); // 获取会话列表失败的相关信息
});
```

## 获取会话资料

> 获取会话资料的接口，当单击会话列表中的某个会话时，调用该接口获取会话的详细信息。

```js
tim.getConversationProfile(conversationID)
```

参数`options`为`Object`类型，包含的属性值如下表所示：

| 参数名  | 类型 | 描述
| :--- | :---- | :----
| `conversationID`   | String | 会话 ID。会话 ID 组成方式：C2C+userID（单聊）GROUP+groupID（群聊）@TIM#SYSTEM（系统通知会话）

**获取会话资料示例:**

```js
let promise = tim.getConversationProfile(conversationID);
promise.then(function(imResponse) {
  // 获取成功
  console.log(imResponse.data.conversation); // 会话资料
}).catch(function(imError) {
  console.warn('getConversationProfile error:', imError); // 获取会话资料失败的相关信息
});
```

## 删除会话

> 根据会话 ID 删除会话的接口，该接口只删除会话，不删除消息。例如，删除与用户 A 的会话，下次再与用户 A 发起会话时，之前的聊天信息仍在。

```js
tim.deleteConversation(conversationID)
```

参数`options`为`Object`类型，包含的属性值如下表所示：

| 参数名  | 类型 | 描述
| :--- | :---- | :----
| `conversationID`   | String | 会话 ID。会话 ID 组成方式：C2C+userID（单聊）GROUP+groupID（群聊）@TIM#SYSTEM（系统通知会话）

```js
let promise = tim.deleteConversation('C2CExample');
promise.then(function(imResponse) {
  //删除成功。
  const { conversationID } = imResponse.data;// 被删除的会话 ID。
}).catch(function(imError) {
  console.warn('deleteConversation error:', imError); // 删除会话失败的相关信息
});
```

## 未读计数

> 这里的未读消息是指用户没有进行已读上报的消息，而非对方是否已经阅读。如需显示正确的未读计数，需要开发者显式调用已读上报，告诉 IM SDK 某个会话的消息是否已读，例如，当用户进入聊天界面，可以设置整个会话的消息已读。

### 获取当前未读消息数量

每次使用 `getConversationList()` 时，会获得`[Conversation，Conversation，......]`数组，每个`Conversation`都有当前会话的未读数目，用`unreadCount`表示。

所有会话的未读计数，由所有会话的`unreadCount`相加所得。

### 已读上报

当用户阅读某个会话的消息后，需要进行会话消息的已读上报，IM SDK 根据会话中最后一条阅读的消息，设置会话中之前所有消息为已读。建议在单击进行切换会话时进行消息的已读上报。

:::tips
已读上报只会改变会话的未读计数，不会向消息发送者推送回执状态。
:::

```js
tim.setMessageRead(options)
```

参数`options`为`Object`类型，包含的属性值如下表所示：

| 参数名  | 类型 | 描述
| :--- | :---- | :----
| `conversationID`   | String | 会话 ID。

**将某会话下所有未读消息已读上报示例:**

```js
let promise = tim.setMessageRead({conversationID: 'C2Cexample'});
promise.then(function(imResponse) {
  // 已读上报成功
}).catch(function(imError) {
  // 已读上报失败
  console.warn('setMessageRead error:', imError);
});
```

## 网络状态相关

```js
const onConnNotify = res => {
    switch (res.ErrorCode) {
        case webim.CONNECTION_STATUS.ON:
            // webim.Log.warn('连接状态正常...');
            break;
        case webim.CONNECTION_STATUS.OFF:
            webim.Log.warn('连接已断开，无法收到新消息，请检查下你的网络是否正常');
            WPT.Modal.tips('网络不稳定，无法收到新消息');
            break;
        default:
            webim.Log.error(`未知连接状态,status=${res.ErrorCode}`);
            break;
        }
    };
```
## 创建群聊

:::warning
该接口创建 `TIM.TYPES.GRP_AVCHATROOM（音视频聊天室）` 后，需调用 `joinGroup` 接口加入群组后，才能进行消息收发流程。
:::

```js
tim.createGroup(options);
```

参数`options`为`Object`类型，包含的属性值如下表所示：

| 参数名  | 类型 | 属性 | 默认值
| :--- | :---- | :---- | :----
| `name` | String | - | -
| `type` | String | `<optional>` | TIM.TYPES.GRP_PRIVATE
| `groupID` | String | `<optional>` | -
| `introduction` | String |`<optional>`| -
| `notification` | String |`<optional>` | -
| `avatar` | String | `<optional>` | -
| `maxMemberNum` | String |`<optional>`| -
| `joinOption` | String |`<optional>`| TIM.TYPES.JOIN_OPTIONS_FREE_ACCESS
| `memberList` | `Array<Object>` |`<optional>`| -
| `groupCustomField` | `Array<Object>` |`<optional>`| -

其中 `memberList`参数说明:

| 参数名  | 类型 | 属性 | 描述
| :--- | :---- | :---- | :----
| `userID` | String | - | 必填，群成员的 UserID
| `role` | String | `<optional>` | 成员身份，可选值只有 `Admin`，表示添加该成员并设置为管理员
| `memberCustomField` | `Array<Object>` | `<optional>` | 	群成员维度的自定义字段，默认没有自定义字段，如需开通请参见 [自定义字段](https://cloud.tencent.com/document/product/269/1502#.E8.87.AA.E5.AE.9A.E4.B9.89.E5.AD.97.E6.AE.B5)


**创建私有群示例:**

```js
let promise = tim.createGroup({
  type: TIM.TYPES.GRP_PRIVATE,
  name: 'WebSDK',
  memberList: [{userID: 'user1'}, {userID: 'user2'}] // 如果填写了 memberList，则必须填写 userID
});
promise.then(function(imResponse) { // 创建成功
  console.log(imResponse.data.group); // 创建的群的资料
}).catch(function(imError) {
  console.warn('createGroup error:', imError); // 创建群组失败的相关信息
});
```

## 解散群组

> 群主可调用该接口解散群组。

:::warning
群主不能解散私有群。
:::

```js
// groupID	String	群组 ID
tim.dismissGroup(groupID);
```

**解散群组示例:**

```js
let promise = tim.dismissGroup('group1');
promise.then(function(imResponse) { // 解散成功
  console.log(imResponse.data.groupID); // 被解散的群组 ID
}).catch(function(imError) {
  console.warn('dismissGroup error:', imError); // 解散群组失败的相关信息
});
```

## 更新群组资料

```js
tim.updateGroupProfile(options);
```

参数`options`为`Object`类型，包含的属性值如下表所示：

| 参数名  | 类型 | 属性 | 默认值
| :--- | :---- | :---- | :----
| `groupID` | Object | - | -
| `name` | Object | `<optional>` | -
| `avatar` | Object | `<optional>` | -
| `introduction` | Object |`<optional>`| -
| `notification` | Object |`<optional>` | -
| `maxMemberNum` | Number | `<optional>` | -
| `joinOption` | String | `<optional>` | TIM.TYPES.JOIN_OPTIONS_FREE_ACCESS
| `groupCustomField` | `Array<Object>` | `<optional>` | -

其中 `groupCustomField` 参数说明:

| 参数名  | 类型 | 描述
| :--- | :---- | :---- 
| `key` | String | 自定义字段的 Key
| `value` | String | 自定义字段的 Value

**更新群组资料示例:**

```js
let promise = tim.updateGroupProfile({
  groupID: 'group1',
  name: 'new name', // 修改群名称
  introduction: 'this is introduction.', // 修改群公告
  // v2.6.0 起，群成员能收到群自定义字段变更的群提示消息，且能获取到相关的内容，详见 Message.payload.newGroupProfile.groupCustomField
  groupCustomField: [{ key: 'group_level', value: 'high'}] // 修改群组维度自定义字段
});
promise.then(function(imResponse) {
  console.log(imResponse.data.group) // 修改成功后的群组详细资料
}).catch(function(imError) {
  console.warn('updateGroupProfile error:', imError); // 修改群组资料失败的相关信息
});
```

## 加入群聊

> 私有群不能申请加入，只能由群成员邀请加入。

```js
tim.joinGroup(options);
```

参数`options`为`Object`类型，包含的属性值如下表所示：

| 参数名  | 类型 | 属性 | 描述
| :--- | :---- | :---- | :----
| `groupID` | String | - | -
| `applyMessage` | String | - | 附言
| `type` | String | `<optional>` | 待加入的群组的类型，加入音视频聊天室时该字段必填。

其中 `type`可选值如下:

- `TIM.TYPES.GRP_PUBLIC`：公开群
- `TIM.TYPES.GRP_CHATROOM`：聊天室
- `TIM.TYPES.GRP_AVCHATROOM`：音视频聊天室

**加入群聊示例:**

```js
// 1.7.3
function applyJoinBigGroup(groupId) {
    const _options = {
        GroupId: groupId, // 群id
    };
    // 先进行退群操作
    quitBigGroup();
    // 比如此处2.6.2版本的方法变为了 webim.joinGroup
    webim.applyJoinBigGroup(
        _options,
        res => {
            // JoinedSuccess:加入成功; WaitAdminApproval:等待管理员审批
            if (resp?.JoinedStatus === 'JoinedSuccess') {
                webim.Log.info('进群成功');
                // 其他进群成功的操作
            } else {
                console.log('进群失败');
                // 可以尝试重新进群
            }
        },
        err => {
            console.log(err.ErrorInfo);
            // 可以尝试重新进群
        }
    );
}
// 2.7.0

let promise = tim.joinGroup({ 
    groupID: 'group1', 
    type: TIM.TYPES.GRP_AVCHATROOM 
});
promise.then(function(imResponse) {
  switch (imResponse.data.status) {
    case TIM.TYPES.JOIN_STATUS_WAIT_APPROVAL: break; // 等待管理员同意
    case TIM.TYPES.JOIN_STATUS_SUCCESS: // 加群成功
      console.log(imResponse.data.group); // 加入的群组资料
      break;
    default: break;
  }
}).catch(function(imError){
  console.warn('joinGroup error:', imError); // 申请加群失败的相关信息
});
```

## 退出群聊

> 群主只能退出私有群，退出后该私有群无群主。

```js
// groupID	String	群组 ID
tim.quitGroup(groupID);
```

**退出群聊的示例:**

```js
// 1.7.3
function quitBigGroup(success, failed) {
    if (!avChatRoomId) return;

    const _options = {
        GroupId: avChatRoomId, // 群id
    };

    webim.quitBigGroup(
        _options,
        resp => {
            webim.Log.info('退群成功');
            success && success();
        },
        err => {
            failed && failed();
            console.log(err.ErrorInfo);
        }
    );
}
// 2.7.0
let promise = tim.quitGroup('group1');
promise.then(function(imResponse) {
  console.log(imResponse.data.groupID); // 退出成功的群 ID
}).catch(function(imError){
  console.warn('quitGroup error:', imError); // 退出群组失败的相关信息
});
```

## 根据群 ID 搜索群组

> 私有群不能被搜索。

```js
// groupID	String	群组 ID
tim.searchGroupByID(groupID);
```

**根据群 ID 搜索群组示例:**

```js
let promise = tim.searchGroupByID('group1');
promise.then(function(imResponse) {
  const group = imResponse.data.group; // 群组信息
}).catch(function(imError) {
  console.warn('searchGroupByID error:', imError); // 搜素群组失败的相关信息
});
```

## 转让群组

> 只有群主拥有转让的权限，音视频聊天室不能转让。

```js
tim.changeGroupOwner(options);
```

参数`options`为`Object`类型，包含的属性值如下表所示：

| 参数名  | 类型 | 描述
| :--- | :---- | :---- 
| `groupID` | String | 待转让的群组 ID
| `newOwnerID` | String | 新群主的 ID

**转让群组示例:**

```js
let promise = tim.changeGroupOwner({
  groupID: 'group1',
  newOwnerID: 'user2'
});
promise.then(function(imResponse) { // 转让成功
  console.log(imResponse.data.group); // 群组资料
}).catch(function(imError) { // 转让失败
  console.warn('changeGroupOwner error:', imError); // 转让群组失败的相关信息
});
```

## 处理加群申请

> 当用户申请加入一个需要管理员同意的群组时，管理员/群主会收到申请加群的【群系统通知消息】，详情请参见 Message。

```js
tim.handleGroupApplication(options);
```

参数`options`为`Object`类型，包含的属性值如下表所示：

| 参数名  | 类型 | 属性 | 描述
| :--- | :---- | :---- | :----
| `handleAction` | String | - | 处理结果 Agree（同意） / Reject（拒绝）
| `handleMessage` | String | `<optional>` | 附言
| `message` | Message | - | 申请加群的【群系统通知消息】的消息实例。

Message实例可通过以下方式获取：

- 收到新的群系统通知事件 的回调参数中获取

- 系统类型会话的消息列表中获取

**处理加群申请的示例:**

```js
let promise = tim.handleGroupApplication({
  handleAction: 'Agree',
  handleMessage: '欢迎欢迎',
  message: message // 申请加群群系统通知的消息实例
});
promise.then(function(imResponse) {
  console.log(imResponse.data.group); // 群组资料
}).catch(function(imError){
  console.warn('handleGroupApplication error:', imError); // 错误信息
});
```

## 设置群消息提示类型

```js
tim.setMessageRemindType(options);
```

参数`options`为`Object`类型，包含的属性值如下表所示：

| 参数名  | 类型 | 描述
| :--- | :---- | :---- 
| `groupID` | String | 群组 ID
| `messageRemindType` | String | 群消息提示类型。

`messageRemindType`类型如下:

- `TIM.TYPES.MSG_REMIND_ACPT_AND_NOTE`：SDK 接收消息并抛出 收到消息事件 通知接入侧，接入侧做提示

- `TIM.TYPES.MSG_REMIND_ACPT_NOT_NOTE`：SDK 接收消息并抛出 收到消息事件 通知接入侧，接入侧不做提示

- `TIM.TYPES.MSG_REMIND_DISCARD`：SDK 拒收消息，不会抛出 收到新消息事件

**群消息提示类型示例:**

```js
let promise = tim.setMessageRemindType({ groupID: 'group1', messageRemindType: TIM.TYPES.MSG_REMIND_DISCARD }); // 拒收消息
promise.then(function(imResponse) {
  console.log(imResponse.data.group); // 设置后的群资料
}).catch(function(imError) {
  console.warn('setMessageRemindType error:', imError);
});
```

## 获取群成员列表

:::tips
- 从`v2.6.2`版本开始，该接口支持拉取群成员禁言截止时间戳（muteUntil），接入侧可根据此值判断群成员是否被禁言，以及禁言的剩余时间。

- 低于`v2.6.2`版本时，该接口获取的群成员列表中的资料仅包括头像、昵称等，能够满足群成员列表的渲染需求。如需查询群成员禁言截止时间戳（muteUntil）等详细资料，请使用 getGroupMemberProfile。

- 该接口是分页拉取群成员，不能直接用于获取群的总人数。获取群的总人数（memberNum）请使用 getGroupProfile 。
:::

```js
tim.getGroupMemberList(options);
```

参数`options`为`Object`类型，包含的属性值如下表所示：

| 参数名  | 类型 | 属性 | 默认值 | 描述
| :--- | :---- | :---- | :---- | :---- 
| `groupID` | String | - | - | 群组的 ID
| `count`	| Number	| `<optional>`	| 15	| 需要拉取的数量。最大值为100，避免回包过大导致请求失败。若传入超过100，则只拉取前100个
| `offset`	| Number	| `<optional>`	| 0	| 偏移量，默认从0开始拉取

**获取群成员列表示例:**

```js
let promise = tim.getGroupMemberList({ 
  groupID: 'group1', 
  count: 30, 
  offset:0 
}); // 从0开始拉取30个群成员
promise.then(function(imResponse) {
  console.log(imResponse.data.memberList); // 群成员列表
}).catch(function(imError) {
  console.warn('getGroupMemberList error:', imError);
});
// 从v2.6.2 起，该接口支持拉取群成员禁言截止时间戳。
let promise = tim.getGroupMemberList({ groupID: 'group1', count: 30, offset:0 }); // 从0开始拉取30个群成员
promise.then(function(imResponse) {
  console.log(imResponse.data.memberList); // 群成员列表
  for (let groupMember of imResponse.data.memberList) {
    if (groupMember.muteUntil * 1000  > Date.now()) {
      console.log(`${groupMember.userID} 禁言中`);
    } else {
      console.log(`${groupMember.userID} 未被禁言`);
    }
  }
}).catch(function(imError) {
    console.warn('getGroupMemberProfile error:', imError);
});
```

## 获取群成员资料

:::warning
- 使用该接口前，需要将 SDK 版本升级至v2.2.0或以上。

- 每次查询的用户数上限为50。如果传入的数组长度大于50，则只取前50个用户进行查询，其余丢弃。
:::

```js
tim.getGroupMemberProfile(options);
```

参数`options`为`Object`类型，包含的属性值如下表所示：

| 参数名  | 类型 | 属性 |  描述
| :--- | :---- | :---- | :---- 
| `groupID` | String | - | 群组的 ID
| `userIDList`	| `Array.<String>`	| -	| 要查询的群成员用户 ID 列表
| `memberCustomFieldFilter`	| `Array.<String>`	| `<optional>`	| 群成员自定义字段筛选。可选，若不填，则默认查询所有群成员自定义字段

## 添加群成员

添加群成员需要遵循以下的规则：

- `TIM.TYPES.GRP_PRIVATE 私有群`：任何群成员都可邀请他人加群，且无需被邀请人同意，直接将其拉入群组中。

- `TIM.TYPES.GRP_PUBLIC 公开群/ TIM.TYPES.GRP_CHATROOM 聊天室`：只有 App 管理员可以邀请他人入群，且无需被邀请人同意，直接将其拉入群组中。

- `TIM.TYPES.GRP_AVCHATROOM 音视频聊天室`：不允许任何人邀请他人入群（包括 App 管理员）。

```js
tim.addGroupMember(options);
```

参数`options`为`Object`类型，包含的属性值如下表所示：

| 参数名  | 类型 |   描述
| :--- | :---- | :---- 
| `groupID` | String |  群组的 ID
| `userIDList`	| `Array.<String>`	| 待添加的群成员 ID 数组。单次最多添加500个成员

其中then的回调函数参数为 `IMResponse`，`IMResponse.data`属性值如下表所示：

| 名称  | 类型 |   描述
| :--- | :---- | :---- 
| `successUserIDList`	| `Array<String>`	| 添加成功的 userID 列表
| `failureUserIDList`	| `Array<String>`	| 添加失败的 userID 列表
| `existedUserIDList`	| `Array<String>`	| 已在群中的 userID 列表
| `group`	| `Group`	| 接口调用后的群组资料

**添加群成员的示例:**

```js
let promise = tim.addGroupMember({
  groupID: 'group1',
  userIDList: ['user1','user2','user3']
});
promise.then(function(imResponse) {
  console.log(imResponse.data.successUserIDList); // 添加成功的群成员 userIDList
  console.log(imResponse.data.failureUserIDList); // 添加失败的群成员 userIDList
  console.log(imResponse.data.existedUserIDList); // 已在群中的群成员 userIDList
  console.log(imResponse.data.group); // 添加后的群组信息
}).catch(function(imError) {
  console.warn('addGroupMember error:', imError); // 错误信息
});
```

## 删除群成员

> 删除群成员。群主可移除群成员。

```js
tim.deleteGroupMember(options)
```

参数`options`为`Object`类型，包含的属性值如下表所示：

| 参数名  | 类型 |   描述
| :--- | :---- | :---- 
| `groupID` | String |  群组的 ID
| `userIDList`	| `Array.<String>`	| 待删除的群成员的 ID 列表
| `reason` | String |  踢人的原因，可选参数

**删除群成员示例:**

```js
let promise = tim.deleteGroupMember({
  groupID: 'group1', 
  userIDList:['user1'], 
  reason: '你违规了，我要踢你！'
});
promise.then(function(imResponse) {
  console.log(imResponse.data.group); // 删除后的群组信息
  console.log(imResponse.data.userIDList); // 被删除的群成员的 userID 列表
}).catch(function(imError) {
  console.warn('deleteGroupMember error:', imError); // 错误信息
});
```

## 禁言或取消禁言

> 设置群成员的禁言时间，可以禁言群成员，也可取消禁言。`TIM.TYPES.GRP_PRIVATE` 类型的群组（即私有群）不能禁言。

:::tips
只有群主和管理员拥有该操作权限：

- 群主可以禁言/取消禁言管理员和普通群成员。

- 管理员可以禁言/取消禁言普通群成员。
:::

```js
tim.setGroupMemberMuteTime(options)
```

参数`options`为`Object`类型，包含的属性值如下表所示：

| 参数名  | 类型 |   描述
| :--- | :---- | :---- 
| `groupID` | String |  群组的 ID
| `userID`	| String | 群成员 ID
| `muteTime` | Number |  禁言时长，单位秒 例如，设置该值为1000，则表示即刻起禁言该用户1000秒，设置为0，则表示取消禁言

**禁言或取消禁言示例:**

```js
let promise = tim.setGroupMemberMuteTime({
  groupID: 'group1',
  userID: 'user1',
  muteTime: 600 // 禁言10分钟；设为0，则表示取消禁言
});
promise.then(function(imResponse) {
  console.log(imResponse.data.group); // 修改后的群资料
  console.log(imResponse.data.member); // 修改后的群成员资料
}).catch(function(imError) {
  console.warn('setGroupMemberMuteTime error:', imError); // 禁言失败的相关信息
});
```

## 设为管理员或撤销管理员

> 修改群成员角色，只有群主拥有操作权限。

```js
tim.setGroupMemberRole(options)
```

参数`options`为`Object`类型，包含的属性值如下表所示：

| 参数名  | 类型 |   描述
| :--- | :---- | :---- 
| `groupID` | String |  群组的 ID
| `userID`	| String | 群成员 ID
| `role` | String |  权限

其中 role的类型如下:

- TIM.TYPES.GRP_MBR_ROLE_ADMIN（群管理员

- TIM.TYPES.GRP_MBR_ROLE_MEMBER（群普通成员）

**设置管理员权限示例:**

```js
let promise = tim.setGroupMemberRole({
  groupID: 'group1',
  userID: 'user1',
  role: TIM.TYPES.GRP_MBR_ROLE_ADMIN // 将群 ID: group1 中的用户：user1 设为管理员
});
promise.then(function(imResponse) {
  console.log(imResponse.data.group); // 修改后的群资料
  console.log(imResponse.data.member); // 修改后的群成员资料
}).catch(function(imError) {
  console.warn('setGroupMemberRole error:', imError); // 错误信息
});
```

## 修改群名片

> 设置群成员名片。

- 群主：可设置所有群成员的名片。

- 管理员：可设置自身和其他普通群成员的群名片。

- 普通群成员：只能设置自身群名片。

```js
tim.setGroupMemberNameCard(options)
```

参数`options`为`Object`类型，包含的属性值如下表所示：

| 参数名  | 类型 |   描述
| :--- | :---- | :---- 
| `groupID` | String |  群组的 ID
| `userID`	| `String<optional>` | 可选，默认修改自身的群名片
| `nameCard` | String |  -

**修改群名片示例:**

```js
let promise = tim.setGroupMemberNameCard({ 
  groupID: 'group1', 
  userID: 'user1', 
  nameCard: '用户名片' 
});
promise.then(function(imResponse) {
  console.log(imResponse.data.group); // 设置后的群资料
  console.log(imResponse.data.member); // 修改后的群成员资料
}).catch(function(imError) {
  console.warn('setGroupMemberNameCard error:', imError); // 设置群成员名片失败的相关信息
});
```

## 修改自定义字段

> 设置群成员自定义字段。

:::warning
普通群成员只能设置自己的自定义字段。
:::

```js
tim.setGroupMemberCustomField(options)
```

参数`options`为`Object`类型，包含的属性值如下表所示：

| 参数名  | 类型 |   描述
| :--- | :---- | :---- 
| `groupID` | String |  群组的 ID
| `userID`	| `String<optional>` | 可选，不填则修改自己的群成员自定义字段
| `memberCustomField` | `Array<Object>` |  群成员自定义字段

其中`memberCustomField`包含的属性值如下表所示：

| 参数名  | 类型 |   描述
| :--- | :---- | :---- 
| `key` | String |  自定义字段的 Key
| `value` | `String<optional>` |  自定义字段的 Value

**修改自定义字段示例:**

```js
let promise = tim.setGroupMemberCustomField({ 
  groupID: 'group1', 
  memberCustomField: [{
    key: 'group_member_test', 
    value: 'test'
  }]
});
promise.then(function(imResponse) {
  console.log(imResponse.data.group); // 设置后的群资料
  console.log(imResponse.data.member); // 修改后的群成员资料
}).catch(function(imError) {
  console.warn('setGroupMemberCustomField error:', imError); // 设置群成员自定义字段失败的相关信息
});
```

## 群提示消息

> 当有用户被邀请加入群组或有用户被移出群组等事件发生时，群内会产生提示消息，接入侧可以根据需要展示给群组用户，或者忽略。

群提示消息有多种类型，详细描述请参见 [`Message.GroupTipPayload`](https://imsdk-1252463788.file.myqcloud.com/IM_DOC/Web/Message.html?_ga=1.172719974.453947682.1548379635#.GroupTipPayload)。

| 参数名  | 类型 |   描述
| :--- | :---- | :---- 
| `operatorID` | String |  执行该操作的用户 ID
| `operationType`	| Number	| 操作类型
| `userIDList`	| `Array<String>`	| 相关的 userID 列表
| `newGroupProfile`	| Object | 若是群资料变更，该字段存放变更的群资料

其中`operationType`属性如下:

| 操作类型  | 值 |  含义
| :--- | :---- | :---- 
| `TIM.TYPES.GRP_TIP_MBR_JOIN` | 1 |  有成员加群
| `TIM.TYPES.GRP_TIP_MBR_QUIT` | 2 |  有群成员退群
| `TIM.TYPES.GRP_TIP_MBR_KICKED_OUT` | 3 |  有群成员被踢出群
| `TIM.TYPES.GRP_TIP_MBR_SET_ADMIN` | 4 |  有群成员被设为管理员
| `TIM.TYPES.GRP_TIP_MBR_CANCELED_ADMIN` | 5 |  有群成员被撤销管理员
| `TIM.TYPES.GRP_TIP_GRP_PROFILE_UPDATED` | 6 |  群组资料变更
| `TIM.TYPES.GRP_TIP_MBR_PROFILE_UPDATED` | 7 |  群成员资料变更，例如：群成员被禁言

群提示消息的 `content` 结构。系统会在恰当的时机，向全体群成员发出群提示消息。例如：有群成员退群/进群，系统会给所有群成员发对应的群提示消息。

## 群系统通知

当有用户申请加群等事件发生时，管理员会收到申请加群等系统消息。管理员同意或拒绝加群申请，IM SDK 会将相应的消息通过群系统通知消息发送给接入侧，由接入侧展示给用户。

群系统通知消息有多种类型，详细描述请参见 [群系统通知类型常量及含义](https://imsdk-1252463788.file.myqcloud.com/IM_DOC/Web/Message.html?_ga=1.65789419.453947682.1548379635#.GroupSystemNoticePayload)。

```js
let onGroupSystemNoticeReceived = function(event) {
  const type = event.data.type; // 群系统通知的类型，详情请参见 Message.GroupSystemNoticePayload 
  const message = event.data.message; // 群系统通知的消息实例，详情请参见 Message
  console.log(message.payload); // 消息内容. 群系统通知 payload 结构描述
};
tim.on(TIM.EVENT.GROUP_SYSTEM_NOTICE_RECEIVED, onGroupSystemNoticeReceived);
```

| 操作类型  | 值 |  含义
| :--- | :---- | :---- 
| operatorID | String	| 执行该操作的用户 ID
| operationType	| Number	| 操作类型
| groupProfile	| Object	| 相关的群组资料
| handleMessage	| Object	| 处理的附言,例如，user1 申请加入进群需要验证的 group1 时，若 `user1` 填写了申请加群的附言，则 `group1` 的管理员会在相应群系统通知中看到该字段

**`operationType`属性群系统通知类型常量及含义详细如下:**

| 操作类型  | 值 |  含义
| :--- | :---- | :---- 
| 1	| 有用户申请加群	| 群管理员/群主接收
| 2	| 申请加群被同意	| 申请加群的用户接收
| 3	| 申请加群被拒绝	| 申请加群的用户接收
| 4	| 被踢出群组	| 被踢出的用户接收
| 5	| 群组被解散	| 全体群成员接收
| 6	| 创建群组	| 创建者接收
| 7	| 邀请加群	| 被邀请者接收
| 8	| 退群	| 退群者接收
| 9	| 设置管理员	| 被设置方接收
| 10 | 	取消管理员	| 被取消方接收
| 255 | 用户自定义通知	| 默认全员接收

群系统通知的 content 结构。系统会在恰当的时机，向特定用户发出群系统通知。例如，user1 被踢出群组，系统会给 user1 发送对应的群系统消息。

## 登出

登出即时通信 IM，通常在切换帐号的时候调用，清除登录态以及内存中的所有数据。

:::tip
- 调用此接口的实例会发布 `SDK_NOT_READY` 事件，此时该实例下线，无法收、发消息。

- 如果您在即时通信 IM 控制台配置的“Web端实例同时在线个数”大于 1，且同一账号登录了`a1`和`a2`两个实例（含小程序端），当执行`a1.logout()`后，`a1`会下线，无法收、发消息。而`a2`实例不会受影响。

- 多实例被踢：基于第 2 点，如果“Web端实例同时在线个数”配置为 2，且您的某一账号已经登录了 `a1`，`a2`两个实例，当使用此账号成功登录第三个实例`a3`时，`a1`或`a2`中的一个实例会被踢下线（通常是最先处在登录态的实例会触发），这种情况称之为`多实例被踢`。假设`a1`实例被踢下线，`a1`实例内部会执行登出流程，然后抛出`KICKED_OUT`事件，接入侧可以监听此事件，并在触发时跳转到登录页。此时`a1`实例下线，而`a2`、`a3`实例可以正常运行。
:::

```js
function logout(cb) {
    webim.logout(resp => {
        webim.Log.info('登出成功');
        cb && cb();
    });
}
```
## 集成新版完整的流程

- 2020.06.17

这里使用的版本为`2.7.0`,如未安装参考上方的安装命令。

```js
import TIM from 'tim-js-sdk';
import COS from "cos-js-sdk-v5";

let options = {
    // 接入时需要替换为您的即时通信 IM 应用的 SDKAppID
    SDKAppID: xxxxxxx,
};

// 创建 SDK 实例，`TIM.create()`方法对于同一个 `SDKAppID` 只会返回同一份实例
let tim = TIM.create(options); // SDK 实例通常用 tim 表示

/**
 * 设置 SDK 日志输出级别，详细分级
 * 0 普通级别，日志量较多，接入时建议使用
 * 1 release级别，SDK 输出关键信息，生产环境时建议使用
 * 2 告警级别，SDK 只输出告警和错误级别的日志
 * 3 错误级别，SDK 只输出错误级别的日志s
 * 4 无日志级别，SDK 将不打印任何日志
 */
tim.setLogLevel(0);

// 注册 COS SDK 插件
tim.registerPlugin({'cos-wx-sdk': COS});

/*
 * 收到离线消息和会话列表同步完毕通知，
 * event.name - TIM.EVENT.SDK_READY
 * 接入侧可以调用 sendMessage 等需要鉴权的接口
 */
tim.on(TIM.EVENT.SDK_READY, function(event) {
    // ...
});

/**
 * 收到推送的单聊、群聊、群提示、群系统通知的新消息
 * event.name - TIM.EVENT.MESSAGE_RECEIVED
 * event.data - 存储 Message 对象的数组 - [Message]
 * 可通过遍历 event.data 获取消息列表数据并渲染到页面
 */
tim.on(TIM.EVENT.MESSAGE_RECEIVED, function(event) {
    // ...
});

/**
 * 收到消息被撤回的通知
 * event.name - TIM.EVENT.MESSAGE_REVOKED
 * event.data - 存储 Message 对象的数组 - [Message]
 * 每个 Message 对象的 isRevoked 属性值为 true
 */
tim.on(TIM.EVENT.MESSAGE_REVOKED, function(event) {
    // ...
});

/**
 * 收到会话列表更新通知
 * event.name - TIM.EVENT.CONVERSATION_LIST_UPDATED
 * event.data - 存储 Conversation 对象的数组 - [Conversation]
 * 可通过遍历 event.data 获取会话列表数据并渲染到页面
 */
tim.on(TIM.EVENT.CONVERSATION_LIST_UPDATED, function(event) {
    // ...
});

/**
 * 收到群组列表更新通知
 * event.name - TIM.EVENT.GROUP_LIST_UPDATED
 * event.data - 存储 Group 对象的数组 - [Group]
 * 可通过遍历 event.data 获取群组列表数据并渲染到页面
 */
tim.on(TIM.EVENT.GROUP_LIST_UPDATED, function(event) {
    // ...
});

/**
 * 收到新的群系统通知
 * event.name - TIM.EVENT.GROUP_SYSTEM_NOTICE_RECEIVED
 * event.data.type - 群系统通知的类型，详情请参见 GroupSystemNoticePayload 的 operationType 枚举值说明
 * event.data.message - Message 对象，
 * 可将 event.data.message.content 渲染到到页面
 * --------------------------------------------
 * GroupSystemNoticePayload 属性详解
 * @param operatorID {string} 执行该操作的用户 ID
 * @param operationType	{number} 操作类型，具体如下：
 * 值          描述                 接收对象
 * 1       有用户申请加群         群管理员/群主接收
 * 2	   申请加群被同意	      申请加群的用户接收
 * 3	   申请加群被拒绝	      申请加群的用户接收
 * 4	     被踢出群组	          被踢出的用户接收
 * 5	     群组被解散	          全体群成员接收
 * 6	     创建群组	          创建者接收
 * 7	     邀请加群	          被邀请者接收
 * 8	       退群	              退群者接收
 * 9	     设置管理员	           被设置方接收
 * 10	     取消管理员	           被取消方接收
 * 255	     用户自定义通知	        默认全员接收
 * @param groupProfile {object}	相关的群组资料
 * @param userDefinedField	{string} 用户自定义字段。
 * @param handleMessage	{object} 处理的附言。
 * --------------------------------------------
 */
tim.on(TIM.EVENT.GROUP_SYSTEM_NOTICE_RECEIVED, function(event) {
    // ...
});

/**
 * 收到自己或好友的资料变更通知
 * event.name - TIM.EVENT.PROFILE_UPDATED
 * event.data - 存储 Profile 对象的数组 - [Profile]
 */
tim.on(TIM.EVENT.PROFILE_UPDATED, function(event) {
    // ...
});

/**
 * 收到黑名单列表更新通知
 * event.name - TIM.EVENT.BLACKLIST_UPDATED
 * event.data - 存储 userID 的数组 - [userID]
 */
tim.on(TIM.EVENT.BLACKLIST_UPDATED, function(event) {
    // ...
});

/**
 * 收到 SDK 发生错误通知，可以获取错误码和错误信息
 * event.name - TIM.EVENT.ERROR
 * event.data.code - 错误码
 * event.data.message - 错误信息
 */
tim.on(TIM.EVENT.ERROR, function(event) {
    // ...
});

/**
 * 收到 SDK 进入 not ready 状态通知，此时 SDK 无法正常工作
 * event.name - TIM.EVENT.SDK_NOT_READY
 */
tim.on(TIM.EVENT.SDK_NOT_READY, function(event) {
    // ....
});

/**
 * 收到被踢下线通知
 * event.name - TIM.EVENT.KICKED_OUT
 * event.data.type - 被踢下线的原因，例如:
 * - TIM.TYPES.KICKED_OUT_MULT_ACCOUNT 多实例登录被踢
 * - TIM.TYPES.KICKED_OUT_MULT_DEVICE 多终端登录被踢
 * - TIM.TYPES.KICKED_OUT_USERSIG_EXPIRED 签名过期被踢 （v2.4.0起支持）。
 */
tim.on(TIM.EVENT.KICKED_OUT, function(event) {
    // ...
});

/**
 * 网络状态发生改变（v2.5.0 起支持）
 * event.name - TIM.EVENT.NET_STATE_CHANGE
 * event.data.state 当前网络状态，枚举值及说明如下：
 * - TIM.TYPES.NET_STATE_CONNECTED - 已接入网络
 * - TIM.TYPES.NET_STATE_CONNECTING - 连接中。很可能遇到网络抖动，SDK 在重试。接入侧可根据此状态提示“当前网络不稳定”或“连接中”
 * - TIM.TYPES.NET_STATE_DISCONNECTED - 未接入网络。接入侧可根据此状态提示“当前网络不可用”。SDK 仍会继续重试，若用户网络恢复，SDK 会自动同步消息 。
 */
tim.on(TIM.EVENT.NET_STATE_CHANGE, function(event) {
    // ...
});


/**
 * 登录IM
 * @param userID {string} 用户的ID
 * @param userSig {string} 用户登录即时通信 IM 的密码，其本质是对 UserID 等信息加密后得到的密文,参见上方登录流程。
 */
tim.login({userID: 'your userID', userSig: 'your userSig'})
.then(function(imResponse) {
  console.log(imResponse.data); // 登录成功
}).catch(function(imError) {
  console.warn('login error:', imError); // 登录失败的相关信息
});

/**
 * 登出IM
 * @return Promise
 */
tim.logout()
.then(function(imResponse) {
  console.log(imResponse.data); // 登出成功
}).catch(function(imError) {
  console.warn('logout error:', imError);
});

/****************消息收发********************/

/**
 * 创建文本消息
 * 创建文本消息的接口，此接口返回一个消息实例，可以在需要发送文本消息时调用 发送消息 接口发送消息实例。
 * @param options {object} 
 * - to {string} 消息接收方的 userID 或 groupID
 * - conversationType {string} 会话类型，取值TIM.TYPES.CONV_C2C（端到端会话） 或 TIM.TYPES.CONV_GROUP（群组会话）
 * - payload {object} 消息内容的容器
 * -- text {string} 消息文本内容
 */
tim.createTextMessage(options);

/*--------- 发送文本消息示例---------*/

// 1. 创建消息实例，接口返回的实例可以上屏
let message = tim.createTextMessage({
  to: 'user1',
  conversationType: TIM.TYPES.CONV_C2C,
  // 消息优先级，用于群聊（v2.4.2起支持）。如果某个群的消息超过了频率限制，后台会优先下发高优先级的消息，详细请参考：https://cloud.tencent.com/document/product/269/3663#.E6.B6.88.E6.81.AF.E4.BC.98.E5.85.88.E7.BA.A7.E4.B8.8E.E9.A2.91.E7.8E.87.E6.8E.A7.E5.88.B6)
  // 支持的枚举值：TIM.TYPES.MSG_PRIORITY_HIGH, TIM.TYPES.MSG_PRIORITY_NORMAL（默认）, TIM.TYPES.MSG_PRIORITY_LOW, TIM.TYPES.MSG_PRIORITY_LOWEST
  // priority: TIM.TYPES.MSG_PRIORITY_NORMAL,
  payload: {
    text: 'Hello world!'
  }
});
// 2. 发送消息
let promise = tim.sendMessage(message);
promise.then(function(imResponse) {
  // 发送成功
  console.log(imResponse);
}).catch(function(imError) {
  // 发送失败
  console.warn('sendMessage error:', imError);
});

/**
 * 发送图片消息
 * 创建图片消息的接口，此接口返回一个消息实例，可以在需要发送图片消息时调用 发送消息 接口发送消息实例。
 * @param options {object} 
 * - to {string} 消息接收方的 userID 或 groupID
 * - conversationType {string} 会话类型，取值TIM.TYPES.CONV_C2C（端到端会话） 或 TIM.TYPES.CONV_GROUP（群组会话）
 * - payload {object} 消息内容的容器
 * -- file { HTMLInputElement 或 Object } 用于选择图片的 DOM 节点（Web）或者 File 对象（Web）或者微信小程序 wx.chooseImage 接口的 success 回调参数。SDK 会读取其中的数据并上传图片。
 * - onProgress {function} 获取上传进度的回调函数
 */

tim.createImageMessage(options)

/*--------- 发送图片消息示例---------*/

// 1. 创建消息实例，接口返回的实例可以上屏
let message = tim.createImageMessage({
  to: 'user1',
  conversationType: TIM.TYPES.CONV_C2C,
  // 消息优先级，用于群聊（v2.4.2起支持）。如果某个群的消息超过了频率限制，后台会优先下发高优先级的消息，详细请参考 消息优先级与频率控制
  // 支持的枚举值：TIM.TYPES.MSG_PRIORITY_HIGH, TIM.TYPES.MSG_PRIORITY_NORMAL（默认）, TIM.TYPES.MSG_PRIORITY_LOW, TIM.TYPES.MSG_PRIORITY_LOWEST
  // priority: TIM.TYPES.MSG_PRIORITY_NORMAL,
  payload: {
    file: document.getElementById('imagePicker'),
  },
  onProgress: function(event) { console.log('file uploading:', event) }
});
// 2. 发送消息
let promise = tim.sendMessage(message);
promise.then(function(imResponse) {
  // 发送成功
  console.log(imResponse);
}).catch(function(imError) {
  // 发送失败
  console.warn('sendMessage error:', imError);
});

// Web 端发送图片消息示例2- 传入 File 对象
// 先在页面上添加一个 ID 为 "testPasteInput" 的消息输入框，例如 <input type="text" id="testPasteInput" placeholder="截图后粘贴到输入框中" size="30" />
document.getElementById('testPasteInput').addEventListener('paste', function(e) {
  let clipboardData = e.clipboardData;
  let file;
  let fileCopy;
  if (clipboardData && clipboardData.files && clipboardData.files.length > 0) {
    file = clipboardData.files[0];
    // 图片消息发送成功后，file 指向的内容可能被浏览器清空，如果接入侧有额外的渲染需求，可以提前复制一份数据
    fileCopy = file.slice();
  }

  if (typeof file === 'undefined') {
    console.warn('file 是 undefined，请检查代码或浏览器兼容性！');
    return;
  }

  // 1. 创建消息实例，接口返回的实例可以上屏
  let message = tim.createImageMessage({
    to: 'user1',
    conversationType: TIM.TYPES.CONV_C2C,
    payload: {
      file: file
    },
    onProgress: function(event) { console.log('file uploading:', event) }
  });

  // 2. 发送消息
  let promise = tim.sendMessage(message);
  promise.then(function(imResponse) {
    // 发送成功
    console.log(imResponse);
  }).catch(function(imError) {
    // 发送失败
    console.warn('sendMessage error:', imError);
  });
});
```

## 常用错误状态码

| 错误码 | 描述
| :-----| :---
| 6013 | `IM SDK` 未初始化，初始化成功回调之后重试。
| 6014 | `IM SDK` 未登录，请先登录，成功回调之后重试，或者已被踢下线，可使用 `TIMManager getLoginUser` 检查当前是否在线。
| 6206 | `UserSig` 过期，请重新获取有效的 `UserSig` 后再重新登录。
| 6208 | 其他终端登录同一个帐号，引起已登录的帐号被踢，需重新登录。
| 6004 | 会话无效，`getConversation` 时检查是否已经登录，如未登录获取会话，会有此错误码返回。
| 6010 | `HTTP` 请求失败，请检查 `URL` 地址是否合法，可在网页浏览器尝试访问该 `URL` 地址。
| 60016 | SDKAppID 被禁用。
| 10016 | App 后台通过第三方回调拒绝本次操作。(可以通过这个状态码自定义处理禁言等操作)
| 10017 | 因被禁言而不能发送消息，请检查发送者是否被设置禁言。
| 10031 | 消息撤回超过了时间限制（默认2分钟）。
| 10032	| 请求撤回的消息不支持撤回操作。
| 10033	| 群组类型不支持消息撤回操作。
| 10034	| 该消息类型不支持删除操作。


## 常见问题

**1. 小程序如果需要上线或者部署正式环境怎么办？**

请在【微信公众平台】>【开发】>【开发设置】>【服务器域名】中进行域名配置：

将以下域名添加到 `request` 合法域名：

| 域名	| 说明	| 是否必须
|:----|:----|:----
| https://webim.tim.qq.com      | Web IM 业务域名 | 必须
| https://yun.tim.qq.com	    | Web IM 业务域名 |	必须
| https://events.tim.qq.com	    | Web IM 业务域名 |	必须
| https://grouptalk.c2c.qq.com	| Web IM 业务域名 | 必须
| https://pingtas.qq.com	    | Web IM 统计域名 |	必须

将以下域名添加到 `uploadFile` 合法域名：

| 域名	| 说明	| 是否必须
|:----|:----|:----
| https://cos.ap-shanghai.myqcloud.com  | 文件上传域名 | 必须

将以下域名添加到 `downloadFile` 合法域名：

| 域名	| 说明	| 是否必须
|:----|:----|:----
| https://cos.ap-shanghai.myqcloud.com  | 	文件下载域名 | 必须