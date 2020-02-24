# 常用技巧

## 屏蔽用户选择

禁止用户选择页面中的文字或者图片。

```css
* {
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
```

## 清除输入框内阴影

在 iOS 上，输入框默认有内部阴影,以这样关闭：

```css
div {
  -webkit-appearance: none;
}
```

## 禁止保存或拷贝图像

```css
img {
  -webkit-touch-callout: none;
}
```

## 输入框placeholder字体颜色

```css
input::-webkit-input-placeholder,
textarea::-webkit-input-placeholder {
    color: #c7c7c7;
}
input:-moz-placeholder,
textarea:-moz-placeholder {
    color: #c7c7c7;
}
input:-ms-input-placeholder,
textarea:-ms-input-placeholder {
    color: #c7c7c7;
}
```

## 用户设置字号放大或者缩小导致页面布局错误

设置字体禁止缩放

```css
body {
  -webkit-text-size-adjust: 100% !important;
  text-size-adjust: 100% !important;
  -moz-text-size-adjust: 100% !important;
}
```

## android系统中元素被点击时产生边框

部分`android`系统点击一个链接，会出现一个边框或者半透明灰色遮罩, 不同生产商定义出来额效果不一样。

```css
a,button,input,textarea{
  -webkit-tap-highlight-color: rgba(0,0,0,0)
  -webkit-user-modify:read-write-plaintext-only; 
}
```

## iOS 滑动不流畅

ios 手机上下滑动页面会产生卡顿，手指离开页面，页面立即停止运动。整体表现就是滑动不流畅，没有滑动惯性。 `iOS 5.0` 以及之后的版本，滑动有定义有两个值 `auto` 和 `touch`，默认值为 `auto`。

```css
/*在滚动容器上增加滚动 touch 方法*/
.wrapper {
  -webkit-overflow-scrolling: touch;
}

/*设置外部 overflow 为 hidden,设置内容元素 overflow 为 auto。内部元素超出 body 即产生滚动，超出的部分 body 隐藏*/

body {
  overflow-y: hidden;
}
.wrapper {
  overflow-y: auto;
}
```

## 移动端click屏幕产生300ms延迟

解决方案为设置meta标签禁止缩放

## audio 和 video 在 ios 和 andriod 中自动播放

这个不是bug，由于自动播放网页中的音频或视频，会给用户带来一些困扰或者不必要的流量消耗，所以苹果系统和安卓系统通常都会禁止自动播放和使用 JS 的触发播放，必须由用户来触发才可以播放。加入自动触发播放的代码.

```js
$('html').one('touchstart', function() {
  audio.play()
})
```

## iOS 上拉边界下拉出现空白

手指按住屏幕下拉，屏幕顶部会多出一块白色区域。手指按住屏幕上拉，底部多出一块白色区域。

在 iOS 中，手指按住屏幕上下拖动，会触发 touchmove 事件。这个事件触发的对象是整个 webview 容器，容器自然会被拖动，剩下的部分会成空白。

```js
document.body.addEventListener(
  'touchmove',
  function(e) {
    if (e._isScroller) return
    // 阻止默认事件
    e.preventDefault()
  },
  {
    passive: false
  }
)
```

## IOS 键盘弹起挡住原来的视图

:::tip
可以通过监听移动端软键盘弹起 `Element.scrollIntoViewIfNeeded（Boolean）`方法用来将不在浏览器窗口的可见区域内的元素滚动到浏览器窗口的可见区域。 

如果该元素已经在浏览器窗口的可见区域内，则不会发生滚动。

传入`true`的话,则元素将在其所在滚动区的可视区域中居中对齐。

传入`false`的话,则元素将与其所在滚动区的可视区域最近的边缘对齐。 根据可见区域最靠近元素的哪个边缘，元素的顶部将与可见区域的顶部边缘对准，或者元素的底部边缘将与可见区域的底部边缘对准。
:::

```js
window.addEventListener('resize', function() {
  if (
    document.activeElement.tagName === 'INPUT' ||
    document.activeElement.tagName === 'TEXTAREA'
  ) {
    window.setTimeout(function() {
      if ('scrollIntoView' in document.activeElement) {
        document.activeElement.scrollIntoView(false)
      } else {
        document.activeElement.scrollIntoViewIfNeeded(false)
      }
    }, 0)
  }
})
```

## IOS 下 fixed 失效的原因

软键盘唤起后，页面的 fixed 元素将失效，变成了 absolute，所以当页面超过一屏且滚动时，失效的 fixed 元素就会跟随滚动了。不仅限于 type=text 的输入框，凡是软键盘（比如时间日期选择、select 选择等等）被唤起，都会遇到同样地问题。

解决方法: 不让页面滚动，而是让主体部分自己滚动,主体部分高度设为 100%，`overflow:scroll`

```html
<body>
  <div class='warper'>
    <div class='main'></div>
  <div>
  <div class="fix-bottom"></div>
</body>
```

```css
.warper {
  position: absolute;
  width: 100%;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch; /* 解决ios滑动不流畅问题 */
}
.fix-bottom {
  position: fixed;
  bottom: 0;
  width: 100%;
}
```



