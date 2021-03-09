# 数据类型转换

## 装箱和拆箱

- 装箱转换：把基本类型转换为对应的包装类型。
- 拆箱操作：把引用类型转换为基本类型。

**原始类型不能扩展属性和方法，那么我们是如何使用原始类型调用方法的呢？**

每当我们操作一个基础类型时，后台就会自动创建一个包装类型的对象，从而让我们能够调用一些方法和属性，例如下面的代码：

```js
const name = "Linda";
const name2 = name.substring(2);
```

上述代码的执行过程:

1. 创建一个`String`的包装类型实例.
2. 在实例上调用substring方法.
3. 销毁实例.

也就是说，我们使用基本类型调用方法，就会自动进行`装箱`和`拆箱`操作，相同的，我们使用`Number`和`Boolean`类型时，也会发生这个过程。

:::tip
从`引用类型`到`基本类型`转换(`拆箱`)的过程中，会遵循`ECMAScript`规范规定的`toPrimitive`原则，一般会调用引用类型的`valueOf`和`toString`方法，我们也可以直接重写`toPeimitive`方法。
:::

**一般转换成不同类型的值遵循的原则不同，例如：**

- 引用类型转换为`Number`类型，先调用`valueOf`，再调用`toString`。
- 引用类型转换为`String`类型，先调用`toString`，再调用`valueOf`。

:::danger
若`valueOf`和`toString`都不存在，或者没有返回基本类型，则抛出`TypeError异常`。
:::

```js
const obj = {
  valueOf: () => { console.log('valueOf'); return 123; },
  toString: () => { console.log('toString'); return 'Linda'; },
};
console.log(obj - 1);   // valueOf 122
console.log(`Hello ${obj}`); // toString  Hello Linda

const obj2 = {
  [Symbol.toPrimitive]: () => { console.log('toPrimitive'); return 123; },
};
console.log(obj2 - 1);   // valueOf   122

const obj3 = {
  valueOf: () => { console.log('valueOf'); return {}; },
  toString: () => { console.log('toString'); return {}; },
};
console.log(obj3 - 1);  
// valueOf  
// toString
// TypeError
```

除了程序中的自动拆箱和自动装箱，我们还可以手动进行拆箱和装箱操作。我们可以直接调用包装类型的`valueOf`或`toString`，实现拆箱操作。

```js
const num = new Number("123");  
console.log( typeof num.valueOf() ); // number
console.log( typeof num.toString() ); // string
```

