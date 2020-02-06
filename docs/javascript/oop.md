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

## 设计模式

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

当调用构造函数创建一个新实例后，该实例的内部将包含一个指针（内部属性`__proto__`），指向构造函数的原型对象。

![prototype](https://img-blog.csdnimg.cn/20200115165317521.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

:::tip
虽然可以通过对象实例访问保存在原型中的值，但却不能通过对象实例重写原型中的值。
:::

如果我们在实例中添加了一个属性，而该属性与实例原型中的一个属性同名，那我们就在实例中创建该属性，该属性将会屏蔽原型中的那个属性。来看下面的例子:

```javascript
function Person(){ } 

Person.prototype.name = "Nicholas"; 
Person.prototype.age = 29; 
Person.prototype.job = "Software Engineer"; 
Person.prototype.sayName = function(){ 
    alert(this.name); 
}; 

var person1 = new Person();
var person2 = new Person(); 
person1.name = "Greg"; 

alert(person1.name); // "Greg"——来自实例
alert(person2.name); // "Nicholas"——来自原型
```

当为对象实例添加一个属性时，这个属性就会屏蔽原型对象中保存的同名属性；换句话说，添加这个属性只会阻止我们访问原型中的那个属性，但不会修改那个属性。

即使将这个属性设置为`null`，也只会在实例中设置这个属性，而不会恢复其指向原型的连接。

不过，使用 `delete `操作符则可以完全删除实例属性，从而让我们能够重新访问原型中的属性，如下所示:

```javascript
function Person(){ } 

Person.prototype.name = "Nicholas"; 
Person.prototype.age = 29; 
Person.prototype.job = "Software Engineer"; 
Person.prototype.sayName = function(){ 
 alert(this.name); 
}; 

var person1 = new Person(); 
var person2 = new Person(); 
person1.name = "Greg"; 
alert(person1.name); // "Greg"——来自实例
alert(person2.name); // "Nicholas"——来自原型

delete person1.name; 
alert(person1.name); // "Nicholas"——来自原型
```

:::tip
使用 `hasOwnProperty()`方法可以检测一个属性是存在于实例中，还是存在于原型中。

这个方法（不要忘了它是从`Object`继承来的）只在给定属性存在于对象实例中时，才会返回 `true`。
:::

```js
function Person(){} 

Person.prototype.name = "Nicholas"; 
Person.prototype.age = 29; 
Person.prototype.job = "Software Engineer"; 
Person.prototype.sayName = function(){
 alert(this.name); 
}; 

var person1 = new Person(); 
var person2 = new Person(); 

alert(person1.hasOwnProperty("name")); // false 
person1.name = "Greg"; 
alert(person1.name); // "Greg"——来自实例
alert(person1.hasOwnProperty("name")); // true 
alert(person2.name); // "Nicholas"——来自原型
alert(person2.hasOwnProperty("name")); // false 

delete person1.name; 

alert(person1.name); // "Nicholas"——来自原型
alert(person1.hasOwnProperty("name")); // false
```

:::tip
要取得原型属性的描述符，必须直接在原型对象上调用`Object.getOwnPropertyDescriptor()`方法。

同时使用 `hasOwnProperty()`方法和 `in` 操作符，就可以确定该属性到底是存在于对象中，还是存在于原型中。
:::

```js
// 判断该属性是否是原型上的属性
function hasPrototypeProperty(object, name){
    return !object.hasOwnProperty(name) && (name in object); 
}
```

:::tip
在使用 `for-in` 循环时，返回的是所有能够通过对象访问的、可枚举的（`enumerated`）属性，其中既包括存在于实例中的属性，也包括存在于原型中的属性。屏蔽了原型中不可枚举属性（即将`Enumerable`标记为`false`的属性）的实例属性也会在`for-in`循环中返回。

要取得对象上所有可枚举的实例属性，可以使用`Object.keys()`方法。这个方法接收一个对象作为参数，返回一个包含所有可枚举属性的字符串数组。
:::

```javascript
function Person(){} 

Person.prototype.name = "Nicholas"; 
Person.prototype.age = 29; 
Person.prototype.job = "Software Engineer"; 
Person.prototype.sayName = function(){ 
 alert(this.name); 
}; 

var keys = Object.keys(Person.prototype); 
alert(keys); // "name,age,job,sayName" 

var p1 = new Person(); 
p1.name = "Rob"; 
p1.age = 31; 
var p1keys = Object.keys(p1); 
alert(p1keys); // "name,age"
```
:::tip
如果你想要得到所有实例属性，无论它是否可枚举，都可以使`Object.getOwnPropertyNames()`方法。
:::

```js
var keys = Object.getOwnPropertyNames(Person.prototype); 
alert(keys); // "constructor,name,age,job,sayName"
```

:::warning
注意结果中包含了不可枚举的`constructor`属性。`Object.keys()`和 `Object.getOwnPropertyNames()`方法都可以用来替代`for-in` 循环。
:::

#### 原型对象的问题

原型模式也不是没有缺点。首先，它省略了为构造函数传递初始化参数这一环节，结果所有实例在默认情况下都将取得相同的属性值。虽然这会在某种程度上带来一些不方便，但还不是原型的最大问题。

原型模式的最大问题是由其共享的本性所导致的。原型中所有属性是被很多实例共享的，这种共享对于函数非常合适。对于那些包含基本值的属性倒也说得过去，通过在实例上添加一个同名属性，可以隐藏原型中的对应属性。然而，对于包含引用类型值的属性来说，问题就比较突出了。来看下面的例子：

```js
function Person(){ } 

Person.prototype = { 
    constructor: Person, 
    name : "Nicholas", 
    age : 29, 
    job : "Software Engineer", 
    friends : ["Shelby", "Court"], 
    sayName : function () { 
 	    alert(this.name); 
    } 
}; 

var person1 = new Person(); 
var person2 = new Person(); 
person1.friends.push("Van"); 
alert(person1.friends); // "Shelby,Court,Van" 
alert(person2.friends); // "Shelby,Court,Van" 
alert(person1.friends === person2.friends); // true
```

`Person.prototype` 对象有一个名为 `friends` 的属性，该属性包含一个字符串数组。
然后，创建了`Person`的两个实例。
修改了`person1.friends`引用的数组，向数组中添加了一个字符串。
由于`friends` 数组存在于`Person.prototype` 而非`person1` 中，所以刚刚提到的修改也会通过`person2.friends`（与 person1.friends 指向同一个数组）反映出来。

假如我们的初衷就是像这样在所有实例中共享一个数组，那么对这个结果我没有话可说。可是，实例一般都是要有属于自己的全部属性的。而这个问题正是我们很少看到有人单独使用原型模式的原因所在。

### 4.组合使用构造函数模式和原型模式

**创建自定义类型的最常见方式，就是`组合使用构造函数模式与原型模式`。**

-  构造函数模式用于定义实例属性，
-  原型模式用于定义方法和共享的属性。

结果，每个实例都会有自己的一份实例属性的副本，但同时又共享着对方法的引用，最大限度地节省了内存。另外，这种混成模式还支持向构造函数传递参数；可谓是集两种模式之长。下面的代码重写了前面的例子:

```js
function Person(name, age, job){ 
    this.name = name; 
    this.age = age; 
    this.job = job; 
    this.friends = ["Shelby", "Court"]; 
} 

Person.prototype = { 
    constructor : Person, 
    sayName : function(){ 
        alert(this.name); 
    } 
} 

var person1 = new Person("Nicholas", 29, "Software Engineer"); 
var person2 = new Person("Greg", 27, "Doctor"); 
person1.friends.push("Van"); 

alert(person1.friends); // "Shelby,Count,Van" 
alert(person2.friends); // "Shelby,Count" 
alert(person1.friends === person2.friends); // false 
alert(person1.sayName === person2.sayName); // true
```

### 5.寄生构造函数模式

这种模式的基本思想是创建一个函数，该函数的作用仅仅是封装创建对象的代码，然后再返回新创建的对象；
但从表面上看，这个函数又很像是典型的构造函数。下面是一个例子:

```javascript
function Person(name, age, job){ 
    var o = new Object(); 
    o.name = name; 
    o.age = age; 
    o.job = job; 
    o.sayName = function(){ 
        alert(this.name); 
    }; 
    return o; 
} 
var friend = new Person("Nicholas", 29, "Software Engineer"); 
friend.sayName(); // "Nicholas"
```

## 继承

许多OO语言都支持两种继承方式：`接口继承`和`实现继承`。

**接口继承只继承方法签名，而实现继承则继承实际的方法。**

**如前所述，由于函数没有签名，在`ECMAScript`中无法实现接口继承。`ECMAScript`只支持实现继承，而且其实现继承主要是依靠`原型链`来实现的。**

### 1.原型链继承

> **其基本思想是利用原型让一个引用类型继承另一个引用类型的属性和方法。**

每个构造函数都有一个原型对象，原型对象都包含一个指向构造函数的指针，而实例都包含一个指向原型对象的内部指针。

那么，假如我们让原型对象等于另一个类型的实例，结果会怎么样呢？

显然，此时的原型对象将包含一个指向另一个原型的指针，相应地，另一个原型中也包含着一个指向另一个构造函数的指针。假如另一个原型又是另一个类型的实例，那么上述关系依然成立，如此层层递进，就构成了实例与原型的链条。这就是所谓原型链的基本概念。

```javascript
// parent
function SuperType(){ 
    this.property = true; 
}

SuperType.prototype.getSuperValue = function(){
	return this.property;
}
// children
function SubType(){
	this.subproperty = false; 
}

SubType.prototype = new SuperType();
SubType.prototype.getSubValue = function(){
	return this.subproperty;
}

var instance = new SubType()
alert(instance.getSuperValue()); // true
alert(instance.getSubValue()); // false
alert(instance instanceof SuperType); // true
alert(instance.constructor); // SuperType

```
实际上，不是`SubType`的原型的`constructor`属性被重写了，而是`SubType`的原型指向了另一个对象——`SuperType`的原型，而这个原型对象的 `constructor`属性指向的是`SuperType`。

![在这里插入图片描述](https://img-blog.csdnimg.cn/20200116111540525.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

事实上，前面例子中展示的原型链还少一环。我们知道，所有引用类型默认都继承了 `Object`，而这个继承也是通过原型链实现的。大家要记住，<font color="red">所有函数的默认原型都是`Object` 的实例，因此默认原型都会包含一个内部指针，指向`Object.prototype`。这也正是所有自定义类型都会继承`toString()`、`valueOf()`等默认方法的根本原因。</font>所以，我们说上面例子展示的原型链中还应该包括另外一个继承层次。

![在这里插入图片描述](https://img-blog.csdnimg.cn/20200116112221793.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

**还有一点需要提醒读者，<font color="red">即在通过原型链实现继承时，不能使用对象字面量创建原型方法。因为这样做就会重写原型链，</font>如下面的例子所示:**

```javascript
function SuperType(){ 
    this.property = true; 
} 
SuperType.prototype.getSuperValue = function(){ 
    return this.property; 
}; 
function SubType(){ 
    this.subproperty = false; 
} 
//继承了 SuperType 
SubType.prototype = new SuperType(); 
//使用字面量添加新方法，会导致上一行代码无效
SubType.prototype = { 
 getSubValue : function (){ 
    return this.subproperty; 
 }, 
 someOtherMethod : function (){ 
    return false; 
 } 
}; 
var instance = new SubType(); 
alert(instance.getSuperValue()); //error!
```

:::warning
原型链虽然很强大，可以用它来实现继承，但它也存在一些问题。

其中，最主要的问题来自包含引用类型值的原型。想必大家还记得，我们前面介绍过包含引用类型值的原型属性会被所有实例共享。

而这也正是为什么要在构造函数中，而不是在原型对象中定义属性的原因。在通过原型来实现继承时，原型实际上会变成另一个类型的实例。于是，原先的实例属性也就顺理成章地变成了现在的原型属性了。
:::

```js
function SuperType(){ 
    this.colors = ["red", "blue", "green"];
} 
function SubType(){ } 
// 继承了 SuperType 
SubType.prototype = new SuperType(); 
var instance1 = new SubType(); 
instance1.colors.push("black"); 
alert(instance1.colors); //"red,blue,green,black" 
var instance2 = new SubType(); 
alert(instance2.colors); //"red,blue,green,black"
```

原型链的第二个问题是：<font color="red">在创建子类型的实例时，不能向超类型的构造函数中传递参数。</font>

实际上应该说是没有办法在不影响所有对象实例的情况下，给超类型的构造函数传递参数。有鉴于此，再加上前面刚刚讨论过的由于原型中包含引用类型值所带来的问题，实践中很少会单独使用原型链。


### 2.借用构造函数继承

> 这种技术的基本思想相当简单，即在子类型构造函数的内部调用超类型构造函数。

别忘了，函数只不过是在特定环境中执行代码的对象，因此通过使用 `apply()`和 `call()`方法也可以在（将来）新创建的对象上执行构造函数，如下所示：

```js
function SuperType(){ 
 this.colors = ["red", "blue", "green"]; 
} 
function SubType(){ 
 //继承了 SuperType 
 SuperType.call(this); 
} 
var instance1 = new SubType(); 
instance1.colors.push("black"); 
alert(instance1.colors); //"red,blue,green,black" 
var instance2 = new SubType(); 
alert(instance2.colors); //"red,blue,green"
```

通过使用 `call()方法`（或 `apply()`方法也可以），我们实际上是在（未来将要）新创建的 `SubType` 实例的环境下调用了 `SuperType` 构造函数。

** 这样一来，就会在新 `SubType`对象上执行 `SuperType()`函数中定义的所有对象初始化代码。结果，`SubType` 的每个实例就都会具有自己的 `colors` 属性的副本了。**


#### 传递参数

相对于原型链而言，借用构造函数有一个很大的优势，<font color="red">即可以在子类型构造函数中向超类型构造函数传递参数。</font>看下面这个例子:

```js
function SuperType(name){ 
    this.name = name; 
} 
function SubType(){ 
    // 继承了 SuperType，同时还传递了参数
    SuperType.call(this, "Nicholas"); 
    // 实例属性
    this.age = 29; 
} 
var instance = new SubType(); 
alert(instance.name); //"Nicholas"; 
alert(instance.age); //29
```

#### 借用构造函数的问题

如果仅仅是借用构造函数，那么也将无法避免构造函数模式存在的问题——方法都在构造函数中定义，函数复用就无从谈起了。而且，在超类型的原型中定义的方法，对子类型而言也是不可见的，结果所有类型都只能使用构造函数模式。考虑到这些问题，借用构造函数的技术也是很少单独使用的。

### 3.组合继承

**`组合继承（combination inheritance）`，有时候也叫做`伪经典继承`，指的是将原型链和借用构造函数的技术组合到一块，从而发挥二者之长的一种继承模式。**

> 其背后的思路是使用原型链实现对原型属性和方法的继承，而通过借用构造函数来实现对实例属性的继承。

这样，既通过在原型上定义方法实现了函数复用，又能够保证每个实例都有它自己的属性。下面来看一个例子:

```js
function SuperType(name){ 
	this.name = name; 
	this.colors = ["red", "blue", "green"]; 
} 
SuperType.prototype.sayName = function(){ 
	alert(this.name);
}
function SubType(name, age){
	// 继承属性
	SuperType.call(this,name)
	this.age = age
}
// 继承方法
SubType.prototype = new SuperType();
SubType.prototype.constructor = SubType;
SubType.prototype.sayAge = function(){
	alert(this.age);
}

var instance1 = new SubType("Nicholas", 29); 
instance1.colors.push("black"); 
alert(instance1.colors); //"red,blue,green,black" 
instance1.sayName(); //"Nicholas"; 
instance1.sayAge(); //29 
var instance2 = new SubType("Greg", 27); 
alert(instance2.colors); //"red,blue,green" 
instance2.sayName(); //"Greg"; 
instance2.sayAge(); //27
```

:::tip
组合继承避免了原型链和借用构造函数的缺陷，融合了它们的优点，成为`JavaScript`中最常用的继承模式。
:::

### 4.原型式继承

> 这种方法并没有使用严格意义上的构造函数。他的想法是借助原型可以基于已有的对象创建新对象，同时还不必因此创建自定义类型。

```javascript
function object(o){ 
	function F(){} 
	F.prototype = o; 
	return new F(); 
}
```

在`object()`函数内部，先创建了一个临时性的构造函数，然后将传入的对象作为这个构造函数的原型，最后返回了这个临时类型的一个新实例。从本质上讲，`object()`对传入其中的对象执行了一次浅复制。来看下面的例子:

```js
var person = {
	name : "Nicholas",
	frineds: ["Shelby", "court", "Van"]
}

var anotherPerson = object(person);
anotherPerson.name = "Greg";
anotherPerson.friends.push("Rob");

var yetAnotherPerson = object(person);
yetAnotherPerson.name = "Linda";
yetAnotherPerson.friends.push("Barbie");

alert(person.friends);// "Shelby,Court,Van,Rob,Barbie"
```
:::tip
`Object.create()`方法规范化了原型式继承。

这个方法接收两个参数：一个用作新对象原型的对象和（可选的）一个为新对象定义额外属性的对象。在传入一个参数的情况下，`Object.create()`与 `object()`方法的行为相同。
:::

### 5.寄生式继承

> 寄生式继承的思路与寄生构造函数和工厂模式类似，即创建一个仅用于封装继承过程的函数，该函数在内部以某种方式来增强对象，最后再像真地是它做了所有工作一样返回对象。

```js
function createAnother(original){
	var clone = Object.create(original);
	clone.sayHi = function(){
		alert("Hi");
	}
	return clone
}
```

在这个例子中，`createAnother()`函数接收了一个参数，也就是将要作为新对象基础的对象。然后，把这个对象`（original）`传递给 `object()`函数，将返回的结果赋值给 `clone`。再为` clone `对象添加一个新方法 `sayHi()`，最后返回 `clone` 对象。可以像下面这样来使用 `createAnother()`函数：

```javascript
var person = { 
    name: "Nicholas", 
    friends: ["Shelby", "Court", "Van"] 
}; 
var anotherPerson = createAnother(person); 
anotherPerson.sayHi(); //"hi"
```

### 6.寄生组合式继承

前面说过，`组合继承`是 JavaScript 最常用的继承模式；不过，它也有自己的不足。

组合继承最大的问题就是<font color="red">无论什么情况下，都会调用两次超类型构造函数</font>：一次是在创建子类型原型的时候，另一次是在子类型构造函数内部。没错，子类型最终会包含超类型对象的全部实例属性，但我们不得不在调用子类型构造函数时重写这些属性。

> 所谓`寄生组合式继承`，即通过借用构造函数来继承属性，通过原型链的混成形式来继承方法。其背后的基本思路是：不必为了指定子类型的原型而调用超类型的构造函数，我们所需要的无非就是超类型原型的一个副本而已。本质上，就是使用寄生式继承来继承超类型的原型，然后再将结果指定给子类型的原型。

```javascript
function inheritPrototype(subType, superType){ 
    var prototype = Object.create(superType.prototype); //创建对象
    prototype.constructor = subType; //增强对象
    subType.prototype = prototype; //指定对象
}

function SuperType(name){ 
    this.name = name; 
    this.colors = ["red", "blue", "green"]; 
} 
SuperType.prototype.sayName = function(){ 
    alert(this.name); 
}; 
function SubType(name, age){ 
    SuperType.call(this, name); 
    this.age = age; 
} 
inheritPrototype(SubType, SuperType); 
SubType.prototype.sayAge = function(){ 
    alert(this.age); 
};
```

这个例子的高效率体现在它只调用了一次`SuperType`构造函数，并且因此避免了在 `SubType.prototype` 上面创建不必要的、多余的属性。与此同时，原型链还能保持不变；因此，还能够正常使用`instanceof `和 `isPrototypeOf()`。开发人员普遍认为寄生组合式继承是引用类型最理想的继承范式。



