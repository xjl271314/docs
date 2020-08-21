# Babel

## 定义

- 2020.05.29

> `Babel`是一个 `JavaScript` 编译器。我们能够在项目中使用新颖的 `Javascript` 特性,它能够帮助我们自动转化成浏览器可以识别的代码。简单地说就是`Babel` 能够转译 `ECMAScript 2015+` 的代码，使它在旧的浏览器或者环境中也能够运行。`Babel`的核心概念就是利用一系列的`plugin`来管理编译案列，通过不同的`plugin`帮助我们编译不同特性的代码。

## babelrc配置文件详解

- 2020.08.21

> babel7.x之后提供了多种并行配置文件格式，可以一起使用，也可以独立使用。

- `.babelrc.json`
- `babel.config.json`
- `package.json`
- `JavaScript configuration files`

### 1. `.babelrc.json`

> 常用的配置方式之一,位置处于与`package.json`同级的根目录

```json
{
  "presets": [...],
  "plugins": [...]
}
```

### 2. `package.json`

> 我们也可以在package.json中书写相关的配置

```json
{
  "name": "my-package",
  "version": "1.0.0",
  "babel": {
    "presets": [ ... ],
    "plugins": [ ... ],
  }
}
```

### 3. `babel.config.json`

> `babel.config.json` 和 `.babelrc.json` 是同样的效果

### 4. `babel.config.js`

> 推荐使用js导出

```js
module.exports = function (api) {
  api.cache(true);

  const presets = [ ... ];
  const plugins = [ ... ];

  return {
    presets,
    plugins
  };
}
```

### presets 和 plugins

> `presets`：是某一类 `plugin` 的集合，包含了某一类插件的所有功能。`plugin` ： 将某一种需要转化的代码，转为浏览器可以执行代码。

**编译的执行顺序：**

1. 执行 plugins 中所有的插件

2. plugins 的插件，按照顺序依赖编译

3. 所有 plugins 的插件执行完成，在执行 presets 预设。

4. presets 预设，按照倒序的顺序执行。(从最后一个执行)

5. 完成编译。

### options配置

> 官方推荐使用`babel-preset-env`来替代一些插件包的安装（`es2015-arrow-functions`，`es2015-block-scoped-functions`等等）

```js
{
    "targets": {
        "chrome": 52,
        "browsers": ["last 2 versions", "safari 7"],
        "node":"6.10"
    }
    "modules": false
}
```

- `targets`可以制定兼容浏览器版本，如果设置了`browsers`，那么就会覆盖`targets`原本对浏览器的限制配置。

- `targets.node`正对node版本进行编译。

- `modules`通常都会设置为false，因为默认都是支持CommonJS规范，同时还有其他配置参数："amd" | "umd" | "systemjs" | "commonjs"

## transform-runtime

> 为了解决这种全局对象或者全局对象方法编译不足的情况，才出现了`transform-runtime`这个插件，但是它只会对`es6`的语法进行转换，而不会对新api进行转换。如果需要转换新api，也可以通过使用`babel-polyfill`来规避兼容性问题。

**对`Object.assign`进行编译，配置与未配置经过`webpack`编译后的代码片段如下：**

```js
// 未设置代码片段：
__webpack_require__("ez/6");
var aaa = 1;

function fna() {
  var dd = 33333;
  var cc = Object.assign({ key: 2 });
  var xx = String.prototype.repeat.call('b', 3);
  if ("foobar".String.prototype.includes("foo")) {
    var vv = 1;
  }

  return dd;
}

// 设置代码片段：
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_object_assign___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_object_assign__);

__webpack_require__("ez/6");
var aaa = 1;

function fna() {
  var dd = 33333;
  var cc = __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_object_assign___default()({ key: 2 });
  var xx = String.prototype.repeat.call('b', 3);
  if ("foobar".String.prototype.includes("foo")) {
    var vv = 1;
  }

  return dd;
}
```

**对`class`定义类会进行编译，配置与未配置经过`webpack`编译后的代码片段如下：**

```js
// 未设置代码片段：
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Canvas = function Canvas(height, width) {
  _classCallCheck(this, Canvas);

  this.height = height;
  this.width = width;
};

var Canvas2 = function Canvas2(height, width) {
  _classCallCheck(this, Canvas2);

  this.height = height;
  this.width = width;
};

// 设置代码片段：
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_classCallCheck___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_classCallCheck__);

var Canvas = function Canvas(height, width) {
  __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_classCallCheck___default()(this, Canvas);

  this.height = height;
  this.width = width;
};

var Canvas2 = function Canvas2(height, width) {
  __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_classCallCheck___default()(this, Canvas2);

  this.height = height;
  this.width = width;
};
```

