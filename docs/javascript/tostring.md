# `toString()`方法

> **要把一个值转换为一个字符串有两种方式。**
1. 第一种是使用几乎每个值都有的`toString()`方法
2. 还可以使用转型函数`String()`，这个函数能够将任何类型的值转换为字符串。

`数值`、`布尔值`、`对象`和`字符串值`都有`toString()`方法。但`null`和 `undefined`值没有这个方法。

多数情况下，调用`toString()`方法不必传递参数。但是，在调用数值的`toString()`方法时，可以传递一个参数：`输出数值的基数`。

```js
var num = 10; 
alert(num.toString()); // "10" 
alert(num.toString(2)); // "1010" 
alert(num.toString(8)); // "12" 
alert(num.toString(10)); // "10" 
alert(num.toString(16)); // "a" 
```

**`String()`函数遵循下列转换规则：**
- 如果值有`toString()`方法，则调用该方法（没有参数）并返回相应的结果；
- 如果值是`null`，则返回`"null"`；
- 如果值是`undefined`，则返回`"undefined"`。 

```js
var value1 = 10; 
var value2 = true; 
var value3 = null; 
var value4; 
alert(String(value1)); // "10" 
alert(String(value2)); // "true" 
alert(String(value3)); // "null" 
alert(String(value4)); // "undefined" 
```

::: tip
`toString()方法`与`String()方法`的一个区别就是转换`null`与`undefiend`类型时的区别。
:::