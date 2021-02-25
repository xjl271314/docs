# ES6到ES11特性总结

## ES6

> ES6(es2015)是一次比较重大的革新，比起过去的版本，改动比较大，仅对常用API及语法糖进行讲解

**1. let和const**

在`ES6`之前，`js`只有`var`一种声明港式，但是在`ES6`之后，多了`let`和`const`两种方式。用`var`声明的变量没有块级作用域，而`let`和`const`都是`块级作用域`，这三个关键字的区别主要如下:

```js
{
    var a = 10;
    let b = 20;
    const c = 30;
}

a // 10
b // UncaughtReferenceError: b is not defined
c // UncaughtReferenceError: c is not defined

let d = 40
const e = 50
d = 60
d // 60
e = 70 // Uncaught TypeError: Assignment to constant variable
```

| | var | let | const|
|:-------- | :-----: | :----: | :----: |
变量提升 | yes | no | no
全局变量 | yes | no | no
重复声明 | yes | no | no
重新赋值 | yes | yes | no
暂时性死区 | no | yes | yes
块级作用域 | no | yes | yes
只声明不初始化 | yes | yes | no 

**2. 类(Class)**

在ES6之前构造类的方式都是与原型链相关的，在ES6出现了`class`关键字用来构造一个类。

```js
class Person{
    constructor(name, age){
        this.name = name;
        this.age = age;
    }
    information(){
        return `my name is ${this.name}, I am ${this.age} years old`
    }
}
```

**3. 箭头函数**

es6之前的函数中this的指向都是跟函数运行时的执行环境有关的，使用箭头函数的时候this指向跟函数定义时的执行环境有关(this是继承自父执行上下文)。并且箭头函数语法更简洁，没有自己的`this`，`arguments`，`super`等。

```js
// es5
var list = [1, 2, 3, 4, 5, 6, 7];
var newList = list.map(function(item){
    return item * item
})
// es6
const list = [1, 2, 3, 4, 5, 6, 7];
const newList = list.map(item=>item * item)


// es5 function
var a =11;
var obj={
    a:22,
    say:function(){
        console.log(this.a)
    }
}
obj.say();// 11 this指向运行时的obj对象

// 箭头函数
var a =11;
var obj={
    a:22,
    say:()=>{
        console.log(this.a)
    }
}
obj.say();// 11 箭头函数的this指向obj所在的环境
```

**4. 函数默认参数**

在es6之前，如果我们需要定义函数的初始参数，需要这么写:

```js
// es5
function config(data){
    data = data || 'data is empty'
    // 如果参数的布尔值为fasle的时候就有问题  config(0)
}
// es6
const config = ( data = 'data is empty') => {}
```

**5. 模板字符串**

在ES6之前，拼接字符串的话都需要`+`号
```js
var name = 'kirs'
var age = 24
var info = 'my name is' + name +', I am ' + age + ' years old'

// es6 
const name = 'kirs'
const age = 24
const info = `my name is ${name}, I am ${age} years old`
```
**6. 解构赋值**

我们通过解构赋值，可以将属性/值从对象/数组中取出，赋值给其他变量

```js
// es5
var a = 10
var b = 20
var temp = a
a = b
b = temp
// es6
let a = 10
let b = 20
[a, b] = [b, a]
```

**7. 模块化**

在ES6之前，js并没有模块化的该你啊。也只有社区定制的类似Commonjs和AMD之类的规则
```js
// circle.js
const { PI } = Math
exports.area = r => PI * r ** 2
exports.circumference = r => 2 * PI * r

// index.js
const circle = require('./circle.js')
console.log(`半径为2的圆面积是${circle.area(2)}`)

// circle.js
const { PI } = Math
export const area = r => PI * r ** 2
export const circumference = r => 2 * PI * r

// index.js
import { area } from './circle.js'
console.log(`半径为2的圆面积是${area(2)}`)
```

**8.扩展操作符(Spread operator)**

扩展操作符可以在调用函数/数组构造时，将表达式或者字符串在语法层面展开；还可以在构造字面量对象时，将对象表达式按照`key-value`方式展开。

```js
function sum(x, y, z){
    return x + y + z
}
var list = [5, 6, 7]
var total = sum.apply(null, list)

// es6
const sum = (x, y, z) => x + y + z
const list = [5, 6, 7]
const total = sum(...list)
```
:::warning
扩展运算符只能适用于那鞋布置了迭代器的对象(字符串，数组等)
:::

