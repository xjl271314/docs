# 部分项目实践

- 2020-04-11

## 如何处理第三方库类型相关问题

`Typescip`t 所提供的第三方库类型定义不仅约束我们的输入调用, 还能为我们提供文档. 现在, `NPM`上的第三方类型定义种类繁多，很难保证类型定义是正确的. 也很难保证所有使用的第三方库都有类型定义. 

那么, 在这个充满未知的过程中，如何才能正确使用`TypeScript`中的第三方库呢？

**下面列举了四种常见的无法正常工作的场景以及对应的解决方法：**

1. 库本身没有自带类型定义
2. 库本身没有类型定义, 也没有相关的@type
3. 类型声明库有误
4. 类型声明报错


### 1. 库本身没有自带类型定义

查找不到相关的库类型. 

```ts
if (module.hot) {
    ...
}
```
在初次将 `react` 改造支持 `typescript` 时, 想必很多人都会遇到 `module.hot` 报错. 此时只需要安装对应的类型库即可. 

```js
npm i @types/webpack-env
```

### 2. 库本身没有类型定义, 也没有相关的@type

这种情况下需要我们自己定义一个type

```js
declare module "lodash"
```

### 3. 类型声明库有误

- 推动解决官方类型定义的问题, 提`issue`, `pr`
- `Import` 后通过 `extends` 或者 `merge` 能力对原类型进行扩展
- 忍受类型的丢失或不可靠性
- 使用 `// @ts-ignore`  忽略

### 4. 类型声明报错

在 `compilerOptions` 的添加`"skipLibCheck": true`, 曲线救国

## 巧用类型收缩解决报错

下面列举了几种常见的解决方法：

- 类型断言
- 类型守卫 typeof in instanceof 字面量类型保护
- 双重断言

### 1. 类型断言

类型断言可以明确的告诉 `TypeScript` 值的详细类型，

在某些场景, 我们非常确认它的类型, 即使与 `typescript` 推断出来的类型不一致. 那我们可以使用`类型断言`. 

```ts
<类型>值

值 as 类型 
// 推荐使用这种语法. 因为<>容易跟泛型, react 中的语法起冲突
```

举个例子, 如下代码,  `padding` 值可以是 `string` , 也可以是 `number`, 虽然在代码里面写了 `Array()`, 我们明确的知道, `padding` 会被`parseInt` 转换成 `number` 类型, 但类型定义依然会报错. 

```ts
function padLeft(value: string, padding: string | number) {
   // 报错: Operator '+' cannot be applied to

   // types 'string | number' and 'number'
   return Array(padding + 1).join(" ") + value;
}
```

解决方法, 使用`类型断言`. 告诉 `typescript` 这里我确认它是 `number` 类型, 忽略报错. 

```ts
function padLeft(value: string, padding: string | number) {
   // 正常
   return Array(padding as number + 1).join(" ") + value;
}
```

### 2. 类型守卫

类型守卫有以下几种方式, 简单的概括以下

- `typeof`:  用于判断 `"number"`，`"string"`，`"boolean"`或 `"symbol"` 四种类型. 
- `instanceof` : 用于判断一个实例是否属于某个类
- `in`: 用于判断一个属性/方法是否属于某个对象
- 字面量类型保护

上面的例子中, 是 `string | number` 类型, 因此使用 `typeof` 来进行类型守卫. 例子如下:

```ts
function padLeft(value: string,padding: string | number) {
   if (typeof padding === 'number') {
       console.log(padding + 3); //正常
       console.log(padding + 2); //正常
       console.log(padding + 5); //正常
        // 正常
       return Array(padding + 1).join(' ') value; 
   }
   if (typeof padding === 'string') {
       return padding + value;
   }
}
```

相比较 类型断言 `as` , 省去了大量代码. 除了 `typeof` , 我们还有几种方式, 下面一一举例子. 

- `instanceof` :用于判断一个实例是否属于某个类

```ts
class Man {
   handsome = 'handsome';
}

class Woman {
   beautiful = 'beautiful';
}


function Human(arg: Man | Woman) {
   if (arg instanceof Man) {
       console.log(arg.handsome);
       console.log(arg.beautiful); // error
   } else {
       // 这一块中一定是 Woman
       console.log(arg.beautiful);
   }
}
```

- `in` : 用于判断一个属性/方法是否属于某个对象

```ts
interface B {
   b: string;
}

interface A {
   a: string;
}

function foo(x: A | B) {
   if ('a' in x) {
       return x.a;
   }
   return x.b;
}
```

- 字面量类型保护

有些场景, 使用 `in`, `instanceof`, `typeof` 太过麻烦. 这时候可以自己构造一个字面量类型.

```ts
type Man = {
   handsome: 'handsome';
   type: 'man';
};

type Woman = {
   beautiful: 'beautiful';
   type: 'woman';
};

function Human(arg: Man | Woman) {
   if (arg.type === 'man') {
       console.log(arg.handsome);
       console.log(arg.beautiful); // error
   } else {
       // 这一块中一定是 Woman
       console.log(arg.beautiful);
   }
}
```

### 3.双重断言

有些时候使用 `as` 也会报错,因为 `as` 断言的时候也不是毫无条件的. 它只有当`S类型`是`T类型`的`子集`，或者`T类型`是`S类型`的子集时，`S`能被成功断言成`T`. 

所以面对这种情况, 只想暴力解决问题的情况, 可以使用`双重断言`. 

```ts
function handler(event: Event) {
   const element = event as HTMLElement;
   // Error: 'Event' 和 'HTMLElement' 中的任何一个都不能赋值给另外一个
}
```

如果你仍然想使用那个类型，你可以使用双重断言。首先断言成兼容所有类型的any

```ts
function handler(event: Event) {
   const element = (event as any) as HTMLElement;
    // 正常
}
```

## 巧用 typescript 支持 js 最新特性优化代码

### 可选链 Optional Chining 

```ts
// js
let x = foo?.bar.baz();

// ts
var _a;
let x = (_a = foo) === null || _a === void 0 ? void 0 : _a.bar.baz();
```
利用这个特性, 我们可以省去写很多恶心的 `a && a.b && a.b.c` 这样的代码

### 空值联合 Nullish Coalescing

```ts
// js
let x = foo ?? '22';

// ts
let x = (foo !== null && foo !== void 0 ? foo : '22');
```

## 巧用高级类型灵活处理数据

`Typescript` 提供了一些很不错的工具函数. 如下所示：

| 函数名 | 函数解释 |
|:-------- | :----- | 
`Partial<T>`  | 表示类型T的所有子集(每个属性都是可选的)
`ReadOnly<T>` | 返回一个跟T一样的类型，但会将所有属性都设置为`readonly`
`Required<T>` | 返回一个跟T一样的类型，但会将所有属性都设置为`required`
`Pick<T,K>`   | 从类型T中挑选出部分属性K而构造出来的新类型
`Exclude<T,U>` | 从类型T中移除部分属性U而构造出来的新类型
`Extract<T,U>` | 提取联合类型T中所有可以被赋值给类型U的部分
`NonNullable<T>` | 从联合类型中移除 `null` 和 `undefined` 而构造出来的新类型
`ReturnType<T>` | 表示函数类型T的返回值类型