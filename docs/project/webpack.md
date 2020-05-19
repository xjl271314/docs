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

`thread-loader`:可以配置webpack进行多进程的打包js和css。
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
      // 配置css loaders 假如在index.js中引入css 会被转化成commonjs对象
      { test: /\.css$/, use: ['style-loader', 'css-loader'] },
      // styles-loader 将css转化成style 插入到head中
      { test: /\.less$/, use: ['style-loader', 'css-loader', 'less-loader'] },
      { test: /\.scss$/, use: ['style-loader', 'css-loader', 'sass-loader'] },
      // url-loader可以处理一些图片大小转base64的功能   limit的单位是B(字节)
      { test: /\.png|jpg|jpeg|gif$/, use: [ loader:'url-loader',options:{limit: 10240} ]}
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

你可以设置 HMR，以使此进程自动触发更新，或者你可以选择要求在用户交互时进行更新。通常我们可以使用`webpack-dev-server`来进行处理。

:::tip
 - `webpack-dev-server` 不会刷新浏览器

 - `webpack-dev-server` 不输出文件,二是放在内存中

 - 使用 `HotModuleReplacementPlugin` 插件(webpack自带)

 - 使用 `webpack-dev-middleware`也可以实现相同的功能，不过这种方式会将`webpack`输出的文件传输给服务器,适用于灵活的定制场景。
:::

### 热跟新原理