```js
const obj = {
    'id':112233
}
const array = [...obj] // TypeError: obj is not iterable
```
**9. 对象简写属性**

在ES6之前对某个同名元素进行变量赋值需要重写一遍，而在ES6之后可以简写

```js
var cat = "Tom"
var mouse = "Jerry"

var obj = {
    cat:cat,
    mouse:mouse
}
// es6

const cat = "Tom"
const mouse = "Jerry"

const obj = {
    cat,
    mouse
}
```

**10. Promise**

`Promise`是ES6提供的一种异步解决方案，比回调函数更加清晰明了。

`Promise`总共有3种状态:

1. 等待中(pending)
2. 完成了(resolved)
3. 拒绝了(rejected)

:::warning
`Promise`一旦从等待状态变成了其他状态就永远不能改变状态了
:::

```js
new Promise((resolve, reject) =>{
    resolve('success')
    // 无效
    reject('reject')
})
```
:::tip
当我们在构造`Promise`的时候,构造函数内部的代码是立即执行的。
:::

```js
new Promise((resolve, reject)=>{
    console.log('new promise')
    resolve('success')
})
console.log('finish')
// new promise -> finish
```

`Promise`实现了链式调用，也就是说每次调用`then`之后返回的都是一个`Promise`，并且是一个全新的`Promise`，原因是因为状态不可变。如果你在`then`中使用了`return`，那么`return`的值会被`Promise.resolve()`包裹。

```js
Promise.resolve(1)
    .then(res=>{
        console.log(res) // 1
        return 2 // Promise.resolve(2)
    })
    .then(res=>{
        console.log(res) // 2
    })
```

**11. for...of语句**

`for...of`语句在可迭代对象(`array`, `Map`, `Set`, `String`, `TypedArray`, `arguments`对象等)上创建一个迭代循环，调用自定义迭代钩子并为每个不同属性的值执行语句。

```js
const array1 = ['a', 'b', 'c']

for (const element of array1){
    console.log(element)
    // a b c
}
```

**12. Symbol**

`Symbol`是ES6出现的一种基本数据类型,`symbol()`函数会返回`symbol`类型的值，该类型具有静态属性和静态方法。它的静态属性会暴露几个内建的成员对象；它的静态方法暴露全局的symbol注册，且类似于内建对象类。

每个`Symbol()`返回的`symbol`值都是唯一的。当参数为对象时，将调用对象的toString()方法。

:::tip
一个`symbol`值能作为对象属性的标识符；这是该数据类型仅有的目的。
:::

```js
const symbol1 = Symbol();
const symbol2 = Symbol(42);
const symbol3 = Symbol('foo')
const symbol4 = Symbol('foo')
const symbol5 = Symbol({ name: 'Lucy' }); // Symbol([object Object])

console.log(typeof symbol1) // "symbol"
console.log(symbol3.toString()) // "Symbol('foo')"
console.log(symbol3 === sumbol4) // false

```

**如果我们想创造两个相等的Symbol变量，可以使用`Symbol.for(key)`。**

> `Symbol.for(key)`使用给定的key搜索现有的symbol，如果找到则返回该symbol。否则将使用给定的key在全局symbol注册表中创建一个新的symbol。

```js
const symbol1 = Symbol.for('foo');
const symbol2 = Symbol.for('foo');

console.log(symbol1 === symbol2);
```

:::warning
这里需要注意一点,我们需要使用Symbol()函数创建symbol变量，并非使用构造函数，使用new操作符会直接报错。

```js
new Symbol(); // Uncaught TypeError: Symbol is not a constructor
```

当使用Symbol作为对象属性时，可以保证对象不会出现重名属性，调用`for...in`不能将其枚举出来，另外调用`Object.getOwnPropertyNames`、`Object.keys()`也不能获取Symbol属性。

```js
var obj = {
  name:'Lucy',
  [Symbol('name')]:'jack'
}
Object.getOwnPropertyNames(obj); // ["name"]
Object.keys(obj); // ["name"]
for (var i in obj) {
   console.log(i); // name
}
Object.getOwnPropertySymbols(obj) // [Symbol(name)]
```
:::

**Symbol的应用场景**:

- 防止XSS:

在`React`的`ReactElement`对象中，有一个`$$typeof`属性，它是一个Symbol类型的变量：

```js
const REACT_ELEMENT_TYPE =
  (typeof Symbol === 'function' && Symbol.for && Symbol.for('react.element')) ||
  0xeac7;
```

