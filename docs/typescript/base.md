# 基本变量类型

- 2020-04-10

`Typescript`基本变量类型在原有的`javascript`类型上记性了扩展

## `Boolean`

最基本的数据类型就是简单的`true/false`值，在`JavaScript`和`TypeScript`里叫做`boolean`（其它语言中也一样）。

```ts
let isDone: boolean = false;
```

## `Number`

和`JavaScript`一样，`TypeScript`里的所有数字都是浮点数。 这些浮点数的类型是 `number`。 除了支持`十进制`和`十六进制`字面量，`TypeScript`还支持`ECMAScript 2015`中引入的`二进制`和`八进制`字面量。

```ts
let decLiteral: number = 6;
let hexLiteral: number = 0xf00d;
let binaryLiteral: number = 0b1010;
let octalLiteral: number = 0o744;
```

## String 

我们使用 `string`表示文本数据类型。 和`JavaScript`一样，可以使用双引号（"）或单引号（'）表示字符串。

```ts
let name: string = "bob";
name = "smith";
```

我们还可以使用模版字符串，它可以定义多行文本和内嵌表达式。 这种字符串是被反引号包围（ `），并且以${ expr }这种形式嵌入表达式

```ts
let name: string = `Gene`;
let age: number = 37;
let sentence: string = `Hello, my name is ${ name }.

I'll be ${ age + 1 } years old next month.`;
```

## Array 

`TypeScript`像`JavaScript`一样可以操作数组元素。 有两种方式可以定义数组。 第一种，可以在元素类型后面接上 []，表示由此类型元素组成的一个数组：

```ts
let list: number[] = [1, 2, 3];
let list2: string[] = ['1', '2', '3'];
```

第二种方式是使用数组泛型，`Array<元素类型>`：

```ts
let list: Array<number> = [1, 2, 3];
// 当数组中既有string已有number
let list2: Array<number | string> = [1,2,3,'4'];  

```

## Object 

`object`表示非原始类型，也就是除`number`，`string`，`boolean`，`symbol`，`null`或`undefined`之外的类型。

使用`object`类型，就可以更好的表示像`Object.create`这样的API。例如：

```ts
declare function create(o: object | null): void;

create({ prop: 0 }); // OK
create(null); // OK

create(42); // Error
create("string"); // Error
create(false); // Error
create(undefined); // Error
```


## Symbol 

自`ECMAScript 2015`起，`symbol`成为了一种新的原生类型，就像`number`和`string`一样。

`symbol`类型的值是通过`Symbol`构造函数创建的。

```ts
let sym1 = Symbol();

let sym2 = Symbol("key"); // 可选的字符串key
```


## Null 和 Undefined

`TypeScript`里，`undefined`和`null`两者各自有自己的类型分别叫做`undefined`和`null`。 和 `void`相似，它们的本身的类型用处不是很大：

```ts
// Not much else we can assign to these variables!
let u: undefined = undefined;
let n: null = null;
let y: undefined = '1'; // 报错
```

## void 

当我们使用一个没有任何返回的函数, 就用 void 

```ts
function warnUser(): void {
    console.log("This is my warning message");
}
```

声明一个`void`类型的变量没有什么大用，因为你只能为它赋予`undefined`和`null`：

```ts
let unusable: void = undefined;
```

## any 

有时候，我们会想要为那些在编程阶段还不清楚类型的变量指定一个类型。 这些值可能来自于动态的内容，比如来自用户输入或第三方代码库。 这种情况下，我们不希望类型检查器对这些值进行检查而是直接让它们通过编译阶段的检查。 那么我们可以使用 `any`类型来标记这些变量：

但是在我们知道变量的类型的时候，不推荐使用`any`来进行标记，如果都使用`any`，那么就失去了使用`TypeScript`的意义。

```ts
let notSure: any = 4;
notSure = "maybe a string instead";
notSure = false; // okay, definitely a boolean
```

## never 

`never`类型表示的是那些永不存在的值的类型。 例如， `never`类型是那些总是会抛出异常或根本就不会有返回值的函数表达式或箭头函数表达式的返回值类型； 变量也可能是 `never`类型，当它们被永不为真的类型保护所约束时。

一般很少使用, 场景: `函数抛出错误` 或 `死循环时使用` never 

```ts
// 返回never的函数必须存在无法达到的终点
function error(message): never {
   throw new Error(message);
}
// 推断的返回值类型为never
function fail() {
    return error("Something failed");
}
// 返回never的函数必须存在无法达到的终点
function infiniteLoop(): never {
   while (true) {

   }
}
```


## 元组 

元组类型允许表示一个已知元素数量和类型的数组，各元素的类型不必相同。 比如，你可以定义一对值分别为 `string`和`number`类型的元组。

```ts
// Declare a tuple type
let x: [string, number];
// Initialize it
x = ['hello', 10]; // OK
// Initialize it incorrectly
x = [10, 'hello']; // Error
```

当访问一个已知索引的元素，会得到正确的类型：

```ts
console.log(x[0].substr(1)); // OK
console.log(x[1].substr(1)); // Error, 'number' does not have 'substr'
```

当访问一个越界的元素，会使用联合类型替代：

```ts
x[3] = 'world'; // OK, 字符串可以赋值给(string | number)类型
console.log(x[5].toString()); // OK, 'string' 和 'number' 都有 toString
x[6] = true; // Error, 布尔不是(string | number)类型
```

可以给该元祖添加新元素, 但不能 “越界” 访问

```ts
let tuple: [number , string] = [1 , '2']
tuple.push('3'); //正常push
tuple[2]  //报错, 因为越界访问了
```

