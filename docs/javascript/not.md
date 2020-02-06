# 逻辑非 !!

逻辑非操作符也可以用于将一个值转换为与其对应的布尔值。而同时使用两个逻辑非操作符，实际上就会模拟`Boolean()`转型函数的行为。

其中，第一个逻辑非操作会基于无论什么操作数返回一个布尔值，而第二个逻辑非操作则对该布尔值求反，于是就得到了这个值真正对应的布尔值。

```js
alert(!!"blue"); // true 
alert(!!0); // false 
alert(!!NaN); // false 
alert(!!""); // false 
alert(!!12345); // true 
null == undefined; // true
null === undefined; // false
```