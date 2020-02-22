# ajax、fetch与axios

### `Ajax`

`Ajax` 技术的核心是 `XMLHttpRequest` 对象（简称 `XHR`）,意味着用户可以不必刷新页面也能取得新数据。
也就是说，可以使用 XHR 对象取得新数据，然后再通过 DOM 将新数据插入到页面中。另外，虽然名字中包含 `XML` 的成分，但 `Ajax` 通信与数据格式无关；

这里讨论的原生XHR不考虑IE7之前的版本。

**Q: 如何创建一个XHR?**

```js
const xhr = new XMLHttpRequest();
```

### `XHR`的用法

在使用 `XHR` 对象时，要调用的第一个方法是 `open()`，它接受 3 个参数：

1. 要发送的请求的类型（"get"、"post"等）、
2. 请求的 URL 
3. 表示是否异步发送请求的布尔值。

```js
xhr.open("get", "example.php", false);
```
:::tip
这行代码会启动一个针对 `example.php` 的 GET 请求。有关这行代码，需要说明两点：

1. `URL`相对于执行代码的当前页面（当然也可以使用绝对路径）；
2. 调用 `open()`方法并不会真正发送请求，而只是启动一个请求以备发送。

:::

:::warning
只能向同一个域中使用相同端口和协议的 URL 发送请求。如果 URL 与启动请求的页面有任何差别，都会引发安全错误。
:::

要发送特定的请求，必须像下面这样调用 `send()`方法：

```js
xhr.open("get", "example.txt", false); 
xhr.send(null);
```

这里的 `send()`方法接收一个参数，即要作为请求主体发送的数据。

如果不需要通过请求主体发送数据，则必须传入 `null`，因为这个参数对有些浏览器来说是必需的。调用 `send()`之后，请求就会被分派到服务器。

在收到响应后，响应的数据会自动填充 `XHR` 对象的属性，相关的属性简介如下。

- `responseText`：作为响应主体被返回的文本。
- `responseXML`：如果响应的内容类型是`"text/xml"`或`"application/xml"`，这个属性中将保存包含着响应数据的 `XML DOM` 文档。
- `status`：响应的 `HTTP` 状态。
- `statusText`：`HTTP` 状态的说明。

在接收到响应后，第一步是检查 `status` 属性，以确定响应已经成功返回。

一般来说，可以将 `HTTP` 状态代码为 `200` 作为成功的标志。此时，`responseText` 属性的内容已经就绪，而且在内容类型正确的
情况下，`responseXML` 也应该能够访问了。

此外，状态代码为 `304` 表示请求的资源并没有被修改，可以直接使用浏览器中缓存的版本；当然，也意味着响应是有效的。为确保接收到适当的响应，应该像下面这样检查上述这两种状态代码：

```js
xhr.open("get", "example.txt", false); 
xhr.send(null); 
if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304){ 
    alert(xhr.responseText); 
} else { 
    alert("Request Fail: " + xhr.status); 
}
```

建议通过检测 `status` 来决定下一步的操作，不要依赖 `statusText`，因为后者在跨浏览器使用时不太可靠。另外，无论内容类型是什么，响应主体的内容都会保存到 `responseText` 属性中；而对于非 `XML` 数据而言，`responseXML` 属性的值将为 `null`。


### 异步XHR

像前面这样发送`同步请求`当然没有问题，但多数情况下，我们还是要发送`异步请求`，才能让`JavaScript` 继续执行而不必等待响应。

此时，可以检测 `XHR` 对象的 `readyState` 属性，该属性表示请求/响应过程的当前活动阶段。这个属性可取的值如下:

- `0`：未初始化。尚未调用 `open()`方法。
- `1`：启动。已经调用 `open()`方法，但尚未调用 `send()`方法。
- `2`：发送。已经调用 `send()`方法，但尚未接收到响应。
- `3`：接收。已经接收到部分响应数据。
- `4`：完成。已经接收到全部响应数据，而且已经可以在客户端使用了。


只要 `readyState` 属性的值由一个值变成另一个值，都会触发一次 `readystatechange` 事件。可以利用这个事件来检测每次状态变化后 `readyState` 的值。

通常，我们只对 `readyState` 值为 `4` 的阶段感兴趣，因为这时所有数据都已经就绪。

