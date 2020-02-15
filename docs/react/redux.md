# Rudex 与 React-Redux

这个章节我们旨在达到3个目的:

1. 理解`redux`的设计思路及实现原理
2. 理解`react-redux`的设计思路及实现原理
3. 理解`redux中间件`的设计思路及实现原理


## redux的实现

Q：**为什么需要Redux? Redux帮助我们解决了什么问题？**

A：`React`是一个组件化开发的UI库，组件之间存在着大量的通信，有的时候这个通信跨域多个组件，或者多个组件之间共享同一套数据，简单的父子组件之间传值不能满足我们的需求。自然而然的我们需要有一个地方存取和操作这些公共状态。而`Redux`就为我们提供了一种管理公共状态的方案。

Q: **如何管理公共状态?**

A:既然是公共状态，那么我们把公共状态提取出来就好了。我们创建一个`store.js`文件，然后直接在里边存放公共的`state`，其他组件只要引入这个`store`就可以存取公共状态了。

```js
const state = {
    count: 0
}
```

这是最简单的store设计，当然这样做存在两个比较大的缺点:

**1. 容易误操作**

比如有人不小心把`store`清空了，或者误修改了其他组件的数据，那显然不太安全，出错了也很难排查。因此我们需要有条件的操作`store`，防止直接修改`store`内部存取的数据。

**2. 可读性比较差**

js是一门极其依赖语义化的语言，试想如果在代码中不经注释直接修改了公共的`state`,在多人维护的场景下，为了搞清楚`state`的含义，还要翻看多处的代码，所以最好给每个操作都起个名字。

Q: **如何根据上述情况重新设计store？**

A：根据上面的分析，我们希望公共状态既能被全局访问到，又是私有的不能被直接修改。这一点刚好可以使用`闭包`来实现。我们要存取状态，那么又涉及到`getter`和`setter`,当状态发生变化的时候，通知组件状态发生了变更。正好对应`redux`的三个API:`getState`、`dispatch`、`subscribe`。

大致的`store`轮廓:

```js
export const store = () =>{
    let initialState = {}
    function getState() {}
    function dispatch() {}
    function subscribe() {}
    return {
        getState,
        dispatch,
        subscribe
    }
}
```

Q: **`getState()函数的实现?`**

A: `getState()实现非常简单`，只需要返回`store`的当前状态值即可。

```js
export const createStore = () =>{
    let currentState = {} // 公共状态
    function getState(){  // getter
        return currentState
    }
    function dispatch() {}
    function subscribe() {}
    return {
        getState,
        dispatch,
        subscribe
    }
}

```


Q: **`dispatch()函数的实现?`**

A: `dispatch()函数`的实现，我们的目标是有条件、具名的修改`store`的数据。在使用`dispatch`的时候，我们会给`dispatch()`传入一个`action`对象，这个对象包括我们要修改的`state`以及这个操作的名字`actionType`，根据`type`的不同，`store`会修改对应的`state`。

```js
export const createStore = () =>{
    let currentState = {}
    function getState(){
        return currentState
    }
    function dispatch(action){
        switch(action.type){
            case 'add':
                currentState = {
                    ...state,
                    count: currentState.count + 1
                }
                break;
            default:
                break;
        }
    }
    function subscribe() {}
    return {
        getState,
        dispatch,
        subscribe
    }
}
```
我们把对`actionType`的判断写在`dispatch`中显得臃肿，也很笨拙我们把修改state的规则抽离出来到一个`reducer`中。

Q: **`reducer()函数的实现?`**

A: `reducer`的目的是根据`action`对象的`type`来更新状态。

```js
// store.js
import { reducer } from './reducer';
export const createStore = () =>{
    let currentState = {}
    function getState(){
        return currentState
    }
    function dispatch(action){
        currentState = reducer(currentState, action)
    }
    function subscribe() {}
    dispatch({ type: '@REDUX_INIT' });// 初始化store数据
    return {
        getState,
        dispatch,
        subscribe
    }
}

// reducer.js

const initialState = {
    count: 0
}

export function reducer(state = initialState, action){
    switch(action.type){
        case 'add':
            return {
                ...state,
                count:state.count+1
            }
        case 'substract':
            return {
                 ...state,
                count:state.count-1
            }
        default:
            return initialState
    }
}

```

