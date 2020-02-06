# `for-in`语句

`for-in`语句是一种精准的迭代语句，可以用来枚举对象的属性。

> for (property in expression) statement 

```js
for (var propName in window) { 
 document.write(propName); 
} 
```

<font color="red">`ECMAScript`对象的属性没有顺序。通过`for-in`循环输出的属性名的顺序是不可预测的。</font>

**具体来讲，所有属性都会被返回一次，但返回的先后次序可能会因浏览器而异。**