不过，必须在调用 `open()`之前指定 `onreadystatechange`事件处理程序才能确保跨浏览器兼容性。

```js
var xhr = new XMLHttpRequest(); 
xhr.onreadystatechange = function(){ 
    if (xhr.readyState == 4){ 
        if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304){ 
            alert(xhr.responseText); 
        } else { 
            alert("Request Fail: " + xhr.status); 
        } 
    } 
}; 
xhr.open("get", "example.txt", true); 
xhr.send(null);
```

**另外，在接收到响应之前还可以调用 `abort()`方法来取消异步请求，如下所示：**

```js
xhr.abort()
```

调用这个方法后，`XHR` 对象会停止触发事件，而且也不再允许访问任何与响应有关的对象属性。

### 设置HTTP头部信息

每个 `HTTP` 请求和响应都会带有相应的头部信息，`XHR` 对象也提供了操作这两种头部（即请求头部和响应头部）信息的方法。

默认情况下，在发送 `XHR` 请求的同时，还会发送下列头部信息。

- `Accept`：浏览器能够处理的内容类型。
- `Accept-Charset`：浏览器能够显示的字符集。
- `Accept-Encoding`：浏览器能够处理的压缩编码。
- `Accept-Language`：浏览器当前设置的语言。
- `Connection`：浏览器与服务器之间连接的类型。
- `Cookie`：当前页面设置的任何 `Cookie`。 
- `Host`：发出请求的页面所在的域 。 
- `Referer`：发出请求的页面的 URI。注意，HTTP 规范将这个头部字段拼写错了，而为保证与规范一致，也只能将错就错了。（这个英文单词的正确拼法应该是 referrer。）
- `User-Agent`：浏览器的用户代理字符串。

使用 `setRequestHeader()`方法可以设置自定义的请求头部信息。

这个方法接受两个参数：头部字段的名称和头部字段的值。

要成功发送请求头部信息，必须在调用 `open()`方法之后且调用 `send()`方法之前调用 `setRequestHeader()`，如下面的例子所示。

```js
var xhr = new XMLHttpRequest(); 
xhr.onreadystatechange = function(){ 
    if (xhr.readyState == 4){ 
        if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304){ 
            alert(xhr.responseText); 
        } else { 
            alert("Request Fail: " + xhr.status); 
        } 
    }
}
xhr.open("get", "example.php", true); 
xhr.setRequestHeader("token", "112233"); 
xhr.send(null);
```

调用 `XHR` 对象的 `getResponseHeader()`方法并传入头部字段名称，可以取得相应的响应头部信息。而调用 `getAllResponseHeaders()`方法则可以取得一个包含所有头部信息的长字符串。来看下面的例子。

```js
var myHeader = xhr.getResponseHeader("MyHeader"); 
var allHeaders = xhr.getAllResponseHeaders(); 
```

在服务器端，也可以利用头部信息向浏览器发送额外的、结构化的数据。在没有自定义信息的情况下，`getAllResponseHeaders()`方法通常会返回如下所示的多行文本内容：

```
Date: Sun, 14 Nov 2004 18:04:03 GMT 
Server: Apache/1.3.29 (Unix) 
Vary: Accept 
X-Powered-By: PHP/4.3.8 
Connection: close 
Content-Type: text/html; charset=iso-8859-1 
```

这种格式化的输出可以方便我们检查响应中所有头部字段的名称，而不必一个一个地检查某个字段是否存在。

### XHR使用GET请求

`GET` 是最常见的请求类型，最常用于向服务器查询某些信息。GET请求的参数需要追加到 `URL` 的末尾，以便将信息发送给服务器。对 `XHR` 而言，位于传入 `open()`方法的 `URL` 末尾的查询字符串必须经过正确的编码才行。

查询字符串中每个参数的名称和值都必须使用 `encodeURIComponent()`进行编码，然后才能放到 `URL` 的末尾；而且所有名-值对
儿都必须由和号`（&）`分隔，如下面的例子所示。

```js
xhr.open("get", "example.php?name1=value1&name2=value2", true);
```

下面这个函数可以辅助向现有 URL 的末尾添加查询字符串参数：

```js
function addURLParam(url, name, value) { 
    url += (url.indexOf("?") == -1 ? "?" : "&"); 
    url += encodeURIComponent(name) + "=" + encodeURIComponent(value); 
    return url; 
}
```