`ReactElement.isValidElement`函数用来判断一个React组件是否是有效的，下面是它的具体实现。

```js
ReactElement.isValidElement = function (object) {
  return typeof object === 'object' && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
};
```

**`React`渲染时会把没有`$$typeof`标识，以及规则校验不通过的组件过滤掉。**

如果你的服务器有一个漏洞，允许用户存储任意JSON对象， 而客户端代码需要一个字符串，这可能会成为一个问题：

```js
// JSON
let expectedTextButGotJSON = {
  type: 'div',
  props: {
    dangerouslySetInnerHTML: {
      __html: '/* put your exploit here */'
    },
  },
};
let message = { text: expectedTextButGotJSON };
<p>
  {message.text}
</p>
```

而`JSON`中不能存储`Symbol`类型的变量，这就是`防止XSS`的一种手段。

- 私有属性

借助`Symbol`类型的不可枚举，我们可以在类中模拟私有属性，控制变量读写：

```js
const privateField = Symbol();
class myClass {
  constructor(){
    this[privateField] = 'ConardLi';
  }
  getField(){
    return this[privateField];
  }
  setField(val){
    this[privateField] = val;
  }
}
```

- 防止属性污染

在某些情况下，我们可能要为对象添加一个属性，此时就有可能造成属性覆盖，用Symbol作为对象属性可以保证永远不会出现同名属性。

例如我们模拟实现一个call方法：

```js
Function.prototype.myCall = function (context) {
    if (typeof this !== 'function') {
        return undefined; // 用于防止 Function.prototype.myCall() 直接调用
    }
    context = context || window;
    const fn = Symbol();
    context[fn] = this;
    const args = [...arguments].slice(1);
    const result = context[fn](...args);
    delete context[fn];
    return result;
}
```

**我们需要在某个对象上临时调用一个方法，又不能造成属性污染，Symbol是一个很好的选择。**


**13. 迭代器与生成器**

迭代器(Iterator)是一种迭代的机制，为各种不同的数据结构提供一种统一的访问方式。任何数据结构只要内部有Iterator接口，就可以完成依次迭代的操作。

一旦创建，迭代器对象可以勇敢重复调用`next()`显示地迭代，从而获取该对象每一级的值，直到迭代完，返回`{value: undefined, done:true}`

生成器函数使用`function*`语法编写，最初调用的时候，生成器不执行任何的代码，而是返回一种成为`Generator`的迭代器。通过调用生成器的下一个方法消耗值时，`Generator`函数将执行，直到遇到`yield`关键字。

:::tip
可以根据需要多次调用该函数，并且每次都返回一个新的`Generator`，但每个`Generator`只能迭代一次
:::

```js
function* makeRangeInterator(start = 0, end = Infinity, step = 1){
    for(let i = start; i < end; i += step){
        yield i
    }
}

const a = makeRangeInterator(1,10,2)
a.next() // {value: 1, done: false}
a.next() // {value: 3, done: false}
a.next() // {value: 5, done: false}
a.next() // {value: 7, done: false}
a.next() // {value: 9, done: false}
a.next() // {value: undefined, done: true}
```

**14. Set与WeakSet**

`Set`对象允许你存储任何类型的唯一值，无论是原始值还是对象引用。

可以通过Set进行数组去重.

```js
const arr = [1,1,2,3,4,5,6,4]
const newArr = [...new Set(arr)] // 1,2,3,4,5,6
```

`WeakSet`结构与`Set`结构类似，但是有如下两点区别:

1. `WeakSet`对象只能存放对象引用，不能存放值，而`Set`结构都可以.
2. `WeakSet`对象中存储的对象值都是被弱引用的，如果没有其他的变量或属性引用这个对象值，则这个对象值会被当成垃圾回收掉。正因为这样，`WeakSet`对象是无法被枚举的，没有办法拿到它所包含的所有元素。

```js
var ws = new WeakSet()
var obj = {}
var foo = {}

ws.add(window)
ws.add(obj)

ws.has(window) // true
ws.has(foo) // false 对象foo没有被添加

ws.delete(window)
ws.has(window) // false

wx.clear() // 清空整个WeakSet对象
```

**15. Map与WeakMap**

`Map`对象保存的是建/值对的集合，任何值(对象或者原始值)都可以作为一个键或者一个值。

