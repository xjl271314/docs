# Vue中的scope样式穿透

- 2021.03.25

在`vue`文件中的`style`标签上，有一个特殊的属性：`scoped`。

当我们在文件内部的样式表属性中添加`scoped`的时候,它的CSS样式就只能作用于当前的组件,形成了样式的局部隔离,当前样式仅在此页面内生效不会影响到全局。


## scope穿透原理

```vue
<template>
    <div class="example">hello world</div>
</template>

<style lang="scss" scoped>
    .example {
        font-size: 32px;
        color: #333;
    }
</style>
```

当经过Vue编译之后,我们的样式文件被编译成了大致如下的样子:

```vue
<template>
    <div class="example">hello world</div>
</template>

<style lang="scss" scoped>
    .example[data-v-1234567a] {
        font-size: 32px;
        color: #333;
    }
</style>
```

实现的原理是利用`postCss`给组件中的所有dom添加了一个独一无二的动态属性,然后给CSS选择器额外添加一个对应的属性选择器来选择该组件中dom，这种做法使得样式只作用于含有该属性的组件内部dom。

## scoped穿透

大部分情况下我们并不需要进行scope穿透,组内内部管理自己的样式即可。但是当我们使用了第三方UI框架的时候,比如我现在需要去修改下`element-ui`内部样式,如果我们在style上加了`scoped`属性,这样无论我们怎么修改都不会生效,即使加了`!important`。

因为当我们加了`scoped`之后,比如我们组见都被加上了`[data-v-1234567a]`这个属性,而组件中其他的dom是没有这个属性的,因为无论我们怎么修改都不会产生作用。

## scoped穿透解决方案

1. 穿透scoped

:::tip
- stylus的样式穿透 使用`>>>`
- sass和less的样式穿透 使用`/deep/`
:::

```vue
<style scoped>
 外层 >>> 第三方组件 {
  样式
 }
  /* 使用以下这段无法修改table样式 */
 .el-table__header-wrapper {
    height: 20px;
  }
  /* 穿透之后可以顺利修改element-ui样式 */
 .el-contain-row /deep/ .el-table__header-wrapper {
    height: 20px;
  }
</style>
```

2. 使用两个样式表

我的做法比较推荐使用两个样式表,一个用于处理内部样式,一个用于覆盖样式。

```vue
<style>
/* 用于修改第三方库的样式 */
</style>
 
<style scoped>
/* 自己的组件内样式 */
</style>
```

3. 采用添加class

我们还可以通过在`外层dom`上添加唯一的`class`来区分不同组件。这种方法既实现了类似于`scoped`的效果，又方便修改各种第三方组件的样式，代码看起来也相对舒适。

```vue
<style>
.container {
 color: red;
 /* 其他所有样式都被包含在container中 */
}
</style>
<template>
 <div class="container">
 <!-- dom结构 -->
 </div>
</template>
```

## 慎用scoped

从原理已经能够了解到慎用`scoped`的原因，这里再作下总结:

**`scoped`可达到类似组件私有化、样式设置“作用域”的效果，实现原理是在设置scoped属性的组件上的所有标签添加一的data开头的属性，且在标签选择器的结尾加上和属性同样的字段，起到唯一性的作用，但是这样如果组件中也引用其他组建就会出现类似下面的问题：**

1. 父组件无`scoped`属性，子组件带有`scoped`，父组件是无法操作子组件的样式的，虽然我们可以在全局中通过该类标签的标签选择器设置样式，但会影响到其他组件。

2. 父组件有`scoped`属性，子组件无，父组件也无法设置子组件样式，因为父组件的所有标签都会带有`data-v-41234567a`唯一标志，但子组件不会带有这个唯一标志属性，与1同理，虽然我们可以在全局中通过该类标签的标签选择器设置样式，但会影响到其他组件。

3. 父子组件都有，同理也无法设置样式，更改起来增加代码量。