下面是使用这个函数来构建请求 URL 的示例。
```js
var url = "example.php"; 
//添加参数
url = addURLParam(url, "name", "Nicholas"); 
url = addURLParam(url, "book", "Professional JavaScript"); 
//初始化请求
xhr.open("get", url, false); 
```
在这里使用 `addURLParam()`函数可以确保查询字符串的格式良好，并可靠地用于 `XHR` 对象。

### XHR使用POST请求

`POST` 请求把数据作为请求的主体提交，请求的主体可以包含非常多的数据，而且格式不限。在 `open()`方法第一个参数的位置传入"post"，就可以初始化一个 `POST` 请求，如下面的例子所示。

```js
xhr.open("post", "example.php", true);
```

发送 `POST` 请求的第二步就是向 `send()`方法中传入某些数据。由于 `XHR` 最初的设计主要是为了处理 `XML`，因此可以在此传入 `XML DOM` 文档，传入的文档经序列化之后将作为请求主体被提交到服务器。当然，也可以在此传入任何想发送到服务器的字符串。

### FormData

现代 Web 应用中频繁使用的一项功能就是表单数据的序列化，`XMLHttpRequest 2` 级为此定义了`FormData` 类型。`FormData` 为序列化表单以及创建与表单格式相同的数据（用于通过 XHR 传输）提供了便利。下面的代码创建了一个 `FormData` 对象，并向其中添加了一些数据。

```js
var data = new FormData(); 
data.append("name", "Nicholas");
```

这个 `append()`方法接收两个参数：键和值，分别对应表单字段的名字和字段中包含的值。可以像这样添加任意多个键值对。而通过向 `FormData` 构造函数中传入表单元素，也可以用表单元素的数据预先向其中填入键值对儿：

```js
var data = new FormData(document.forms[0]);
```

创建了 `FormData` 的实例后，可以将它直接传给 `XHR` 的 `send()`方法，如下所示：

```js
var xhr = new XMLHttpRequest(); 
xhr.onreadystatechange = function(){ 
    if (xhr.readyState == 4){ 
        if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304){ 
            alert(xhr.responseText); 
        } else { 
            alert("Request Fail: " + xhr.status); 
        } 
    }
}
xhr.open("post", "example.php", true); 
xhr.setRequestHeader("token", "112233"); 
var form = document.getElementById("user-info");
xhr.send(new FormData(form));
```

:::tip
使用 `FormData` 的方便之处体现在不必明确地在 `XHR` 对象上设置请求头部。`XHR` 对象能够识别传入的数据类型是 `FormData` 的实例，并配置适当的头部信息。
:::

### 超时设定

`IE8`为 `XHR` 对象添加了一个 `timeout` 属性，表示请求在等待响应多少毫秒之后就终止。在给`timeout` 设置一个数值后，如果在规定的时间内浏览器还没有接收到响应，那么就会触发 `timeout` 事件，进而会调用 `ontimeout` 事件处理程序。这项功能后来也被收入了 `XMLHttpRequest 2` 级规范中。来看下面的例子。

```js
var xhr = new XMLHttpRequest(); 
xhr.onreadystatechange = function(){ 
    if (xhr.readyState == 4){ 
        try { 
            if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304){ 
                alert(xhr.responseText); 
            } else { 
                alert("Request was unsuccessful: " + xhr.status); 
            } 
        } catch (ex){ 
            // 假设由 ontimeout 事件处理程序处理
        } 
    } 
}; 
xhr.open("get", "timeout.php", true); 
xhr.timeout = 1000; // 将超时设置为 1 秒钟（仅适用于 IE8+）
xhr.ontimeout = function(){ 
    alert("Request Timeout."); 
}; 
xhr.send(null);
```

### overrideMimeType()方法

`Firefox` 最早引入了 `overrideMimeType()`方法，用于重写 `XHR` 响应的 `MIME` 类型。这个方法后来也被纳入了 `XMLHttpRequest 2` 级规范。

因为返回响应的 `MIME` 类型决定了 `XHR` 对象如何处理它，所以提供一种方法能够重写服务器返回的 `MIME` 类型是很有用的。

