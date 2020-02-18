# ref

`Ref` 转发是一个可选特性，其允许某些组件接收 `ref`，并将其向下传递（换句话说，“转发”它）给子组件。

`ref` 转发使用 `React.forwardRef方法`。

在下面的示例中，`FancyButton` 使用 `React.forwardRef` 来获取传递给它的 `ref`，然后转发到它渲染的 `DOM button`：

```js
const FancyButton = React.forwardRef((props, ref) => (
  <button ref={ref} className="FancyButton">
    {props.children}
  </button>
));

// 你可以直接获取 DOM button 的 ref：
const ref = React.createRef();
<FancyButton ref={ref}>Click me!</FancyButton>;
```

这样，使用 `FancyButton` 的组件可以获取底层 `DOM `节点 `button` 的 `ref` ，并在必要时访问，就像其直接使用 `DOM button`
 一样。

**以下是对上述示例发生情况的逐步解释：**

1. 我们通过调用 `React.createRef` 创建了一个 `React ref` 并将其赋值给 `ref` 变量。
2. 我们通过指定 `ref` 为 `JSX` 属性，将其向下传递给 `<FancyButton ref={ref}>`。
3. `React` 传递 `ref` 给 `forwardRef` 内函数 (props, ref) => ...，作为其第二个参数。
4. 我们向下转发该 `ref` 参数到 `<button ref={ref}>`，将其指定为 `JSX` 属性。
5. 当 `ref` 挂载完成，`ref.current` 将指向 `<button>` DOM 节点。

:::warning
第二个参数 `ref` 只在使用 `React.forwardRef` 定义组件时存在。常规函数和 `class` 组件不接收 `ref` 参数，且 `props` 中也不存在 `ref`。

`Ref` 转发不仅限于 DOM 组件，你也可以转发 `refs` 到 `class` 组件实例中。
:::

**创建ref的方式**

```js
import React, { useRef } from 'react';

// 使用React.createRef
const a = React.createRef(null);
a.current 

// 使用useRef 只能在hooks组件中使用
const b = useRef(null);
a.current 

// 使用ref字符串
<button  ref="btn" onClick={this.log}>点我绘图</button>
this.refs.btn 

// 使用ref对象
<button ref={n=>this.btn=n} onClick={this.log}>点我绘图</button>
this.btn 
```
