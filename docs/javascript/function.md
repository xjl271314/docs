# 函数

函数是javascript中相当重要的一部分,我们通过以下几个方面来理解他。

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
function factorial(num){
    if (num <=1) {
        return 1;
    } else {
        return num * arguments.callee(num-1) // 指向了factorial
	}
}
```

每个函数都包含两个属性：`length` 和 `prototype`。

其中，`length`属性表示函数希望接收的命名参数的个数，如下面的例子所示:

```js
function sayName(name){
    alert(name);
}
function sum(num1, num2){
    return num1 + num2;
}
function sayHi(){
    alert("hi");
}
alert(sayName.length);      //1
alert(sum.length);          //2
alert(sayHi.length);        //0
```

:::tip
在 `ECMAScript5` 中，`prototype`属性是不可枚举的，因此使用`for-in`无法发现。
函数是对象，函数名是指针。
:::

## apply与call

每个函数都包含两个非继承而来的方法:`apply()`和 `call()`。

> 这两个方法的用途都是在特定的作用域中调用函数，实际上等于设置函数体内 `this `对象的值。

:::tip
使用` call()（或 apply()）`来扩充作用域的最大好处，就是对象不需要与方法有任何耦合关系。
:::

- `apply()`方法接收两个参数:一个是在其中运行函数的作用域，另一个是参数数组。第二个参数可以是 `Array` 的实例，也可以是 `arguments` 对象。例如:

```js
function sum(num1, num2){
    return num1 + num2;
}
function callSum1(num1, num2){
    return sum.apply(this, arguments);
}
function callSum2(num1, num2){
    return sum.apply(this, [num1, num2]);
}
alert(callSum1(10,10));   // 20
alert(callSum2(10,10));   // 20
```

- `call()`方法与 `apply()`方法的作用相同，它们的区别仅在于接收参数的方式不同。对于 `call() `方法而言，第一个参数是` this` 值没有变化，变化的是传递给函数的参数必须逐个列举出来。

```js
function sum(num1, num2){
    return num1 + num2;
}
function callSum(num1, num2){
    return sum.call(this, num1, num2);
}
alert(callSum(10,10));   // 20
```

## 函数表达式

```js
// 函数声明
function hello(type){
    return 'hello world';
}

// 函数表达式
hello(); // VM1155:1 Uncaught ReferenceError: Cannot access 'hello' before initialization

