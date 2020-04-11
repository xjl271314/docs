#  函数与类​

- 2020-04-11

## 函数

和`JavaScript`一样，`TypeScript`函数可以创建有名字的函数和匿名函数。 你可以随意选择适合应用程序的方式，不论是定义一系列API函数还是只使用一次的函数。

```ts
// Named function
function add(x, y) {
    return x + y;
}

// Anonymous function
let myAdd = function(x, y) { return x + y; };
```

## 函数声明方式

`TypeScript`能够根据返回语句自动推断出返回值类型，因此我们通常省略返回值类型声明. 

1. 直接声明函数参数, 直接在参数后面声明类型即可. 

```ts
// 不申明
function add(x: number, y: number) {
   return x + y;
}

// 申明
function add(x: number, y: number): number {
    return x + y;
}
```

2. 在实际开发中, 函数调用经常会直接使用解构赋值的方式, 进而减少赋值. 这种场景的声明方式如下: 

```ts
function add({ x, y }: { x: number, y: number }) {
   return x + y;
}
add({ x: 2, y: 3 })
```

3. 声明剩余参数

剩余参数在使用的时候, 实际是一个数组. 按照这个思路, 我们只需要声明数组格式即可. 

```ts
function add(...rest: number[]) {
   return rest.reduce((pre, cur) => pre + cur)
}
add(2, 3, 4, 5)
add('23', 3) // 报错, 不能是字符串
```

4. 在没有提供函数实现的情况下，有以下两种声明函数类型的方式:

```ts
// 1
type add = (x: number, y: number) => number;

// 2
interface add {
   (x: number, y: number): number
}
```

调用方式如下: 

```ts
let addFn: add = (a, b) => {
   return a + b
}
```

## 函数声明常见错误

:::warning
必选参数不能位于可选参数后面. 可选参数必须位于所有必选参数后面. 

```ts
// A required parameter cannot follow an optional parameter.
function add(x?: number, y: number) {
   return x + y;
}
```
:::

## 类

```ts
class Greeter {
    greeting: string;
    constructor(message: string) {
        this.greeting = message;
    }
    greet() {
        return "Hello, " + this.greeting;
    }
}

let greeter = new Greeter("world");
```

类的修饰符扩展了原生JS 的一些功能特性,这个功能点非常好. 在日常使用中也特别特别多. 直接看代码. 

1. 公共，私有与受保护的修饰符.

```ts
class Father {
   constructor() { }

   public greet() {
       return "Hello";
   }

   private hello() {
       return 'ee';
   }

   protected hi() {
       return 'ee';
   }

}

class children extends Father {

   constructor() {
       super();
   }

   test() {
       this.hello(); // 报错: 是私有成员, 不可在类外部调用
       this.hi(); // 可调用
   }

}

new children().greet()

new children().hello() // 报错: 是私有成员, 不可在类外部调用

new children().hi() //报错: 只能在子类中调用
```

2. 存取器

`TypeScript`支持通过 `getters/setters` 来截取对对象成员的访问。它能帮助你有效的控制对对象成员的访问。

```ts
class Greeter {
   constructor(message: string) {
       this.greeting = message;
   }
   greeting: string;
   get hello() {
       return this.greeting;
   }
   set hi(x) {
       this.greeting = x;
   }
}
const x = new Greeter('eeee')
x.hi('22');
x.hello = '2' // 报错, 不能修改
```
实际上就是使用`getters/setters`来截取对对象成员的访问。解析出来的源码如下: 

```ts
var Greeter = /** @class */ (function () {
   function Greeter(message) {
       this.greeting = message;
   }
   Object.defineProperty(Greeter.prototype, "hello", {
       get: function () {
           return this.greeting;
       },
       enumerable: true,
       configurable: true
   });
   Object.defineProperty(Greeter.prototype, "hi", {
       set: function (x) {
           this.greeting = x;
       },
       enumerable: true,
       configurable: true
   });
   return Greeter;
}());
```

3. 静态属性

`static` 它是一个不用 `new` 就可以直接调用的方法. 

```ts
class Greeter {
   constructor() { }
   static config: string = '33';
}
Greeter.config = '3'
```

:::warning
若属性在 `constructor` 中声明可访问性了, 则不必在下面再声明一次.

```ts
class Dog {
   constructor(public name: string) {}
   name: string; // 报错, Duplicate identifier 'name'. 重复声明
   eat() { }
}
```
:::
