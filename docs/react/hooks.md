# React Hooks

- 最后更新于 2020/4/8 19:45:33

## 前言

**为什么要使用React Hooks?**


### 动机

`Hook` 解决了我们五年来编写和维护成千上万的组件时遇到的各种各样看起来不相关的问题。无论你正在学习 React，或每天使用，或者更愿尝试另一个和 React 有相似组件模型的框架，你都可能对这些问题似曾相识。

**1. 在组件之间复用状态逻辑很难**

`React` 没有提供将可复用性行为“附加”到组件的途径（例如，把组件连接到 store）。如果你使用过 `React` 一段时间，你也许会熟悉一些解决此类问题的方案，比如 `render props` 和 `高阶组件`。但是这类方案需要重新组织你的组件结构，这可能会很麻烦，使你的代码难以理解。

如果你在 `React DevTools` 中观察过 `React` 应用，你会发现由 `providers`，`consumers`，`高阶组件`，`render props` 等其他抽象层组成的组件会形成“嵌套地狱”。尽管我们可以在 `DevTools` 过滤掉它们，但这说明了一个更深层次的问题：`React` 需要为共享状态逻辑提供更好的原生途径。

你可以使用 `Hook` 从组件中提取`状态逻辑`，使得这些逻辑可以单独测试并复用。`Hook` 使你在无需修改组件结构的情况下复用状态逻辑。 这使得在组件间或社区内共享 `Hook` 变得更便捷。

**2. 复杂组件变得难以理解**

我们经常维护一些组件，组件起初很简单，但是逐渐会被状态逻辑和副作用充斥。每个生命周期常常包含一些不相关的逻辑。例如，组件常常在 `componentDidMount` 和 `componentDidUpdate` 中获取数据。但是，同一个 `componentDidMount` 中可能也包含很多其它的逻辑，如设置`事件监听`，而之后需在 `componentWillUnmount` 中清除。相互关联且需要对照修改的代码被进行了拆分，而完全不相关的代码却在同一个方法中组合在一起。如此很容易产生 `bug`，并且导致逻辑不一致。

在多数情况下，不可能将组件拆分为更小的粒度，因为状态逻辑无处不在。这也给测试带来了一定挑战。同时，这也是很多人将 `React` 与状态管理库结合使用的原因之一。但是，这往往会引入了很多抽象概念，需要你在不同的文件之间来回切换，使得复用变得更加困难。

为了解决这个问题，`Hook` 将组件中相互关联的部分拆分成更小的函数（比如设置订阅或请求数据），而并非强制按照生命周期划分。你还可以使用 `reducer` 来管理组件的内部状态，使其更加可预测。

**3. 难以理解的 class**

除了代码复用和代码管理会遇到困难外，我们还发现 `class` 是学习 `React` 的一大屏障。你必须去理解 `JavaScript` 中 `this` 的工作方式，这与其他语言存在巨大差异。还不能忘记绑定事件处理器。没有稳定的语法提案，这些代码非常冗余。

大家可以很好地理解 `props`，`state` 和`自顶向下的数据流`，但对 `class` 却一筹莫展。即便在有经验的 `React` 开发者之间，对于`函数组件`与 `class组件`的差异也存在分歧，甚至还要区分两种组件的使用场景。

为了解决这些问题，`Hook` 使你在非 `class` 的情况下可以使用更多的 `React` 特性。 从概念上讲，`React` 组件一直更像是函数。而 `Hook` 则拥抱了函数，同时也没有牺牲 `React` 的精神原则。`Hook` 提供了问题的解决方案，无需学习复杂的函数式或响应式编程技术。


## useState

> `useState`通过在函数组件里调用它来给组件添加一些内部 `state`。`React`会在重复渲染时保留这个 `state`。`useState` 会返回一对值：当前状态和一个让你更新它的函数，你可以在事件处理函数中或其他一些地方调用这个函数。


### 简单的官网例子
```jsx
// class类型组件
import React from 'react';

class Example extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0
    };
  }

  render() {
    return (
      <div>
        <p>You clicked {this.state.count} times</p>
        <button onClick={() => this.setState({ count: this.state.count + 1 })}>
          Click me
        </button>
      </div>
    );
  }
}

// Hooks
import React, { useState } from 'react';

function Example() {
  // 声明一个叫 "count" 的 state 变量
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
```

上述例子中,我们定义了一个`useState`钩子：

```js
const [count, setCount] = useState(0);

// 解构赋值
const myCount = useState(0);
const count = myCount[0];
const setCount = myCount[1];
// 当我们使用 useState 定义 state 变量时候，它返回一个有两个值的数组。第一个值是当前的 state，第二个值是更新 state 的函数。
// 使用 [0] 和 [1] 来访问有点令人困惑，因为它们有特定的含义。这就是我们使用数组解构的原因。
```

我们使用到了`ES6`的`解构赋值`,其中的`count`对应类组件中的`this.state.count`,其中的`setCount`对应的是`this.setState({ count:val })`,`useState(0)`对应的是给`this.state.count`的初始值为`0`。

:::warning
当然，需要注意的是类似`useState`这样的钩子函数只能够在函数式组件中使用，不能用在`class`组件内。

而且不能在`if`等判断条件内使用。
:::

### 如何使用多个state

当我们需要使用多个`state`变量的时候我们只需要再次调用`useState`钩子函数，并且传入不同的变量名即可。

```js
function ExampleWithManyStates() {
  // 声明多个 state 变量
  const [age, setAge] = useState(42);
  const [fruit, setFruit] = useState('banana');
  const [todos, setTodos] = useState([{ text: '学习 Hook' }]);
}
```

### 深入浅出`useState`的内部机制

`useState`内部的部分知识是和`setState`内部一致的，建议可以先看`setState`内部的原理。

我们进入`ReactHooks.js`来看看，发现`useState`的实现竟然异常简单，只有短短两行

