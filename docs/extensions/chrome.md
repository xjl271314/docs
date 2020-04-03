# 从零开始开发一个Chrome插件

- 2020-04-02

##  什么是Chrome插件

> Chrome插件是一个用Web技术开发、用来增强浏览器功能的软件，它其实就是一个由HTML、CSS、JS、图片等资源组成的一个.crx后缀的压缩包.

严格来讲，我们正在说的东西应该叫`Chrome扩展(Chrome Extension)`，真正意义上的`Chrome插件`是更底层的浏览器功能扩展，可能需要对浏览器源码有一定掌握才有能力去开发。

## 为什么需要去开发插件

虽然chrome本身已经给我们提供了很多实用的API,但是特定场景下我们可能还需要一些自己常用的定制化浏览器功能，如果能够掌握开发插件的能力，那是再好不过了。


## 开发与调试

`Chrome插件`没有严格的项目结构要求，只要保证本目录有一个`manifest.json`即可。

### 访问:

从右上角菜单->更多工具->扩展程序可以进入 插件管理页面，也可以直接在地址栏输入 `chrome://extensions` 访问。

![开发者模式](https://img-blog.csdnimg.cn/20200403133700704.png)

勾选开发者模式即可以文件夹的形式直接加载插件，否则只能安装`.crx`格式的文件。`Chrome`要求插件必须从它的`Chrome应用商店`安装，其它任何网站下载的都无法直接安装，所以，其实我们可以把`crx`文件解压，然后通过`开发者模式`直接加载。

## 核心概念

### manifest.json

> 这是一个Chrome插件最重要也是必不可少的文件，用来配置所有和插件相关的配置，必须放在根目录。

其中，`manifest_version`、`name`、`version`3个是必不可少的，`description`和`icons`是推荐的。完整的地址可以查看[这里](https://developer.chrome.com/extensions/manifest)

```js
{
    /* ----必须要有的参数(开始)-----*/
	// 清单文件的版本，这个必须写，而且必须是2
	"manifest_version": 2,
	// 插件的名称
	"name": "extensionName",
	// 插件的版本
    "version": "1.0.0",
    /* ----可选的参数(开始)-----*/
	// 插件描述
	"description": "extension description",
	// 图标，一般偷懒全部用一个尺寸的也没问题
	"icons":
	{
		"16": "img/icon.png",
		"48": "img/icon.png",
		"128": "img/icon.png"
	},
	// 会一直常驻的后台JS或后台页面
	"background":
	{
		// 2种指定方式，如果指定JS，那么会自动生成一个背景页
		"page": "background.html"
		//"scripts": ["js/background.js"]
	},
	// 浏览器右上角图标设置，browser_action、page_action、app必须三选一
	"browser_action": 
	{
		"default_icon": "img/icon.png",
		// 图标悬停时的标题，可选
		"default_title": "这是一个示例Chrome插件",
		"default_popup": "popup.html"
	},
	// 当某些特定页面打开才显示的图标
	"page_action":
	{
		"default_icon": "img/icon.png",
		"default_title": "我是pageAction",
		"default_popup": "popup.html"
	},
	// 需要直接注入页面的JS
	"content_scripts": 
	[
		{
			//"matches": ["http://*/*", "https://*/*"],
			// "<all_urls>" 表示匹配所有地址
			"matches": ["<all_urls>"],
			// 多个JS按顺序注入
			"js": ["js/jquery-1.8.3.js", "js/content-script.js"],
			// JS的注入可以随便一点，但是CSS的注意就要千万小心了，因为一不小心就可能影响全局样式
			"css": ["css/custom.css"],
			// 代码注入的时间，可选值： "document_start", "document_end", or "document_idle"，最后一个表示页面空闲时，默认document_idle
			"run_at": "document_start"
		},
		// 这里仅仅是为了演示content-script可以配置多个规则
		{
			"matches": ["*://*/*.png", "*://*/*.jpg", "*://*/*.gif", "*://*/*.bmp"],
			"js": ["js/show-image-content-size.js"]
		}
	],
	// 权限申请
	"permissions":
	[
		"contextMenus", // 右键菜单
		"tabs", // 标签
		"notifications", // 通知
		"webRequest", // web请求
		"webRequestBlocking",
		"storage", // 插件本地存储
		"http://*/*", // 可以通过executeScript或者insertCSS访问的网站
		"https://*/*" // 可以通过executeScript或者insertCSS访问的网站
	],
	// 普通页面能够直接访问的插件资源列表，如果不设置是无法直接访问的
	"web_accessible_resources": ["js/inject.js"],
	// 插件主页，这个很重要，不要浪费了这个免费广告位
	"homepage_url": "https://www.baidu.com",
	// 覆盖浏览器默认页面
	"chrome_url_overrides":
	{
		// 覆盖浏览器默认的新标签页
		"newtab": "newtab.html"
	},
	// Chrome40以前的插件配置页写法
	"options_page": "options.html",
	// Chrome40以后的插件配置页写法，如果2个都写，新版Chrome只认后面这一个
	"options_ui":
	{
		"page": "options.html",
		// 添加一些默认的样式，推荐使用
		"chrome_style": true
	},
	// 向地址栏注册一个关键字以提供搜索建议，只能设置一个关键字
	"omnibox": { "keyword" : "go" },
	// 默认语言
	"default_locale": "zh_CN",
	// devtools页面入口，注意只能指向一个HTML文件，不能是JS文件
	"devtools_page": "devtools.html"
}
```

### content-scripts

> `content-scripts`，其实就是`Chrome插件`中向页面注入脚本的一种形式（虽然名为`script`，其实还可以包括`css`的），借助`content-scripts`我们可以实现通过配置的方式轻松向指定页面注入`JS`和`CSS`（如果需要动态注入，可以参考下文），最常见的比如：广告屏蔽、页面CSS定制，等等。

```js
{
	// 需要直接注入页面的JS
	"content_scripts": 
	[
		{
			//"matches": ["http://*/*", "https://*/*"],
			// "<all_urls>" 表示匹配所有地址
			"matches": ["<all_urls>"],
			// 多个JS按顺序注入
			"js": ["js/jquery-1.8.3.js", "js/content-script.js"],
			// JS的注入可以随便一点，但是CSS的注意就要千万小心了，因为一不小心就可能影响全局样式
			"css": ["css/custom.css"],
			// 代码注入的时间，可选值： "document_start", "document_end", or "document_idle"，最后一个表示页面空闲时，默认document_idle
			"run_at": "document_start"
		}
	],
}
```
:::warning
特别注意，如果没有主动指定`run_at`为`document_start`（默认为`document_idle`），下面这种代码是不会生效的：
```js
document.addEventListener('DOMContentLoaded', function()
{
	console.log('我被执行了！');
});
```
:::

`content-scripts`和原始页面共享`DOM`，但是不共享`JS`，如要访问页面`JS`（例如某个JS变量），只能通过`injected js`来实现。

**`content-scripts`不能访问绝大部分`chrome.xxx.api`，除了下面这4种：**

1. chrome.extension(getURL , inIncognitoContext , lastError , onRequest , sendRequest)

2. chrome.i18n

3. chrome.runtime(connect , getManifest , getURL , id , onConnect , onMessage , sendMessage)

4. chrome.storage

其实看到这里不要悲观，这些API绝大部分时候都够用了，非要调用其它API的话，你还可以通过通信来实现让`background`来帮你调用。

### background

> 一个隐藏的后台控制中心,它的生命周期是插件中所有类型页面中最长的，它随着浏览器的打开而打开，随着浏览器的关闭而关闭，所以通常把需要一直运行的、启动就运行的、全局的代码放在`background`里面。

:::tip
`background`的权限非常高，几乎可以调用所有的`Chrome扩展API`（除了devtools），而且它可以无限制跨域，也就是可以跨域访问任何网站而无需要求对方设置CORS。

经过测试，其实不止是`background`，所有的直接通过`chrome-extension://id/xx.html`这种方式打开的网页都可以无限制跨域。
:::

配置中，`background`可以通过`page`指定一张网页，也可以通过`scripts`直接指定一个`JS`，`Chrome`会自动为这个`JS`生成一个默认的网页：

```js
{
	// 会一直常驻的后台JS或后台页面
	"background":
	{
		// 2种指定方式，如果指定JS，那么会自动生成一个背景页
		"page": "background.html"
		//"scripts": ["js/background.js"]
	},
}
```

:::warning
虽然你可以通过`chrome-extension://xxx/background.html`直接打开后台页，但是你打开的后台页和真正一直在后台运行的那个页面不是同一个，换句话说，你可以打开无数个`background.html`，但是真正在后台常驻的只有一个，而且这个你永远看不到它的界面，只能调试它的代码。
:::

### event-pages

> `event-pages`是一个什么东西呢？鉴于`background`生命周期太长，长时间挂载后台可能会影响性能，所以`Google`又弄一个`event-pages`，在配置文件上，它与`background`的唯一区别就是多了一个`persistent`参数：

```js
{
	"background":
	{
		"scripts": ["event-page.js"],
		"persistent": false
	},
}
```

它的生命周期是：在被需要时加载，在空闲时被关闭，什么叫被需要时呢？比如第一次安装、插件更新、有`content-script`向它发送消息，等等。

除了配置文件的变化，代码上也有一些细微变化，个人这个简单了解一下就行了，一般情况下`background`也不会很消耗性能的。

### popup

> `popup`是点击`browser_action`或者`page_action`图标时打开的一个小窗口网页，焦点离开网页就立即关闭，一般用来做一些临时性的交互。

`popup`可以包含任意你想要的HTML内容，并且会自适应大小。可以通`default_popup`字段来指定`popup`页面，也可以调用`setPopup()`方法。

```js
{
	"browser_action":
	{
		"default_icon": "img/icon.png",
		// 图标悬停时的标题，可选
		"default_title": "这是一个示例Chrome插件",
		"default_popup": "popup.html"
	}
}
```

:::warning
需要特别注意的是，由于单击图标打开`popup`，焦点离开又立即关闭，所以popup页面的生命周期一般很短，需要长时间运行的代码千万不要写在popup里面。

在权限上，它和`background`非常类似，它们之间最大的不同是生命周期的不同，`popup`中可以直接通过`chrome.extension.getBackgroundPage()`获取`background`的window对象。
:::

### injected-script

> 使用`content-script`有一个很大的“缺陷”，也就是无法访问页面中的JS，虽然它可以操作`DOM`，但是`DOM`却不能调用它，也就是无法在`DOM`中通过绑定事件的方式调用`content-script`中的代码（包括直接写`onclick`和`addEventListener`2种方式都不行），但是，“在页面上添加一个按钮并调用插件的扩展API”是一个很常见的需求，那该怎么办呢？其实这就是本小节要讲的。

在`content-script`中通过`DOM`方式向页面注入`inject-script`代码示例：

```js
// 向页面注入JS
function injectCustomJs(jsPath)
{
	jsPath = jsPath || 'js/inject.js';
	var temp = document.createElement('script');
	temp.setAttribute('type', 'text/javascript');
	// 获得的地址类似：chrome-extension://ihcokhadfjfchaeagdoclpnjdiokfakg/js/inject.js
	temp.src = chrome.extension.getURL(jsPath);
	temp.onload = function(){
		// 放在页面不好看，执行完后移除掉
		this.parentNode.removeChild(this);
	};
	document.head.appendChild(temp);
}
```

你以为这样就行了？执行一下你会看到如下报错：

```js
Denying load of chrome-extension://efbllncjkjiijkppagepehoekjojdclc/js/inject.js. Resources must be listed in the web_accessible_resources manifest key in order to be loaded by pages outside the extension.
``

意思就是你想要在web中直接访问插件中的资源的话必须显示声明才行，配置文件中增加如下：

```js
{
	// 普通页面能够直接访问的插件资源列表，如果不设置是无法直接访问的
	"web_accessible_resources": ["js/inject.js"],
}
```

### homepage_url

> 开发者或者插件主页设置


## Chrome插件的8种展示形式

### browserAction(浏览器右上角)

通过配置`browser_action`可以在浏览器的右上角增加一个图标，一个`browser_action`可以拥有一个图标，一个`tooltip`，一个`badge`和一个`popup`。

示例配置如下:
```js
"browser_action":
{
	"default_icon": "img/icon.png",
	"default_title": "这是一个示例Chrome插件",
	"default_popup": "popup.html"
}
```

- 图标

`browser_action`图标推荐使用宽高都为`19`像素的图片，更大的图标会被缩小，格式随意，一般推荐`png`，可以通过`manifest`中`default_icon`字段配置，也可以调用`setIcon()`方法。

- tooltip

修改`browser_action`的`manifest中default_title`字段，或者调用`setTitle()`方法。

- badge

所谓`badge`就是在图标上显示一些文本，可以用来更新一些小的扩展状态提示信息。因为badge空间有限，所以只支持4个以下的字符（英文4个，中文2个）。

`badge`无法通过配置文件来指定，必须通过代码实现，设置`badge`文字和颜色可以分别使用`setBadgeText()`和`setBadgeBackgroundColor()`。

```js
chrome.browserAction.setBadgeText({text: 'new'});
chrome.browserAction.setBadgeBackgroundColor({color: [255, 0, 0, 255]});
```

### pageAction(地址栏右侧)

所谓`pageAction`，指的是只有当某些特定页面打开才显示的图标，它和`browserAction`最大的区别是一个始终都显示，一个只在特定情况才显示。

新版的Chrome，`pageAction`和普通的`browserAction`一样也是放在浏览器右上角，只不过没有点亮时是灰色的，点亮了才是彩色的，灰色时无论左键还是右键单击都是弹出选项,调整之后的`pageAction`我们可以简单地把它看成是可以置灰的`browserAction`。

![pageAction](https://img-blog.csdnimg.cn/20200403153516224.png)


```js
chrome.pageAction.show(tabId) 显示图标；
chrome.pageAction.hide(tabId) 隐藏图标；
```

### 右键菜单

通过开发`Chrome`插件可以自定义浏览器的右键菜单，主要是通过`chrome.contextMenusAPI`实现，右键菜单可以出现在不同的上下文，比如普通页面、选中的文字、图片、链接，等等，如果有同一个插件里面定义了多个菜单，Chrome会自动组合放到以插件名字命名的二级菜单里

最简单的右键菜单示例:

```js
// manifest.json
{"permissions": ["contextMenus"]}

// background.js
chrome.contextMenus.create({
	title: "测试右键菜单",
	onclick: function(){alert('您点击了右键菜单！');}
});
```

### override(覆盖特定页面)

> 使用`override`页可以将`Chrome`默认的一些特定页面替换掉，改为使用扩展提供的页面。

扩展可以替代如下页面：

历史记录：从工具菜单上点击历史记录时访问的页面，或者从地址栏直接输入 chrome://history
新标签页：当创建新标签的时候访问的页面，或者从地址栏直接输入 chrome://newtab
书签：浏览器的书签，或者直接输入 chrome://bookmarks

:::warning
一个扩展只能替代一个页面；

不能替代隐身窗口的新标签页；

网页必须设置title，否则用户可能会看到网页的URL，造成困扰；
:::

```js
"chrome_url_overrides":
{
	"newtab": "newtab.html",
	"history": "history.html",
	"bookmarks": "bookmarks.html"
}
```

### 桌面通知

hrome提供了一个chrome.notificationsAPI以便插件推送桌面通知，暂未找到chrome.notifications和HTML5自带的Notification的显著区别及优势。

在后台JS中，无论是使用chrome.notifications还是Notification都不需要申请权限（HTML5方式需要申请权限），直接使用即可。

```js
chrome.notifications.create(null, {
	type: 'basic',
	iconUrl: 'img/icon.png',
	title: '这是标题',
	message: '您刚才点击了自定义右键菜单！'
});
```

## 5种类型的JS对比

Chrome插件的JS主要可以分为这5类：`injected script`、`content-script`、`popup js`、`background js`和`devtools js`。

**权限对照表:**

| JS类型 | 可访问的API | DOM访问情况 | 是否支持JS访问 | 是否支持跨域 
|:--------|:--------| :--------| :--------| :--------|  
|`injected script`|	和普通JS无任何差别，不能访问任何扩展API |	直接访问 |	是	 |否
|`content script`|	只能访问 extension、runtime等部分API |	直接访问 |	否 |	否
|`popup js`|	可访问绝大部分API，除了devtools系列	| 不可直接访问 |	否 |	是
|`background js`|	可访问绝大部分API，除了devtools系列	| 不可直接访问 |	否 |	是
|`devtools js`|	只能访问 devtools、extension、runtime等部分API |	直接访问 |	是 |	否

## 消息通信

[完整文档地址](https://developer.chrome.com/extensions/messaging)


**互相通信概览表:**

| | injected-script | content-script | popup-js | background-js | 
|:--------|:--------| :--------| :--------| :--------|  
|`injected script`|	\ |	window.postMessage | \ | \
|`content script`|	window.postMessage | \ | chrome.runtime.sendMessage chrome.runtime.connect |	chrome.runtime.sendMessage chrome.runtime.connect |
|`popup js`| \ | chrome.tabs.sendMessage chrome.tabs.connect | \ |	chrome.extension. getBackgroundPage()
|`background js`| \ | chrome.tabs.sendMessage chrome.tabs.connect |	chrome.extension.getViews |	\
|`devtools js`|	chrome.devtools. inspectedWindow.eval |	\ |	chrome.runtime.sendMessage | chrome.runtime.sendMessage

## 长连接和短连接

> Chrome插件中有2种通信方式，一个是`短连接（chrome.tabs.sendMessage和chrome.runtime.sendMessage）`，一个是`长连接（chrome.tabs.connect和chrome.runtime.connect）`。

短连接的话就是挤牙膏一样，我发送一下，你收到了再回复一下，如果对方不回复，你只能重新发，而长连接类似`WebSocket`会一直建立连接，双方可以随时互发消息。

```JS
// popup.js
getCurrentTabId((tabId) => {
	var port = chrome.tabs.connect(tabId, {name: 'test-connect'});
	port.postMessage({question: '你是谁啊？'});
	port.onMessage.addListener(function(msg) {
		alert('收到消息：'+msg.answer);
		if(msg.answer && msg.answer.startsWith('我是'))
		{
			port.postMessage({question: '哦，原来是你啊！'});
		}
	});
});

// content-script.js
// 监听长连接
chrome.runtime.onConnect.addListener(function(port) {
	console.log(port);
	if(port.name == 'test-connect') {
		port.onMessage.addListener(function(msg) {
			console.log('收到长连接消息：', msg);
			if(msg.question == '你是谁啊？') port.postMessage({answer: '我是你爸！'});
		});
	}
});
```

## 动态注入或执行JS

虽然在`background`和`popup`中无法直接访问页面DOM，但是可以通过chrome.tabs.executeScript来执行脚本，从而实现访问web页面的DOM（注意，这种方式也不能直接访问页面JS）。

```js
// manifest.json
{
	"name": "动态JS注入演示",
	...
	"permissions": [
		"tabs", "http://*/*", "https://*/*"
	],
	...
}

// 动态执行JS代码
chrome.tabs.executeScript(tabId, {code: 'document.body.style.backgroundColor="red"'});
// 动态执行JS文件
chrome.tabs.executeScript(tabId, {file: 'some-script.js'});

```

## 动态注入CSS

```js
// manifest.json
{
	"name": "动态CSS注入演示",
	...
	"permissions": [
		"tabs", "http://*/*", "https://*/*"
	],
	...
}

// 动态执行CSS代码，TODO
chrome.tabs.insertCSS(tabId, {code: 'xxx'});
// 动态执行CSS文件
chrome.tabs.insertCSS(tabId, {file: 'some-style.css'});
```

## 获取当前窗口ID

```js
chrome.windows.getCurrent(function(currentWindow)
{
	console.log('当前窗口ID：' + currentWindow.id);
});
```

## 获取当前标签页ID

```js
// 方式一
function getCurrentTabId(callback)
{
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs)
	{
		if(callback) callback(tabs.length ? tabs[0].id: null);
	});
}

