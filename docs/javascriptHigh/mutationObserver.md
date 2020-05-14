# 使用MutationObserver 与 IntersectionObserver来监听页面元素

- 2020.05.13

## 场景

实际业务开发中常常会遇到滚动到顶部或者tab初始为相对定位，滚动一段距离后切换为fixed定位的场景，tab下往往是一些tabList。一个比较友好的交互是当用户在切换tab的时候，可以自动的定位到对应tab下的list的初始位置。

## 初始版本

为了满足上面描述的业务场景，我们先来实现一个简单版本的效果

```jsx
<Page>
    <Content1 />
    <Sticky>
        <Tab />
    <Sticky>
    <TabList />
</Page>
```

假设我们的页面结构就是这样组成的，其中`Sticky`组件表示滚动到指定位置后`Tab`组件会变成`fixed`定位。

- 2020.05.14

## 使用ScrollIntoView

> `Element.scrollIntoView()` 让当前的元素滚动到浏览器窗口的可视区域内。

### 语法

> `element.scrollIntoView();` // 等同于element.scrollIntoView(true) 

> `element.scrollIntoView(true);` // 元素的顶端将和其所在滚动区的可视区域的顶端对齐。相应的 scrollIntoViewOptions: {block: "start", inline: "nearest"}。这是这个参数的默认值。

> `element.scrollIntoView(false);` // 元素的底端将和其所在滚动区的可视区域的底端对齐。相应的scrollIntoViewOptions: {block: "end", inline: "nearest"}。

> `element.scrollIntoView(scrollIntoViewOptions);` 


### scrollIntoViewOptions

| 参数名| 参数形式 | 参数描述
| :--- | :--- | :---
| behavior | 可选 | 定义动画过渡效果， "auto"`或 "smooth" 之一。默认为 "auto"。
| block | 可选 | 定义垂直方向的对齐， "start", "center", "end", 或 "nearest"之一。默认为 "start"。
| inline | 可选 | 定义水平方向的对齐， "start", "center", "end", 或 "nearest"之一。默认为 "nearest"。


这个是H5上用来滚动元素到指定位置的方法.

:::warning

很不幸,这是一个实验中的功能.

而且在实际的使用过程中，由于我们的`tab`是`fixed`定位的，我们让`tabList`执行`scrollIntoView()`方法后部门内容会被tab遮挡。只能另寻他法。

**所以假如有fixed布局的元素的时候使用此方法并不能达到滚动到顶部的效果。**
:::


## 使用scrollTo

> window.scrollTo(xPos, yPos, behavior:[smooth, instant]);

既然`scrollIntoView`方法不能满足我们的需求 那我们就用原始的`scrollTo`方法来实现吧。

还是上面的代码。

```js
const id = tabList.id;// 获取到对应tabList元素的id
const top = document.querySelector(`#${id}`).offSetTop; // 获取到元素的offsetTop
window.scrollTo(top, { behavior: 'smooth');
```

:::warning

的确,使用这个方法可以解决我们的问题，但是在后来场景的应用中产生了另外一个问题。

**由于项目中的列表用的是懒加载组件，恰好监听的是scroll方法，这时当我们滚动到列表底部 然后切换tab的时候，视窗会滚动到列表的初始位置，但是下方的所有listItem都会重新去请求,造成了很多不必要的请求。**

:::

## 使用MutationObserver

> `MutationObserver`接口提供了监视对`DOM`树所做更改的能力。它被设计为旧的`Mutation Events`功能的替代品，该功能是`DOM3 Events`规范的一部分。


### 支持情况

![MutationObserver支持情况](https://img-blog.csdnimg.cn/20200514200309491.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)


### 语法

#### 构造函数

> `MutationObserver():` 创建并返回一个新的 `MutationObserver` 它会在指定的`DOM`发生变化时被调用。


#### 方法

> `disconnect():` 阻止 `MutationObserver` 实例继续接收的通知，直到再次调用其`observe()`方法，该观察者对象包含的回调函数都不会再被调用。

> `observe(target, options):` 接受两个参数，一个是监听的对象（target），一个是观察的选项(options)。

> `takeRecords():` 清空监听的队列，并返回结果。


### 执行逻辑

1. 先执行监听的微任务队列；
2. 执行完微任务队列之后就把所监听的记录封装成一个数组来处理；
3. 然后返回处理结果。


### 参数说明

options可选参数如下:

| 参数名 | 参数描述
| :--- | :--- | 
| childList  | 监听目标子节点的变化。
| attributes  | 监听目标属性的变化。
| characterData  | 监听目标数据的变化。
| subtree  | 监听目标以及其后代的变化。
| attributeOldValue  | 监听目标属性变化前的具体值。
| characterDataOldValue  | 监听目标数据变化前的具体值。
| attributeFilter  | 不需要监听的属性列表（此属性填入过滤的属性列表）。

### 示例

```js
// Select the node that will be observed for mutations
var targetNode = document.getElementById('some-id');

// Options for the observer (which mutations to observe)
var config = { attributes: true, childList: true, subtree: true };

// Callback function to execute when mutations are observed
var callback = function(mutationsList) {
    for(var mutation of mutationsList) {
        if (mutation.type == 'childList') {
            console.log('A child node has been added or removed.');
        }
        else if (mutation.type == 'attributes') {
            console.log('The ' + mutation.attributeName + ' attribute was modified.');
        }
    }
};

// Create an observer instance linked to the callback function
var observer = new MutationObserver(callback);

// Start observing the target node for configured mutations
observer.observe(targetNode, config);

// Later, you can stop observing
observer.disconnect();
```