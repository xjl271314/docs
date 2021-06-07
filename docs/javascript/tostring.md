# `toString()`方法

- 2020.11.5

### **要把一个值转换为一个字符串有两种方式。**

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

### **`String()`函数遵循下列转换规则：**

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

`String()`方法可以执行,`toString()`方法则会报错。
:::

### 引申: 字符串是否有最大长度?

`String`用于表示文本数据。`String`有个最大长度是 2^53 - 1,有趣的是这个所谓的最大长度,并不是我们理解中的字符数。

因为 String 的意义并非字符串,二是字符串的 UTF16 编码,我们字符串的操作 charAt、charCodeAt、length 等方法针对的都是 UTF16 编码。所以,字符串的最大长度,实际上是受字符串的编码长度影响的。

然而,现在字符集国际标准,字符是以`Unicode`的方式表示的,每一个`Unicode`的码表示一个字符,理论上`Unicode`的范围是无限的。

### 试题: 12.toString()输出结果是什么?为什么?

```js
// Uncaught SyntaxError: Invalid or unexpected token
12.toString();

// 12
12 .toString();

// 12
12..toString();

// Uncaught SyntaxError: Invalid or unexpected token
12...toString();
```

`12.` 会被当作省略了小数点后面部分的数字，而单独看成一个整体,所以我们要想让`点`单独成为一个 `token`，就要加入空格。

### 使用小技巧

:::tip
在 Javascript 中,可以使用反斜杠进行字符串的折行编写，有些时候这样做可以使你的代码看起来更加漂亮，示例如下:

```js
// 使用反斜杠进行字符串的折行
var text =
  "啊哈哈哈哈\
  你猜我是谁?\
  猜对了我就给你一颗糖\
";
```

:::
