# Array类型

除了 `Object` 之外，`Array` 类型恐怕是 `ECMAScript` 中最常用的类型了。

## 创建Array类型的方式

1. new + Array 构造函数。
2. 用数组字面量表示法。

```js
var colors = new Array(3);
var colors = ["red", "blue", "green"];
```

数组的项数保存在其 `length` 属性中，这个属性始终会返回 0 或更大的值.

```js
var colors = ["red", "blue", "green"]; // 创建一个包含 3 个字符串的数组
var names = []; // 创建一个空数组
alert(colors.length); //3 
alert(names.length); //0
```

数组的 `length` 属性很有特点——它不是只读的。因此，通过设置这个属性，可以从数组的末尾移
除项或向数组中添加新项。请看下面的例子：

```js
var colors = ["red", "blue", "green"]; // 创建一个包含 3 个字符串的数组
colors.length = 2; 
alert(colors[2]); // undefined 
```
这个例子中的数组 `colors` 一开始有 3 个值。将其 `length` 属性设置为 2 会移除最后一项），结果再访问 `colors[2]`就会显示 `undefined` 了。

如果将其 `length` 属性设置为大于数组项数的值，则新增的每一项都会取得 `undefined` 值，如下所示：

```js
var colors = ["red", "blue", "green"]; // 创建一个包含 3 个字符串的数组
colors.length = 4; 
alert(colors[3]);// undefined
```

## 数组常用方法

1. `push()`向数组的末尾添加一个或多个元素，<font color="#f44">返回新的数组长度。原数组改变。</font>
2. `pop()` 删除并返回数组的最后一个元素，若该数组为空，则返回`undefined`。原数组改变。
3. `unshift()`向数组的开头添加一个或多个元素，返回新的数组长度。原数组改变。
4. `shift()`删除数组的第一项，并返回第一个元素的值。若该数组为空，则返回`undefined`。原数组改变。
5. `concat(arr1,arr2...)`，合并两个或多个数组，生成一个新的数组。原数组不变。
6.  `join(type)` 将数组的每一项用指定字符连接返回一个字符串。默认连接字符为逗号。原数组不变。
7. `reverse()`将数组倒序，返回倒序后的数组，原数组改变。
8. `sort()`，对数组元素进行排序,返回排序后的数组。按照字符串`UniCode`码排序，原数组改变。从小到大 `a-b`，从到到小 `b-a`。
9. `map(currentItem,index,array)`，原数组的每一项执行函数后，返回一个新的数组。原数组不变。
10. `slice(start,end)`从`start`开始，`end`之前结束，不到`end`；如果不给`end`值，从`start`开始到数组结束。`start`可以给负值，-1表示数组最后位置，-2表示倒数第二个，以此类推，顾前不顾后。原数组不变。
11. `splice(index,howmany,arr1,arr2...)` 删除元素并添加元素，从`index`位置开始删除`howmany`个元素，并将arr1、arr2...数据从`index`位置依次插入。`howmany`为0时，则不删除元素。原数组改变。
12. `forEach(item,callback)`，用于调用数组的每个元素，并将元素传递给回调函数。原数组不变。
13. `filter(function)`，过滤数组中，符合条件的元素并返回一个新的数组。原数组不变。
14. `every(function)`，对数组中的每一项进行判断，若都符合则返回`true`，否则返回`false`。原数组不变。
15. `some(function)`，对数组中的每一项进行判断，若都不符合则返回`false`，否则返回`true`。原数组不变。
16. `reduce(prev,cur,index,array)`，reduce() 方法接收一个函数作为累加器，数组中的每个值（从左到右）开始缩减，最终计算为一个值。原数组不变。





