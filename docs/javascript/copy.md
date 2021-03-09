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

如果是浅拷贝的话，我们可以很容易写出下面的代码：

```js
// 创建一个新的对象，遍历需要克隆的对象，将需要克隆对象的属性依次添加到新对象上，返回。
function clone(target) {
    let cloneTarget = {};
    for (const key in target) {
        cloneTarget[key] = target[key];
    }
    return cloneTarget;
};
```

如果是`深拷贝`的话，考虑到我们要拷贝的对象是不知道有多少层深度的，我们可以用递归来解决问题，稍微改写上面的代码：

- 如果是`原始类型`，无需继续拷贝，直接返回。

- 如果是`引用类型`，创建一个新的对象，遍历需要克隆的对象，将需要克隆对象的属性执行深拷贝后依次添加到新对象上。

很容易理解，如果有更深层次的对象可以继续递归直到属性为原始类型，这样我们就完成了一个最简单的深拷贝：


```js
function deepClone(target) {
    if (typeof target === 'object') {
        let cloneTarget = Array.isArray(target) ? [] : {};
        for (const key in target) {
            cloneTarget[key] = deepClone(target[key]);
        }
        return cloneTarget;
    } else {
        return target;
    }
};
```

上述代码可以解决常用的95%场景,但是在对象循环引用自身的时候还是会报错。我们来看下面这个测试用例:

```js
const target = {
    field1: 1,
    field2: undefined,
    field3: {
        child: 'child'
    },
    field4: [2, 4, 8]
};
```

![测试图片](https://img-blog.csdnimg.cn/20210309112632905.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

**由于上面的对象存在循环引用的情况，即对象的属性间接或直接的引用了自身的情况,递归进入死循环导致栈内存溢出了.**

:::tip
解决循环引用问题，我们可以额外开辟一个存储空间，来存储当前对象和拷贝对象的对应关系，当需要拷贝当前对象时，先去存储空间中找，有没有拷贝过这个对象，如果有的话直接返回，如果没有的话继续拷贝，这样就巧妙化解的循环引用的问题。
:::

这个存储空间，需要可以存储`key-value`形式的数据，且`key`可以是一个`引用类型`，我们可以选择`Map`这种数据结构：

1. 检查map中有无克隆过的对象
2. 有 - 直接返回
3. 没有 - 将当前对象作为key，克隆对象作为value进行存储
4. 继续克隆

因此我们的代码可以修改为:

```js
function deepClone(target, map = new Map()) {
    if (typeof target === 'object') {
        let cloneTarget = Array.isArray(target) ? [] : {};
        if (map.get(target)) {
            return map.get(target);
        }
        map.set(target, cloneTarget);
        for (const key in target) {
            cloneTarget[key] = deepClone(target[key], map);
        }
        return cloneTarget;
    } else {
        return target;
    }
};
```

![修改后](https://img-blog.csdnimg.cn/20210309130216176.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70#pic_center)

修改后执行成功,此时obj2中的target变为了一个`Circular`类型，即循环应用的意思。

上述代码中我们使用`Map`来存储循环引用的对象,实际上浪费了一部分的空间,现在我们优化下上述代码,将`Map`改成`WeakMap`。

```js
function deepClone(target, map = new WeakMap()) {
    if (typeof target === 'object') {
        let cloneTarget = Array.isArray(target) ? [] : {};
        if (map.get(target)) {
            return map.get(target);
        }
        map.set(target, cloneTarget);
        for (const key in target) {
            cloneTarget[key] = deepClone(target[key], map);
        }
        return cloneTarget;
    } else {
        return target;
    }
};
```

当我们创建一个对象时：`const obj = {}`，就默认创建了一个`强引用`的对象，我们只有手动将`obj = null`，它才会被`垃圾回收机制`进行回收，如果是`弱引用对象`，垃圾回收机制会自动帮我们回收。

```js
let obj = { name : 'Linda'}
const target = new Map();
target.set(obj,'Hello I am Linda');
obj = null;
```
虽然我们手动将`obj`，进行释放，但是`target`依然对`obj`存在强引用关系，所以这部分内存依然无法被释放。

如果是`WeakMap`的话，`target`和`obj`存在的就是`弱引用关系`，当下一次垃圾回收机制执行时，这块内存就会被释放掉。

:::tip
因此,我们在进行深拷贝的时候,我们只是在拷贝过程中使用到了该对象,等拷贝结束后就可以进行回收。

设想一下，如果我们要拷贝的对象非常庞大时，使用`Map`会对内存造成非常大的额外消耗，而且我们需要手动清除`Map`的属性才能释放这块内存，而`WeakMap`会帮我们巧妙化解这个问题。
:::

到这里为止我们已经可以完成对数组和对象的深拷贝了,但是上述方法中我们使用到了`for...in...`循环,它的执行效率是比较低的。

在`for`循环、`while`循环、`for-in`循环中,`while`循环的效率是最高的。我们先实现个自定义循环方法。

```js
/**
 * @param {array} array 需要循环的数组
 * @param {function} iteratee 遍历的回调函数
*/
function forEach(array, iteratee) {
    let index = -1;
    const length = array.length;
    while (++index < length) {
        iteratee(array[index], index);
    }
    return array;
}
```
接下来进行方法替换。

```js
function deepClone(target, map = new WeakMap()) {
    if (typeof target === 'object') {
        const isArray = Array.isArray(target);
        let cloneTarget = isArray ? [] : {};

        if (map.get(target)) {
            return map.get(target);
        }
        map.set(target, cloneTarget);

        const keys = isArray ? undefined : Object.keys(target);
        forEach(keys || target, (value, key) => {
            if (keys) {
                key = value;
            }
            cloneTarget[key] = deepClone(target[key], map);
        });

        return cloneTarget;
    } else {
        return target;
    }
}
```

到此我们已经完成了对普通的`object`和`array`两种数据类型的深拷贝方法并且进行了性能调优。

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

