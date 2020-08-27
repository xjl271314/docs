# 爬虫利器 Puppeteer 实战

- 2020.06.28

> `Puppeteer`是一个`Node.js库`,用于操控浏览器的爬虫神器，支持调用Chrome的API来操纵Web，相比较`Selenium`或是`PhantomJs`,它最大的特点就是它的操作Dom可以完全在内存中进行模拟既在V8引擎中处理而不打开浏览器[github地址](https://github.com/puppeteer/puppeteer)。

## 使用场景

- 对网页截屏生成PDF、图片等
- 爬取SPA应用，并生成预渲染内容（即“SSR” 服务端渲染）
- 可以从网站抓取内容
- 自动化表单提交、UI测试、键盘输入等
- 帮你创建一个最新的自动化测试环境（chrome），可以直接在此运行测试用例
- 捕获站点的时间线，以便追踪你的网站，帮助分析网站性能问题
- 测试Chrome的扩展程序

## 安装

```js
npm i puppeteer
# yarn add puppeteer
```

:::tip
由于封网，直接下载 `Chromium` 可能会失败，可以先阻止下载 `Chromium` 然后再手动下载它.

```js
# 安装命令
npm i puppeteer --save

# 错误信息
ERROR: Failed to download Chromium r515411! Set "PUPPETEER_SKIP_CHROMIUM_DOWNLOAD" env variable to skip download.

# 设置环境变量跳过下载 Chromium
set PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=1 

# 或者可以这样干，只下载模块而不build
npm i --save puppeteer --ignore-scripts

# 成功安装模块
+ puppeteer@5.2.1
added 1 package in 1.77s
```
:::

手动下载 `Chromium`，下载完后将压缩包解压，会有个 `Chromium.app`，将其放在自定义路径下，正常安装包后 `Chromium.app` 会在 `.local-chromium中`。


## 使用 `Puppeteer`进行屏幕截图

相关知识点:

- `puppeteer.launch` 启动浏览器实例
- `browser.newPage()` 创建一个新页面
- `page.goto` 进入指定网页
- `page.screenshot` 进行截图

```js
const puppeteer = require('puppeteer');

(async () => {
  const browser = await (puppeteer.launch({
    // 若是手动下载的chromium需要指定chromium地址, 默认引用地址为 /项目目录/node_modules/puppeteer/.local-chromium/
    executablePath: '/Users/...',
    //设置超时时间
    timeout: 15000,
    //如果是访问https页面 此属性会忽略https错误
    ignoreHTTPSErrors: true,
    // 打开开发者工具, 当此值为true时, headless总为false
    devtools: false,
    // 关闭headless模式, 不会打开浏览器
    headless: false
  }));
  const page = await browser.newPage();
  await page.goto('https://www.baidu.com');
  await page.screenshot({
    path: 'baidu.png',
    type: 'png',
    // quality: 100, 只对jpg有效
    fullPage: true,
    // 指定区域截图，clip和fullPage两者只能设置一个
    // clip: {
    //   x: 0,
    //   y: 0,
    //   width: 1000,
    //   height: 40
    // }
  });
  browser.close();
})();
```