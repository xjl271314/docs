# svg之Path属性详解

- 2020.05.26

## 定义

> `path`元素是`SVG`基本形状中最强大的一个，它不仅能创建其他基本形状，还能创建更多其他形状。你可以用`path`元素绘制`矩形（直角矩形或者圆角矩形）`、`圆形`、`椭圆`、`折线形`、`多边形`，以及一些其他的形状，例如`贝塞尔曲线`、`2次曲线等曲线`。


## 简介

> `path`元素的形状是通过属性`d`来定义的，属性`d`的值是一个`命令+参数`的序列。每一个命令都用一个关键字母来表示。

比如，字母“M”表示的是`Move to`命令，当解析器读到这个命令时，它就知道你是打算移动到某个点。跟在命令字母后面的，是你需要移动到的那个点的x和y轴坐标。比如移动到(10,10)这个点的命令，应该写成`M 10 10`。这一段字符结束后，解析器就会去读下一段命令。

每一个命令都有两种表示方式，一种是用`大写字母`，表示采用`绝对定位`。另一种是用`小写字母`，表示采用`相对定位`。

:::tip
因为属性d采用的是用户坐标系统，所以不需标明单位
:::


## `svg`的 `<path>`命令

```
M = moveto
L = lineto
H = horizontal lineto
V = vertical lineto
C = curveto
S = smooth curveto
Q = quadratic Bézier curve
T = smooth quadratic Bézier curveto
A = elliptical Arc
Z = closepath
```

:::warning
注意：以上所有命令均允许小写字母。大写表示`绝对定位`，小写表示`相对定位`。
:::

### 绘制直线

```
M:  移动到x轴和y轴的坐标
L:  需要两个参数，分别是一个点的x轴和y轴坐标，L命令将会在当前位置和新位置（L前面画笔所在的点）之间画一条线段.
H:  绘制平行线
V:  绘制垂直线
Z:  从当前点画一条直线到路径的起点
```

<svg-line1/>

```html
<svg width="100" height="100" version="1.1" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 10 H 90 V 90 H 10 L 10 10"/> 
</svg>
```

可以通过一个“闭合路径命令”Z来简化上面的path，简写形式：

```html
<svg width="100px" height="100px" version="1.1" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 10 H 90 V 90 H 10 Z" fill="black" stroke="black"/>
</svg>
```

相对命令使用的是小写字母，它们的参数不是指定一个明确的坐标，而是表示相对于它前面的点需要移动多少距离。相对坐标形式：

```html
<svg width="100" height="100" version="1.1" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 10 h 80 v 80 h -80 Z" fill="black" stroke="black"/>
</svg>
```

画笔移动到(10,10)点，由此开始，向右移动80像素构成一条水平线，然后向下移动80像素，然后向左移动80像素，最后再回到起点。

### 曲线命令

> 绘制平滑曲线的命令有三个，其中两个用来绘制贝塞尔曲线，另外一个用来绘制弧形或者说是圆的一部分。在path元素里，只存在两种贝塞尔曲线：`三次贝塞尔曲线C`和`二次贝塞尔曲线Q`。


- 三次贝塞尔曲线

> 三次贝塞尔曲线需要定义一个点和两个控制点，所以用C命令创建三次贝塞尔曲线，需要设置三组坐标参数：`C x1 y1, x2 y2, x y (or c dx1 dy1, dx2 dy2, dx dy)`，最后一个坐标`(x,y)`表示的是曲线的终点，另外两个坐标是控制点，`(x1,y1)`是起点的控制点，`(x2,y2)`是终点的控制点。


<svg-bse1 />

```html
<svg width="190" height="160" version="1.1" xmlns="http://www.w3.org/2000/svg">
    <path d="M130 110 C 120 140, 180 140, 170 110" stroke="black" fill="transparent" />
    <circle cx="130" cy="110" r="2" fill="red" />
    <circle cx="120" cy="140" r="2" fill="red" />
    <line x1="130" y1="110" x2="120" y2="140" style="stroke:rgb(255,0,0);stroke-width:2" />
    <circle cx="180" cy="140" r="2" fill="red" />
    <circle cx="170" cy="110" r="2" fill="red" />
    <line x1="180" y1="140" x2="170" y2="110" style="stroke:rgb(255,0,0);stroke-width:2" />
</svg>
```

曲线沿着起点到第一控制点的方向伸出，逐渐弯曲，然后沿着第二控制点到终点的方向结束。

