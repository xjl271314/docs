
# 枚举 

`enum`类型是对`JavaScript`标准数据类型的一个补充。 使用枚举我们可以定义一些带名字的常量, 可以清晰地表达意图或创建一组有区别的用例。 `TypeScript`支持数字的和基于字符串的枚举。

## 数字枚举

- 若无默认值, 默认从0开始, 依次递增

```ts
enum Direction {
    Up,
    Down,
    Left,
    Right
}
console.log(Direction.Up) // 0
console.log(Direction.Down) // 1
console.log(Direction.Left) // 2
console.log(Direction.Right) // 3
```

- 当我们给枚举指定初始值, 会从初始值依次递增

```ts
enum Direction {
    Up = 10,
    Down,
    Left,
    Right
}
console.log(Direction.Up) // 10
console.log(Direction.Down) // 11
console.log(Direction.Left) // 12
console.log(Direction.Right) // 13
```

我们稍微看一下ts内部实现的原理

```ts
// ts
enum Direction {
    Up = 10,
    Down,
    Left,
    Right
}
// js
(function (Direction) {
   Direction[Direction["Up"] = 10] = "Up";
   Direction[Direction["Down"] = 11] = "Down";
   Direction[Direction["Left"] = 12] = "Left";
   Direction[Direction["Right"] = 13] = "Right";
})(Direction || (Direction = {}));
```
1. 首先将`key`和`value`值进行对应 => `Direction["Up"] = 10;`
2. 接着将上一步的值作为`key`，将枚举中设定的`key`作为`value` => `Direction[Direction["Up"] = 10] = "Up";`

## 字符串枚举

字符串枚举的概念很简单，但是有细微的 `运行时的差别`。 在一个字符串枚举里，每个成员都必须用字符串字面量，或另外一个字符串枚举成员进行初始化。

```ts
enum Status {
   Success = '成功!',
   Fail= '失败'
}
// js
var Status;
(function (Status) {
   Status["Success"] = "\u6210\u529F!";
   Status["Fail"] = "\u5931\u8D25";
})(Status || (Status = {}));
```
对比数字枚举, 少了 `反向映射`, 就是普通的赋值. 只有 `key` 和 `值`. 不可以通过 `value` 索引 `key` 值.  

所以字符串的枚举, 只要有一个是字符串, 所有的成员都得赋值 

```ts
enum Status {
   Success = '成功!',
   Fail // 报错 需要进行赋值操作
}
```

## 异构枚举

我们可以混用`字符串枚举`和`数字枚举` , 但是不建议使用

```ts
enum Status {
    No = 0,
    Yes = "YES",
}
```
虽然上述代码并不会保错,但是我们不推荐这样去使用,这样的做法不符合枚举的规范，除非你真的想利用`javascript`运行时的行为。

## 枚举成员

- 枚举成员是只读的，不可以进行修改

```ts
enum Status {
   Success = '成功!',
   Fail= '失败'
}

Status.Fail = 'error';// 报错 只读属性
```

- 枚举成员可以是 `常量`, `表达式`, 也可以是`变量`

```ts
enum Types {
   a,
   b = 2,
   c = 1 + 3, // 表达式
   e = '123'.length
}
```
建议将常量等属性放置在前面 表达式和变量放在后面，这样方便阅读

- 枚举是在运行时真正存在的对象, 可以传递给对象使用

```ts
enum E {
   X, Y, Z
}
function f(obj: { X: number }) {
   return obj.X;
}
f(E); // 1
```