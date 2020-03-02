# 类组件与函数式组件

**How Are Function Components Different from Classes?**

- 函数组件和类组件的区别
- React如何区分这两种组件

当我们使用React自定义一个组件的时候，不必关心它是类组件还是函数式组件。

```js
// 是类还是函数 —— 无所谓
<Greeting />  // <p>Hello</p>
```

- 但如果 `Greeting` 是一个函数，`React` 需要调用它。

```js
// Greeting.js
function Greeting() {
  return <p>Hello</p>;
}
 
// React 内部
const result = Greeting(props); // <p>Hello</p>
```

- 但如果 `Greeting` 是一个`类`，`React` 需要先将其实例化，再调用刚才生成实例的 `render` 方法：

```js
// Greeting.js
class Greeting extends React.Component {
  render() {
    return <p>Hello</p>;
  }
}
 
// React 内部
const instance = new Greeting(props); // Greeting {}
const result = instance.render(); // <p>Hello</p>
```

:::tip
`React`通过以下方式来判断组件的类型：

```js
// React 内部
class Component {}
Component.prototype.isReactComponent = {};
 
// 检查方式
class Greeting extends React.Component {}
console.log(Greeting.prototype.isReactComponent); // {}
```
:::