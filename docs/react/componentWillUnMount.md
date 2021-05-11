# 组件销毁时销毁页面定时器、清理异步操作和取消请求

- 2021.05.07

从`componentWillUnMount`生命周期出发,我们都知道在该生命周期是不能去`setState`的，如果你遗忘了的话,再来回顾一下:

> `componentWillUnmount()` 中不应调用 `setState()`，因为该组件将永远不会重新渲染。组件实例卸载后，将永远不会再挂载它。

如果我们在其中执行了某些`setState()`,我们就会看到熟悉的警告 ⚠️:

:::warning
`Warning: Can't perform a React state update on an unmounted component. This is a no-op, but it indicates a memory leak in your application. To fix, cancel all subscriptions and asynchronous tasks in the componentWillUnmount method.`
:::

## 阻止异步操作

```js
componentWillUnmount() {
  this.setState = (state, callback) => {
    return;
  }
}
// hook
useEffect(() => {
    let isUnmounted = false;
    (async () => { //异步请求
        const res = await fetch(SOME_API);
        const data = await res.json();
        if (!isUnmounted) {
            setValue(data.value);
            setLoading(false);
        }
    })();

    return () => {
        isUnmounted = true;
    }
}, []);
```

## 阻止请求(axios)

```js
import React from 'react';

class App extends React.Component {

    constructor(props) {
	    this.source = axios.CancelToken.source() //生成取消令牌用于组件卸载阻止axios请求
    }

    componentDidMount = () => {
        const url = "http://xxx/api/xxxx";
        axios.get(url, {
            cancelToken: this.source.token
        }).then(res => {
                ...
        }).catch(function(thrown) {
            if (axios.isCancel(thrown)) {
                console.log('Request canceled', thrown.message);
            } else {
                console.log(thrown)
            }
        })
    }

    componentWillUnMount = () => {
        //阻止请求
        this.source.cancel('组件卸载,取消请求');
    }
}
```

## 清除定时

```js
import React from "react";

class App extends React.Component {
  timer = null;

  componentDidMount = () => {
    this.timer = setTimeout(() => {
      this.setState({ a: 123 });
    }, 1000);
  };
  componentWillUnMount = () => {
    this.timer && clearTimeout(this.timer);
  };
}
```

## ajax、fetch、axios 如何中断请求？

AbortController 实验室功能，已经在主流浏览器实现，IE 浏览器可以不支持，需要导入 polyfill。

`AbortController`接口表示一个控制器对象，允许你根据需要中止一个或多个 `Web请求`。[官网参考:](https://developer.mozilla.org)

- ### axios

axios 已经实现 AbortController，具体实践如下：

```js
import React, { useEffect } from "react";
import axios from "axios";

const AbortController = () => {
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();

  const abort = () => {
    source.cancel("cancle request!");
  };

  useEffect(() => {
    axios
      .post(
        "http://127.0.0.1:8088/getData",
        { name: "admin", pwd: "123456" },
        { cancelToken: source.token }
      )
      .then((res) => {
        console.log(res);
      });

    return () => {
      abort();
    };
  }, []);

  return (
    <>
      <div>
        <button onClick={abort}>取消请求</button>
      </div>
    </>
  );
};

export default AbortController;
```

`axios`是如何实现请求中断的，大致原理是从外部操作中断内部`promise`流。

**原理解析**:

```js
function CancelToken(executor) {
  if (typeof executor !== "function") {
    throw new TypeError("executor must be a function.");
  }

  var resolvePromise;
  this.promise = new Promise(function promiseExecutor(resolve) {
    resolvePromise = resolve;
  });

  var token = this;
  executor(function cancel(message) {
    if (token.reason) {
      // Cancellation has already been requested
      return;
    }

    token.reason = new Cancel(message);
    resolvePromise(token.reason);
  });
}

CancelToken.source = function source() {
  var cancel;
  var token = new CancelToken(function executor(c) {
    cancel = c;
  });
  return {
    token: token,
    cancel: cancel,
  };
};
```

`c`指`cancel`函数，当执行`source.cancel()`时从外部去操作`CancelToken`的私有属性`resolvePromise`，也就是`resolve`函数。

- ### fetch

`fetch`直接使用`AbortController`来中断请求，详细如下：

首先安装`abort-controller`库，该库实现了`web abort-controller`。

> yarn add abort-controller -S

```js
import React, { useEffect } from "react";
import Controller from "abort-controller";

const AbortController = () => {
  const abortController = new Controller();

  const abort = () => {
    abortController.abort();
  };

  useEffect(() => {
    fetch("http://127.0.0.1:8088/getData", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "zs",
        pwd: "123456",
      }),
      signal: abortController.signal,
    });

    return () => {
      abort();
    };
  }, []);

  return (
    <>
      <div>
        <button onClick={abort}>取消请求</button>
      </div>
    </>
  );
};

export default AbortController;
```

- ### `$.ajax`

`$.ajax` 内部已经实现了 `abort` 功能。

```ts
ajax(settings?: JQuery.AjaxSettings): JQuery.jqXHR;

interface jqXHR<TResolve = any> extends Promise3<TResolve, jqXHR<TResolve>, never,
        Ajax.SuccessTextStatus, Ajax.ErrorTextStatus, never,
        jqXHR<TResolve>, string, never>,
        Pick<XMLHttpRequest, 'abort' | 'getAllResponseHeaders' | 'getResponseHeader' | 'overrideMimeType' | 'readyState' | 'responseText' |
            'setRequestHeader' | 'status' | 'statusText'>,
        Partial<Pick<XMLHttpRequest, 'responseXML'>> {
            responseJSON?: any;
            // 中断请求
            abort(statusText?: string): void;

            state(): 'pending' | 'resolved' | 'rejected';
            statusCode(map: Ajax.StatusCodeCallbacks<any>): void;
        }
```

具体例子：

```js
import React, { useEffect } from "react";
import $ from "jquery";

const AbortController = () => {
  var abortController: JQuery.jqXHR<any> | null = null;

  const abort = () => {
    abortController?.abort();
  };

  useEffect(() => {
    abortController = $.ajax({
      url: "http://127.0.0.1:8088/getData",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify({
        name: "zs",
        pwd: "123456",
      }),
      success: function(res) {
        console.log(res);
      },
    });

    return () => {
      abort();
    };
  }, []);

  return (
    <>
      <div>
        <button onClick={abort}>取消请求</button>
      </div>
    </>
  );
};

export default AbortController;
```