Q: `subscribe()函数`的实现

A: 尽管我们已经能够存取公共的`state`,但`state`的变化并不会直接引起视图的更新，我们需要监听`store`的变化，这里我们应用一个设计模式————观察者模式，观察者模式被广泛应用于监听事件实现。

**观察者模式的简单实现**

```js

class Observer {
    constructor(fn){
        this.update = fn
    }
}

class Subject{
    constructor(){
        this.observers = [];
    }
    addObserver(observer){
        this.observers.push(observer)
    }
    notify(){
        this.observers.forEach(observer=>observer.update())
    }
}

const subject = new Subject()
const update = () => console.log('被观察者发出通知')

const obj1 = new Observer(update)
const obj2 = new Observer(update)

subject.addObserver(obj1)
subject.addObserver(obj2)
subject.notify()
```

`subscribe()`函数的实现就类似上述，每次`dispatch`的时候都进行广播。

```js
import { reducer } from './reducer';
export const createStore = () =>{
    let currentState = {}
    let observers = []
    function getState(){
        return currentState
    }
    function dispatch(action){
        currentState = reducer(currentState, action)
        observers.forEach(fn=> fn())
    }
    function subscribe(fn) {
        observers.push(fn)
    }
    dispatch({ type: '@REDUX_INIT' });// 初始化store数据
    return {
        getState,
        dispatch,
        subscribe
    }
}
```

到这里一个简单的`redux`就已经完成了，但是我们在使用`store`的时候，需要在每个组件中引入`store`，然后`getState`，然后`dispatch`，还有`subscribe`，代码比较冗余，我们需要合并一些重复的操作，而其中一个解决方案就是`react-redux`。

## react-redux的实现

上文实现的redux在一个组件如果要从store中存取公共状态的时候需要进行4步操作：

1. import 引入 store
2. getState获取状态
3. dispatch修改状态
4. subscribe订阅更新

步骤繁琐，代码相对冗余。`react-redux`提供了`Provider`和`connect`两个API,`Provider`将`store`放入了`this.context`中，省去了`import`这个步骤，`connect`将`getState`、`dispatch`合并进了`this.props`,并自动订阅更新，简化了另外三个步骤。


Q: **Provider的实现?**

A: `Provider`是一个组件，接收一个`store`并将其放入全局的`context`对象中。

```jsx
import React, { Component } from 'react';
import PropTypes from 'props-types';

export class Provider extends Component{
    // 需要声明静态属性childContextTypes来指定context对象的属性 固定写法
    static childContextTypes = {
        store: PropTypes.object
    }

    // 实现getChildContext方法，返回context对象 固定写法
    getChildContext(){
        return {
            store: this.store
        }
    }

    constructor(props, context){
        super(props, context)
        this.store = props.store
    }

    // 渲染被Provider包裹的组件
    render(){
        return this.props.children
    }
}
```

完成`Provider`之后，我们就能在组件中通过`this.context.store`这样的形式获取到`store`,不需要再单独的`import`。


Q: **connect()函数的实现?**

A: `connect(mapStateToProps, mapDispatchToProps)(App)`是一个高阶函数，接收一个组件然后返回一个新的组件。`connect`根据传入的`map`将`state`和`dispatch`方法挂载到组件的`props`上。

```jsx
export function connect(mapStateToProps, mapDispatchToProps){
    return function(Component){
        class Connect extends React.Component {
            componentDidMount(){
                // 从context中获取store并订阅更新
                this.context.store.subscribe(this.handleStoreChange.bind(this))
            }

            handleStoreChange(){
                // 触发更新
                this.forceUpdate()
                // 或者找出变化的状态然后setState进行更新
            }

            render(){
                <Component
                    {...this.props}
                    {...mapStateToProps(this.context.store.getState())}
                    {...mapDispatchToProps(this.context.store.dispatch)}
                />
            }
        }
        // 接收context的固定写法
        Connect.contextTypes = {
            store: PropsTypes.object
        }
        return Connect
    }
}

```

## redux Middleware实现

所谓中间件，我们理解为`拦截器`，用于对某些过程进行拦截和处理，且中间件能够串行使用。在`redux`中，我们中间件拦截的是`dispatch`提交到`reducer`这个过程，从而增加`dispatch`的功能。