```js
// ReactHooks.js
export function useState<S>(initialState: (() => S) | S) {
  const dispatcher = resolveDispatcher();
  return dispatcher.useState(initialState);
}
```
看来重点都在这个`dispatcher`上，`dispatcher`通过`resolveDispatcher()`来获取，这个函数同样也很简单，只是将`ReactCurrentDispatcher.current`的值赋给了`dispatcher`

```js
// ReactHooks.js
function resolveDispatcher() {
  const dispatcher = ReactCurrentDispatcher.current;
  return dispatcher;
}
```

**所以`useState(xxx)` 等价于 `ReactCurrentDispatcher.current.useState(xxx)`**

与`updater`是`setState`能够触发更新的核心类似，`ReactCurrentDispatcher.current.useState`是`useState`能够触发更新的关键原因，这个方法的实现并不在`react`包内。下面我们就来分析一个具体更新的例子。


#### 我们从`Fiber`调度的开始：`ReactFiberBeginwork`来谈起

之前已经说过，`React`有能力区分不同的组件，所以它会给不同的组件类型打上不同的`tag`， 详见`shared/ReactWorkTags.js`所以在`beginWork`的函数中，就可以根据`workInProgess(就是个Fiber节点)`上的`tag`值来走不同的方法来加载或者更新组件。

```js
// ReactFiberBeginWork.js
function beginWork(
  current: Fiber | null,
  workInProgress: Fiber,
  renderExpirationTime: ExpirationTime,
): Fiber | null {
  /** 省略与本文无关的部分 **/
 
  // 根据不同的组件类型走不同的方法
  switch (workInProgress.tag) {
    // 不确定组件
    case IndeterminateComponent: {
      const elementType = workInProgress.elementType;
      // 加载初始组件
      return mountIndeterminateComponent(
        current,
        workInProgress,
        elementType,
        renderExpirationTime,
      );
    }
    // 函数组件
    case FunctionComponent: {
      const Component = workInProgress.type;
      const unresolvedProps = workInProgress.pendingProps;
      const resolvedProps =
        workInProgress.elementType === Component
          ? unresolvedProps
          : resolveDefaultProps(Component, unresolvedProps);
      // 更新函数组件
      return updateFunctionComponent(
        current,
        workInProgress,
        Component,
        resolvedProps,
        renderExpirationTime,
      );
    }
    // 类组件
    case ClassComponent {
      /** 细节略 **/
      }
  }
```

下面我们来找出`useState`发挥作用的地方。

1. 第一次加载

`mount`过程执行`mountIndeterminateComponent`时，会执行到`renderWithHooks`这个函数

```js
function mountIndeterminateComponent(
  _current,
  workInProgress,
  Component,
  renderExpirationTime,
) {
 
 /** 省略准备阶段代码 **/ 
 
  // value就是渲染出来的APP组件
  let value;
 
  value = renderWithHooks(
    null,
    workInProgress,
    Component,
    props,
    context,
    renderExpirationTime,
  );
  /** 省略无关代码 **/ 
  }
  workInProgress.tag = FunctionComponent;
  reconcileChildren(null, workInProgress, value, renderExpirationTime);
  return workInProgress.child;
}
```
:::tip
执行前：`nextChildren` = `value`

执行后：`value` = `组件的虚拟DOM表示`

至于这个`value`是如何被渲染成真实的`DOM`节点，我们并不关心，`state`值我们已经通过`renderWithHooks`取到并渲染
:::

2. 更新

点击一下按钮：此时count从0变为3

更新过程执行的是`updateFunctionComponent`函数，同样会执行到`renderWithHooks`这个函数，我们来看一下这个函数执行前后发生的变化：

:::tip
执行前：`nextChildren` = `undefined`

执行后：`nextChildren` = `更新后的组件的虚拟DOM表示`

同样的，至于这个`nextChildren`是如何被渲染成真实的`DOM`节点，我们并不关心，最新的`state`值我们已经通过`renderWithHooks`取到并渲染

所以，`renderWithHooks`函数就是处理各种`hooks`逻辑的核心部分
:::

#### Hook对象

`Fiber`中的`memorizedStated`用来存储`state`,`React`通过将一个`Hook`对象挂载在`memorizedStated`上来保存函数组件的`state`

```js
// ReactFiberHooks.js
export type Hook = {
  memoizedState: any, // 用来记录当前useState应该返回的结果的
 
  baseState: any,    
  baseUpdate: Update<any, any> | null,  
  queue: UpdateQueue<any, any> | null,  // 缓存队列，存储多次更新行为
 
  next: Hook | null, // 指向下一次useState对应的Hook对象。
};
```
#### renderWithHooks

```js
// ReactFiberHooks.js
export function renderWithHooks(
  current: Fiber | null,
  workInProgress: Fiber,
  Component: any,
  props: any,
  refOrContext: any,
  nextRenderExpirationTime: ExpirationTime,
): any {
  renderExpirationTime = nextRenderExpirationTime;
  currentlyRenderingFiber = workInProgress;
 
  // 如果current的值为空，说明还没有hook对象被挂载
  // 而根据hook对象结构可知，current.memoizedState指向下一个current
  nextCurrentHook = current !== null ? current.memoizedState : null;
 
  // 用nextCurrentHook的值来区分mount和update，设置不同的dispatcher
  ReactCurrentDispatcher.current =
      nextCurrentHook === null
      // 初始化时
        ? HooksDispatcherOnMount
          // 更新时
        : HooksDispatcherOnUpdate;
 
  // 此时已经有了新的dispatcher,在调用Component时就可以拿到新的对象
  let children = Component(props, refOrContext);
 
  // 重置
  ReactCurrentDispatcher.current = ContextOnlyDispatcher;
 
  const renderedWork: Fiber = (currentlyRenderingFiber: any);
 
  // 更新memoizedState和updateQueue
  renderedWork.memoizedState = firstWorkInProgressHook;
  renderedWork.updateQueue = (componentUpdateQueue: any);
 
   /** 省略与本文无关的部分代码，便于理解 **/
}

```
#### 初始化时,创建一个新的hook，初始化state， 并绑定触发器

初始化阶段`ReactCurrentDispatcher.current` 会指向`HooksDispatcherOnMount` 对象

