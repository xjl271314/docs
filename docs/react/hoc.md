# 高阶组件(HOC)

> `高阶组件（HOC）`是 `React` 中用于复用组件逻辑的一种高级技巧。`HOC` 自身不是 `React API` 的一部分，它是一种基于 `React` 的组合特性而形成的设计模式。

高阶组件是一个函数，接收一个组件返回一个经过处理后的组件

```js
const EnhancedComponent = higherOrderComponent(WrappedComponent);
```

在`React`组件的构建过程中，常常有这样的场景，有一类功能需要被不同的组件公用，此时，就涉及抽象的话题，在不同设计理念下，有许多的抽象方法,但我们已经意识到 `mixins` 会产生更多麻烦,产生了高阶组件的解决方案。

## 属性代理
> 常用于增加原始组件， HOC 对传给 WrappedComponent 的 porps 进行操作。

**1. 操作props返回增强后的props**
```jsx
import React,{Component} from 'react';

const MyContainer = (WraooedComponent) => 
    constructor(props){
        super(props)
        this.newProps = {
            'name':'hoc'
        }
    }
    class extends Component {
        render(){
            return <WrappedComponent {...this.props} {...this.newProps}/>
        }
    }
```
**2. 抽象state**

常见的例子是实现非受控组件到受控组件的转变。

```jsx
function HOC(WrappedComponent){
    return class extends React.Component{
        constructor(props){
            super(props)
            this.state = {
                name:''
            }
        }
        this.onChange = this.onChange.bind(this);

        onChange=(event)=>{
            this.setState({
                name:event.target.value
            })
        }

        render(){
            const newProps = {
                name:{
                    value:this.state.name,
                    onChange:this.onChange
                }
            }

            return <WrappedComponent {...this.props} {...newProps} />
        }
    }
}
```
**3. 通过 `Refs` 访问到组件实例**

```jsx
function refsHOC(WrappedComponent) {
  return class RefsHOC extends React.Component {
    proc(wrappedComponentInstance) {
      wrappedComponentInstance.method()
    }
    
    render() {
      const props = Object.assign({}, this.props, {ref: this.proc.bind(this)})
      return <WrappedComponent {...props}/>
    }
  }
}
```
## 反向继承
> 比属性代理更加侵入组件，能够进行渲染劫持

最简单的反向继承
```jsx
function iiHOC(WrappedComponent) {
  return class Enhancer extends WrappedComponent {
    render() {
      return super.render()
    }
  }
}
```

**1. 渲染劫持(Render Highjacking)**

因为 `HOC` 控制了 `WrappedComponent` 的渲染输出，并且可以用它做各种各样的事情。



