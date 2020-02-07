# canvans绘图

:::tip
要使用`<canvas>`元素，必须先设置其 `width` 和 `height` 属性，指定可以绘图的区域大小。
:::

```html
<canvas 
	id="drawing" 
	width=" 200" 
	height="200"
>A drawing of something.</canvas>
```

## 检测是否支持canvas绘制
```javascript
const drawing = document.getElementById("drawing");
	if(drawing && drawing.getContext){
    	const context = drawing.getContext("2d");
        console.log(context)
    }
```

## 图像导出
使用 `toDataURL()`方法，可以导出在`<canvas>`元素上绘制的图像。

```javascript
var drawing = document.getElementById("drawing"); 
// 确定浏览器支持<canvas>元素
if (drawing.getContext){ 
    // 取得图像的数据 URI 
    var imgURI = drawing.toDataURL("image/png"); 
    // 显示图像
    var image = document.createElement("img"); 
    image.src = imgURI; 
    document.body.appendChild(image); 
}
```

:::tip
默认情况下，浏览器会将图像编码为 `PNG` 格式（除非另行指定）。
:::


## 2D 上下文

使用 2D 绘图上下文提供的方法，可以绘制简单的 2D 图形，比如矩形、弧线和路径。2D 上下文的坐标开始于`<canvas>`元素的左上角，原点坐标是`(0,0)`。所有坐标值都基于这个原点计算，`x` 值越大表示越靠右，`y` 值越大表示越靠下。默认情况下，`width` 和 `height` 表示水平和垂直两个方向上可用的像素数目。

### 填充和描边

- 填充:`fillStyle`。
- 描边:`strokeStyle`。

### 绘制矩形

`fillRect()`、`strokeRect()`和 `clearRect()`。

这三个方法都能接收 4 个参数：**矩形的 x 坐标**、**矩形的 y 坐标**、**矩形宽度**和**矩形高度**。这些参数的单位都是像素。

```javascript
var drawing = document.getElementById("drawing"); 
// 确定浏览器支持<canvas>元素
if (drawing.getContext){ 
    var context = drawing.getContext("2d"); 
    /* 
    * 根据 Mozilla 的文档
    * http://developer.mozilla.org/en/docs/Canvas_tutorial:Basic_usage 
    */ 
    // 绘制红色矩形
    context.fillStyle = "#ff0000"; 
    context.fillRect(10, 10, 50, 50); 
    // 绘制半透明的蓝色矩形
    context.fillStyle = "rgba(0,0,255,0.5)"; 
    context.fillRect(30, 30, 50, 50); 
}
```

### 绘制路径


> 2D 绘制上下文支持很多在画布上绘制路径的方法。通过路径可以创造出复杂的形状和线条。要绘制路径，首先必须调用 `beginPath()方法`，表示要开始绘制新路径。然后，再通过调用下列方法来实际地绘制路径。

- `绘制圆arc(x, y, radius, startAngle, endAngle, counterclockwise)`：以`(x,y)`为圆心绘制一条弧线，弧线半径为 `radius`，起始和结束角度（用弧度表示）分别为 `startAngle `和`endAngle`。最后一个参数表示 `startAngle` 和 `endAngle` 是否按逆时针方向计算，值为 `false`表示按顺时针方向计算。

- `绘制弧线arcTo(x1, y1, x2, y2, radius)`：从上一点开始绘制一条弧线，到`(x2,y2)`为止，并且以给定的半径 `radius` 穿过`(x1,y1)`。

- `绘制贝塞尔曲线bezierCurveTo(c1x, c1y, c2x, c2y, x, y)`：从上一点开始绘制一条曲线，到(x,y)为止，并且以`(c1x,c1y)`和`(c2x,c2y)`为控制点。

- `lineTo(x, y)`：从上一点开始绘制一条直线，到`(x,y)`为止。

- `moveTo(x, y)`：将绘图游标移动到`(x,y)`，不画线。

- `quadraticCurveTo(cx, cy, x, y)`：从上一点开始绘制一条二次曲线，到`(x,y)`为止，并且以`(cx,cy)`作为控制点。

- `rect(x, y, width, height)`：从`点(x,y)`开始绘制一个矩形，宽度和高度分别由 `width` 和`height` 指定。这个方法绘制的是矩形路径，而不是`strokeRect()`和 `fillRect()`所绘制的独立的形状。


创建了路径后，接下来有几种可能的选择。

如果想绘制一条连接到路径起点的线条，可以调用`closePath()`。

如果路径已经完成，你想用`fillStyle` 填充它，可以调用`fill()`方法。

另外，还可以调用 `stroke()`方法对路径描边，描边使用的是 `strokeStyle`。

最后还可以调用 `clip()`，这个方法可以在路径上创建一个剪切区域。

:::tip
由于路径的使用很频繁，所以就有了一个名为 `isPointInPath()`的方法。

