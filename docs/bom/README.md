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

## Web Components

- 2020.11.27

这个概念直到今天才知道,苦涩...。特地放到此处是觉得这虽然是一个构建组件的方式,但是其实也隶属于浏览器相关的知识,话不多说 先来了解下这个东西。


`Web Components API`是右Google一直在推行的一种实现组件的方式,相比第三方框架，原生组件简单直接，符合直觉，不用加载任何外部模块，代码量小,但是实际书写上和可维护性也不是特别的好。

引用[阮一峰老师的一篇文章](http://www.ruanyifeng.com/blog/2019/08/web_components.html),这是一个卡片的示例:

![卡片示例](https://www.wangbase.com/blogimg/asset/201908/bg2019080405.jpg)

我们只需要在网页只要插入下面的代码，就会显示用户卡片。

```html
<user-card></user-card>
```

完整的实现代码如下所示:

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width">
  <title>JS Bin</title>
</head>
<body>
<user-card
  image="https://semantic-ui.com/images/avatar2/large/kristy.png"
  name="User Name"
  email="yourmail@some-email.com"
></user-card>
  
<template id="userCardTemplate">
  <style>
   :host {
     display: flex;
     align-items: center;
     width: 450px;
     height: 180px;
     background-color: #d4d4d4;
     border: 1px solid #d5d5d5;
     box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.1);
     border-radius: 3px;
     overflow: hidden;
     padding: 10px;
     box-sizing: border-box;
     font-family: 'Poppins', sans-serif;
   }
   .image {
     flex: 0 0 auto;
     width: 160px;
     height: 160px;
     vertical-align: middle;
     border-radius: 5px;
   }
   .container {
     box-sizing: border-box;
     padding: 20px;
     height: 160px;
   }
   .container > .name {
     font-size: 20px;
     font-weight: 600;
     line-height: 1;
     margin: 0;
     margin-bottom: 5px;
   }
   .container > .email {
     font-size: 12px;
     opacity: 0.75;
     line-height: 1;
     margin: 0;
     margin-bottom: 15px;
   }
   .container > .button {
     padding: 10px 25px;
     font-size: 12px;
     border-radius: 5px;
     text-transform: uppercase;
   }
  </style>
  
  <img class="image">
  <div class="container">
    <p class="name"></p>
    <p class="email"></p>
    <button class="button">Follow John</button>
  </div>
</template>

</body>
</html>
```

```js
class UserCard extends HTMLElement {
  constructor() {
    super();
    var shadow = this.attachShadow( { mode: 'closed' } );
    
    var templateElem = document.getElementById('userCardTemplate');
    var content = templateElem.content.cloneNode(true);
    content.querySelector('img').setAttribute('src', this.getAttribute('image'));
    content.querySelector('.container>.name').innerText = this.getAttribute('name');
    content.querySelector('.container>.email').innerText = this.getAttribute('email');

    shadow.appendChild(content);
  }
}
window.customElements.define('user-card', UserCard);
```

通过上面这种自定义 HTML 标签的形式，称之为自定义元素（custom element）。根据规范，自定义元素的名称必须包含连词线，用与区别原生的 HTML 元素。所以，`<user-card>`不能写成`<userCard>`。

### customElements.define()

自定义元素需要使用 JavaScript 定义一个类，所有`<user-card>`都会是这个类的实例。

```js
class UserCard extends HTMLElement {
  constructor() {
    super();
  }
}
```

`UserCard`就是自定义元素的类。注意，这个类的父类是`HTMLElement`，因此继承了 HTML 元素的特性。

接着，使用浏览器原生的`window.customElements.define()`方法，告诉浏览器`<user-card>`元素与这个类关联。

```js
window.customElements.define('user-card', UserCard);
```

### 自定义元素的内容

```js
class UserCard extends HTMLElement {
  constructor() {
    super();

    var image = document.createElement('img');
    image.src = 'https://semantic-ui.com/images/avatar2/large/kristy.png';
    image.classList.add('image');

    var container = document.createElement('div');
    container.classList.add('container');

    var name = document.createElement('p');
    name.classList.add('name');
    name.innerText = 'User Name';

    var email = document.createElement('p');
    email.classList.add('email');
    email.innerText = 'yourmail@some-email.com';

    var button = document.createElement('button');
    button.classList.add('button');
    button.innerText = 'Follow';

    container.append(name, email, button);
    this.append(image, container);
  }
}
```

`this.append()`的`this`表示自定义元素实例,完成这一步以后，自定义元素内部的 DOM 结构就已经生成了。

### template标签

使用 JavaScript 写上一节的 DOM 结构很麻烦，`Web Components API` 提供了`<template>`标签，可以在它里面使用 HTML 定义 DOM。

```html
<template id="userCardTemplate">
  <img src="https://semantic-ui.com/images/avatar2/large/kristy.png" class="image">
  <div class="container">
    <p class="name">User Name</p>
    <p class="email">yourmail@some-email.com</p>
    <button class="button">Follow</button>
  </div>
</template>
```

然后，改写一下自定义元素的类，为自定义元素加载`<template>`。

```js
class UserCard extends HTMLElement {
  constructor() {
    super();

    var templateElem = document.getElementById('userCardTemplate');
    var content = templateElem.content.cloneNode(true);
    this.appendChild(content);
  }
}  
```

上面代码中，获取`<template>`节点以后，克隆了它的所有子元素，这是因为可能有多个自定义元素的实例，这个模板还要留给其他实例使用，所以不能直接移动它的子元素。

到这一步为止，完整的代码如下。

```js
<body>
  <user-card></user-card>
  <template>...</template>

  <script>
    class UserCard extends HTMLElement {
      constructor() {
        super();

        var templateElem = document.getElementById('userCardTemplate');
        var content = templateElem.content.cloneNode(true);
        this.appendChild(content);
      }
    }
    window.customElements.define('user-card', UserCard);    
  </script>
</body>
```

### 添加样式

组件的样式应该与代码封装在一起，只对自定义元素生效，不影响外部的全局样式。所以，可以把样式写在`<template>`里面。

```html
<template id="userCardTemplate">
  <style>
   :host {
     display: flex;
     align-items: center;
     width: 450px;
     height: 180px;
     background-color: #d4d4d4;
     border: 1px solid #d5d5d5;
     box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.1);
     border-radius: 3px;
     overflow: hidden;
     padding: 10px;
     box-sizing: border-box;
     font-family: 'Poppins', sans-serif;
   }
   .image {
     flex: 0 0 auto;
     width: 160px;
     height: 160px;
     vertical-align: middle;
     border-radius: 5px;
   }
   .container {
     box-sizing: border-box;
     padding: 20px;
     height: 160px;
   }
   .container > .name {
     font-size: 20px;
     font-weight: 600;
     line-height: 1;
     margin: 0;
     margin-bottom: 5px;
   }
   .container > .email {
     font-size: 12px;
     opacity: 0.75;
     line-height: 1;
     margin: 0;
     margin-bottom: 15px;
   }
   .container > .button {
     padding: 10px 25px;
     font-size: 12px;
     border-radius: 5px;
     text-transform: uppercase;
   }
  </style>

  <img src="https://semantic-ui.com/images/avatar2/large/kristy.png" class="image">
  <div class="container">
    <p class="name">User Name</p>
    <p class="email">yourmail@some-email.com</p>
    <button class="button">Follow</button>
  </div>
