# setState

## 当我们在组件中调用 `setState`时，你认为发生了什么？

```js
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

class Button extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            clicked: fasle 
        };
        this.handleClick = this.handleClick.bind(this);
    }
    handleClick() {
        this.setState({ clicked: true });
    }
    render() {
        if (this.state.clicked) {
            return <h1>Thanks</h1>
        }
        return (
            <button onClick={this.handleClick}>Click me!</button>
        )
    }
}
```

首先，当我们点击了按钮之后,`React`会使用下一次的状态 `{ clicked: true }` 更新组件，然后更新`DOM`匹配返回的 `<h1>Thanks</h1> `元素。

### 看起来很直白，但是，是 `React` 做的这些操作还是 `React DOM`？

更新`DOM`听起来像`React DOM`负责的。但是我们调用的 `this.setState()` 不是来自 `React DOM`。并且 `React.Component` 这个基类是定义在`React`本身的。

所以 在`React.Component`中的 `setState`是怎么更新`DOM`的呢？

### 我们可能会猜测 `React.Component`中包含更新`DOM`的逻辑。

但如果真是这样的话，`this.setState()` 是怎么在其它环境中运行的呢？例如，在`React Native`中组件同样也继承了 `React.Component`。`RN`里面也会调用 `this.setState()`，但是`RN`运行在`Android`和`iOS`原生视图中，而不是`DOM`中。

因此 `React.Component` 肯定是以`某种方式委托处理状态更新到特定平台的代码`，在我们了解这是如何发生之前，让我们深入了解`包的分离方式和原因。`

### 有一个常见的误解就是，`React` 的 `engine` 存放在 `react` 包中，这是不正确的。

实际上，从 `react 0.14` 以后，`react` 有意只暴露定义组件的接口，`React` 的大多数实现都依托于 `renderers`.

`react-dom`, `react-dom/server`, `react-native`, `react-test-renderer`, `react-art` 就是 `renderers` 的示例。

这也是为什么 `react` 对不同的平台都有用的原因。它导出的，例如 `React.Component`, `React.createElement`, `React.Children` 工具和 `Hooks`, 是和目标平台独立开来的。

是否你运行`React DOM`，`React DOM Server` 或者`React Native`，你的组件的引入和使用方式都是一样的。

相比之下，`renderer`则暴露出平台相关的接口，比如 `ReactDOM.render()` 可以使你将`React` 层级渲染到`DOM`节点中。每个`renderer`都提供了类似的接口。理想情况下，大多数组件不应该从`renderer`中引入认定和东西，这样可以使组件变得`protable`(即像移动硬盘一样，即插即用)。

大多数遐想的是 `React engine` 存在于每一个 `renderer`中。大多数`renderers`都包含某些相同代码的拷贝 - 我们称之为 `reconciler`。

一个 设置步骤 将 `reconciler`代码和`renderer code` 平滑的集成到一个高度优化的`bundle`中，提升性能（拷贝代码对打包的尺寸不太友好，但是大多数`React users`通常一次只需要一种`renderer`，比如 `react-dom`）。

上面讲的核心意思是，`react` 包只让你使用`react`功能，而对于怎么实现`react`包是不管的。`renderer`包（比如 `react-dom`，`react-native`等）提供了`React Features` 的实现 和平台指定的逻辑。某些代码是共享的（`reconciler`），但这是各个渲染器的实现细节。


现在我们应该理解了为什么对新功能我们需要同时升级`react`和`react-dom`了。例如，对 `React 16.3` 添加了 `Context` 接口， `React.createContext()` 接口由`react`包暴露，但是 `React.createContext()` 并没有实际实现`context`的功能。`react dom` 和 `react dom server` 中的实现是不一样的。因此 `createContext()` 返回一些普通对象：

```js
// 简化版本
function createContext(defaultValue) {
    let context = {
        _currentValue: defaultValue,
        Provider: null,
        Consumer: null,
    };
    context.Provider = {
        $$typeof: Symbol.for('react.provider'),
        _context: context,
    };
    context.Consumer = {
        $$typeof: Symbol.for('react.context'),
        _context: context,
    };
    return context;
}
```

当你在代码中使用 `<MyContext.Provider>` 或者 `<MyContext.Consumer>`，是 `renderer` 决定如何去处理它们的。`React DOM` 可能以某种方式追踪`context values`，而`React DOM Server`又以另一种方式处理。

我们已经知道了 `react` 包中不包含任何有趣的东西，所有实现都在渲染器（比如`react-native`， `react-dom`）中。但是这并没有回答我们的问题：**在 `React.Component` 中的 `setState()`是如何和正确的渲染器之间沟通的**。

:::tip
答案就是，每个渲染器在创建的`class`中设置了一个特别的字段， 这个字段就叫 `updater`。这不是你要设置的，而是`React DOM`， `React Native`等在创建你类的实例时需要做的。
:::

```js
// 在React DOM内部
const inst = new YourComponent();
inst.props = props;
inst.updater = ReactDOMUpdater; // 设置 updater

// 在React DOM Server 内部
const inst = new YourComponent();
inst.props = props;
inst.updater = ReactDOMServerUpdater; // 设置 updater

// 在React Native 内部
const inst = new YourComponent();
inst.props = props;
inst.updater = ReactNativeUpdater; // 设置 updater
```