```js
// ReactFiberHooks.js
 
const HooksDispatcherOnMount: Dispatcher = {
/** 省略其它Hooks **/
  useState: mountState,
};
 
// 所以调用useState(0)返回的就是HooksDispatcherOnMount.useState(0)，也就是mountState(0)
function mountState<S>(
  initialState: (() => S) | S,
): [S, Dispatch<BasicStateAction<S>>] {
    // 访问Hook链表的下一个节点，获取到新的Hook对象
  const hook = mountWorkInProgressHook();
//如果入参是function则会调用，但是不提供参数
  if (typeof initialState === 'function') {
    initialState = initialState();
  }
// 进行state的初始化工作
  hook.memoizedState = hook.baseState = initialState;
// 进行queue的初始化工作
  const queue = (hook.queue = {
    last: null,
    dispatch: null,
    eagerReducer: basicStateReducer, // useState使用基础reducer
    eagerState: (initialState: any),
  });
    // 返回触发器
  const dispatch: Dispatch<BasicStateAction<S>,> 
    = (queue.dispatch = (dispatchAction.bind(
        null,
        //绑定当前fiber结点和queue
        ((currentlyRenderingFiber: any): Fiber),
        queue,
  ));
  // 返回初始state和触发器
  return [hook.memoizedState, dispatch];
}
 
// 对于useState触发的update action来说（假设useState里面都传的变量），basicStateReducer就是直接返回action的值
function basicStateReducer<S>(state: S, action: BasicStateAction<S>): S {
  return typeof action === 'function' ? action(state) : action;
}

```
#### dispatchAction

```js
function dispatchAction<S, A>(
  fiber: Fiber,
  queue: UpdateQueue<S, A>,
  action: A,
) {
 
   /** 省略Fiber调度相关代码 **/
 
  // 创建新的新的update, action就是我们setCount里面的值(count+1, count+2, count+3…)
    const update: Update<S, A> = {
      expirationTime,
      action,
      eagerReducer: null,
      eagerState: null,
      next: null,
    };
 
    // 重点：构建query
    // queue.last是最近的一次更新，然后last.next开始是每一次的action
    const last = queue.last;
    if (last === null) {
      // 只有一个update, 自己指自己-形成环
      update.next = update;
    } else {
      const first = last.next;
      if (first !== null) {
 
        update.next = first;
      }
      last.next = update;
    }
    queue.last = update;
 
    /** 省略特殊情况相关代码 **/
 
    // 创建一个更新任务
    scheduleWork(fiber, expirationTime);
 
}

```
在`dispatchAction`中维护了一份`query`的数据结构。

query是一个有环链表，规则：

- query.last指向最近一次更新

- last.next指向第一次更新

- 后面就依次类推，最终倒数第二次更新指向last，形成一个环。

**所以每次插入新`update`时，就需要将原来的`first`指向`query.last.next`。再将`update`指向`query.next`，最后将`query.last`指向`update`.**

#### 更新时,获取该Hook对象中的 queue，内部存有本次更新的一系列数据，进行更新

更新阶段 `ReactCurrentDispatcher.current` 会指向`HooksDispatcherOnUpdate`对象

```js
// ReactFiberHooks.js
 
// 所以调用useState(0)返回的就是HooksDispatcherOnUpdate.useState(0)，也就是updateReducer(basicStateReducer, 0)
 
const HooksDispatcherOnUpdate: Dispatcher = {
  /** 省略其它Hooks **/
   useState: updateState,
}
 
function updateState(initialState) {
  return updateReducer(basicStateReducer, initialState);
}
 
// 可以看到updateReducer的过程与传的initalState已经无关了，所以初始值只在第一次被使用
 
// 为了方便阅读，删去了一些无关代码
// 查看完整代码：https://github.com/facebook/react/blob/487f4bf2ee7c86176637544c5473328f96ca0ba2/packages/react-reconciler/src/ReactFiberHooks.js#L606
function updateReducer(reducer, initialArg, init) {
// 获取初始化时的 hook
  const hook = updateWorkInProgressHook();
  const queue = hook.queue;
 
  // 开始渲染更新
  if (numberOfReRenders > 0) {
    const dispatch = queue.dispatch;
    if (renderPhaseUpdates !== null) {
      // 获取Hook对象上的 queue，内部存有本次更新的一系列数据
      const firstRenderPhaseUpdate = renderPhaseUpdates.get(queue);
      if (firstRenderPhaseUpdate !== undefined) {
        renderPhaseUpdates.delete(queue);
        let newState = hook.memoizedState;
        let update = firstRenderPhaseUpdate;
        // 获取更新后的state
        do {
          const action = update.action;
          // 此时的reducer是basicStateReducer，直接返回action的值
          newState = reducer(newState, action);
          update = update.next;
        } while (update !== null);
        // 对 更新hook.memoized 
        hook.memoizedState = newState;
        // 返回新的 state，及更新 hook 的 dispatch 方法
        return [newState, dispatch];
      }
    }
  }
 
// 对于useState触发的update action来说（假设useState里面都传的变量），basicStateReducer就是直接返回action的值
function basicStateReducer<S>(state: S, action: BasicStateAction<S>): S {
  return typeof action === 'function' ? action(state) : action;
}

```

### useState整体运作流程总结

- 初始化：构建`dispatcher函数`和`初始值`

- 更新时：
    1. 调用`dispatcher`函数，按序插入`update`(其实就是一个action)

    2. 收集`update`，调度一次`React`的更新

    3. 在更新的过程中将`ReactCurrentDispatcher.current`指向负责更新的`Dispatcher`

    4. 执行到函数组件`App()`时，`useState`会被重新执行，在`resolve dispatcher`的阶段拿到了负责更新的`dispatcher`。

    5. `useState`会拿到`Hook`对象，`Hook.query`中存储了`更新队列`，依次进行更新后，即可拿到最新的`state`

    6. 函数组件`App()`执行后返回的`nextChild`中的`count`值已经是最新的了。`FiberNode`中的`memorizedState`也被设置为最新的`state`

    7. `Fiber`渲染出真实`DOM`。更新结束。