比如，服务器返回的 `MIME` 类型是 `text/plain`，但数据中实际包含的是 `XML`。根据 `MIME` 类型，即使数据是 `XML`，`responseXML` 属性中仍然是 `null`。通过调用 `overrideMimeType()`方法，可以保证把响应当作 `XML` 而非纯文本来处理。

```js
var xhr = new XMLHttpRequest(); 
xhr.open("get", "text.php", true); 
xhr.overrideMimeType("text/xml"); 
xhr.send(null);
```

:::warning
这个例子强迫 `XHR` 对象将响应当作 `XML` 而非纯文本来处理。调用 `overrideMimeType()`必须在`send()`方法之前，才能保证重写响应的 `MIME` 类型。
:::


### 进度事件

`Progress Events`定义了与客户端服务器通信有关的事件。这些事件最早其实只针对`XHR操`作，但目前也被其它`API`借鉴。有以下6个进度事件。

- `loadstart`：在接收到相应数据的第一个字节时触发。
- `progress`：在接收相应期间持续不断触发。
- `error`：在请求发生错误时触发。
- `abort`：在因为调用`abort()`方法而终止链接时触发。
- `load`：在接收到完整的相应数据时触发。
- `loadend`：在通信完成或者触发`error`、`abort`或`load`事件后触发。

每个请求从触发`Loadstart`事件开始，接下来是一或多个`progress`事件，然后触发`error`、`abort`或`load`事件中的一个，最后以触发`loadend`事件结束。

### `load`事件

`Firefox` 在实现 `XHR` 对象的某个版本时，曾致力于简化异步交互模型。最终，`Firefox` 实现中引入了`load` 事件，用以替代 `readystatechange` 事件。

响应接收完毕后将触发 `load` 事件，因此也就没有必要去检查 `readyState` 属性了。而 `onload` 事件处理程序会接收到一个 `event` 对象，其 `target` 属性就指向 `XHR` 对象实例，因而可以访问到 `XHR` 对象的所有方法和属性。

然而，并非所有浏览器都为这个事件实现了适当的事件对象。结果，开发人员还是要像下面这样被迫使用 `XHR` 对象变量。

```js
var xhr = createXHR(); 
xhr.onload = function(){ 
    if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304){ 
        alert(xhr.responseText); 
    } else { 
        alert("Request was unsuccessful: " + xhr.status); 
    }   
}; 
xhr.open("get", "altevents.php", true); 
xhr.send(null);
```

:::tip
只要浏览器接收到服务器的响应，不管其状态如何，都会触发 `load` 事件。而这意味着你必须要检查 `status` 属性，才能确定数据是否真的已经可用了。

`Firefox`、`Opera`、`Chrome` 和 `Safari` 都支持 `load`事件。
:::

### `progress`事件

`Mozilla` 对 `XHR` 的另一个革新是添加了 `progress` 事件，这个事件会在浏览器接收新数据期间周期性地触发。

而 `onprogress` 事件处理程序会接收到一个 `event` 对象，其 `target` 属性是 `XHR` 对象，但包含着三个额外的属性：`lengthComputable`、`position` 和 `totalSize`。

- `lengthComputable`:表示进度信息是否可用的布尔值，
- `position`: 表示已经接收的字节数，
- `totalSize`: 表示根据Content-Length 响应头部确定的预期字节数。

有了这些信息，我们就可以为用户创建一个进度指示器了。下面展示了为用户创建进度指示器的一个示例:

```js
var xhr = createXHR(); 
xhr.onload = function(event){ 
    if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304){ 
        alert(xhr.responseText); 
    } else { 
        alert("Request was unsuccessful: " + xhr.status); 
    } 
}; 
xhr.onprogress = function(event){ 
    var divStatus = document.getElementById("status"); 
    if (event.lengthComputable){ 
        divStatus.innerHTML = "Received " + event.position + " of " + event.totalSize +" bytes"; 
    } 
}; 
xhr.open("get", "altevents.php", true); 
xhr.send(null);
```
:::warning
为确保正常执行，必须在调用 `open()`方法之前添加 `onprogress` 事件处理程序。
:::

在前面的例子中，每次触发 `progress` 事件，都会以新的状态信息更新 `HTML` 元素的内容。如果响应头部中包含`Content-Length` 字段，那么也可以利用此信息来计算从响应中已经接收到的数据的百分比。

