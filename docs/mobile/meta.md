# meta标签

**移动端不进行缩放**

```html 
<meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no,viewport-fit=cover" />
```

**网页关键字 (SEO)**

```html
<meta name="keywords"  content="bolg" />
```

**网页描述 (SEO)**

```html
<meta name="description"  content="xjl's blog"/>
```

**标注网页的作者或制作组**

```html
<meta name="author"  content="xjl" />
```

**标注版权**

```html
 <meta name='Copyright'  content='xjl'/>
```

**http-equiv设定网页的到期时间。一旦网页过期，必须到服务器上重新传输**

```html
<meta http-equiv="expires" content="Fri,12Jan201918:18:18GMT"/>
```

**自动刷新并指向新页面。其中的1是指停留1秒钟后自动刷新到URL网址**
```html
<meta http-equiv="Refresh" content="1;URL=https://baidu.com"/>
```

**设定显示语言**
```html
<meta http-equiv=" content-Language" content="zh-cn"/> 
```

**IOS设置添加到主屏幕后的标题**
```html
<meta name="apple-mobile-web-app-title" content="myApp"/>
```

**是否启用 WebApp 全屏模式，删除苹果默认的工具栏和菜单栏**
```html
<meta name="apple-mobile-web-app-capable" content="yes"/>
```

**IOS添加到主屏幕“后，全屏显示**
```html
<meta name="apple-touch-fullscreen" content="yes"/>
```

**设置苹果工具栏颜色**
```html
<meta name="apple-mobile-web-app-status-bar-style" content="#00adb5"/>
```

**QQ、X5内核强制竖屏**
```html
<meta name="x5-orientation" content="portrait"/>
```

**QQ、X5内核强制全屏**
```html
<meta name="x5-fullscreen" content="true"/>
```

**QQ应用模式**
```html
<meta name="x5-page-mode" content="app"/>
```

**UC强制竖屏、Android 禁止屏幕旋转**
```html
<meta name="screen-orientation" content="portrait"/>
```

**UC强制全屏**
```html
<meta name="full-screen" content="yes"/>
```

**UC应用模式**
```html
<meta name="browsermode" content="application"/>
```

**双内核浏览器优先加载webkit内核**
```html
<!-- 强制Chromium内核，作用于360浏览器、QQ浏览器等国产双核浏览器 -->
<meta name="renderer" content="webkit"/>
<!-- 强制Chromium内核，作用于其他双核浏览器 -->
<meta name="force-rendering" content="webkit"/>
<!-- 如果有安装 Google Chrome Frame 插件则强制为Chromium内核，否则强制本机支持的最高版本IE内核，作用于IE浏览器 -->
<meta http-equiv="X-UA-Compatible" content="IE=Edge,chrome=1"/>
```

**双内核浏览器优先加载IE兼容模式**
```html
<meta name="renderer" content="ie-comp"/>
```

**禁用苹果上的电话号码识别、安卓上的邮箱识别**
```html
<meta name="format-detection" content="telephone=no,email=no" />
```

**删除苹果默认的工具栏和菜单栏**

```html
<meta name="apple-mobile-web-app-capable" content="yes">
```

**设置苹果工具栏颜色**

```html
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
```


**默认使用最新浏览器,改变360兼容模式下以何种版本的IE去渲染页面**

```html
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
```

**不被网页(加速)转码**

```html
<meta http-equiv="Cache-Control" content="no-siteapp">
```