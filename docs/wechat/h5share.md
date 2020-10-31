# H5页面在微信小程序中自定义分享

- 2020.10.27

## 需求描述

当在小程序中打开内嵌的h5页面时，希望小程序的转发出去的标题，图片，跳转link可以通过h5通信实现自定义。

## 实现方案

通过h5给小程序通信，发送标题，图片，跳转link等信息，让小程序设置分享。

### H5发送消息给小程序

```js
function doMiniProgram(callback) {
    try {
        //小程序环境设置分享
        var ua = window.navigator.userAgent.toLowerCase();
        //判断是否是微信环境
        if (ua.match(/MicroMessenger/i) == 'micromessenger') {
            //微信环境
            wx.miniProgram.getEnv(function (res) {
                if (res.miniprogram) {
                    callback();
                }
            })
        }
    }
    catch (err) {
        console.log(err);
    }
}

function setMiniProgramShare(shareTitle, imageUrl, shareUrl) {
    try {
        doMiniProgram(function () {
            wx.miniProgram.postMessage({ data: { title: shareTitle, path: shareUrl, imageUrl: imageUrl } })
        });
    }
    catch (ex) {
        console.log(ex);
    }
}
```

:::warning
引用微信js1.3.2以上才支持，`<script type="text/javascript" src="//res.wx.qq.com/open/js/jweixin-1.3.2.js"></script>`
:::

### 小程序页面接收处理逻辑

:::tip
小程序使用`web-view`组件加载H5页面,`<web-view src="{{url}}" bindmessage="message"/>`。
:::

```js
Page({
  data: {shareData:{}},
  onShareAppMessage(options) {
    return this.shareData;
  },
  message (e) {
    var that = this;
    console.log(e);
    that.shareData = e.detail.data[0];
  }
})
```