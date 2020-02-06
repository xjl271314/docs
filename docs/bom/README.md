# 浏览器对象 BOM

## 定义

各个浏览器厂商针对DOM标准实现的用来获取或设置浏览器的属性、行为的一个对象。

BOM是由哪些对象组成？

-  `window` : BOM中最顶层对象
-  `screen` ：屏幕对象
-  `location`： 地址栏对象
-  `history`：历史记录对象
-  `navigator`： 导航对象
-  `document` ： 文档对象
-  `frames` :框架集

## window对象

`BOM `的核心对象是 `window`，它表示浏览器的一个实例。

在浏览器中，`window `对象有双重角色，它既是通过 `JavaScript`访问浏览器窗口的一个接口，又是 `ECMAScript` 规定的 `Global` 对象。

这意味着在网页中定义的任何一个对象、变量和函数，都以`window `作为其`Global` 对象，因此有权访问`parseInt()`等方法。

### 全局作用域

**全局变量不能通过 `delete` 操作符删除，而直接在 `window` 对象上的定义的属性可以。**

```javascript
var age = 29; 
window.color = "red"; 
//在 IE < 9 时抛出错误，在其他所有浏览器中都返回 false 
delete window.age; 
//在 IE < 9 时抛出错误，在其他所有浏览器中都返回 true 
delete window.color; //returns true 
alert(window.age); // 29 
alert(window.color); // undefined
```

### 窗口位置

```javascript
var leftPos = (typeof window.screenLeft == "number") ? 
 window.screenLeft : window.screenX; 
var topPos = (typeof window.screenTop == "number") ? 
 window.screenTop : window.screenY;
```

### 窗口大小

```javascript
var pageWidth = window.innerWidth, pageHeight = window.innerHeight; 
if (typeof pageWidth != "number"){ 
    if (document.compatMode == "CSS1Compat"){ 
        pageWidth = document.documentElement.clientWidth; 
        pageHeight = document.documentElement.clientHeight; 
    } else { 
        pageWidth = document.body.clientWidth; 
        pageHeight = document.body.clientHeight; 
    } 
}
```

:::tip
另外，使用 `resizeTo()`和 `resizeBy()`方法可以调整浏览器窗口的大小。

这两个方法都接收两个参数，其中 `resizeTo()`接收浏览器窗口的新宽度和新高度，而` resizeBy()`接收新窗口与原窗口的宽度和高度之差。
:::

```javascript
//调整到 100×100 
window.resizeTo(100, 100); 
//调整到 200×150 
window.resizeBy(100, 50); 
//调整到 300×300 
window.resizeTo(300, 300);
```

### 导航和打开窗口
使用 `window.open()`方法既可以导航到一个特定的url，也可以打开一个新的浏览器窗口。

> window.open(url,name,features,replace);

### 间歇调用和超时调用
`JavaScript` 是单线程语言，但它允许通过设置超时值和间歇时间值来调度代码在特定的时刻执行。前者是在指定的时间过后执行代码，而后者则是每隔指定的时间就执行一次代码。

```javascript
setTimeout(function() { 
	alert("Hello world!"); 
}, 1000);
```

**第二个参数是一个表示等待多长时间的毫秒数，但经过该时间后指定的代码不一定会执行。**

`JavaScript` 是一个单线程序的解释器，因此一定时间内只能执行一段代码。为了控制要执行的代码，就有一个`JavaScript`任务队列。这些任务会按照将它们添加到队列的顺序执行。

**`setTimeout()`的第二个参数告诉`JavaScript` 再过多长时间把当前任务添加到队列中。**

如果队列是空的，那么添加的代码会立即执行；如果队列不是空的，那么它就要等前面的代码执行完了以后再执行。

调用 `setTimeout()`之后，`该方法会返回一个数值 ID，表示超时调用`。

这个超时调用`ID`是计划执行代码的唯一标识符，可以通过它来取消超时调用。要取消尚未执行的超时调用计划，可以调用`clearTimeout()`方法并将相应的超时调用`ID`作为参数传递给它，如下所示:

```javascript
// 设置超时调用
var timeoutId = setTimeout(function() { 
	alert("Hello world!"); 
}, 1000); 
// 注意：把它取消
clearTimeout(timeoutId);
```

间歇调用与超时调用类似，只不过它会按照指定的时间间隔重复执行代码，直至间歇调用被取消或者页面被卸载。

```javascript
var num = 0; 
var max = 10; 
var intervalId = null; 
function incrementNumber() { 
	num++; 
 	// 如果执行次数达到了 max 设定的值，则取消后续尚未执行的调用
	 if (num == max) { 
	 	clearInterval(intervalId); 
	 	alert("Done"); 
	 } 
} 
intervalId = setInterval(incrementNumber, 500);
```

