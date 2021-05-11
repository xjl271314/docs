# 函数

函数是 javascript 中相当重要的一部分,我们通过以下几个方面来理解他。

## 函数中的参数

`ECMAScript`函数的参数与大多数其他语言中函数的参数有所不同。`ECMAScript`函数不介意传递进来多少个参数，也不在乎传进来参数是什么数据类型。

也就是说，即便你定义的函数只接收两个参数，在调用这个函数时也未必一定要传递两个参数。可以传递一个、三个甚至不传递参数，而解析器永远不会有什么怨言。

之所以会这样，原因是`ECMAScript`中的参数在内部是用一个`数组`来表示的。

函数接收到的始终都是这个数组，而不关心数组中包含哪些参数。如果这个数组中不包含任何元素，无所谓；如果包含多个元素，也没有问题。

::: tip
实际上，在函数体内可以通过`arguments`对象来访问这个参数数组，从而获取传递给函数的每一个参数。
:::

:::warning
由于大量使用`with`语句会导致性能下降，同时也会给调试代码造成困难，因此在开发大型应用程序时，不建议使用`with`语句。
:::

## 函数中的属性

在函数的内部，有两个特殊的对象:`arguments` 和 `this`。

`arguments`是一个类数组对象，包含着传入函数中的所有参数,有一个`callee`的属性，该属性是一个指针，指向拥有这个 arguments 对象的函数。

```js
function factorial(num) {
  if (num <= 1) {
    return 1;
  } else {
    return num * arguments.callee(num - 1); // 指向了factorial
  }
}
```

每个函数都包含两个属性：`length` 和 `prototype`。

其中，`length`属性表示函数希望接收的命名参数的个数，如下面的例子所示:

```js
function sayName(name) {
  alert(name);
}
function sum(num1, num2) {
  return num1 + num2;
}
function sayHi() {
  alert("hi");
}
alert(sayName.length); //1
alert(sum.length); //2
alert(sayHi.length); //0
```

:::tip
在 `ECMAScript5` 中，`prototype`属性是不可枚举的，因此使用`for-in`无法发现。
函数是对象，函数名是指针。
:::

## apply 与 call

每个函数都包含两个非继承而来的方法:`apply()`和 `call()`。

> 这两个方法的用途都是在特定的作用域中调用函数，实际上等于设置函数体内 `this`对象的值。

:::tip
使用`call()（或 apply()）`来扩充作用域的最大好处，就是对象不需要与方法有任何耦合关系。
:::

- `apply()`方法接收两个参数:一个是在其中运行函数的作用域，另一个是参数数组。第二个参数可以是 `Array` 的实例，也可以是 `arguments` 对象。例如:

```js
function sum(num1, num2) {
  return num1 + num2;
}
function callSum1(num1, num2) {
  return sum.apply(this, arguments);
}
function callSum2(num1, num2) {
  return sum.apply(this, [num1, num2]);
}
alert(callSum1(10, 10)); // 20
alert(callSum2(10, 10)); // 20
```

- `call()`方法与 `apply()`方法的作用相同，它们的区别仅在于接收参数的方式不同。对于 `call()`方法而言，第一个参数是`this` 值没有变化，变化的是传递给函数的参数必须逐个列举出来。

```js
function sum(num1, num2) {
  return num1 + num2;
}
function callSum(num1, num2) {
  return sum.call(this, num1, num2);
}
alert(callSum(10, 10)); // 20
```

## 函数声明与函数表达式

关于函数声明，它最重要的一个特征就是函数声明提升，意思是执行代码之前先读取函数声明。这意味着可以把函数声明放在调用它的语句之后。

```js
// 函数声明
function hello(type) {
  return "hello world";
}

// 函数表达式
hello(); // VM1155:1 Uncaught ReferenceError: Cannot access 'hello' before initialization

// 变量赋值语句
const hello = function() {
  return "hello world";
};
```

:::tip
**函数声明与函数表达式的区别：**

函数声明存在变量提升，可以先使用再声明。函数表达式必须先定义再使用。

