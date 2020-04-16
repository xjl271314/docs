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

// 设置 SDK 日志输出级别，详细分级请参见 setLogLevel 接口的说明
tim.setLogLevel(0); // 普通级别，日志量较多，接入时建议使用
// tim.setLogLevel(1); // release 级别，SDK 输出关键信息，生产环境时建议使用

// 注册 COS SDK 插件
tim.registerPlugin({'cos-js-sdk': COS});

```

## 登录鉴权流程

通过`sdkAppID`请求后端接口获取对应的 `userSig`

![登录鉴权流程](https://img-blog.csdnimg.cn/20200416150532155.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

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
## 消息收发

### 发送普通消息
```js
// 1.7.3
function sendMsg(msg, customObj, successCallBack, errorCallBack) {
    // 未登录
    if (!isLogin) {
        console.log('未登录， TODO: 重新登陆');
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

## 接收显示消息

```js
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

## 群组相关

### 加入群聊

```js
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

```

### 退出群聊

```js
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
```

## 登出

```js
function logout(cb) {
    webim.logout(resp => {
        webim.Log.info('登出成功');
        cb && cb();
    });
}
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

1. 小程序如果需要上线或者部署正式环境怎么办？

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