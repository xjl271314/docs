# 合成事件(SyntheticEvent)

> `SyntheticEvent` 实例将被传递给你的事件处理函数，它是浏览器的原生事件的跨浏览器包装器。除兼容所有浏览器外，它还拥有和浏览器原生事件相同的接口，包括 `stopPropagation()` 和 `preventDefault()`。

## 事件池

`SyntheticEvent` 是合并而来。这意味着 `SyntheticEvent` 对象可能会被重用，而且在事件回调函数被调用后，所有的属性都会无效。出于性能考虑，你不能通过异步访问事件。

```jsx
function onClick(event) {
  console.log(event); // => nullified object.
  console.log(event.type); // => "click"
  const eventType = event.type; // => "click"

  setTimeout(function() {
    console.log(event.type); // => null
    console.log(eventType); // => "click"
  }, 0);

  // 不起作用，this.state.clickEvent 的值将会只包含 null
  this.setState({clickEvent: event});

  // 你仍然可以导出事件属性
  this.setState({eventType: event.type});
}
```

:::warning
如果你想异步访问事件属性，你需在事件上调用 `event.persist()`，此方法会从池中移除合成事件，允许用户代码保留对事件的引用。
:::

## 支持的事件

`React` 通过将事件 `normalize` 以让他们在不同浏览器中拥有一致的属性。

`React` 中的 `click` 事件被命名为 `onClick`类似的其他事件都以`on`开头，事件默认都是在`冒泡阶段`被触发的。

如需注册捕获阶段的事件处理函数，则应为事件名添加 `Capture`。例如，处理捕获阶段的点击事件请使用 `onClickCapture`，而不是 `onClick`。

## 为什么与怎么做？

**Q: 为什么React要自己实现一套事件系统？以及React的事件系统是怎么运作起来的？**


### 先来看几个简单的例子:

**1. 运行下面的代码，输出ABCD的顺序是？如果在`innerClick`中把`e.stopPropagation()`加上，输出ABCD的顺序是？**

```js
class App extends React.Component {
  innerClick = e => {
    console.log("A: react inner click.");
    // e.stopPropagation();
  };

  outerClick = () => {
    console.log("B: react outer click.");
  };

  componentDidMount() {
    document.getElementById("outer").addEventListener("click", () => console.log("C: native outer click"));

    window.addEventListener("click", () =>
      console.log("D: native window click")
    );
  }

  render() {
    return (
      <div id="outer" onClick={this.outerClick}>
        <button id="inner" onClick={this.innerClick}>
          BUTTON
        </button>
      </div>
    );
  }
}
/**
 * C: native outer click
 * A: react inner click.
 * B: react outer click.
 * D: native window click
 * 
 * 加上stopPropagation
 * 
 * C: native outer click
 * A: react inner click.
 * /
```

**2. 有一个`Modal(弹窗组件)`，我们需要在点击除弹窗内容意外的区域关闭弹窗，点击弹窗区域的话保留弹窗，但是实际点击弹窗也会被关闭?**
```jsx
class Modal extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: props.visible
        }
    }

    componentDidMount() {
        document.body.addEventListener('click', this.handleClickBody, false)
    }

    componentWillUnmount() {
        document.body.removeEventListener('click', this.handleClickBody, false)
    }

    handleClickBody = (e) => {
        document.body.style.overflow = 'visible'
        console.log('click body')
        this.setState({
            showBox:false
        })
    }
    
    handleClickButton=(e)=>{
        document.body.style.overflow = 'hidden'
        this.setState({
            showBox:true
        })
    }
    clickModal=(e)=>{
        console.log('click modal',e)
        e.stopPropagation()

    }
    render() {
        const { showBox } = this.state 
        return (
            <div>
                <button onClick={this.handleClickButton}>点我显示弹窗</button>
                {showBox && <div 
                    className="modal"
                    onClick={this.clickModal}
                >
                {this.props.children}
                </div>
                }
            </div> 
        )
    }
}

/**
 * 只会输出 click body
 * 
 * /
```

**Q: 为什么`React`要实现自己的事件合成系统？** 

**A: 主要是为了`性能`和`复用`两个方面来考虑。**