这个方法接收 `x` 和 `y` 坐标作为参数，用于在路径被关闭之前确定画布上的某一点是否位于路径上.
:::

```javascript
if (context.isPointInPath(100, 100)){ 
    alert("Point (100, 100) is in the path."); 
}
```

### 绘制文本

绘制文本主要有两个方法：`fillText()`和 `strokeText()`。

这两个方法都可以接收 4 个参数：要绘制的文本字符串、`x` 坐标、`y` 坐标和可选的最大像素宽度。而且，这两个方法都以下列 3 个属性为基础：

- `font`：表示文本样式、大小及字体，用 CSS 中指定字体的格式来指定，例如"10px Arial"。
- `textAlign`：表示文本对齐方式，"`start`"、"`end`"、"`left`"、"`right`"和"`center`"。建议使用"`start`"和"`end`"，不要使用"`left`"和"`right`"，因为前两者的意思更稳妥，能同时适合从左到右和从右到左显示（阅读）的语言。
- `textBaseline`：表示文本的基线,"`top`"、"`hanging`"、"`middle`"、"`alphabetic`"、
"`ideographic`"和"`bottom`"。

### 变换

通过上下文的变换，可以把处理后的图像绘制到画布上。2D 绘制上下文支持各种基本的绘制变换。创建绘制上下文时，会以默认值初始化变换矩阵，在默认的变换矩阵下，所有处理都按描述直接绘制。为绘制上下文应用变换，会导致使用不同的变换矩阵应用处理，从而产生不同的结果。

- `rotate(angle)`：围绕原点旋转图像 `angle` 弧度。
- `scale(scaleX, scaleY)`：缩放图像，在 x 方向乘以 scaleX，在 y 方向乘以 scaleY。scaleX和 scaleY 的默认值都是 1.0。 
- `translate(x, y)`：将坐标原点移动到(x,y)。执行这个变换之后，坐标(0,0)会变成之前由(x,y)表示的点。
- `transform(m1_1, m1_2, m2_1, m2_2, dx, dy)`：直接修改变换矩阵，方式是乘以如下矩阵。
		m1_1 m1_2 dx 
		m2_1 m2_2 dy 
		0 0 1 
- `setTransform(m1_1, m1_2, m2_1, m2_2, dx, dy)`：将变换矩阵重置为默认状态，然后
再调用 `transform()`。

### 绘制图像

2D 绘图上下文内置了对图像的支持。如果你想把一幅图像绘制到画布上，可以使用 `drawImage()`方法。

```javascript
// simple
var image = document.images[0]; 
context.drawImage(image, 10, 10);

// img startPoint endPoint width height
context.drawImage(image, 50, 10, 20, 30);

// img startPoint endPoint width height targetX targetY targetWidth targetHeight
context.drawImage(image, 0, 10, 50, 50, 0, 100, 40, 60);
```

### 阴影

2D 上下文会根据以下几个属性的值，自动为形状或路径绘制出阴影。

- `shadowColor`：用 CSS 颜色格式表示的阴影颜色，默认为黑色。
- `shadowOffsetX`：形状或路径 x 轴方向的阴影偏移量，默认为 0。 
- `shadowOffsetY`：形状或路径 y 轴方向的阴影偏移量，默认为 0。
- `shadowBlur`：模糊的像素数，默认 0，即不模糊。

这些属性都可以通过 `context`对象来修改。只要在绘制前为它们设置适当的值，就能自动产生阴影。例如：

```javascript
var context = drawing.getContext("2d"); 
// 设置阴影
context.shadowOffsetX = 5; 
context.shadowOffsetY = 5; 
context.shadowBlur = 4; 
context.shadowColor = "rgba(0, 0, 0, 0.5)"; 
// 绘制红色矩形
context.fillStyle = "#ff0000"; 
context.fillRect(10, 10, 50, 50); 
// 绘制蓝色矩形
context.fillStyle = "rgba(0,0,255,1)";
context.fillRect(30, 30, 50, 50);
```

### 渐变

渐变由 `CanvasGradient` 实例表示，很容易通过 2D 上下文来创建和修改。要创建一个新的线性渐变，可以调用 `createLinearGradient()`方法。

这个方法接收 4 个参数：`起点的 x 坐标`、`起点的 y 坐标`、`终点的 x 坐标`、`终点的 y 坐标`。调用这个方法后，它就会创建一个指定大小的渐变，并返回`CanvasGradient` 对象的实例。

创建了渐变对象后，下一步就是使用 `addColorStop()`方法来指定色标。

这个方法接收两个参数：色标位置和 CSS 颜色值。色标位置是一个 0（开始的颜色）到 1（结束的颜色）之间的数字。例如：

```javascript
var gradient = context.createLinearGradient(30, 30, 70, 70); 
gradient.addColorStop(0, "white"); 
gradient.addColorStop(1, "black");
```