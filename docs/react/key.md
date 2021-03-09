# React中的Key

- 2021.03.09

在我们实际开发中经常会在控制台看到这么一个警告:

![key描述](https://img-blog.csdnimg.cn/20210309194203833.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

哦~我们遍历生成子组件的时候忘记给子组件加身份了,通常为了方便我们可能都会使用index索引作为组件的key值。但是这样不是一个好的解决方案。

因此抛出了疑问三连:

1. 为什么react组件中经常有一个key的概念？
2. 为什么不推荐使用index作为key?
3. 选择怎么样的key才是比较合适的?

## 为什么要使用key?

react官方文档中是这样描述key的：

> key 帮助 React 识别哪些元素改变了，比如被添加或删除。因此你应当给数组中的每一个元素赋予一个确定的标识。

在React中会首先根据key值进行比较来确认是如何去更新DOM,当然我们不传key也是可以的,默认会根据index索引去比较,但是这样会大大降低效率以及产生其他问题。

我们来看下面这个例子:

```html
<!-- 变更前 -->
<ul>
  <li>first</li>
  <li>second</li>
</ul>

<!-- 变更后 -->
<ul>
  <li>first</li>
  <li>second</li>
  <li>third</li>
</ul>
```

当我们不传入`key`时,默认使用了`index`作为索引,我们在`ul`的最后插入了一个新的`li`,根据`Diff`算法。React 会先匹配两个 `<li>first</li>` 对应的树，然后匹配第二个元素 `<li>second</li>` 对应的树，最后插入第三个元素的 `<li>third</li>` 树。此时仅在最后插入一个节点。

试想一下,假如我们是在首位插入了一个新的li。

```html
<!-- 变更前 -->
<ul>
  <li>first</li>
  <li>second</li>
</ul>

<!-- 变更后 -->
<ul>
  <li>third</li>
  <li>first</li>
  <li>second</li>
</ul>
```

当我们是在首部插入的时候,安卓diff算法,React会进行3次比较,然后会重新渲染第二个、第三个li,造成性能的浪费。

## 为什么不推荐使用index作为key?

还是上面的例子,假如我们使用index作为索引,我们的代码会变为:

```html
<!-- 变更前 -->
<ul>
  <li key="0">first</li>
  <li key="1">second</li>
</ul>

<!-- 变更后 -->
<ul>
  <li key="0">third</li>
  <li key="1">first</li>
  <li key="2">second</li>
</ul>
```

我们可以很直观的看到元素的内容没有改变但是key的索引发生了变化,React还是发生了3个li的重新渲染。

## 如何正确的选择key?

- **纯展示组件**

纯展示组件单纯的用于展示，不会发生其他变更，使用index或者其他任何不相同的值作为key是没有任何问题的，因为不会发生diff，就不会用到key。

- **推荐使用index的情况**

我们要实现分页渲染一个列表，每次点击翻页会重新渲染：

```html
第一页
<ul>
    <li key="0">张三</li>
    <li key="1">李四</li>
    <li key="2">王五</li>
</ul>
第二页
<ul>
    <li key="3">张三三</li>
    <li key="4">李四四</li>
    <li key="5">王五五</li>
</ul>
```

翻页后，三条记录的key和组件都发生了改变，因此三个子组件都会被卸载然后重新渲染。

下面我们使用index:

```html
第一页
<ul>
    <li key="0">张三</li>
    <li key="1">李四</li>
    <li key="2">王五</li>
</ul>
第二页
<ul>
    <li key="0">张三三</li>
    <li key="1">李四四</li>
    <li key="2">王五五</li>
</ul>
```

当我们翻页后，key不变，子组件值发生改变，组件并不会被卸载，只发生更新。

- **其他场景**

`key`就像我们的身份证id一样是一个唯一的编码,这里的key不推荐使用`math.random`等随机数进行生成。如果数据源不满足我们这样的需求，我们可以在渲染之前为数据源手动添加唯一id，而不是在渲染时添加。
