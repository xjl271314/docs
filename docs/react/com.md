# PureComponent与Component

> `React.PureComponent` 与 `React.Component` 几乎完全相同，但 `React.PureComponent` 通过`props`和`state`的浅对比来实现 `shouldComponentUpate()`。

:::tip
如果定义了 `shouldComponentUpdate()`，无论组件是否是 `PureComponent`，它都会执行`shouldComponentUpdate`结果来判断是否 `update`。

如果组件未实现 `shouldComponentUpdate()` ，则会判断该组件是否是 `PureComponent`，如果是的话，会对新旧 `props`、`state `进行 `shallowEqual` 比较，一旦新旧不一致，会触发 `update`。

:::

### 浅对比(shallowEqual):

通过遍历对象上的键执行相等性，并在任何键具有参数之间不严格相等的值时返回`false`。 当所有键的值`严格相等`时返回`true`。

```js
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @providesModule shallowEqual
 * @typechecks
 * @flow
 */

/*eslint-disable no-self-compare */

'use strict';

const hasOwnProperty = Object.prototype.hasOwnProperty;

/**
 * inlined Object.is polyfill to avoid requiring consumers ship their own
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
 */
function is(x: mixed, y: mixed): boolean {
  // SameValue algorithm
  if (x === y) { // Steps 1-5, 7-10
    // Steps 6.b-6.e: +0 != -0
    // Added the nonzero y check to make Flow happy, but it is redundant
    return x !== 0 || y !== 0 || 1 / x === 1 / y;
  } else {
    // Step 6.a: NaN == NaN
    return x !== x && y !== y;
  }
}

/**
 * Performs equality by iterating through keys on an object and returning false
 * when any key has values which are not strictly equal between the arguments.
 * Returns true when the values of all keys are strictly equal.
 */
function shallowEqual(objA: mixed, objB: mixed): boolean {
  if (is(objA, objB)) {
    return true;
  }

  if (typeof objA !== 'object' || objA === null ||
      typeof objB !== 'object' || objB === null) {
    return false;
  }

  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) {
    return false;
  }

  // Test for A's keys different from B.
  for (let i = 0; i < keysA.length; i++) {
    if (
      !hasOwnProperty.call(objB, keysA[i]) ||
      !is(objA[keysA[i]], objB[keysA[i]])
    ) {
      return false;
    }
  }

  return true;
}

module.exports = shallowEqual;
```

:::warning
在`PureComponent`中，如果包含比较复杂的数据结构，可能会因深层的数据不一致而产生错误的否定判断，导致界面得不到更新。可以使用`Immutable.js`来避免这种问题。

在`PureComponent`中不要自己去重写`shouldComponentUpdate`生命周期，`React`会报一个错误给我们。
:::
