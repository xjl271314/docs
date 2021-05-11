# 浏览器同源策略

- 2021.04.29

当浏览器访问 `URL` 地址的协议（schema）/ 端口（port）/ 域名（host），三者中有任何一个与当前的 URL 片段信息不匹配的时候，就产生了跨域问题。

| 当前地址                 | 请求地址                  |   是否跨域   |
| :----------------------- | :------------------------ | :----------: |
| http://www.juejin.com:80 | https://www.juejin.com:80 | 是(协议不同) |
| http://www.juejin.com:80 | http://www.juejin.cn:80   | 是(域名不同) |
| http://www.juejin.com:80 | http://www.juejin.com:90  | 是(端口不同) |

## 跨域的说明

1. 跨域，是浏览器提供的一种保护手段，服务端是不存在跨域这一说的。这也就是为什么现在前后端分离的开发模式下，前端比较依赖 `webpack-dev-server` 启动代理服务来中转和代理后台接口的原因，因为两个服务器之间相互通信是没有跨域障碍的。

2. 跨域，是对于 `XMLHttpRequest` 来说的，**浏览器获取不同源服务器下的静态资源，是没有跨域限制的**，这也是 `JSONP` 跨域请求得以实现的本质。

3. 不同于 `XMLHttpRequest` 的是，通过 `src` 属性加载的脚本资源，浏览器限制了 `Javascript` 的权限，使其不能读写、返回内容。

4. 对于浏览器来说，除了 `DOM` 、`Cookie`、`XMLHttpRequest` 会收到同源策略限制以外，一些常见的插件，比如 `Flash`、`Java Applet` 、`Silverlight`、`Google Gears` 等也都有自己的控制策略。

:::tip
当浏览器向不同域的服务器发送请求时，请求是真能发出去，对方服务端也是真能接收到请求，并且真能给你的浏览器响应，浏览器也真能接收到有效数据。

但是，如果在`跨域`的情况下、服务端返回数据的响应头里的 `Access-Control-Allow-Origin` 字段，没有把当前域名列进白名单，那么浏览器会把服务端返回的数据给藏起来，不告诉你，然后给你抛个 `Access-Control-Allow-Origin` 的错误。
:::

### **为什么资源文件不受同源策略限制呢？**

假如说资源文件也被限制跨域，那么现在大量使用的 `CDN 缓存策略`基本就没办法用了。而且现在很多网站的资源文件，都会放到云服务器的 `OSS` 上，`OSS` 资源对应的 `url` 地址肯定是不同域的，那这些资源也不能使用了。

## Access-Control-Allow-Origin

`Access-Control-Allow-Origin` 标识了服务器允许的跨域白名单，它有以下几种设置方法：

1. 直接设置 `*` 通配符，简单粗暴，但是这么做等于把服务器的所有接口资源对外完全暴露，是不安全的。

2. 设置指定域，比如 `Access-Control-Allow-Origin: https://www.baidu.com` ，这样只会允许指定域的请求进行跨域访问。

3. 由后端动态设置。`Access-Control-Allow-Origin` 限制只能写一个白名单，但是当我们有多个域都需要跨域请求怎么呢？这个时候，这时可以由服务端自己维护一套白名单列表，在请求进来的时候对请求的源 `host` 进行白名单比对，如果在白名单中，就将这个 `Access-Control-Allow-Origin` 动态设置上去，然后返回响应。

## CORS 的预请求

如果我们像上面一样，只设置了 `Access-Control-Allow-Origin` 白名单，是否就可以完全畅通无阻地进行跨域了呢？并不是。
就算对端开启了域名白名单认证，然鹅有一些操作仍然是需要进一步认证的，这种进一步的认证操作，就是 `CORS` 预请求。

## 预请求触发过程

浏览器预请求的触发条件，是判断本次请求是否属于一个简单请求。

如果本次请求属于一个复杂请求，那么在发送正式的跨域请求之前，浏览器会先准备一个名为 `OPTIONS` 的 `HTTP Method` ，作为预请求发送。

在服务器通过预请求后，下面浏览器才会发生正式的数据请求。整个请求过程其实是发生了两次请求：`一个预检请求`，以及后续的实际数据请求。

:::tip
当我们使用原生的 fetch 去请求时,当发生跨域时，fetch 会先发送一个`OPTIONS`请求，来确认服务器是否允许接受请求。

服务器同意后，才会发送真正的请求。
:::

## 简单请求

1. 请求方式只能是 `GET`、`POST`、`HEAD`
2. 请求头字段只允许：

   - `Accept`
   - `Accept-Language`
   - `Content-Language`
   - `Content-Type`

3. `Content-Type` 的值仅限于：

   - `text/plain`
   - `multipart/form-data`
   - `application/x-www-form-urlencoded`

