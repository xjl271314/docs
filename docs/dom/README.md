# 文档对象模型DOM

## 定义

`DOM` 是 `Document Object Model`（文档对象模型）的缩写。

`DOM` 是 `W3C`（万维网联盟）的标准。

`DOM` 定义了访问 `HTML` 和 `XML` 文档的标准：

`DOM`是中立于平台和语言的接口，它允许程序和脚本动态地访问和更新文档的内容、结构和样式。

`W3C DOM` 标准被分为 3 个不同的部分：

1. `核心 DOM` - 针对任何结构化文档的标准模型
2. `XML DOM` - 针对 XML 文档的标准模型
3. `HTML DOM` - 针对 HTML 文档的标准模型

## !DOCTYPE html 作用

`<!DOCTYPE>` 声明必须是 `HTML` 文档的第一行，位于 `<html>` 标签之前。

`HTML`版本有很多种，这个声明告诉浏览器采用HTML5标准网页声明来解析`html`文件。

## 严格模式和混杂模式

- `严格模式`下排版和js运作模式是以该浏览器支持的最高标准运行。

- `混杂模式`下浏览器向后兼容，模拟老浏览器，防止浏览器无法兼容页面。

## DOM级别

- `dom1级`：如何映射基于 XML 的文档结构，以便简化对文档中任意部分的访问和操作。
- `dom2级`：在原来的基础上又扩充了鼠标和用户界面事件、范围、遍历(迭代 DOM 文档的方法)等细分模块，而且通过对象接口增加了对CSS的支持。
- `dom3级`：在dom2的基础上进一步引入了以统一方式加载和保存文档的方法——在 DOM加载和保存(DOM Load and Save)模块中定义;新增了验证文档的方法——在 DOM验证(DOM Validation)模块中定义。DOM3 级也对 DOM 核心进行了扩展，开始支持 XML 1.0 规范，涉及 XML Infoset、XPath和 XML Base。

## 节点层次

`DOM`可以将任何`HTML` 或 `XML` 文档描绘成一个由多层节点构成的结构。

节点分为几种不同的类型，每种类型分别表示文档中不同的信息及（或）标记。每个节点都拥有各自的特点、数据和方法，另外也与其他节点存在某种关系。节点之间的关系构成了层次，而所有页面标记则表现为一个以特定节点为根节点的树形结构。以下面的 `HTML` 为例：

```html
<html> 
 <head> 
 <title>Sample Page</title> 
 </head> 
 <body> 
 <p>Hello World!</p> 
 </body> 
</html>
```

可以将这个简单的`HTML`文档表示为一个层次结构:

