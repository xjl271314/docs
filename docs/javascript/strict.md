# 严格模式与非严格模式

:::tip
[完整的区别可以参考这里:](https://www.jb51.net/article/174040.htm)
:::

`ECMAScript 5`引入了`严格模式(strict mode)`的概念。

严格模式是为`javaScript`定义了一种不同的解析与执行模型。

在严格模式下，`ECMAScript3`中的一些不确定的行为将得到处理，而且对某些不安全 的操作也会抛出错误。

**要在整个脚本中启用严格模式，可以在js文件顶部添加如下代码：**

```js
// js
"use strict"; 
```

**也可以指定函数在严格模式下执行**

```js
function doSomething(){ 
 "use strict"; 
 //函数体
} 
```

**严格模式对正常的 JavaScript语义做了一些更改：**

>1. 严格模式通过抛出错误来消除了一些原有静默错误。
>2. 严格模式修复了一些导致 JavaScript引擎难以执行优化的缺陷：有时候，相同的代码，严格模式可以比非严格模式下运行得更快。
>3. 严格模式禁用了在ECMAScript的未来版本中可能会定义的一些语法。

**详细的一些区别：**
1. 禁用`with`语法，使用将报错。因为解析`with`语法时作用域的情况会非常复杂，严重影响代码的解析与运行速度
2. 禁止删除变量与函数。delete 变量 或delete 函数都将报错。
3. 属性描述符（propertyDescriptor）相关:

    **能改变属性描述符的方法有：**
     	`Object.defineProperty`、
		`Object.defineProperties`、
		`Reflect.defineProperty`、
		`Reflect.defineProperties`、
		`Object.freeze` 冻结对象的一切属性、
		`Object.seal` 冻结对象的新增属性，即可以更改已存在的属性的值，和`writeable`有关，但是无法新增属性。

    **获取一个属性描述符的方法有:**
        `Object.getOwnPropertyDescriptor`、
		`Object.getOwnPropertyDecriptors`、
		`Reflect.getOwnPropertyDescriptor`、
		`Reflect.getOwnPropertyDescriptors`

    <font color="red">- 删除configurable = false的属性会报错</font>

    <font color="red">- 给writable = false的属性赋值会报错</font>

	<font color="red">- 给不允许扩展的object增加属性会报错</font>

    **将object设置为不可扩展的方法有:**
        `Object.freeze`、`Object.seal`、`Object.preventExtensions`、
        `Reflect.freeze`、`Reflect.seal`、`Reflect.preventExtensions`

    **判断一个object是否允许扩展可以用**
        `Object.isExtensible`、`Reflect.isExtensible`
        
	<font color="red">- 定义object时属性重名会报错</font>

	<font color="red">- 形参重复时会报错</font>

	<font color="red">- eval有独立作用域,eval不能作为变量名或函数名,类似关键字</font>

	<font color="red">- arguments是形参的副本（类似浅拷贝）,arguments不能作为变量名或函数名,类似关键字</font>

	<font color="red">- 禁用caller与callee</font>