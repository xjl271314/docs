# 深拷贝与浅拷贝

众所周知，`基本类型`赋值的话并不会影响原有对象，`Object`是`引用数据类型`，存储在内存的`堆`中，浅拷贝只是拷贝了另一个对象的内存地址，所以在修改时会同时修改另一个对象，而深拷贝会开辟新的内存地址，所以不会影响另一个对象。


- 基本数据类型的深拷贝

```js
let a = 1;
let b = a;

b = 2;
// a:1, b:2
```

- 一维数组和一维对象的深拷贝

```js
const arr1 = [1, 2, 3];
const arr2 = arr1
const arr3 = arr1.slice(0)

arr2[1] = 4
// arr1:[1,4,3] arr2:[1,4,3]
arr3[1] = 5
// arr1:[1,4,3] arr2:[1,4,3] arr3:[1,5,3]
// Array.slice(),Array.concat()都能实现一维数组的深拷贝

const obj1 = {
    'name':'xm',
    'age':24
}

const obj2 = Object.assign({},obj1);
obj2.name = 'dm';

/**
 * obj1 = {
 *  'name':'xm',
 *  'age':24
 * }
 * 
 * obj2 = {
 *  'name':'dm',
 *  'age':24
 * }
 * Object.assign()可以实现一维对象的深拷贝
 */

const fobj1 = {
    'id':1,
    'name':{
        'firstName':'Bruce',
        'lastName':'Li'
    }
}

const fobj2 = Object.assign({}, fobj1)

fobj2['name']['lastName'] = 'Hu'
// fobj2 = fobj1 
// Object.assign()如果对象内部仍然存在对象的话 不能进行深拷贝
```

**实现深拷贝**

**1. 采用`JSON.stringify()`和`JSON.parse()`实现**

```js
function deepClone(obj){
    let newObj = obj.constructor === Array ? [] : {};
    if(typeof obj !== 'object'){
        return obj
    }
    if(window.JSON){
        newObj = JSON.parse(JSON.stringify(obj);
    }
    return newObj
}
```

:::warning
`JSON.parse(JSON.stringify(obj))`方法在序列化过程中，`undefined`、`function`、`symbol`等值在序列化过程中会被忽略(出现在非数组对象的属性中时)或者被转换成`null`(出现在数组中)。
:::

```js
let obj1 = {
    x:[1, undefined, Symbol('3310')],
    y:undefined,
    z:function(){
        console.log(111)
    },
    a:Symbol('11111')
}

const obj2 = JSON.parse(JSON.stringify(obj1))

// obj2: { x: [1, null, null] }
```

虽然使用JSON相关方法的深拷贝不能解决这些问题，但是也可以适用绝大部分90%的场景。

**2. 递归深拷贝**

js本身提供的方法并不能解决对象嵌套等场景下的拷贝问题，只有递归进行拷贝。

```js
function deepClone(obj){
    let result = {}

    for(let i in obj){
        let value = obj[i]
        if(value === result){
            continue
        }
        if (typeof value === 'object') {
            result[i] = (value.constructor === Array) ? [] : {}
            result[i] = deepClone(value)
            // arguments.callee(value, result[i]);
        } else {
            result[i] = value
        }
    }

    return result
}

```

**3. 使用`loadsh`插件**

```js
function deepClone(obj) {
  var copy;

  if (null == obj || "object" != typeof obj) return obj;

  if (obj instanceof Date) {
    copy = new Date();
    copy.setTime(obj.getTime());
    return copy;
  }

  if (obj instanceof Array) {
    copy = [];
    for (var i = 0, len = obj.length; i < len; i++) {
        copy[i] = deepClone(obj[i]);
    }
    return copy;
  }

  if (obj instanceof Function) {
    copy = function() {
      return obj.apply(this, arguments);
    }
    return copy;
  }

  if (obj instanceof Object) {
      copy = {};
      for (var attr in obj) {
          if (obj.hasOwnProperty(attr)) copy[attr] = deepClone(obj[attr]);
      }
      return copy;
  }

  throw new Error("Unable to copy obj as type isn't supported " + obj.constructor.name);
}

```

