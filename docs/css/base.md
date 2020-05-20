# 基础概念

## 流

> “流”又叫文档流，是`css`的一种基本定位和布局机制。

流是`html`的一种抽象概念，暗喻这种排列布局方式好像水流一样自然自动。

“流体布局”是`html`默认的布局机制，如你写的`html`不用`css`，默认自上而下（块级元素如`div`）从左到右（内联元素如`span`）堆砌的布局方式。

## 块级元素和内联元素

块级元素是指单独撑满一行的元素，如`div`、`ul`、`li`、`table`、`p`、`h1`等元素。这些元素的`display`值默认是`block`、`table`、`list-item`等。

内联元素又叫行内元素，指只占据它对应标签的边框所包含的空间的元素，这些元素如果父元素宽度足够则并排在一行显示的，如`span`、`a`、`em`、`i`、`img`、`td`等。这些元素的`display`值默认是`inline`、`inline-block`、`inline-table`、`table-cell`等。

## width: auto 和 height: auto

- 对于块级元素，`width: auto`的自动撑满一行。

- 对于内联元素，`width: auto`则呈现出包裹性，即由子元素的宽度决定。

无论内联元素还是块级元素，`height: auto`都是呈现包裹性，即高度由子级元素撑开。

但是父元素设置`height: auto`会导致子元素`height: 100%`百分比失效。

流体布局之下，块级元素的宽度`width: auto`是默认撑满父级元素的。这里的撑满并不同于`width: 100%`的固定宽度，而是像水一样能够根据`margin`不同而自适应的宽度。

css的属性非常有意思，正常流下，如果块级元素的`width`是个固定值，margin是auto，则margin会撑满剩下的空间；如果margin是固定值，width是auto，则width会撑满剩下的空间。这就是流体布局的根本所在。

## CSS权重和超越`!important`

| 权重 | 选择器
| ---- | :----|
10000 | !important
1000  | 内联样式  style="..."
100   | id选择器  #app
10    | 类、伪类、属性选择器 
1     | 标签、伪元素选择器  span  :after
0     | 通用选择器(*)、子选择器(>)、兄弟选择器(+)

在css中，`!important`的权重相当的高，但是由于宽高会被`max-width/min-width`覆盖，所以`!important`会失效。

```css
width: 100px!important;
min-width: 200px;
```
上面代码计算之后会被引擎解析成：

```css
width: 200px;
```

## 盒模型（盒尺寸）

- 2020.05.20

元素的内在盒子是由边界(`margin`)、边框(`border`)、填充(`padding`)、内容(`content`)组成的，这四个盒子由外到内构成了盒模型。

### IE盒模型

`box-sizing: border-box;`  此模式下，元素的宽度计算为`border+padding+content`的宽度总和。

![IE模型](https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1589986460727&di=5d20b22447fad64b9219bfb5f0e77222&imgtype=0&src=http%3A%2F%2Fimg.kanzhun.com%2Fimages%2Fseo%2Fmianshiti%2F20191125%2Ff59f64fc4e3e5f1224e394b0da6e55e1.jpg)

### W3C盒模型

默认的情况下我们的元素都是`box-sizing: content-box;` 此模式下，元素的宽度计算为`content`的宽度。

![W3C盒模型](https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1589986755446&di=0b0bbd7fedbfbdb2c7c54edc1d10590d&imgtype=0&src=http%3A%2F%2Fimg.kanzhun.com%2Fimages%2Fseo%2Fmianshiti%2F20191125%2F89fabca3f21067debb0b10b05184a957.jpg)

由于`content-box`在计算宽度的时候不包含`border`、`pading`很烦人，而且又是默认值，业内一般采用以下代码重置样式：

```css
:root, html, body {
  box-sizing: border-box;    
}
* {
  box-sizing: inherit;
}
```

## 垂直居中弹窗
```html
<div class="container">
  <div class="dialog">自适应弹出层</div>
</div>
<style>
.container{
  position: fixed;
  top: 0; right: 0; bottom: 0; left: 0;
  background-color: rgba(0, 0, 0, .15);
  text-align: center;
  font-size: 0;
  white-space: nowrap;
  overflow: auto;
}
.container:after{
  content: '';
  display: inline-block;
  height: 100%;
  vertical-align: middle;
}
.dialog{
  display: inline-block;
  width: 400px;
  height: 400px;
  vertical-align: middle;
  text-align: left;
  font-size: 14px;
  white-space: normal;
  background: white;
}
</style>
```

