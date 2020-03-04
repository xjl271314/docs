# 虚拟DOM

> `虚拟DOM`是`React`中实现的对真实DOM的一种抽象的`Javascript`对象。`虚拟DOM`中只保留着一些构建真实DOM的映射等,没有`真实的DOM`复杂，真实DOM上存在着几百个属性与方法。

### 为什么需要虚拟DOM?

1. 前端优化中一个常用的秘诀就是尽可能减少DOM操作。一个是因为DOM结构比较深/长,频繁的变更DOM会造成浏览器不断的重排或者重绘。采用虚拟DOM的话，在变更中采用异步的方式,patch中尽可能一次性的将差异更新到真实的DOM中，保证DOM更新的性能。

2. 手动更新DOM的话无法保证性能，而且如果在多人合作的项目中，代码review不严格的话可能产生性能较低的代码。

3. 采用虚拟DOM的话可以实现更好的跨平台，比如SSR(Node中并没有DOM)。

### 虚拟DOM的生成？

> 思想是接收一些参数，返回一个DOM的抽象对象

```js
function vNode(type, key, data, children, text, ele){
    const element = {
        _type:VNODE.TYPE,
        type,key,data,children,text,ele
    }
    return element
}
```