在这个例子中，变量`num`每半秒钟递增一次，当递增到最大值时就会取消先前设定的间歇调用。这个模式也可以使用超时调用来实现，如下所示:

```javascript
var num = 0; 
var max = 10; 
function incrementNumber() { 
    num++; 
    // 如果执行次数未达到 max 设定的值，则设置另一次超时调用
    if (num < max) { 
 	    setTimeout(incrementNumber, 500); 
    } else { 
 	    alert("Done"); 
    } 
} 
setTimeout(incrementNumber, 500);
```

:::tip
在使用超时调用时，没有必要跟踪超时调用`ID`，因为每次执行代码之后，如果不再设置另一次超时调用，调用就会自行停止。

一般认为，使用`超时调用`来模拟`间歇调用`的是一种最佳模式。在开发环境下，很少使用真正的`间歇调用`，原因是后一个`间歇调用`可能会在前一个`间歇调用`结束之前启动。而像前面示例中那样使用`超时调用`，则完全可以避免这一点。
:::

## location 对象

`location` 是最有用的`BOM`对象之一，它提供了与当前窗口中加载的文档有关的信息，还提供了一些导航功能。

假设我们有如下一个url:
> http://localhost:8000/#/user/login?a=1&b=2

| 属性 |  例子   | 描述 |
|:--------:| :--------:|:-------------|
| origin | http://localhost:8000 | 返回主机等信息
| protocol | http | 返回当前地址的协议类型 `http` 、 `https`
| host | localhost:8000 | 返回当前的域名及端口号
| hostname | localhost| 返回当前的域名
| port | 8000 | 返回当前地址的端口号
| pathname | / | 返回当前页面所在目录路径
| search | "" | 返回当前地址所带的参数如果没有返回空字符串
| hash | #/user/login?a=1&b=2 | 返回当前地址所包含的hash值，如果没有hash值则返回空字符串
| href | http://localhost:8000/#/user/login?a=1&b=2 | 返回当前地址的完整url

**位置操作**
- window.location = url
- window.location.href = url
- window.location.assign(url)
- window.location.replace(url) // 无法返回上个页面
- window.location.reload(); // 重新加载（有可能从缓存中加载）
- window.location.reload(true); // 重新加载（从服务器重新加载）

## navigator 对象

**注册处理程序**

```javascript
// navigator.registerContentHandler(mimeType, handleUrl, appName)
navigator.registerContentHandler("application/rss+xml", "http://www.somereader.com?feed=%s", "Some Reader");
```

## history对象

history 对象保存着用户上网的历史记录，从窗口被打开的那一刻算起。

- history.back();// 回退一页
- history.forword();// 前进一页
- history.go(number | url) // 跳转指定页数或者页面
- history.length // 保存着历史记录的数量

## 客户端检测

**在可能的情况下，要尽量使用`typeof`进行能力检测。**

在浏览器环境下测试任何对象的某个特性是否存在，要使用下面这个函数：

```javascript
// 作者：Peter Michaux 
function isHostMethod(object, property) { 
	let t = typeof object[property]; 
 	return t === 'function' || (!!( t === 'object' && object[property])) || t == 'unknown'; 
}

// 可以像下面这样使用这个函数：
result = isHostMethod(xhr, "open"); //true 
result = isHostMethod(xhr, "foo"); //false
```
## 有趣的userAgent

> "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36"

基于 `WebKit` 的所有浏览器都将自己标识为 `Mozilla 5.0`，与基于 `Gecko` 的浏览器完全一样。

### 用户代理字符串检测技术

```javascript
export function OS() {
  const u = navigator.userAgent
  // 移动终端浏览器版本信息
  return {
    trident: u.indexOf('Trident') > -1, // IE内核
    presto: u.indexOf('Presto') > -1, // opera内核
    webKit: u.indexOf('AppleWebKit') > -1, // 苹果、谷歌内核
    gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') === -1, // 火狐内核
    mobile: !!u.match(/AppleWebKit.*Mobile.*/), // 是否为移动终端
    ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), // ios终端
    android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1 || u.indexOf('UCBrowser') > -1, // android终端或者uc浏览器
    iPhone: u.indexOf('iPhone') > -1, // 是否为iPhone或者QQHD浏览器
    iPad: u.indexOf('iPad') > -1, // 是否iPad
    webApp: u.indexOf('Safari') === -1, // 是否web应该程序，没有头部与底部
    weixin: u.indexOf('MicroMessenger') > -1, // 是否微信
    chrome: u.indexOf('Chrome') > -1,
    ali: u.indexOf('Alipay') > -1,
    qq: u.match(/\sQQ/i), // 是否QQ
    safari: u.indexOf('Safari') > -1,
  }
}
```