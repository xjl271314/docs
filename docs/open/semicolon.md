# 语句末尾到底用不用分号

- 2020.11.09

这是一个非常经典的口水问题，“加分号”党和“不写分号”党之间的战争，可谓是经久不息。

实际上，行尾使用分号的风格来自于 `Java`，也来自于 C 语言和 C++，这一设计最初是为了`降低编译器的工作负担`。

但是，从今天的角度来看，行尾使用分号其实是一种语法噪音，恰好 `JavaScript` 语言又提供了相对可用的分号自动补全规则，所以，很多 `JavaScript` 的程序员都是倾向于不写分号。


## 自动插入分号规则

自动插入分号规则其实独立于所有的语法产生式定义，它的规则说起来非常简单，只有三条。

- 要有换行符，且下一个符号是不符合语法的，那么就尝试插入分号。

- 有换行符，且语法中规定此处不能有换行符，那么就自动插入分号。

- 源代码结束处，不能形成完整的脚本或者模块结构，那么就自动插入分号。

```js

let a = 1
void function(a){
    console.log(a);
}(a);
```

在这个例子中，第一行的结尾处有换行符，接下来 void 关键字接在 1 之后是不合法的，这命中了我们的第一条规则，因此会在 void 前插入分号。


```js
var a = 1, b = 1, c = 1;
a
++
b
++
c
```

第二行代码a后面跟了++,这是一个合法的语法,具体的规则如下:

```
UpdateExpression[Yield, Await]:
    LeftHandSideExpression[?Yield, ?Await]
    LeftHandSideExpression[?Yield, ?Await][no LineTerminator here]++
    LeftHandSideExpression[?Yield, ?Await][no LineTerminator here]--
    ++UnaryExpression[?Yield, ?Await]
    --UnaryExpression[?Yield, ?Await]
```

于是，这里 a 的后面就要插入一个分号了。所以这段代码最终的结果，b 和 c 都变成了 2，而 a 还是 1。

```js
(function(a){
    console.log(a);
})()
(function(a){
    console.log(a);
})()
```

这个例子是比较有实际价值的例子，这里两个 function 调用的写法被称作 `IIFE（立即执行的函数表达式）`，是个常见技巧。

我们来看第三行结束的位置，`JavaScript` 引擎会认为函数返回的可能是个函数，那么，在后面再跟括号形成函数调用就是合理的，因此这里不会自动插入分号。

## no LineTerminator here 规则

> 表示它所在的结构中的这一位置不能插入换行符。

到这里我们已经讲清楚了分号自动插入的规则，但是我们要想彻底掌握分号的奥秘，就必须要对 JavaScript 的语法定义做一些数据挖掘工作。

![no LineTerminator here 规则](https://img-blog.csdnimg.cn/2020110915572477.jpg?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70#pic_center)

### 带标签的 continue 语句，不能在 continue 后插入换行。

```js
outer:for(var j = 0; j < 10; j++)
    for(var i = 0; i < j; i++)
        continue /*no LineTerminator here*/ outter
```

### break 跟 continue 是一样的，break 后也不能插入换行：

```js
outer:for(var j = 0; j < 10; j++)
    for(var i = 0; i < j; i++)
        break /*no LineTerminator here*/ outter
```

### 以及，throw 和 Exception 之间也不能插入换行符：

```js
throw/*no LineTerminator here*/new Exception("error")
```

### 凡是 async 关键字，后面都不能插入换行符：

```js
async/*no LineTerminator here*/function f(){

}
const f = async/*no LineTerminator here*/x => x*x
```

### 箭头函数的箭头前，也不能插入换行：

```js
const f = x/*no LineTerminator here*/=> x*x
```

### yield 之后，不能插入换行：

```js
function *g(){
    var i = 0;
    while(true)
        yield/*no LineTerminator here*/i++;
}
```