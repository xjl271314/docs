# 设计模式与最佳实践


## 优化你的JSX结构

从`react 16.2.0`版本开始，`React`允许我们`return`组件的时候使用一个数组或者使用`Fragement`或者空的`<>`标签。

```js
// 16.2.0 before
render(){
    return(
        <div>
            <Header />
            <Footer />
        </div>
    )
}

// 16.2.0 after
import { Fragment } from 'react'
render(){
    return(
        <Fragment>
            <Header />
            <Footer />
        </Fragment>
    )
}
// 或者
render(){
    return(
        // 等价于Fragement
        <>
            <Header />
            <Footer />
        </>
    )
}
// 或者
render(){
    return [
        // 使用数组的时候则需要提供一个key
        <Header key="header" />
        <Footer key="footer" />
    ]
}

```

