# JSON数据处理

- 2020.10.11

## JSON.stringify

> 用于将 JavaScript 值转换为 JSON 字符串。

```js
JSON.stringify(value[, replacer[, space]])
```

- `value`：（必传)。 待转换的值。
- `replacer`：（可选)。用于转换结果的函数或数组。
  - 如果该参数是一个函数，则在序列化过程中，被序列化的值的每个属性都会经过该函数的转换和处理；
  - 如果该参数是一个数组，则只有包含在这个数组中的属性名才会被序列化到最终的 JSON 字符串中；
  - 如果该参数为 `null` 或者未提供，则对象所有的属性都会被序列化。
- `space`：（可选)。指定缩进用的空白字符串，用于美化输出（pretty-print）。
  - 如果参数是个数字，它代表有多少的空格；上限为10。
  - 该值若小于1，则意味着没有空格；
  - 如果该参数为字符串（当字符串长度超过10个字母，取其前10个字母），该字符串将被作为空格；
  - 如果该参数没有提供（或者为 `null`），将没有空格。

### 基本使用

```js
// 1. 用来转化对象
const obj = {
    key: 1,
    value: 22,
};

JSON.stringify(obj); // '{"key":1,"value":22}'

// 2. 用来转化基本类型
const num = 1;
const str = 'hello';
const none = null;
const un = undefined;
const flag = true;
const sym = Symbol(11);
const big = BigInt(10);

JSON.stringify(num); // '1' 
JSON.stringify(str); // 'hello'
JSON.stringify(none); // 'null'
JSON.stringify(un);   // undefined
JSON.stringify(flag); // 'true'
JSON.stringify(sym); // undefined
JSON.stringify(big); // Uncaught TypeError: Do not know how to serialize a BigInt at JSON.stringify
```

### 使用自定义replacer

```js
const obj = {
    key: 1,
    value: 22,
    label: undefined,
};

// 1. 如果该参数是一个函数，则在序列化过程中，被序列化的值的每个属性都会经过该函数的转换和处理；
JSON.stringify(obj, (key, value) => {
  return typeof value === 'number' ? undefined : value
}); // '{}'

// 2. 如果该参数是一个数组，则只有包含在这个数组中的属性名才会被序列化到最终的 JSON 字符串中；
JSON.stringify(obj, ['value']); // '{"value":22}'

// 3. 如果该参数为 `null` 或者未提供，则对象所有的属性都会被序列化。
JSON.stringify(obj, null); // '{"key":1,"value":22}'
```

### 使用美化参数space

```js
const obj = {
    key: 1,
    value: 22,
    label: undefined,
};

// 如果参数是个数字，它代表有多少的空格；上限为10。
JSON.stringify(obj, null, 20); // '{\n          "key": 1,\n          "value": 22\n}'

// 如果该参数为字符串（当字符串长度超过10个字母，取其前10个字母），该字符串将被作为空格；
JSON.stringify(obj, null, 'hello'); // '{\nhello"key": 1,\nhello"value": 22\n}'
```

### 9大特性

#### 特性一

1. `undefined`、`任意的函数`以及`symbol值`，出现在`非数组对象`的属性值中时在序列化过程中会被忽略。
2. `undefined`、`任意的函数`以及`symbol值`出现在`数组对象`中时会被转换成 `null`。
3. `undefined`、`任意的函数`以及`symbol值`被单独转换时，会返回 `undefined`。

```js
let obj1 = {
    x:[1, undefined, Symbol('3310')],
    y:undefined,
    z:function(){
        console.log(111)
    },
    a:Symbol('11111')
}

const obj2 = JSON.parse(JSON.stringify(obj1))// { x: [1, null, null] }
```

#### 特性二

> `布尔值`、`数字`、`字符串`的包装对象在序列化过程中会自动转换成对应的原始值。

```js
const flag = new Boolean(false);
const num = new Number(11);
const str = new String('123');

JSON.stringify(flag); // 'false'
JSON.stringify(num);  // '11'
JSON.stringify(str);  // '"123"'
```

#### 特性三

> `symbol` 类型的值都会被忽略，即便 `replacer` 参数中强制指定包含了它们。

```js
const obj = {
    key: 1,
    value: Symbol('123'),
};

JSON.stringify(obj);// '{"key":1}'

JSON.stringify(obj, (key, value)=>{
    if(typeof key === 'symbol'){
        return value;
    }
});// undefined
```

#### 特性四

> `NaN` 和 `Infinity` 格式的数值及 `null` 都会被当做 `null`。

```js
JSON.stringify({
  age: NaN,
  age2: Infinity,
  name: null
});// '{"age":null,"age2":null,"name":null}'
```

#### 特性五

> 转换值如果包含 `toJSON()` 方法，将使用该方法的返回值。

```js
const obj = {
    key: 1,
    toJSON: function(){
        return 'hello world';
    }
}

JSON.stringify(obj); // '"hello world"'
```

#### 特性六

> 对 `Date类型` 调用 `toJSON()` 会将其转化为字符串来处理。

```js
const d = new Date();

d.toJSON(); // '2021-10-11T12:04:20.224Z'
JSON.stringify(d); // '"2021-10-11T12:04:20.224Z"'
```

#### 特性七

> 对包含循环引用的对象（对象之间相互引用，形成无限循环）执行此方法，会抛出错误。

```js
let obj = {
    key: 1,
    value: 2,
};

obj.obj = obj;

JSON.stringify(obj); // Uncaught TypeError: Converting circular structure to JSON
```

#### 特性八

> `Map/Set/WeakMap/WeakSet` 等类型，仅会序列化可枚举的属性。

```js
let obj = {};

Object.defineProperties(obj, { 
    key: {
        value: 1,
        enumerable: true
    },
    value: {
        value: '1234',
        enumerable: false
    }
});

JSON.stringify(obj); // '{"key":1}'
```

#### 特性九

> 尝试去转换 `BigInt` 类型的值会抛出错误

```js
const big = BigInt(10);

JSON.stringify(big); // Uncaught TypeError: Do not know how to serialize a BigInt
```