### 跨源资源共享

通过 `XHR` 实现 `Ajax` 通信的一个主要限制，来源于跨域安全策略。

默认情况下，`XHR` 对象只能访问与包含它的页面位于同一个域中的资源。这种安全策略可以预防某些恶意行为。但是，实现合理的跨域请求对开发某些浏览器应用程序也是至关重要的。


`CORS（Cross-Origin Resource Sharing，跨源资源共享`）定义了在必须访问跨源资源时，浏览器与服务器应该如何沟通。

`CORS` 背后的基本思想，就是使用自定义的 `HTTP` 头部让浏览器与服务器进行沟通，从而决定请求或响应是应该成功，还是应该失败。

比如一个简单的使用 `GET` 或 `POST` 发送的请求，它没有自定义的头部，而主体内容是 `text/plain`。在发送该请求时，需要给它附加一个额外的 `Origin` 头部，其中包含请求页面的源信息（协议、域名和端口），以便服务器根据这个头部信息来决定是否给予响应。下面是 `Origin` 头部的一个示例：

```
Origin: http://www.nczonline.net
```

如果服务器认为这个请求可以接受，就在 `Access-Control-Allow-Origin` 头部中回发相同的源信息（如果是公共资源，可以回发`"*"`）。例如：

```
Access-Control-Allow-Origin: http://www.nczonline.net
```

如果没有这个头部，或者有这个头部但源信息不匹配，浏览器就会驳回请求。正常情况下，浏览器会处理请求。

:::warning
注意，请求和响应都不包含 `cookie` 信息。

要请求位于另一个域中的资源，使用标准的 `XHR` 对象并在 `open()`方法中传入绝对 `URL` 即可(IE除外)

```
xhr.open("get", "http://www.somewhere-else.com/page/", true);
```
:::

### 带凭据的请求

默认情况下，跨源请求不提供凭据（`cookie`、`HTTP` 认证及客户端 `SSL` 证明等 ）。 

通过将 `withCredentials` 属性设置为 `true`，可以指定某个请求应该发送凭据。如果服务器接受带凭据的请求，会用下面的 `HTTP` 头部来响应。

```
Access-Control-Allow-Credentials: true
```

如果发送的是带凭据的请求，但服务器的响应中没有包含这个头部，那么浏览器就不会把响应交给`JavaScript`（于是，`responseText` 中将是空字符串，`status` 的值为 0，而且会调用 `onerror()`事件处理程序）。

另外，服务器还可以在 `Preflight` 响应中发送这个 `HTTP` 头部，表示允许源发送带凭据的请求。

### `Fetch`

`fetch`是一种`HTTP`数据请求的方式，是`XMLHttpRequest`的一种替代方案。`fetch`不是`ajax`的进一步封装，而是原生js,直接挂载在`window`对象上。

它的`API`是基于`Promise`设计的，旧版本的浏览器不支持`Promise`，需要使用`polyfill es6-promise`。


```js
// 原生XHR
var xhr = new XMLHttpRequest();
xhr.open('GET', url);
xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
        console.log(xhr.responseText)   // 从服务器获取数据
    }
}
xhr.send()

// fetch
fetch(url)
    .then(response => {
        if (response.ok) {
            return response.json();
        }
    })
    .then(data => console.log(data))
    .catch(err => console.log(err))

// fetch + async
async function test() {
    let response = await fetch(url);
    let data = await response.json();
    console.log(data)
}
```

:::warning

从`MDN`上看，`fetch` 规范与 `jQuery.ajax()` 主要有三种方式的不同：

1. 当接收到一个代表错误的 `HTTP` 状态码时，从 `fetch()` 返回的 `Promise` 不会被标记为 `reject`， 即使响应的 `HTTP` 状态码是 `404` 或 `500`。相反，它会将 `Promise` 状态标记为 `resolve` （但是会将 `resolve` 的返回值的 `ok` 属性设置为 `false `），仅当网络故障时或请求被阻止时，才会标记为 `reject`。

2. `fetch()` 不会接受跨域 `cookies`；你也不能使用 `fetch()` 建立起跨域会话。其他网站的 `Set-Cookie` 头部字段将会被无视。

