# Portal

> `Portal` 提供了一种将子节点渲染到存在于父组件以外的 `DOM` 节点的优秀的方案。

```js
ReactDOM.createPortal(child, container)
```

第一个参数（`child`）是任何可渲染的 `React` 子元素，例如一个元素，字符串或 `fragmen`t。第二个参数（`container`）是一个 DOM 元素。

一个 `portal` 的典型用例是当父组件有 `overflow: hidden` 或 `z-index` 样式时，但你需要子组件能够在视觉上“跳出”其容器。例如，对话框、悬浮卡以及提示框：

```jsx
// Portal
import { Component } from 'react'
import ReactDOM from 'react-dom'

export default class Portal extends Component {
  static defaultProps = {
    isBody: false
  }

  constructor(props) {
    super(props)
    this.el = document.createElement('div');
    this.container = props.container || document.body
  }

  componentDidMount() {
    this.container.appendChild(this.el);
  }

  componentWillUnmount() {
    this.container.removeChild(this.el);
  }

  render() {
    return ReactDOM.createPortal(
      this.props.children,
      this.props.isBody ? document.body : this.el
    )
  }
}
```
