# 爬虫利器 Puppeteer 实战

- 2020.06.28

> `Puppeteer`是一个`Node.js库`,用于操控浏览器的爬虫神器，支持调用 Chrome 的 API 来操纵 Web，相比较`Selenium`或是`PhantomJs`,它最大的特点就是它的操作 Dom 可以完全在内存中进行模拟既在 V8 引擎中处理而不打开浏览器。

## 文档地址

[文档地址](https://zhaoqize.github.io/puppeteer-api-zh_CN/)

## github 地址

[github 地址](https://github.com/puppeteer/puppeteer)。

## 使用场景

- 对网页截屏生成 PDF、图片等
- 爬取 SPA 应用，并生成预渲染内容（即“SSR” 服务端渲染）
- 可以从网站抓取内容
- 自动化表单提交、UI 测试、键盘输入等
- 帮你创建一个最新的自动化测试环境（chrome），可以直接在此运行测试用例
- 捕获站点的时间线，以便追踪你的网站，帮助分析网站性能问题
- 测试 Chrome 的扩展程序

## 安装

```js
npm i puppeteer
# yarn add puppeteer
```

:::tip
由于封网，直接下载 `Chromium` 可能会失败，可以先阻止下载 `Chromium` 然后再手动下载它.

而且`Node.js` 的版本不能低于 `v7.6.0`，因为需要支持 `async、await`语法。

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

## 场景一：使用 `Puppeteer`进行屏幕截图

相关知识点:

- `puppeteer.launch` 启动浏览器实例
- `browser.newPage()` 创建一个新页面
- `page.goto` 进入指定网页
- `page.screenshot` 进行截图
- `browser.close()` 关闭 Chromium 及其所有页面

```js
const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch({
    // 若是手动下载的chromium需要指定chromium地址, 默认引用地址为 /项目目录/node_modules/puppeteer/.local-chromium/
    executablePath: "/Users/...",
    //设置超时时间，若此值为0，则禁用超时
    timeout: 15000,
    //如果是访问https页面 此属性会忽略https错误
    ignoreHTTPSErrors: true,
    // 打开开发者工具, 当此值为true时, headless总为false
    devtools: false,
    // 是否运行浏览器无头模式(boolean) 关闭headless模式, 不会打开浏览器
    headless: false,
  });
  const page = await browser.newPage();
  await page.goto("https://www.baidu.com");
  await page.screenshot({
    path: "baidu.png",
    type: "png",
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
  await browser.close();
})();
```

执行完以上代码，我们就可以在当前路径找到一张 `baidu.png`，大致上是长这么个样子:

![示例图片](https://img-blog.csdnimg.cn/20210520213825743.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

## 场景二：自动测试页面性能

`Web Performance` 接口允许页面中的 `JavaScript` 代码可以通过具体的函数测量当前网页页面或者 `Web` 应用的性能。为能在页面执行 `JavaScript` 从而来检测页面性能。

相关知识点:

- `page.evaluate(pageFunction[, ...args])` 在浏览器中执行此函数，返回一个 `Promise` 对象。

```js
const puppeteer = require("puppeteer");

// 检测页面url
const url = "https://www.baidu.com";
// 检测次数
const times = 5;
const record = [];

(async () => {
  for (let i = 0; i < times; i++) {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto(url);
    // 等待保证页面加载完成
    await page.waitFor(5000);

    // 获取页面的 window.performance 属性
    const timing = JSON.parse(
      await page.evaluate(() => JSON.stringify(window.performance.timing))
    );
    record.push(calculate(timing));
    await browser.close();
  }

  let whiteScreenTime = 0,
    requestTime = 0;

  for (let item of record) {
    whiteScreenTime += item.whiteScreenTime;
    requestTime += item.requestTime;
  }

  // 检测计算结果
  const result = [];
  result.push(url);
  result.push(`页面平均白屏时间为：${whiteScreenTime / times} ms`);
  result.push(`页面平均请求时间为：${requestTime / times} ms`);
  console.log(result);

  function calculate(timing) {
    const result = {};
    // 白屏时间
    result.whiteScreenTime = timing.responseStart - timing.navigationStart;
    // 请求时间
    result.requestTime = timing.responseEnd - timing.responseStart;
    return result;
  }
})();
```

## 场景三：搞定滑动解锁

许多网站中都存在着滑动验证码认证,我们可以使用`Puppeteer`进行模拟。

相关知识点:

- `CanvasRenderingContext2D.getImageData()` 返回一个 `ImageData` 对象，用来描述 `canvas` 区域隐含的像素数据

- `page.\$(selector)` 此方法在页面内执行 `document.querySelector`

- `page.mouse.down([options])` 触发一个 mousedown 事件

- `page.mouse.move([options])` 触发一个 mousemove 事件

- `page.mouse.up([options])` 触发一个 mouseup 事件

```js
const puppeteer = require('puppeteer');

(asyncfunction run() {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: {
      width: 1200,
      height: 600
    }
  });
  page = await browser.newPage();
  // 1.打开 bilibili 登录页面
  await page.goto('https://passport.bilibili.com/login');
  await page.waitFor(3000);

  // 3.输入账号密码
  await page.type('input#login-username','你的账号', { delay: 50 });
  await page.type('input#login-passwd','你的密码', { delay: 50 });

  // 4.点登陆按钮
  await page.click('.btn.btn-login');

  // 保证滑动弹窗加载出
  await page.waitFor(3000);

  // 获取像素差较大的最左侧横坐标
  const diffX = await page.evaluate(() => {
    const fullbg = document.querySelector('.geetest_canvas_fullbg'); // 完成图片
    const bg = document.querySelector('.geetest_canvas_bg'); // 带缺口图片
    const diffPixel = 40; // 像素差

    // 滑动解锁的背景图片的尺寸为 260*160
    // 拼图右侧离背景最左侧距离为 46px，故从 47px 的位置开始检测
    for(let i = 47; i < 260; i++) {
      for(let j = 1; j < 160; j++) {
        const fullbgData = fullbg.getContext("2d").getImageData(i, j, 1, 1).data;
        const bgData = bg.getContext("2d").getImageData(i, j, 1, 1).data;
        const red = Math.abs(fullbgData[0] - bgData[0]);
        const green = Math.abs(fullbgData[1] - bgData[1]);
        const blue = Math.abs(fullbgData[2] - bgData[2]);
        // 若找到两张图片在同样像素点中，red、green、blue 有一个值相差较大，即可视为缺口图片中缺口的最左侧横坐标位置
        if(red > diffPixel || green > diffPixel || blue > diffPixel) {
          return i;
        }
      }
    }
  });

  // 获取滑动按钮在页面中的坐标
  const dragButton = await page.$('.geetest_slider_button');
  const box = await dragButton.boundingBox();
  // 获取滑动按钮中心点位置
  const x = box.x + (box.width / 2);
  const y = box.y + (box.height / 2);

  // 鼠标滑动至滑动按钮中心点
  await page.mouse.move(x, y);
  // 按下鼠标
  await page.mouse.down();
  // 慢慢滑动至缺口位置,因起始位置有约 7px 的偏差，故终点值为 x + diffX - 7
  for (let i = x; i < x + diffX - 7; i = i + 5) {
    // 滑动鼠标
    await page.mouse.move(i, y);
  }
  // 假装有个停顿，看起来更像是人为操作
  await page.waitFor(200);
  // 放开鼠标
  await page.mouse.up();

  await page.waitFor(5000);
  await browser.close();
})();
```
