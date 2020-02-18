# 生命周期详解

> 2020.2.15

`React16.3`之后的生命周期主要包含三个阶段:

1. 组件加载阶段
2. 组件更新阶段
3. 组件卸载阶段


## 加载阶段

1. `constructor()`
> 加载的时候调用一次，可以初始化`state`,继承`props`等

2. `static getDerivedStateFromProps(props, state)`
> 组件每次被`rerender`的时候，包括在组件构建之后(虚拟`dom`之后，实际`dom`挂载之前)，每次获取新的`props`或`state`之后；每次接收新的`props`之后都会返回一个对象作为新的`state`，返回`null`则说明不需要更新`state`；配合`componentDidUpdate`，可以覆盖`componentWillReceiveProps`的所有用法。


3. `render()`
> react最重要的步骤，创建虚拟`dom`，进行`diff`算法，更新dom树都在此进行。

4. `componentDidMount()`
> 组件渲染之后调用，只调用一次。

## 更新阶段

1. `static getDerivedStateFromProps(props, state)`
> 组件每次被`rerender`的时候，包括在组件构建之后(虚拟`dom`之后，实际`dom`挂载之前)，每次获取新的`props`或`state`之后；每次接收新的`props`之后都会返回一个对象作为新的`state`，返回`null`则说明不需要更新`state`；配合`componentDidUpdate`，可以覆盖`componentWillReceiveProps`的所有用法。

2. `shouldComponentUpdate(nextProps, nextState)`
> 组件接收到新的props或者state时调用，return true就会更新dom（使用diff算法更新），return false能阻止更新（不调用render）。

3. `render()`
> react最重要的步骤，创建虚拟`dom`，进行`diff`算法，更新dom树都在此进行。

4. `getSnapshotBeforeUpdate(prevProps, prevState)`
> 触发时间: `update`发生的时候，在`render`之后，在组件dom渲染之前；返回一个值，作为`componentDidUpdate`的第三个参数；配合`componentDidUpdate`, 可以覆盖`componentWillUpdate`的所有用法

5. `componentDidUpdate()`
> 组件加载时不调用，组件更新完成后调用.

## 卸载阶段

1. `componentWillUnMount()`
> z组件卸载之后调用，只触发一次

## 错误处理

1. `static getDerivedStateFromError(error)`
> 此生命周期会在后代组件抛出错误后被调用。 它将抛出的错误作为参数，并返回一个值以更新 state

2. `componentDidCatch(error，info)`
> 任何一处的javascript报错会触发。


## 完整的生命周期图

![React生命周期](https://img-blog.csdnimg.cn/20200216121931416.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

