# 微信公众号分享问题

**Q:在微信公众号 H5 开发中，页面内部点击分享按钮调用 SDK，方法不生效。**

**A: 添加一层蒙层，做分享引导**

因为页面内部点击分享按钮无法直接调用，而分享功能需要点击右上角更多来操作。

然后用户可能不知道通过右上角小标里面的功能分享。又想引导用户分享，这时应该怎么做呢？

技术无法实现的，从产品出发。

## H5 调用 SDK 相关解决方案

在 `Hybrid App` 中使用 `H5` 是最常见的不过了，刚接触的，肯定会很生疏模糊。不知道 `H5` 和 `Hybrid` 是怎么交互的。怎样同时支持 `iOS` 和 `Android` 呢？现在来谈谈 `Hybrid` 技术要点，原生与 `H5` 的通信。

### SDK小组 提供方法

1. `注册方法 bridge.register`

```js
bridge.register('enterApp', function() {
  broadcast.emit('ENTER_APP')
})
```

2. `回调方法 bridge.call`

```js
export const getSDKVersion = () => bridge.call('BLT.getSDKVersion')
```

### 事件监听与触发方法

```js
const broadcast = {
  on: function(name, fn, pluralable) {
    this._on(name, fn, pluralable, false)
  },
  once: function(name, fn, pluralable) {
    this._on(name, fn, pluralable, true)
  },
  _on: function(name, fn, pluralable, once) {
    let eventData = broadcast.data
    let fnObj = { fn: fn, once: once }
    if (pluralable && Object.prototype.hasOwnProperty.call(eventData, 'name')) {
      eventData[name].push(fnObj)
    } else {
      eventData[name] = [fnObj]
    }
    return this
  },
  emit: function(name, data, thisArg) {
    let fn, fnList, i, len
    thisArg = thisArg || null
    fnList = broadcast.data[name] || []
    for (i = 0, len = fnList.length; i < len; i++) {
      fn = fnList[i].fn
      fn.apply(thisArg, [data, name])
      if (fnList[i].once) {
        fnList.splice(i, 1)
        i--
        len--
      }
    }
    return this
  },
  data: {}
}
export default broadcast
```

### 踩坑注意

方法调用前，一定要判断 `SDK` 是否提供该方法 如果 `Android` 提供该方法，`iOS` 上调用就会出现一个方法调用失败等弹窗。怎么解决呢？

提供一个判断是否 `Android`、`iOS`。根据设备进行判断:

```js
export const hasNativeMethod = (name) =>
  return bridge.hasNativeMethod('BYJ.' + name)
}

export const getSDKVersion = function() {
  if (hasNativeMethod('getSDKVersion')) {
    bridge.call('BYJ.getSDKVersion')
  }
}
```

:::tip
同一功能需要`iOS`，`Android`方法名相同，这样更好处理哦
:::