4. `XMLHttpRequestUpload` 对象均没有注册任何事件监听器（了解就好）。
5. 请求中没有使用 `ReadableStream` 对象（了解就好）。

## 复杂请求

除了简单请求里定义的，都是复杂请求，统统需要预请求。

## 预请求的验证

那么怎样使预检请求成功认证呢？还是需要服务端继续帮忙设置请求头的白名单：

1. `Access-Control-Allow-Headers`，设置允许的额外请求头字段。
2. `Access-Control-Allow-Methods`，设置允许的额外请求方法。
3. `Access-Control-Max-Age` （单位/秒），指定了预请求的结果能够被缓存多久，在这个时间范围内，再次发送跨域请求不会被预检。

## HTTP 响应首部字段说明

这里列出了部分的响应字段:

- ### `Access-Control-Allow-Origin`:

响应首部中可以携带一个 `Access-Control-Allow-Origin` 字段，其语法如下:

> `Access-Control-Allow-Origin: <origin> | \*`

其中，`origin` 参数的值指定了允许访问该资源的外域 `URI`。对于不需要携带身份凭证的请求，服务器可以指定该字段的值为通配符，表示允许来自所有域的请求。

例如，下面的字段值将允许来自 `http://mozilla.com` 的请求：

> `Access-Control-Allow-Origin: http://mozilla.com`

如果服务端指定了具体的域名而非`*`，那么响应首部中的 `Vary` 字段的值必须包含 `Origin`。这将告诉客户端：服务器对不同的源站返回不同的内容。

- ### `Access-Control-Expose-Headers`

在跨源访问时，`XMLHttpRequest`对象的`getResponseHeader()`方法只能拿到一些最基本的响应头，`Cache-Control`、`Content-Language`、`Content-Type`、`Expires`、`Last-Modified`、`Pragma`，如果要访问其他头，则需要服务器设置本响应头。

`Access-Control-Expose-Headers` 头让服务器把允许浏览器访问的头放入白名单，例如：

> `Access-Control-Expose-Headers: X-My-Custom-Header, X-Another-Custom-Header`

这样浏览器就能够通过`getResponseHeader`访问`X-My-Custom-Header`和 `X-Another-Custom-Header` 响应头了。

- ### `Access-Control-Max-Age`

`Access-Control-Max-Age` 头指定了 `preflight` 请求的结果能够被缓存多久。

> `Access-Control-Max-Age: <delta-seconds>`

`delta-seconds` 参数表示 `preflight` 请求的结果在多少秒内有效。

- ### `Access-Control-Allow-Credentials`

`Access-Control-Allow-Credentials` 头指定了当浏览器的`credentials`设置为`true`时是否允许浏览器读取`response`的内容。

当用在对 `preflight` 预检测请求的响应中时，它指定了实际的请求是否可以使用 `credentials`。

:::warning
请注意：简单 `GET` 请求不会被预检；如果对此类请求的响应中不包含该字段，这个响应将被忽略掉，并且浏览器也不会将相应内容返回给网页。
:::

> `Access-Control-Allow-Credentials: true`

- ### `Access-Control-Allow-Methods`

`Access-Control-Allow-Methods` 首部字段用于预检请求的响应。其指明了实际请求所允许使用的 `HTTP` 方法。

> `Access-Control-Allow-Methods: <method>[, <method>]*`

- ### `Access-Control-Allow-Headers`

`Access-Control-Allow-Headers` 首部字段用于预检请求的响应。其指明了实际请求中允许携带的首部字段。

> `Access-Control-Allow-Headers: <field-name>[, <field-name>]*`

## HTTP 请求首部字段

这里罗列了部分可用于发起跨源请求的首部字段。请注意，这些首部字段无须手动设置。 当开发者使用 `XMLHttpRequest` 对象发起跨源请求时，它们已经被设置就绪。

- ### `Origin`

`Origin` 首部字段表明预检请求或实际请求的源站。

> `Origin: <origin>`

`origin` 参数的值为源站 `URI`。它不包含任何路径信息，只是服务器名称。

:::tip
有时候将该字段的值设置为空字符串是有用的，例如，当源站是一个 `data URL` 时。
:::

:::warning
注意，在所有访问`控制请求（Access control request）`中，`Origin` 首部字段总是被发送。
:::

- ### `Access-Control-Request-Method`

`Access-Control-Request-Method` 首部字段用于预检请求。其作用是，将实际请求所使用的 `HTTP` 方法告诉服务器。

> `Access-Control-Request-Method: <method>`

- ### `Access-Control-Request-Headers`

`Access-Control-Request-Headers` 首部字段用于预检请求。其作用是，将实际请求所携带的首部字段告诉服务器。

> `Access-Control-Request-Headers: <field-name>[, <field-name>]*`

:::tip
更加完整的跨域信息可以[点击这里查看更多](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/CORS)
:::
