# 从React切换到Vue

React和Vue都是前端框架里面比较流行的两个体系,本文中重点介绍两者的差异部分，帮助你快速入门 Vue 并立刻提高生产力。

### `React` 和 `Vue` 之间的区别？

- 两者都是用于创建 UI 的 JavaScript 库。

- 它们都快速而轻巧,且社区生态比较强大。

- 两者都具有基于组件的架构。

- 两者都使用一个虚拟 DOM。

- 两者都可以放入单个 HTML 文件中，也可以用作更复杂的 Webpack 设置中的一个模块。

- 两者都有独立的，但常用的路由和状态管理库及周边生态。

:::tip
它们最大的区别是 Vue 通常使用一个 HTML 模板文件，而 React 完全使用 JavaScript。Vue 还具有 可变的状态，以及用于重新渲染的一套自动化系统，称为“反应性”。
:::

###  组件

在 `Vue.js` 中可以使用 `API`方法`.component` 声明组件，该方法接受一个 `id` 和一个定义对象这两个参数。

```js
Vue.component('my-component', {
  // Props
  props: [ 'myprop' ],
  // Local state
  data() {
    return {
      firstName: 'John',
      lastName: 'Smith'
    }
  },
  // Computed property
  computed: {
    fullName() {
      return this.firstName + ' ' + this.lastName;
    }
  },
  // Template
  template: `
    <div>
      <p>Vue components typically have string templates.</p>
      <p>Here's some local state: {{ firstName }}</p>
      <p>Here's a computed value: {{ fullName }}</p>
      <p>Here's a prop passed down from the parent: {{ myprop }}</p>
    </div>
  `,
  // Lifecycle hook
  created() {
    setTimeout(() => {
      this.message = 'Goodbye World'
    }, 2000);
  }
});

```

###   模板  

你会注意到该组件具有一个 `template` 属性，该属性是 `HTML` 标记的一个字符串。`Vue` 库包含一个编译器，该编译器在运行时将一个模板字符串转换为一个 `render` 函数。这些渲染函数由虚拟 `DOM` 使用。

### 生命周期 Hooks

Vue 中的组件也有与 React 组件类似的生命周期方法。例如，当组件状态就绪，而组件还没有挂载到页面之前，将触发 `created` 这个 hook。

这里两者的一大区别是：`React` 中的 `shouldComponentUpdate` 在 `Vue` 里没有等效存在。由于 `Vue` 是基于反应系统的，所以这里不需要它。

### 重渲染 

`Vue` 的一个初始化步骤是遍历所有数据属性并将它们转换为 `getters` 和 `setters`。看看下面的截图，这里显示了 `message` 数据属性是怎样添加 `get` 和 `set` 函数的：

![在这里插入图片描述](https://img-blog.csdnimg.cn/20200227135523139.png)

`Vue` 添加了这些 `getter` 和 `setter` 后，就能在访问或修改属性时启用依赖项跟踪和更改通知。


### 可变状态

要更改 `Vue` 中组件的状态，你不需要一个 `setState` 方法，只需进行赋值操作即可：

```js
// React
this.setState({ message: 'Hello World' });
// Vue
this.message = 'Hello World';
```

当 `message` 的值因突变而更改时，将触发其 `setter`。`set` 方法将设置新值，此外还将执行第二项任务，告诉 `Vue` 某个值已更改，并且页面中依赖该值的部分都可能需要重渲染。

如果将 `message` 作为一个 `prop` 传递给任何子组件，则 `Vue` 就知道它们依赖这个 `prop`，并且它们也会自动重渲染。这就是为什么在 `Vue` 组件上不需要 `shouldComponentUpdate` 方法的原因。

###  主模板 

谈到主模板文件，Vue 更像 Angular 一些。与 React 一样，Vue 需要挂载在页面中的某个位置：

```js
<body>
  <div id="root"></div>
</body>
// React
ReactDOM.render('...', document.getElementById('root'));
// Vue
new Vue({
  el: '#root'
});
```
但是与 `React` 不同，你可以继续添加到这个主 `index.html` 上，因为它是你的根组件的模板。

```js
<div id="root">
  <div>You can add more markup to index.html</div>
  <my-component v-bind:myprop="myval"></my-component>
</div>
```

还有一种方法是使用 `x-template` 或 `inline-template` 之类的 `HTML` 功能在 `index.html` 中定义子组件模板。但这并不是最佳实践，因为它会将模板与其他组件定义区隔开来。


###  指令    

`Vue` 允许你通过“指令”使用逻辑增强模板。这些指令是带有 `v-` 前缀的特殊 `HTML `属性，例如 `v-if` 用于条件渲染，`v-bind` 将一个表达式绑定到一个常规 `HTML` 属性上。

```js
new Vue({
  el: '#app',
  data: {
    mybool: true,
    myval: 'Hello World'
  }
});
<div id="app">
  <div v-if="mybool">This renders if mybool is truthy.</div>
  <my-component v-bind:myprop="myval"></my-component>
</div>
```

### 单文件组件

如果你乐意使用 Webpack 之类的工具向项目中添加构建步骤，则可以利用 Vue 的单文件组件（SFC）。这些文件具有.vue 扩展名，并将组件模板、JavaScript 配置和样式封装在一个文件中：

```js
<template>
  <div class="my-class">{{ message }}</div>
</template>
<script>
  export default {
    data() {
      message: 'Hello World'
    }
  }
</script>
<style>
  .my-class { font-weight: bold; }
</style>
```

有一个名为 `vue-loader` 的 `Webpack` 加载器，它负责处理 `SFC`。在构建过程中，模板将转换为一个渲染函数，因此这是在浏览器中使用精简的 `vue.runtime.js` 构建的完美用例。