3. `fetch` 不会发送 `cookies`。除非你使用了`credentials` 的初始化选项。（自2017年8月25日以后，默认的 `credentials` 政策变更为 `same-origin`。`Firefox` 也在 `61.0b13` 版本中进行了修改）。

:::

> fetch(input, options)

**input**
定义要获取的资源。这可能是： 一个String字符串，包含要获取资源的 URL或者一个 Request 对象。

**init** 可选 一个配置项对象，包括所有对请求的设置。可选的参数有：
- `method`: 请求使用的方法，如 `GET`、`POST`。
- `headers`: 请求的头信息，形式为 `Headers` 对象或 `ByteString`。 
- `body`: 请求的 `body` 信息：可能是一个 `Blob`、`BufferSource`、`FormData`、`URLSearchParams` 或者 `USVString` 对象。
- `mode`: 请求的模式，如 `cors`、 `no-cors` 或者 `same-origin`。
- `credentials`: 请求的 `credentials`，如 `omit`、`same-origin` 或者 `include`。
- `cache`: 请求的 `cache` 模式: `default`, `no-store`, `reload`, `no-cache`, `force-cache`, or `only-if-cached`.

:::warning
注意 `GET` 或 `HEAD` 方法的请求不能包含 body 信息。
:::

一个封装的fetch列子：

```js
const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '登录失效,请重新登录。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const errortext = codeMessage[response.status] || response.statusText;
  const error = new Error(errortext);
  error.name = response.status;
  error.response = response;
  throw error;
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, options) {
  const defaultOptions = {
    // 携带cookie 
    credentials: 'include',
    headers:{}
  };
  const newOptions = { ...defaultOptions, ...options };
  if (newOptions.method === 'POST' || newOptions.method === 'PUT') {
    if (!(newOptions.body instanceof FormData)) {
      newOptions.headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
        ...newOptions.headers,
      };
      newOptions.body = JSON.stringify(newOptions.body);
    } else {
      // newOptions.body is FormData
      newOptions.headers = {
        Accept: 'application/json',
        ...newOptions.headers,
      };
    }
  }

  return fetch(url, newOptions)
    .then(checkStatus)
    .then(response => {
      if (newOptions.method === 'DELETE' || response.status === 204) {
        return response.text();
      }

      return response.json();
    })
    .catch(e => {
      const { dispatch } = store;
      const status = e.name;
      if (status === 401) {

      }
    });
}

```

**Q:Fetch请求本身不支持超时如何支持?**

### `Promise.race`

`Promise.race`接收一个`promise`对象数组为参数,只要有一个`promise`对象进入 `Resolved` 或者 `Rejected` 状态的话，就会继续进行后面的处理。

```js
const _fetch = (requestPromise, timeout=30000) => {
  let timeoutAction = null;
  const timerPromise = new Promise((resolve, reject) => {
    timeoutAction = () => {
      reject('请求超时');
    }
  })
  setTimeout(()=>{
    timeoutAction()
  }, timeout)
  return Promise.race([requestPromise,timerPromise]);
}
```

### `axios`

`axios`是一个基于`Promise`的库，它是对原生`XHR`的封装。它有以下几大特性:

- 可以在`node.js`中使用
- 提供了并发请求的接口
- 支持`Promise API`

**简单的get请求**

```js
axios.get('/user', {
    params: {
      ID: 12345
    }
}).then(function (response) {
    console.log(response);
}).catch(function (error) {
    console.log(error);
});

```
**简单的post请求**
```js
axios.post('/user', {
    firstName: 'Fred',
    lastName: 'Flintstone'
  })
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
});
```
使用并发请求:

```js
function getUserAccount() {
  return axios.get('/user/12345');
}

function getUserPermissions() {
  return axios.get('/user/12345/permissions');
}

axios.all([getUserAccount(), getUserPermissions()])
    .then(axios.spread(function (acct, perms) {
    // Both requests are now complete
    })
);
```

**自定义配置新建一个 axios 实例**

```js
const instance = axios.create({
  baseURL: 'https://some-domain.com/api/',
  timeout: 1000,
  headers: {'X-Custom-Header': 'foobar'}
});
```

### axios请求配置

这些是创建请求时可以用的配置选项。只有 `url` 是必需的。如果没有指定 `method`，请求将默认使用 `get` 方法。

