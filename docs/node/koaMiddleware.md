# Koa2中间件实现原理解析

- 2020.04.15

本文主要是针对koa2内部分中间件实现原理的剖析。先来看官方的一段代码:


```js
const Koa = require('koa');
const app = new Koa();

// logger
app.use(async (ctx, next) => {
  await next();
  const rt = ctx.response.get('X-Response-Time');
  console.log(`${ctx.method} ${ctx.url} - ${rt}`);
});

// x-response-time
app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.set('X-Response-Time', `${ms}ms`);
});

// response
app.use(async ctx => {
  ctx.body = 'Hello World';
});

app.listen(3000);

// 执行顺序
// start--->Hello World--->X-Response-Time--->console.log(`${ctx.method} ${ctx.url} - ${rt}`);
```

## 实现 app.use

`app.use` ，从使用角度分析它的用意，其实就是`注册中间件函数`。因此，首先可以这样定义我们自己的 Koa 代码，新建一个 `koa.js` ，开始编写：

```js
class Koa {
    constructor() {
        this.middlewareList = []
    }

    // 核心方法
    use(fn) {
        this.middlewareList.push(fn)
        return this;
    }
}
```

- 首先定一个类，然后构造函数中初始化 `middelwareList` 数组，用以存储所有的中间件函数。

- `use`中接收中间件函数，然后放到 `middelwareList` 数组中，就算是注册完成。

- 最后 `return this` 是为了能实现链式操作，例如 `app.use(fn1).use(fn2).use(fn3)`。（这个和`jquery`中的链式实现思想是一致的。）

## 实现 app.listen

`app.listen(3000)` 启动服务监听，实质就是使用 `nodejs `原生的 `http` 处理方式。代码如下：


```js
const http = require('http');

class Koa {
    constructor() {
        this.middlewareList = []
    }

    // 核心方法
    use(fn) {
        this.middlewareList.push(fn)
        return this
    }

	// 将 req res 组合成为 ctx
    createContext(req, res) {
        // 简单模拟 koa 的 ctx
        const ctx = {
            req,
            res,
            //...其他属性
        }
        return ctx
    }

	// 生成 http.createServer 需要的回调函数
	callback() {
        return (req, res) => {
            const ctx = this.createContext(req, res)
        }
    }

    listen(...args) {
        const server = http.createServer(this.callback())
        return server.listen(...args);
    }
}
```

- `node.js` 原生的 `http.createServer` 需要传入一个回调函数，在 `callback()` 中返回。

- 示例代码中中间件函数的第一个参数都是 `ctx` ，其实可以简答理解为 `res` 和 `req` 的集合，通过 `createContext` 合并一下即可。

## compose 组合中间件

`Koa2` 中通过一个 `compose` 函数来组合中间件，以及实现了 `next` 机制。

```js
// 传入中间件列表
function compose(middlewareList) {
	// 返回一个函数，接收 ctx （即 res 和 req 的组合）—— 记住了，下文要用
    return function (ctx) {
	    // 定义一个派发器，这里面就实现了 next 机制
        function dispatch(i) {
	        // 获取当前中间件
            const fn = middlewareList[i];
            try {
                return Promise.resolve(
	                // 通过 i + 1 获取下一个中间件，传递给 next 参数
                    fn(ctx, dispatch.bind(null, i + 1))
                )
            } catch (err) {
                return Promise.reject(err);
            }
        }
        // 开始派发第一个中间件
        return dispatch(0)
    }
}
```

- 第一，定义 `compose` 函数，并接收中间件列表。

- 第二，`compose` 函数中返回一个函数，该函数接收 `ctx` ，下文会用这个返回的函数。

- 第三，再往内部，定义了一个 `dispatch `函数，就是一个中间件的派发器，参数 `i` 就代表派发第几个中间件。执行 `dispatch(0)` 就是开发派发第一个中间件。

- 第四，派发器内部，通过 `i` 获取当前的中间件，然后执行。执行时传入的第一个参数是 `ctx` ，第二个参数是 `dispatch.bind(null, i + 1)` 即下一个中间件函数 —— 也正好对应到示例代码中中间件的 `next` 参数。

- 用 `Promise.resolve` 封装起来，是为了保证函数执行的结果必须是 `Promise` 类型。


## 完善 callback

有了 `compose` 之后，`callback` 即可被完善起来,部分代码如下:

```js
// 处理中间件的 http 请求
handleRequest(ctx, middleWare) {
    // 这个 middleWare 就是 compose 函数返回的 fn
    // 执行 middleWare(ctx) 其实就是执行中间件函数，然后再用 Promise.resolve 封装并返回
    return middleWare(ctx)
}
  
callback() {
    const fn = compose(this.middlewareList)

    return (req, res) => {
        const ctx = this.createContext(req, res)
        return this.handleRequest(ctx, fn)
    }
}
```

## 完整代码

```js
const http = require('http');

// 组合中间件
function compose(middlewareList) {
    return function (ctx) {
        function dispatch(i) {
            const fn = middlewareList[i]
            try {
                return Promise.resolve(
                    fn(ctx, dispatch.bind(null, i + 1))
                )
            } catch (err) {
                return Promise.reject(err)
            }
        }
        return dispatch(0)
    }
}

class Koa {
    constructor() {
        this.middlewareList = []
    }

    // 核心方法
    use(fn) {
        this.middlewareList.push(fn)
        return this
    }

    // 处理中间件的 http 请求
    handleRequest(ctx, middleWare) {
        // 这个 middleWare 就是 compose 函数返回的 fn
        // 执行 middleWare(ctx) 其实就是执行中间件函数，然后再用 Promise.resolve 封装并返回
        return middleWare(ctx)
    }

    // 将 req res 组合成为 ctx
    createContext(req, res) {
        // 简单模拟 koa 的 ctx ，不管细节了
        const ctx = {
            req,
            res
        }
        return ctx
    }

    callback() {
        const fn = compose(this.middlewareList)

        return (req, res) => {
            const ctx = this.createContext(req, res)
            return this.handleRequest(ctx, fn)
        }
    }

    listen(...args) {
        const server = http.createServer(this.callback())
        return server.listen(...args);
    }
}

module.exports = Koa;
```