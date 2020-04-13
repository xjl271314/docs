# 前端代码规范

## HTML规范

### 统一声明

`HTML`文件必须加上 `DOCTYPE` 声明，并统一使用 `HTML5` 的文档声明：

```html
<!DOCTYPE html>
```

### 统一字符集

一般情况下统一使用 `“UTF-8”` 编码

```html
<meta charset="UTF-8">
```

### 元素及标签闭合

`HTML`元素共有以下5种：

1. `空元素`：`area`、`base`、`br`、`col`、`command`、`embed`、`hr`、`img`、`input`、`keygen`、`link`、`meta`、`param`、`source`、`track`、`wbr`
2. `原始文本元素`：`script`、`style`
3. `RCDATA元素`：`textarea`、`title`
4. `外来元素`：来自`MathML`命名空间和`SVG`命名空间的元素。
5. `常规元素`：其他`HTML`允许的元素都称为常规元素。

元素标签的闭合应遵循以下原则：

- 原始文本元素、`RCDATA`元素以及常规元素都有一个开始标签来表示开始，一个结束标签来表示结束。
- 某些元素的开始和结束标签是可以省略的，如果规定标签不能被省略，那么就绝对不能省略它。
- 空元素只有一个开始标签，且不能为空元素设置结束标签。
- 外来元素可以有一个开始标签和配对的结束标签，或者只有一个自闭合的开始标签，且后者情况下该元素不能有结束标签。

```html
推荐使用<br>而不是<br/>,HTML5中的规范是使用<br>,XHTML,XML中使用<br/>

<img />标签需要自闭和,如果不自闭和的话直接回报错
```

### 类型属性

不需要为 `CSS`、`JS` 指定类型属性，`HTML5` 中默认已包含默认类型.

```html
<!-- 推荐 -->
<link rel="stylesheet" href="" >
<script src=""></script>

<!-- 不需要 -->
<link rel="stylesheet" type="text/css" href="" >
<script type="text/javascript" src="" ></script>
```

### 特殊字符引用

文本可以和字符引用混合出现。这种方法可以用来转义在文本中不能合法出现的字符。

在 `HTML` 中不能使用小于号 `“<”` 和大于号 `“>”`特殊字符，浏览器会将它们作为标签解析，若要正确显示，在 `HTML` 源代码中使用字符实体。

```html
<!-- 推荐可以使用字符实体的使用字符实体 -->
<a href="#">more&gt;&gt;</a>
```

### 代码嵌套

元素嵌套规范，每个块状元素独立一行，内联元素可选

```html
<!-- 推荐 -->
<div>
    <h1></h1>
    <p></p>
</div>	
<p><span></span><span></span></p>

<!-- 不推荐 -->
<div>
    <h1></h1><p></p>
</div>	
<p> 
    <span></span>
    <span></span>
</p>
```

段落元素与标题元素只能嵌套内联元素

```html
<!-- 推荐 -->
<h1><span></span></h1>
<p><span></span><span></span></p>

<!-- 不推荐 -->
<h1><div></div></h1>
<p><div></div><div></div></p>
```

## 图片规范

常见的图片格式有 `GIF`、`PNG8`、`PNG24`、`JPEG`、`WEBP`，根据图片格式的特性和场景需要选取适合的图片格式。

`jpg`和`png`格式的图片都可以先走一遍`tinypng`然后再上传`CDN`。

### 图片大小

3G：最高值100KB/s，平均值40～50KB/s
4G：最高值2.75MB/s，平均500～1000KB/s

尽量不要在项目中使用原图，根据具体的情况使用相对应的尺寸。

### 图片引入

某些可以使用自定义svg或者css实现的图标可以使用此种方式来实现，一个是利于扩展，另外一个是加载资源消耗比较少

## CSS规范

### 代码格式化
推荐使用展开格式，不适用紧凑格式

```css
/* 推荐 */
.btn{
    display: block;
    width: 50px;
}

/* 不推荐 */
.btn {display:block;width:50px;}
```

### 代码大小写

推荐使用驼峰书写方式 或者 '-' 或者 '_'进行分隔
```css
/* 推荐 */
.btnActive{
    ...
}

.btn-active{
    ...
}

.btn_active{
    ...
}

/* 不推荐 */
.BtnActive{
    ...
}
```

### 代码易读性

样式名称和属性名称后面空一格空格，更加清晰

```css
/* 推荐 */
.btn {
    width: 100px;
    height: 50px;
}

/* 不推荐 */
.btn{
    width:100px;
    height:50px;
}

```

### 注释规范

注释以字符 `/*` 开始，以字符 `*/` 结束

注释不能嵌套

### 属性书写顺序

CSS编写建议遵循以下顺序：

1. `定位属性`：display position float  left  top  right  bottom   overflow  clear   z-index

2. `自身属性`：width  height  padding  border  margin   background

3. `文字样式`：font-family   font-size   font-style   font-weight   font-varient   color  

4. `文本属性`：text-align   vertical-align   text-wrap   text-transform   text-indent    text-decoration   letter-spacing    word-spacing    white-space   text-overflow

5. `其他属性`:border-radius  box-shadow  text-shadow  animation  cursor transform transition 


### `目的`：减少浏览器reflow（回流），提升浏览器渲染dom的性能

### `原理`：浏览器的渲染流程为——

1. 解析html构建dom树，解析css构建css树：将html解析成树形的数据结构，将css解析成树形的数据结构

2. 构建render树：DOM树和CSS树合并之后形成的render树。

3. 布局render树：有了render树，浏览器已经知道那些网页中有哪些节点，各个节点的css定义和以及它们的从属关系，从而计算出每个节点在屏幕中的位置。

4. 绘制render树：按照计算出来的规则，通过显卡把内容画在屏幕上。