函数表达式中，创建的函数叫做匿名函数，因为`function`关键字后面没有标识符。
:::

## 匿名函数与具名函数

- `匿名函数`，顾名思义就是没有名字的函数。上面的函数表达式中的创建，实际上是创建一个匿名函数，并将匿名函数赋值给变量 `hello`,调用`hello` 来进行函数的调用，调用的方式就是在变量 `hello` 后面加上一对括号()。

这是一种常见的匿名函数调用方式,我们再来看看另外一种调用方式:

```js
(function(x, y) {
  return x + y;
})(2, 3); // 5

new Function("x", "y", "return x+y")(2, 3); // 5
```

上述的例子中运用到了一个知识点,在 javascript 中，是没有块级作用域这种说法的，以上代码的这种方式就是模仿了块级作用域(通常成为私有作用域)，语法如下所示：

```js
(function() {
  //这里是块级作用域
})();
```

上述代码定义并立即调用了一个匿名函数。经函数声明包含在一对圆括号中，表示它实际上是一个函数表达式。而紧随其后的另一对圆括号会立即调用这个函数。然而要注意一点:

```js
function(){

}();
```

上面的代码是错误的，因为`javascript`将`function`关键字当作一个函数声明的开始，而函数声明后面不能加圆括号，如果你不显示告诉编译器，它会默认生成一个缺少名字的`function`，并且抛出一个`语法错误`，因为`function`声明需要一个名字。

有趣的是，即便你为上面那个错误的代码加上一个名字，他也会提示语法错误，只不过和上面的原因不一样。提示为：`Uncaught SyntaxError: Unexpected token (`。

:::tip
在一个表达式后面加上括号()，该表达式会立即执行，但是在一个语句后面加上括号()，是完全不一样的意思，只是分组操作符。
:::

```js
function test(){
   alert('测试是否弹窗')
}()
// SyntaxError: Unexpected token )
// 报错因为分组操作符需要包含表达式

function test(){
    alert('测试是否弹窗')
}(1)
// (1) => 等价于 1
// 相当于test方法后面个跟了一个无关系的表达式子:(1)
```

所以上面代码要是想要得到想要的弹窗提示，就必须要实现赋值，如:

```js
var a = (function() {
  alert("测试是否弹窗");
})();
// 弹窗提示成功
```

:::tip
`a=` 这个片段告诉了编译器这个是一个函数表达式，而不是函数的声明。因为函数表达式后面可以跟圆括号。
:::

因此下面两段代码是等价的:

```js
var aa = (function(x) {
  alert(x);
})(5)(
  //弹窗显示：5

  function(x) {
    alert(x);
  }
)(5); //弹窗显示：5
```

从上面对于函数和匿名函数的了解，我们引申出来了一个概念，即自执行函数。那为什么 `a =function(){}()` 这种表示方法可以让编译器认为这个是一个函数表达式而不是一个函数的声明？

## 自执行匿名函数

> 自执行函数，即定义和调用合为一体。我们创建了一个匿名的函数，并立即执行它，由于外部无法引用它内部的变量，因此在执行完后很快就会被释放，关键是这种机制不会污染全局对象。

我们来看看常用的自执行函数方式:

```js
// 推荐使用这个
(function() {
  /* code */
})()(
  // 这个也是可以用的
  function() {
    /* code */
  }
)();
```

由于`括弧()`和 JS 的`&&`，`异或`，`逗号`等操作符是在函数表达式和函数声明上消除歧义的,所以一旦解析器知道其中一个已经是表达式了，其它的也都默认为表达式了。

```js
var i = (function() {
  return 10;
})();

true &&
  (function() {
    /* code */
  })();

0,
  (function() {
    /* code */
  })();
```

如果你不在意返回值，或者不怕难以阅读,你甚至可以在 function 前面加一元操作符号:

```js
!(function() {
  /* code */
})();
~(function() {
  /* code */
})();
-(function() {
  /* code */
})();
+(function() {
  /* code */
})();
```

