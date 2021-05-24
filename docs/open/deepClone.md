# 深拷贝如何解决循环引用？

- 2021.05.20

我们先来看一个例子:

```js
function deepCopy(obj) {
  const res = Array.isArray(obj) ? [] : {};
  for (let key in obj) {
    if (typeof obj[key] === "object") {
      res[key] = deepCopy(obj[key]);
    } else {
      res[key] = obj[key];
    }
  }
  return res;
}
var obj = {
  a: 1,
  b: 2,
  c: [1, 2, 3],
  d: { aa: 1, bb: 2 },
};
obj.e = obj;
console.log("obj", obj); // 不会报错

const objCopy = deepCopy(obj);
console.log(objCopy); // Uncaught RangeError: Maximum call stack size exceeded
```

从例子可以看到，当存在`循环引用`的时候，`deepCopy`会报错，栈溢出。

- `ob`j 对象存在循环引用时，打印它时是不会栈溢出。
- 深拷贝 `obj` 时，才会导致栈溢出。

## 循环引用问题解决

目标对象存在循环应用时报错处理。

大家都知道，对象的 `key` 是不能是对象的。

```js
{{a:1}:2}
// Uncaught SyntaxError: Unexpected token ':'
```

## 解决方式一：使用 weekmap:

解决循环引用问题，我们可以额外开辟一个存储空间，来存储当前对象和拷贝对象的对应关系。

这个存储空间，需要可以存储 `key-value` 形式的数据，且 `key` 可以是一个引用类型，

我们可以选择 `WeakMap` 这种数据结构：

1. 检查 WeakMap 中有无克隆过的对象
2. 有，直接返回
3. 没有，将当前对象作为 key，克隆对象作为 value 进行存储
4. 继续克隆

```js
function isObject(obj) {
  return (typeof obj === "object" || typeof obj === "function") && obj !== null;
}
function cloneDeep(source, hash = new WeakMap()) {
  if (!isObject(source)) return source;
  if (hash.has(source)) return hash.get(source); // 新增代码，查哈希表

  var target = Array.isArray(source) ? [] : {};
  hash.set(source, target); // 新增代码，哈希表设值

  for (var key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      if (isObject(source[key])) {
        target[key] = cloneDeep(source[key], hash); // 新增代码，传入哈希表
      } else {
        target[key] = source[key];
      }
    }
  }
  return target;
}
```

## 解决方式二：使用 Set，发现相同的对象直接赋值，也可用 Map。

```js
const o = { a: 1, b: 2 };
o.c = o;

function isPrimitive(val) {
  return Object(val) !== val;
}
const set = new Set();
function clone(obj) {
  const copied = {};
  for (const [key, value] of Object.entries(obj)) {
    if (isPrimitive(value)) {
      copied[key] = value;
    } else {
      if (set.has(value)) {
        copied[key] = { ...value };
      } else {
        set.add(value);
        copied[key] = clone(value);
      }
    }
  }
  return copied;
}
```