## `display: none`与`visibility: hidden`的区别

1. `display: none`的元素不占据任何空间，`visibility: hidden`的元素空间保留；

2. `display: none`会影响`CSS3`的`transition`过渡效果，`visibility: hidden`不会；

3. `display: none`隐藏产生重绘 ( `repaint` ) 和回流 ( `relfow` )，`visibility: hidden`只会触发重绘；

4. 株连性：`display: none`的节点和子孙节点元素全都不可见，`visibility: hidden`的节点的子孙节点元素可以设置 `visibility: visible`显示。(`visibility: hidden`属性值具有继承性，所以子孙元素默认继承了`hidden`而隐藏，但是当子孙元素重置为`visibility: visible`就不会被隐藏。)

## position属性值比较

- 2020.05.20

| 属性 | 描述 
| :--- | :---
| `fixed`| 固定定位。脱离文档流，相对于浏览器窗口是固定位置，即使窗口滚动也不会移动。
| `relative` | 相对定位。无论是否移动，元素仍然占据原来的空间，`top`，`left`等值有效。
| `absolute`| 绝对定位。相对于最近的已定位元素进行定位，如果没有父元素相对于`html`进行定位。
| `sticky` | 粘性定位。先按照普通文档流定位，然后相对于该元素在BFC和最近的块级祖先元素定位。元素表现为在跨域特定阀值前相对定位，之后固定定位。
| `static` | 默认值，没有定位。元素会忽略`top`，`left`等值。

## position 的值 relative 和 absolute 定位原点是？

- 2020.05.20


| 属性 | 描述 
| :--------- | :---
| `absolute` | 生成绝对定位的元素，相对于值不为static的第一个父元素的`paddingbox`进行定位，也可以理解为离自己这一级元素最近的一级`position`为`absolute`或者`relative`的父元素的`paddingbox`的左上角为原点的。
| `fixed` | 生成绝对定位的元素，相对于`浏览器窗口`进行定位。
| `relative` | 生成相对定位的元素，相对于`其元素本身所在正常位置`进行定位。
|  `static` | 默认值。没有定位，元素出现在正常的流中（忽略top,bottom,left,right,z-index声明）。
| `inherit` | 规定从父元素继承position属性的值。

## ::before 和:after 中双冒号和单冒号

- 2020.05.20

> `单冒号（:）`用于`CSS3伪类`，`双冒号（::）`用于`CSS3伪元素`。（伪元素由双冒号和伪元素名称组成）

双冒号是在当前规范中引入的，用于区分伪类和伪元素。不过浏览器需要同时支持旧的已经存在的伪元素写法，
比如`:first-line`、`:first-letter`、`:before`、`:after`等，而在CSS3中引入的伪元素则不允许再支持旧的单冒号的写法。

:::tip
1. 想让插入的内容出现在其它内容前，使用`::befor`e，否者，使用`::after`；

2. 在代码顺序上，`::after`生成的内容也比`::before`生成的内容靠后。

3. 如果按堆栈视角，`::after`生成的内容会在`::before`生成的内容之上。

伪类一般匹配的是元素的一些特殊状态，如`hover`、`disabled`等，而伪元素一般匹配的特殊的位置，比如`after`、`before`等。
:::

## CSS 中哪些属性可以继承?

- 2020.05.20

> 每个CSS属性定义的概述都指出了这个属性是默认继承的，还是默认不继承的。这决定了当你没有为元素的属性指定值时该如何计算值。当元素的一个继承属性没有指定值时，则取父元素的同属性的计算值。只有文档根元素取该属性的概述中给定的初始值（这里的意思应该是在该属性本身的定义中的默认值）。当元素的一个非继承属性（在Mozillacode里有时称之为resetproperty）没有指定值时，则取属性的初始值initialvalue（该值在该属性的概述里被指定）。

### 字体系列属性
font、font-family、font-weight、font-size、font-style、font-variant、font-stretch、font-size-adjust

### 文本系列属性
text-indent、text-align、text-shadow、line-height、word-spacing、letter-spacing、
text-transform、direction、color

### 表格布局属性
caption-sideborder-collapseempty-cells

### 列表属性
list-style-type、list-style-image、list-style-position、list-style

### 光标属性
cursor

### 元素可见性
visibility

还有一些不常用的；speak，page，设置嵌套引用的引号类型quotes等属性