# 数据类型

javascript有如下几种数据类型：

- 基本数据类型
	1. `undefined`
	2. `null`
	3. `number`
	4. `string`
	5. `boolean`
	6. `symbol`
	7. `bigInt`

- 复杂数据类型
	1. `object`

在将一个值赋给变量时，解析器必须确定这个值是基本类型值还是引用类型值。

基本数据类型：`Undefined`、`Null`、`Boolean`、`Number` 、`String`、`Symbol`、`BigInt` 是按值访问的，因为可以操作保存在变量中的实际的值。

引用类型的值是保存在内存中的对象。与其他语言不同，`JavaScript`不允许直接访问内存中的位置，也就是说不能直接操作对象的内存空间。

当复制保存着对象的某个变量时，操作的是对象的引用。但在为对象添加属性时，操作的是实际
的对象。

:::warning
只能给`引用类型值`动态地添加属性，以便将来使用。
:::

## 复制变量值

如果从一个变量向另一个变量复制基本类型的值，会在变量对象上创建一个新值，然后把该值复制到为新变量分配的位置上。

```
var num1 = 5; 
var num2 = num1;
```

在此，`num1`中保存的值是 5。当使用`num1`的值来初始化`num2` 时，`num2`中也保存了值 5。

但`num2`中的 5 与 `num1` 中的 5 是完全独立的，该值只是 `num1` 中 5 的一个副本。

**此后，这两个变量可以参与任何操作而不会相互影响。**

![基础类型变量赋值](https://img-blog.csdnimg.cn/20200205212032400.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_10,color_FFFFFF,t_10)

## 复制引用类型

当从一个变量向另一个变量复制引用类型的值时，同样也会将存储在变量对象中的值复制一份放到为新变量分配的空间中。

不同的是，这个值的副本实际上是一个指针，而这个指针指向存储在堆中的一个对象。复制操作结束后，两个变量实际上将引用同一个对象。

因此，改变其中一个变量，就会影响另一个变量，如下面的例子所示：

```js
var obj1 = new Object(); 
var obj2 = obj1; 
obj1.name = "Nicholas"; 
alert(obj2.name); //"Nicholas"
```

首先，变量`obj1`保存了一个对象的新实例。然后，这个值被复制到了 `obj2` 中；

换句话说，`obj1`和 `obj2` 都指向同一个对象。这样，当为 `obj1` 添加 `name` 属性后，可以通过 `obj2` 来访问这个属性，
因为这两个变量引用的都是同一个对象。

![引用类型变量赋值](https://img-blog.csdnimg.cn/20200205220827456.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

## 变量类型检测

- 如果想检验变量是否是基础类型的话，推荐的方式是`typeof`操作符。
- 如果我们想要知道一个对象是什么类型的对象，推荐使用`instanceof`来判断。
- 通用的方式，我们可以使用`Object.prototype.toString.call()`来检测变量具体是什么类型。

## 引用类型与基本类型生命周期

- 使用`new`操作符创建的引用类型的实例，在执行流离开当前作用域之前都一直保存在内存中。
- 自动创建的基本包装类型的对象，则只存在于一行代码的执行瞬间，然后立即被销毁。

<font color="red">这意味着我们不能在运行时为基本类型值添加属性和方法。</font>来看下面的例子：

```js
var s1 = "some text"; 
s1.color = "red"; 
alert(s1.color); //undefined
```

在此，第二行代码试图为字符串 `s1` 添加一个 `color` 属性。但是，当第三行代码再次访问 `s1` 时，其 `color` 属性不见了。

问题的原因就是第二行创建的 `String` 对象在执行第三行代码时已经被销毁了。第三行代码又创建自己的 `String` 对象，而该对象没有`color` 属性。