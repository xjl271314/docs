# 基础概念

## 流

“流”又叫文档流，是`css`的一种基本定位和布局机制。

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

元素的内在盒子是由`margin box`、`border box`、`padding box`、`content box`组成的，这四个盒子由外到内构成了盒模型。

IE模型：`box-sizing: border-box`  此模式下，元素的宽度计算为`border+padding+content`的宽度总和。

w3c标准模型）：`box-sizing: content-box` 此模式下，元素的宽度计算为`content`的宽度。

由于`content-box`在计算宽度的时候不包含`border` `pading`很烦人，而且又是默认值，业内一般采用以下代码重置样式：

```css
:root {
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

## BFC(块级格式化上下文)

> `BFC`是一个独立的渲染区域，只有`Block-level box`参与， 它规定了内部的`Block-level Box`如何布局，并且与这个区域外部毫不相干。`BFC` 就好像一个结界，结界里面的东西不能影响外面的布局，也就是说，BFC的子元素再翻江倒海，都不会影响外面的元素。 所以：

- BFC本身不会发生`margin`重叠。
- BFC可以彻底解决子元素浮动带来的的高度坍塌和文字环绕问题。

### BFC的创建方法
1. 根元素；
2. 浮动元素 (float不为none的元素)；
3. 绝对定位元素 (元素的position为absolute或fixed)；
4. inline-blocks(元素的 display: inline-block)；
5. 表格单元格(元素的display: table-cell，HTML表格单元格默认属性)；
6. overflow的值不为visible的元素；
7. 弹性盒 flex boxes (元素的display: flex或inline-flex)；

:::warning
BFC包含创建该上下文元素的所有子元素，但不包括创建了新BFC的子元素的内部元素。
:::

## `display: none`与`visibility: hidden`的区别

1. `display: none`的元素不占据任何空间，`visibility: hidden`的元素空间保留；

2. `display: none`会影响`CSS3`的`transition`过渡效果，`visibility: hidden`不会；

3. `display: none`隐藏产生重绘 ( `repaint` ) 和回流 ( `relfow` )，`visibility: hidden`只会触发重绘；

4. 株连性：`display: none`的节点和子孙节点元素全都不可见，`visibility: hidden`的节点的子孙节点元素可以设置 `visibility: visible`显示。(`visibility: hidden`属性值具有继承性，所以子孙元素默认继承了`hidden`而隐藏，但是当子孙元素重置为`visibility: visible`就不会被隐藏。)

## position属性比较

- `fixed`:固定定位。脱离文档流，相对于浏览器窗口是固定位置，即使窗口滚动也不会移动。

- `relative`:相对定位。无论是否移动，元素仍然占据原来的空间，`top`，`left`等值有效。

- `absolute`:绝对定位。相对于最近的已定位元素进行定位，如果没有父元素相对于`html`进行定位。

- `sticky`:粘性定位。先按照普通文档流定位，然后相对于该元素在BFC和最近的块级祖先元素定位。元素表现为在跨域特定阀值前相对定位，之后固定定位。

- `static` 默认值，没有定位。元素会忽略`top`，`left`等值。