Q: 如何来实现一个每次`dispatch`之后手动打印`store`的中间件？

A: 封装一个公用的dispatch方法。

```js
let next = store.dispatch
store.dispatch = function dispatchAndLog(action){
    console.log('prev state', store.getState())
    let result = next(action)
    console.log('next state', store.getState())
    return result
}
```

简单的替换确实可以达到上述的效果，但是假如我们需要其他的中间件，随着功能模块的增多，代码量会迅速膨胀，以后这个中间件就没法维护了，我们希望不同的功能是独立的可插拔的模块。


### 模块化

```js
// 日志打印中间件
function patchStoreToAddLogger(store){
    let next = store.dispatch
    store.dispatch = function dispatchAndLog(action){
        console.log('prev state', store.getState())
        let result = next(action)
        console.log('next state', store.getState())
        return result
    }
}
// 错误监控中间件
function patchStoreToAddErrorCatch(store){
     let next = store.dispatch
     store.dispatch = function dispatchAndShowErrors(action){
         try{
             return next(action)
         }catch(err){
             console.err('捕获一个异常', err)
             throw err
         }
     }
}

patchStoreToAddLogger(store)
patchStoreToAddErrorCatch(store)
```

到这里我们基本实现了可组合，可插拔的中间件，但是代码可以进行优化。我们上述都是先获取`dispatch`然后在方法内部替换`dispatch`，这部分代码可以进行优化:我们不在方法内替换`dispatch`，而是返回一个新的`dispatch`，然后让循环来进行每一步的替换。

```js
function logger(store){
    let next = store.dispatch
    
    return function dispatchAndLog(action){
        let result = next(action)
        console.log('next state', store.getState())
        return result
    }
}

```

在`redux`中增加一个辅助方法`applyMiddleware`，用于添加中间件

```js
function applyMiddleware(store, middlewares){
    middlewares = [...middlewares] // 浅拷贝数组避免reverse改变原数组
    middlewares.reverse()
    // 循环替换dispatch
    middlewares.forEach(middleware=>store.dispatch = middleware(store))
}
```
这样的话我们就能使用下面的方式进行增加中间件了

```js
applyMiddleware(store, [ logger, errCatch])
```

这个函数功能上已经满足了我们的需求但是看起来还是不够`纯`，函数在函数体内修改了`store`自身的`dispatch`,产生了所谓的副作用，我们可以把`applyMiddleware`作为高阶函数,用于增强`store`而不是替换`dispatch`。

先对`createStore`进行一个小改造.

```js
// store.js
export const createStore = (reducer, heightener)=> {
    // heightener是一个高阶函数 用于增强createStore
    if(heightener){
        return heightener(createStore)(reducer)
    }
    let currentState = {}
    let observers = []
    function getState(){
        return currentState
    }
    function dispatch(action){
        currentState = reducer(currentState, action)
        observers.forEach(fn=>fn())
    }
    function subscribe(fn){
        observers.push(fn)
    }

    dispatch({ type: '@@INIT'})
    return {
        getState,
        dispatch,
        subscribe
    }
}

// 中间件进一步柯里化
const looger = store => next => action =>{
    console.log('log1')
    let result = next(action)
    return result
}

const thunk = store => next => action =>{
    console.log('thunk')
    const { dispatch, getState } = store
    return typeof action === 'function' ? action(store.dispatch) : next(action)
}

const logger2 = store => next => action =>{
    console.log('log2')
    let result = next(action)
    return result
}

// 改造applyMiddleware
const applyMiddleware = (...middlewares) => createStore => reducer =>{
    const store = createStore(reducer)
    let { getState, dispatch } = store
    const params = {
        getState,
        dispatch:action=>dispatch(action)
        // 这里不直接dispatch的原因是？
        // 直接dispatch会产生闭包。导致所有中间件共享一个dispatch
    }
    const middlewareArr = middlewares.map(middleware=>middleware(params))

    dispatch = compose(...middlewareArr)(dispatch)

    return{
        ...store,
        dispatch
    }
}
// compose对应了middlewares.reverse()
function compose(...fns){
    if(fns.length === 0 ) return arg=>arg
    if(fns.length === 1 ) return fns[0]
    return fns.reduce((res, cur)=>(...args)=>res(cur(...args)))
}
```


