# Portal

- 2021.04.12

> `Portal` 是React DoM提供的一种将子节点渲染到存在于父组件以外的 `DOM` 节点的优秀的方案。

```js
ReactDOM.createPortal(child, container)
```

第一个参数（`child`）是任何可渲染的 `React` 子元素，例如一个元素，字符串或 `fragment`。第二个参数（`container`）是一个 DOM 元素。

一个 `portal` 的典型用例是当父组件有 `overflow: hidden` 或 `z-index` 样式时，但你需要子组件能够在视觉上"跳出"其容器。例如，对话框、悬浮卡以及提示框：

```jsx
// Component Portal
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

// Hook Portal
const Portal = props => {
    // 这里也可以使用传入一个ref
    // const ref = useRef({}).current;
    const {
        parentNode = document.body,
        children
    } = props;

    return ReactDOM.createPortal(children, parentNode);
}
```

## 实际运用

例如,我书写了一个视频播放器SDK,在视频播放器的内部我书写了一个默认的状态层,在该状态层上加了默认的事件。但是在业务中,直播状态层是覆盖在播放器SDK的视图层之上的,出现异常的操作就无法点击。

这时候我们就可以使用`Portal`进行发射内部组件到指定的业务`container`上。

:::tip
我们可以在组件内部去处理判断是否给了`parentNode`没有的话相对组件内部定位,给了的话相对容器进行定位。
:::