css样式解析到显示至浏览器屏幕上就发生在2.3.4步骤，可见浏览器并不是一获取到css样式就立马开始解析而是根据css样式的书写顺序将之按照dom树的结构分布render样式，完成第2步，然后开始遍历每个树结点的css样式进行解析，此时的css样式的遍历顺序完全是按照之前的书写顺序。在解析过程中，一旦浏览器发现某个元素的定位变化影响布局，则需要倒回去重新渲染正如按照这样的书写书序：

```css
width: 100px;
height: 100px;
background-color: red ;
position: absolute;
```

当浏览器解析到position的时候突然发现该元素是绝对定位元素需要脱离文档流，而之前却是按照普通元素进行解析的，所以不得不重新渲染，解除该元素在文档中所占位置，然而由于该元素的占位发生变化，其他元素也可能会受到它回流的影响而重新排位。最终导致③步骤花费的时间太久而影响到④步骤的显示，影响了用户体验。

所以规范的的css书写顺序对于文档渲染来说一定是事半功倍的！

`repaint（重绘）`：改变某个元素的背景色、文字颜色、边框颜色等等不影响它周围或内部布局的属性时，屏幕的一部分要重画，但是元素的几何尺寸没有变。

注意：

1. render树的结构不等同于DOM树的结构，一些设置display:none的节点不会被放在render树中，但会在dom树中。

2. 有些情况，比如修改了元素的样式，浏览器并不会理科reflow或repaint，而是把这些操作积攒一批，然后做一次reflow，这也叫做异步reflow.但在有些情况下，比如改变窗口，改变页面默认的字体等，对于这些情况，浏览器会马上进行reflow.

3. 为了更好的用户体验，渲染引擎将会尽可能早的将内容呈现到屏幕上，并不会等到所有的html都解析完成之后再去构建和布局render树。它是解析完一部分内容就显示一部分内容，同时，可能还在通过网络下载其余内容。

### 书写规范问题

1. 能简写的属性简写,仅一侧的属性详写 

比如padding值 上下左右的值都是已知的情况下推荐简写 只有一侧有padding的时候 推荐详写 简写的话会造成浏览器不必要的计算。

font-size:0.8em; ------> font-size:.8em;

16进制的颜色属性简写:  #FFFFFF ------>  #FFF;

2. 多浏览器前缀兼容性的问题 推荐使用`post-css`插件进行解决


## 命名规范

### 目录命名

- 项目文件夹：projectname
- 样式文件夹：css / styles / themes
- 脚本文件夹：js / utils / tools
- 样式类图片文件夹：img / images / assets

### 图片命名

推荐使用`—`或者`_`来区分不同业务的图片名称

### ClassName命名

如果使用的less推荐使用:
```jsx
import styles from './index,less';

<div 
    className={styles.pageContainer}
/>
```

如果使用的是scss推荐使用

```jsx
import './index,less';

<div 
    className="pageContainer"
/>

```

:::tip
有一点需要注意的是 公共的样式名(全局样式名)推荐放置在`clssName`前面部分，特定的放置在后面，多个样式名组合的话可以使用`classnames`插件来实现。

less和scss文件中的全局样式使用`:gloabl`包裹
:::

```jsx
import classNames from 'classnames';

<div className={classNames('commonCls','specialCls')}>222</div>
```

## js规范

### 命名规范

**变量命名推荐使用实际含义的对应英文单词**
```js
// 推荐
const 推荐 = Recommand
const 关注 = Attention

// 不推荐
const 推荐 = tuijian
const 关注 = guanzhu
```

**变量命名采用驼峰方式**
```js
// 推荐
const recommandProductList

// 不推荐
const recommadproductlist
```

**常量命名采用大写和下划线组合**

```js
// 推荐
const NORMAL_STATUS_INFO

// 不推荐
const normal_status_info
```

### 属性简写

相同的属性可以进行简写，不必再次书写

```js
// 推荐
const userInfo = {...}

fetch(url,{ userInfo }).then(...)

// 不推荐
const userInfo = {...}

fetch(url,{ userInfo:userInfo }).then(...)
```

### 单行代码块

在单行代码块中使用空格

```js
// 推荐
function foo () { return true }
if (foo) { bar = 0 }

// 不推荐
function foo () {return true}
if (foo) {bar = 0}
```

### 多行代码块

```js
// 推荐
if (foo) {
  bar()
}
else {
  baz()
}

const list = [
    {
        a:1
    },
    {
        b:2
    },
    {
        c:3
    }
];

// 不推荐
if (foo)
{
  bar()
}
else
{
  baz()
}

const list = [{
    a:1
},{
    b:2
},{
    c:3
}]
```

### 代码注释规范

1. 页面级别组件(class组件)可以参考以下注释格式

`vscode`推荐使用`koroFileHeader`(一个代码注释插件)

/**
 * 某某项目需求简单描述
 * @Prd:prd地址
 * @Link:蓝湖ui地址
 * @Author 作者
 * @Email 作者的邮箱
 * @Date 编写日期
 * @LastEditors 最后编写该文件的人
 * @LastEditTime: 2018-10-15 20:59:57 最后编写时间
 * 
 */

 ```js
 window：`ctrl+alt+i`, mac：`ctrl+cmd+i`
 ```

 2. 函数注释规范(多行注释)

```js
 /**
  * @description: 该函数主要作用是啥
  * @param {type}  参数名称 参数类型 参数默认值
  * @return:  函数返回值
  */

  window：`ctrl+alt+t`, mac：`ctrl+cmd+t`
```

3. 单行函数内部注释规范,方法内单行注释后空一个空格 

```js
function aa(a, b){
    // 如果用户余额大于30的话
    if(a > b){

    }
}
```

