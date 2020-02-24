# 节流与防抖

> 在前端开发的过程中，我们经常会需要绑定一些持续触发的事件，如 `resize`、`scroll`、`mousemove`、`touchmove` 等等，但有些时候我们并不希望在事件持续触发的过程中那么频繁地去执行函数。这时候就用到`防抖与节流`。


### 函数防抖（debounce）：

> 在事件被触发n秒之后再执行回调，如果在这n秒内又被触发,则重新开始计时。

### 防抖应用场景

1. 搜索框输入查询，如果用户一直在输入中，没有必要不停地调用去请求服务端接口，等用户停止输入的时候，再调用，设置一个合适的时间间隔，有效减轻服务端压力。

2. 表单验证。

3. 按钮提交事件。

4. 浏览器窗口缩放，`resize`事件(如窗口停止改变大小之后重新计算布局)等。

### 防抖(非立即执行版)
```js
// 非立即执行版的意思是触发事件后函数不会立即执行，而是在 n 秒后执行
// 如果在 n 秒内又触发了事件，则会重新计算函数执行时间。
function debounce(func, delay){
    let timer = null;
    return function(){
        let context = this;
        let args = arguments;
        if(timer){
            clearTimeout(timer)
        }
        timer = setTimeout(()=>{
            func.apply(context, args)
        }, delay)
    }
}

```


### 防抖(立即执行版)
```js
// 立即执行版的意思是触发事件后函数会立即执行，然后 n 秒内不触发事件才能继续执行函数的效果
function debounce(func, delay){
    let timer = null;
    return function () {
        let context = this;
        let args = arguments;
        if (timer) {
            clearTimeout(timer);
        }
        let callNow = !timer;
        timer = setTimeout(() => {
            timer = null;
        }, delay)
        if (callNow) func.apply(context, args)
    }
}

```

### 函数节流(throttle)

> 规定在一个指定时间内，函数只会触发一次。如果在这个时间内多次触发调用函数的事件，只有一次会生效。

### 函数节流应用场景

1. 按钮点击事件

2. 拖拽事件

3. `onScoll`事件

4. 计算鼠标移动的距离(mousemove)

:::tip
**函数节流主要有两种实现方法：`时间戳`和`定时器`**
:::

### 函数节流时间戳版

```js
function throttle(func, delay) {
    let previous = 0;
    return function() {
        let now = Date.now();
        let context = this;
        let args = arguments;
        if (now - previous > delay) {
            func.apply(context, args);
            previous = now;
        }
    }
}
```

### 函数节流定时器版

```js
function throttle(func, delay) {
    let timer = null;
    return function() {
        let context = this;
        let args = arguments;
        if (!timer) {
            timer = setTimeout(() => {
                timer = null;
                func.apply(context, args)
            }, delay)
        }
    }
}
```

### 总结

- `函数防抖`：将几次操作合并为一此操作进行。原理是维护一个计时器，规定在delay时间后触发函数，但是在delay时间内再次触发的话，就会取消之前的计时器而重新设置。这样一来，只有最后一次操作能被触发。


- `函数节流`：使得一定时间内只触发一次函数。原理是通过判断是否到达一定时间来触发函数。


### 区别：

函数节流不管事件触发有多频繁，都会保证在规定时间内一定会执行一次真正的事件处理函数，而函数防抖只是在最后一次事件后才触发一次函数。 比如在页面的无限加载场景下，我们需要用户在滚动页面时，每隔一段时间发一次 `Ajax` 请求，而不是在用户停下滚动页面操作时才去请求数据。这样的场景，就适合用节流技术来实现。