```js
var myMap = new Map()
myMap.set(NaN, 'not a number')

myMap.get(NaN) // not a number

var otherNaN = Number("foo")
myMap.get(otherNaN) // not a number

```

`WeakMap`对象是一组键/值对的集合，其中的键是弱引用的。其键必须是对象，而值是可以任意的。

```js
var wm1 = new WeakMap(),
    wm2 = new WeakMap(),
    wm3 = new WeakMap(),

var o1 = {},
    o2 = function(){},
    o3 = window;

wm1.set(o1, 37);
wm1.set(o2, "aa");
wm2.set(o1, o2);
wm2.set(o3, undefined);
wm2.set(wm1, wm2);
wm1.get(o2) // aa
wm2.get(o2) // undefined
wm2.get(o3) // undefined

wm1.has(o2) // true
wm2.has(o2) // false
wm2.has(o3) // true

wm3.set(o1, 37);
wm3.get(o1) // 37
wm3.clear()
wm3.get(o1) // undefined,w3为空

wm1.has(o1) // true
wm1.delete(o1) 
wm1.has(o1) // false
```

**16. Proxy与Reflect**

`Proxy`对象用于定义基本操作的自定义行为(如属性查找，赋值，枚举，函数调用等)。

`Reflect`是一个内置的对象，它提供拦截`javascript`操作的方法。这些方法与`Proxy`的方法相同。`Reflect`不是一个函数对象，因此它是不可构造的。`Proxy`与`Reflect`是非常完美的配合。

```js
const observe = (data, callback)=>{
    return new Proxy(data, {
        get(target, key){
            return Reflect.get(target, key)
        },
        set(target, key, value, proxy){
            callback(key, value);
            target[key] = value;
            return Reflect.set(target, key, value, proxy)
        }
    })
}
const FooBar = { 
    open: false
}
const FooBarObserver = observe(FooBar, (property, value)=>{
    property === 'open' && value ? console.log('FooBar is open') : console.log('FooBar is closed')
})

console.log(FooBarObserver.open) // false
FooBarObserver.open = true // true
```

:::warning
如果对象带有`configurable:false` 或者`writable: false`属性,则代理失效。
:::

**17. Regex对象的扩展**

**18. Math对象的扩展**
- `Number.parseInt()` 返回转化值的整数部分
- `Number.parseFloat()` 返回转换值的浮点数部分
- `Number.isFinite()` 是否为有限数值
- `Number.isNaN()` 是否为NaN
- `Number.isinteger()` 是否为整数
- `Math.trunc()` 返回数值整数部分
- `Math.sign()` 返回数值类型(正数1、负数-1、零0)
- `Math.imul(x,y)` 返回两个数值相乘

**19. Array对象的扩展**

- `Array.from()` 转化具有`Iterator`接口的数据结构为真正的数组,返回新数组
```js
Array.from("foo") // ["f", "o", "o"]
```
- `Array.of()` 转化一组值为真正的数组，返回新数组
```js
Array.of(7) // [7]
Array.of(1,2,3) // [1, 2, 3]
```
- `Array.copyWithin(target, start, end)` 把指定位置的成员复制到其他位置，返回原数组

```js
const arr1 = [1, 2, 3, 4, 5]
arr1.copyWithin(0, 3, 4)
//  [4, 2, 3, 4, 5]
```
- `Array.find()` 返回第一个符合条件的成员

```js
const arr = [5, 12, 18, 130]
arr.find(item=>item>10) // 12
```

- `Array.findIndex()` 返回第一个符合条件的成员的索引值

```js
const arr = [5, 12, 18, 130]
arr.findIndex(item=>item>10) // 1
```

- `Array.fill(value, start, end)` 根据指定的值填充整个数组

```js
const arr = [1, 2, 3, 4]
arr.fill(1) // [1, 1, 1, 1]

```

- `Array.keys()` 返回以索引值为遍历器的对象

```js
const arr = [1, 2, 3, 4]
const iterator = arr.keys()

for (const key of iterator){
    console.log(key) // 0 1 2 3
}

```

- `Array.values()` 返回以属性值为遍历器的对象

```js
const arr = [1, 2, 3, 4]
const iterator = arr.values()

for (const key of iterator){
    console.log(key) // 1 2 3 4
}
```

- `Array.entries()` 返回以索引值和属性值为遍历器的对象

```js
const arr = [1, 2, 3, 4]
const iterator = arr.entries()

console.log(iterator.next().value) // [0: 1]
console.log(iterator.next().value) // [1: 2]
```