![React事件合成系统架构](https://img-blog.csdnimg.cn/20200218113910575.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

1. 首先对于性能来说，`React`作为一套`View`层面的UI框架，通过渲染得到`vDOM`，再由`diff`算法决定`DOM`树哪些结点需要新增、替换或修改，假如直接在`DOM`结点插入原生事件监听，则会导致频繁的调用`addEventListener`和`removeEventListener`，造成性能的浪费。所以`React`采用了事件代理的方法，对于大部分事件而言都在`document`上做监听，然后根据`Event`中的`target`来判断事件触发的结点。

2. 其次`React`合成的`SyntheticEvent`采用了`池`的思想，从而达到节约内存，避免频繁的创建和销毁事件对象的目的。这也是如果我们需要异步使用一个`syntheticEvent`，需要执行`event.persist()`才能防止事件对象被释放的原因。

3. 最后在`React`源码中随处可见`batch`做批量更新，基本上凡是可以批量处理的事情（最普遍的setState）`React`都会将中间过程保存起来，留到最后面才`flush`掉。就如浏览器对`DOM`树进行`Style`，`Layout`，`Paint`一样，都不会在操作`ele.style.color='red'`;之后马上执行，只会将这些操作打包起来并最终在需要渲染的时候再做渲染。

```js
ele.style.color='red'; 
ele.style.color='blue';
ele.style.color='red';
// 只会执行最后一次
```

而对于复用来说，`React`看到在不同的浏览器和平台上，用户界面上的事件其实非常相似，例如普通的`click`，`change`等等。`React`希望通过封装一层事件系统，将不同平台的原生事件都封装成`SyntheticEvent`。这样做的好处主要有以下亮点:

1. 使得不同平台只需要通过加入`EventEmitter`以及对应的`Renderer`就能使用相同的一个事件系统，`WEB`平台上加入`ReactBrowserEventEmitter`，`Native`上加入`ReactNativeEventEmitter`。如下图，对于不同平台，`React`只需要替换掉左边部分，而右边`EventPluginHub`部分可以保持复用。

2. 而对于不同的浏览器而言，`React`帮我们统一了事件，做了浏览器的兼容，例如对于`transitionEnd`,`webkitTransitionEnd`,`MozTransitionEnd`和`oTransitionEnd`, `React`都会集合成`topAnimationEnd`，所以我们只用处理这一个标准的事件即可。

![React合成事件复用架构](https://img-blog.csdnimg.cn/20200218115403227.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)



**Q: `React`的事件系统是怎么运作起来的？**

### 事件绑定
我们来看一下我们在`JSX`中写的`onClickhandler`是怎么被记录到`DOM`结点上，并且在`document`上做监听的。

![React合成事件绑定架构](https://img-blog.csdnimg.cn/20200218115802914.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

`React`对于大部分事件的绑定都是使用`trapBubbledEvent`和`trapCapturedEvent`这两个函数来注册的。如上图所示，当我们执行了`render`或者`setState`之后，`React`的`Fiber调度系统`会在最后`commit`到`DOM`树之前执行`trapBubbledEvent`或`trapCapturedEvent`，通过执行`addEventListener`在`document`结点上绑定对应的`dispatch`作为handler负责监听类型为`topLevelType`的事件。

这里面的`dispatchInteractiveEvent`和`dispatchEvent`两个回调函数的区别为，`React16`开始换掉了原本`Stack Reconciliation`成`Fiber`希望实现异步渲染，所以异步渲染的情况下假如入我点了两次按钮，那么第二次按钮响应的时候，可能第一次按钮的`handlerA`中调用的`setState`还未最终被`commit`到`DOM`树上，这时需要把第一次按钮的结果先给`flush`掉并`commit`到`DOM`树，才能够保持一致性。

这个时候就会用到`dispatchInteractiveEvent`。可以理解成`dispatchInteractiveEvent`在执行前都会确保之前所有操作都已最终`commit`到`DOM`树，再开始自己的流程，并最终触发`dispatchEvent`。但由于目前`React`仍是同步渲染的，所以这两个函数在目前的表现是一致的，希望`React17`会带给我们默认打开的异步渲染功能。

到现在我们已经在`document`结点上监听了事件了，现在需要来看如何将我们在`jsx`中写的`handler`存起来对应到相应的结点上。

在我们每次新建或者更新结点时，`React`最终会调用`createInstance`或者`commitUpdate`这两个函数，而这两个函数都会最终调用`updateFiberProps`这个函数，将`props`也就是我们的`onClick`，`onChange`等`handler`给存到`DOM`结点上。

至此，我们我们已经在`document`上监听了事件，并且将`handler`存在对应`DOM`结点。接下来需要看`React`怎么监听并处理浏览器的原生事件，最终触发对应的`handler`了。

### 事件触发

我会大概用下图这种方式来解析代码，左边是我点击一个绑定了`handleClick`的按钮后的`js`调用栈，右边是每一步的代码，均已删除部分不影响理解的代码。希望通过这种方式能使大家更易理解`React`的事件触发机制。

![在这里插入图片描述](https://img-blog.csdnimg.cn/2020021812205956.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

当我们点击一个按钮时，`click`事件将会最终冒泡至`document`，并触发我们监听在`document`上的`handler dispatchEvent`，接着触发`batchedUpdates`。`batchedUpdates`这个格式的代码在`React`的源码里面会频繁的出现，基本上`React`将所有能够批量处理的事情都会先收集起来，再一次性处理。

可以看到默认的`isBatching`是`false`的，当调用了一次`batchedUpdates`，`isBatching`的值将会变成`true`，此时如果在接下来的调用中有继续调用`batchedUpdates`的话，就会直接执行`handleTopLevel`,此时的`setState`等不会被更新到`DOM`上。直到调用栈重新回到第一次调用`batchedUpdates`的时候，才会将所有结果一起`flush`掉（更新到DOM上）。

![在这里插入图片描述](https://img-blog.csdnimg.cn/20200218122855794.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

有的同学可能问调用栈中的`BatchedUpdates$1`是什么？或者浏览器的`renderer`和Native的`renderer`是如何挂在到`React`的事件系统上的?

其实`React`事件系统里面提供了一个函数`setBatchingImplementation`，用来动态挂载不同平台的`renderer`，这个也体现了`React事件系统`的`复用`。

![在这里插入图片描述](https://img-blog.csdnimg.cn/20200218125958283.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

`handleTopLevel`会调用`runExtractedEventsInBatch()`，这是`React`事件处理最重要的函数。在`EventEmitter`里面做的事，其实主要就是这个函数的两步。

1. 第一步是根据原生事件合成合成事件，并且在`vDOM`上模拟捕获冒泡，收集所有需要执行的事件回调构成回调数组。
2. 第二步是遍历回调数组，触发回调函数。

![在这里插入图片描述](https://img-blog.csdnimg.cn/20200218130213836.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

首先调用`extractEvents`，传入原生事件`e`，`React`事件系统根据可能的事件插件合成合成事件`Synthetic e`。 这里我们可以看到调用了`EventConstructor.getPooled()`，从事件池中去取一个合成事件对象，如果事件池为空，则新创建一个合成事件对象，这体现了`React`为了性能实现了`池`的思想。

![在这里插入图片描述](https://img-blog.csdnimg.cn/20200218130347328.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

然后传入`Propagator`，在`vDOM`上模拟捕获和冒泡，并收集所有需要执行的事件回调和对应的结点。`traverseTwoPhase`模拟了捕获和冒泡的两个阶段，这里实现很巧妙，简单而言就是正向和反向遍历了一下数组。接着对每一个结点，调用`listenerAtPhase`取出事件绑定时挂载在结点上的回调函数，把它加入回调数组中。

![在这里插入图片描述](https://img-blog.csdnimg.cn/20200218130557346.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)


接着遍历所有合成事件。这里可以看到当一个事件处理完的时候，`React`会调用`event.isPersistent()`来查看这个合成事件是否需要被持久化，如果不需要就会释放这个合成事件，这也就是为什么当我们需要异步读取操作一个合成事件的时候，需要执行`event.persist()`，不然React就是在这里释放掉这个事件。

![在这里插入图片描述](https://img-blog.csdnimg.cn/20200218130734844.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

最后这里就是回调函数被真正触发的时候了，取出回调数组`event._dispatchListeners`，遍历触发回调函数。并通过`event.isPropagationStopped()`这一步来模拟停止冒泡。这里我们可以看到，`React`在收集回调数组的时候并不会去管我们是否调用了`stopPropagation`，而是会在触发的阶段才会去检查是否需要停止冒泡。

至此，一个事件回调函数就被触发了，里面如果执行了`setState`等就会等到调用栈弹回到最低部的`interactiveUpdate`中的被最终`flush`掉，构造`vDOM`，和好，并最终被`commit`到DOM上。

这就是事件触发的整个过程了，可以再看一下[React合成事件动画](https://www.lzane.com/tech/react-event-system-and-source-code/#%E4%BA%8B%E4%BB%B6%E8%A7%A6%E5%8F%91)，相信你会更加理解这个过程的。


**相信看到这里，如果你已经对React事件系统有所理解，现在回过头来让我们看看之前的两个例子。**

例子一:

1. 因为`React`事件监听是挂载在`document`上的，所以原生系统在`#outer`上监听的回调C会最先被输出；接着原生事件冒泡至`document`进入`React`事件系统，`React`事件系统模拟捕获冒泡输出A和B；最后`React`事件系统执行完毕回到浏览器继续冒泡到`window`，输出D。

2. 原生系统在`#outer上`监听的回调C会最先被执行；接着原生事件冒泡至`document`进入`React`事件系统，输出A，在`React`事件处理中`#inner`调用了`stopPropagation`，事件被停止冒泡。

:::warning
所以，最好不要混用`React事件系统`和`原生事件系统`，如果混用了，请保证你清楚知道会发生什么。
:::


例子二:

我们将事件监听绑定在`document`对象上，并在点击弹窗和按钮的时候阻止事件冒泡。

```jsx
export default class Modal extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            showBox: props.showBox
        }
    }

    componentDidMount() {
        document.addEventListener('click', this.handleClickBody, false)
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.handleClickBody, false)
    }

    handleClickBody = (e) => {
        document.body.style.overflow = 'visible'
        console.log('click body',e.target)
        this.setState({
            showBox:false
        })
    }
    
    handleClickButton=(e)=>{
        // React中专属的阻止事件冒泡方法
        e.nativeEvent.stopImmediatePropagation() 
        if(this.state.showBox) return
        document.body.style.overflow = 'hidden'
        console.log('click button')
        this.setState({
            showBox:true
        })
    }
    clickModal=(e)=>{
        e.nativeEvent.stopImmediatePropagation() 
        console.log('click modal',e.target)
    }
    render() {
        const { showBox } = this.state 
        return (
            <div>
                <button onClick={this.handleClickButton}>点我显示弹窗</button>
                {showBox && <div 
                    className="modal"
                    onClick={this.clickModal}
                />
                }
                {this.props.children}
            </div> 
        )
    }
}  
```
