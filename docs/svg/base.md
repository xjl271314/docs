# svg基础知识

- 2020.05.29

## 定义

> `SVG`全称为`Scalable Vector Graphics`，即`可伸缩矢量图形`。它是一种面向网络的、基于`XML`的标记语言，用来描述二维矢量图形。

## 支持

> `HTML5`文档中可直接内嵌`SVG`图像, 可以忽略文档`DTD`、`SVG版本`、`命名空间`等信息，语法变得很简练。

## 基础形状

- 2020.06.01

SVG为开发者提供了一些预定义的形状元素，以便于快速应用：

- `方形 <rect>`
- `圆形 <circle>`
- `椭圆 <ellipse>`
- `线条 <line>`
- `折线 <polyline>`
- `多边形 <polygon>`
- `路径 <path>`

### `方形 <rect>`

> 用来创建矩形，以及矩形的变种。

<svg-rect1 />

```html
<svg width="300" height="100">
    <rect width="300" height="100" style="fill:rgb(0,0,255);stroke-width:1;
stroke:rgb(0,0,0)" />
</svg>
```

<svg-rect2 />

```html
<svg width="300" height="300">
    <rect
        x="20"
        y="20"
        width="250"
        height="250"
        style="fill:blue;stroke:pink;stroke-width:5;
fill-opacity:0.1;stroke-opacity:0.9"
    />
</svg>
```

<svg-rect3 />

```html
<svg width="300" height="140">
    <rect
        x="20"
        y="20"
        rx="20"
        ry="20"
        width="250"
        height="100"
        style="fill:red;stroke:black;stroke-width:5;opacity:0.5"
    />
</svg>
```

| 参数名  | 描述
|:----- | :----
| `width` | 定义矩形的宽度
| `height` | 定义矩形的高度
| `style` | 定义样式
| `fill` | 定义填充颜色(rgb 值、颜色名或者十六进制值）
| `stroke-width` | 定义边框的宽度
| `stroke` | 定义边框的填充颜色
| `x`      | 定义矩形的左侧位置（例如，x="0" 定义矩形到浏览器窗口左侧的距离是 0px）
| `y`  | 定义矩形的顶端位置（例如，y="0" 定义矩形到浏览器窗口顶端的距离是 0px）
| `fill-opacity` | 定义填充颜色透明度（合法的范围是：0 - 1）
| `stroke-opacity` | 定义笔触颜色的透明度（合法的范围是：0 - 1）
| `opacity` | 定义整个元素的透明值（合法的范围是：0 - 1）
| `rx` | 定义元素的水平radius
| `ry` | 定义元素的垂直radius


### `圆形 <circle>`

> 用来创建一个圆

<svg-circle1 />

```html
<svg width="150" height="150" viewBox="0 0 150 150">
    <circle cx="75" cy="75" r="40" stroke="black" stroke-width="2" fill="red" />
</svg>
```

| 参数名  | 描述
|:----- | :----
| `cx` | 定义圆心所在x轴位置
| `cy` | 定义圆心所在y轴位置 如果省略 `cx` 和 `cy`，圆的中心会被设置为 `(0, 0)`
| `r` | 定义圆的半径
| `style` | 定义样式
| `fill` | 定义填充颜色(rgb 值、颜色名或者十六进制值）
| `stroke-width` | 定义边框的宽度
| `stroke` | 定义边框的填充颜色

### `椭圆 <ellipse>`

> 用来创建椭圆。椭圆与圆很相似。不同之处在于椭圆有不同的 x 和 y 半径，而圆的 x 和 y 半径是相同的。

<svg-tcircle1 />

```html
<svg width="300" height="150">
    <ellipse
        cx="150"
        cy="75"
        rx="80"
        ry="40"
        style="fill:rgb(200,100,50);
stroke:rgb(0,0,100);stroke-width:2"
    />
</svg>
```

| 参数名  | 描述
|:----- | :----
| `cx` | 定义椭圆圆心所在x轴位置
| `cy` | 定义椭圆圆心所在y轴位置 如果省略 `cx` 和 `cy`，圆的中心会被设置为 `(0, 0)`
| `rx` | 定义椭圆的水平半径
| `ry` | 定义椭圆的垂直半径
| `style` | 定义样式
| `fill` | 定义填充颜色(rgb 值、颜色名或者十六进制值）
| `stroke-width` | 定义边框的宽度
| `stroke` | 定义边框的填充颜色

### `线条 <line>`

> 用来创建线条。

<svg-line2 />

```html
<svg width="300" height="200">
    <line x1="0" y1="0" x2="300" y2="200" style="stroke:rgb(99,99,99);stroke-width:2" />
</svg>
```

| 参数名  | 描述
|:----- | :----
| `x1` | 定义直线起始点x坐标
| `y1` | 定义直线起始点y坐标
| `x2` | 定义直线终止点x坐标
| `y2` | 定义直线终止点y坐标

### `折线 <polyline>`

> `line`只能用来绘制笔直的线条，使用 `polyline` 可以绘制折线

<svg-polyline1 />

```html
<svg width="300" height="200">
    <polyline points="100,100 100,120 120,120 120,140 140,140 140,160"
style="fill:none;stroke:red;stroke-width:2"/>
</svg>
```

| 参数名  | 描述
|:----- | :----
| `points` | 定义折线各个点的描述
| `style` | 定义样式
| `fill` | 定义填充颜色(rgb 值、颜色名或者十六进制值）

### `多边形 <polygon>`

> 用来创建含有不少于三个边的图形。

<svg-polygon1 />

```html
<svg width="320" height="300">
    <polygon
        points="220,100 300,210 170,250"
        style="fill:#cccccc;stroke:#000000;stroke-width:1"
    />
</svg>
```
| 参数名  | 描述
|:----- | :----
| `points` | 定义多边形各个点的描述
| `style` | 定义样式
| `fill` | 定义填充颜色(rgb 值、颜色名或者十六进制值）

### `路径 <path>`

路径章节单独见path详解