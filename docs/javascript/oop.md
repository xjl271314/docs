# 面向对象编程 

面向对象编程(`Object Orient Programming`)简称`OOP`，是一种编程技术。

`JavaScript`本身并没有类的概念，js中创建自定义对象的最简单方式就是创建一个`Object`的实例，然后再为它添加属性和方法，如下所示：

```js
var person = new Object(); 
person.name = "Nicholas"; 
person.age = 29; 
person.job = "Software Engineer"; 
person.sayName = function(){ 
    alert(this.name); 
};
```

早期的`JavaScript`开发人员经常使用这个模式创建新对象。几年后，`对象字面量`成为创建这种对象的首选模式。前面的例子用对象字面量语法可以写成这样：

```js
var person = { 
 name: "Nicholas", 
 age: 29, 
 job: "Software Engineer", 
 sayName: function(){ 
 	alert(this.name); 
 } 
};
```

**`ECMAScript`中有两种属性：`数据属性`和`访问器属性`。**

## 数据属性

**数据属性包含一个数据值的位置。在这个位置可以读取和写入值。数据属性有 4 个描述其行为的特性：**

1. `Configurable`：表示能否通过`delete`删除属性从而重新定义属性，能否修改属性的特性，或者能否把属性修改为访问器属性。直接在对象上定义的属性，它们的这个特性默认值为 `true`。
2. `Enumerable`: 表示能否通过 `for-in` 循环返回属性。直接在对象上定义的属性，它们的这个特性默认值为 `true`。
3. `Writable`：表示能否修改属性的值。直接在对象上定义的属性，它们的这个特性默认值为 `true`。
4. `Value`:包含这个属性的数据值。读取属性值的时候，从这个位置读；写入属性值的时候，把新值保存在这个位置。这个特性的默认值为 `undefined`。

要修改属性默认的特性，必须使用`ECMAScript5` 的`Object.defineProperty()`方法。

这个方法接收三个参数：`属性所在的对象`、`属性的名字`和`一个描述符对象`。

其中，描述符对象的属性必须是：`configurable`、`enumerable`、`writable` 和 `value`。设置其中的一或多个值，可以修改对应的特性值。

```js
var person = {}; 
Object.defineProperty(person, "name", { 
 writable: false, 
 value: "Nicholas" 
}); 
alert(person.name); // "Nicholas" 
person.name = "Greg"; 
alert(person.name); // "Nicholas"
```

## 访问器属性

**访问器属性不包含数据值；它们包含一对儿 `getter` 和 `setter` 函数（不过，这两个函数都不是必需的）。**

访问器属性有如下4个特性:


1. `Configurable`：表示能否通过`delete`删除属性从而重新定义属性，能否修改属性的特性，或者能否把属性修改为数据属性。对于直接在对象上定义的属性，这个特性的默认值为`true`。 
2. `Enumerable`：表示能否通过 `for-in`循环返回属性。对于直接在对象上定义的属性，这个特性的默认值为`true`。
3. `Get`：在读取属性时调用的函数。默认值为`undefined`。 
4. `Set`：在写入属性时调用的函数。默认值为`undefined`。

:::warning
访问器属性不能直接定义，必须使用`Object.defineProperty()`来定义。
:::

```js
var book = { 
    _year: 2004, 
    edition: 1 
}; 
Object.defineProperty(book, "year", { 
    get: function(){ 
 	    return this._year; 
    }, 
    set: function(newValue){ 
	    if (newValue > 2004) { 
		    this._year = newValue; 
		    this.edition += newValue - 2004; 
	    } 
    } 
}); 
book.year = 2005; 
alert(book.edition); //2
```

## 读取属性的特性

使用`ECMAScript5`的 `Object.getOwnPropertyDescriptor()`方法，可以取得给定属性的描述符。

这个方法接收两个参数：`属性所在的对象`和`要读取其描述符的属性名称`,返回值是一个对象。

:::tip
如果是`访问器属性`，这个对象的属性有 `configurable`、`enumerable`、`get` 和 `set`。

如果是`数据属性`，这个对象的属性有 `configurable`、`enumerable`、`writable` 和 `value`。
:::

```js
var book = {}; 
Object.defineProperties(book, { 
    _year: { 
 	    value: 2004 
    }, 
    edition: { 
 	    value: 1 
    }, 
    year: { 
	    get: function(){ 
	 	    return this._year; 
	    }, 
	    set: function(newValue){ 
		    if (newValue > 2004) { 
		        this._year = newValue; 
		        this.edition += newValue - 2004; 
            } 
        }
    }
}); 

var descriptor = Object.getOwnPropertyDescriptor(book, "_year"); 
alert(descriptor.value); // 2004 
alert(descriptor.configurable); // false
alert(typeof descriptor.get); // "undefined" 

var descriptor = Object.getOwnPropertyDescriptor(book, "year"); 
alert(descriptor.value); // undefined 
alert(descriptor.enumerable); // false 
alert(typeof descriptor.get); // "function"
```

## 设计模式与继承

### 1.工厂模式

`工厂模式`是软件工程领域一种广为人知的设计模式，`这种模式抽象了创建具体对象的过程`。

考虑到在`ECMAScript`中无法创建类，开发人员就发明了一种函数，用函数来封装以特定接口创建对象的细节，如下面的例子所示：