## ES7

### 1.`Array.prototype.includes()`

用来判断一个数组是否包含一个指定的值。根据情况，如果包含则返回`true`，否则返回`false`。

```js
const arr = [1, 2, 3]
arr.includes(1) // true
arr.includes(4) // false
```
### 2.幂运算符**

`幂运算符**`具有与`Math.pow()`一样的功能。

```js
console.log(2**10) // 1024
console.log(Math.pow(2, 10)) // 1024
```

## ES8

### 1. `async`与`await`

`async`与`await`能够解决`promise`嵌套过多带来的问题，可以简化代码，让异步代码看起来像同步代码

```js
// promise
fetch('coffee.jpg')
    .then(res=>res.blob())
    .then(myBlob => {
          let objectURL = URL.createObjectURL(myBlob)
          let image = document.createElement('img')
          image.src = objectURL
          document.body.appendChild(image)
    })
    .catch(err => {
          console.log('error: ' + err.message)
    })
// async和await

async function myFetch() {
      let response = await fetch('coffee.jpg')
      let myBlob = await response.blob()

      let objectURL = URL.createObjectURL(myBlob)
      let image = document.createElement('img')
      image.src = objectURL
      document.body.appendChild(image)
}

myFetch() 
```

### 2.`Object.values()`

返回一个给定对象自身的所有可枚举属性值的数组，值的顺序与使用`for...in`循环的顺序相同 ( 区别在于 `for-in` 循环枚举原型链中的属性 )。


```js
const object1 = {
      a: 'somestring',
      b: 42,
      c: false
}
console.log(Object.values(object1)) // ["somestring", 42, false]
```

### 3.`Object.entries()`

返回一个给定对象自身可枚举属性的键值对数组。

```js
const object1 = {
      a: 'somestring',
      b: 42
}

for (let [key, value] of Object.entries(object1)) {
      console.log(`${key}: ${value}`)
}

// "a: somestring"
// "b: 42"
```

### 4.`padStart()`

用另一个字符串填充当前字符串(重复，如果需要的话)，以便产生的字符串达到给定的长度。填充从当前字符串的开始(左侧)应用的。

```js
const str1 = '5'
console.log(str1.padStart(2, '0')) // "05"

const fullNumber = '2034399002125581'
const last4Digits = fullNumber.slice(-4)
const maskedNumber = last4Digits.padStart(fullNumber.length, '*') 
console.log(maskedNumber) // "************5581"
```

### 5.`padEnd()`

用一个字符串填充当前字符串（如果需要的话则重复填充），返回填充后达到指定长度的字符串。从当前字符串的末尾（右侧）开始填充。

```js
const str1 = 'Breaded Mushrooms'
console.log(str1.padEnd(25, '.')) // "Breaded Mushrooms........"
const str2 = '200'
console.log(str2.padEnd(5)) // "200  "
```

### `Object.getOwnPropertyDescriptors()`

用来获取一个对象的所有自身属性的描述符。

```js
const object1 = {
  property1: 42
}

const descriptors1 = Object.getOwnPropertyDescriptors(object1)

console.log(descriptors1.property1.writable) // true

console.log(descriptors1.property1.value) // 42

// 浅拷贝一个对象
Object.create(
  Object.getPrototypeOf(obj), 
  Object.getOwnPropertyDescriptors(obj) 
)

// 创建子类
function superclass() {}
superclass.prototype = {
  // 在这里定义方法和属性
}
function subclass() {}
subclass.prototype = Object.create(superclass.prototype, Object.getOwnPropertyDescriptors({
  // 在这里定义方法和属性
}))
```

## ES9

### 1.`for await...of`

`for await...of` 语句会在异步或者同步可迭代对象上创建一个迭代循环，包括 `String`，`Array`，`Array-like` 对象（比如`arguments` 或者`NodeList`)，`TypedArray`，`Map`， `Set`和自定义的异步或者同步可迭代对象。其会调用自定义迭代钩子，并为每个不同属性的值执行语句。

```js
async function* asyncGenerator() {
      var i = 0
      while (i < 3) {
            yield i++
      }
}

(async function() {
      for await (num of asyncGenerator()) {
            console.log(num)
      }
})()
// 0
// 1
// 2
```

### 2.正则表达式反向(lookbehind)断言

