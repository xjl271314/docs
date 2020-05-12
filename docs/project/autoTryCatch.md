# 基于 Babel 和 AST自动添加 try catch 方法

- 2020.05.11

## 前言

`javascript`是单线程的弱类型的脚本语言，所以很多错误会在运行的时候才会发现，一旦出现运行时的错误，那么整个js线程都会挂掉，导致我们页面没有响应，所以我们需要有一种手段来避免，而将代码用`try catch`包括就是最容易实现的一种方式，我们能否通过工程化的思想来实现自动化的指定添加?


恰好,我们可以使用`AST`(抽象语法树)来解决这个问题。

## AST抽象语法树

> `抽象语法树`是一种统一的结构，能够把各种语言转化成一种统一的树形结构，即是说所有的语言都会转化成一种统一的结构，以便计算机识别。

计算机语言，一般都是由`Statement`、`expression`和`declaration`组成。所以，在了解AST前，我们需要了解这三个是什么。

### Statement

> 用来控制程序流程或者用来管理零个或多个语句。

- `BlockStatement`：大括号包裹起来的语句块
- `IfStatement`： `if`语句
- `SwitchStatement`: `switch`语句
- `WhileStatement`: `while`语句
- `ForStatement`: `for`语句
- `TryStatement`: `try`语句


### Expression

表达式是用来计算或者返回一个结果的，比如所有的运算操作都是表达式，除此之外，函数的调用也是一种表达式，es6的箭头函数也是一种表达式。

js中有函数/数组/类表达式的概念，即把一个函数/数组/类赋值给一个变量.

| expression | description
|:---|:---
| BinaryExpression | 二元运算表达式，eg: +-*/
| ConditionExpression | 三元运算表达式，eg: ()? :
| LogicalExpression	| 逻辑运算表达式
| CallExpression | 函数调用表达式
| ArrowFunctionExpression | 箭头函数表达式
| FunctionExression	| 函数表达式
| ArrayExpression	| 数组表达式
| ClassExpression	| 类表达式

### Declaration

js中，变量的申明不外乎三种方式`var`、`const`和`let`，还有二个很特殊的，`函数申明`和`类申明`。除此之外，es6还有`import`申明。