还有一个情况，使用 new 关键字,也可以用，但不确定执行效率:

```js
new (function() {
  /* code */
})();
new (function() {
  /* code */
})(); // 如果需要传递参数，只需要加上括弧()
```

## 闭包

> **闭包是指一个绑定了执行环境的函数。(或者说是函数内部定义的函数，被返回了出去并在外部调用。)**

创建闭包的常见方式，就是在一个函数内部创建另一个函数。

```js
function foo() {
  var a = 2;

  function bar() {
    console.log(a);
  }

  return bar;
}

var baz = foo();

baz(); // 这就形成了一个闭包
```

我们可以简单剖析一下上面代码的运行流程：

1. 编译阶段，变量和函数被声明，作用域即被确定。
2. 运行函数 `foo()`，此时会创建一个 `foo` 函数的执行上下文，执行上下文内部存储了 `foo` 中声明的所有变量函数信息。
3. 函数 `foo` 运行完毕，将内部函数 `bar` 的引用赋值给外部的变量 `baz` ，此时 `baz` 指针指向的还是 `bar` ，因此哪怕它位于 `foo` 作用域之外，它还是能够获取到 `foo` 的内部变量。
4. `baz` 在外部被执行，`baz` 的内部可执行代码 `console.log` 向作用域请求获取 `a` 变量，本地作用域没有找到，继续请求父级作用域，找到了 `foo` 中的 `a` 变量，返回给 `console.log`，打印出 `2`。

闭包的执行看起来像是开发者使用的一个小小的 “作弊手段” ——**绕过了作用域的监管机制，从外部也能获取到内部作用域的信息**。闭包的这一特性极大地丰富了开发人员的编码方式，也提供了很多有效的运用场景。

## 闭包的应用场景

> 闭包的应用，大多数是在需要维护内部变量的场景下。

### 单例模式

单例模式是一种常见的涉及模式，它保证了一个类只有一个实例。实现方法一般是先判断实例是否存在，如果存在就直接返回，否则就创建了再返回。单例模式的好处就是避免了重复实例化带来的内存开销：

```js
// 单例模式
function Singleton() {
  this.data = "singleton";
}

Singleton.getInstance = (function() {
  var instance;

  return function() {
    if (instance) {
      return instance;
    } else {
      instance = new Singleton();
      return instance;
    }
  };
})();

var sa = Singleton.getInstance();
var sb = Singleton.getInstance();
console.log(sa === sb); // true
console.log(sa.data); // 'singleton'
```

### 模拟私有属性

`javascript` 没有 `java` 中那种 `public private` 的访问权限控制，对象中的所用方法和属性均可以访问，这就造成了安全隐患，内部的属性任何开发者都可以随意修改。虽然语言层面不支持私有属性的创建，但是我们可以用闭包的手段来模拟出私有属性：

```js
// 模拟私有属性
function getGeneratorFunc() {
  var _name = "John";
  var _age = 22;

  return function() {
    return {
      getName: function() {
        return _name;
      },
      getAge: function() {
        return _age;
      },
    };
  };
}

var obj = getGeneratorFunc()();
obj.getName(); // John
obj.getAge(); // 22
obj._age; // undefined
```

### 柯里化

柯里化（currying），是把接受多个参数的函数变换成接受一个单一参数（最初函数的第一个参数）的函数，并且返回接受余下的参数而且返回结果的新函数的技术。

```js
Function.prototype.bind = function(context = window) {
  if (typeof this !== "function") throw new Error("Error");
  let selfFunc = this;
  let args = [...arguments].slice(1);

  return function F() {
    // 因为返回了一个函数，可以 new F()，所以需要判断
    if (this instanceof F) {
      return new selfFunc(...args, arguments);
    } else {
      // bind 可以实现类似这样的代码 f.bind(obj, 1)(2)，所以需要将两边的参数拼接起来
      return selfFunc.apply(context, args.concat(arguments));
    }
  };
};
```