## useEffect

`Effect Hook` 可以让你在函数组件中执行副作用操作。

```js
import React, { useState, useEffect } from 'react';

function Example() {
  const [count, setCount] = useState(0);

  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    // Update the document title using the browser API
    document.title = `You clicked ${count} times`;
  });

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
```
:::tip
如果你熟悉 `React class` 的生命周期函数，你可以把 `useEffect Hook` 看做 `componentDidMount`，`componentDidUpdate` 和 `componentWillUnmount` 这三个函数的组合。
:::

在 `React` 组件中有两种常见副作用操作：`需要清除的`和`不需要清除的`。我们来更仔细地看一下他们之间的区别。


### 无需清除的effect

有时候，我们只想在 `React` 更新 `DOM` 之后运行一些额外的代码。比如发送网络请求，手动变更 DOM，记录日志，这些都是常见的无需清除的操作。因为我们在执行完这些操作之后，就可以忽略他们了。让我们对比一下使用 `class` 和 `Hook` 都是怎么实现这些副作用的。


#### 使用 class 的示例

在 `React` 的 `class` 组件中，`render` 函数是不应该有任何副作用的。一般来说，在这里执行操作太早了，我们基本上都希望在 `React` 更新 `DOM` 之后才执行我们的操作。

这就是为什么在 `React class` 中，我们把副作用操作放到 `componentDidMount` 和 `componentDidUpdate` 函数中。回到示例中，这是一个 `React` 计数器的 `class` 组件。它在 `React` 对 `DOM` 进行操作之后，立即更新了 `document` 的 `title` 属性

```js
class Example extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0
    };
  }

  componentDidMount() {
    document.title = `You clicked ${this.state.count} times`;
  }

  componentDidUpdate() {
    document.title = `You clicked ${this.state.count} times`;
  }

  render() {
    return (
      <div>
        <p>You clicked {this.state.count} times</p>
        <button onClick={() => this.setState({ count: this.state.count + 1 })}>
          Click me
        </button>
      </div>
    );
  }
}
```

注意，在这个 `class` 中，我们需要在两个生命周期函数中编写重复的代码。

### useEffect 做了什么？

通过使用这个 `Hook`，你可以告诉 `React` 组件需要在渲染后执行某些操作。`React` 会保存你传递的函数（我们将它称之为 “effect”），并且在执行 `DOM` 更新之后调用它。在这个 `effect` 中，我们设置了 `document` 的 `title` 属性，不过我们也可以执行数据获取或调用其他命令式的 API。

### 为什么在组件内部调用 useEffect？

将 `useEffect` 放在组件内部让我们可以在 `effect` 中直接访问 `count state` 变量（或其他 props）。我们不需要特殊的 `API` 来读取它 —— 它已经保存在函数作用域中。`Hook` 使用了 `JavaScript` 的闭包机制，而不用在 `JavaScript` 已经提供了解决方案的情况下，还引入特定的 `React API`。

### useEffect 会在每次渲染后都执行吗？

是的，默认情况下，它在第一次渲染之后和每次更新之后都会执行。你可能会更容易接受 `effect` 发生在“渲染之后”这种概念，不用再去考虑“挂载”还是“更新”。`React` 保证了每次运行 `effect` 的同时，`DOM` 都已经更新完毕。

:::tip
与 `componentDidMount` 或 `componentDidUpdate` 不同，使用 `useEffect` 调度的 `effect` 不会阻塞浏览器更新屏幕，这让你的应用看起来响应更快。大多数情况下，`effect` 不需要同步地执行。在个别情况下（例如测量布局），有单独的 useLayoutEffect Hook 供你使用，其 `API` 与 `useEffect` 相同。
:::

### 需要清除的 effect

之前，我们研究了如何使用不需要清除的副作用，还有一些副作用是需要清除的。例如订阅外部数据源。这种情况下，清除工作是非常重要的，可以防止引起内存泄露！现在让我们来比较一下如何用 `Class` 和 `Hook` 来实现。

```js
class FriendStatus extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isOnline: null };
    this.handleStatusChange = this.handleStatusChange.bind(this);
  }

  componentDidMount() {
    ChatAPI.subscribeToFriendStatus(
      this.props.friend.id,
      this.handleStatusChange
    );
  }

  componentWillUnmount() {
    ChatAPI.unsubscribeFromFriendStatus(
      this.props.friend.id,
      this.handleStatusChange
    );
  }

  handleStatusChange(status) {
    this.setState({
      isOnline: status.isOnline
    });
  }

  render() {
    if (this.state.isOnline === null) {
      return 'Loading...';
    }
    return this.state.isOnline ? 'Online' : 'Offline';
  }
}
```
你会注意到 `componentDidMount` 和 `componentWillUnmount` 之间相互对应。使用生命周期函数迫使我们拆分这些逻辑代码，即使这两部分代码都作用于相同的副作用。

你可能认为需要单独的 `effect` 来执行清除操作。但由于添加和删除订阅的代码的紧密性，所以 `useEffect `的设计是在同一个地方执行。如果你的 `effect` 返回一个函数，`React` 将会在执行清除操作时调用它：

```js
import React, { useState, useEffect } from 'react';

function FriendStatus(props) {
  const [isOnline, setIsOnline] = useState(null);

  useEffect(() => {
    function handleStatusChange(status) {
      setIsOnline(status.isOnline);
    }

    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
    // Specify how to clean up after this effect:
    return function cleanup() {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  });

  if (isOnline === null) {
    return 'Loading...';
  }
  return isOnline ? 'Online' : 'Offline';
}
```

#### 为什么要在 effect 中返回一个函数？ 

这是 `effect` 可选的清除机制。每个 `effect` 都可以返回一个清除函数。如此可以将添加和移除订阅的逻辑放在一起。它们都属于 effect 的一部分。

#### React 何时清除 effect？ 

`React` 会在组件卸载的时候执行清除操作。正如之前学到的，`effect` 在每次渲染的时候都会执行。这就是为什么 `React` 会在执行当前 `effect` 之前对上一个 `effect` 进行清除。


