# webpack

**本文所阐述的相关知识都是基于webpack4.x版本**

## 定义

> `webpack`是一个现代`JavasScript`应用程序的模块打包器(`module bunder`)

## 四个核心概念

- 入口(entry)
- 输出(output)
- loader
- 插件(plugins)

### 入口

> 指示 `webpack` 应该使用哪个模块，来作为构建其内部依赖图的开始。Webpack执行构建的第一步将从 入口开始，搜寻及递归解析出所有入口依赖的模块。

```js
// 最简单的单入口文件
module.exports = {
  entry: './path/to/my/entry/file.js'
};

// entry 属性的单个入口语法，是下面的简写：
const config = {
  entry: {
    main: './path/to/my/entry/file.js'
  }
};
module.exports = config
```

### 出口

> `output` 属性告诉 `webpack` 在哪里输出它所创建的 `bundles`，以及如何命名这些文件，默认值为 `./dist`。基本上，整个应用程序结构，都会被编译到你指定的输出路径的文件夹中。你可以通过在配置中指定一个 `output` 字段，来配置这些处理过程：

```js
// 简单的单入口 单出口配置
const path = require('path');

module.exports = {
  entry: './path/to/my/entry/file.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'my-first-webpack.bundle.js'
  }
};
```

### loader

> `loader` 让 `webpack` 能够去处理那些非 `JavaScript` 文件（`webpack` 自身只理解 `JavaScript`）。`loader` 可以将所有类型的文件转换为 `webpack` 能够处理的有效模块，然后你就可以利用 `webpack` 的打包能力，对它们进行处理。

本质上，`webpack loader` 将所有类型的文件，转换为应用程序的依赖图（和最终的 `bundle`）可以直接引用的模块。

:::tip
在 `webpack` 的配置中 `loader` 有两个目标：

- `test` 属性，用于标识出应该被对应的 `loader` 进行转换的某个或某些文件。
- `use` 属性，表示进行转换时，应该使用哪个 `loader`。
:::

```js
// 简单的loader配置
const path = require('path');

const config = {
  output: {
    filename: 'my-first-webpack.bundle.js'
  },
  module: {
    rules: [
      { test: /\.txt$/, use: 'raw-loader' },
      {
        test: /\.js$/, //匹配所有的js文件
        exclude: /node_modules/,//除了node_modules以外
       },
      // 配置css loaders
      { test: /\.css$/, use: ['style-loader', 'css-loader'] },
      { test: /\.less$/, use: ['style-loader', 'css-loader', 'less-loader'] },
      { test: /\.scss$/, use: ['style-loader', 'css-loader', 'sass-loader'] }
    ]
  }
};

module.exports = config;
```
### loader 特性
1. loader 支持链式传递。能够对资源使用流水线(pipeline)。一组链式的 loader 将按照相反的顺序执行。loader 链中的第一个 loader 返回值给下一个 loader。在最后一个 loader，返回 webpack 所预期的 JavaScript。

2. loader 可以是同步的，也可以是异步的。

3. loader 运行在 Node.js 中，并且能够执行任何可能的操作。

4. loader 接收查询参数。用于对 loader 传递配置。

5. loader 也能够使用 options 对象进行配置。

6. 除了使用 package.json 常见的 main 属性，还可以将普通的 npm 模块导出为 loader，做法是在 package.json 里定义一个 loader 字段。

7. 插件(plugin)可以为 loader 带来更多特性。

8. loader 能够产生额外的任意文件。

### 插件(plugins)

> `loader` 被用于转换某些类型的模块，而插件则可以用于执行范围更广的任务。插件的范围包括，从打包优化和压缩，一直到重新定义环境中的变量。插件接口功能极其强大，可以用来处理各种各样的任务。

想要使用一个插件，你只需要 `require()` 它，然后把它添加到 `plugins` 数组中。多数插件可以通过选项(`option`)自定义。你也可以在一个配置文件中因为不同目的而多次使用同一个插件，这时需要通过使用 `new` 操作符来创建它的一个实例。

