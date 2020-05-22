# 使用Redux Saga来管理副作用

- 2020.05.21

## 前言

在React状态管理的过程中,我们的action操作中常常会带一些异步的请求,比如数据请求，操作本地存储,打印日志或者出阿发其他Action等,这些操作统称为`副作用`。与React-Redux项目相关的副作用处理插件包括了比较常用的`redux-thunk`、`redux-saga`。

`redux-thunk`的使用比较简单，这里不做展开，它在处理复杂问题的时候代码很容易变得繁琐,可读性大大降低。这个时候就轮到今天的主角出场了, `Redux Saga`。

## 简述

> `redux-saga` 是一个用于管理 `Redux` 应用异步操作（`Side Effects`)的中间件（又称`异步 action`）。

`Redux Saga` 通过创建 `Sagas` 将所有的异步操作逻辑收集在一个地方集中处理，可以用来代替 `redux-thunk` 中间件。定义副作用逻辑用的是 `Generator`，在 `Generator` 内部通过 `yield` 不同的 `effect` 来声明副作用逻辑。

**这意味着应用的逻辑会存在两个地方：**

1. `Reducers` 负责处理 `action` 的 `state` 更新。

2. `Sagas` 负责协调那些复杂或异步的操作。

:::tip

`Sagas` 不同于 `Thunks`，`Thunks` 是在 `action` 被创建时调用，而 `Sagas` 只会在应用启动时调用（但初始启动的 `Sagas` 可能会动态调用其他 `Sagas`）。

:::

## 安装

```js
npm install --save redux-saga
// yarn add redux-saga
```

## API

### `createSagaMiddleware(...sagas)`

> 创建一个 Redux 中间件，将 Sagas 与 Redux Store 建立连接。

| 参数名 | 参数描述 |
| :---- | :---- |
| `sagas` | `Array<Function> - Generator` 函数列表

```jsx
import createSagaMiddleware from 'redux-saga';
import reducer from './path/to/reducer';
import sagas from './path/to/sagas';
export default function configureStore(initialState) {
  // 注意：redux@>=3.1.0 的版本才支持把 middleware 作为 createStore 方法的最后一个参数
  return createStore(
    reducer,
    initialState,
    applyMiddleware(/* other middleware, */createSagaMiddleware(...sagas))
  );
}
```

:::warning

- `sagas` 中的每个 `Generator` 函数被调用时，都会被传入 `Redux Store` 的 `getState` 方法作为第一个参数。

- `sagas` 中的每个函数都必须返回一个 `Generator 对象`。`middleware` 会迭代这个 `Generator` 并执行所有 `yield` 后的 `Effect`。

- 在第一次迭代里，`middleware` 会调用 `next()` 方法以取得下一个 `Effect`。然后 `middleware` 会通过 `Effects API` 来执行 `yield` 后的 `Effect`。与此同时，`Generator` 会暂停，直到 `Effect` 执行结束。当接收到执行的结果，`middleware` 在 `Generator` 里接着调用 `next(result)`，并将得到的结果作为参数传入。这个过程会一直重复，直到 `Generator` 正常或通过抛出一些错误结束。

- 如果执行引发了一个错误（像提到的那些 Effect 创建器），就会调用 `Generator` 的 `throw(error)` 方法来代替。如果定义了一个 `try/catch` 包裹当前的 `yield` 指令，那么 `catch` 区块将被底层 `Generator runtime` 调用。

:::

### `takeEvery(pattern, saga, ...args)`

> 每次发起一个 `action` 到 `Store`，并且这个 `action` 与 `pattern` 相匹配，那么 `takeEvery` 将会在后台启动一个新的 `saga` 任务。

| 参数名 | 参数类型 | 参数描述 |
| :---- | :---- | :---- |
| `pattern` | `String` | `Array | Function`
| `saga`| `Function` | `一个 Generator 函数`
| `args` | `Array<any>` | 将被传入启动的任务作为参数。takeEvery 会把当前的 action 放入参数列表（action 将作为 saga 的最后一个参数）

简单的说比如说我们给按钮添加了一个点击事件,点击按钮的时候去请求用户的信息,当使用takeEvery的时候,我们点击了一次，然后又立即点击了一次,这时会触发两个action,这两个action都符合条件,因此会生成两次请求，无论之前的请求是否完成。

```js
import { takeEvery } from `redux-saga`
function* fetchUser(action) {
  ...
}
function* watchFetchUser() {
  yield* takeEvery('USER_REQUESTED', fetchUser)
}
```

