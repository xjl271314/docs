# 接口

`TypeScript`的核心原则之一是对值所具有的结构进行类型检查。 它有时被称做“鸭式辨型法”或“结构性子类型化”。 在`TypeScript`里，接口的作用就是为这些类型命名和为你的代码或第三方代码定义契约。

## 接口对象的基本属性

接口里的属性不全都是必需的。可以有普通属性，可选属性及只读属性等。

```ts
interface User {
    readonly id: number; // 只读属性 不可修改
    name?: string; // 可以有, 可以没有
    gender: string;  // 一定要有
    eat(): void; // 也可以声明一个函数
}

// example
let p1: User = {
 id: 1,
 gender: 'man'
}
p1.id = 2;// 报错 Cannot assign to 'id' because it is a constant or a read-only property.

// example
let p2: User = {
 id: 2
}// 报错 Property 'gender' is missing in type
```

## 接口声明方式

这个 `type` 可以是普通的类型, 也可以是一个 `interface` 接口, 大概有以下三种使用方式. 如下:

```ts
interface List {
 data: string;
}
// 声明一个对象
let obj: List = {data: 'msg'}

// 函数声明参数, 返回值
function a (x: List):List  {
 return x;
}  

// 类实现接口, 类似于 java 语言, 在接口描述一个方法，在类里实现它
// 这种方式一般很少使用他, 不过可以了解一下
class Crazy implements List {
 constructor() {}
 data: string;
}
```

日常使用我们经常会有一些嵌套对象, 比如拿到后台接口的格式是这样子的.

```js
let res = {
    subject: 'math',
    detail:[{
        id: 1,
        data: '数学'
    }]
}
```
`interface` 是一个很灵活的属性. 可以多层嵌套.我们可以用下面的方式来定义:

```ts
interface List {
    id: number;
    data: string;
}
interface LearnList {
    subject: string,
    detail: List[];
}
let res: LearnList = {
    subject: 'math',
    detail: [{
        id: 1,
        data: '数学'
    }]
}
```
如果作为函数参数声明的话, 会有一个有意思的地方. 我们直接传值的话, 会有报错提示. 那如何解决这个报错提示? 在不修改 `interface` 声明的情况 ?

```ts
function transformData(data: LearnList) {
    return data;
}
transformData({
    subject: 'math',
    xxx: 'sss', // 报错, 多了一个属性
    detail: [{
        id: 1,
        data: '数学'
    }]
})
```

解决方法:

1. 将值赋值给一个对象.

这里涉及到一个类型兼容性, 后面的文章会详细讲. 此处大概讲一下. 也就是 `cache` 他有 `LearnList` 声明的对象里面的所有属性, 那 `cache` 兼容 `LearnList` 声明的对象, `cache`也就可以赋值给 `LearnList`声明的对象.

```ts
const cache = {
    subject: 'math',
    xxx: 'sss', //报错, 多了一个属性
    detail: [{
        id: 1,
        data: '数学'
    }]
};
transformData(cache) //不报错
```

2. 类型断言

这个特性也经常会使用, 学起来. 直接到传的参数后面调用 `as LearnList`, 告诉编辑器, 我们明确知道这个对象是 `LearnList` 的,请绕过这个检查.

```ts
transformData({
    subject: 'math',
    xxx: 'sss',
    detail: [{
        id: 1,
        data: '数学'
    }]
} as LearnList )
```

## 可索引类型接口

从上面的问题看出, 在原有的对象声明中多一个属性就报错了. 有些场景我们可能对入参的参数比较灵活, 除了我们规定的一些参数, 不确定还会传其他什么参数进来的时候, 可以使用 “可索引类型接口”

```ts
interface List {
    id: number;
    data: string;
}
interface LearnList {
    subject: string,
    detail: List[];
    [x: string]: any;  // 可以用任意的string类型去索引声明的对象, 值是any类型
}
transformData({
    subject: 'math',
    xxx: 'sss',
    detail: [{
        id: 1,
        data: '数学'
    }]
})
```

这样也可以解决上面的问题. 下面来简单梳理下 可索引类型接口.

1. 用字符串索引的接口

```ts
interface StringArray {
    [x: string]: string; // 表示可以用任意字符串去索引 对象, 得到一个字符串的值
}
```

2. 用数字索引的接口

```ts
interface StringArray {
 [x: number]: string; // 用任意的 number 去索引对象, 都会得到一个 string 类型. 其实就是我们的数组了
}
```

3. 混用2种索引

```ts
interface StringArray {
    [x: string]: string;
    [z: number]: string;
}
let x: StringArray = {
    1: '2323',
    '2':'23423'
} // 既可以用字符串索引也可以用数字索引
```

:::warning
注意点: 不管是数字索引还是字符串索引, 下面的索引值类型, 必须是上面索引的 子类型. 因为我们已经规定了任意的索引得到的值都是 `string` , 此时任何一个成员的值变成 `number` 都会报错.
:::

```ts
interface StringArray {
    [x: string]: string;
    [z: number]: string;
    y: 22; //报错 : Property 'y' of type '22' is not assignable to string index type 'string'
}
interface StringArray {
    [x: string]: string;
    [z: number]: number; //报错 因为 string 不兼容 number
}
interface StringArray {
    [x: string]: any;
    [z: number]: number; //正常· any 兼容 number
}
```

## 接口继承接口

```ts
interface Point {
    x: number;
}
// 继承一个接口直接 extends
interface Draw extends Point {  
    y: number;
}
interface Shape {
    draw(): void;
}

// 继承多个接口用逗号 , 隔开
// 同样的,他可以被反复 extends
interface Human extends Draw, Shape { }

// 必须具有继承接口的所有属性
let peen: Human = {
    x: 1,
    y: 1,
    draw: () => { },
}
```

## 接口实现

这一块其实是相对于 `javascript` 而言, 引入了 `java` 的一些属性. 比如 `implements`. 这一块在实际项目中其实很少用到. 但还是简单讲一下.

1. 接口只能描述类的公共部分，不能描述私有成员

```ts
interface Point {
    x: number;
    draw(): void;
}

class Draw implements Point {
    constructor() {

    }
    private x: number;  //报错   Class 'Draw' incorrectly implements interface 'Point'. Property 'x' is private in type 'Draw' but not in type 'Point'.
    draw() { }
}
```

2. 类实现接口时 ,必须实现接口中所有的属性

```ts
interface Point {
    x: number;
    draw(): void;
}

class Draw implements Point {
    constructor() {}
    x: number;  
    draw() { } // 如果这行不见了,就会报错
}
```

3. 接口无法约束类的构造函数

```ts
interface Point {
    x: number;
    draw(): void;
    new(x: number): void; // 报错. 不用写这个
}

class Draw implements Point {
    constructor(x: number) {
        this.x = x;
    }
    x: number;  
    draw() { }
}
```