完整的可以通过[babel-types](https://babeljs.io/docs/en/next/babel-types.html)的官网去了解。

### 抽象语法树的运用

简单来说只要用到语法分析或者修改修改源码的，都可以利用抽象语法树来完成，比如`typescript`语法校验、`IDE的语法校验高亮`、`eslint`、`ulglify-js`、以及`babel`的`tramsform`、`@babel/preset-react`等等。可想而知，抽象语法树运用还是很广的。


## 实现思路

通过`babel`库来实现。`babel-core`提供了访问修改`AST`的功能，所以我们可以直接利用`babel`库来实现，同时我们需要用到`babel-types`和`@babel/template`的`babel`工具包。

- `babel-core`，`babe`l核心包，可以访问`AST`树并对代码进行转换。

- `babel-types`，`babel`工具包，可以用来判断一个树节点是什么类型以及创建`statement`、`declaration`以及`expression`这些树节点。

- `@babel/template`，方便将字符串转为AST节点。

我们的思路是，找到所有函数可能出现的`AST`节点，找到这些节点后，我们可以在遍历这些节点的时候，找出函数里面的内容，然后通过`babel-types`提供的方法去生成`TryStatement`，把函数里面的内容包裹起来，然后覆盖掉原来的函数里面的内容。

### 定义访问器

在上面对`AST`的介绍中，我们可以找到函数定义有三种方式，即`FunctionExpression`、`ArrowFuntionExpression`和`FunctionDeclaration`，因此我们就可以定义我们的访问器了。

```js
var babel = require('babel-core');
var babelPlugin = { visitor };
let visitor = {
  ArrowFunctionExpression(path) {
    // do stuff here
  },
  FunctionExpression(path) {
    // do stuff here
  },
  FunctionDeclaration(path) {
    // do stuff here
  }
}
var result = babel.transform(code, {
  plugins: [
    babelPlugin
  ]
})
console.log(result.code)
```

### 获取函数里面的内容并生成TryStatement

函数里面的内容，正常情况下，它只可能是一个`BlockStatement`，但是箭头函数出现后，它就变得复杂了，它除了会是一个`BlockStatment`外，也有可能是一个表达式，亦或者一个值。

我们看下普通的函数申明的AST树:

```js
function test() {
    console.log(111)
}
```

它对应的AST树是这样的:

```json
{
  "type": "Program",
  "start": 0,
  "end": 218,
  "body": [
    {
      "type": "FunctionDeclaration",
      "start": 178,
      "end": 218,
      "id": {
        "type": "Identifier",
        "start": 187,
        "end": 191,
        "name": "test"
      },
      "expression": false,
      "generator": false,
      "async": false,
      "params": [],
      "body": {
        "type": "BlockStatement",
        "start": 194,
        "end": 218,
        "body": [
          {
            "type": "ExpressionStatement",
            "start": 200,
            "end": 216,
            "expression": {
              "type": "CallExpression",
              "start": 200,
              "end": 216,
              "callee": {
                "type": "MemberExpression",
                "start": 200,
                "end": 211,
                "object": {
                  "type": "Identifier",
                  "start": 200,
                  "end": 207,
                  "name": "console"
                },
                "property": {
                  "type": "Identifier",
                  "start": 208,
                  "end": 211,
                  "name": "log"
                },
                "computed": false
              },
              "arguments": [
                {
                  "type": "Literal",
                  "start": 212,
                  "end": 215,
                  "value": 111,
                  "raw": "111"
                }
              ]
            }
          }
        ]
      }
    }
  ],
  "sourceType": "module"
}
```

可以看到，如果是`blockStatment`的话，函数里面的内容是`body.body数组`。


箭头函数的函数内容直接为一个值的情况:

```js
const test = () => 0;
```

对应的AST如下:
```json
{
  "type": "Program",
  "start": 0,
  "end": 21,
  "body": [
    {
      "type": "VariableDeclaration",
      "start": 0,
      "end": 21,
      "declarations": [
        {
          "type": "VariableDeclarator",
          "start": 6,
          "end": 20,
          "id": {
            "type": "Identifier",
            "start": 6,
            "end": 10,
            "name": "test"
          },
          "init": {
            "type": "ArrowFunctionExpression",
            "start": 13,
            "end": 20,
            "id": null,
            "expression": true,
            "generator": false,
            "async": false,
            "params": [],
            "body": {
              "type": "Literal",
              "start": 19,
              "end": 20,
              "value": 0,
              "raw": "0"
            }
          }
        }
      ],
      "kind": "const"
    }
  ],
  "sourceType": "module"
}
```

我们可以看到对应的函数描述还是在body数组内。因此,我们获取函数里面的内容，就是取函数节点的`body`属性，然后利用`babel-types`生成`TryStatement`。


```js
let visitor = {
  'ArrowFunctionExpression|FunctionExpression|FunctionDeclaration': function(path) {
      let body = path.node.body
      // ...此处省略catch的生成
      let tryStatement = types.tryStatement(body, catchClause);
  }
}
```

我们上面仅指出了`try statement`的生成，但是我们还未定义`catch`里面的内容，下面会讲到。


### 生成catch体

`catch`是一个类型函数的东西，但它又不是，它接受一个参数，这个参数就是`Error对象`，`catch`里面的内容我们一般会对异常进行一些处理，比如然后上报到后端，但是很多时候我们的代码是经过混淆压缩的，所以`error`里面我们不能获取到具体发生错误的具体行列以及导致`error`的函数的函数名。

**那么我们要如何定位到异常发生的地方呢？**

我们在访问函数节点的时候，`AST`节点实际上是保留了这些信息的。所以我们可以在访问器中事先获取这些信息，并把它塞到原来的`catch`体里面。这里的行列只能是函数开始的行列，不能定位到`error`发生的行列。

获取行列信息很简单，通过获取节点的`loc`属性便可。

但是获取函数名，就比较复杂了，函数的定义，有三种方式，

- 如果不是以函数申明的方式定义函数，那么函数名的获取，需要从它父节点中获取，并且还要判断父节点的类型，

- 如果是普通的函数表达式，从父节点的id属性获取，

- 如果是对象属性方法，那么需要从父节点的key属性获取。

实际上还有类的情况没考虑，这里先不考虑。还有一种情况就是函数可能是匿名的。综合考虑后，获取函数名的代码如下：

```js
let visitor = {
  'ArrowFunctionExpression|FunctionExpression|FunctionDeclaration': function(path) {
      let node = path.node
      let body = node.body

      // 获取行列
      let line = node.loc.start.line
      let column = node.loc.start.column

      // 获取函数名
      let funcName = 'anonymous function';
      // 如果是函数申明，则可以直接从id属性获取
      if (node.id) {
        funcName = node.id.name
      } 
      // 有父节点，并且父节点是申明，则说明是函数申明的方式创建的函数，需要从父节点获取函数名 
      if (types.isVariableDeclarator(path.parentPath)) {
        funcName = path.parentPath.node.id.name;
      } else if (types.isProperty(path.parentPath)) {
        // 通过对象属性定义的函数
        funcName = path.parentPath.node.key.name;
      } 

      // ...此处省略catch的生成
      let tryStatement = types.tryStatement(body, catchClause);
  }
}
```

有行列以及函数名，我们就需要把这些信息存到一个变量，那么就可以利用`babel-types`来生成单个变量对应AST节点了，点击[这里](https://babeljs.io/docs/en/next/babel-types.html#variabledeclaration)获取如何生成申明变量的节点，代码如下：

```js
// 生成一个变量申明的AST节点 值包含了函数的行数，列数，和函数名
let infoDeclarator = types.variableDeclaration('var', [
    types.variableDeclarator(
      types.identifier('info'),
      types.ObjectExpression([
        types.objectProperty(types.identifier('line'), types.numericLiteral(node.loc.start.line)),
        types.objectProperty(types.identifier('row'), types.numericLiteral(node.loc.start.column)),
        types.objectProperty(types.identifier('function'), types.stringLiteral(funcName))
      ]))
]);
```

接着我们需要知道如何把处理异常的`handler`函数里面的内容转为`catch`里面的内容，这个时候就需要用到`@babel/template`包了，这里直接贴代码，怎么使用`@babel/template`，点击[这里](https://babeljs.io/docs/en/babel-template#templatestatement)。

```js
// 将处理异常的handler转为AST节点
let catchStatement = template.statement(`var tmp = ${report.toString()}`)();
// 然后从AST节点中获取函数体 作为catch里面的内容
let catchBody = catchStatement.declarations[0].init.body ; 
```

`report`是处理异常的`handler`函数，实际运用的时候，应该开放给用户自定义。拿到`catch`里面的内容后，我们就可以根据`babel-types`去生成`catch`里面的内容了。

> 这里我是直接通过var temp = code的方式去生成一个函数表达式，然后来获取函数体里面的body节点，你当然也可以直接根据函数生成AST节点，然后去获取这个函数节点的body节点，不过你要考虑不同情况的函数定义，获取body的方式不同

```js
let catchClause = types.catchClause(types.identifier('error'), 
// 第一个值是我们生成的包含行列以及函数名的变量
// 第二个值是handler的内容
types.blockStatement(
    [infoDeclarator, catchBody.body[0]]
));
let tryStatement = types.tryStatement(body, catchClause);
```

### 替换原来的函数内容

最后，我们就需要生成包含了`try catch`的新的函数替换原来函数，这里需要判断函数是怎么定义的，根据不同的定义，去生成不同的函数内容替换原来的。

```js
let func = null;
// 区分是函数申明还是函数表达式
if (types.isFunctionDeclaration(node)) {
    func = types.functionDeclaration(node.id, node.params, types.BlockStatement([tryStatement]), node.generator, node.async);
} else {
    func = types.functionExpression(node.id, node.params, types.BlockStatement([tryStatement]), node.generator, node.async);
}
path.replaceWith(func);
```

### 防止circle loops以及过滤不需要try catch的函数内容

代码大体上是完成了，但是如果你试着去跑一下，你会发现，会发生死循环，原因就是替换的时候又会导致再次触发访问新的`AST`树，这样无限循环下去，所以我们需要把用`try catch`包裹后的`AST`树访问给跳过。

如果函数里面的内容只是简单的一个值，那么也是不需要的，比如这样的:

```js
const test = () => 0
```

所以，我们的过滤条件是这样的:

```js
// 1、如果有try catch包裹了，则不需要 2、防止loops 3、需要try catch的只能是语句，像() => 0这种的body，是不需要的
if (blockStatement.body && types.isTryStatement(blockStatement.body[0])
    || !types.isBlockStatement(blockStatement) && !types.isExpressionStatement(blockStatement)) {
    return;
}
```

## 完整的代码

本方案代码来源自:[github](https://github.com/VikiLee/TryCatchWrapper/tree/master/src)

```js
// code.js
var obj = {
  objFn() {
    console.log('object method')
  },
  objFn1: function() {
    console.log('function expression in obj')
  },
  objFn2: () => 0
};

class MyClass {
  constructor() {
    console.log('constructor method')
  }

  classMethod() {
    console.log('class method')
  }
}

var arrowFn = () => {
  console.log('arrow function expression')
}

var functionExpression = function() {
  console.log('normal function expression')
}

function fnDeclaration() {
  console.log('function declaration')
} 
```

```js
// index.js
var fs = require('fs');
var babel = require('babel-core'); // babel核心库
var types = require('babel-types');
var template = require("@babel/template");
var code = fs.readFileSync('./code.js', 'utf-8');

var DISABLE_COMMENT = 'disable-try-catch';
var LIMIT_LINE = 0;

// 这个是catch里面的内容，这里只是例子，实际情况看项目需求，或者写个webpack-loader/babel-plugin去开放给用户定义
function report(info) {
  console.log(info, error);
  console.log(111);
}

function getFilename(filename) {
  return filename.replace(process.cwd(), '')
}

function generateTryCatch(path, filename) {
  try {
    var node = path.node,
        params = node.params,
        blockStatement = node.body,
        isGenerator = node.generator,
        isAsync = node.async,
        loc = node.loc;

    // get function name
    var funcName = 'anonymous function';
    if (node.id) {
      funcName = node.id.name
    } else if (node.key) {
      // class method name
      funcName = node.key.name
    } else if (types.isVariableDeclarator(path.parentPath)) {
      funcName = path.parentPath.node.id.name;
    } else if (types.isProperty(path.parentPath)) {
      funcName = path.parentPath.node.key.name;
    }

    // 1、如果有try catch包裹了，则不需要 2、防止circle loops 
    // 3、需要try catch的只能是语句，像() => 0这种的body，是不需要的
    // 4、如果函数内容小于等于‘LIMIT_LINE’行不try catch，当然这个函数可以暴露出来给用户设置
    if (blockStatement.body && types.isTryStatement(blockStatement.body[0])
      || !types.isBlockStatement(blockStatement) && !types.isExpressionStatement(blockStatement)
      || blockStatement.body && blockStatement.body.length <= LIMIT_LINE) {
      return;
    }

    // 获取函数开头注解，如果注解为disable-try-catch则跳过try catch
    var commentsNode = blockStatement.body.length > 0
      ? blockStatement.body[0].leadingComments
      : blockStatement.innerComments || blockStatement.trailingComments
    if (commentsNode && commentsNode[0].value.indexOf(DISABLE_COMMENT) > -1) {
      path.skip();
    }

    // 将catch handler转为AST节点 然后从AST节点中获取函数体 作为catch里面的内容
    var catchStatement = template.statement(`var tmp = ${report.toString()}`)();
    var catchBody = catchStatement.declarations[0].init.body; 

    // 赋值语句 值包含了函数的行列数和函数名
    var infoDeclaration = types.variableDeclaration('var', [
      types.variableDeclarator(
        types.identifier('info'),
        types.ObjectExpression([
          types.objectProperty(types.identifier('line'), types.numericLiteral(loc.start.line)),
          types.objectProperty(types.identifier('row'), types.numericLiteral(loc.start.column)),
          types.objectProperty(types.identifier('function'), types.stringLiteral(funcName)),
          types.objectProperty(types.identifier('filename'), types.stringLiteral(getFilename(filename)))
        ]))
    ]);

    var catchClause = types.catchClause(types.identifier('error'), types.blockStatement(
      [infoDeclaration].concat(catchBody.body)
    ));
    var tryStatement = types.tryStatement(blockStatement, catchClause);

    var func = null;
    // 区分类方法、对象方法、函数申明还是函数表达式
    if (types.isClassMethod(node)) {
      func = types.classMethod(node.kind, node.key, params, types.BlockStatement([tryStatement]), node.computed, node.static);
    } else if (types.isObjectMethod(node)) {
      func = types.objectMethod(node.kind, node.key, params, types.BlockStatement([tryStatement]), node.computed);
    } else if (types.isFunctionDeclaration(node)) {
      func = types.functionDeclaration(node.id, params, types.BlockStatement([tryStatement]), isGenerator, isAsync);
    } else {
      func = types.functionExpression(node.id, params, types.BlockStatement([tryStatement]), isGenerator, isAsync);
    }
    path.replaceWith(func);
  } catch(error) {
    throw error;
  }
}

var visitor = {
  'ArrowFunctionExpression|FunctionExpression|FunctionDeclaration': function(path, state) {
    generateTryCatch(path, state.file.opts.filename);
  },
  ClassDeclaration(path, state) {
    path.traverse({
      ClassMethod(path) {
        generateTryCatch(path, state.file.opts.filename);
      }
    });
  },
  ObjectExpression(path, state) {
    path.traverse({
      ObjectMethod(path) {
        generateTryCatch(path, state.file.opts.filename);
      }
    });
  }
}

var babelPlugin = { visitor }
var result = babel.transform(code, {
  plugins: [
    babelPlugin
  ]
})
console.log(result.code)
```