:::warning

`takeEvery` 是一个高阶 API，使用 `take` 和 `fork` 构建。下面演示了这个辅助函数是如何实现的：

```js
function* takeEvery(pattern, saga, ...args) {
  while(true) {
    const action = yield take(pattern)
    yield fork(saga, ...args.concat(action))
  }
}
```

`takeEvery` 不会对多个任务的响应返回进行排序，并且也无法保证任务将会按照启动的顺序结束。如果要对响应进行排序，可以关注以下的 `takeLatest`。
:::

### `takeLatest(pattern, saga, ...args)`

> 在发起的 `action` 与 `pattern` 匹配时派生指定的 `saga`。并且自动取消之前启动的所有 `saga` 任务（如果在执行中）。

| 参数名 | 参数类型 | 参数描述 |
| :---- | :---- | :---- |
| `pattern` | `String` | `Array | Function`
| `saga`| `Function` | `一个 Generator 函数`
| `args` | `Array<any>` | 将被传入启动的任务作为参数。takeLatest 会把当前的 action 放入参数列表（action 将作为 saga 的最后一个参数）

再拿上面的那个例子来说明,当我们点击按钮请求用户信息的时候,假设点击一次的时候上次的接口还在请求,又连续点了一次,takeLatest会取消上次的任务,采用最新的任务。

```js
import { takeLatest } from `redux-saga`
function* fetchUser(action) {
  ...
}
function* watchLastFetchUser() {
  yield* takeLatest('USER_REQUESTED', fetchUser)
}
```

:::warning

`takeLatest` 是一个高阶 API，使用 `take` 和 `fork` 构建。下面演示了这个辅助函数是如何实现的：

```js
function* takeLatest(pattern, saga, ...args) {
  let lastTask
  while(true) {
    const action = yield take(pattern)
    if(lastTask)
      yield cancel(lastTask) // 如果任务已经终止，取消就是空操作
    lastTask = yield fork(saga, ...args.concat(action))
  }
}
```

由于 `takeLatest` 取消了所有之前启动的未完成的任务，这样就可以保证：如果用户以极快的速度连续多次触发 `USER_REQUESTED` action，将会以最后的那个结束。

:::


## 示例

### 先看官网的一个简单示例:

假设我们有一个 UI 界面，在单击按钮时从远程服务器获取一些用户数据（为简单起见，我们只列出 action 触发代码）

```jsx
class UserComponent extends React.Component {
  ...
  onSomeButtonClicked() {
    const { userId, dispatch } = this.props
    dispatch({type: 'USER_FETCH_REQUESTED', payload: {userId}})
  }
  ...
}
```

这个组件发起一个普通对象格式的 action 到 Store。我们将创建一个 Saga 来监听所有的 `USER_FETCH_REQUESTED` action，并触发一个 API 调用以获取用户数据。

```js
// saga.js
import { takeEvery, takeLatest } from 'redux-saga'
import { call, put } from 'redux-saga/effects'
import Api from '...'
// workder Saga : 将在 USER_FETCH_REQUESTED action 被发起时调用
function* fetchUser(action) {
   try {
      const user = yield call(Api.fetchUser, action.payload.userId);
      yield put({type: "USER_FETCH_SUCCEEDED", user: user});
   } catch (e) {
      yield put({type: "USER_FETCH_FAILED", message: e.message});
   }
}
/*
  在每个 `USER_FETCH_REQUESTED` action 被发起时调用 fetchUser
  允许并发（译注：即同时处理多个相同的 action）
*/
function* mySaga() {
  yield* takeEvery("USER_FETCH_REQUESTED", fetchUser);
}
/*
  也可以使用 takeLatest
  不允许并发，发起一个 `USER_FETCH_REQUESTED` action 时，
  如果在这之前已经有一个 `USER_FETCH_REQUESTED` action 在处理中，
  那么处理中的 action 会被取消，只会执行当前的
*/
function* mySaga() {
  yield* takeLatest("USER_FETCH_REQUESTED", fetchUser);
}
```

为了能跑起 `Saga`，我们需要使用 `redux-saga` 中间件将 `Saga` 与 `Redux Store` 建立连接。

```js
// main.js
import { createStore, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'
import reducer from './reducers'
import mySaga from './sagas'
const sagaMiddleware = createSagaMiddleware(mySaga)
const store = createStore(
  reducer,
  applyMiddleware(sagaMiddleware)
)
// render the application
```