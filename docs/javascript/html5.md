# HTML5 脚本编程

## 跨文档消息传递

**跨文档消息传送（cross-document messaging）**，有时候简称为 `XDM`，**指的是在来自不同域的页面间传递消息。**

> 例如，`www.wrox.com `域中的页面与位于一个内嵌框架中的 `p2p.wrox.com` 域中的页面通信。

在 `XDM` 机制出现之前，要稳妥地实现这种通信需要花很多工夫。`XDM` 把这种机制规范化，让我们能既稳妥又简单地实现跨文档通信。

`XDM`的核心是 `postMessage()`方法。在 `HTML5` 规范中，除了 `XDM` 部分之外的其他部分也会提到这个方法名，但都是为了同一个目的：**向另一个地方传递数据。**对于 `XDM` 而言，**“另一个地方”指的是包含在当前页面中的`<iframe>`元素，或者由当前页面弹出的窗口。
**

:::tip
`postMessage()`方法接收两个参数：`一条消息`和`一个表示消息接收方来自哪个域的字符串`。第二个参数对保障安全通信非常重要，可以防止浏览器把消息发送到不安全的地方。来看下面的例子。
:::


```javascript
// 注意：所有支持 XDM 的浏览器也支持 iframe 的 contentWindow 属性
var iframeWindow = document.getElementById("myframe").contentWindow; 
iframeWindow.postMessage("A secret", "http://www.wrox.com");
```

接收到 `XDM `消息时，会触发 `window `对象的 `message `事件。

这个事件是以异步形式触发的，因此从发送消息到接收消息（触发接收窗口的 `message` 事件）可能要经过一段时间的延迟。触发 `message`事件后，传递给 `onmessage` 处理程序的事件对象包含以下三方面的重要信息。

- `data`：作为`postMessage()`第一个参数传入的字符串数据。
- `origin`：发送消息的文档所在的域，例如"http://www.wrox.com"。
- `source`：发送消息的文档的 `window` 对象的代理。这个代理对象主要用于在发送上一条消息的窗口中调用 `postMessage()`方法。如果发送消息的窗口来自同一个域，那这个对象就是`window`。

## 原生拖放