const hello = function(){
    return 'hello world';
}
```

:::tip
**函数声明与函数表达式的区别：**

函数声明存在变量提升，可以先使用再声明。函数表达式必须先定义再使用。
:::

## 闭包

> **闭包是指一个绑定了执行环境的函数。**

创建闭包的常见方式，就是在一个函数内部创建另一个函数。

## 执行上下文

`javascript`标准把一段代码(包括函数),执行所需的所有信息定义为`执行上下文`,并且为函数规定了用来保存定义时上下文的私有属性[Environment]。

**以下是在ES2018中的定义:**

- `lexical environment:` 词法环境,当前变量或者 this 值时使用。

- `variable environment:` 变量环境,当声明变量时使用。

- `code environment state:` 用于恢复代码执行位置。

- `Function:` 执行的任务是函数时使用,表示正在执行的函数。

- `ScriptOrModule:` 执行的任务是脚本或者模块时使用,表示正在被执行的代码。

- `Realm:` 使用的基础库和内置对象实例。

- `Generator:` 仅生成器上下文有这个属性,表示当前生成器。

当一个函数执行时,会创建一条新的执行环境,记录的外层词法(`outer lexical environment`)会被设置成函数的[Environment]。

上述的这个动作就是`切换上下文`。

## 关于this对象

在闭包中使用`this`对象也可能会导致一些问题。我们知道,`this`对象是在运行时基于函数的执行环境绑定的：在全局函数中，`this`等于`window`，而当函数被作为某个对象的方法调用时，`this`等于那个对象。

<font color="#f44">不过，匿名函数的执行环境具有全局性，因此其 this 对象通常指向 window。</font>

但有时候由于编写闭包的方式不同，这一点可能不会那么明显。

```javascript
var name = "The Window"; 
var object = { 
    name : "My Object", 
    getNameFunc : function(){ 
        return function(){ 
            return this.name; 
        }; 
    } 
};
alert(object.getNameFunc()()); //"The Window"（在非严格模式下）
```

## 内存泄漏

具体来说，如果闭包的作用域链中保存着一个`HTML`元素，那么就意味着该元素将无法被销毁。来看下面的例子:

```javascript
function assignHandler(){ 
    var element = document.getElementById("someElement"); 
    var id = element.id; 
    element.onclick = function(){ 
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
function outputNumbers(count){ 
    for (var i=0; i < count; i++){ 
        alert(i); 
    } 
    alert(i); // 计数
}
```

这个函数中定义了一个`for`循环，而变量`i`的初始值被设置为 0。

在`JavaScrip`中，变量`i`是定义在 `ouputNumbers()`的活动对象中的，因此从它有定义开始，就可以在函数内部随处访问它。即使像下面这样错误地重新声明同一个变量，也不会改变它的值。

```javascript
function outputNumbers(count){ 
    for (var i = 0; i < count; i++){ 
        alert(i); 
    } 
    var i; //重新声明变量
    alert(i); //计数
}
outputNumbers(10);// 0 1 2 3 4 5 6 7 8 9 10
```

:::tip
匿名函数可以用来模仿块级作用域并避免这个问题。用作块级作用域（通常称为私有作用域）的匿名函数的语法如下所示:
:::

```javascript
(function(){ 
 //这里是块级作用域
})();
```

无论在什么地方，只要临时需要一些变量，就可以使用私有作用域，例如：

```javascript
function outputNumbers(count){ 
    (function () { 
 	    for (var i=0; i < count; i++){ 
 	        alert(i); 
        }    
    })(); 
    alert(i); // 导致一个错误！
}
```

### 引申: 为什么有的地方会出现以下这种在函数前面加上`;`的代码?

在此之前先看下面这段代码:

```js
(function(){
    console.log(1111);
}());

(function(){
    console.log(2222);
})();
```

如果上一行代码不写分号的话,括号就会被解释为上一行代码最末的函数调用,产生完全不符合预期,并且难以调式的行为,加号等运算符也有类似的问题。所以一些推荐不加分号的代码风格规范,会要求在括号前面加上分号。

```js
;(function(){
    console.log(1111);
}())
```

因此也就产生了上述的这种代码风格,当然一种更加推荐的做法是使用`void`关键字。

```js
void function(){
    console.log(1111);
}();
```

这样既能有效的避免了语法的问题,同时,语义上`void运算符`表示忽略后面表达式的值,变成了`undefined`,我们确认也不关心`IIFE`的返回值,所以语义也更为合理。


## 私有变量

严格来讲，`JavaScript` 中没有私有成员的概念；所有对象属性都是公有的。不过，倒是有一个私有变量的概念。任何在函数中定义的变量，都可以认为是私有变量，因为不能在函数的外部访问这些变量。

私有变量包括`函数的参数`、`局部变量`和`在函数内部定义的其他函数`。来看下面的例子：

```javascript
function add(num1, num2){ 
	var sum = num1 + num2; 
	return sum; 
}
```

我们把有权访问私有变量和私有函数的公有方法称为`特权方法（privileged method）`。

有两种在对象上创建特权方法的方式。第一种是在构造函数中定义特权方法，基本模式如下：

```javascript
function MyObject(){ 
    // 私有变量和私有函数
    var privateVariable = 10; 
    function privateFunction(){ 
        return false; 
    } 
    // 特权方法
    this.publicMethod = function (){ 
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
function Person(name){ 
	this.getName = function(){ 
 		return name; 
 	}; 
 	this.setName = function (value) { 
 		name = value; 
 	}; 
} 

var person = new Person("Nicholas"); 
alert(person.getName()); // "Nicholas" 
person.setName("Greg"); 
alert(person.getName()); // "Greg"
```

## 小结

### 当在函数内部定义了其他函数时，就创建了闭包。闭包有权访问包含函数内部的所有变量，原理如下:

- 在后台执行环境中，闭包的作用域链包含着`它自己的作用域`、`包含函数的作用域`和`全局作用域。`
- 通常，函数的作用域及其所有变量都会在函数执行结束后被销毁。
- 但是，当函数返回了一个闭包时，这个函数的作用域将会一直在内存中保存到闭包不存在为止。
- **使用闭包`可以在 JavaScript 中模仿块级作用域（JavaScript 本身没有块级作用域的概念），`要点如下:**
	- 创建并立即调用一个函数，这样既可以执行其中的代码，又不会在内存中留下对该函数的引用。
	- 结果就是函数内部的所有变量都会被立即销毁——除非将某些变量赋值给了包含作用域（即外部作用域）中的变量。
- **闭包还可以用于在对象中创建私有变量，相关概念和要点如下。**
	- 即使 JavaScript 中没有正式的私有对象属性的概念，但可以使用闭包来实现公有方法，而通过公有方法可以访问在包含作用域中定义的变量。
	- 有权访问私有变量的公有方法叫做特权方法。
	- 可以使用`构造函数模式`、`原型模式`来实现自定义类型的特权方法，也可以使用`模块模式`、`增强的模块模式`来实现单例的特权方法。

JavaScript 中的`函数表达式`和`闭包`都是极其有用的特性，利用它们可以实现很多功能。

不过，因为创建闭包必须维护额外的作用域，所以过度使用它们可能会占用大量内存。