React内部的setState:

```js
Component.prototype.setState = function(partialState, callback) {
  invariant(
    typeof partialState === 'object' ||
      typeof partialState === 'function' ||
      partialState == null,
    'setState(...): takes an object of state variables to update or a ' +
      'function which returns an object of state variables.',
  );
  // 使用 'updater'  属性 talk back to 渲染器
  this.updater.enqueueSetState(this, partialState, callback, 'setState');
};

Component.prototype.forceUpdate = function(callback) {
  this.updater.enqueueForceUpdate(this, callback, 'forceUpdate');
};
```

`React DOM Server` 可能想忽略状态的更新和警告你，然而 `react dom`和`react native` 则会让 它们拷贝的`reconciler`去处理这些问题.

**这是为什么 `this.setState()`定义在`React`包中也能更新`DOM`的原因，它读取`React DOM` 设置的`this.updater` ，然后让`React DOM`计划和处理更新。**

### 我们现在知道`classes`了，那`Hooks`呢？

基类中 `setState()` 的实现一直是一个假象，它除了将调用转发给当前的渲染器以外，其实什么也没有做。 `useState` 也 做了一模一样的事情。

不同于使用 `updater` 对象， `useState` 使用 `dispatcher` 对象。当你调用 `React.useState()` | `React.useEffect()` 或者其它内置的钩子时，这些调用都被转发给当前的`dispatcher`了。

```js
// 在React 中 (简化版)
const React = {
    // 真实属性被隐藏的更深一些，是否你可以找到它
    __currentDispatcher: null,
    
    useState(initialState) {
        return React.__currentDispatcher.useState(initialState);
    },
    
    useEffect(initialState) {
        return React.__currentDispather.useEffect(initialState);
    },
    // ...
}
```

在渲染你的组件前，每个渲染器都会设置这个 `dispatcher`：

```js
// 在 React DOM中
const prevDispatcher = React.__currentDispatcher;
React.__currentDispatcher = ReactDOMDispatcher; // 设置dispatcher
let result;
try {
    result = YourComponent();
} finally {
    // Restore it back 还原
    React.__currentDispatcher= prevDispatcher;
}
```

这也意味着，`Hooks`本身并不依赖于`React`。如果将来有更多的库想要复用相同的原始`Hooks`，理论上，`dispatcher`程序可以移植到一个单独的包中，并且作为第一级`API`以一个不太恐怖的名字暴露出去。

## 引申: componentDidMount调用setstate会发生什么?

这里是官方文档的描述:

> 在`componentDidMount()`中，你 可以立即调用`setState()`。它将会触发一次额外的渲染，但是它将在浏览器刷新屏幕之前发生。这保证了在此情况下即使`render()`将会调用两次，用户也不会看到中间状态。谨慎使用这一模式，因为它常导致性能问题。在大多数情况下，你可以 `在constructor(`)中使用`赋值初始状态`来代替。然而，有些情况下必须这样，比如像模态框和工具提示框。这时，你需要先测量这些DOM节点，才能渲染依赖尺寸或者位置的某些东西。

我们不推荐直接在`componentDidMount`直接调用`setState`，由上面的分析：`componentDidMount`本身处于一次更新中，我们又调用了一次`setState`，就会在未来再进行一次`render`，造成不必要的性能浪费，大多数情况可以设置初始值来搞定。

当然在`componentDidMount`我们可以调用`接口`，在接口的回调中去修改`state`，这是正确的做法。

当`state`初始值依赖`dom属性`时，在`componentDidMount`中`setState`是无法避免的。

## 引申：结合生命周期,哪些生命周期里面可以去setState?

| 生命周期 |  是否可以`setState`   | 描述 |
|:--------| :--------:|:-------------|
| `constructor()` | ❌ | 构造函数中请使用 `this.state = {...}`进行初始化赋值。
| `static getDerivedStateFromProps()` | ❌ | 静态方法没有`this`对象,此处需要按照语法返回新的`state对象`。
| `render()` | ❌ | `render()`中禁止使用`this.setState`否则会引起循环,内存溢出。
| `componentDidMount()` | ✅ | 此生命周期中不推荐直接调用`this.setState`这会造成重复`render`,但是当需要获取DOM信息后再去更改`state`的属性时又不得不放在这里执行。
| `shouldComponentUpdate()` | ❌ | 此生命周期只做返回是否更新的判断。
| `getSnapshotBeforeUpdate()` | ❌ | 此生命周期只在`componentDidUpdate()`前进行数据修改。
| `componentDidUpdate()` | ✅ | 此生命周期中可以正常使用,但需要注意添加更新条件,不然会导致死循环。
| `componentWillUnmount()` | ❌ | 此生命周期不应调用`setState()`，因为该组件将永远不会重新渲染，组件实例卸载后，将永远不会再挂载它。
| `componentDidCatch()` | ✅ | 此生命周期可以在捕获到错误后进行`state`存储。
| `static getDerivedStateFromError()` | ❌ | 此生命周期在收到错误后执行,也需要返回新的`state`对象。










