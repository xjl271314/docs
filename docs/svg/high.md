# svg高级技巧

- 2020.06.01

## 理解viewport

> 定义了SVG里面的元素能显示的在多大的一个面板中。`width`、`height`如果是纯数字，使用的就是“像素”作为单位的。

```html
<svg width="400" height="200"></svg>
```

上述代码定义了一个`svg`元素宽度为400高度为200,也就是`viewport`。现在我们在内部放置一个 宽200 高 200的矩形。在不定义vieBox的情况下矩形刚好占据了一半的宽度。

<svg-rect4 />

```html
<svg width="400" height="200">
    <rect x="0" y="0" width="200" height="200" style="fill:blue;"/>
</svg>
```

## 理解viewBox

> `viewbox="x, y, width, height"`。`viewBox`简单的理解就是在`viewport`中截取出指定部分的选取，然后把改选区中的内容缩放为`viewport`的大小。

| 参数名  | 描述
|:----- | :----
| `x` | 左上角开始的横坐标点
| `y` | 左上角往下的纵坐标点
| `width` | viewbox的宽度
| `height` | viewbox的高度

从之前的那个例子来理解:

<svg width="400" height="300" style="border:1px solid #cd0000;">
    <rect x="10" y="5" width="20" height="15" fill="#cd0000"/>
</svg>

```html
<svg width="400" height="300" style="border:1px solid #cd0000;">
    <rect x="10" y="5" width="20" height="15" fill="#cd0000"/>
</svg>
```

在没有使用`viewbox`之前 `svg` 中的矩形只有一点点的大小，接下来加上`viewbox`的黑魔法。

<svg width="400" height="300" viewBox="0,0,40,30" style="border:1px solid #cd0000;">
    <rect x="10" y="5" width="20" height="15" fill="#cd0000"/>
</svg>

```html
<svg width="400" height="300" viewBox="0,0,40,30" style="border:1px solid #cd0000;">
    <rect x="10" y="5" width="20" height="15" fill="#cd0000"/>
</svg>
```

**完整生动的例子:**

<svg-viewbox1 />

## 理解 `preserveAspectRatio` 属性

上面的例子，`SVG`的宽高比正好和`viewBox`的宽高比是一样的，都是`4:3`. 显然，实际应用`viewBox`不可能一直跟`viewport`是同一个比例。此时，就需要`preserveAspectRatio`出马了，此属性也是应用在`<svg>`元素上，且作用的对象都是`viewBox`。

> `preserveAspectRatio="xMidYMid meet"`。`preserveAspectRatio`属性的值为空格分隔的两个值组合而成。例如，上面的`xMidYMid`和`meet`.

- 第1个值表示，`viewBox`如何与`SVG viewport`对齐；

| 参数名  | 描述
|:----- | :----
| `xMin` |	viewport和viewBox左边对齐。
| `xMid` |	viewport和viewBox x轴中心对齐。
| `xMax` |	viewport和viewBox右边对齐。
| `YMin` |	viewport和viewBox上边缘对齐。注意Y是大写。
| `YMid` |	viewport和viewBox y轴中心点对齐。注意Y是大写。
| `YMax` |	viewport和viewBox下边缘对齐。注意Y是大写。

:::tip
x和y可以进行自由的组合。

例如: `xMaxYMax`、`xMinYmid` 等 6*5/2 = 15种可能
:::

- 第2个值表示，如何维持高宽比（如果有）。

| 参数名  | 描述
|:----- | :----
| `meet` |	保持纵横比缩放viewBox适应viewport。
| `slice` |	保持纵横比同时比例小的方向放大填满viewport。
| `none` |	扭曲纵横比以充分适应viewport。

<svg-preserveAspectRatio />

## 使用`<defs>`来自定义形状

> `<defs>`用于定义所有可能再次引用的图形元素。在`<defs>`元素中定义的图形元素不会直接呈现。但是可以在视口的任意地方利用 `<use>`元素呈现这些元素。

<svg-defs1 />

```html
<svg width="200" height="100" viewBox="0 0 200 100">
    <defs>
        <linearGradient id="Gradient01">
          <stop offset="20%" stop-color="#39F" />
          <stop offset="90%" stop-color="#F3F" />
        </linearGradient>
    </defs>
    <rect x="10" y="10" width="150" height="75" fill="url(#Gradient01)" />
</svg>
```

## 使用`<g>`来组合标签

> 元素 `<g>` 是用来组合对象的容器。添加到 `<g>` 元素上的变换会应用到其所有的子元素上。添加到`<g>` 元素的属性会被其所有的子元素继承。此外，`<g>` 元素也可以用来定义复杂的对象，之后可以通过元素来引用它们。

<svg-g1 />

```html
<svg width="300" height="150" viewBox="0 0 140 75">
    <g stroke="#333" fill="transparent" stroke-width="5">
        <circle cx="25" cy="25" r="20" />
        <circle cx="55" cy="25" r="20" />
        <circle cx="85" cy="25" r="20" />
        <circle cx="115" cy="25" r="20" />
    </g>
    <text x="55" y="70" stroke="red" fill="red" stroke-width="5">Audi</text>
</svg>
```

## 使用`<filter>`来给元素添加滤镜

> `<filter>`标签用来定义`SVG滤镜`。`<filter>`标签使用必需的`id`属性来定义向图形应用哪个滤镜。

<svg-filter1 />

```html
<svg width="200" height="100"> 
    <defs>
        <filter id="f1" x="0" y="0">
          <feGaussianBlur in="SourceGraphic" stdDeviation="15" />
        </filter>
      </defs>
    <rect x="60" y="10" width="80" height="80" stroke="green" stroke-width="3" fill="yellow" filter="url(#f1)" />
</svg>
```

:::tip
更多的例子请查看filter滤镜详解
:::


## 使用 `<linearGradient>`来创建线性渐变

> `linearGradient` 用来实现元素线性渐变的效果。`<linearGradient>` 标签必须嵌套在 `<defs>` 的内部。

<svg-lineargradient1 />

```html
<svg width="300" height="50">
    <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:rgb(255,255,0);stop-opacity:1" />
          <stop offset="100%" style="stop-color:rgb(255,0,255);stop-opacity:1" />
        </linearGradient>
    </defs>
    <rect x="75" y="10" width="150" height="30" fill="url(#grad1)" />
</svg>
```