在ES9之前，`JavaScript` 正则表达式，只支持正向断言。正向断言的意思是：当前位置后面的字符串应该满足断言，但是并不捕获。例子如下：

```js
'fishHeadfishTail'.match(/fish(?=Head)/g) // ["fish"]
```

### 3.正则表达式 Unicode 转义

### 4.正则表达式 s/dotAll 模式

### 5.正则表达式命名捕获组

### 6.对象扩展操作符

ES6中添加了数组的扩展操作符，让我们在操作数组时更加简便，美中不足的是并不支持对象扩展操作符，但是在ES9开始，这一功能也得到了支持，例如：

```js
var obj1 = { foo: 'bar', x: 42 };
var obj2 = { foo: 'baz', y: 13 };

var clonedObj = { ...obj1 };
// 克隆后的对象: { foo: "bar", x: 42 }

var mergedObj = { ...obj1, ...obj2 };
// 合并后的对象: { foo: "baz", x: 42, y: 13 }
```

### 7.`Promise.prototype.finally()`

`finally()`方法会返回一个`Promise`，当`promise`的状态变更，不管是变成`rejected`或者`fulfilled`，最终都会执行`finally()`的回调。

```js
fetch(url)
      .then((res) => {
        console.log(res)
      })
      .catch((error) => { 
        console.log(error)
      })
      .finally(() => { 
        console.log('结束')
    })
```

## ES10

### 1.`Array.prototype.flat()` / `flatMap()`

`flat()` 方法会按照一个可指定的深度递归遍历数组，并将所有元素与遍历到的子数组中的元素合并为一个新数组返回。

`flatMap()`与 `map()` 方法和深度为1的 `flat()` 几乎相同.，不过它会首先使用映射函数映射每个元素，然后将结果压缩成一个新数组，这样效率会更高。

```js
var arr1 = [1, 2, 3, 4]

arr1.map(x => [x * 2]) // [[2], [4], [6], [8]]

arr1.flatMap(x => [x * 2]) // [2, 4, 6, 8]

// 深度为1
arr1.flatMap(x => [[x * 2]]) // [[2], [4], [6], [8]]
```

`flatMap(`)可以代替`reduce()` 与 `concat()`，例子如下：

```js
var arr = [1, 2, 3, 4]
arr.flatMap(x => [x, x * 2]) // [1, 2, 2, 4, 3, 6, 4, 8]
// 等价于
arr.reduce((acc, x) => acc.concat([x, x * 2]), []) // [1, 2, 2, 4, 3, 6, 4, 8]
```

但这是非常低效的，在每次迭代中，它创建一个必须被垃圾收集的新临时数组，并且它将元素从当前的累加器数组复制到一个新的数组中，而不是将新的元素添加到现有的数组中。

### 2.String.prototype.trimStart() / trimLeft() / trimEnd() / trimRight()

在ES5中，我们可以通过`trim()`来去掉字符首尾的空格，但是却无法只去掉单边的，但是在ES10之后，我们可以实现这个功能。

```js
const Str = '   Hello world!  '
console.log(Str) // '   Hello world!  '
console.log(Str.trimStart()) // 'Hello world!  '
console.log(Str.trimLeft()) // 'Hello world!  '
console.log(Str.trimEnd()) // '   Hello world!'
console.log(Str.trimRight()) // '   Hello world!'
```
:::warning
不过这里有一点要注意的是，`trimStart()`跟`trimEnd()`才是标准方法，`trimLeft()`跟`trimRight()`只是别名。
:::

### 3.`Object.fromEntries()`

把键值对列表转换为一个对象，它是`Object.entries()`的反函数。

```js
const entries = new Map([
  ['foo', 'bar'],
  ['baz', 42]
])

const obj = Object.fromEntries(entries)

console.log(obj) // Object { foo: "bar", baz: 42 }
```

### 4.`String.prototype.matchAll`

`matchAll()` 方法返回一个包含所有匹配正则表达式的结果及分组捕获组的迭代器。并且返回一个不可重启的迭代器。例子如下：

```js
var regexp = /t(e)(st(\d?))/g
var str = 'test1test2'

str.match(regexp) // ['test1', 'test2']
str.matchAll(regexp) // RegExpStringIterator {}
[...str.matchAll(regexp)] // [['test1', 'e', 'st1', '1', index: 0, input: 'test1test2', length: 4], ['test2', 'e', 'st2', '2', index: 5, input: 'test1test2', length: 4]]
```

### 5.BigInt