柯里化的优势之一就是 参数的复用，它可以在传入参数的基础上生成另一个全新的函数，来看下面这个类型判断函数：

```js
function typeOf(value) {
  return function(obj) {
    s;
    const map = {
      "[object Boolean]": "boolean",
      "[object Number]": "number",
      "[object String]": "string",
      "[object Function]": "function",
      "[object Array]": "array",
      "[object Date]": "date",
      "[object RegExp]": "regExp",
      "[object Undefined]": "undefined",
      "[object Null]": "null",
      "[object Object]": "object",
    };
    return map[Object.prototype.toString.call(obj)] === value;
  };
}

var isNumber = typeOf("number");
var isFunction = typeOf("function");
var isRegExp = typeOf("regExp");

isNumber(0); // => true
isFunction(function() {}); // true
isRegExp({}); // => false
```

通过向 `typeOf` 里传入不同的类型字符串参数，就可以生成对应的类型判断函数，作为语法糖在业务代码里重复使用。

## 闭包的问题

### 内存泄露

```js
function foo() {
  var a = 2;

  function bar() {
    console.log(a);
  }

  return bar;
}

var baz = foo();

baz(); // 这就形成了一个闭包
```

乍一看，好像没什么问题，然而，它却有可能导致 `内存泄露`。

我们知道，`javascript` 内部的垃圾回收机制用的是**引用计数收集**：即当内存中的一个变量被引用一次，计数就加一。垃圾回收机制会以固定的时间轮询这些变量，将计数为 `0` 的变量标记为失效变量并将之清除从而释放内存。

上述代码中，理论上来说， `foo` 函数作用域隔绝了外部环境，所有变量引用都在函数内部完成，`foo` 运行完成以后，内部的变量就应该被销毁，内存被回收。然而闭包导致了全局作用域始终存在一个 `baz` 的变量在引用着 `foo` 内部的 `bar` 函数，这就意味着 `foo` 内部定义的 `bar` 函数引用数始终为 `1`，垃圾运行机制就无法把它销毁。更糟糕的是，`bar` 有可能还要使用到父作用域 `foo` 中的变量信息，那它们自然也不能被销毁... JS 引擎无法判断你什么时候还会调用闭包函数，只能一直让这些数据占用着内存。

:::tip
这种由于闭包使用过度而导致的内存占用无法释放的情况，我们称之为：`内存泄露`。
:::

## 内存泄露

> 内存泄露 是指当一块内存不再被应用程序使用的时候，由于某种原因，这块内存没有返还给操作系统或者内存池的现象。内存泄漏可能会导致应用程序卡顿或者崩溃。

- 造成内存泄露的原因有很多，除了闭包以外，还有 **全局变量的无意创建**。开发者的本意是想将变量作为局部变量使用，然而忘记写 `var` 导致变量被泄露到全局中：

```js
function foo() {
  b = 2;
  console.log(b);
}

foo(); // 2

console.log(b); // 2
```

- 还有 `DOM` 的**事件绑定**，移除 `DOM` 元素前如果忘记了注销掉其中绑定的事件方法，也会造成内存泄露：

```js
const wrapDOM = document.getElementById("wrap");
wrapDOM.onclick = function(e) {
  console.log(e);
};

// some codes ...

// remove wrapDOM
wrapDOM.parentNode.removeChild(wrapDOM);
```

## 内存泄露的排查手段

我们借助谷歌的开发者工具， Chrome 浏览器，F12 打开开发者工具来看看如何排查。

**Performance**

