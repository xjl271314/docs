# 一文搞懂AMD,CMD,CommonJs,UMD,ES Modules

- 2020.05.18

## AMD

[AMD规范地址:](https://github.com/amdjs/amdjs-api/wiki/AMD)

> `AMD`是 `Asynchronous Module Definition` 的缩写，意思就是"异步模块定义"。它采用`异步方式加载模块`，模块的加载不影响它后面语句的运行。所有依赖这个模块的语句，都定义在一个回调函数中，等到加载完成之后，这个回调函数才会运行。其中 `RequireJS` 是最佳实践者。

模块功能主要的几个命令：`define`、`require`、`return`和`define.amd`。

- `define`是全局函数，用来定义模块

```js
define(id?, dependencies?, factory)
```

- `require`命令用于输入其他模块提供的功能

- `return`命令用于规范模块的对外接口，

- `define.amd`属性是一个对象，此属性的存在来表明函数遵循`AMD规范`。

```js
// model1.js
define(function () {
    console.log('model1 entry');
    return {
        getHello: function () {
            return ' from model1 ——> hello modle1';
        }
    };
});
```

```js
// model2.js
define(function () {
    console.log('model2 entry');
    return {
        getHello: function () {
            return 'from model2 ——> hello modle2';
        }
    };
});
```

```js
// main.js
define(function (require) {
    var model1 = require('./model1');
    console.log(model1.getHello());
    var model2 = require('./model2');
    console.log(model2.getHello());
});
```

```js
<script src="https://cdn.bootcss.com/require.js/2.3.6/require.min.js"></script>
<script>
    requirejs(['main']);
</script>

// 输出结果  
// model1 entry
// model2 entry
// from model1 ——> hello modle1
// from model2 ——> hello modle2
```

在这里，我们使用`define`来定义模块，`return`来输出接口， `require`来加载模块，这是`AMD官方推荐用法`。


## CMD

[CMD规范地址:](https://github.com/cmdjs/specification/blob/master/draft/module.md)

> `CMD(Common Module Definition - 通用模块定义)`规范主要是`Sea.js`推广中形成的，一个文件就是一个模块，可以像`Node.js`一般书写模块代码。`主要在浏览器中运行`，当然也可以在`Node.js`中运行。

:::tip
它与`AMD`很类似，不同点在于：`AMD 推崇依赖前置、提前执行`，`CMD推崇依赖就近、延迟执行`。
:::

**不懂 依赖就近、延迟执行 的可以比较下两个的例子。**

```js
// model1.js
define(function (require, exports, module) {
    console.log('model1 entry');
    exports.getHello = function () {
        return 'hello model1';
    }
});
```
```js
// model2.js
define(function (require, exports, module) {
    console.log('model2 entry');
    exports.getHello = function () {
        return 'hello model2';
    }
});
```
```js
<script src="https://cdn.bootcss.com/seajs/3.0.3/sea.js"></script>
<script>
    seajs.use('./main.js')
</script>
// 输出 
// model1 entry
// hello model1
// model2 entry
// hello model2
```

:::tip
总结: 

对比和 `AMD` 的写法就可以看出 `AMD` 和 `CMD` 的区别。虽然现在 `CMD` 已经凉了。但是 `CMD` 更加接近于 `CommonJS` 的写法，但是 `AMD` 更加接近于`浏览器的异步的执行方式`。
:::

## CommonJs

[CommonJS规范地址:](http://wiki.commonjs.org/wiki/CommonJS)

> `CommonJS` 主要运行于服务器端，该规范指出，一个单独的文件就是一个模块。 

`Node.js`为主要实践者，它有四个重要的环境变量为模块化的实现提供支持：`module`、`exports`、`require`、`global`。

- `require` 命令用于输入其他模块提供的功能，

- `module.exports`命令用于规范模块的对外接口，输出的是`一个值的拷贝`，输出之后就不能改变了，会缓存起来。

```js
// 模块 a.js
const getTitle = () => document.title;

module.exports = {
   getTitle
}
```

```js
// b.js
// 引用核心模块或者第三方包模块，不需要写完整路径
const path = require('path');
// 引用自定义模块可以省略.js
const { getTitle } = require('./a');

console.log(getTitle());
```

:::warning
`CommonJS` 采用`同步加载模块`，而加载的文件资源大多数在本地服务器，所以执行速度或时间没问题。

但是在浏览器端，限于网络原因，更合理的方案是使用异步加载。
:::

## UMD

[UMD规范地址:](https://github.com/umdjs/umd)

> `UMD(Universal Module Definition - 通用模块定义)`模式，该模式主要用来解决`CommonJS模式`和`AMD模式`代码不能通用的问题，并同时还支持老式的全局变量规范。

```js
// bundle.js
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = global || self, global.myBundle = factory());
}(this, (function () { 'use strict';

    var main = () => {
        return 'hello world';
    };

    return main;

})));
```

```html
// index.html
<script src="bundle.js"></script>
<script>
  console.log(myBundle());
</script>
```

### 执行解释

1. 判断`define`为函数，并且是否存在`define.amd`，来判断是否为`AMD规范`

2. 判断`module`是否为一个对象，并且是否存在`module.exports`来判断是否为`CommonJS规范`

3. 如果以上两种都没有，设定为原始的代码规范。


## ES Modules

[ES Modules文档:](https://es6.ruanyifeng.com/#docs/module-loader)

> `ES modules（ESM）`是 `JavaScript` 官方的标准化模块系统。

 1. 它因为是标准，所以未来很多浏览器会支持，可以很方便的在浏览器中使用。(浏览器默认加载不能省略.js)
 2. 它同时兼容在`node`环境下运行。
 3. 模块的导入导出，通过`import`和`export`来确定。
 4. 可以和`Commonjs`模块混合使用。
 5. `ES modules` 输出的是值的引用，输出接口动态绑定，而 `CommonJS` 输出的是值的拷贝
 6. `ES modules` 模块编译时执行，而 `CommonJS` 模块总是在运行时加载


```js
// utils.js
export const now = Date.now();
```

```js
// index.js
import { now } from './utils';

now();
```

## ES6 模块与 CommonJS 模块的差异

它们有两个重大差异。

- `CommonJS` 模块输出的是一个`值的拷贝`，`ES6 `模块输出的是`值的引用`。

- `CommonJS` 模块是`运行时加载`，`ES6` 模块是`编译时输出接口`。

第二个差异是因为 `CommonJS` 加载的是一个对象（即`module.exports`属性），该对象只有在脚本运行完才会生成。而 `ES6` 模块不是对象，它的对外接口只是一种`静态定义`，在代码静态解析阶段就会生成。


**我们重点看一下第一个差异:**

`CommonJS` 模块输出的是值的拷贝，也就是说，一旦输出一个值，模块内部的变化就影响不到这个值。请看下面这个模块文件`lib.js`的例子。

```js
// lib.js
var counter = 3;
function incCounter() {
  counter++;
}
module.exports = {
  counter: counter,
  incCounter: incCounter,
};
```

上面代码输出内部变量`counter`和改写这个变量的内部方法`incCounter`。然后，在`main.js`里面加载这个模块。

```js
// main.js
var mod = require('./lib');

console.log(mod.counter);  // 3

mod.incCounter();

console.log(mod.counter); // 3
```

上面代码说明，`lib.js`模块加载以后，它的内部变化就影响不到输出的`mod.counter了`。这是因为`mod.counter`是一个原始类型的值，会被缓存。除非写成一个函数，才能得到内部变动后的值。


```js
// lib.js
var counter = 3;
function incCounter() {
  counter++;
}
module.exports = {
  get counter() {
    return counter
  },
  incCounter: incCounter,
};
```

上面代码中，输出的`counter`属性实际上是一个取值器函数。现在再执行`main.js`，就可以正确读取内部变量`counte`r的变动了。


```js
$ node main.js
3
4
```

`ES6` 模块的运行机制与 `CommonJS` 不一样。`JS引擎`对脚本静态分析的时候，遇到模块加载命令`import`，就会生成一个`只读引用`。等到脚本真正执行时，再根据这个只读引用，到被加载的那个模块里面去取值。

换句话说，`ES6` 的`import`有点像 `Unix` 系统的`符号连接`，原始值变了，`import`加载的值也会跟着变。

因此，`ES6` 模块是`动态引用`，并且不会缓存值，模块里面的变量绑定其所在的模块。

```js
// lib.js
export let counter = 3;
export function incCounter() {
  counter++;
}

// main.js
import { counter, incCounter } from './lib';
console.log(counter); // 3
incCounter();
console.log(counter); // 4
```