## useContext

```js
const value = useContext(MyContext);
```
> 接收一个 `context` 对象（`React.createContext` 的返回值）并返回该 `context` 的当前值。当前的 `context` 值由上层组件中距离当前组件最近的 `<MyContext.Provider>` 的 `value prop` 决定。


当组件上层最近的 `<MyContext.Provider>` 更新时，该 `Hook` 会触发重渲染，并使用最新传递给 `MyContext provider` 的 `context value` 值。

### 标准的context方式

```js
import React from "react";
import ReactDOM from "react-dom";

// 创建 Context
const NumberContext = React.createContext();
// 它返回一个具有两个值的对象
// { Provider, Consumer }

function App() {
  // 使用 Provider 为所有子孙代提供 value 值 
  return (
    <NumberContext.Provider value={42}>
      <div>
        <Display />
      </div>
    </NumberContext.Provider>
  );
}

function Display() {
  // 使用 Consumer 从上下文中获取 value
  return (
    <NumberContext.Consumer>
      {value => <div>The answer is {value}.</div>}
    </NumberContext.Consumer>
  );
}

ReactDOM.render(<App />, document.querySelector("#root"));
```
:::tip
**别忘记 `useContext` 的参数必须是 `context `对象本身：**

- 正确： useContext(MyContext)
- 错误： useContext(MyContext.Consumer)
- 错误： useContext(MyContext.Provider)
:::

调用了 `useContext` 的组件总会在 `context` 值变化时重新渲染。如果重渲染组件的开销较大，你可以 通过使用 `memoization` 来优化。

:::warning
如果你在接触 `Hook` 前已经对 `context API` 比较熟悉，那应该可以理解，`useContext(MyContext)` 相当于 `class`组件中的 `static contextType = MyContext` 或者 `<MyContext.Consumer>`。

`useContext(MyContext)` 只是让你能够读取 `context` 的值以及订阅 `context` 的变化。你仍然需要在上层组件树中使用 `<MyContext.Provider> `来为下层组件提供 `context`。
:::

```js
const themes = {
  light: {
    foreground: "#000000",
    background: "#eeeeee"
  },
  dark: {
    foreground: "#ffffff",
    background: "#222222"
  }
};

const ThemeContext = React.createContext(themes.light);

function App() {
  return (
    <ThemeContext.Provider value={themes.dark}>
      <Toolbar />
    </ThemeContext.Provider>
  );
}

function Toolbar(props) {
  return (
    <div>
      <ThemedButton />
    </div>
  );
}

function ThemedButton() {
  const theme = useContext(ThemeContext);

  return (
    <button style={{ background: theme.background, color: theme.foreground }}>
      I am styled by theme context!
    </button>
  );
}
```

## useReducer

```js
const [state, dispatch] = useReducer(reducer, initialArg, init);
```

接收一个形如` (state, action) => newState `的 `reducer`，并返回当前的 `state` 以及与其配套的 `dispatch` 方法。将 `init` 函数作为 `useReducer` 的第三个参数传入，这样初始 `state` 将被设置为 `init(initialArg)`。

这么做可以将用于计算 `state` 的逻辑提取到 `reducer` 外部，这也为将来对重置 `state` 的 `action` 做处理提供了便利。

在某些场景下，`useReducer` 会比 `useState` 更适用，例如 `state` 逻辑较复杂且包含多个子值，或者下一个 `state` 依赖于之前的 `state` 等。并且，使用 `useReducer` 还能给那些会触发深更新的组件做性能优化，因为你可以向子组件传递 `dispatch` 而不是回调函数 。

以下是用 `reducer` 重写 `useState` 计数器示例：

```js
const initialState = {
  count: 0
};

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return {count: state.count + 1};
    case 'decrement':
      return {count: state.count - 1};
    default:
      throw new Error();
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <>
      Count: {state.count}
      <button onClick={() => dispatch({type: 'decrement'})}>-</button>
      <button onClick={() => dispatch({type: 'increment'})}>+</button>
    </>
  );
}
```

## useCallback

```js
const memoizedCallback = useCallback(
  () => {
    doSomething(a, b);
  },
  [a, b],
);
```

`useMemo`和`useCallback`都会在组件第一次渲染的时候执行，之后会在某个依赖项变更的时候再次执行，并且这两个`hooks`值都返回缓存的值，`useMemo`返回缓存的变量，`useCallback`返回缓存的函数

:::tip
```js
useCallback(fn, deps) 相当于 useMemo(() => fn, deps)。
```
这种写法在早期的`class`组件中对应的就是对`render`中函数的优化，避免多次`render`导致函数的重新绑定。
:::

## useMemo

```js
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);

```
简单的例子
```js
import { useState, useMemo } from 'react';
import ReactDOM from 'react-dom';

function Time() {
    return <p>{Date.now()}</p>;
}

function Counter() {
  const [count, setCount] = useState(0);

  const memoizedChildComponent = useMemo((count) => {
    return <Time />;
  }, [count]);

  return (
    <div>
      <h1>{count}</h1>
      <button onClick={() => setCount(count + 1)}>+</button>
      <div>{memoizedChildComponent}</div>
    </div>
  );
}

ReactDOM.render(<Counter />, document.getElementById('root'));
```

## useLayoutEffect

`useLayoutEffect`的用法跟`useEffect`的用法是完全一样的，都可以执行副作用和清理操作。它们之间唯一的区别就是`执行的时机`。

- `useEffect`不会阻塞浏览器的绘制任务，它在页面更新后才会执行。

- `useLayoutEffect`跟`componentDidMount`和`componentDidUpdate`的执行时机一样，会阻塞页面的渲染。如果在里面执行耗时任务的话，页面就会卡顿。

:::tip
在绝大多数情况下，`useEffectHook` 是更好的选择。

唯一例外的就是需要根据新的 `UI` 来进行 `DOM`操作的场景。`useLayoutEffect`会保证在页面渲染前执行，也就是说页面渲染出来的是最终的效果。如果使用`useEffect`，页面很可能因为渲染了 `2` 次而出现抖动
:::