```js
 var o = new Object(); 
 o.name = name; 
 o.age = age; 
 o.job = job; 
 o.sayName = function(){ 
 	alert(this.name); 
 }; 
 return o; 
} 
var person1 = createPerson("Nicholas", 29, "Software Engineer"); 
var person2 = createPerson("Greg", 27, "Doctor");
```

:::tip
工厂模式虽然解决了创建多个相似对象的问题，但却没有解决对象识别的问题（即怎样知道一个对象的类型）,随着 JavaScript的发展，又一个新模式出现了。
:::

### 2.构造函数模式

像`Object`和 `Array`这样的原生构造函数，在运行时会自动出现在执行环境中。此外，也可以创建自定义的构造函数，从而定义自定义对象类型的属性和方法。例如，可以使用`构造函数模式`将前面的例子重写如下:

```js
function Person(name, age, job){ 
    this.name = name; 
    this.age = age; 
    this.job = job; 
    this.sayName = function(){ 
 	    alert(this.name); 
    }; 
} 
var person1 = new Person("Nicholas", 29, "Software Engineer"); 
var person2 = new Person("Greg", 27, "Doctor");
```

要创建 `Person` 的新实例，必须使用 `new` 操作符。以这种方式调用构造函数实际上会经历以下4个步骤：
> 1. 创建一个新对象；
> 2. 将构造函数的作用域赋给新对象（因此this就指向了这个新对象）；
> 3. 执行构造函数中的代码（为这个新对象添加属性）；
> 4. 返回新对象。

构造函数模式虽然好用，但也并非没有缺点。使用构造函数的主要问题，<font color="red">就是每个方法都要在每个实例上重新创建一遍。</font>


在前面的例子中，`person1`和`person2` 都有一个名为`sayName()`的方法，但那两个方法不是同一个`Function`的实例。不要忘了——`ECMAScript`中的函数是对象，因此每定义一个函数，也就是实例化了一个对象。从逻辑角度讲，此时的构造函数也可以这样定义:

```js
function Person(name, age, job){ 
    this.name = name; 
    this.age = age; 
    this.job = job; 
    this.sayName = new Function("alert(this.name)"); // 与声明函数在逻辑上是等价的
}
```

从这个角度上来看构造函数，更容易明白每个 `Person`实例都包含一个不同的 `Function` 实例（以显示 name 属性）的本质。
说明白些，以这种方式创建函数，会导致不同的作用域链和标识符解析，但创建 `Function` 新实例的机制仍然是相同的。因此，不同实例上的同名函数是不相等的，以下代码可以证明这一点。

```js
alert(person1.sayName == person2.sayName); // false
```

然而，创建两个完成同样任务的` Function `实例的确没有必要；况且有 `this` 对象在，根本不用在执行代码前就把函数绑定到特定对象上面。

因此，大可像下面这样，通过把函数定义转移到构造函数外部来解决这个问题。

```js
function Person(name, age, job){ 
    this.name = name; 
    this.age = age; 
    this.job = job; 
    this.sayName = sayName; 
} 
function sayName(){ 
    alert(this.name); 
} 
var person1 = new Person("Nicholas", 29, "Software Engineer"); 
var person2 = new Person("Greg", 27, "Doctor");
```

在这个例子中，我们把 `sayName()`函数的定义转移到了构造函数外部。而在构造函数内部，我们将 `sayName` 属性设置成等于全局`sayName` 函数。这样一来，由于 `sayName` 包含的是一个指向函数的指针，因此 `person1` 和 `person2 `对象就共享了在全局作用域中定义的同一个 `sayName()`函数。

这样做确实解决了两个函数做同一件事的问题，可是新问题又来了：<font color="red">在全局作用域中定义的函数实际上只能被某个对象调用，这让全局作用域有点名不副实。而更让人无法接受的是：如果对象需要定义很多方法，那么就要定义很多个全局函数，于是我们这个自定义的引用类型就丝毫没有封装性可言了。</font>

好在，这些问题可以通过使用`原型模式`来解决。

### 3.原型模式

我们创建的每个函数都有一个 `prototype（原型）`属性，这个属性是一个`指针`，指向一个对象，而这个对象的用途是包含可以由特定类型的所有实例共享的属性和方法。

如果按照字面意思来理解，那么`prototype`就是**通过调用构造函数而创建的那个对象实例的原型对象**。

**使用原型对象的好处是可以让所有对象实例共享它所包含的属性和方法**。换句话说，不必在构造函数中定义对象实例的信息，而是可以将这些信息直接添加到原型对象中，如下面的例子所示:

```js
function Person(){ } 

Person.prototype.name = "Nicholas"; 
Person.prototype.age = 29; 
Person.prototype.job = "Software Engineer"; 
Person.prototype.sayName = function(){ 
 alert(this.name); 
}; 

var person1 = new Person(); 
person1.sayName(); // "Nicholas" 
var person2 = new Person();
person2.sayName(); // "Nicholas" 
alert(person1.sayName == person2.sayName); // true
```

####  理解原型对象

无论什么时候，只要创建了一个新函数，就会根据一组特定的规则为该函数创建一个`prototype`属性，这个属性**指向函数的原型对象**。

在默认情况下，所有原型对象都会自动获得一个 `constructor（构造函数）`属性，这个属性包含一个指向 `prototype `属性所在函数的指针。

就拿前面的例子来说，`Person.prototype. constructor` 指向 `Person`。而通过这个构造函数，我们还可继续为原型对象添加其他属性和方法。

创建了自定义的构造函数之后，其原型对象默认只会取得`constructor`属性；至于其他方法，则都是从 `Object `继承而来的。