```js
{
   // `url` 是用于请求的服务器 URL
  url: '/user',

  // `method` 是创建请求时使用的方法
  method: 'get', // default

  // `baseURL` 将自动加在 `url` 前面，除非 `url` 是一个绝对 URL。
  // 它可以通过设置一个 `baseURL` 便于为 axios 实例的方法传递相对 URL
  baseURL: 'https://some-domain.com/api/',

  // `transformRequest` 允许在向服务器发送前，修改请求数据
  // 只能用在 'PUT', 'POST' 和 'PATCH' 这几个请求方法
  // 后面数组中的函数必须返回一个字符串，或 ArrayBuffer，或 Stream
  transformRequest: [function (data, headers) {
    // 对 data 进行任意转换处理
    return data;
  }],

  // `transformResponse` 在传递给 then/catch 前，允许修改响应数据
  transformResponse: [function (data) {
    // 对 data 进行任意转换处理
    return data;
  }],

  // `headers` 是即将被发送的自定义请求头
  headers: {'X-Requested-With': 'XMLHttpRequest'},

  // `params` 是即将与请求一起发送的 URL 参数
  // 必须是一个无格式对象(plain object)或 URLSearchParams 对象
  params: {
    ID: 12345
  },

   // `paramsSerializer` 是一个负责 `params` 序列化的函数
  // (e.g. https://www.npmjs.com/package/qs, http://api.jquery.com/jquery.param/)
  paramsSerializer: function(params) {
    return Qs.stringify(params, {arrayFormat: 'brackets'})
  },

  // `data` 是作为请求主体被发送的数据
  // 只适用于这些请求方法 'PUT', 'POST', 和 'PATCH'
  // 在没有设置 `transformRequest` 时，必须是以下类型之一：
  // - string, plain object, ArrayBuffer, ArrayBufferView, URLSearchParams
  // - 浏览器专属：FormData, File, Blob
  // - Node 专属： Stream
  data: {
    firstName: 'Fred'
  },

  // `timeout` 指定请求超时的毫秒数(0 表示无超时时间)
  // 如果请求话费了超过 `timeout` 的时间，请求将被中断
  timeout: 1000,

   // `withCredentials` 表示跨域请求时是否需要使用凭证
  withCredentials: false, // default

  // `adapter` 允许自定义处理请求，以使测试更轻松
  // 返回一个 promise 并应用一个有效的响应 (查阅 [response docs](#response-api)).
  adapter: function (config) {
    /* ... */
  },

 // `auth` 表示应该使用 HTTP 基础验证，并提供凭据
  // 这将设置一个 `Authorization` 头，覆写掉现有的任意使用 `headers` 设置的自定义 `Authorization`头
  auth: {
    username: 'janedoe',
    password: 's00pers3cret'
  },

   // `responseType` 表示服务器响应的数据类型，可以是 'arraybuffer', 'blob', 'document', 'json', 'text', 'stream'
  responseType: 'json', // default

  // `responseEncoding` indicates encoding to use for decoding responses
  // Note: Ignored for `responseType` of 'stream' or client-side requests
  responseEncoding: 'utf8', // default

   // `xsrfCookieName` 是用作 xsrf token 的值的cookie的名称
  xsrfCookieName: 'XSRF-TOKEN', // default

  // `xsrfHeaderName` is the name of the http header that carries the xsrf token value
  xsrfHeaderName: 'X-XSRF-TOKEN', // default

   // `onUploadProgress` 允许为上传处理进度事件
  onUploadProgress: function (progressEvent) {
    // Do whatever you want with the native progress event
  },

  // `onDownloadProgress` 允许为下载处理进度事件
  onDownloadProgress: function (progressEvent) {
    // 对原生进度事件的处理
  },

   // `maxContentLength` 定义允许的响应内容的最大尺寸
  maxContentLength: 2000,

  // `validateStatus` 定义对于给定的HTTP 响应状态码是 resolve 或 reject  promise 。如果 `validateStatus` 返回 `true` (或者设置为 `null` 或 `undefined`)，promise 将被 resolve; 否则，promise 将被 rejecte
  validateStatus: function (status) {
    return status >= 200 && status < 300; // default
  },

  // `maxRedirects` 定义在 node.js 中 follow 的最大重定向数目
  // 如果设置为0，将不会 follow 任何重定向
  maxRedirects: 5, // default

  // `socketPath` defines a UNIX Socket to be used in node.js.
  // e.g. '/var/run/docker.sock' to send requests to the docker daemon.
  // Only either `socketPath` or `proxy` can be specified.
  // If both are specified, `socketPath` is used.
  socketPath: null, // default

  // `httpAgent` 和 `httpsAgent` 分别在 node.js 中用于定义在执行 http 和 https 时使用的自定义代理。允许像这样配置选项：
  // `keepAlive` 默认没有启用
  httpAgent: new http.Agent({ keepAlive: true }),
  httpsAgent: new https.Agent({ keepAlive: true }),

  // 'proxy' 定义代理服务器的主机名称和端口
  // `auth` 表示 HTTP 基础验证应当用于连接代理，并提供凭据
  // 这将会设置一个 `Proxy-Authorization` 头，覆写掉已有的通过使用 `header` 设置的自定义 `Proxy-Authorization` 头。
  proxy: {
    host: '127.0.0.1',
    port: 9000,
    auth: {
      username: 'mikeymike',
      password: 'rapunz3l'
    }
  },

  // `cancelToken` 指定用于取消请求的 cancel token
  // （查看后面的 Cancellation 这节了解更多）
  cancelToken: new CancelToken(function (cancel) {
  })
}
```

