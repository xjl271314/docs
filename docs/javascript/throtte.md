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