## useRef

```js
const refContainer = useRef(initialValue);
```

`useRef` 返回一个可变的 `ref` 对象，其 `.current` 属性被初始化为传入的参数`（initialValue）`。返回的 `ref` 对象在组件的整个生命周期内保持不变。

```js
// class
class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
  }
  
  componentDidMount() {
    this.myRef.current.focus();
  }  

  render() {
    return <input ref={this.myRef} type="text" />;
  }
}

// hooks
function() {
  const myRef = useRef(null);

  useEffect(() => {
    myRef.current.focus();
  }, [])
  
  return <input ref={myRef} type="text" />;
}
```
## usePrevious

```js
function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}
```
通常某些场景下我们需要去获取一下该变量在更新之前的值，这个时候就可以使用`usePrevious`。


## useImperativeHandle

```js
useImperativeHandle(ref, createHandle, [deps])
```

`useImperativeHandle` 可以让你在使用 `ref` 时自定义暴露给父组件的实例值。在大多数情况下，应当避免使用 `ref` 这样的命令式代码。`useImperativeHandle` 应当与 `forwardRef` 一起使用：

```js
function FancyInput(props, ref) {
  const inputRef = useRef();
  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current.focus();
    }
  }));
  return <input ref={inputRef} ... />;
}
FancyInput = forwardRef(FancyInput);
```

在本例中，渲染 `<FancyInput ref={inputRef} />` 的父组件可以调用 `inputRef.current.focus()`。

## useInterval

支持手动清除`interval`
```js
/**
 * @param {function} callback 回调函数
 * @param {null | number} delay 执行间隔
 */
import { useRef, useEffect } from 'react'

function useInterval(callback, delay = 1000) {
    const intervalFn = useRef();

    // remember the latest callback
    useEffect(() => {
        intervalFn.current.callback = callback;
    }, [callback]);

    // set the interval
    useEffect(() => {
        if (delay !== null) {
            intervalFn.current.timer = setInterval(() => {
                intervalFn.current.callback();
            }, delay)
            return () => {
              clearInterval(intervalFn.current.timer);
              intervalFn.current = null;
            }
        }
    }, [delay])

    return intervalFn.current.timer 
}
```

:::tip
1. 通过useRef创建一个对象；
2. 将需要执行的定时任务储存在这个对象上；
3. 将delay作为第二个参数是为了当我们动态改变定时任务时，能够重新执行定时器。
4. 将delay设置为null则不启用定时器。

开发中使用useInterval如下：

``` js
import useInterval from '...';

useInterval(() => {
    // you code
}, 1000);

```
:::

## useEventListener

```js
import {
    useRef,
    useEffect
} from 'react'

function useEventListener(eventName, handler, element = window) {
    // 创建一个 ref 来存储处理程序
    const saveHandler = useRef();
    // 如果 handler 变化了，就更新 ref.current 的值。
    // 这个让我们下面的 effect 永远获取到最新的 handler
    useEffect(() => {
        saveHandler.current = handler;
    }, [handler]);

    useEffect(() => {
        // 确保元素支持 addEventListener
        const isSupported = element && element.addEventListener;
        if (!isSupported) return;
        // 创建事件监听调用存储在 ref 的处理方法
        const eventListener = event => saveHandler.current(event);
        // 添加事件监听
        element.addEventListener(eventName, eventListener);
        // 清除的时候移除事件监听
        return () => {
            element.removeEventListener(eventName, eventListener);
        };
    }, [eventName, element]);
}
```

## useImgLazy

```js
// 判断是否在视口里面
function isInWindow(el){
    // 返回元素距离视窗的top、left等值
    const bound = el.getBoundingClientRect();
    const clientHeight = window.innerHeight;
    return bound.top <= clientHeight + 100;
}

// 加载图片真实链接
function loadImg(el){
    if(!el.src){
        const source = el.getAttribute('data-src');
        el.src = source;
    }
}

// 加载图片
function checkImgs(className){
    const imgs = document.querySelectorAll(`img.${className}`);
    Array.from(imgs).forEach(el =>{
        if (isInWindow(el)){
            loadImg(el);
        }
    })
}

function useImgLazy(className){
    useEventListener('scroll', ()=>{
      checkImgs(className)
    })
}
```

直接使用`IntersectionObserver` 实现了windowscroll事件 判断是否在窗口中 节流三大功能

```js
/**
 * IntersectionObserver 实现了windowscroll事件 判断是否在窗口中 节流三大功能
 * 
 */
const img = document.querySelectorAll('img')
const observer = new IntersectionObserver(changes => {
    // changes是被观察的元素集合
    for (let i = 0, len = changes.length; i < len; i++) {
        let change = change[i]
        // 通过isIntersecting判断是否在窗口中
        if (change.isIntersecting) {
            const imgEle = change.target
            imgEle.src = imgEle.getAttribute('data-src')
            observer.unobserve(imgEle)
        }
    }
})

[...img].forEach(item => observer.observer(item))

```
## Hooks FAQ

**Q:我应该使用单个还是多个 state 变量？**

在我们之前使用`class`组件的时候,我们都是在一次的状态变更中去更新变化的所有状态，然而`setState`函数走的是一个`合并的过程`。当我们使用`useState`的时候，第二个事件函数去更新状态的时候走的是`覆盖的操作`，直接传入更改的状态的化则会丢失其他的数据。

这时候如何合理的构建一个`state`变量就显的比较重要了。

看一个简单的官方例子

```js
function Box() {
  const [state, setState] = useState({ left: 0, top: 0, width: 100, height: 100 });
  // ...
}
```

现在假设我们想要编写一些逻辑以便在用户移动鼠标时改变 `left` 和 `top`。注意到我们是如何必须手动把这些字段合并到之前的 `state` 对象的：

