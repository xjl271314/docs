# 前端数据mock

- 2020.05.12

## 为什么要实现数据 mock 

1. 现在的开发很多都是前后端分离的模式，前后端的工作是不同的，当我们前端界面已经完成，但是后端的接口迟迟不能提供前端很多时候都会等接口。

2. 测试人员想要你提供一份可以直接测试，自行修改后端接口，测试 UI 的时候。

3. 后端的接口，不能提供一些匹配不到的场景的时候。

这个时候如果前端可以实现自己的一套 mock 数据，这里的问题都会迎刃而解，我们可以模拟真实的接口，提供我们自己需要的数据及其数据结构。

这样，我们可以在后端未完成的情况下，完成测试，调试以及优化。

## mock 数据的方案

实现前端数据 mock 是在前端构建中不可缺少到一个步骤，不管是在开发或者调试都是必不可少的。

那么我们要实现数据的 mock ，有哪些操作呢？其中最常规到方法就那么几种：

1. 本地自己编写静态的json文件

2. 引入 mock.js 实现请求拦截。

3. 搭建一个属于自己到 mock 服务器，模拟自己想要到数据及其数据结构。

4. 搭建RAP 可视化到一个 mock 服务器

5. 使用其他开源的mock工具

6. 其他手段


## 使用mock.js进行模拟

[github地址](https://github.com/nuysoft/Mock)

### 安装
```
npm install mockjs --save
npm install axios --save
```

### 使用

```js
Mock.mock('http://123.com',{
    'name|3':'fei',//这个定义数据的模板形式下面会介绍
    'age|20-30':25,
})

$.ajax({
    url:'http://123.com',
    dataType:'json',
    success:function(e){
       console.log(e)
    }
})
```

### 如何定义数据

数据模板中的每个属性由 3 部分构成：`属性名`、`生成规则`、`属性值`：

```
'name|rule': value
```

占位符的定义：

> 占位符是在属性值的位置写入带有 @ 的字符串，并不会出现在最终的数据中，而是一个数据格式

```
@占位符
@占位符(参数 [, 参数])
```

例子:

```js
Mock.mock({
    name: {
        first: '@FIRST',
        middle: '@FIRST',
        last: '@LAST',
        full: '@first @middle @last'
    }
})
// =>
{
    "name": {
        "first": "Charles",
        "middle": "Brenda",
        "last": "Lopez",
        "full": "Charles Brenda Lopez"
    }
}
```

### 生成规则

:::tip

生成规则 有 7 种格式：
1. `'name|min-max': value`
2. `'name|count': value`
3. `'name|min-max.dmin-dmax': value`
4. `'name|min-max.dcount': value`
5. `'name|count.dmin-dmax': value`
6. `'name|count.dcount': value`
7. `'name|+step': value`
:::

生成规则和示例：

#### 属性值是字符串 String

| 输入 | 描述 | 
| :--  |:--- |
|`name|min-max: string`| 通过重复 string 生成一个字符串，重复次数大于等于 min，小于等于 max。
| `name|count: string` | 通过重复 string 生成一个字符串，重复次数等于 count。

#### 属性值是数字 Number

| 输入 | 描述 | 
| :--  |:--- |
|`name|+1: number`| 属性值自动加 1，初始值为 number。
|`name|min-max: number` | 生成一个大于等于 min、小于等于 max 的整数，属性值 number 只是用来确定类型。
|`name|min-max.dmin-dmax: number` | 生成一个浮点数，整数部分大于等于 min、小于等于 max，小数部分保留 dmin 到 dmax 位。

```js
Mock.mock({
    'number1|1-100.1-10': 1,
    'number2|123.1-10': 1,
    'number3|123.3': 1,
    'number4|123.10': 1.123
})
// =>
{
    "number1": 12.92,
    "number2": 123.51,
    "number3": 123.777,
    "number4": 123.1231091814
}
```

#### 属性值是布尔型 Boolean

| 输入 | 描述 | 
| :--  |:--- |
|`name|1: boolean`| 随机生成一个布尔值，值为 true 的概率是 1/2，值为 false 的概率同样是 1/2。
|`name|min-max: value` | 随机生成一个布尔值，值为 value 的概率是 min / (min + max)，值为 !value 的概率是 max / (min + max)。

#### 属性值是对象 Object

| 输入 | 描述 | 
| :--  |:--- |
|`name|count: object`| 从属性值 object 中随机选取 count 个属性。
|`name|min-max: object` | 从属性值 object 中随机选取 min 到 max 个属性。

#### 属性值是数组 Array

| 输入 | 描述 | 
| :--  |:--- |
|`name|1: array`| 从属性值 array 中随机选取 1 个元素，作为最终值。
|`name|+1: array` | 从属性值 array 中顺序选取 1 个元素，作为最终值。
|`name|min-max: array` | 通过重复属性值 array 生成一个新数组，重复次数大于等于 min，小于等于 max。
|`name|count: array` | 通过重复属性值 array 生成一个新数组，重复次数为 count。

#### 属性值是函数 Function

| 输入 | 描述 | 
| :--  |:--- |
|`name: function`| 执行函数 function，取其返回值作为最终的属性值，函数的上下文为属性 'name' 所在的对象。

#### 属性值是正则表达式 RegExp

| 输入 | 描述 | 
| :--  |:--- |
|`name: regexp`| 根据正则表达式 regexp 反向生成可以匹配它的字符串。用于生成自定义格式的字符串。

```js
Mock.mock({
    'regexp1': /[a-z][A-Z][0-9]/,
    'regexp2': /\w\W\s\S\d\D/,
    'regexp3': /\d{5,10}/
})
// =>
{
    "regexp1": "pJ7",
    "regexp2": "F)\fp1G",
    "regexp3": "561659409"
}
```