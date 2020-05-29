# Babel

## 定义

- 2020.05.29

> `Babel`是一个 `JavaScript` 编译器。我们能够在项目中使用新颖的 `Javascript` 特性,它能够帮助我们自动转化成浏览器可以识别的代码。`babel`的核心概念就是利用一系列的`plugin`来管理编译案列，通过不同的`plugin`帮助我们编译不同特性的代码。

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