:::tip
虽然使用`transform-runtime`后文件大小会有所增大，但是解决一些兼容性的问题。

同时，从以上给出的测试代码例子来看，使用`transform-runtime`后，可以减少内部全局函数的定义，从结构上看尊崇了webpack的模块化思想，所以还是建议使用该插件。
:::

## syntax-dynamic-import

> 这个插件主要解决动态引入模块的问题

```js
function nDate() {
  import('moment').then(function(moment) {
    console.log(moment.default().format());
  }).catch(function(err) {
    console.log('Failed to load moment', err);
  });
}

nDate();
```

> 如果.babelrc配置项中使用了"stage-2"，也可以不实用该插件，同样支持动态模块引入。

不然就会报以下错误：

- Module build failed: SyntaxError: 'import' and 'export' may only appear at the top level, or (import 和 export只能在最外层，也就是不能用在函数或者块中)

- Module build failed: SyntaxError: Unexpected token, expected {

## @babel/plugin-proposal-class-properties

> 用于解析类的属性


## @babel/preset-env

> `preset-env`是ES语法插件的合集，从 `Babel 7`开始官方已经不再推荐使用`preset-201x`之类的包，该包可以通过配置自动兼容代码，包括自动引入`polyfill`垫片处理新的API（例如：`Promise`,`Generator`,`Symbol`等）以及 实例方法（例如`Array.prototype.includes`等）。

## @babel/polyfill

>  在 `Babel > 7.4.0` 之前，通常我们会安装 `babel-polyfill` 或 `@babel/polyfill`来处理实例方法和ES+新增的内置函数，而`7.4.0`之后，当我们选择安装 `@babel/polyfill`时，会收到如下的警告 ：

```
warning @babel/polyfill@7.4.4: � As of Babel 7.4.0, this
package has been deprecated in favor of directly
including core-js/stable (to polyfill ECMAScript
features) and regenerator-runtime/runtime
(needed to use transpiled generator functions):

  > import "core-js/stable";
  > import "regenerator-runtime/runtime";
```

其实`polyfill`本身就是`stable`版本的`core-js`和`regenerator-runtime`的合集，即 `import @babel/polyfill`等同于：

```js
import 'core-js/stable';
import 'regenerator-runtime/runtime';
```

所以在针对`Babel >= 7.4.0` 的情况，我们需要安装 `core-js` 替代 `babel-polyfill`,而 `regenerator-runtime` 会在我们安装 `@babel/runtime` 时自动安装，所以不必单独安装了。

配合引入垫片`polyfill`的方式根据`useBuiltIns`的不同可以分为三种，即 `entry`, `usage` 和 `false`。

### `useBuiltIns`不同状态的示例:

**源码**

```js
/******* useBuiltIns: entry 时添加一下两行代码 ********/ 
import 'core-js/stable';
import 'regenerator-runtime/runtime';
/****************************************************/

const a = new Promise();
let b = new Map()
```

**转换后**

```js
// 1. useBuiltIns: entry
"use strict";

require("core-js/modules/es.symbol");

require("core-js/modules/es.symbol.description");

require("core-js/modules/es.symbol.async-iterator");

// ..... 此处省略400个包

require("regenerator-runtime/runtime");

var a = new Promise();
var b = new Map();


// 2. useBuiltIns: usage
"use strict";

require("core-js/modules/es.array.iterator");

require("core-js/modules/es.map");

require("core-js/modules/es.object.to-string");

require("core-js/modules/es.promise");

require("core-js/modules/es.string.iterator");

require("core-js/modules/web.dom-collections.iterator");

var a = new Promise();
var b = new Map();

// 3. useBuiltIns: false
"use strict";

var a = new Promise();
var b = new Map();
```

对比三种使用方法我们可以发现，`false` 只做了语法转换， `entry` 引入了所有的es扩展包，不管用不用得着一股脑都打包进来，只有 `usage` 会自动检测代码中用到的功能自动引入模块（注：babel默认不会检测第三方依赖包代码，所以使用 usage 时，可能会出现引入第三方的代码包未注入模块而引发bug）。

所以，这里如果不考虑代码包大小，你可以选择 `entry` 方式。而如果你需要代码尽可能的精简，则使用 `usage`，这也是官方推荐的用法。

:::warning
大多数场景下我们使用`polyfill`已经可以解决全部问题,但是有这么一些场景，假设我们需要发布一个类库给到别人使用，我们使用`polyfill`的方式引入了内置函数`Promise`，不巧的是别人的本地代码里也封装了一个函数叫`Promise`,然后就发生了错误，这个时候就需要用到`@babel/runtime`
:::

## @babel/runtime 

> `babel-polyfill`解决了`Babel`不转换新API的问题，但是直接在代码中插入帮助函数，会导致污染了全局环境，并且不同的代码文件中包含重复的代码，导致编译后的代码体积变大。`Babe`l为了解决这个问题，提供了单独的包`babel-runtime`用以提供编译模块的工具函数， 启用插件`babel-plugin-transform-runtime`后，`Babel`就会使用`babel-runtime`下的工具函数，避免自行引入`polyfill`时导致的污染全局命名空间的问题。

:::tip

我们应该经常在其他文档和使用说明中看到 `runtime` 不支持实例方法，确实在之前的使用中，无论是 `Babel 7.0.0 ~ 7.4.0` 抑或 `Babel < 7.0.0`, 对此都无能为力。他们只能通过配置` corejs （可选 false | 2）`来决定是否使用 `babel/runtime-corejs` 替代`core-js` 抑或 `polyfill （可选 true | false）`来决定是否全局引入`新的内置函数（new built-ins`）,然而其实这两者并没有根本改变, `corejs: 2` 实际上等同于 `7.0.0` 版本之前的 `polyfill: true`。

**真正的改变出现在 `Babel 7.4.0` 之后，你可以选择引入 `@babel/runtime-corejs3`，设置 `corejs: 3 `来帮助您实现对实例方法的支持。**
:::


### 我们接下来基于Babel 7.4.0来看几个例子：

**配置项**

```js
{
    "presets": [
        [
            "@babel/preset-env"
        ],
    ],
    "plugins": [
        ["@babel/plugin-transform-runtime", {
            "corejs": false // 可选 false | 2 | 3
        }]
    ]
}
```

**源码 -- 移除冗余工具函数**

```js
class Person {}
```

**转义结果**

```js
// 移除plugins中runtime配置
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Person = function Person() {
  _classCallCheck(this, Person);
};


// 引入插件runtime
"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/classCallCheck"));

var Person = function Person() {
  (0, _classCallCheck2["default"])(this, Person);
};
```

:::tip
可以看出，引入`runtime`，可以避免在多文件时编译生成多次相同的工具函数。
:::


**源码 -全局污染和实例方法示例**

```js
const a = new Promise();
[1, 2, 3].includes(1)
```

**转译结果**

```js
// corejs: false
"use strict";

var a = new Promise();
[1, 2, 3].includes(1);

// corejs: 2
"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");

var _promise = _interopRequireDefault(require("@babel/runtime-corejs2/core-js/promise"));

var a = new _promise["default"]();
[1, 2, 3].includes(1);

// corejs: 3
"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _includes = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/includes"));

var _promise = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/promise"));

var _context;

var a = new _promise["default"]();
(0, _includes["default"])(_context = [1, 2, 3]).call(_context, 1);

```

:::tip

结合一下代码我们可以看出，

- `corejs: false` 其实等同于使用 `@babel/polyfill` 时的 `useBuiltIns: false`，只对ES语法进行了转换。

- `corejs：2` 等同于 `Babel 6`时的 `polyfill: true` ，它们都会为代码创建一个沙盒环境，为 `core-js` 提供假名，这样就做到了不污染全局空间。

- `corejs: 3` 是在 `corejs: 2`的基础上进而解决了之前无法实例方法的窘况，同时也保持了不污染全局空间，简直完美~

**总结:**

1. `Babel < 7.4.0`
    - 开发类库, 选择 `@babel/runtime`
    - 内部项目，`@babel/polyfill`

2. `Babel >= 7.4.0`，啥也不说，直接上 `@babel/runtime`吧，你要的全都有。
:::

## 常用配置说明

- `@babel/preset-react`: 转义JSX语法

- `@babel/preset-env`: 使用最新阶段的语法转化

- `@babel/polyfill`: 转义垫片