![节点关系图](https://img-blog.csdnimg.cn/20200117134848145.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

节点之间的关系图:

![节点关系图](https://img-blog.csdnimg.cn/202001171358090.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

## 操作节点

- `appendChild()`:用于向指定节点末尾追加一个节点，如果传入到 `appendChild()`中的节点已经是文档的一部分了，那结果就是将该节点从原来的位置转移到新位置。

```javascript
someNode.appendChild(newNode);
```

- `insertBefore()`:在指定节点之间插入一个新的节点。

```javascript
someNode.insertBefore(newNode, exitNode);
```

- `replaceChild()`:将一个节点替换成指定节点。

```javascript
someNode.replaceChild(newNode, exitNode);
```

- `removeChild()`:移除某个指定节点。

```javascript
someNode.removeChild(exitNode);
```

- `cloneNode()`:复制某个节点。`cloneNode()`方法接受一个布尔值参数，表示是否执行深复制。

```javascript
someNode.cloneNode(false);// 只复制节点本身
someNode.cloneNode(true); // 复制节点及其整个子节点树
```
## 设置浏览器文档标题

```javascript
// 设置文档标题
document.title = "New page title";
```

## document.domain

当页面中包含来自其他子域的框架或内嵌框架时，能够设置 `document.domain`就非常方便了。

:::tip
由于`跨域安全限制`，来自不同子域的页面无法通过 `JavaScript` 通信。

而通过将每个页面的`document.domain` 设置为相同的值，这些页面就可以互相访问对方包含的`JavaScript`对象了。
:::

```javascript
// 假设页面来自于 p2p.wrox.com 域
document.domain = "wrox.com"; // 松散的（成功）
```

## iframe元素

> iframe元素会创建包含另一个文档的内联框架。可以将提示文字放在`<iframe></iframe>`之间，来提示某些不支持`iframe`的浏览器。

### 缺点

1. 加载`inframe`会阻塞主页面的`onload`事件
2. 搜索引擎无法解读这种页面，不利于seo
3. `iframe`和主页面共享连接池，而浏览器对相同区域有限制所以会影响性能。

##  查找元素
- `document.getElementById('id')`:如果页面中多个元素的 ID 值相同，`getElementById()`只返回文档中第一次出现的元素。
- `document.getElementsByTagName('a')`:返回文档中所有`<a>`元素。
- `document.getElementsByName('aa')`:返回文档中所有`name`为`aa`的元素。
- `document.anchors`:返回文档中所有带`name`特性的`<a>`元素。
- `document.forms`:返回文档中所有的`<form>`元素。
- `document.images`:返回文档中所有的`<img>`元素。
- `document.links`:返回文档中所有带`href`特性的`<a>`元素

## 取得元素特性
- `getAttribute()`:如果给定名称的特性不存在，`getAttribute()`返回 `null`。根据 `HTML5` 规范，自定义特性应该加上 `data-`前缀以便验证。
- `setAttribute(key,value)`:通过这个方法设置的特性名会被统一转换为小写形式。
- `removeAttribute(attr)`:移除元素的某个属性。

## 创建元素

- `document.createElement('div')`:这个方法只接受一个参数，即要创建元素的标签名。

:::warning
在新元素上设置这些特性只是给它们赋予了相应的信息。由于新元素尚未被添加到文档树中，因此设置这些特性不会影响浏览器的显示。要把新元素添加到文档树，可以使用 `appendChild()`、`insertBefore()`或 `replaceChild()`方法。
:::

```javascript
document.body.appendChild(div);
```

一旦将元素添加到文档树中，浏览器就会立即呈现该元素。此后，对这个元素所作的任何修改都会实时反映在浏览器中。

## 创建文本节点

> `document.createTextNode()`:该方法接受一个参数——要插入节点中的文本。

```javascript
var element = document.createElement("div"); 
element.className = "message"; 
var textNode = document.createTextNode("Hello world!"); 
element.appendChild(textNode); 
document.body.appendChild(element);
```

## 规范化文本节点

`DOM`文档中存在相邻的同胞文本节点很容易导致混乱，因为分不清哪个文本节点表示哪个字符串。另外，`DOM`文档中出现相邻文本节点的情况也不在少数，于是就催生了一个能够将相邻文本节点合并的方法。

这个方法是由 `Node` 类型定义的（因而在所有节点类型中都存在）`normalize()`。

:::tip
如果在一个包含两个或多个文本节点的父元素上调用 `normalize()`方法，则会将所有文本节点合并成一个节点，结果节点的 `nodeValue` 等于将合并前每个文本节点的 `nodeValue` 值拼接起来的值。来看一个例子:
:::

```javascript
var element = document.createElement("div"); 
element.className = "message"; 

var textNode = document.createTextNode("Hello world!"); 
element.appendChild(textNode); 

var anotherTextNode = document.createTextNode("Yippee!"); 

element.appendChild(anotherTextNode); 
document.body.appendChild(element); 
alert(element.childNodes.length); //2 
element.normalize(); 
alert(element.childNodes.length); //1 
alert(element.firstChild.nodeValue); // "Hello world!Yippee!"
```

## DocumentFragment类型

> 在所有节点类型中，只有`DocumentFragment`在文档中没有对应的标记。`DOM` 规定文档片段`（document fragment）`是一种“轻量级”的文档，可以包含和控制节点，但不会像完整的文档那样占用额外的资源。

```javascript
// 类似React中的React.Fragement
var fragment = document.createDocumentFragment();
```

## DOM 操作技术

### 动态脚本

使用`<script>`元素可以向页面中插入`JavaScript`代码，一种方式是通过其`src`特性包含外部文件，另一种方式就是用这个元素本身来包含代码。跟操作`HTML`元素一样，创建动态脚本也有两种方式：

- 插入外部文件。
- 直接插入`JavaScript`代码。

```javascript
// 加载外部脚本
function loadScript(url){ 
	var script = document.createElement("script"); 
	script.type = "text/javascript"; 
	script.src = url; 
 	document.body.appendChild(script); 
}
// 加载脚本代码
function loadScriptString(code){ 
 	var script = document.createElement("script"); 
 	script.type = "text/javascript"; 
 	try { 
 		script.appendChild(document.createTextNode(code)); 
 	} catch (ex){ 
 		script.text = code; 
 	} 
 	document.body.appendChild(script); 
}
```

### 动态样式

能够把`CSS`样式包含到`HTML`页面中的元素有两个。其中，`<link>`元素用于包含来自外部的文件，而`<style>`元素用于指定嵌入的样式。与动态脚本类似，所谓动态样式是指在页面刚加载时不存在的样式；动态样式是在页面加载完成后动态添加到页面中的。

```javascript
function loadStyles(url){ 
 	var link = document.createElement("link");
 	link.rel = "stylesheet";
 	link.type = "text/css";
 	link.href = url;
 	var head = document.getElementsByTagName("head")[0];
 	head.appendChild(link);
}

function loadStyleString(css){ 
 	var style = document.createElement("style");
 	style.type = "text/css"; 
 	try{ 
 		style.appendChild(document.createTextNode(css)); 
 	} catch (ex){ 
 		style.styleSheet.cssText = css; 
 	} 
 	var head = document.getElementsByTagName("head")[0]; 
 	head.appendChild(style); 
}
```
:::warning
需要注意的是，必须将`<link>`元素添加到`<head>`而不是`<body>`元素，才能保证在所有浏览器中的行为一致。
:::

### 使用NodeList

理解 `NodeList` 及其“近亲”`NamedNodeMap` 和 `HTMLCollection`，是从整体上透彻理解 `DOM` 的关键所在。

这三个集合都是“动态的”；换句话说，每当文档结构发生变化时，它们都会得到更新。因此，它们始终都会保存着最新、最准确的信息。

<font color="red">从本质上说，所有 `NodeList`对象都是在访问 `DOM` 文档时实时运行的查询。</font>

:::tip
`DOM` 是语言中立的`API`，用于访问和操作 `HTML` 和 `XML` 文档。`DOM1 级`将 `HTML` 和 `XML` 文档形象地看作一个层次化的节点树，可以使用 `JavaScript `来操作这个节点树，进而改变底层文档的外观和结构。

理解 `DOM` 的关键，就是理解 `DOM` 对性能的影响。`DOM `操作往往是`JavaScript`程序中开销最大的部分，而因访问 `NodeList` 导致的问题为最多。

`NodeList` 对象都是“动态的”，这就意味着每次访问`NodeList `对象，都会运行一次查询。有鉴于此，最好的办法就是尽量减少 DOM 操作。
:::

## DOM 扩展

> 对 DOM 的两个主要的扩展是 `Selectors API（选择符 API）`和 `HTML5`。

### 选择符 API

 **Selectors API Level 1** 的核心是两个方法：`querySelector()`和 `querySelectorAll()`。

 - `querySelector()方法`:接收一个`CSS`选择符，返回与该模式匹配的第一个元素，如果没有找到匹配的元素，返回 `null`。

 :::tip
 通过 `Document`类型调用 `querySelector()`方法时，会在文档元素的范围内查找匹配的元素。
 
 而通过 `Element` 类型调用 `querySelector()`方法时，只会在该元素后代元素的范围内查找匹配的元素。
 :::

- `querySelectorAll()方法`:接收的参数与 `querySelector()`方法一样，都是一个`CSS`选择符，但返回的是所有匹配的元素而不仅仅是一个元素。这个方法返回的是`NodeList`的实例。

**Selectors API Level 2** 规范为 `Element`类型新增了一个方法`matchesSelector()`。

- `matchesSelector()方法`:接收一个参数，即`CSS`选择符，如果调用元素与该选择符匹配，返回` true`；否则，返回 `false`。

## HTML5扩充

### 与类相关的扩充

- `getElementsByClassName()方法`:接收一个参数，即一个包含一或多个类名的字符串，返回带有指定类的所有元素的`NodeList`。传入多个类名时，类名的先后顺序不重要。

- `classList 属性`

    HTML5 新增了一种操作类名的方式，可以让操作更简单也更安全，那就是为所有元素添加`classList`属性。
    
    这个`classList`属性是新集合类型`DOMTokenList` 的实例。与其他 `DOM` 集合类似，`DOMTokenList` 有一个表示自己包含多少元素的 `length` 属性，而要取得每个元素可以使用`item()`方法，也可以使用方括号语法。此外，这个新类型还定义如下方法。

	1. `add(className)` 向元素添加指定类名。
	2. `contains(className)` 检测元素是否含有指定类名。
	3. `remove(className)` 删除元素中的指定类名。
	4. `toggle(className)` 如果元素中存在指定类名则删除，否则添加。

### 焦点管理

- `focus()方法`
- `document.hasFocus()方法`，这个方法用于确定文档是否获得了焦点。

### HTMLDocument的变化

- `readyState 属性`
`Document` 的 `readyState` 属性有两个可能的值：
1. `loading`，正在加载文档；
2. `complete`，已经加载完文档。

使用 `document.readyState` 的最恰当方式，就是通过它来实现一个指示文档已经加载完成的指示器。

```javascript
if (document.readyState == "complete"){ 
	// 执行操作
}
```

- **兼容模式**
自从 `IE6` 开始区分渲染页面的模式是标准的还是混杂的，检测页面的兼容模式就成为浏览器的必要功能。`IE` 为此给 `document` 添加了一个名为 `compatMode `的属性，这个属性就是为了告诉开发人员浏览器采用了哪种渲染模式。

:::tip
在**标准模式**下，`document.compatMode` 的值等于"`CSS1Compat`"，而在**混杂模式**下，`document.compatMode` 的值等于"`BackCompat`"。
:::

```javascript
if (document.compatMode == "CSS1Compat"){ 
	alert("Standards mode"); 
} else { 
	alert("Quirks mode"); 
}
```

- **`head` 属性**

`HTML5` 新增了 `document.head` 属性，引用文档的`<head>`元素。
	
```javascript
var head = document.head || document.getElementsByTagName("head")[0];
```

### 字符集属性

`HTML5`新增了几个与文档字符集有关的属性。其中，`charset` 属性表示文档中实际使用的字符集，也可以用来指定新字符集。默认情况下，这个属性的值为`"UTF-16"`，但可以通过`<meta>`元素、响应头部或直接设置 `charset` 属性修改这个值。

### 自定义数据属性

`HTML5`规定可以为元素添加非标准的属性，但要添加前缀`data-`，**目的是为元素提供与渲染无关的信息，或者提供语义信息**。

```html
<div id="myDiv" data-appId="12345" data-myname="Nicholas"></div>
```

添加了自定义属性之后，可以通过元素的 `dataset` 属性来访问自定义属性的值。

```javascript
var div = document.getElementById("myDiv"); 
// 取得自定义属性的值
var appId = div.dataset.appId; 
var myName = div.dataset.myname; 
// 设置值
div.dataset.appId = 23456; 
div.dataset.myname = "Michael";
```

### 插入标记

- `innerHTML`属性:

    在`读模式`下，`innerHTML` 属性返回与调用元素的所有子节点（包括元素、注释和文本节点）对应的 HTML 标记。
	
	在`写模式`下，`innerHTML` 会根据指定的值创建新的 `DOM` 树，然后用这个 `DOM `树完全替换调用元素原先的所有子节点。

- `outerHTML 属性`:

	在读模式下，`outerHTML` 返回调用它的元素及所有子节点的`HTML` 标签。

	在写模式下，`outerHTML`会根据指定的 `HTML` 字符串创建新的 `DOM` 子树，然后用这个 `DOM` 子树完全替换调用元素。

### `scrollIntoView()方法`

:::tip
`scrollIntoView()`可以在所有 HTML 元素上调用，通过滚动浏览器窗口或某个容器元素，调用元素就可以出现在视口中。

- 如果给这个方法传入 `true` 作为参数，或者不传入任何参数，那么窗口滚动之后会让调用元素的顶部与视口顶部尽可能平齐。

- 如果传入`false` 作为参数，调用元素会尽可能全部出现在视口中，（可能的话，调用元素的底部会与视口顶部平齐。）不过顶部不一定平齐。
:::

###  文档模式

要强制浏览器以某种模式渲染页面，可以使用 `HTTP` 头部信息 `X-UA-Compatible`，或通过等价的`<meta>`标签来设置：

```html
<meta http-equiv="X-UA-Compatible" content="IE=IEVersion">
```

### `contains()方法`

在实际开发中，经常需要知道某个节点是不是另一个节点的后代。

```javascript
alert(document.documentElement.contains(document.body)); //true
```

:::tip
使用 `DOM Level 3`的`compareDocumentPosition()`方法也能够确定节点间的关系。
:::

![compareDocumentPosition](https://img-blog.csdnimg.cn/20200118122218907.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

### 滚动

- ` scrollIntoViewIfNeeded(alignCenter)`:只在当前元素在视口中不可见的情况下，才滚动浏览器窗口或容器元素，最终让它可见。如果当前元素在视口中可见，这个方法什么也不做。如果将可选的 alignCenter 参数设置为 true，则表示尽量将元素显示在视口中部（垂直方向）。

- `scrollByLines(lineCount)`：将元素的内容滚动指定的行高，`lineCount` 值可以是正值，也可以是负值。

- `scrollByPages(pageCount)`：将元素的内容滚动指定的页面高度，具体高度由元素的高度决定。

:::warning
希望大家要注意的是，`scrollIntoView()`和 `scrollIntoViewIfNeeded()`的作用对象是**元素的容器**，而 `scrollByLines()`和 `scrollByPages()`影响的则是元素自身。
:::

## DOM2 和 DOM3

`DOM1` 级主要定义的是 HTML 和 XML 文档的底层结构。
`DOM2` 和 `DOM3 `级则在这个结构的基础上引入了更多的交互能力，也支持了更高级的 `XML` 特性。

### 计算的样式

虽然 `style` 对象能够提供支持 `style` 特性的任何元素的样式信息，但它不包含那些从其他样式表层叠而来并影响到当前元素的样式信息。

`“DOM2 级样式”`增强了 `document.defaultView`，提供了`getComputedStyle()`方法。

> `getComputedStyles(el,null)`:要取得计算样式的元素和一个伪元素字符串（例如":after"）。如果不需要伪元素信息，第二个参数可以是 `null`。

```javascript
function getStyle(ele, attr) {
  	if (window.getComputedStyle) {
    	return window.getComputedStyle(ele, null)[attr];
  	}
  	return ele.currentStyle[attr];
}
```

## 元素大小

### 偏移量

- `offsetHeight`:元素在垂直方向上占用的空间大小，以像素计。包括元素的高度、（可见的）水平滚动条的高度、上边框高度和下边框高度。
- `offsetWidth`：元素在水平方向上占用的空间大小，以像素计。包括元素的宽度、（可见的）垂直滚动条的宽度、左边框宽度和右边框宽度。
- `offsetLeft`：元素的左外边框至包含元素的左内边框之间的像素距离。
- `offsetTop`：元素的上外边框至包含元素的上内边框之间的像素距离。

其中，`offsetLeft` 和 `offsetTop` 属性与包含元素有关，包含元素的引用保存在 `offsetParent`属性中。

![offset偏移量](https://img-blog.csdnimg.cn/20200118140616761.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)


### 客户区大小

> 指的是元素内容及其内边距所占据的空间大小。

- `clientWidth`:是元素内容区宽度加上左右内边距宽度。
- `clientHeight`:元素内容区高度加上上下内边距高度。

![clientArea](https://img-blog.csdnimg.cn/20200118142250742.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

### 滚动大小

> 指的是包含滚动内容的元素的大小。

- `scrollHeight`：在没有滚动条的情况下，元素内容的总高度。
- `scrollWidth`：在没有滚动条的情况下，元素内容的总宽度。
- `scrollLeft`：被隐藏在内容区域左侧的像素数。通过设置这个属性可以改变元素的滚动位置。
- `scrollTop`：被隐藏在内容区域上方的像素数。通过设置这个属性可以改变元素的滚动位置。

### 确定元素大小

每个元素都提供了一个 `getBoundingClientRect()`方法。

这个方法返回一个矩形对象，包含 8个属性：`left`、`top`、`right` 、 `bottom`、`width`、`height`、`x、y`。这些属性给出了元素在页面中相对于视口的位置。

```javascript
el.getBoundingClientRect();
```


## DOM事件

> `javaScript `与` HTML` 之间的交互是通过事件实现的。事件，就是文档或浏览器窗口中发生的一些特定的交互瞬间。

### 事件流

事件流描述的是从页面中接收事件的顺序。

- `事件冒泡`:事件开始时由最具体的元素（文档中嵌套层次最深的那个节点）接收，然后逐级向上传播到较为不具体的节点（document）。

```html
<!DOCTYPE html> 
<html> 
	<head> 
	    <title>Event Bubbling Example</title> 
	</head> 

	<body> 
	    <div id="myDiv">Click Me</div> 
	</body> 
</html>
```
如果你单击了页面中的`<div>`元素，那么这个`click`事件会按照如下顺序传播：

![事件冒泡](https://img-blog.csdnimg.cn/20200118145640940.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

- `事件捕获`:事件捕获的思想是不太具体的节点应该更早接收到事件，而最具体的节点应该最后接收到事件。**事件捕获的用意在于在事件到达预定目标之前捕获它**。

![事件捕获](https://img-blog.csdnimg.cn/20200118145806967.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

### DOM事件流

`DOM2级事件`规定的事件流包括三个阶段：`事件捕获阶段`、`处于目标阶段`和`事件冒泡阶段`。

1. 首先发生的是事件捕获，为截获事件提供了机会。
2. 然后是实际的目标接收到事件。
3. 最后一个阶段是冒泡阶段，可以在这个阶段对事件做出响应。

![DOM事件流](https://img-blog.csdnimg.cn/20200118155006628.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

:::tip
在 `DOM` 事件流中，实际的目标（`<div>`元素）在`捕获阶段`不会接收到事件。

这意味着在`捕获阶段`，事件从 `document` 到`<html>`再到`<body>`后就停止了。

下一个阶段是“`处于目标`”阶段，于是事件在`<div>`上发生，并在事件处理中被看成冒泡阶段的一部分。然后，冒泡阶段发生，事件又传播回文档。
:::

## DOM事件处理程序

> 事件就是用户或浏览器自身执行的某种动作。诸如`click`、`load` 和 `mouseover`，都是事件的名字。而响应某个事件的函数就叫做事件处理程序（或事件侦听器）。

### DOM0级事件处理程序

> 通过`JavaScript`指定事件处理程序的传统方式，就是将一个函数赋值给一个事件处理程序属性。

```javascript
var btn = document.getElementById("myBtn"); 
btn.onclick = function(){ 
 	alert("Clicked"); 
};
```

在此，我们通过文档对象取得了一个按钮的引用，然后为它指定了`onclick `事件处理程序。<font color="red">但要注意，在这些代码运行以前不会指定事件处理程序，因此如果这些代码在页面中位于按钮后面，就有可能在一段时间内怎么单击都没有反应。</font>

:::tip
使用`DOM0级`方法指定的事件处理程序被认为是元素的方法。因此，这时候的事件处理程序是在元素的作用域中运行；换句话说，程序中的 `this` 引用当前元素。来看一个例子:
:::

```javascript
var btn = document.getElementById("myBtn"); 
btn.onclick = function(){ 
	alert(this.id); //"myBtn" 
};
```

:::tip
DOM0级添加的事件处理程序会在`事件流的冒泡阶段被处理。`

也可以删除通过 `DOM0级`方法指定的事件处理程序，只要像下面这样将事件处理程序属性的值设置为` null `即可：
:::

```javascript
btn.onclick = null; // 删除事件处理程序
```

将事件处理程序设置为 `null `之后，再单击按钮将不会有任何动作发生。

###  DOM2 级事件处理程序

> “DOM2级事件”定义了两个方法，用于处理指定和删除事件处理程序的操作：`addEventListener()`和 `removeEventListener()`。

所有 `DOM` 节点中都包含这两个方法，并且它们都接受 3 个参数：
1. 要处理的事件名
2. 事件处理程序的函数
3. 一个布尔值。

:::tip
最后这个布尔值参数如果是`true`，表示在`捕获阶段`调用事件处理程序；如果是 `false`，表示在`冒泡阶段`调用事件处理程序。
:::

```javascript
/**
* eventName
* handler
* capture | bind
*/
var btn = document.getElementById("myBtn"); 
btn.addEventListener("click", function(){ 
    alert(this.id); 
}, false);
```

上面的代码为一个按钮添加了 `onclick` 事件处理程序，而且该事件会在`冒泡阶段`被触发。

:::tip
与 `DOM0`级方法一样，这里添加的事件处理程序也是在其依附的元素的作用域中运行。

使用`DOM2` 级方法添加事件处理程序的主要好处是可以添加多个事件处理程序。
:::

```javascript
var btn = document.getElementById("myBtn"); 
btn.addEventListener("click", function(){ 
 	alert(this.id); 
}, false); 

btn.addEventListener("click", function(){ 
 	alert("Hello world!"); 
}, false);
```

:::warning
通过 `addEventListener()`添加的事件处理程序只能使用 `removeEventListener()`来移除；移除时传入的参数与添加处理程序时使用的参数相同。这也意味着通过 `addEventListener()`添加的匿名函数将无法移除，如下面的例子所示:
:::

```javascript
var btn = document.getElementById("myBtn"); 
btn.addEventListener("click", function(){ 
 	alert(this.id);
}
//这里省略了其他代码
btn.removeEventListener("click", function(){ // 没有用！
 	alert(this.id); 
}, false);
```

### IE事件处理程序

`IE`实现了与`DOM`中类似的两个方法：`attachEvent()`和 `detachEvent()`。这两个方法接受相同的两个参数：事件处理程序名称与事件处理程序函数。

由于 `IE8` 及更早版本只支持`事件冒泡`，所以通过`attachEvent()`添加的事件处理程序都会被添加到冒泡阶段。

```javascript
var btn = document.getElementById("myBtn"); 
btn.attachEvent("onclick", function(){ 
	alert("Clicked"); 
});
```

注意，`attachEvent()`的第一个参数是"`onclick`"，而非`DOM`的`addEventListener()`方法中的"`click`"。

:::tip

在 `IE` 中使用 `attachEvent()`与使用 `DOM0` 级方法的主要区别在于事件处理程序的作用域。

在使用 `DOM0` 级方法的情况下，事件处理程序会在其所属元素的作用域内运行；在使用 `attachEvent()`方法的情况下，事件处理程序会在全局作用域中运行，因此 `this` 等于 `window`。

不过，与 `DOM`方法不同的是，这些事件处理程序不是以添加它们的顺序执行，而是以相反的顺序被触发。
:::


## 事件对象

在触发 `DOM` 上的某个事件时，会产生一个事件对象 `event`，这个对象中包含着所有与事件有关的信息。包括导致事件的元素、事件的类型以及其他与特定事件相关的信息。

### DOM中的事件对象

兼容 `DOM` 的浏览器会将一个 `event` 对象传入到事件处理程序中。无论指定事件处理程序时使用什么方法（`DOM0级` 或 `DOM2 级`），都会传入 `event`对象。

```javascript
var btn = document.getElementById("myBtn"); 
btn.onclick = function(event){ 
 	alert(event.type); // "click" 
}; 
btn.addEventListener("click", function(event){ 
 	alert(event.type); // "click" 
}, false);
```

`event` 对象包含与创建它的特定事件有关的属性和方法。触发的事件类型不一样，可用的属性和方法也不一样。不过，所有事件都会有下表列出的成员。

![event对象1](https://img-blog.csdnimg.cn/20200118162558216.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)
![event对象2](https://img-blog.csdnimg.cn/20200118162609475.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

:::tip
在事件处理程序内部，对象 `this` 始终等于 `currentTarget` 的值，而 `target` 则只包含事件的实际目标。

如果直接将事件处理程序指定给了目标元素，则 `this`、`currentTarget` 和 `target` 包含相同的值。
:::

```javascript
var btn = document.getElementById("myBtn"); 
btn.onclick = function(event){ 
	alert(event.currentTarget === this); // true 
	alert(event.target === this); // true 
};
```

如果事件处理程序存在于按钮的父节点中（例如 `document.body`），那么这些值是不相同的。

```javascript
document.body.onclick = function(event){ 
	alert(event.currentTarget === document.body); //true 
	alert(this === document.body); //true 
	alert(event.target === document.getElementById("myBtn")); //true 
};
```

当单击这个例子中的按钮时，`this` 和 `currentTarget` 都等于 `document.body`，因为事件处理程序是注册到这个元素上的。然而，`target` 元素却等于按钮元素，因为它是 `click` 事件真正的目标。

:::tip
简单的理解就是`currentTarget`保存着事件的真实注册者，`target`保存着事件触发的目标。
:::

**要阻止特定事件的默认行为，可以使用 `preventDefault()`方法。另外，`stopPropagation()`方法用于立即停止事件在 `DOM` 层次中的传播，即取消进一步的事件捕获或冒泡。**

:::tip
事件对象的 `eventPhase` 属性，可以用来确定事件当前正位于事件流的哪个阶段。
:::

- 如果是在`捕获阶段`调用的事件处理程序，那么`eventPhase` 等于 1；
- 如果事件处理程序处于`目标对象`上，则 `eventPhase` 等于 2；
- 如果是在`冒泡阶段`调用的事件处理程序，`eventPhase` 等于 3。

:::warning
这里要注意的是，尽管“处于目标”发生在冒泡阶段，但 `eventPhase` 仍然一直等于 2。
:::

```javascript
var btn = document.getElementById("myBtn"); 
btn.onclick = function(event){ 
 	alert(event.eventPhase); // 2 
}; 
document.body.addEventListener("click", function(event){ 
 	alert(event.eventPhase); // 1 
}, true); 
document.body.onclick = function(event){ 
 	alert(event.eventPhase); // 3 
};

// 1————>2————>3
```

## 事件类型

`Web` 浏览器中可能发生的事件有很多类型。如前所述，不同的事件类型具有不同的信息，而“`DOM3级事件`”规定了以下几类事件。

- `UI（User Interface，用户界面）事件`，当用户与页面上的元素交互时触发；
- `焦点事件`，当元素获得或失去焦点时触发；
- `鼠标事件`，当用户通过鼠标在页面上执行操作时触发；
- `滚轮事件`，当使用鼠标滚轮（或类似设备）时触发；
- `文本事件`，当在文档中输入文本时触发；
- `键盘事件`，当用户通过键盘在页面上执行操作时触发；
- `合成事件`，当为 `IME（Input Method Editor，输入法编辑器）`输入字符时触发；
- `变动（mutation）事件`，当底层 `DOM`结构发生变化时触发。

### UI事件

- `load`：当页面完全加载后在 `window 上面触发`，当所有框架都加载完毕时在框架集上面触发,当图像加载完毕时在`<img>`元素上面触发，或者当嵌入的内容加载完毕时在`<object>`元素上面触发。

- `unload`：当页面完全卸载后在 `window` 上面触发，当所有框架都卸载后在框架集上面触发，或者当嵌入的内容卸载完毕后在`<object>`元素上面触发。**只要用户从一个页面切换到另一个页面，就会发生 `unload`事件**。

- `abort`：在用户停止下载过程时，如果嵌入的内容没有加载完，则在`<object>`元素上面触发。

- `error`：当发生 `JavaScript` 错误时在 `window` 上面触发，当无法加载图像时在`<img>`元素上面触发，当无法加载嵌入内容时在`<object>`元素上面触发，或者当有一或多个框架无法加载时在框架集上面触发。

- `select`：当用户选择文本框（`<input>`或`<texterea>`）中的一或多个字符时触发。

- `resize`：当窗口或框架的大小变化时在 `window`或框架上面触发。

- `scroll`：当用户滚动带滚动条的元素中的内容时，在该元素上面触发。`<body>`元素中包含所加载页面的滚动条。

### 键盘事件

![键盘事件表1](https://img-blog.csdnimg.cn/20200118170047850.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

![键盘事件表2](https://img-blog.csdnimg.cn/20200118170127834.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

###  hashchange 事件

`HTML5` 新增了 `hashchange` 事件，以便在 `URL` 的参数列表（及 URL 中“#”号后面的所有字符串）发生变化时通知开发人员。

```javascript
EventUtil.addHandler(window, "hashchange", function(event){ 
	alert("Current hash: " + location.hash);
 	alert("Old URL: " + event.oldURL + "\nNew URL: " + event.newURL); 
});
```

### orientationchange 事件

苹果公司为移动 `Safari` 中添加了 `orientationchange` 事件，以便开发人员能够确定用户何时将设备由横向查看模式切换为纵向查看模式。

移动 Safari 的 `window.orientation`属性中可能包含 如下值：
-	0 表示肖像模式，
-	90 表示向左旋转的横向模式（“主屏幕”按钮在右侧），
-	-90 表示向右旋转的横向模式（“主屏幕”按钮在左侧）。
-   180 表示 iPhone 头朝下；

![iphoneOrienttation](https://img-blog.csdnimg.cn/20200118171048812.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

###  deviceorientation 事件

`deviceorientation` 事件的意图是告诉开发人员设备在空间中朝向哪儿，而不是如何移动。

### 触摸事件

- `touchstart`：当手指触摸屏幕时触发；即使已经有一个手指放在了屏幕上也会触发。
- `touchmove`：当手指在屏幕上滑动时连续地触发。在这个事件发生期间，调用`preventDefault()`可以阻止滚动。
- `touchend`：当手指从屏幕上移开时触发。
- `touchcancel`：当系统停止跟踪触摸时触发。

上面这几个事件都会冒泡，也都可以取消。虽然这些触摸事件没有在 `DOM` 规范中定义，但它们却是以兼容 DOM 的方式实现的。

除了常见的 `DOM` 属性外，触摸事件还包含下列三个用于跟踪触摸的属性。
- `touches`：表示当前跟踪的触摸操作的 `Touch` 对象的数组。
- `targetTouchs`：特定于事件目标的 `Touch` 对象的数组。
- `changeTouches`：表示自上次触摸以来发生了什么改变的 `Touch` 对象的数组。

:::tip
**在触摸屏幕上的元素时，这些事件（包括鼠标事件）发生的顺序如下：**

1. `touchstart `
2. `mouseover `
3. `mousemove`（一次）
4. `mousedown `
5.  `mouseup `
6.  `click `
7. `touchend`
:::

### 手势事件

iOS 2.0 中的 `Safari` 还引入了一组手势事件。当两个手指触摸屏幕时就会产生手势，手势通常会改变显示项的大小，或者旋转显示项。有三个手势事件，分别介绍如下：

-  `gesturestart`：当一个手指已经按在屏幕上而另一个手指又触摸屏幕时触发。
-  `gesturechange`：当触摸屏幕的任何一个手指的位置发生变化时触发。
-  `gestureend`：当任何一个手指从屏幕上面移开时触发。

&emsp;&emsp;只有两个手指都触摸到事件的接收容器时才会触发这些事件。在一个元素上设置事件处理程序，意味着两个手指必须同时位于该元素的范围之内，才能触发手势事件（这个元素就是目标）。

&emsp;&emsp;由于这些`事件冒泡`，所以将事件处理程序放在文档上也可以处理所有手势事件。此时，事件的目标就是两个手指都位于其范围内的那个元素。

&emsp;&emsp;触摸事件和手势事件之间存在某种关系。当一个手指放在屏幕上时，会触发 `touchstart` 事件。如果另一个手指又放在了屏幕上，则会先触发 `gesturestart` 事件，随后触发基于该手指的 `touchstart`事件。如果一个或两个手指在屏幕上滑动，将会触发 `gesturechange` 事件。但只要有一个手指移开，就会触发 `gestureend` 事件，紧接着又会触发基于该手指的 `touchend` 事件。

## 事件委托

:::tip
对“事件处理程序过多”问题的解决方案就是`事件委托`。事件委托利用了`事件冒泡`，只指定一个事件处理程序，就可以管理某一类型的所有事件。
:::

:::warning
在使用事件时，需要考虑如下一些内存与性能方面的问题。
1. 有必要限制一个页面中事件处理程序的数量，数量太多会导致占用大量内存，而且也会让用户感觉页面反应不够灵敏。
2. 建立在事件冒泡机制之上的`事件委托`技术，可以有效地减少事件处理程序的数量。
3. 建议在浏览器卸载页面之前移除页面中的所有事件处理程序。
:::