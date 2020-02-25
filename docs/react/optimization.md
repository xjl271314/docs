# 性能优化

在以下场景中，父组件和子组件通常会重新渲染：

1. 在同一组件或父组件中调用 `setState` 时。
2. 从父级收到的 `props` 的值发生变化。
3. 调用组件中的 `forceUpdate`。

### 1.使用纯组件

> 如果 `React` 组件为相同的状态和`props`渲染相同的输出，则可以将其视为`纯组件`。

对于像 `this` 的类组件来说，`React` 提供了 `PureComponent` 基类。扩展 `React.PureComponent` 类的类组件被视为纯组件。

它与普通组件是一样的，只是 `PureComponents` 负责 `shouldComponentUpdate` —— 它对状态和 `props` 数据进行浅层比较（`shallow comparison`）。

如果先前的状态和 `props` 数据与下一个 `props` 或状态相同，则组件不会重新渲染。

```js
// 父组件
import React, { Component, PureComponent } from 'react';
import Log from './log';
import User from './user';


export default class App extends Component{
    constructor(props){
        super(props)
        this.state = {
            name: "Jack"
        }
    }

    componentDidMount(){
        setTimeout(()=>{
            this.setState({
                name:"Jack"
            })
        }, 1000)
    }
    render(){
        console.log('App Render')
        const { name } = this.state
        return(
            <>
                <User name={name} />
                <Log />
            </>
        )
    }
}

// log.js
import React from 'react'

export default class Log extends React.PureComponent{
    render(){
        console.log('log render',new Date().getTime())
        return(
            <p>I am a log </p>
        )
    }
}

// user.js
import React from 'react'

export default class User extends React.Component{

    render(){
        console.log('User render',this.props.name)
        return(
            <p>my name is {this.props.name} </p>
        )
    }
}
/**
 * App Render
 * User render Jack
 * log render 1582542834610
 * 
 * App Render
 * User render Jack
 * 
 * log组件第二次不会重新渲染
```

### 2.使用 `React.memo` 优化函数式组件

`React.memo` 是一个高阶组件。

它很像 `PureComponent`，但 `PureComponent` 属于 `Component` 的类实现，而`memo`则用于创建`函数组件`。

这里与纯组件类似，如果输入 `props` 相同则跳过组件渲染，从而提升组件性能。

它会记忆上次某个输入 `prop`的执行输出并提升应用性能。即使在这些组件中比较也是浅层的。

你还可以为这个组件传递自定义比较逻辑。用户可以用自定义逻辑深度对比（deep comparison）对象。如果比较函数返回 `false` 则重新渲染组件，否则就不会重新渲染。

```jsx
// app.js
import React from 'react';
import User from './user'

class Index extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            name: "Jack"
        }
    }

    componentDidMount() {
        setTimeout(() => {
            this.setState({
                name: "Jack"
            })
        }, 1000)
    }
    render() {
        console.log('App Render')
        const { name } = this.state
        return (
            <>
                <User 
                    name={name} 
                    age={24}
                    designation="2222"
                />
            </>
        )
    }

}

export default Index;

// user.js
function CustomisedComponent(props) {
    return (
        <div>
            <b>User name: {props.name}</b>
            <b>User age: {props.age}</b>
            <b>User designation: {props.designation}</b>
        </div>
    )
}

export const memoComponent = React.memo(CustomisedComponent);

/**
 * App Render 
 * CustomisedComponent
 * 
 * App Render 
 * 如果不加memo会再次触发
 */

// 我们也可以自定义比较深度
function userComparator(previosProps, nextProps) {
    if(previosProps.user.name == nextProps.user.name ||
       previosProps.user.age == nextProps.user.age ||
       previosProps.user.designation == nextProps.user.designation) {
        return false
    }
    return true;
}
export const memoComponent = React.memo(CustomisedComponent, userComparator);
```

### 3.使用`shouldComponentUpdate`生命周期事件优化

这是在重新渲染组件之前触发的其中一个生命周期事件。

可以利用此事件来决定何时需要重新渲染组件。如果组件 `props` 更改或调用 `setState`，则此函数返回一个 `Boolean` 值。

这个函数将 `nextState` 和 `nextProps` 作为输入，并可将其与当前 `props`和状态做对比，以决定是否需要重新渲染。

比如说我想在网页上显示员工的详细资料。每位员工都包含多个属性，如姓名、年龄、牌号、薪水、当前经理、前任经理、奖金等。