```js
// ...
  useEffect(() => {
    function handleWindowMouseMove(e) {
      // ...state 确保我们没有 「丢失」 width 和 height 否则的话只会保留left值和top值
      setState(state => ({ ...state, left: e.pageX, top: e.pageY }));
    }
    // 注意：这是个简化版的实现
    window.addEventListener('mousemove', handleWindowMouseMove);
    return () => window.removeEventListener('mousemove', handleWindowMouseMove);
  }, []);
  // ...
```

我们推荐把 `state` 切分成多个 `state` 变量，每个变量包含的不同值会在同时发生变化。

举个例子，我们可以把组件的 `state` 拆分为 `position` 和 `size` 两个对象，并永远以非合并的方式去替换 `position：`

```js
function Box() {
  const [position, setPosition] = useState({ left: 0, top: 0 });
  const [size, setSize] = useState({ width: 100, height: 100 });

  useEffect(() => {
    function handleWindowMouseMove(e) {
      setPosition({ left: e.pageX, top: e.pageY });
    }
    // 注意：这是个简化版的实现
    window.addEventListener('mousemove', handleWindowMouseMove);
    return () => window.removeEventListener('mousemove', handleWindowMouseMove);
  }, []);

  console.log(position)
  // ...
```

把独立的 `state` 变量拆分开还有另外的好处。这使得后期把一些相关的逻辑抽取到一个自定义 `Hook` 变得容易，比如说:

```js
function Box() {
  const position = useWindowPosition();
  const [size, setSize] = useState({ width: 100, height: 100 });
  // ...
}

function useWindowPosition() {
  const [position, setPosition] = useState({ left: 0, top: 0 });
  useEffect(() => {
    // ...
  }, []);
  return position;
}
```

把所有 `state` 都放在同一个 `useState` 调用中，或是每一个字段都对应一个 `useState` 调用，这两方式都能跑通。当你在这两个极端之间找到平衡，然后把相关 `state` 组合到几个独立的 `state` 变量时，组件就会更加的可读。如果 `state` 的逻辑开始变得复杂，我们推荐用 `reducer` 来管理它，或使用`自定义 Hook`。


**Q:如何获取上一轮的 props 或 state？**

我们可以通过使用ref来存储上个变量的状态

```js
function Counter() {
  const [count, setCount] = useState(0);

  const prevCountRef = useRef();
  useEffect(() => {
    prevCountRef.current = count;
  });
  const prevCount = prevCountRef.current;

  return <h1>Now: {count}, before: {prevCount}</h1>;
}
```

这或许有一点错综复杂，但你可以把它抽取成一个自定义 Hook：

```js
function Counter() {
  const [count, setCount] = useState(0);
  const prevCount = usePrevious(count);
  return <h1>Now: {count}, before: {prevCount}</h1>;
}

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

```

***Q.为什么我会在我的函数中看到陈旧的 props 和 state ？**

组件内部的任何函数，包括`事件处理函数`和 `effect`，都是从它被创建的那次渲染中被「看到」的。例如，考虑这样的代码：

```js
function Example() {
  const [count, setCount] = useState(0);

  function handleAlertClick() {
    setTimeout(() => {
      alert('You clicked on: ' + count);
    }, 3000);
  }

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
      <button onClick={handleAlertClick}>
        Show alert
      </button>
    </div>
  );
}
```

如果你先点击`「Show alert」`然后增加计数器的计数，那这个 `alert` 会显示在你点击`『Show alert』`按钮时的 `count` 变量。这避免了那些因为假设 `props` 和 `state` 没有改变的代码引起问题。

如果你刻意地想要从某些异步回调中读取 最新的 `state`，你可以用 一个 `ref` 来保存它，修改它，并从中读取。

最后，你看到陈旧的 `props` 和 `state` 的另一个可能的原因，是你使用了「依赖数组」优化但没有正确地指定所有的依赖。举个例子，如果一个 `effect` 指定了 `[]` 作为第二个参数，但在内部读取了 `someProp`，它会一直「看到」 `someProp` 的初始值。解决办法是要么移除依赖数组，要么修正它。

:::tip
推荐使用`exhaustive-deps` ESLint 规则`eslint-plugin-react-hooks` 包的一部分。它会在依赖被错误指定时发出警告，并给出修复建议。
:::

**Q.在依赖列表中省略函数是否安全？**

一般来说，不安全。

```js
function Example({ someProp }) {
  function doSomething() {
    console.log(someProp);
  }

  useEffect(() => {
    doSomething();
  }, []); // 🔴 这样不安全（它调用的 `doSomething` 函数使用了 `someProp`）
}
```

要记住 `effect` 外部的函数使用了哪些 `props` 和 `state` 很难。这也是为什么 通常你会想要在 `effect` 内部 去声明它所需要的函数。 这样就能容易的看出那个 `effect` 依赖了组件作用域中的哪些值：

```js
function Example({ someProp }) {
  useEffect(() => {
    function doSomething() {
      console.log(someProp);
    }

    doSomething();
  }, [someProp]); // ✅ 安全（我们的 effect 仅用到了 `someProp`）
}
```

如果这样之后我们依然没用到组件作用域中的任何值，就可以安全地把它指定为 []：

```js
useEffect(() => {
  function doSomething() {
    console.log('hello');
  }

  doSomething();
}, []); // ✅ 在这个例子中是安全的，因为我们没有用到组件作用域中的 *任何* 值
```

:::warning
如果你指定了一个 `依赖列表` 作为 `useEffect`、`useMemo`、`useCallback` 或 `useImperativeHandle` 的最后一个参数，它必须包含回调中的所有值，并参与 `React 数据流`。这就包括 `props`、`state`，以及任何由它们衍生而来的东西。
:::

只有 当函数（以及它所调用的函数）不引用 `props`、`state` 以及由它们衍生而来的值时，你才能放心地把它们从依赖列表中省略。下面这个案例有一个 Bug：

```js
function ProductPage({ productId }) {
  const [product, setProduct] = useState(null);

  async function fetchProduct() {
    const response = await fetch('http://myapi/product/' + productId); // 使用了 productId prop
    const json = await response.json();
    setProduct(json);
  }

  useEffect(() => {
    fetchProduct();
  }, []); // 🔴 这样是无效的，因为 `fetchProduct` 使用了 `productId`
  // ...
}
```
推荐的修复方案是把那个函数移动到你的 `effect` 内部。这样就能很容易的看出来你的 `effect` 使用了哪些 `props` 和 `state`，并确保它们都被声明了：

