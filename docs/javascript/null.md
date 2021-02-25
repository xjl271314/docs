# null、underfined、void 0

- 2020.11.05

> 我们首先要明白的是,`javascript`中变量只声明不赋值的话默认就是`undefined`。

`undefined`表示未定义,它的类型只有一个值,就是 `undefined`。

`undefined`值是派生自`null`值的，因此`ECMA-262`规定对它们的相等性测试要返回`true`。

**对于尚未声明过的变量，只能使用`typeof`操作符检测其数据类型(对未经声明的变量调用`delete`不会导致错误，但这样做没什么实际意义，在严格模式下确实会导致错误)。**

```js
null == undefined  // true 
null === undefined // false
```

如前所述，无论在什么情况下都没有必要把一个变量的值显式地设置为`undefined`，可是同样的规则对`null`却不适用。

:::tip
<font color="#ff4400">换句话说，只要意在保存对象的变量还没有真正保存对象，就应该明确地让该变量保存`null`值。</font>

这样做不仅可以体现`null`作为空对象指针的惯例，而且也有助于进一步区分`null`和`undefined`。
:::

## void 0 与 undefined

在js中`undefined`是一个变量而并非是一个关键字所以可能存在无意中被篡改的问题,在这种情况下我们可以使用`void 0` 来代替 `undefined`的值。


或者我们想要返回一个`undefined`的计算值的时候。

```js
function getYear() {
  return 2020;
};

console.log(getYear());
// Output: 2020

console.log(void getYear());
// Output: undefined

// Useful use case
button.onclick = () => void getYear();
```