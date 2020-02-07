# WebGL

## 类型化数组

`WebGL`涉及的复杂计算需要提前知道数值的精度，而标准的`JavaScript`数值无法满足需要。为此，`WebGL`引入了一个概念，叫`类型化数组（typed arrays）`。类型化数组也是数组，只不过其元素被设置为特定类型的值。

类型化数组的核心就是一个名为 `ArrayBuffer `的类型。每个 `ArrayBuffer` 对象表示的只是内存中指定的字节数，但不会指定这些字节用于保存什么类型的数据。**通过 `ArrayBuffer `所能做的，就是为了将来使用而分配一定数量的字节。**例如，下面这行代码会在内存中分配 20B。

```javascript
// 内存中分配20B
var buffer = new ArrayBuffer(20);
```

## WebGL上下文

```javascript
var drawing = document.getElementById("drawing"); 
//确定浏览器支持<canvas>元素
if (drawing.getContext){ 
var gl = drawing.getContext("webgl"); 
	if (gl){ 
 		// 使用 WebGL 
 	} 
}
```