我想只在网页上渲染所选员工的姓名和年龄。员工的牌号会在某时刻更新。由于员工牌号不在视图内，理想情况下视图是无需更新的。我们可以在组件中添加自定义逻辑，判断是否需要组件更新视图。

```jsx
import React from "react";

export default class ShouldComponentUpdateUsage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        name: "Mayank";
        age: 30,
        designation: "Architect";
        }
    }

    componentDidMount() {
        setTimeout(() => {
            this.setState({
                designation: "Senior Architect"
            });
        }, 1000)
    }

    shouldComponentUpdate(nextProps, nextState) {
        if(nextState.age != this.state.age || nextState.name != this.state.name) {
            return true;
        }
        return false;
    }

    render() {
        return (
        <div>
            <b>User Name:</b> {this.state.name}
            <b>User Age:</b> {this.state.age}
        </div>
        )
    }
}
```

这里即使组件中 `designation` 发生变化也不会影响应用的视图。

### 4. 懒加载组件

导入多个文件合并到一个文件中的过程叫打包，使应用不必导入大量外部文件。

所有主要组件和外部依赖项都合并为一个文件，通过网络传送出去以启动并运行 `Web` 应用。

这样可以节省大量网络调用，但这个文件会变得很大，消耗大量网络带宽。应用需要等待这个文件的加载和执行，所以传输延迟会带来严重的影响。

为了解决这个问题，我们引入`代码拆分`的概念。

```js
// 我们可以按需懒惰加载这些拆分出来的组件，增强应用的整体性能。
import React, { lazy, Suspense } from "react";

export default class CallingLazyComponents extends React.Component {
  render() {

    var ComponentToLazyLoad = null;

    if(this.props.name == "Mayank") {
      ComponentToLazyLoad = lazy(() => import("./mayankComponent"));
    } else if(this.props.name == "Anshul") {
      ComponentToLazyLoad = lazy(() => import("./anshulComponent"));
    }
    return (
        <div>
            <h1>This is the Base User: {this.state.name}</h1>
            <Suspense fallback={<div>Loading...</div>}>
                <ComponentToLazyLoad />
            </Suspense>
        </div>
    )
  }
}
```
:::tip
这个方法的好处

1. 主包体积变小，消耗的网络传输时间更少。
2. 动态单独加载的包比较小，可以迅速加载完成。
:::

我们可以分析应用来决定懒加载哪些组件，从而减少应用的初始加载时间。

### 5.使用React Fragments 避免额外标记

使用 `Fragments` 减少了包含的额外标记数量，这些标记只是为了满足在 `React` 组件中具有公共父级的要求。

使用`Fragments` 片段不会向组件引入任何额外标记，但它仍然为两个相邻标记提供父级，因此满足在组件顶级具有单个父级的条件。

```js
export default class NestedRoutingComponent extends React.Component {
    render() {
        return (
            <>
                <h1>This is the Header Component</h1>
                <h2>Welcome To Demo Page</h2>
            </>
        )
    }
}
```

上面的代码没有额外的标记，因此节省了渲染器渲染额外元素的工作量。

### 6.不要使用内联函数定义

如果我们使用内联函数，则每次调用`render`函数时都会创建一个新的函数实例。

当 `React` 进行虚拟 `DOM diffing` 时，它每次都会找到一个新的函数实例；因此在渲染阶段它会会绑定新函数并将旧实例扔给垃圾回收。

因此直接绑定内联函数就需要额外做垃圾回收和绑定到`DOM`的新函数的工作。

```js
import React from "react";

export default class InlineFunctionComponent extends React.Component {
  render() {
    return (
      <div>
        <h1>Welcome Guest</h1>
        <input 
            type="button" 
            onClick={(e) => { this.setState({inputValue: e.target.value}) }} 
            value="Click For Inline Function" 
        />
      </div>
    )
  }
}
```
上面的函数创建了内联函数。每次调用 `render` 函数时都会创建一个函数的新实例，`render` 函数会将该函数的新实例绑定到该按钮。

此外最后一个函数实例会被垃圾回收，大大增加了 `React` 应用的工作量。

所以不要用内联函数，而是在组件内部创建一个函数，并将事件绑定到该函数本身。这样每次调用 `render` 时就不会创建单独的函数实例了，参考组件如下。

```jsx
import React from "react";

export default class InlineFunctionComponent extends React.Component {

  setNewStateData = (event) => {
    this.setState({
      inputValue: e.target.value
    })
  }

  render() {
    return (
      <div>
        <h1>Welcome Guest</h1>
        <input 
            type="button" 
            onClick={this.setNewStateData} 
            value="Click For Inline Function" 
        />
      </div>
    )
  }
}
```

