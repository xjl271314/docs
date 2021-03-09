# 数值转换

**由于保存浮点数值需要的内存空间是保存整数值的两倍，因此`ECMAScript`会不失时机地将浮点数值转换为整数值。**

有3个函数可以把非数值转换为数值：`Number()`、`parseInt()`和 `parseFloat()`。

第一个函数，即转型函数`Number()`可以用于任何数据类型，而另两个函数则专门用于把字符串转换成数值。

##  `Number()`函数的转换规则如下:
 - 如果是`Boolean`值`true`和`false`将分别被转换为 1 和 0。
 - 如果是数字值，只是简单的传入和返回。
 - 如果是`null`值，返回 0。
 - 如果是`undefined`，返回 `NaN`。
 - 如果是字符串，遵循下列规则：
    - 如果字符串中只包含数字，则将其转换为十进制数值，即"1"会变成 1，"123"会变成 123，而"011"会变成 11（注意：前导的零被忽略了）；
	- 如果字符串中包含有效的浮点格式，如"1.1"，则将其转换为对应的浮点数值（同样，也会忽略前导零）；
	- 如果字符串中包含有效的十六进制格式，例如"0xf"，则将其转换为相同大小的十进制整数值；
    - 如果字符串是空的（不包含任何字符），则将其转换为 0；
    - 如果字符串中包含除上述格式之外的字符，则将其转换为`NaN`。
    - 如果是对象，则调用对象的`valueOf()`方法，然后依照前面的规则转换返回的值。如果转换的结果是`NaN`，则调用对象的`toString()`方法，然后再次依照前面的规则转换返回的字符串值。

## `parseInt()转换规则`:
`parseInt()`函数在转换字符串时，更多的是看其是否符合数值模式。

它会忽略字符串前面的空格，直至找到第一个非空格字符。如果第一个字符不是数字字符或者负号，`parseInt()`就会返回`NaN`；

也就是说，用`parseInt()`转换空字符串会返回`NaN`。

```js
parseInt('') //NaN
Number('') //0
```

如果第一个字符是数字字符，`parseInt()`会继续解析第二个字符，直到解析完所有后续字符或者遇到了一个非数字字符。

例如，"1234blue"会被转换为1234，因为"blue"会被完全忽略。类似地，"22.5"会被转换为22，因为小数点并不是有效的数字字符。

```js
var num1 = parseInt("1234blue"); // 1234 
var num2 = parseInt(""); // NaN 
var num3 = parseInt("0xA"); // 10（十六进制数）
var num4 = parseInt(22.5); // 22 
var num5 = parseInt("070"); // 56（八进制数）
var num6 = parseInt("70"); // 70（十进制数）
var num7 = parseInt("0xf"); // 15（十六进制数）
```

**为了消除在使用`parseInt()`函数时可能导致的上述困惑，可以为这个函数提供第二个参数：转换时使用的基数（即多少进制）。**

如果知道要解析的值是十六进制格式的字符串，那么指定基数16作为第二个参数，可以保证得到正确的结果，例如：

```js
var num = parseInt("0xAF", 16); //175 
```

## `parseFloat()转换规则`:

与`parseInt()`函数类似，`parseFloat()`也是从第一个字符开始解析每个字符。而且也是一直解析到字符串末尾，或者解析到遇见一个无效的浮点数字字符为止。

也就是说，字符串中的第一个小数点是有效的，而第二个小数点就是无效的了，因此它后面的字符串将被忽略。

举例来说，"22.34.5"将会被转换为22.34。

<font color="#ff0044">由于`parseFloat()`只解析十进制值，因此它没有用第二个参数指定基数的用法。</font>

**最后还要注意一点：如果字符串包含的是一个可解析为整数的数（没有小数点，或者小数点后都是零），`parseFloat()`会返回整数。**

```js
var num1 = parseFloat("1234blue"); //1234 （整数）
var num2 = parseFloat("0xA"); //0 
var num3 = parseFloat("22.5"); //22.5 
var num4 = parseFloat("22.34.5"); //22.34 
var num5 = parseFloat("0908.5"); //908.5 
var num6 = parseFloat("3.125e7"); //31250000 
```

## + 运算符的转换规则

+操作符在js中比较特殊，执行+操作符时：

1. 当一侧为`String`类型，被识别为`字符串拼接`，并会优先将另一侧转换为字符串类型。
2. 当一侧为`Number`类型，另一侧为`原始类型`，则将原始类型转换为Number类型。
3. 当一侧为`Number`类型，另一侧为`引用类型`，将引用类型和Number类型转换成字符串后拼接。

```js
123 + '123' // 123123   （规则1）
123 + null  // 123    （规则2）
123 + true // 124    （规则2）
123 + {}  // 123[object Object]    （规则3）
```

## 数值比较运算

### 1. NaN

`NaN`和其他任何类型比较永远返回`false`(包括和他自己)。

```js
NaN == NaN // false
```

### 2. Boolean

`Boolean`和其他任何类型比较，`Boolean`首先被转换为`Number`类型。

```js
true == 1  // true 
true == '2'  // false
true == ['1']  // true
true == ['2']  // false
```

:::tip
这也是为什么undefined、null和布尔值比较返回false的原因。

false首先被转换成0。

```js
undefined == false // false
null == false // false
```

:::

### 3. String和Number

`String`和 `Number`比较，先将`String`转换为`Number`类型。

```js
123 == '123' // true
'' == 0 // true
```

### 4. null和undefined

`null == undefined` 比较结果是true，除此之外，null、undefined和其他任何结果的比较值都为false。

```js
null == undefined // true
null == '' // false
null == 0 // false
null == false // false
undefined == '' // false
undefined == 0 // false
undefined == false // false
```

### 5. 原始类型和引用类型

当原始类型和引用类型做比较时，对象类型会依照`ToPrimitive`规则转换为原始类型:

```js
'[object Object]' == {} // true
'1,2,3' == [1, 2, 3] // true
```

:::tip
这里有一个常见的面试题:

```js
[] == ![] // true
```
!的优先级高于==，![]首先会被转换为false，然后根据上面第三点，false转换成Number类型0，左侧[]转换为0，两侧比较相等。

:::

同理:

```js
[null] == false // true
[undefined] == false // true
```

:::tip

一道有意思的面试题：

**如何让：a == 1 && a == 2 && a == 3?**

```js
// 解法1
const a = {
   value:[3,2,1],
   valueOf: function () {return this.value.pop(); },
} 
// 解法2
const a = {
  i: 1,
  toString: function () {
    return a.i++;
  }
}
// 解法3
let val = 0;

Object.defineProperty(window, 'a', {
  get: function() {
    return ++val;
  }
})
```
:::