`BigInt` 是一种内置对象，它提供了一种方法来表示大于 `2^53 - 1` 的整数。这原本是 Javascript中可以用 Number 表示的最大数字。

BigInt 可以表示任意大的整数。可以用在一个整数字面量后面加 `n` 的方式定义一个 BigInt ，如：10n，或者调用函数BigInt()。
在以往的版本中，我们有以下的弊端：

```js
// 大于2的53次方的整数，无法保持精度
2 ** 53 === (2 ** 53 + 1)
// 超过2的1024次方的数值，无法表示
2 ** 1024 // Infinity

```
:::tip
`BigInt` 和 `Number`不是严格相等的，但是宽松相等的。
:::

### 6.globalThis

`globalThis`属性包含类似于全局对象 `this`值。所以在全局环境下，我们有：

```js
globalThis === this // true
```

## ES11

### 1.Promise.allSettled

在之前使用`Promise.all`的时候,如果其中某个任务出现异常(`reject`)，所有任务都会挂掉，`Promise`直接进入 `reject` 状态。

当我们在一个页面中并发请求3块区域的数据的时候，如果其中一个接口挂了，这将导致页面的数据全都无法渲染出来，这是我们无法接受的。

```js
Promise.all([
    Promise.reject({
        code: 500,
        msg: '服务异常'
    }),
    Promise.resolve({
        code: 200,
        list: []
    }),
    Promise.resolve({
        code: 200,
        list: []})
    ]).then((res) => {
    // 如果其中一个任务是 reject，则不会执行到这个回调。
        doSomething(res);
    }).catch((error) => {
    // 本例中会执行到这个回调
    // error: {code: 500, msg: "服务异常"}
})
```

我们想要的是在执行并发任务中，无论一个任务正常或者异常，都会返回对应的的状态（`fulfilled` 或者 `rejected`）与结果（`业务value` 或者 `拒因 reason`）。在 `then` 里面通过 `filter` 来过滤出想要的业务逻辑结果，这就能最大限度的保障业务当前状态的可访问性，而 `Promise.allSettled` 就是解决这问题的。

```js
Promise.allSettled([
    Promise.reject({code: 500, msg:'服务异常'}),
    Promise.resolve({ code: 200, list: []}),
    Promise.resolve({code: 200, list: []})])
]).then((res) => {
    /*
        0: {status: "rejected", reason: {…}}
        1: {status: "fulfilled", value: {…}}
        2: {status: "fulfilled", value: {…}}
    */
    // 其他业务过滤掉 rejected 状态，尽可能多的保证页面区域数据渲染
    RenderContent(res.filter((el) => {
        return el.status !== 'rejected';
    }));
});
```

### 2.可选链（Optional chaining）

`可选链`可让我们在查询具有多层级的对象时，不再需要进行冗余的各种前置校验。

```js
// 假设有一个user对象
const name = props && props.user && props.user.info &&  props.user.info.name;

// 使用可选链
const name = props?.user?.info?.name;
```
:::tip
可选链中的 `?` 表示如果问号左边表达式有值, 就会继续查询问号后面的字段。

项目中需要支持的话 需要配置`babel`转换
```
npm install @babel/plugin-proposal-optional-chaining --dev
```
:::

### 3.空值合并运算符（Nullish coalescing Operator）

当我们查询某个属性时，经常会遇到，如果没有该属性就会设置一个默认的值:

```js
const level = (user.data && user.data.level) || '暂无等级';
```

如果说用户的等级本身就是0级的话，在上述的情况下就会被转化为"暂无等级"。

```js
// 使用空值合并
const level = `${user?.data?.level}级` ?? '暂无等级';
```

## ES12

- 2021.02.20

ES2021 也就是 2021 年的 ECMAScript 版本。ES2021 并没有像 ES2015 那样提出很多新特性，但却合并了一些有用的特性。

以下是 ES2021 的新特性概览：

- String.prototype.replaceAll
- Promise.any
- WeakRef
- 逻辑赋值运算符
- 数字分隔符

### String.protype.replaceAll

在 ES2021 之前，要替换掉一个字符串中的所有指定字符，我们可以这么做：

```js
const fruits = '🍎+🍐+🍓+';  
const fruitsWithBanana = fruits.replace(/\+/g, '🍌');  
console.log(fruitsWithBanana); //🍎🍌🍐🍌🍓🍌  
```

ES2021 则提出了`replaceAll`方法，并将其挂载在 String 的原型上，可以这么用：

