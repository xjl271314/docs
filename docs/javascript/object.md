# `Object`类型

对象可以通过执行`new`操作符后跟要创建的对象类型的名称来创建。

而创建`Object`类型的实例并为其添加属性和（或）方法，就可以创建自定义对象，如下所示：

```js
var o = new Object(); 
```

**`Object`的每个实例都具有下列属性和方法:**

- `constructor`：保存着用于创建当前对象的函数。对于前面的例子而言，就是`Object()`。
- `hasOwnProperty(propertyName)`：用于检查给定的属性在当前对象实例中（而不是在实例的原型中)是否存在。
其中，作为参数的属性`propertyName`必须以<font color="#ff0044">字符串</font>形式指定（例如：o.hasOwnProperty("name"))。
- `isPrototypeOf(object)`：用于检查传入的对象是否是传入对象的原型。
- `propertyIsEnumerable(propertyName)`：用于检查给定的属性是否能够使用`for-in`语句来枚举。与 `hasOwnProperty()`方法一样，作为参数的属性名必须以字符串形式指定。
- `toLocaleString()`：返回对象的字符串表示，该字符串与执行环境的地区对应。
- `toString()`：返回对象的字符串表示。
- `valueOf()`：返回对象的字符串、数值或布尔值表示。通常与`toString()`方法的返回值相同。

<font color="red">由于在`ECMAScript`中`Object`是所有对象的基础，因此所有对象都具有这些基本的属性和方法。</font>

## 创建object类型的方式

1. new + Object构造函数。
2. 对象字面量方法。

```javascript
// new + constructor
var person = new Object(); // //与 var person = {} 相同
person.name = "Nicholas"; 
person.age = 29;

// 对象字面量
var person = { 
 name : "Nicholas", 
 age : 29 
};
```

## Object.create(null)

```js
// 当我们使用Object.create(null)创建的对象不是Object的子类

const a = {};
const b = Object.create(null);

a == b // false

typeof a;// object
typeof b;// object

a instanceof Object;// true
b instanceof Object;// false

a.toString();// [object Object]
b.toString();// VM274:1 Uncaught TypeError: b.toString is not a function
```