// 方式二
function getCurrentTabId2()
{
	chrome.windows.getCurrent(function(currentWindow)
	{
		chrome.tabs.query({active: true, windowId: currentWindow.id}, function(tabs)
		{
			if(callback) callback(tabs.length ? tabs[0].id: null);
		});
	});
}
```

## 本地存储

本地存储建议用`chrome.storage`而不是普通的`localStorage`，区别有好几点，个人认为最重要的2点区别是：

1. `chrome.storage`是针对插件全局的，即使你在`background`中保存的数据，在`content-script`也能获取到；

2. `chrome.storage.sync`可以跟随当前登录用户自动同步，这台电脑修改的设置会自动同步到其它电脑，很方便，如果没有登录或者未联网则先保存到本地，等登录了再同步至网络；

需要声明`storage`权限，有`chrome.storage.sync`和`chrome.storage.local`2种方式可供选择，使用示例如下：

```js
// 读取数据，第一个参数是指定要读取的key以及设置默认值
chrome.storage.sync.get({color: 'red', age: 18}, function(items) {
	console.log(items.color, items.age);
});
// 保存数据
chrome.storage.sync.set({color: 'blue'}, function() {
	console.log('保存成功！');
});
```

## 国际化

插件根目录新建一个名为`_locales`的文件夹，再在下面新建一些语言的文件夹，如`en`、`zh_CN`、`zh_TW`，然后再在每个文件夹放入一个`messages.json`，同时必须在清单文件中设置`default_locale`。

```js
// en
{
	"pluginDesc": {"message": "A simple chrome extension demo"},
	"helloWorld": {"message": "Hello World!"}
}
// zh_CN
{
	"pluginDesc": {"message": "一个简单的Chrome插件demo"},
	"helloWorld": {"message": "你好啊，世界！"}
}
// 在manifest.json和CSS文件中通过__MSG_messagename__引入，如：
{
	"description": "__MSG_pluginDesc__",
	// 默认语言
	"default_locale": "zh_CN",
}

```

## 打包与发布

打包的话直接在插件管理页有一个打包按钮：

![打包示例](https://img-blog.csdnimg.cn/20200403172207484.png)

然后会生成一个`.crx`文件，要发布到`Google应用商店`的话需要先登录你的`Google账号`，然后花`5$`注册为开发者，本人太穷，就懒得亲自验证了，有发布需求的自己去整吧。