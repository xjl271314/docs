# 虚拟 DOM

- 2021.05.31

> `虚拟DOM`是`React`中实现的对真实 DOM 的一种抽象的`Javascript`对象。`虚拟DOM`中只保留着一些构建真实 DOM 的映射等,没有`真实的DOM`复杂，真实 DOM 上存在着几百个属性与方法。

![虚拟DOM结构](https://img-blog.csdnimg.cn/20210531165515490.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

在原生的 `JavaScript` 程序中，我们直接对 `DOM` 进行创建和更改，而 `DOM` 元素通过我们监听的事件和我们的应用程序进行通讯。

而在 `React` 中首先会将我们的 `JSX` 代码转换成一个 `JavaScript` 对象，然后这个 `JavaScript` 对象再转换成真实 DOM。这个 `JavaScript 对象`就是所谓的`虚拟 DOM`。

比如我们常见的这段代码：

```html
<div class="container">
  <span>Hello World</span>
  <ul>
    <li>111</li>
    <li>222</li>
    <li>
      <span>哈哈</span>
      333
    </li>
  </ul>
</div>
```

在`React`可能存储为这样的`JS`代码：

```jsx
const VitrualDom = {
  type: "div",
  props: { class: "container" },
  children: [
    {
      type: "span",
      children: "Hello World",
    },
    {
      type: "ul",
      children: [
        { type: "li", children: "111" },
        { type: "li", children: "222" },
        {
          type: "li",
          children: [
            {
              type: "span",
              children: "哈哈",
            },
            "333",
          ],
        },
      ],
    },
  ],
};
```

当我们需要创建或更新元素时，`React` 首先会让这个 `Vitrual Dom` 对象进行创建和更改，然后再将 `Vitrual Dom` 对象渲染成真实 DOM；

当我们需要对 `DOM` 进行事件监听时，首先对 `Vitrual Dom` 进行事件监听，`Vitrual Dom` 会代理原生的 DOM 事件从而做出响应。

### 为什么需要虚拟 DOM?

有的人可能说`Vitrual Dom`是可以提升性能的，但是他的侧重点可能并不是他理解的这样。当我们直接去操作`DOM`更新的时候是比较消耗性能的，但是在 `React` 中虽然存的是`虚拟 DOM`，但是最终还是要去更新`真实 DOM` 的。

如果针对`首次渲染`来说，`React` 中需要花费的时间更长，它要去计算，消耗更多的内存。

`Vitrual Dom` 的优势在于 `React` 的 `Diff 算法` 和 `批处理策略`，`React` 在页面更新之前，提前计算好了如何进行更新和渲染 DOM。

实际上，这个计算过程我们在直接操作 DOM 时，也是可以自己判断和实现的，但是一定会耗费非常多的精力和时间，而且往往我们自己做的是不如 `React` 好的。所以，在这个过程中 `React` 帮助我们`提升了性能`。

所以，更合适的说法是 `Vitrual Dom` 帮助我们提高了开发效率，在重复渲染时它帮助我们计算如何更高效的更新，而不是它比 `DOM` 操作更快。

### 总结:

1. 前端优化中一个常用的秘诀就是尽可能减少 DOM 操作。一个是因为 DOM 结构比较深/长,频繁的变更 DOM 会造成浏览器不断的重排或者重绘。采用虚拟 DOM 的话，在变更中采用异步的方式,`patch` 中尽可能一次性的将差异更新到真实的 DOM 中，保证 DOM 更新的性能。

2. 手动更新 DOM 的话无法保证性能，而且如果在多人合作的项目中，代码 review 不严格的话可能产生性能较低的代码。

3. 采用虚拟 DOM 的话可以实现更好的跨平台，比如 SSR(Node 中并没有 DOM)。

### 虚拟 DOM 的生成？

> 思想是接收一些参数，返回一个 DOM 的抽象对象

```js
function vNode(type, key, data, children, text, ele) {
  const element = {
    _type: VNODE.TYPE,
    type,
    key,
    data,
    children,
    text,
    ele,
  };
  return element;
}
```

我们来看一下在 `render` 中编写完成 `jsx` 后是如何被渲染成`虚拟 DOM` 的。
