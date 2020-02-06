# `var`关键字与变量生命周期

```js
var message;
```

未赋值的变量初始值为`undefined`。

```js
var message = "hi"; 
```

有一点必须注意，即用`var`操作符定义的变量将成为定义该变量的作用域中的局部变量。

也就是说，<font color="#ff4400">如果在函数中使用`var`定义一个变量，那么这个变量在函数退出后就会被销毁。</font>

```js
function test(){ 
 var message = "hi"; // 局部变量
} 
test(); 
alert(message); // 错误！
```

这里，变量`message`是在函数中使用`var`定义的。当函数被调用时，就会创建该变量并为其赋值。而在此之后，这个变量又会立即被销毁，因此例子中的下一行代码就会导致错误。

不过，可以像下面这样省略`var`操作符，从而创建一个全局变量：

```js
function test(){ 
 message = "hi"; // 全局变量
} 
test(); 
alert(message); // "hi" 
```

#### 虽然省略`var`关键字声明变量会将变量声明为全局变量,但是并不推荐。因为在局部作用域中定义的全局变量很难维护。给未声明的变量赋值在严格模式下会抛出`ReferenceError`错误。