```js
const fruits = '🍎+🍐+🍓+';  
const fruitsWithBanana = fruits.replaceAll('+', '🍌');  
console.log(fruitsWithBanana); //🍎🍌🍐🍌🍓🍌  
```

### Promise.any

`Promise.any`方法和`Promise.race`类似——只要给定的迭代中的一个 promise 成功，就采用第一个 promise 的值作为它的返回值，但与`Promise.race`的不同之处在于——它会等到所有 `promise` 都失败之后，才返回失败的值：

```js
const myFetch = url => setTimeout(() => fetch(url), Math.floor(Math.random() * 3000));  
const promises = [  
  myFetch('/endpoint-1'),  
  myFetch('/endpoint-2'),  
  myFetch('/endpoint-3'),  
];  
// 使用 .then .catch  
Promise.any(promises) // 任何一个 promise 成功。  
       .then(console.log) // 比如 ‘3’  
       .catch(console.error); // 所有的 promise 都失败了  
// 使用 async-await  
try {  
  const first = await Promise.any(promises); // 任何一个 promise 成功返回。  
 console.log(first);  
}catch (error) { // 所有的 promise 都失败了  
  console.log(error);  
}  
```

### WeakRef

WeakRef提案主要包含两个新功能：

- 可以通过`WeakRef`类来给某个对象创建一个弱引用
- 可以通过`FinalizationRegistry`类，在某个对象被垃圾回收之后，执行一些自定义方法

上述两个新功能可以同时使用，也可以单独使用，取决于你的需求。一个WeakRef对象包含一个对于某个对象的弱引用，被称为_目标_或_引用_。

通过弱引用一个对象，可以让该对象在没有其它引用的情况下被垃圾回收机制回收。WeakRef主要用来**缓存**和**映射**一些大型对象，当你希望某个对象在不被其它地方引用的情况下及时地被垃圾回收，那么你就可以使用它。

```js
function toogle(element) {  
  const weakElement = new WeakRef(element);  
  let intervalId = null;  
  
  function toggle() {  
    const el = weakElement.deref();  
    if (!el) {  
       return clearInterval(intervalId);  
   }  
   const decoration = weakElement.style.textDecoration;  
   const style= decoration === 'none' ? 'underline' : 'none';  
   decoration = style;  
  }  
  intervalId = setInterval(toggle, 1000);  
}  
const element = document.getElementById("link");  
toogle(element);  
setTimeout(() => element.remove(), 10000);  
```

`FinalizationRegistry`接收一个注册器回调函数，可以利用该注册器为指定对象注册一个事件监听器，当这个对象被垃圾回收之后，会触发监听的事件，具体步骤如下。首先，创建一个注册器：

```js
const registry = new FinalizationRegistry(heldValue => {  
  // ....  
});  
```

接着注册一个指定对象，同时也可以给注册器回调传递一些参数：

```js
registry.register(theObject, "some value");  
```

### 逻辑赋值运算符

逻辑赋值运算符结合了逻辑运算符和赋值表达式。逻辑赋值运算符有两种：

- 或等于（||=）
- 且等于（&&=）

```js
// 或等于  
|   a   |   b   | a ||= b | a (运算后) |  
| true  | true  |   true  |        true         |  
| true  | false |   true  |        true         |  
| false | true  |   true  |        true         |  
| false | false |   false |        false        |  
a ||= b  
// 等同于:  
a || (a = b);  
  
// 且等于  
|   a   |   b   | a &&= b | a (运算后) |  
| true  | true  |   true  |        true         |  
| true  | false |   false |        false        |  
| false | true  |   false |        false        |  
| false | false |   false |        false        |  
a &&= b  
// 等同于:  
a && (a = b);  
```

### 数字分隔符

通过这个功能，我们利用 “（_，U+005F）” 分隔符来将数字分组，提高数字的可读性：

```js
1_000_000_000           // 十亿  
101_475_938.38          // 亿万  
  
const amount = 12345_00;  // 12,345  
const amount = 123_4500;  // 123.45 (保留 4 位小数)  
const amount = 1_234_500; // 1,234,500  
  
0.000_001 // 百万分之一  
1e10_000  // 10^10000  
  
const binary_literals = 0b1010_0001_1000_0101;  
const hex_literals = 0xA0_B0_C0;  
const bigInt_literals = 1_000_000_000_000n;  
const octal_literal = 0o1234_5670;  
```