### 7. 在 `Constructor` 的早期绑定函数

当我们在 `React` 中创建函数时，我们需要使用 `bind` 关键字将函数绑定到当前上下文。

绑定可以在构造函数中完成，也可以在我们将函数绑定到 `DOM` 元素的位置上完成。

两者之间似乎没有太大差异，但性能表现是不一样的。


```jsx
import React from "react";

export default class DelayedBinding extends React.Component {
  constructor() {
    this.state = {
      name: "Mayank"
    }
    this.handleButtonClick = this.handleButtonClick.bind(this)
  }

  handleButtonClick() {
    alert("Button Clicked: " + this.state.name)
  }

  render() {
    return (
        <input 
            type="button" 
            value="Click" 
            onClick={this.handleButtonClick} 
        />
    )
  }
}
```

这将减少将函数绑定到当前上下文的开销，无需在每次渲染时重新创建函数，从而提高应用的性能。

### 8.尽量避免使用内联样式属性

在React中使用内联样式时浏览器需要花费更多时间来处理脚本和渲染，因为它必须映射传递给实际 `CSS` 属性的所有样式规则。


```jsx
import React from "react";

export default class InlineStyledComponents extends React.Component {
  render() {
    return (
      <>
        <b style={{"backgroundColor": "blue"}}>Welcome to Sample Page</b>
      </>
    )
  }
}
```
样式 `backgroundColor` 需要转换为等效的 `CSS` 样式属性，然后才应用样式。这样就需要额外的脚本处理和 JS 执行工作。

更好的办法是将 `CSS` 文件导入组件。

### 9.事件节流和防抖

### 10.使用唯一键迭代

当我们需要渲染项目列表时应该为项目添加一个键。

键可以用来识别已更改、添加或删除的项目。键为元素提供了稳定的标识。一个键应该对应列表中的唯一一个元素。

如果开发人员没有为元素提供键，则它将 `index` 作为默认键。

### 11.使用 CDN

这些 CDN 是可在你的应用中使用的外部资源。我们甚至可以创建私有 CDN 并托管我们的文件和资源。

使用 CDN 有以下好处：

- **不同的域名。** 浏览器限制了单个域名的并发连接数量，具体取决于浏览器设置。假设允许的并发连接数为 10。如果要从单个域名中检索 11 个资源，那么同时完成的只有 10 个，还有 1 个需要再等一会儿。CDN 托管在不同的域名 / 服务器上。因此资源文件可以分布在不同的域名中，提升了并发能力。

- **文件可能已被缓存。** 有很多网站使用这些 CDN，因此你尝试访问的资源很可能已在浏览器中缓存好了。这时应用将访问文件的已缓存版本，从而减少脚本和文件执行的网络调用和延迟，提升应用性能。

- **高容量基础设施。** 这些 CDN 由大公司托管，因此可用的基础设施非常庞大。他们的数据中心遍布全球。向 CDN 发出请求时，它们将通过最近的数据中心提供服务，从而减少延迟。这些公司会对服务器做负载平衡，以确保请求到达最近的服务器并减少网络延迟，提升应用性能。

### 12.用 CSS 动画代替 JavaScript 动画

### 13.在 Web 服务器上启用 gzip 压缩

压缩是节省网络带宽和加速应用的最简单方法。

我们可以把网络资源压缩到更小的尺寸。Gzip 是一种能够快速压缩和解压缩文件的数据压缩算法。

它可以压缩几乎所有类型的文件，例如图像、文本、JavaScript 文件、样式文件等。Gzip 减少了网页需要传输到客户端的数据量。

### 14. React 组件的服务端渲染

服务端渲染可以减少初始页面加载延迟。

我们可以让网页从服务端加载初始页面，而不是在客户端上渲染。这样对 SEO 非常有利。

服务端渲染是指第一个组件显示的内容是从服务器本身发送的，而不是在浏览器级别操作。之后的页面直接从客户端加载。

这样我们就能把初始内容放在服务端渲染，客户端只按需加载部分页面。

- 性能：初始页面内容和数据是从服务器本身加载的，因此我们不需要添加加载器和下拉列表，而是等待初始页面加载完毕后再加载初始组件。

- SEO 优化：爬虫在应用初始加载时查找页面内容。在客户端渲染时初始 Web 页面不包含所需的组件，这些组件需要等 React 脚本等文件加载完毕后才渲染出来。


