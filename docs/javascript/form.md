# form表单脚本

## 表单的基础知识

在 `HTML`中，表单是由`<form>`元素来表示的，而在 `JavaScript`中，表单对应的则是 `HTMLFormElement `类型。`HTMLFormElement` 继承了 `HTMLElement`，因而与其他 `HTML` 元素具有相同的默认属性。不过，`HTMLFormElement` 也有它自己下列独有的属性和方法。

- `acceptCharset`：服务器能够处理的字符集；等价于`HTML` 中的 `accept-charset` 特性。
- `action`：接受请求的` URL`；等价于` HTML` 中的 `action` 特性。
- `length`：表单中控件的数量。
- `method`：要发送的 `HTTP` 请求类型，通常是"`get`"或"`post`"；等价于` HTML` 的 `method` 特性。
- `name`：表单的名称；等价于 `HTML` 的 `name` 特性。
- `reset()`：将所有表单域重置为默认值。
- `submit()`：提交表单。
- `target`：用于发送请求和接收响应的窗口名称；等价于 `HTML `的 `target` 特性。


## 提交表单

用户单击提交按钮或图像按钮时，就会提交表单。使用`<input>`或`<button>`都可以定义提交按钮，只要将其 `type` 特性的值设置为`submit`即可，而图像按钮则是通过将`<input>`的` type` 特性值设置为"`image`"来定义的。因此，只要我们单击以下代码生成的按钮，就可以提交表单。

```html
<!-- 通用提交按钮 --> 
<input type="submit" value="Submit Form"> 
<!-- 自定义提交按钮 --> 
<button type="submit">Submit Form</button> 
<!-- 图像按钮 --> 
<input type="image" src="graphic.gif">

```
或者使用

```javascript
// 提交表单
form.submit();
```

:::warning
提交表单时可能出现的最大问题，就是重复提交表单。在第一次提交表单后，如果长时间没有反应，用户可能会变得不耐烦。这时候，他们也许会反复单击提交按钮。结果往往很麻烦（因为服务器要处理重复的请求），或者会造成错误（如果用户是下订单，那么可能会多订好几份）。
:::

**解决这一问题的办法有两个:**
1. 在第一次提交表单后就禁用提交按钮
2. 利用 `onsubmit `事件处理程序取消后续的表单提交操作。

## 重置表单

在用户单击重置按钮时，表单会被重置。使用`type` 特性值为"`reset`"的`<input>`或`<button>`都可以创建重置按钮，如下面的例子所示：

```html
<!-- 通用重置按钮 --> 
<input type="reset" value="Reset Form"> 
<!-- 自定义重置按钮 --> 
<button type="reset">Reset Form</button>
```

与提交表单一样，也可以通过 `JavaScript` 来重置表单，如下面的例子所示:

```javascript
// 重置表单
form.reset();
```

## 操作富文本

与富文本编辑器交互的主要方式，就是使用 `document.execCommand()`。这个方法可以对文档执行预定义的命令，而且可以应用大多数格式。

![富文本操作1](https://img-blog.csdnimg.cn/20200120225604625.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

![富文本操作2](https://img-blog.csdnimg.cn/20200120225625118.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)