```js
function ProductPage({ productId }) {
  const [product, setProduct] = useState(null);

  useEffect(() => {
    // 把这个函数移动到 effect 内部后，我们可以清楚地看到它用到的值。
    async function fetchProduct() {
      const response = await fetch('http://myapi/product/' + productId);
      const json = await response.json();
      setProduct(json);
    }

    fetchProduct();
  }, [productId]); // ✅ 有效，因为我们的 effect 只用到了 productId
  // ...
}
```

这同时也允许你通过 `effect` 内部的局部变量来处理无序的响应：

```js
  useEffect(() => {
    let ignore = false;
    async function fetchProduct() {
      const response = await fetch('http://myapi/product/' + productId);
      const json = await response.json();
      if (!ignore) setProduct(json);
    }

    fetchProduct();
    return () => { ignore = true };
  }, [productId]);
```

如果处于某些原因你 无法 把一个函数移动到 effect 内部，还有一些其他办法：

1. 你可以尝试把那个函数移动到你的组件之外。那样一来，这个函数就肯定不会依赖任何 `props` 或 `state`，并且也不用出现在依赖列表中了。

2. 如果你所调用的方法是一个纯计算，并且可以在渲染时调用，你可以 转而在 `effect` 之外调用它， 并让 `effect` 依赖于它的返回值。

3. 万不得已的情况下，你可以 把函数加入 `effect` 的依赖但 把它的定义包裹 进 `useCallback Hook`。这就确保了它不随渲染而改变，除非 它自身 的依赖发生了改变：

```js
function ProductPage({ productId }) {
  // ✅ 用 useCallback 包裹以避免随渲染发生改变
  const fetchProduct = useCallback(() => {
    // ... Does something with productId ...
  }, [productId]); // ✅ useCallback 的所有依赖都被指定了

  return <ProductDetails fetchProduct={fetchProduct} />;
}

function ProductDetails({ fetchProduct }) {
  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]); // ✅ useEffect 的所有依赖都被指定了
  // ...
}
```

**Q.如果我的 effect 的依赖频繁变化，我该怎么办？**

有时候，你的 effect 可能会使用一些频繁变化的值。你可能会忽略依赖列表中 state，但这通常会引起 Bug：

```js
function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setCount(count + 1); // 这个 effect 依赖于 `count` state
    }, 1000);
    return () => clearInterval(id);
  }, []); // 🔴 Bug: `count` 没有被指定为依赖

  return <h1>{count}</h1>;
}
```

传入空的依赖数组 `[]`，意味着该 `hook` 只在组件挂载时运行一次，并非重新渲染时。

但如此会有问题，在 `setInterval`的回调中，`count` 的值不会发生变化。因为当 `effect` 执行时，我们会创建一个闭包，并将 `count` 的值被保存在该闭包当中，且初值为 `0`。每隔一秒，回调就会执行 `setCount(0 + 1)`，因此，`count` 永远不会超过 `1`。

指定 `[count]` 作为依赖列表就能修复这个 `Bug`，但会导致每次改变发生时定时器都被重置。事实上，每个 `setInterval` 在被清除前（类似于 `setTimeout`）都会调用一次。但这并不是我们想要的。要解决这个问题，我们可以使用 `setState` 的函数式更新形式。它允许我们指定 `state` 该如何改变而不用引用 当前 `state`：

```js
function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + 1); // ✅ 在这不依赖于外部的 `count` 变量
    }, 1000);
    return () => clearInterval(id);
  }, []); // ✅ 我们的 effect 不适用组件作用域中的任何变量

  return <h1>{count}</h1>;
}
```

（setCount 函数的身份是被确保稳定的，所以可以放心的省略掉）

此时，`setInterval` 的回调依旧每秒调用一次，但每次 `setCount` 内部的回调取到的 `count` 是最新值（在回调中变量命名为 c）。


**Q.如何避免向下传递回调？**

我们已经发现大部分人并不喜欢在组件树的每一层手动传递回调。尽管这种写法更明确，但这给人感觉像错综复杂的管道工程一样麻烦。

在大型的组件树中，我们推荐的替代方案是通过 `context` 用 `useReducer` 往下传一个 `dispatch` 函数：

```js
const TodosDispatch = React.createContext(null);

function TodosApp() {
  // 提示：`dispatch` 不会在重新渲染之间变化
  const [todos, dispatch] = useReducer(todosReducer);

  return (
    <TodosDispatch.Provider value={dispatch}>
      <DeepTree todos={todos} />
    </TodosDispatch.Provider>
  );
}
```

`TodosApp` 内部组件树里的任何子节点都可以使用 `dispatch` 函数来向上传递 `actions` 到 `TodosApp`：

```js
function DeepChild(props) {
  // 如果我们想要执行一个 action，我们可以从 context 中获取 dispatch。
  const dispatch = useContext(TodosDispatch);

  function handleClick() {
    dispatch({ type: 'add', text: 'hello' });
  }

  return (
    <button onClick={handleClick}>Add todo</button>
  );
}
```

总而言之，从维护的角度来这样看更加方便（不用不断转发回调），同时也避免了回调的问题。像这样向下传递 `dispatch` 是处理深度更新的推荐模式。

**Q.React 是如何把对 Hook 的调用和组件联系起来的？**

React 保持对当先渲染中的组件的追踪。多亏了 Hook 规范，我们得知 Hook 只会在 React 组件中被调用（或自定义 Hook —— 同样只会在 React 组件中被调用）。

每个组件内部都有一个「记忆单元格」列表。它们只不过是我们用来存储一些数据的 `JavaScript` 对象。当你用 `useState()` 调用一个 `Hook` 的时候，它会读取当前的单元格（或在首次渲染时将其初始化），然后把指针移动到下一个。这就是多个 `useState()` 调用会得到各自独立的本地 `state` 的原因。

