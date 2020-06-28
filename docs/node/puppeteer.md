# 爬虫利器 Puppeteer 实战

- 2020.06.28

> `Puppeteer`是一个`Node.js库`,用于操控浏览器的爬虫神器，[github地址](https://github.com/puppeteer/puppeteer)

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
+ puppeteer@0.13.0
added 1 package in 1.77s
```
:::

手动下载 `Chromium`，下载完后将压缩包解压，会有个 `Chromium.app`，将其放在自定义路径下，正常安装包后 `Chromium.app` 会在 `.local-chromium中`。


