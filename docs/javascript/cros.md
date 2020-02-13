# 跨域处理

由于浏览器同源策略的限制，非同源下的请求，都会产生跨域问题。

> 同源策略即：同一协议，同一域名，同一端口号。当其中一个不满足时，我们的请求即会发生跨域问题。

**1. 采用`jsonp`请求**

不知道大家有没有注意，不管是我们的`script`标签的`src`还是`img`标签的`src`，或者说`link`标签的`href`他们没有被通源策略所限制，比如我们有可能使用一个网络上的图片，就可以请求得到。

`jsonp`就是使用通源策略这一“漏洞”，实现的跨域请求（这也是`jsonp`跨域只能用`get`请求的原因所在）。

```js

<button id="btn">点击</button>
  <script src="https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js"></script>
  <script>
    $('#btn').click(function(){
		var frame = document.createElement('script');
		frame.src = 'http://localhost:3000/article-list?name=leo&age=30&callback=func';
		$('body').append(frame);
	});
		
	function func(res){
		alert(res.message+res.name+'你已经'+res.age+'岁了');
	}
```

这里可以看到，我们声明了一个`func`函数，但没有执行，你可以想一下，如果服务端接口到`get`请求，返回的是`func({message:'hello'})`，这样的话在服务端不就可以把数据通过函数执行传参的方式实现数据传递了吗。


服务端代码

```js
router.get('/article-list', (req, res) => {
  console.log(req.query, '123');
  let data = {
    message: 'success!',
    name: req.query.name,
    age: req.query.age
  }
  data = JSON.stringify(data)
  res.end('func(' + data + ')');
```

:::warning
需要注意的是，`callback`参数定义的方法是需要前后端定义好的，具体什么名字，商讨好就可以了。

其实`jsonp`的整个过程就类似于前端声明好一个函数，后端返回执行函数。执行函数参数中携带所需的数据，整个过程实际非常简单易懂。
:::

**2. document.domain**

这种方式常用于`iframe`通信，用在主域名相同子域名不同的跨域访问中。

`http://a.frame.com` 和 `http://b.frame.com` 他们的主域名都是`frame.com`。

这两个域名中的文件可以用这种方式进行访问，通过在两个域中具体的文件中设置`document.domain="frame.com"`就可达到跨域访问的目的。

**3. window.name**

常用于iframe中。

`window`的`name`属性有个特征：在一个窗口(window)的生命周期内,窗口载入的所有的页面都是共享一个`window.name`的，每个页面对`window.name`都有读写的权限，`window.name`是持久存在一个窗口载入过的所有页面中的，并不会因新页面的载入而进行重置。

**4. window.postMessage**

`window.postMessages`是`HTML5`中实现跨域访问的一种新方式，可以使用它来向其它的`window`对象发送消息，无论这个`window`对象是属于同源或不同源。

该方式的使用还是十分简单的，给要发送数据的页面中的`window`对象调用一个`postMessage(message,targetOrigin)`方法即可。

该方法的第一个参数`message`为要发送的消息，类型只能为`字符串`；

第二个参数`targetOrigin`用来限定接收消息的那个`window`对象所在的域，如果不想限定域，直接使用通配符 '*' 。

再让接收数据页面的`window`对象监听自身的`message`事件来获取传过来的消息，消息内容储存在该事件对象的`data`属性中。

**5. CORS(Cross-Origin Resource Sharing)**

`CORS`是官方推荐解决跨域问题的方案。

`CORS`使用一些`HTTP`头信息——包括请求和返回——为了让工作继续开展下去，你必须了解一下的一些头信息：

- `Access-Control-Allow-Origin`

这个头部信息由服务器返回，用来明确指定那些客户端的域名允许访问这个资源。它的值可以是：
    1. `*` —— 允许任意域名
    2. 一个完整的域名名字（比如：https://example.com）

:::warning
如果你需要客户端传递验证信息到头部（比如：`cookies`）。这个值不能为 `*` —— 必须为完整的域名（这点很重要）。
:::

- `Access-Control-Allow-Credentials`

这个头部信息只会在服务器支持通过`cookies`传递验证信息的返回数据里。它的值只有一个就是 `true`。

跨站点带验证信息时，服务器必须要争取设置这个值，服务器才能获取到用户的`cookie`。

- `Access-Control-Allow-Headers`

提供一个逗号分隔的列表表示服务器支持的请求数据类型。

假如你使用自定义头部(比如：x-authentication-token 服务器需要在返回`OPTIONS`请求时，要把这个值放到这个头部里，否则请求会被阻止)。

- `Access-Control-Expose-Headers`

相似的，这个返回信息里包含了一组头部信息，这些信息表示那些客户端可以使用。其他没有在里面的头部信息将会被限制。

- `Access-Control-Allow-Methods`

一个逗号分隔的列表，表明服务器支持的请求类型（比如：GET, POST）

**6. 配置代理服务器。**

可以配置`nginx`服务器,服务器与服务器之间访问是不跨域的。

