# immer.js 实战讲解文档

- 2021.02.22

## 简介

[`Immer.js`](https://github.com/immerjs/immer)是 Mobx作者写的`Immutable`库,利用ES6的 proxy进行实现,巧妙的实现了Javascript不可变数据结构,使用上比`Immutable.js`方便了不少。

我们都知道在Javascript中变量类型可以分为 `基本类型` 和 `引用类型` 。

在`引用类型`的使用中,经常会产生一些无法意识到的副作用(比如在不想要改变原有数据结构的改变了原来的数据结构)。

## 数据处理问题

我们先看这么一个例子:

```js
let currentState = {
  p: {
    x: [2],
  },
}
```

以下操作都会修改到原有的数据

```js
// way1 直接修改
let o1 = currentState;
o1.p = 1; // currentState 被修改了
o1.p.x = 1; // currentState 被修改了


// way2 通过函数修改
function fn(o) {
  o.p1 = 1;
  return o;
};
fn(currentState); // currentState 被修改了

// way3 通过结构修改
let o3 = {
  ...currentState
};
o3.p.x = 1; // currentState 被修改了

// way4
let o4 = currentState;
o4.p.x.push(1); // currentState 被修改了
```

**如何解决上述产生的问题?**

1. 深度拷贝，但是深拷贝的成本较高，会影响性能；

2. 使用 `ImmutableJS`，跟 Immer 比起来，`ImmutableJS` 有两个较大的不足：

    - 需要使用者学习它的数据结构操作方式，没有 Immer 提供的使用原生对象的操作方式简单、易用；

    - 它的操作结果需要通过toJS方法才能得到原生对象，这使得在操作一个对象的时候，时刻要注意操作的是原生对象还是 ImmutableJS 的返回结果，稍不注意，就会产生意想不到的 bug。

## immer功能介绍

### 安装

```
npm i --save immer

yarn add immer

```

### 解决方案

- 处理way1、way3

```js
import produce from 'immer';
let o1 = produce(currentState, draft => {
  draft.p.x = 1;
})
```

- 处理way2

```js
import produce from 'immer';
function fn(o) {
  return produce(o, draft => {
    draft.p1 = 1;
  })
};

fn(currentState);
```

- 处理way4

```js
import produce from 'immer';
let o4 = produce(currentState, draft => {
  draft.p.x.push(1);
})
```

## 概念说明

Immer 涉及概念不多，在此将涉及到的概念先行罗列出来:

- **currentState**

    被操作对象的最初状态。

- **draftState**

    根据 `currentState` 生成的草稿(副本)，对 `draftState` 所做的任何修改都将被记录并用于生成 `nextState` 。**在此过程中，`currentState` 将不受影响**。

- **nextState**

    根据 draftState 生成的最终状态。

- **produce 生产**

    用来生成 nextState 或 producer 的函数。

- **roducer 生产者**

    通过 produce 生成，用来生产 nextState ，每次执行相同的操作。

- **recipe 生产机器**

    用来操作 draftState 的函数。

## API使用说明

### produce

```js
import produce from 'immer';
// or
import { produce } from 'immer';
```

> produce(currentState, recipe: (draftState) => void | draftState, ?PatchListener): nextState

```js
//eg1
let nextState = produce(currentState, (draft) => {

})

currentState === nextState; // true

// eg2
let currentState = {
  a: [],
  p: {
    x: 1
  }
}

let nextState = produce(currentState, (draft) => {
  draft.a.push(2);
})

currentState.a === nextState.a; // false
currentState.p === nextState.p; // true
```

**自动冻结功能**

Immer 还在内部做了一件很巧妙的事情，那就是通过 produce 生成的 nextState 是被冻结（freeze）的，（Immer 内部使用`Object.freeze`方法，只冻结 nextState 跟 currentState 相比修改的部分），这样，当直接修改 nextState 时，将会报错。这使得 nextState 成为了真正的不可变数据。

```js
let nextState = produce(currentState, (draft) => {
  draft.p.x.push(2);
})

currentState === nextState; // true
```

> produce(recipe: (draftState) => void | draftState, ?PatchListener)(currentState): nextState

```js
let producer = produce((draft) => {
  draft.x = 2
});
let nextState = producer(currentState);
```

### recipe的返回值

recipe 是否有返回值，nextState 的生成过程是不同的：

- recipe 没有返回值时：nextState 是根据 recipe 函数内的 draftState 生成的；

- recipe 有返回值时：nextState 是根据 recipe 函数的返回值生成的；

```js
let nextState = produce(
  currentState, 
  (draftState) => {
    return {
      x: 2
    }
  }
)
```

此时，nextState 不再是通过 draftState 生成的了，而是通过 recipe 的返回值生成的。

### recipe中的this

recipe 函数内部的this指向 draftState ，也就是修改this与修改 recipe 的参数 draftState ，效果是一样的。

:::warning
注意：此处的 recipe 函数不能是箭头函数，如果是箭头函数，this就无法指向 draftState 了。
:::

```js
produce(currentState, function(draft){
  // 此处，this 指向 draftState
  draft === this; // true
})
```

### patch补丁功能

使用patch可以方便的进行代码的调整和跟踪,追踪recipe 内的做的每次修改。

```ts
interface Patch {
  op: "replace" | "remove" | "add" // 一次更改的动作类型
  path: (string | number)[] // 此属性指从树根到被更改树杈的路径
  value?: any // op为 replace、add 时，才有此属性，表示新的赋值
}
```

```js
produce(
  currentState, 
  recipe,
  // 通过 patchListener 函数，暴露正向和反向的补丁数组
  patchListener: (patches: Patch[], inversePatches: Patch[]) => void
)

applyPatches(currentState, changes: (patches | inversePatches)[]): nextState
```

```js
import produce, { applyPatches } from "immer"

let state = {
  x: 1
}

let replaces = [];
let inverseReplaces = [];

state = produce(
  state,
  draft => {
    draft.x = 2;
    draft.y = 2;
  },
  (patches, inversePatches) => {
    replaces = patches.filter(patch => patch.op === 'replace');
    inverseReplaces = inversePatches.filter(patch => patch.op === 'replace');
  }
)

state = produce(state, draft => {
  draft.x = 3;
})
console.log('state1', state); // { x: 3, y: 2 }

state = applyPatches(state, replaces);
console.log('state2', state); // { x: 2, y: 2 }

state = produce(state, draft => {
  draft.x = 4;
})
console.log('state3', state); // { x: 4, y: 2 }

state = applyPatches(state, inverseReplaces);
console.log('state4', state); // { x: 1, y: 2 }
```

**patches数据如下：**

```js
[
  {
    op: "replace",
    path: ["x"],
    value: 2
  },
  {
    op: "add",
    path: ["y"],
    value: 2
  },
]
```

**inversePatches数据如下：**

```js
[
  {
    op: "replace",
    path: ["x"],
    value: 1
  },
  {
    op: "remove",
    path: ["y"],
  },
]
```
`patchListener`内部对数据操作做了记录，并分别存储为正向操作记录和反向操作记录，供我们使用。

## 使用immer优化react代码

首先定义一个state对象，后面的例子使用到变量state或访问this.state时，如无特殊声明，都是指这个state对象

```js
state = {
  members: [
    {
      name: 'ronffy',
      age: 30
    }
  ]
}
```

### Q: 如何给members中的第一个成员年龄加上一岁?

```js
// 方式一
const { members } = this.state;
this.setState({
  members: [
    {
      ...members[0],
      age: members[0].age + 1,
    },
    ...members.slice(1),
  ]
})

// 方式二
this.setState(state => {
  const { members } = state;
  return {
    members: [
      {
        ...members[0],
        age: members[0].age + 1,
      },
      ...members.slice(1)
    ]
  }
})

// 方式三
const { members } = this.state;
const newMembers = [...members];
newMembers[0].age += 1;

this.setState({
    members: newMembers
})

// 使用immer更新state
import produce from "immer";

this.setState(produce(draft => {
  draft.members[0].age++;
}))
```

### 为什么需要在react中使用immer?

在探讨这个话题之前,我们先再次了解下什么是不可变数据。

不可变数据指的就是当你修改一个数据的时候,这个数据会给你返回一个新的引用,而它自己的引用保持不变,有点像是经常用到的数组的map方法：

```js
const arr1 = [1, 2, 3];
const arr2 = arr1.map(item => item * 10);

console.log(arr1 === arr2)
// false
```

通过这种方式每次修改数据，新返回的数据就和原来不相等了。

:::tip
如果数据变更，节点类型不相同的时候会怎样呢？React 的做法非常简单粗暴，直接将 原 VDOM 树上该节点以及该节点下所有的后代节点 全部删除，然后替换为新 VDOM 树上同一位置的节点，当然这个节点的后代节点也全都跟着过来了。
:::

这样的话非常浪费性能，父组件数据一变化，子组件全部都移除，再换新的，所以才有了shouldComponentUpdate这个生命周期,如果返回false的话子组件就不会更新，但是每次在这个函数里面写对比会很麻烦，所以有了PureComponent和Memo，但是只提供了`浅比较`，所以这时候不可变数据就派上用场了，每次修改数据都和原数据不相等的话，就可以精确的控制更新。

在Hooks中，我们还可以使用 `use-immer`来替代你的useState。

```js
yarn add immer use-immer

import React from "react";
import { useImmer } from "use-immer";


export default function () {
  const [person, setPerson] = useImmer({
    name: "Sally",
    salary: '3000'
  });

  function setName(name) {
    setPerson(draft => {
      draft.name = name;
    });
  }

  function becomeRicher() {
    setPerson(draft => {
      draft.salary += '$￥';
    });
  }

  return (
    <div className="App">
      <h1>
        {person.name} ({person.salary})
      </h1>
      <input
        onChange={e => {
          setName(e.target.value);
        }}
        value={person.name}
      />
      <br />
      <button onClick={becomeRicher}>变富</button>
    </div>
  );
}
```

useImmer的用法和useState十分相似，在保持住了简洁性的同时还具备了immutable的数据结构，十分便捷。

use-immer对useReducer进行了加强封装，同样也几乎没什么学习成本:

```js
import React from "react";
import { useImmerReducer } from "use-immer";

const initialState = { salary: 0 };

function reducer(draft, action) {
  switch (action.type) {
    case "reset":
      return initialState;
    case "increment":
      return void draft.salary++;
    case "decrement":
      return void draft.salary--;
  }
}

export default function () {
  const [state, dispatch] = useImmerReducer(reducer, initialState);
  return (
    <>
      期待工资: {state.salary}K
      <button onClick={() => dispatch({ type: "increment" })}>+</button>
      <button onClick={() => dispatch({ type: "decrement" })}>-</button>
      <button onClick={() => dispatch({ type: "reset" })}>重置</button>
    </>
  );
}
```