</template>
```

上面代码中，`<template>`样式里面的:host伪类，指代自定义元素本身。

### 自定义元素的参数

`<user-card>`内容现在是在`<template>`里面设定的，为了方便使用，把它改成参数。

```html
<user-card
  image="https://semantic-ui.com/images/avatar2/large/kristy.png"
  name="User Name"
  email="yourmail@some-email.com"
></user-card>
```

`<template>`代码也相应改造。

```html
<template id="userCardTemplate">
  <style>...</style>

  <img class="image">
  <div class="container">
    <p class="name"></p>
    <p class="email"></p>
    <button class="button">Follow John</button>
  </div>
</template>
```

最后，改一下类的代码，把参数加到自定义元素里面。

```js
class UserCard extends HTMLElement {
  constructor() {
    super();

    var templateElem = document.getElementById('userCardTemplate');
    var content = templateElem.content.cloneNode(true);
    content.querySelector('img').setAttribute('src', this.getAttribute('image'));
    content.querySelector('.container>.name').innerText = this.getAttribute('name');
    content.querySelector('.container>.email').innerText = this.getAttribute('email');
    this.appendChild(content);
  }
}
window.customElements.define('user-card', UserCard);  
```

### Shadow DOM

我们不希望用户能够看到`<user-card>`的内部代码，`Web Component` 允许内部代码隐藏起来，这叫做 Shadow DOM，即这部分 DOM 默认与外部 DOM 隔离，内部任何代码都无法影响外部。

自定义元素的`this.attachShadow()`方法开启 Shadow DOM如下:

```js
class UserCard extends HTMLElement {
  constructor() {
    super();
    var shadow = this.attachShadow( { mode: 'closed' } );

    var templateElem = document.getElementById('userCardTemplate');
    var content = templateElem.content.cloneNode(true);
    content.querySelector('img').setAttribute('src', this.getAttribute('image'));
    content.querySelector('.container>.name').innerText = this.getAttribute('name');
    content.querySelector('.container>.email').innerText = this.getAttribute('email');

    shadow.appendChild(content);
  }
}
window.customElements.define('user-card', UserCard);
```

上面代码中，`this.attachShadow()`方法的参数`{ mode: 'closed' }`，表示 `Shadow DOM` 是封闭的，不允许外部访问。

### 组件的扩展

在前面的基础上，我们还可以对组件进行扩展。

**1. 与用户互动**

用户卡片是一个静态组件，如果要与用户互动，也很简单，就是在类里面监听各种事件。

```js
this.$button = shadow.querySelector('button');
this.$button.addEventListener('click', () => {
  // do something
});
```

**2. 组件的封装**

上面的例子中，`<template>`与网页代码放在一起，其实可以用脚本把`<template>`注入网页。这样的话，JavaScript 脚本跟`<template>`就能封装成一个 JS 文件，成为独立的组件文件。网页只要加载这个脚本，就能使用`<user-card>`组件。

