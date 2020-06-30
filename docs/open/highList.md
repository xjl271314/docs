# 如何设计高性能的渲染列表

- 2020.05.21

## 为什么需要使用虚拟列表？

假设我们的列表有10000条记录，我们同时将10000条记录渲染到页面中，先来看看需要花费多长时间：

```js
import React, {
    useRef
} from 'react';
import './index.scss';

function Example() {
    const listRef = useRef(null); 

    const btnClick = () =>{
        // 记录任务开始时间
        let now = Date.now();
        // 插入一万条数据
        const totalSize = 10000;
        // 获取容器
        let list = listRef.current;
        // 将数据放入容器中
        for (let i = 0; i < totalSize; i++ ){
            let li = document.createElement('li');
            li.innerText = `我是列表项${i}`;
            list.append(li)
        }
        console.log('JS运行时间', Date.now() - now);// 24
        setTimeout(()=>{
            console.log('总运行时间', Date.now() - now);// 327
        },0)
    }

    return (
        <div className="page-container" >
            <button onClick={btnClick}> button </button><br/>
            <ul ref={listRef} ></ul>
        </div>
    )
}

export default Example;
```

当我们点击按钮的时候,会像`ul`追加`10000`个`li`元素,打开`Google`浏览器`performance`可以看到.

![Performance](https://img-blog.csdnimg.cn/2020052118013627.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

从上图可以看出代码总共执行了321ms,其中的主要时间消耗如下:

- `Event(click)` : 25.96ms

- `Recalculate Style` : 49.19ms

- `Layout` : 251.81ms

- `Update Layer Tree` : 17.03ms

- `Paint` : 2ms

从这里我们可以看出，我们的代码的执行过程中，消耗时间最多的两个阶段是 `RecalculateStyle`和 `Layout`。

- `RecalculateStyle`：样式计算，浏览器根据css选择器计算哪些元素应该应用哪些规则，确定每个元素具体的样式。

- `Layout`：布局，知道元素应用哪些规则之后，浏览器开始计算它要占据的空间大小及其在屏幕的位置。

在实际的工作中，列表项必然不会像例子中仅仅只由一个li标签组成，必然是由复杂DOM节点组成的。

那么可以想象的是，当列表项数过多并且列表项结构复杂的时候，同时渲染时，会在`RecalculateStyle`和 `Layout`阶段消耗大量的时间。

而 `虚拟列表` 就是解决这一问题的一种实现。

## 什么是虚拟列表？

> `虚拟列表`其实是按需显示的一种实现，即只对`可见区域`进行渲染，对`非可见区域`中的数据不渲染或部分渲染的技术，从而达到极高的渲染性能。

假设有1万条记录需要同时渲染，我们屏幕的 可见区域的高度为 `400px`,而列表项的高度为 `50px`，则此时我们在屏幕中最多只能看到8个列表项，那么在首次渲染的时候，我们只需加载8条即可。

![示例](https://img-blog.csdnimg.cn/20200521190925940.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

说完首次加载，再分析一下当滚动发生时，我们可以通过计算当前滚动值得知此时在屏幕 可见区域应该显示的列表项。

假设滚动发生，滚动条距顶部的位置为 `150px`,则我们可得知在 可见区域内的列表项为 第4项至`第11项。

![滚动示例](https://img-blog.csdnimg.cn/20200521191426491.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

## 实现虚拟列表

> 虚拟列表的实现，实际上就是在首屏加载的时候，只加载 可视区域内需要的列表项，当滚动发生时，动态通过计算获得 可视区域内的列表项，并将 非可视区域内存在的列表项删除。

- 计算当前 可视区域起始数据索引( startIndex)
- 计算当前 可视区域结束数据索引( endIndex)
- 计算当前 可视区域的数据，并渲染到页面中
- 计算 startIndex对应的数据在整个列表中的偏移位置 startOffset并设置到列表上

由于只是对 可视区域内的列表项进行渲染，所以为了保持列表容器的高度并可正常的触发滚动，将Html结构设计成如下结构：

```html
<div className="page-container" >
    <div className="infinite-list-container">
        <div className="infinite-list-phantom"></div>
        <div className="infinite-list">
            <!-- item-1 -->
            <!-- item-2 -->
            <!-- ... -->
            <!-- item-n -->
        </div>
    </div>
</div>
```

- `infinite-list-container` 为可视区域的容器

- `infinite-list-phantom` 为容器内的占位，高度为总列表高度，用于形成滚动条

- `infinite-list` 为列表项的渲染区域


接着，监听 `infinite-list-container`的 `scroll`事件，获取滚动位置 `scrollTop`。


- 假定 可视区域高度固定，称之为 `screenHeight`

- 假定 列表每项高度固定，称之为 `itemSize`

- 假定 列表数据称之为 `listData`

- 假定 当前滚动位置称之为 `scrollTop`

则可推算出：

- 列表总高度 `listHeight = listData.length * itemSize`

- 可显示的列表项数 `visibleCount = Math.ceil(screenHeight / itemSize)`

- 数据的起始索引 `startIndex = Math.floor(scrollTop / itemSize)`

- 数据的结束索引 `endIndex = startIndex + visibleCount`

- 列表显示数据为 `visibleData = listData.slice(startIndex,endIndex)`

当滚动后，由于 渲染区域相对于 可视区域已经发生了偏移，此时我需要获取一个偏移量 `startOffset`，通过样式控制将渲染区域偏移至可视区域中。

> 偏移量 `startOffset = scrollTop - (scrollTop % itemSize);`


基于以上理论和考虑到实际情况列表高度不固定的情况下我们实现了一下的列表组件。

```jsx
import React,{ useRef, useState, useEffect, useCallback, useLayoutEffect } from 'react';
import './index.scss';

const throttle = (fn, timehold = 450)=> {
    let startTime = new Date().getTime();
    const context = this;

    return function () {
        const currentTime = new Date().getTime();
        if (currentTime - startTime >= timehold) {
            fn.apply(context, [...arguments]);

            startTime = currentTime;
        }
    };
};

const VirtualList = props =>{
    const listRefs = [];
    const { list = [] } = props;
    const listContainer = useRef();
    const [ defaultHeight, setDefaultHeight] = useState(50);
    const [ positions, setPositions ] = useState({});
    const [ listHeight, setListheight ] = useState(0);
    // const [ visibleHeight, setVisibleHeight] = useState(0);
    const [ visibleNumber, setVisibleNumber] = useState(0);
    const [ transferOffset, setTransferOffset] = useState(0);
    const [ visibleList, setVisibleList] = useState(list);
    const [ startIndex, setStartIndex] = useState(0);
    const [ endIndex, setEndIndex] = useState(0);

    // 初始化参数
    useEffect(()=>{
        const initPositions = () => {
            const options = list.map ((d, index) => ({
                index,
                height: defaultHeight,
                top: index * defaultHeight,
                bottom: (index + 1) * defaultHeight
            }));
            setPositions(options);
        };

        initPositions();

        return () => initPositions();
    },[list, defaultHeight]);


    // 获取列表起始索引
    const getStartIndex = useCallback((top = 0) => binarySearch(positions, top), [positions]);

    // 二分法查找
    const binarySearch = (list, value) => {
        let start = 0;
        let end = list.length - 1;
        let tempIndex = null;
        while (start <= end) {
          let midIndex = parseInt((start + end) / 2);
          let midValue = list[midIndex].bottom;
          if (midValue === value) {
            return midIndex + 1;
          } else if (midValue < value) {
            start = midIndex + 1;
          } else if (midValue > value) {
            if (tempIndex === null || tempIndex > midIndex) {
              tempIndex = midIndex;
            }
            end = end - 1;
          }
        }
        return tempIndex;
    };

    //获取列表项的当前尺寸
    const updateItemsSize = useCallback(() => {
        const nodes = listRefs;
        nodes && nodes.forEach(node => {
          const rect = node.getBoundingClientRect();
          let { height } = rect;
          let index = +node.id;
          let oldHeight = positions[index].height;
          let dValue = oldHeight - height;
          //存在差值
          if (dValue) {
            positions[index].bottom = positions[index].bottom - dValue;
            positions[index].height = height;
            for (let k = index + 1; k < positions.length; k++) {
                positions[k].top = positions[k - 1].bottom;
                positions[k].bottom = positions[k].bottom - dValue;
            }
            setPositions(positions);
            setDefaultHeight(height);
          }
        });
    },[listRefs, positions]);

    // 更新偏移量
    const setStartOffset = useCallback(() =>{
      let startOffset = startIndex >= 1 ? positions[startIndex - 1].bottom : 0;
      setTransferOffset(startOffset);
    },[positions, startIndex]);

    // 滚动监听
    const listScroll = throttle(e => {
        const $ref = listContainer.current;
        const scrollTop = $ref.scrollTop;
        // 此时开始的索引值
        setStartIndex(getStartIndex(scrollTop));
        // 此时结束的索引值
        setEndIndex(startIndex + visibleNumber);
        // 列表偏移量
        setStartOffset();
    },30);

    useEffect(()=>{
        const $ref = listContainer.current;
        const scrollTop = $ref.scrollTop;
        const clientHeight = $ref.getBoundingClientRect().height;
        // 正常的总列表高度
        const height = list.length * defaultHeight + 'px';
        // setVisibleHeight(clientHeight);
        setListheight(height);
        // 可显示的列表数
        setVisibleNumber(Math.ceil(clientHeight / defaultHeight));
        // 列表偏移量
        setTransferOffset(scrollTop - (scrollTop % defaultHeight));
        // 此时开始的索引值
        setStartIndex(getStartIndex(scrollTop));
        // 此时结束的索引值
        setEndIndex(startIndex + visibleNumber);
        // 可见的列表数据
        setVisibleList(list.slice(startIndex, endIndex));
        
    },[endIndex, getStartIndex, list, startIndex, visibleNumber, defaultHeight]);

    // 等待列表DOM更新
    useLayoutEffect(()=>{
        if (!listRefs || listRefs.length === 0 || Object.keys(positions).length === 0){
            return ;
        }
        // 获取真实元素大小，修改对应的尺寸缓存
        updateItemsSize();
       // 更新列表总高度
       let height = positions[positions.length - 1].bottom;
       setListheight(height);
       // 更新真实偏移量
       setStartOffset();
    }, [listRefs, positions, setStartOffset, updateItemsSize]);

    return (
        <div ref={listContainer} onScroll={listScroll} className="infinite-list-container">
            {/* 容器内的占位，高度为总列表高度，用于形成滚动条 */}
            <div className="infinite-list-phantom" style={{ height: listHeight}}></div>
            <div className="infinite-list" style={{ transform:[`translateY(${transferOffset}px)`]}}>
            {
                visibleList.map((item, index) => <div key={index} id={item} ref={n=>listRefs[index] = n} className="infinite-list-item">我是列表项{item}</div>)
            }</div>
        </div>
    )
}
export default React.memo(VirtualList);
```

CSS样式如下:

```scss
.infinite-list-container{
    position: relative;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
    height: 60vh;
}

.infinite-list-phantom {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    z-index: -1;
}

.infinite-list {
    left: 0;
    right: 0;
    top: 0;
    position: absolute;
}

.infinite-list-item{
    display: flex;
    // height: 50px;
    justify-content: center;
    align-items: center;
    background-color: green;
    color: #FFF;
    font-size: 24px;
    box-sizing: border-box;
    border-bottom: 1px solid #EEE;
}
```

:::tip
内部Item组件的实现可以采用外部传入的方法,这里不做展开。

Vue 版本的可以参考[原作者的地址](https://codesandbox.io/s/virtuallist2-1bqk6)
:::
