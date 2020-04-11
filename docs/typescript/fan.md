# 泛型

软件工程中，我们不仅要创建一致的定义良好的API，同时也要考虑可重用性。 组件不仅能够支持当前的数据类型，同时也能支持未来的数据类型，这在创建大型系统时为你提供了十分灵活的功能。

## 为何要用泛型

`javascript` 作为一门动态语言, 在实际运行的时候,等变量被赋值才知道该变量的类型. 动态语言给实际的编码带来了很大的灵活性.

```ts
function getVal(val) {
   return val;
}
getVal(1) // 返回数字类型
getVal('1') // 返回字符串类型
getVal(['2']) // 返回数组类型
```

但是同样的, 在代码运行期间有可能会发生与类型相关的错误, 降低了代码的可维护性. 那下面我们用 `typescrip`t 来定义变量. 为了支持3种调用方式, 我们需要声明三种类型定义. 

有2种方法可以解决上面这个问题. 

1. 函数重载

```ts
function getVal(val: number): number 

function getVal(val: string):string 

function getVal(val: any):any {
   return val;
}
```

2. 联合类型

```ts
function getVal(val: string | number | any[]):string | number | any[] {
    return val;
}
```

上面2种方法让我们感受重复繁琐. 这是无法容忍的. 

那怎么样可以让该函数又可以在运行的时候被赋值才确定该变量的类型, 又有一定的类型约束减少相关的错误? 答案就是: `泛型`。

```ts
function getVal<T>(val: T): T {
   return val;
}
```

:::tip
`T` 即代表捕获函数传入的参数类型, 然后在函数内部使用 `T` 即用该参数类型声明其他变量.
:::

但是我们从上面的函数看出, 因为 T 是捕获参数传入的参数类型, 

而这个函数可以传入任意参数, 与我们最开始只支持3个类型的需求不符. 所以下面要引入泛型约束.

## 泛型约束

```ts
type Params=  string | number | any[];

function getVal<T extends Params>(val: T): T {
   return val;
}

getVal(1);
getVal('2');
getVal(['222']);

getVal<number>('3'); // 跟泛型指定的类型不一致, 报错
getVal({}); // 不是 Param 类型, 报错
```

## 泛型语法

泛型既可以声明函数, 也可以声明类. 也可以声明接口

```ts
class Person<T>{} // 一个尖括号跟在类名后面

function Person<T> {}  // 一个尖括号跟在函数名后面

interface Person<T> {}  // 一个尖括号跟在接口名后面
```

有些时候, 一个类或者一个函数里面, 他不止要用到一个动态类型, 他要用到多个. 但是我们上面只能捕获一个, 那直接声明多个即可。 

```ts
function getName<T,U> (name: T, id: U): [T, U] {
   return [name, id]
}

getName('peen', 1);

getName('peen', '222'); // 正常

getName<string, number>('peen', '22'); // 报错: '22'不是number类型
```

## 实际应用

在实际项目中, 每个项目都需要接口请求, 我们会封装一个通用的接口请求, 在这个函数里面, 处理一些常见的错误等等. 

为了让每个接口调用都有 `typescript` 约束, 提醒. 这里使用泛型是非常合适了. 

```ts
interface IApiSourceParams {
   GetList: IGetList
}

interface IGetList {
   id: number;
}

export function fetchApi<T extends keyof IApiSourceParams> (action: T, params: IApiSourceParams[T]) {

   return ajax({
       url: action,
       method: 'POST',
       body: params
   })
}

fetchApi('GetList', { id: 2 });

fetchApi('GetList', { id: '33' }); // 报错, id 应该是 number 类型
```

这样子, 我们就给一个通用的接口请求函数增加了类型约束. 在 `IApiSourceParams` 中扩展每一个接口类型即可. 

从上面的例子看到了 `T extends keyof IApiSourceParams` , 实际这种应用场景特别多.  这要讲 `索引类型`。 

## 高级类型: 索引类型

索引类型查询操作符: `keyof` , 对于任何类型 `T`， `keyof T`的结果为 `T`上已知的公共属性名的联合. 看着话有点绕, 直接看例子吧

```ts
interface Person {
   name: string;
   age: number;
}

let personProps: keyof Person; // 'name' | 'age'
```

索引访问操作符 : `T[K]` .  
上面的 `keyof` 实际就是获取了对象的键值, 看一下上面的实际例子

```ts
interface IApiSourceParams {
   GetList: IGetList,
   PostApi: IPostApi
}

interface IGetList {
   id: number;
}

export function fetchApi<T extends keyof IApiSourceParams> (action: T, params: IApiSourceParams[T]) {

   return ajax({
       url: action,
       method: 'POST',
       body: params
   })
}

// IApiSourceParams[T] 获取的便是接口 IApiSourceParams 对应key值的接口
IGetList.
```

## react中的实际场景

```ts
// react 类 
class Test extends Component<IProps, IState> {}

//  react class 里面的 typescript 声明
class Component<P, S> {

   static contextType?: Context<any>;

   context: any;

   constructor(props: Readonly<P>);

   constructor(props: P, context?: any);

   setState<K extends keyof S>(

       state: ((prevState: Readonly<S>, props: Readonly<P>) => (Pick<S, K> | S | null)) | (Pick<S, K> | S | null),

       callback?: () => void

   ): void;

   forceUpdate(callBack?: () => void): void;

   render(): ReactNode;

   readonly props: Readonly<P> & Readonly<{ children?: ReactNode }>;

   state: Readonly<S>;

   refs: {
       [key: string]: ReactInstance
   };
}

// `useState` 方法.

function useState<S>(initialState: S | (() => S)): [S, Dispatch<SetStateAction<S>>];

function useState<S = undefined>(): [S | undefined, Dispatch<SetStateAction<S | undefined>>];

const [errorMessage, setError] = useState<string>('');
```