![Performance1](https://img-blog.csdnimg.cn/20210507140002773.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

![Performance2](https://img-blog.csdnimg.cn/2021050714004084.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

点击这个按钮启动记录，然后切换到网页进行操作，录制完成后点击 `stop` 按钮，开发者工具会从录制时刻开始记录当前应用的各项数据情况。

![Performance3](https://img-blog.csdnimg.cn/2021050714012452.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

选中`JS Heap`，下面展现出来的一条蓝线，就是代表了这段记录过程中，JS 堆内存信息的变化情况。

有大佬说，根据这条蓝线就可以判断是否存在内存泄漏的情况：**如果这条蓝线一直成上升趋势，那基本就是内存泄漏了**。其实我觉得这么讲有失偏颇，JS 堆内存占用率上升并不一定就是内存泄漏，只能说明有很多未被释放的内存而已，至于这些内存是否真的在使用，还是说确实是内存泄漏，还需要进一步排查。

![Performance4](https://img-blog.csdnimg.cn/20210507140222654.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

**memory**

借助开发者工具的 Memory 选项，可以更精确地定位内存使用情况。

![memory1](https://img-blog.csdnimg.cn/20210507140313678.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

![memory2](https://img-blog.csdnimg.cn/20210507140336990.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

当生成了第一个快照的时候，开发者工具窗口已经显示了很详细的内存占用情况。

**字段说明:**

|      字段       | 描述                                                           |
| :-------------: | :------------------------------------------------------------- |
|  `Constructor`  | 占用内存的资源类型                                             |
|   `Distance`    | 当前对象到根的引用层级距离                                     |
| `Shallow Size`  | 对象所占内存（不包含内部引用的其它对象所占的内存）(单位：字节) |
| `Retained Size` | 对象所占总内存（包含内部引用的其它对象所占的内存）(单位：字节) |

将每项展开可以查看更详细的数据信息。

我们再次切回网页，继续操作几次，然后再次生成一个快照。

![memory3](https://img-blog.csdnimg.cn/20210507140701423.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

![memory4](https://img-blog.csdnimg.cn/20210507140719316.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

![memory5](https://img-blog.csdnimg.cn/20210507140739301.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

这边需要特别注意这个 `#Delta` ，如果是正值，就代表新生成的内存多，释放的内存少。其中的闭包项，如果是正值，就说明存在内存泄漏。

![memory6](https://img-blog.csdnimg.cn/20210507140819194.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

下面我们到代码里找一个内存泄漏的问题：

![memory7](https://img-blog.csdnimg.cn/20210507141448924.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

![memory8](https://img-blog.csdnimg.cn/20210507141509447.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

## 内存泄露的解决方案

1. 使用严格模式，避免不经意间的全局变量泄露：

```js
"use strict";

function foo() {
  b = 2;
}

foo(); // ReferenceError: b is not defined
```

2. 关注 `DOM` 生命周期，在销毁阶段记得解绑相关事件：

```js
const wrapDOM = document.getElementById("wrap");
wrapDOM.onclick = function(e) {
  console.log(e);
};

// some codes ...

// remove wrapDOM
wrapDOM.onclick = null;
wrapDOM.parentNode.removeChild(wrapDOM);
```

或者可以使用事件委托的手段统一处理事件，减少由于事件绑定带来的额外内存开销：

```js
document.body.onclick = function(e) {
  if (isWrapDOM) {
    // ...
  } else {
    // ...
  }
};
```

3. 避免过度使用闭包。

## 执行上下文

`javascript`标准把一段代码(包括函数),执行所需的所有信息定义为`执行上下文`,并且为函数规定了用来保存定义时上下文的私有属性[Environment]。

**以下是在 ES2018 中的定义:**

- `lexical environment:` 词法环境,当前变量或者 this 值时使用。

- `variable environment:` 变量环境,当声明变量时使用。

- `code environment state:` 用于恢复代码执行位置。

- `Function:` 执行的任务是函数时使用,表示正在执行的函数。

- `ScriptOrModule:` 执行的任务是脚本或者模块时使用,表示正在被执行的代码。

- `Realm:` 使用的基础库和内置对象实例。

- `Generator:` 仅生成器上下文有这个属性,表示当前生成器。

当一个函数执行时,会创建一条新的执行环境,记录的外层词法(`outer lexical environment`)会被设置成函数的[Environment]。

上述的这个动作就是`切换上下文`。

## 关于 this 对象

在闭包中使用`this`对象也可能会导致一些问题。我们知道,`this`对象是在运行时基于函数的执行环境绑定的：在全局函数中，`this`等于`window`，而当函数被作为某个对象的方法调用时，`this`等于那个对象。

<font color="#f44">不过，匿名函数的执行环境具有全局性，因此其 this 对象通常指向 window。</font>

但有时候由于编写闭包的方式不同，这一点可能不会那么明显。

```javascript
var name = "The Window";
var object = {
  name: "My Object",
  getNameFunc: function() {
    return function() {
      return this.name;
    };
  },
};
alert(object.getNameFunc()()); //"The Window"（在非严格模式下）
```

## 内存泄漏

具体来说，如果闭包的作用域链中保存着一个`HTML`元素，那么就意味着该元素将无法被销毁。来看下面的例子:

```javascript
function assignHandler() {
  var element = document.getElementById("someElement");
  var id = element.id;
  element.onclick = function() {
    alert(id);
  };
  element = null;
}
```

在上面的代码中，通过把`element.id`的一个副本保存在一个变量中，并且在闭包中引用该变量消除了循环引用。但仅仅做到这一步，还是不能解决内存泄漏的问题。

:::tip
必须要记住：闭包会引用包含函数的整个活动对象，而其中包含着`element`。即使闭包不直接引用`element`，包含函数的活动对象中也
仍然会保存一个引用。因此，有必要把`element`变量设置为 `null`。这样就能够解除对`DOM`对象的引用，顺利地减少其引用数，确保正常回收其占用的内存。
:::

## 模仿块级作用域

**早期的`JavaScript`没有块级作用域的概念**。这意味着在块语句中定义的变量，实际上是在包含函数中而非语句中创建的，来看下面的例子:

```javascript
function outputNumbers(count) {
  for (var i = 0; i < count; i++) {
    alert(i);
  }
  alert(i); // 计数
}
```

这个函数中定义了一个`for`循环，而变量`i`的初始值被设置为 0。

在`JavaScrip`中，变量`i`是定义在 `ouputNumbers()`的活动对象中的，因此从它有定义开始，就可以在函数内部随处访问它。即使像下面这样错误地重新声明同一个变量，也不会改变它的值。

```javascript
function outputNumbers(count) {
  for (var i = 0; i < count; i++) {
    alert(i);
  }
  var i; //重新声明变量
  alert(i); //计数
}
outputNumbers(10); // 0 1 2 3 4 5 6 7 8 9 10
```

:::tip
匿名函数可以用来模仿块级作用域并避免这个问题。用作块级作用域（通常称为私有作用域）的匿名函数的语法如下所示:
:::

```javascript
(function() {
  //这里是块级作用域
})();
```

无论在什么地方，只要临时需要一些变量，就可以使用私有作用域，例如：

```javascript
function outputNumbers(count) {
  (function() {
    for (var i = 0; i < count; i++) {
      alert(i);
    }
  })();
  alert(i); // 导致一个错误！
}
```

### 引申: 为什么有的地方会出现以下这种在函数前面加上`;`的代码?

在此之前先看下面这段代码:

```js
(function() {
  console.log(1111);
})();

(function() {
  console.log(2222);
})();
```

如果上一行代码不写分号的话,括号就会被解释为上一行代码最末的函数调用,产生完全不符合预期,并且难以调式的行为,加号等运算符也有类似的问题。所以一些推荐不加分号的代码风格规范,会要求在括号前面加上分号。

```js
(function() {
  console.log(1111);
})();
```

因此也就产生了上述的这种代码风格,当然一种更加推荐的做法是使用`void`关键字。

```js
void (function() {
  console.log(1111);
})();
```

这样既能有效的避免了语法的问题,同时,语义上`void运算符`表示忽略后面表达式的值,变成了`undefined`,我们确认也不关心`IIFE`的返回值,所以语义也更为合理。

## 私有变量

严格来讲，`JavaScript` 中没有私有成员的概念；所有对象属性都是公有的。不过，倒是有一个私有变量的概念。任何在函数中定义的变量，都可以认为是私有变量，因为不能在函数的外部访问这些变量。

私有变量包括`函数的参数`、`局部变量`和`在函数内部定义的其他函数`。来看下面的例子：

```javascript
function add(num1, num2) {
  var sum = num1 + num2;
  return sum;
}
```

我们把有权访问私有变量和私有函数的公有方法称为`特权方法（privileged method）`。

有两种在对象上创建特权方法的方式。第一种是在构造函数中定义特权方法，基本模式如下：

```javascript
function MyObject() {
  // 私有变量和私有函数
  var privateVariable = 10;
  function privateFunction() {
    return false;
  }
  // 特权方法
  this.publicMethod = function() {
    privateVariable++;
    return privateFunction();
  };
}
```

这个模式在构造函数内部定义了所有私有变量和函数。然后，又继续创建了能够访问这些私有成员的特权方法。能够在构造函数中定义特权方法，是因为特权方法作为闭包有权访问在构造函数中定义的所有变量和函数。

对这个例子而言，变量`privateVariable` 和函数 `privateFunction()`只能通过特权方法`publicMethod()`来访问。

在创建 MyObject 的实例后，除了使用 `publicMethod()`这一个途径外，没有任何办法可以直接访问 `privateVariable` 和 `privateFunction()`。

**利用私有和特权成员，可以隐藏那些不应该被直接修改的数据，例如：**

```javascript
function Person(name) {
  this.getName = function() {
    return name;
  };
  this.setName = function(value) {
    name = value;
  };
}

var person = new Person("Nicholas");
alert(person.getName()); // "Nicholas"
person.setName("Greg");
alert(person.getName()); // "Greg"
```

## 小结

1. javascript 语言层面只原生支持两种作用域类型：`全局作用域` 和 `函数作用域` 。全局作用域程序运行就有，函数作用域只有定义函数的时候才有，它们之间是包含的关系。

2. 作用域之间是可以嵌套的，我们把这种嵌套关系称为 **作用域链**。

3. 可执行代码在作用域中查询变量时，只能查询 **本地作用域** 及 **上层作用域**，不能查找内部的函数作用域。JS 引擎搜索变量时，会先询问本地作用域，找到即返回，找不到再去询问上层作用域...层层往上，直到全局作用域。

4. `javascript` 中使用的是 `词法作用域`，因此函数作用域的范围在函数定义时就已经被确定，和函数在哪执行没有关系。

### 当在函数内部定义了其他函数时，就创建了闭包。闭包有权访问包含函数内部的所有变量，原理如下:

- 在后台执行环境中，闭包的作用域链包含着`它自己的作用域`、`包含函数的作用域`和`全局作用域。`
- 通常，函数的作用域及其所有变量都会在函数执行结束后被销毁。
- 但是，当函数返回了一个闭包时，这个函数的作用域将会一直在内存中保存到闭包不存在为止。
- **使用闭包`可以在 JavaScript 中模仿块级作用域（JavaScript 本身没有块级作用域的概念），`要点如下:** - 创建并立即调用一个函数，这样既可以执行其中的代码，又不会在内存中留下对该函数的引用。 - 结果就是函数内部的所有变量都会被立即销毁——除非将某些变量赋值给了包含作用域（即外部作用域）中的变量。
- **闭包还可以用于在对象中创建私有变量，相关概念和要点如下。** - 即使 JavaScript 中没有正式的私有对象属性的概念，但可以使用闭包来实现公有方法，而通过公有方法可以访问在包含作用域中定义的变量。 - 有权访问私有变量的公有方法叫做特权方法。 - 可以使用`构造函数模式`、`原型模式`来实现自定义类型的特权方法，也可以使用`模块模式`、`增强的模块模式`来实现单例的特权方法。

JavaScript 中的`函数表达式`和`闭包`都是极其有用的特性，利用它们可以实现很多功能。

不过，因为创建闭包必须维护额外的作用域，所以过度使用它们可能会占用大量内存。