![极客时间热更原理](https://img-blog.csdnimg.cn/20200515205923186.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)



## 文件监听

> 文件监听是在发现源码发生变化的时候,自动的构建出新的输出文件。

webpack中开启监听模式有两种方式实现:

- 启动 `webpack` 的时候带上 `--watch` 参数

- 在配置 `webpack.config.js` 的时候设置 `watch:true`

:::warning
这种方式虽然webpack构建是成功了 但是需要开发者手动刷新浏览器才会显示效果
:::

### 文件监听的原理

> 轮询的判断文件的最后编辑时间是否发生了变化。当某个文件发生了变化，并不会立即告诉监听者，而是先缓存起来,等待 `aggregateTimeout`

```js
modules.exports = {
   // 默认是false 不开启
   watch: true,
   // 只有watch开启之后才会有效
   watchOptions: {
     // 默认为空 不监听的文件或文件夹 支持正则匹配
     ignored: /node_modules/,
     // 监听到变化后等待多少ms之后执行 默认是300ms
     aggregateTimeout:300,
     // 判断文件是否发生变化通过不停询问系统指定文件有没有变化实现的， 默认为每秒询问1000次
     poll: 1000
   }
}
```

## 文件指纹

> 文件指纹其实指的就是每次文件打包之后后面跟着的`HashCode`,用来做版本管理等功能

### 分类

- `Hash`: 和整个项目的构建有关,只要项目文件有修改,整个项目构建的hash值就会更改。

- `Chunkhash`: 和`webpack`打包的`chunk`有关，不同的`entry`会生成不同的`chunkhash`。

- `Contenthash`: 根据文件的内容来定义`hash`,文件内容不变,则`contenthash`不变。

## 自动清理构建目录

- 2020.05.18

默认情况下每次webpack的构建的需要手动去清除之前构建产生的目录文件，这样在实际工程中就变得很麻烦。下面将会讲解几种自动化清理构建目录的方法。

1. 通过script命令

```js
rm -rf ./dist && webpack
// rimraf 是个插件库
rimraf ./dist && webpack
```

2. 使用 `clean-webpack-plugin` 插件

> 这个插件默认会删除 `output` 指定的输出目录

```js
plugins: [
  new CleanWebpackPlugin();
]
```

## CSS增强

### 1. 自动补全属性兼容

CSS3某些属性其实在不同浏览器的支持情况不一样，以前的css代码中经常会出现以下这种qingx

```css
-moz-border-redius:50px;
-webkit-border-redius:50px;
-o-border-redius:50px;
-ms-border-redius:50px;
border-redius:50px;
```

如何只编写W3C规范的属性，其余的让大宝工具自动帮助我们完成?

其实我们可以通过使用`post-css`和`autoprefixer`插件来辅助我们完成这个功能。

```js
module.exports = {
  ...,
  module: {
    rule: [{
        test: /\.scss$/,
        use: [{
                loader: require.resolve('style-loader')
            },
            {
                loader: require.resolve('css-loader')
            },
            {
                loader: require.resolve('postcss-loader'),
                options: {
                    plugins: [
                        require('autoprefixer')({
                            overrideBrowserslist: ['last 4 versions', 'ie 9', 'android 4.4.4', 'ios 8'],
                        }),
                    ],
                },
            },
            {
                loader: require.resolve('sass-loader'),
                options: {
                    modifyVars: true,
                    javascriptEnabled: true
                },
            },
        ],
    }, ]
  }
}
```

机制是在CanIUse上查找兼容性。

### 2. 自动px转rem适配移动端

```js
const {
  addPostcssPlugins,
} = require("customize-cra");

addPostcssPlugins([require('postcss-px2rem')({ remUnit: 75 / 2 })]), // px转换成rem

// 早期版本
module.exports ={
  ...,
  {
    loader: 'px2rem-loader',
      options: {
        remUnit: 75,// 1rem = 75px  750设计稿
        remPrecision: 8 ,// px转rem小数点位数
      }
  },
}
```

:::tip
推荐使用手机淘宝的[`lib-flexible`](https://github.com/amfe/lib-flexible)库配套使用 或者使用本博客对应的js技巧篇中的方法。
:::

## 静态资源内联

### 意义

- 页面框架的初始化脚本

- 上报相关打点

- CSS内联避免页面闪动

- 小图片或者字体内联 减少`HTTP`请求数


### 实现

主要是用 `raw-loader`来实现静态资源内联。

### 功能

- `raw-loader` 内联html

```js
<script>${require('raw-loader!babel-loader!./meta.html')}</script>
```

- `raw-loader` 内联js

```js
<script>${require('raw-loader!babel-loader!../node_modules/lib_flexible')}</script>
```

### 实现css内联

1. 借助`style-loader`

```js
module.exports = {
  ...,
  {
    loader: 'style-loader',
    options:{
        insertAt: 'top',// 样式插入head
        singleton: true, // 将所有的style标签合并成一个
    }
  }
}
```

2. 使用`html-inline-css-webpack-plugin`

## 使用 source map

> soure map可以将打包后的文件与原文件建立映射 方便查找打包之前的文件、定位错误

:::warning
注意: 一般仅在开发环境开启
:::

### 关键字

- `eval`: 使用`eval`包裹模块代码

- `source map`: 产生`.map`文件

- `cheap`: 不包含列信息

- `inline`: 将`.map`作为`DataURI`嵌入,不单独生成`.map`文件

- `module`: 包含`loader`的`sourcemap`


## 提取页面的公共资源

### 基础库的分离

> 将react、react-dom等基础包通过cdn引入,不打入bundle中。

实际操作起来就是将这些库使用`externals`进行引入或者使用`splitChunks`进行分割.

**使用 `html-webpack-externals-plugin`**

```js
// 安装
npm i html-webpack-externals-plugin -D


// 使用 
const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin');

module.exports = {
  ...,
  plugins: [
    ...,
    new HtmlWebpackExternalsPlugin({
        externals: [
          {
            module: 'react',
            entry: 'cdn文件地址',
            global: 'React'
          },
          {
            module: 'react-dom',
            entry: 'cdn文件地址',
            global: 'ReactDOM'
          }
        ]
    })
  ]
}

// index.html
<script src="依赖地址"></script>
```

## splitChunks

- 2020.05.18

`splitChunks`算是`webpack`中比较高级的一个用法，主要是跟`模块拆分`与`代码拆分`功能相关。

在研究`splitChunks`之前，我们先再回顾下`webpack`中的`module`、`chunk`和`bundle`。


- `module`：就是js的模块化`webpack`支持`commonJS`、`ES6`等模块化规范，简单来说就是你通过`import`语句引入的代码。

- `chunk`: `chunk`是`webpack`根据功能拆分出来的，包含三种情况：
  1. 你的项目入口`（entry）`
  2. 通过`import()`动态引入的代码
  3. 通过`splitChunks`拆分出来的代码

`chunk`包含着`module`，可能是一对多也可能是一对一。

- `bundle`：`bundle`是`webpack`打包之后的各个文件，一般就是和`chunk`是一对一的关系，`bundle`就是对`chunk`进行编译压缩打包等处理之后的产出。

在`webpack4`之后有一个默认的`splitChunks`配置：

```js
module.exports = {
  //...
  optimization: {
    splitChunks: {
      chunks: 'async',
      minSize: 30000,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      automaticNameDelimiter: '~',
      name: true,
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    }
  }
};
```

### chunks

`chunks`的含义是拆分模块的范围，它有三个值`async`、`initial`和`all`。

- `async`表示只从异步加载得模块（`动态加载import()`）里面进行拆分
- `initial`表示只从入口模块进行拆分
- `all`表示以上两者都包括

`chunks`的默认配置是`async`，也就是只从`动态加载得模块`里面进行拆分

### cacheGroups

`cacheGroups`其实是`splitChunks`里面最核心的配置,`splitChunks`就是根据`cacheGroups`去拆分模块的.

`splitChunks`默认有两个缓存组：`vender`和`default`。

如果有一个模块满足了多个缓存组的条件就会去按照权重划分，谁的权重高就优先按照谁的规则处理。


### maxInitialRequests

> 表示允许入口并行加载的最大请求数。

之所以有这个配置也是为了对拆分数量进行限制，不至于拆分出太多模块导致请求数量过多而得不偿失。

**这里需要注意几点：**

1. 入口文件本身算一个请求
2. 如果入口里面有动态加载得模块这个不算在内
3. 通过`runtimeChunk`拆分出的`runtime`不算在内
4. 只算`js`文件的请求，`css`不算在内
5. 如果同时又两个模块满足`cacheGroup`的规则要进行拆分，但是`maxInitialRequests`的值只能允许再拆分一个模块，那尺寸更大的模块会被拆分出来


### maxAsyncRequests

`maxAsyncRequests`和`maxInitialRequests`有相似之处，它俩都是用来限制拆分数量的，`maxInitialRequests`是用来限制入口的拆分数量而`maxAsyncRequests`是用来限制异步模块内部的并行最大请求数的，说白了你可以理解为是`每个import()`它里面的最大并行请求数量。

**这其中要注意以下几点：**

1. `import()`文件本身算一个请求

2. 并不算js以外的公共资源请求比如css

3. 如果同时有两个模块满足`cacheGroup`的规则要进行拆分，但是`maxInitialRequests`的值只能允许再拆分一个模块，那`尺寸更大`的模块会被拆分出来

### 其余要点

1. `splitChunks.cacheGroup`必须同时满足各个条件才能生效，比如`minSize`或是`minChunks`等条件必须同时满足才行

2. `splitChunks`的配置项都是作用于`cacheGroup`上的，如果将`cacheGroup`的默认两个分组`vendor`和`default`设置为`false`，则`splitChunks`就不会起作用

3. `minChunks`、`maxAsyncRequests`、`maxInitialRequests`的值必须设置为大于等于1的数

4. 当`chunk`没有名字时，通过`splitChunks`分出的模块的名字用`id`替代，当然你也可以通过`name`属性自定义

5. 当`父chunk`和`子chunk`同时引入相同的`module`时，并不会将其分割出来而是删除掉`子chunk`里面共同的`module`，保留`父chunk`的`module`，这个是因为 `optimization.removeAvaliableModules` 默认是`true`

6. 当两个`cacheGroup.priority`相同时，先定义的会先命中

7. 除了`js`，`splitChunks`也适用于`css`

## Tree Shaking

- 2020.05.19

> 一个模块里可能有很多个方法,只要其中的某个方法使用到了,则整个文件都会被打包到 `bundle`中去，`tree shaking `就是只把用到的方法打入到 `bundle` , 没用到的方法会在 `ugify阶段`被擦除掉,从而减小了包的体积。

### 使用

`webpack`默认支持, 在 `.barbelrc` 里面设置 `modules: false` 即可。

:::tip
webpack4之后在`mode:production` 的情况下默认开启。

必须是ES6的语法, CJS的方式不支持,且其中编写的方法不能有副作用，否则就会失效。
:::

**副作用解释**

> 对于相同的输入就有相同的输出，不依赖外部环境，也不改变外部环境。

符合上述的描述就可以称为纯函数，反之就是带有副作用。

### 原理

利用ES6模块的特点:
  - 只能作为模块顶层的语句出现,只在文件的顶层,不能在代码中动态导入
  - `import`的模块名只能是字符串常量
  - `import binding` 是 `immutable` 的

代码擦除:
  - `uglify`阶段删除无用代码。

### 扩展 

- 2020.05.19

上述描述到如果模块是不纯,那么`tree shaking`检测就会失效，如何优化这部分的功能呢?

这里可以配合使用另外一个插件`webpack-deep-scope-plugin`。

> `webpack-deep-scope-plugin`是一位中国同胞(学生)在`Google夏令营`，在导师Tobias带领下写的一个`webpack`插件。主要用于填充`webpack`自身`Tree-shaking`的不足，通过`作用域分析`来消除无用的代码。

## Scope Hoisting

- 2020.05.19

> `scope hoisting` 是 `webpack3` 的新功能，直译过来就是`「作用域提升」`。熟悉 `JavaScript` 都应该知道`「函数提升」`和`「变量提升」`，`JavaScript` 会把函数和变量声明提升到当前作用域的顶部。`「作用域提升」`也类似于此，`webpack` 会把引入的 `js` 文件“提升到”它的引入者顶部。

### 现象

在未使用`Scope Hoisting`的情况下,编译后的代码中存在着大量的闭包代码。

```js
// 编译前
// a.js
export default 'xxxx';

// b.js
import index from './a';
console.log(index);
```

```js
// 编译后

/****/ "./app/index/app.js";
/******************!*\
  !*** ./app/index/app.js ***!
  \**************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__){

"use strict";
__webpack_require__.r(__webpack_exports);
/* harmony import */ var __js_index__WEBPACK_IMPORTED_MODULES_0__ = __webpack_require__(/*! ./js/index */ "./app/index/app.js")


console.log(__js_index__WEBPACK_IMPORTED_MODULES_0__["default"]);
/***/ }),

/****/ "./app/index/js/index.js";
/******************!*\
  !*** ./app/index/js/index.js ***!
  \**************************/
/*! export provided:default */
/***/ (function(module, __webpack_exports__, __webpack_require__){

"use strict";
__webpack_require__.r(__webpack_exports);

/* harmony default export */ __webpack_exoirts__["default"] = ('xxxx');

/***/ })
```

**这样会导致:**

1. 大量闭包函数包裹代码，导致体积增大(模块越多的情况下越明显)

2. 运行代码时创建的函数作用域变多,内存开销变大

### 原理之模块转化分析

我们来探究下为什么经过`webpack`打包之后会产生这么多的闭包函数，先来了解下`webpack`的`模块转化`。

```js
// 打包之前的代码
import { helloword } from './helloworld';
import '../../common';

document.write(helloworld());
```

```js
// 打包之后的模块初始化函数
/* 0 */
/***/(function(module, __webpack_exports__, __webpack_require__)){

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import (指es6的import语法)*/ var _common_WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
/* harmony import */ var _helloworld_WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2);

document.write(Object(_helloworld_WEBPACK_IMPORTED_MODULE_1__["helloworld"])());

/***/ })
```

#### 结论

- 被 `webpack` 转化后的模块会带上一层包裹

- `import` 会被转化成 `__webpack_require`


### 进一步分析 `webpack` 的模块机制

```js
(function(modules){
  var installedModules = {};

  function __webpack_require__(moduleId) {
    if (installedModules[moduleId]) {
        return installedModules[moduleId].exports;
    }

    var module = installedModules[moduleId] = {
      i: moduleId,
      l: false,
      exports: {}
    };
    modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
    module.l = true;
    return module.exports;
  }
  __webpack_require__(0);
})([
  /* 0 module*/
  (function (module, __webpack_exports__. __webpack_require__){
    ...
  }),
  /* 1 module*/
  (function (module, __webpack_exports__. __webpack_require__){
    ...
  }),
  /* n module*/
  (function (module, __webpack_exports__. __webpack_require__){
    ...
  }),
]);
```

#### 结论

- `webpack`打包出来的是一个 `IIFE(匿名闭包)`

- `modules` 是一个数组,每一项是一个模块初始化函数

- `__webpack_require` 用来加载模块, 返回的是 `module.exports`

- 通过`WEBPACK_REQUIRE_METHOD(0)`来启动程序


### Scope Hoisting 原理

> 将所有模块的代码按照引用顺序放在一个函数作用域里, 然后适当的重命名一些变量以防止变量名冲突。

![Scope Hoisting 原理](https://img-blog.csdnimg.cn/20200519145232537.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)


### Scope Hoisting 使用

**在`webpack4`下 `mode` 为 `production` 时默认开启了此功能。**

<!------------------------------------------------------>

## 代码分割和动态import

- 2020.05.19

### 如何动态的import

1. 安装 babel 插件

```
npm install @babel/plugin-syntax-dynamic-import --save-dev
```

2. 配置`.babelrc`文件的`plugins`

```js
{
  ...,
  plugins: [
    '@babel/plugin-syntax-dynamic-import',
    ...
  ]
}
```

### 如何使用

```js
import(path).then(res=>{
  // do something
});
```

### 内部原理

通过 `webpackJsonp` 请求异步加载。动态创建`script标签`,然后引入。

## CommonsChunkPlugin

- 2020.05.18

> 主要是用来提取第三方库和公共模块，避免`首屏加载的bundle文件`或者`按需加载的bundle文件`体积过大，从而导致加载时间过长，是一把优化项目的利器。

:::tip
`webpack4`之后推荐使用`splitChunks`替代该方法。
:::

### chunk有哪几种，主要有以下三种：

1. `webpack`当中配置的`入口文件（entry）`是`chunk`，可以理解为`entry chunk`

2. 入口文件以及它的依赖文件通过`code split（代码分割`）出来的也是`chunk`，可以理解为`children chunk`

3. 通过`commonsChunkPlugin`创建出来的文件也是`chunk`，可以理解为`commons chunk`

### 可配置的属性：

| 属性名 | 属性说明
| :--- | :---
| `name` | 可以是已经存在的`chunk（一般指入口文件`）对应的`name`，那么就会把公共模块代码合并到这个`chunk`上；否则，就会创建名字为`name`的`commons chunk`进行合并
| `filename` | 指定`commons chunk`的文件名
| `chunks` | 指定该`source chunk`，即指定从哪些`chunk`当中去找公共模块，省略该选项的时候，默认就是`entry chunks`
| `minChunks` | 既可以数字，也可以是函数，还可以是`Infinity`


#### 插件的作用:

单独分离出第三方库、自定义公共模块、webpack运行文件


- 抽离webpack运行文件，修改webpack配置文件：

```js
plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name : ['vendor', 'runtime'],
      filename: '[name].js',
      minChunks: Infinity
    })
]
```
上面这段抽离`webpack`运行文件代码的意思是创建一个名为`runtime`的`commons chunk`进行`webpack`运行文件的抽离，其中`source chunks`是`vendor.js`。


## CleanWebpackPlugin

> 清理构建目录

## ExtractTextWebpackPlugin 

> 将CSS从bundle中提取成一个独立的css文件

## CopyWebpackPlugin

> 将文件或者文件夹拷贝到构建的输出目录

## UglifyjsWebpackPlugin

> 压缩JS

## ZipWebpackPlugin

> 将打包出的资源生成一个zip包


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