:::tip
当一个点某一侧的控制点是它另一侧的控制点的对称（斜率不变）时,可以使用一个简写的贝塞尔曲线命令S：`S x2 y2, x y (or s dx2 dy2, dx dy)`

S命令可以用来创建与之前那些曲线一样的贝塞尔曲线，但是，如果S命令跟在一个C命令或者另一个S命令的后面，它的第一个控制点，就会被假设成前一个控制点的对称点。

如果S命令单独使用，前面没有C命令或者另一个S命令，那么它的两个控制点就会被假设为同一个点。
:::

<svg-bse2 />

```html
<!--三次贝塞尔曲线简写-->
<svg width="190px" height="160px" version="1.1" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 80 C 40 10, 65 10, 95 80 S 150 150, 180 80" stroke="black" fill="transparent"/>
    <circle cx="10" cy="80" r="2" fill="red"/>
    <circle cx="40" cy="10" r="2" fill="red"/>
    <line x1="10" y1="80" x2="40" y2="10" style="stroke:rgb(255,0,0);stroke-width:1"/>

    <circle cx="65" cy="10" r="2" fill="red"/>
    <circle cx="95" cy="80" r="2" fill="red"/>
    <line x1="65" y1="10" x2="95" y2="80" style="stroke:rgb(255,0,0);stroke-width:1"/>

    <circle cx="125" cy="150" r="2" fill="blue"/>
    <circle cx="180" cy="80" r="2" fill="red"/>
    <circle cx="150" cy="150" r="2" fill="red"/>
    <line x1="95" y1="80" x2="125" y2="150" style="stroke:blue;stroke-width:1"/>
    <line x1="180" y1="80" x2="150" y2="150" style="stroke:rgb(255,0,0);stroke-width:1"/>
</svg>
```

- 二次贝塞尔曲线

> 二次贝塞尔曲线Q比三次贝塞尔曲线简单，只需要一个控制点，用来确定起点和终点的曲线斜率。需要两组参数，控制点和终点坐标。Q命令：`Q x1 y1, x y (or q dx1 dy1, dx dy)`

<svg-bse3 />

```html
<!--二次贝塞尔曲线-->
<svg width="190px" height="160px" version="1.1" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 80 Q 95 10 180 80" stroke="black" fill="transparent"/>
     <!--Points-->
    <circle cx="10" cy="80" r="2" fill="red"/>
    <circle cx="95" cy="10" r="2" fill="red"/>
    <circle cx="180" cy="80" r="2" fill="red"/>
    <line x1="10" y1="80" x2="95" y2="10" style="stroke:rgb(255,0,0);stroke-width:1"/>
    <line x1="95" y1="10" x2="180" y2="80" style="stroke:rgb(255,0,0);stroke-width:1"/>
</svg>  
```

简写的贝塞尔曲线命令T

:::tip
就像三次贝塞尔曲线有一个S命令，二次贝塞尔曲线有一个差不多的T命令，可以通过更简短的参数，延长二次贝塞尔曲线。

`T x y (or t dx dy)`，快捷命令T会通过前一个控制点，推断出一个新的控制点。这意味着，在你的第一个控制点后面，可以只定义终点，就创建出一个相当复杂的曲线。

需要注意的是，T命令前面必须是一个Q命令，或者是另一个T命令，才能达到这种效果。

如果T单独使用，那么控制点就会被认为和终点是同一个点，所以画出来的将是一条直线。

:::

<svg-bse4 />

```html
<!--二次贝塞尔曲线简写-->
<svg width="190px" height="160px" version="1.1" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 80 Q 52.5 10, 95 80 T  180 80" stroke="black" fill="transparent"/>

    <circle cx="10" cy="80" r="2" fill="red"/>
    <circle cx="52.5" cy="10" r="2" fill="red"/>
    <line x1="10" y1="80" x2="52.5" y2="10" style="stroke:rgb(255,0,0);stroke-width:1"/>

    <circle cx="95" cy="80" r="2" fill="red"/>
    <line x1="95" y1="80" x2="52.5" y2="10" style="stroke:rgb(255,0,0);stroke-width:1"/>

    <circle cx="180" cy="80" r="2" fill="blue"/>
    <circle cx="137.5" cy="150" r="2" fill="blue"/>
    <line x1="95" y1="80" x2="137.5" y2="150" style="stroke:rgb(0,0,255);stroke-width:1"/>
    <line x1="137.5" y1="150" x2="180" y2="80" style="stroke:rgb(0,0,255);stroke-width:1"/>
</svg>
```