```js
const HtmlWebpackPlugin = require('html-webpack-plugin'); // 通过 npm 安装
const webpack = require('webpack'); // 用于访问内置插件

const config = {
  module: {
    rules: [
      { test: /\.txt$/, use: 'raw-loader' }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({template: './src/index.html'})
  ]
};

module.exports = config;
```
:::tip
`webpack` 提供许多开箱可用的插件！查阅[插件列表](https://www.webpackjs.com/plugins/)获取更多信息。
:::

### 模式(mode)

> `webpack`内置了两个不同的模式(`development`、`production` ),通过选择 `development` 或 `production` 之中的一个，来设置 `mode` 参数，你可以启用相应模式下的 `webpack` 内置的优化。

**- `development`模式下，将侧重于功能调试和优化开发体验，包含如下内容：**
1. 浏览器调试工具
2. 开发阶段的详细错误日志和提示
3. 快速和优化的增量构建机制

**- `production模式下`，将侧重于模块体积优化和线上部署，包含如下内容：**
1. 开启所有的优化代码
2. 更小的`bundle`大小
3. 去除掉只在开发阶段运行的代码
4. `Scope hoisting`和`Tree-shaking`
5. 自动启用`uglifyjs`对代码进行压缩


### manifest

**在使用 webpack 构建的典型应用程序或站点中，有三种主要的代码类型：**

1. 你或你的团队编写的源码。
2. 你的源码会依赖的任何第三方的 library 或 "vendor" 代码。
3. webpack 的 `runtime` 和 `manifest`，管理所有模块的交互。

**Runtime**

如上所述，我们这里只简略地介绍一下。runtime，以及伴随的 manifest 数据，主要是指：在浏览器运行时，webpack 用来连接模块化的应用程序的所有代码。runtime 包含：在模块交互时，连接模块所需的加载和解析逻辑。包括浏览器中的已加载模块的连接，以及懒加载模块的执行逻辑。

**Manifest**
那么，一旦你的应用程序中，形如 index.html 文件、一些 bundle 和各种资源加载到浏览器中，会发生什么？你精心安排的 /src 目录的文件结构现在已经不存在，所以 webpack 如何管理所有模块之间的交互呢？这就是 manifest 数据用途的由来……

当编译器(compiler)开始执行、解析和映射应用程序时，它会保留所有模块的详细要点。这个数据集合称为 "Manifest"，当完成打包并发送到浏览器时，会在运行时通过 Manifest 来解析和加载模块。无论你选择哪种模块语法，那些 import 或 require 语句现在都已经转换为 __webpack_require__ 方法，此方法指向模块标识符(module identifier)。通过使用 manifest 中的数据，runtime 将能够查询模块标识符，检索出背后对应的模块。

## 模块热替换

模块热替换(HMR - Hot Module Replacement)功能会在应用程序运行过程中替换、添加或删除模块，而无需重新加载整个页面。主要是通过以下几种方式，来显著加快开发速度：

- 保留在完全重新加载页面时丢失的应用程序状态。

- 只更新变更内容，以节省宝贵的开发时间。

- 调整样式更加快速 - 几乎相当于在浏览器调试器中更改样式。

**在应用程序中**

通过以下步骤，可以做到在应用程序中置换(swap in and out)模块：

1. 应用程序代码要求 HMR runtime 检查更新。

2. HMR runtime（异步）下载更新，然后通知应用程序代码。

3. 应用程序代码要求 HMR runtime 应用更新。

4. HMR runtime（同步）应用更新。

你可以设置 HMR，以使此进程自动触发更新，或者你可以选择要求在用户交互时进行更新。

**在编译器中**

除了普通资源，编译器(compiler)需要发出 "update"，以允许更新之前的版本到新的版本。"update" 由两部分组成：

1. 更新后的 manifest(JSON)

2. 一个或多个更新后的 chunk (JavaScript)

manifest 包括新的编译 hash 和所有的待更新 chunk 目录。每个更新 chunk 都含有对应于此 chunk 的全部更新模块（或一个 flag 用于表明此模块要被移除）的代码。

编译器确保模块 ID 和 chunk ID 在这些构建之间保持一致。通常将这些 ID 存储在内存中（例如，使用 webpack-dev-server 时），但是也可能将它们存储在一个 JSON 文件中。

## HtmlWebpackPlugin

1. [`HtmlWebpackPlugin`](https://github.com/jantimon/html-webpack-plugin) star: 8.5K

    主要有两个作用:

    1. 为`html`文件中引入的外部资源如`script`、`link`动态添加每次`compile`后的`hash`，防止引用缓存的外部文件问题

    2. 可以生成创建`html`入口文件，比如单页面可以生成一个`html`文件入口，配置N个`html-webpack-plugin`可以生成N个页面入口

    常用的字段：

    - `title`:设置生成`html`文件的标题 默认值为:`Webpack App`

    - `filename`: 输出的`html`的文件名称 默认值为:`index.html`

    - `template`: html模板所在的文件路径

    根据自己的指定的模板文件来生成特定的 `html` 文件。这里的模板类型可以是任意你喜欢的模板，可以是 `html`, `jade`, `ejs`, `hbs`, 等等，但是要注意的是，使用自定义的模板文件时，需要提前安装对应的 `loader`， 否则`webpack`不能正确解析。

    - `inject`:注入选项。
        1. `true`：默认值，script标签位于html文件的 body 底部
        2. `body`：script标签位于html文件的 body 底部（同 true）
        3. `head`：script 标签位于 head 标签内
        4. `false`：不插入生成的 js 文件，只是单纯的生成一个 html 文件

    - `favicon`:给生成的 `html` 文件生成一个 `favicon`。属性值为 `favicon` 文件所在的路径名

    - `minify`:对 `html` 文件进行压缩，`minify` 的属性值是一个压缩选项或者 `false` 。默认值为`false`, 不对生成的 `html` 文件进行压缩。

        ```js
        plugins:[
            new HtmlWebpackPlugin({
            // 部分省略，具体看minify的配置
                minify: {
                    //是否对大小写敏感，默认false
                    caseSensitive: true,
                    
                    //是否简写boolean格式的属性如：disabled="disabled" 简写为disabled  默认false
                    collapseBooleanAttributes: true,
                    
                    //是否去除空格，默认false
                    collapseWhitespace: true,
                    
                    //是否压缩html里的css（使用clean-css进行的压缩） 默认值false；
                    minifyCSS: true,
                    
                    //是否压缩html里的js（使用uglify-js进行的压缩）
                    minifyJS: true,
                    
                    //Prevents the escaping of the values of attributes
                    preventAttributesEscaping: true,
                    
                    //是否移除属性的引号 默认false
                    removeAttributeQuotes: true,
                    
                    //是否移除注释 默认false
                    removeComments: true,
                    
                    //从脚本和样式删除的注释 默认false
                    removeCommentsFromCDATA: true,
                    
                    //是否删除空属性，默认false
                    removeEmptyAttributes: true,
                    
                    //若开启此项，生成的html中没有 body 和 head，html也未闭合
                    removeOptionalTags: false, 
                    
                    //删除多余的属性
                    removeRedundantAttributes: true, 
                    
                    //删除script的类型属性，在h5下面script的type默认值：text/javascript 默认值false
                    removeScriptTypeAttributes: true,
                    
                    //删除style的类型属性， type="text/css" 同上
                    removeStyleLinkTypeAttributes: true,
                    
                    //使用短的文档类型，默认false
                    useShortDoctype: true,
                }
            }),
        ]
        ```

    - `hash`:给生成的 `js` 文件一个独特的 `hash` 值，该 `hash` 值是该次 `webpack` 编译的 `hash` 值。默认值为 `false` 。

    ```js
    plugins: [
        new HtmlWebpackPlugin({
            hash: true
        })
    ]
    // 编译后
    <script type=text/javascript src=bundle.js?22b9692e22e7be37b57e></script>
    ```
    - `cache`:默认是`true`的，表示内容变化的时候生成一个新的文件。

    - `showErrors`:如果 webpack 编译出现错误，webpack会将错误信息包裹在一个 pre 标签内，属性的默认值为 true ，也就是显示错误信息。开启这个，方便定位错误.

    - `chunks`:chunks主要用于多入口文件，当你有多个入口文件，那就会编译后生成多个打包后的文件，那么`chunks` 就能选择你要使用那些js文件。

    ```js
    entry: {
        index: path.resolve(__dirname, './src/index.js'),
        devor: path.resolve(__dirname, './src/devor.js'),
        main: path.resolve(__dirname, './src/main.js')
    },
    plugins: [
        new httpWebpackPlugin({
            chunks: ['index','main']
        })
    ]
    // 打包后
    <script type=text/javascript src="index.js"></script>
    <script type=text/javascript src="main.js"></script>
    // 而如果没有指定 chunks 选项，默认会全部引用。
    ```

    - `excludeChunks`:排除掉一些js不进行打包



## path与publicPath

在复杂的项目里可能会有一些构建出的资源需要异步加载，加载这些异步资源需要对应的URL地址。

`output.publicPath`配置发布到线上资源的URL前缀，为`string`类型，默认值是字符串’’，即使用相对路径。

例如：需要将构建出的资源文件上传到CDN服务上，以利于加快页面的打开速度，配置代码如下：

```js
filename: '[name]_[chunkhash:8].js'
publicPath: 'https://cdn.example.com/assets/'
```

- `path`是`webpack`构建后输出构建结果的目录，必须是`绝对路径`.

- `publicPath`并不会对生成文件的路径造成影响，主要是对你的页面里面引入的资源的路径做对应的补全，常见的就是css文件里面引入的图片url值.