### axios响应结构

某个请求的响应包含以下信息:

```js
{
  // `data` 由服务器提供的响应
  data: {},

  // `status` 来自服务器响应的 HTTP 状态码
  status: 200,

  // `statusText` 来自服务器响应的 HTTP 状态信息
  statusText: 'OK',

  // `headers` 服务器响应的头
  headers: {},

   // `config` 是为请求提供的配置信息
  config: {},
 // 'request'
  // `request` is the request that generated this response
  // It is the last ClientRequest instance in node.js (in redirects)
  // and an XMLHttpRequest instance the browser
  request: {}
}
```

### axios配置默认值

你可以指定将被用在各个请求的配置默认值:

- 全局的 axios 默认值
```js
axios.defaults.baseURL = 'https://api.example.com';
axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
axios.defaults.headers.post['Content-Type'] = 'application/json';
```
- 自定义实例默认值
```js
// Set config defaults when creating the instance
const instance = axios.create({
  baseURL: 'https://api.example.com'
});

// Alter defaults after instance has been created
instance.defaults.headers.common['Authorization'] = AUTH_TOKEN;

```

### axios配置的优先顺序:

配置会以一个优先顺序进行合并。这个顺序是：在 `lib/defaults.js` 找到的库的默认值，然后是实例的 `defaults` 属性，最后是请求的 `config` 参数。后者将优先于前者。这里是一个例子：

```js
// 使用由库提供的配置的默认值来创建实例
// 此时超时配置的默认值是 `0`
var instance = axios.create();

// 覆写库的超时默认值
// 现在，在超时前，所有请求都会等待 2.5 秒
instance.defaults.timeout = 2500;

// 为已知需要花费很长时间的请求覆写超时设置
instance.get('/longRequest', {
  timeout: 5000
});
```

### axios拦截器:

在请求或响应被 `then` 或 `catch` 处理前拦截它们。

```js
// 添加请求拦截器
axios.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    return config;
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  });

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
    // 对响应数据做点什么
    return response;
  }, function (error) {
    // 对响应错误做点什么
    return Promise.reject(error);
  });
```

:::tip
如果你想在稍后移除拦截器，可以这样：

```js
const myInterceptor = axios.interceptors.request.use(function () {/*...*/});
axios.interceptors.request.eject(myInterceptor);
```

可以为自定义 axios 实例添加拦截器:

```js
const instance = axios.create();
instance.interceptors.request.use(function () {/*...*/});
```
:::

### axios错误处理:

```js
axios.get('/user/12345')
  .catch(function (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      console.log(error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log('Error', error.message);
    }
    console.log(error.config);
  });

// 也可以使用 `validateStatus` 配置选项定义一个自定义 `HTTP` 状态码的错误范围。

axios.get('/user/12345', {
  validateStatus: function (status) {
    return status < 500; // Reject only if the status code is greater than or equal to 500
  }
})
```
