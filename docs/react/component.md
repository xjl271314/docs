# 类组件与函数式组件

**How Are Function Components Different from Classes?**

- 函数组件和类组件的区别
- React 如何区分这两种组件

当我们使用 React 自定义一个组件的时候，不必关心它是类组件还是函数式组件。

```js
// 是类还是函数 —— 无所谓
<Greeting /> // <p>Hello</p>
```

- 但如果 `Greeting` 是一个函数，`React` 需要调用它。

```js
// Greeting.js
function Greeting() {
  return <p>Hello</p>;
}

// React 内部
const result = Greeting(props); // <p>Hello</p>
```

- 但如果 `Greeting` 是一个`类`，`React` 需要先将其实例化，再调用刚才生成实例的 `render` 方法：

```js
// Greeting.js
class Greeting extends React.Component {
  render() {
    return <p>Hello</p>;
  }
}

// React 内部
const instance = new Greeting(props); // Greeting {}
const result = instance.render(); // <p>Hello</p>
```

:::tip
`React`通过以下方式来判断组件的类型：

```js
// React 内部
class Component {}
Component.prototype.isReactComponent = {};

// 检查方式
class Greeting extends React.Component {}
console.log(Greeting.prototype.isReactComponent); // {}
```

:::

## 引申： 为什么在 React 中的自定义组件需要大写字母开头?

我们知道在 React 中创建组件有 2 种方式，一种是 jsx 另外一种是`React.createElement`。如果这块不清楚的话可以移步[深入 jsx](/react/jsx.html)章节。

这里再简单的回归下:

```jsx
// jsx
class Hello extends Component {
  render() {
    return <div>Hello World</div>;
  }
}
// React.createElement
class Hello extends Component {
  render() {
    return React.createElement("div", null, `Hello World`);
  }
}
```

最终的代码都会被转化成 `React.createElement`的形式，只不过`Babel`帮助我们完成了自动转化。

因此，由于要通过 Babel 转化，而 Babel 在转化的时候会遵循下列的规则:

:::warning
`Babel`在编译时会判断 `JSX` 中组件的首字母。

- 当首字母为`小写`时，其被认定为`原生 DOM 标签`，`createElement` 的第一个变量被编译为`字符串`；

- 当首字母为`大写`时，其被认定为`自定义组件`，`createElement` 的第一个变量被编译为`对象`；
  :::

因此我们的自定义组件需要为大写。
