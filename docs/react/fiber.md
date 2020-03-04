# Fiber算法

`React`在`16`之后渲染的算法已经由原来的`reconciler(Stack reconciler)`算法改为了`Fiber`算法。`Fiber`（可译为丝）比线程还细的控制粒度，旨在对渲染过程做更精细的调整。

### 替换原因

1. 之前的`reconciler（被称为Stack reconciler）`采用`自顶向下`的递归`mount/update`，无法中断（持续占用主线程），这样主线程上的布局、动画等周期性任务以及交互响应就无法立即得到处理，影响体验。

2. 之前的渲染过程中没有优先级可言

基于浏览器对 `requestIdleCallback` 和 `requestAnimationFrame` 这两个 `API` 的支持,`React` 团队实现新的调度策略 -- `Fiber reconcile`。


### requestIdelCallBack

客户端线程执行任务时会以帧的形式划分，大部分设备控制在30-60帧是不会影响用户体验的。在两个帧的执行期间，主线程通常会有一小段的空闲时间。`requestIdelCallBack`可以在这个空闲时间调用`IdelCallBack`执行一些任务。

- 低优先级的任务将由`requestIdelCallBack`来处理

- 高优先级的任务，比如动画相关的由`requestAnimationFrame`来处理

- `requestIdelCallBack`可以在多个空闲期调用空闲期回调，执行任务

- `requestIdelCallBack`方法提供`deadline`即任务执行限制时间以切分任务，避免长时间执行，阻塞`UI`渲染而导致掉帧。


### React Fiber的方式：

把一个耗时长的任务分成很多小片，每一个小片的运行时间很短，虽然总时间依然很长，但是在每个小片执行完之后，都给其他任务一个执行的机会，这样唯一的线程就不会被独占，其他任务依然有运行的机会。

`React Fiber`把更新过程碎片化，每执行完一段更新过程，就把控制权交还给`React`负责任务协调的模块，看看有没有其他紧急任务要做，如果没有就继续去更新，如果有紧急任务，那就去做紧急任务。

### Fiber调度的两个阶段：

1. `render/reconciliation 阶段`。此阶段中，依序遍历组件，通过 `diff` 算法，判断组件是否需要更新，给需要更新的组件加上 `tag`。遍历完之后，将所有带有 `tag` 的组件加到一个数组中。这个阶段的任务可以被打断。

:::tip
`render/reconciliation 阶段` 里面的所有生命周期函数都可能被执行多次，所以尽量保证状态不变
- getDerivedStateFromProps
- shouldComponentUpdate
- componentWillUpdate
:::

2. `Commit 阶段`。根据在 `Reconcile` 阶段生成的数组，遍历更新 `DOM`，这个阶段需要一次性执行完。如果是在其他的渲染环境 -- `Native`，硬件，就会更新对应的元素。

:::tip
`Commit 阶段`不可以被打断
- componentDidMount
- componentDidUpdate
- compoenntWillunmount
:::

### Fiber任务的优先级

`Fiber` 对任务进行优先级划分。不是每来一个新任务，就要放弃现执行任务，转而执行新任务。只有当比现任务优先级高的任务来了，才需要放弃现任务的执行。

比如说，屏幕外元素的渲染和更新任务的优先级应该小于响应用户输入任务。若现在进行屏幕外组件状态更新，用户又在输入，浏览器就应该先执行响应用户输入任务。

### Fiber部分源码

与`Fiber`有关的所有代码位于`packages/react-reconciler`中，一个`Fiber`节点的详细定义如下：

```js
function FiberNode(
  tag: WorkTag,
  pendingProps: mixed,
  key: null | string,
  mode: TypeOfMode,
) {
  // Instance
  this.tag = tag; 
  this.key = key; 
  this.elementType = null; 
  this.type = null; 
  this.stateNode = null;
 
  // Fiber
  this.return = null; 
  this.child = null; 
  this.sibling = null; 
  this.index = 0; 
  this.ref = null; 
  this.pendingProps = pendingProps;
  this.memoizedProps = null; 
  this.updateQueue = null;
 
  // 重点
  this.memoizedState = null;
 
  this.contextDependencies = null; this.mode = mode;
 
  // Effects
  /** 细节略 **/
}
```

这个`key`用来存储在上次渲染过程中最终获得的节点的`state`，每次`render`之前，`React`会计算出当前组件最新的`state`然后赋值给组件，再执行`render`。————`类组件`和`使用useState的函数组件`均适用。

