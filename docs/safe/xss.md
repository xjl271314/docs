# XSS 攻击

XSS(Cross-site Scripting, 跨站脚本攻击)

避免与 CSS 重名，所以简写成 XSS 了。原理就是通过发布文章、发布评论等方式，将一段恶意的 JS 代码输入进去。然后别人再看这篇文章、评论时，之前注入的这段恶意 JS 代码就执行了。JS 代码一旦执行就跟网页原有的 JS 有同样的权限，可以获取 cookie 等。

解决办法有四个：

CSP(Content-Security-Policy)
内容安全策略是 http 协议中协议头的一个字段，也可以通过 html 的 meta 标签进行控制。只要在返回的 http 头中定义：

'Content-type':'text/html',
'Content-Security-Policy':'default-src http: https:'
那么返回的 html 文件就只能通过 http 和 https 外链加载 js 脚本的方式来执行 js 代码，而不能执行内联的 js 代码。

这样就防止了恶意内联 js 代码的执行。此外这个标签还可以设置加载哪些域名下的 js 文件等，更多信息请查阅 MDN CSP 文档。

对 cookie 设置 http-only
可以对 cookie 设置 http-only 来禁止通过 JS 访问 cookie，减少 XSS 攻击。

对用户输入的内容进行 escape 验证
目前已经有一些 npm 库例如 xss-escape,通过把有 XSS 攻击危险的字符转换成 html 实体字符，再放到后端存储，下次在前端渲染的时候，浏览器就不会把实体字符当做脚本来执行了，而是当成实体编码解码之后进行显示。

后端对有 XSS 嫌疑的内容进行过滤.
