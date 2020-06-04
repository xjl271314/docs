# HTTP相关知识

## HTTP定义

> `HTTP(HyperText Transfer Protocal)`超文本传输协议，是一种用于分布式、协作式和超媒体信息系统的应用层协议,基于`TCP`协议实现。是客户端和服务器请求和应答的标准，用于从服务器传输超文本到本地浏览器，他可以使浏览器更高效，使网络传输减少。

通过`HTTP`或者`HTTPS`协议请求的资源由统一资源标识符`URL(Uniform Resource Identifiers)`来标识。
## HTTP特点

http主要有以下几个特点:

- 支持客户端/服务端模式
- 简单快速
- 灵活
- 无连接 限制每次连接只处理一个请求(keep-alive)
- 无状态 两次连接之间没有任何关系，每次都是一个新的连接，服务器不会记录前后的请求信息(cookie、session)

## ISO5层模型

从下往上

1. `物理层`:放大或再生弱的信号,在两个电缆段之间复制每一个比特。
2. `数据链路层`:`SLIP(串行线路IP)`,`PPP(点到点协议)`。
3. `网络层`:`IP(Internet Protocal)`网络协议,`ARP(Address Resolution Protocal)`地址解析协议,`ICMP(Internet Control Message Protocal)`因特网控制消息协议,`HDLC(High Data Link Control)`高级数据链路控制。
4. `传输层`:`TCP(Transition Control Protocal)`传输控制协议, `UDP(User Data Protocal)`用户数据协议。
5. `应用层`:`HTTP(HyperText Transfer Protocal)`超文本传输协议,`FTP(File Transfer Protocal)`文件传输协议, `SMTP(Simple Mall Transfer Protocal)`简单邮件传输协议,`POP3(Post Office Protocal)`邮局协议,`DNS(Domain Name System)`域名系统。

## HTTP请求响应模型

HTTP由请求和响应构成，是一个标准的客户端服务器模型(B/S)。

HTTP协议永远是客户端发起，然后服务器返回响应。

![HTTP请求](https://img-blog.csdnimg.cn/20200207155322862.png)

:::tip
`HTTP`是一个无状态的协议。

无状态是指客户机（`Web`浏览器）和服务器之间不需要建立持久的连接，这意味着当一个客户端向服务器端发出请求，然后服务器返回响应(`response`)，连接就被关闭了，在服务器端不保留连接的有关信息.

`HTTP`遵循请求(`Request`)/应答(`Response`)模型。客户机（浏览器）向服务器发送请求，服务器处理请求并返回适当的应答。所有`HTTP`连接都被构造成一套请求和应答。

:::

## HTTP工作过程

一次`HTTP`操作称为一个`事务`，其工作整个过程如下：

### 1.地址解析

如用客户端浏览器请求这个页面：`localhost.com:8080/index.htm`

从中分解出`协议名`、`主机名`、`端口`、`对象路径`等部分，对于我们的这个地址，解析得到的结果如下：


```
协议名：http
主机名：localhost.com
端口：8080
对象路径：/index.htm
```

在这一步，需要域名系统`DNS`解析域名`localhost.com`,得到主机的`IP`地址。


### 2.封装HTTP请求数据包

把以上部分结合本机自己的信息，封装成一个HTTP请求数据包

### 3.封装成`TCP`包，建立`TCP`连接（TCP的三次握手）

在`HTTP`工作开始之前，客户机（Web浏览器）首先要通过网络与服务器建立连接，该连接是通过`TCP`来完成的，该协议与IP协议共同构建`Internet`，即著名的`TCP/IP`协议族，因此`Internet`又被称作是`TCP/IP`网络。

`HTTP`是比`TCP`更高层次的应用层协议，根据规则，只有低层协议建立之后才能，才能进行更层协议的连接，因此，首先要建立`TCP`连接，一般`TCP`连接的端口号是`80`。这里是`8080`端口。

### 4.客户机发送请求命令

建立连接后，客户机发送一个请求给服务器，请求方式的格式为：`统一资源标识符（URL）`、`协议版本号`，后边是`MIME`信息包括请求修饰符、客户机信息和可内容。

### 5.服务器响应

服务器接到请求后，给予相应的响应信息，其格式为一个`状态行`，包括信息的`协议版本号`、`一个成功或错误的代码`，后边是`MIME`信息包括服务器信息、实体信息和可能的内容。

实体消息是服务器向浏览器发送头信息后，它会发送一个空白行来表示头信息的发送到此为结束，接着，它就以`Content-Type`应答头信息所描述的格式发送用户所请求的实际数据。

### 6.服务器关闭TCP连接

一般情况下，一旦`Web`服务器向浏览器发送了请求数据，它就要关闭`TCP`连接，然后如果浏览器或者服务器在其头信息加入了这行代码:

```js
Connection:keep-alive
```

`TCP`连接在发送后将仍然保持打开状态，于是，浏览器可以继续通过相同的连接发送请求。保持连接节省了为每个请求建立新连接所需的时间，还节约了网络带宽。

### HTTP工作过程用到的概念

**报文格式**

HTTP1.0的报文有两种类型：请求和响应。其报文格式分别为：

:::tip
**请求报文格式**

- 请求方法 URL HTTP/版本号
- 请求首部字段(可选)
- 空行
- body(只对Post请求有效)

:::

```
GET http://m.baidu.com/ HTTP/1.1
Host m.baidu.com
Connection Keep-Alive
...// 其他header
key=iOS
```

:::tip
**响应报文格式**

- HTTP/版本号 返回码 返回码描述
- 应答首部字段(可选)
- 空行
- body
:::

```
HTTP/1.1 200 OK
Content-Type text/html;charset=UTF-8
...// 其他header

<html>...
```

### URL的结构

使用`HTTP`协议访问资源是通过`URL（Uniform Resource Locator）`统一资源定位符来实现的。URL的格式如下：

```
scheme://host:port/path?query

scheme: 表示协议，如http, https, ftp等；
host: 表示所访问资源所在的主机名：如：www.baidu.com;
port: 表示端口号，默认为80；
path: 表示所访问的资源在目标主机上的储存路径；
query: 表示查询条件；

例如： http://www.baidu.com/search?words=Baidu
```

### HTTP的请求方法

- `GET`: 获取URL指定的资源；
- `POST`：传输实体信息
- `PUT`：上传文件
- `DELETE`：删除文件
- `HEAD`：获取报文首部，与GET相比，不返回报文主体部分
- `OPTIONS`：询问支持的方法
- `TRACE`：追踪请求的路径；
- `CONNECT`：要求在与代理服务器通信时建立隧道，使用隧道进行`TCP`通信。主要使用`SSL`和`TLS`将数据加密后通过网络隧道进行传输。



### 报文字段

`HTTP`首部字段由字段名和字段值组成，中间以":"分隔，如`Content-Type: text/html.`其中，同一个字段名可对应多个字段值。

`HTTP`的报文字段分为5种：

1. 请求报文字段
2. 应答报文字段
3. 实体首部字段
4. 通用报文字段
5. 其他报文字段

#### 请求报文字段

`HTTP`请求中支持的报文字段。

>
- `Accept`：客户端能够处理的媒体类型。如`text/html`, 表示客户端让服务器返回`html`类型的数据，如果没有，返回`text`类型的也可以。媒体类型的格式一般为：`type/subType`, 表示优先请求`subType`类型的数据，如果没有，返回type类型数据也可以。

    **常见的媒体类型：**
    - 文本文件：`text/html`, `text/plain`, `text/css`, `application/xml`
    - 图片文件：`iamge/jpeg`, `image/gif`, `image/png`;
    - 视频文件：`video/mpeg`
    - 应用程序使用的二进制文件：`application/octet-stream`, `application/zip`

:::tip
`Accept`字段可设置多个字段值，这样服务器依次进行匹配，并返回最先匹配到的媒体类型，当然，也可通过q参数来设置
媒体类型的权重，权重越高，优先级越高。q的取值为[0, 1], 可取小数点后3位，默认为1.0。例如：
`Accept: text/html, application/xml; q=0.9, */*`
:::

- `Accept-Charset`: 表示客户端支持的字符集。例如：`Accept-Charset: GB2312, ISO-8859-1`

- `Accept-Encoding`： 表示客户端支持的内容编码格式。如：`Accept-Encoding：gzip`

    **常用的内容编码：**
    - `gzip`: 由文件压缩程序`gzip`生成的编码格式；
    - `compress`: 由`Unix`文件压缩程序`compress`生成的编码格式；
    - `deflate`: 组合使用`zlib`和`deflate`压缩算法生成的编码格式；
    - `identity`：默认的编码格式，不执行压缩。

- `Accept-Language`：表示客户端支持的语言。如：`Accept-Language: zh-cn, en`

- `Authorization`：表示客户端的认证信息。客户端在访问需要认证的也是时，服务器会返回401，随后客户端将认证信息加在`Authorization`字段中发送到服务器后，如果认证成功，则返回200. 如Linux公社下的Ftp服务器就是这种流程：ftp://ftp1.linuxidc.com。

- `Host`: 表示访问资源所在的主机名，即URL中的域名部分。如：m.baidu.com

- `If-Match`: `If-Match`的值与所请求资源的`ETag`值（实体标记，与资源相关联。资源变化，实体标记跟着变化）一致时，服务器才处理此请求。

- `If-Modified-Since`: 用于确认客户端拥有的本地资源的时效性。 如果客户端请求的资源在`If-Modified-Since`指定的时间后发生了改变，则服务器处理该请求。如：If-Modified-Since:Thu 09 Jul 2018 00:00:00, 表示如果客户端请求的资源在2018年1月9号0点之后发生了变化，则服务器处理改请求。通过该字段我们可解决以下问题：有一个包含大量数据的接口，且实时性较高，我们在刷新时就可使用改字段，从而避免多余的流量消耗。

- `If-None-Match`: `If-Match`的值与所请求资源的`ETag`值不一致时服务器才处理此请求。

- `If-Range`： `If-Range`的值（ETag值或时间）与所访问资源的ETag值或时间相一致时，服务器处理此请求，并返回Range字段中设置的指定范围的数据。如果不一致，则返回所有内容。`If-Range`其实算是`If-Match`的升级版，因为它的值不匹配时，依然能够返回数据，而`If-Match`不匹配时，请求不会被处理，需要数据时需再次进行请求。


- `If-Unmodified-Since`：与`If-Modified-Since`相反，表示请求的资源在指定的时间之后未发生变化时，才处理请求，否则返回412。

- `Max-Forwards`：表示请求可经过的服务器的最大数目，请求每被转发一次，`Max-Forwards`减1，当`Max-Forwards`为0时，所在的服务器将不再转发，而是直接做出应答。通过此字段可定位通信问题，比如之前支付宝光纤被挖断，就可通过设置Max-Forwards来定位大概的位置。

- `Proxy-Authorization`：当客户端接收到来自代理服务器的认证质询时，客户端会将认证信息添加到`Proxy-Authorization`来完成认证。与`Authorization`类似，只不过`Authorization`是发生在客户端与服务端之间。

- `Range`：获取部分资源，例如：Range: bytes=500-1000表示获取指定资源的第500到1000字节之间的内容，如果服务器能够正确处理，则返回206作为应答，表示返回了部分数据，如果不能处理这种范围请求，则以200作为应答，返回完整的数据，

- `Referer`：告知服务器请求是从哪个页面发起的。例如在百度首页中搜索某个关键字，结果页面的请求头部就会有这个字段，其值为https://www.baidu.com/。通过这个字段可统计广告的点击情况。

- `User-Agent`：将发起请求的浏览器和代理名称等信息发送给服务端，例如：User-Agent: Mozilla/5.0 (Linux; Android 5.0; SM-G900P Build/LRX21T) AppleWebKit/537.36(KHTML, like Gecko) Chrome/63.0.3239.84 Mobile Safari/537.36

#### 应答报文字段

`HTTP`应答中支持的报文字段。

- `Age`：服务端告知客户端，源服务器（而不是缓存服务器）在多久之前创建了响应。单位为秒。

- `ETag`： 实体资源的标识，可用来请求指定的资源。

- `Location`：请求的资源所在的新位置。

- `Proxy-Authenticate`：将代理服务器需要的认证信息发送给客户端。

- `Retry-After`：服务端告知客户端多久之后再重试，一般与503和3xx重定向类型的应答一起使用。

- `Server`：告知服务端当前使用的`HTTP`服务器应用程序的相关信息。

- `WWW-Authenticate`：告知客户端适用于所访问资源的认证方案，如`Basic`或`Digest`。`401`的响应中肯定带有`WWW-Authenticate`字段。

#### 实体首部字段

- `Allow`：通知客户端，服务器所支持的请求方法。但服务器收到不支持的请求方法时，会以405（Method Not Allowed）作为响应。
    
- `Content-Encoding`：告知客户端，服务器对资源的内容编码。
  
- `Content-Language`：告知客户端，资源所使用的自然语言。
  
- `Content-Length`：告知客户端资源的长度。
  
- `Content-Location`：告知客户端资源所在的位置。
  
- `Content-Type`：告知客户端资源的媒体类型，取值同请求首部字段中的Accept。
  
- `Expires`：告知客户端资源的失效日期。可用于对缓存的处理。
  
- `Last-Modified`：告知客户端资源最后一次修改的时间。

#### 通用报文字段

即可在`HTTP`请求中使用，也可在`HTTP`应答中使用的报文字段。

- `Cache-Control`：控制缓存行为；

- `Connection`：管理持久连接，设置其值为`Keep-Alive`可实现长连接。

- `Date`：创建`HTTP`报文的日期和时间。

- `Pragma`：`Http/1.1`之前的历史遗留字段，仅作为`HTTP/1.0`向后兼容而定义，虽然是通用字段，当通常被使用在客户单的请求中，如Pragma: no-cache, 表示客户端在请求过程中不循序服务端返回缓存的数据；

- `Transfer-Encoding`：规定了传输报文主题时使用的传输编码，如`Transfer-Encoding: chunked`

- `Upgrade`: 用于检查`HTTP`协议或其他协议是否有可使用的更高版本。

- `Via`：追踪客户端和服务端之间的报文的传输路径，还可避免会环的发生，所以在经过代理时必须添加此字段。

- `Warning`：`Http/1.1`的报文字段，从`Http/1.0`的`AfterRetry`演变而来，用来告知用户一些与缓存相关的警告信息。

#### 其他报文字段

这些字段不是`HTTP`协议中定义的，但被广泛应用于`HTTP`请求中。

- `Cookie`：属于请求型报文字段，在请求时添加`Cookie`, 以实现`HTTP`的状态记录。

- `Set-Cookie`：属于应答型报文字段。服务器给客户端传递`Cookie`信息时，就是通过此字段实现的。

:::tip
`Set-Cookie`的字段属性：

`NAME=VALUE`：赋予`Cookie`的名称和值；

`expires=DATE`: `Cookie`的有效期；

`path=PATH`: 将服务器上的目录作为`Cookie`的适用对象，若不指定，则默认为文档所在的文件目录；

`domin=域名`：作为`Cookies`适用对象的域名，若不指定，则默认为创建`Cookie`的服务器域名；

`Secure`: 仅在`HTTPS`安全通信是才会发送`Cookie`；

`HttpOnly`: 使`Cookie`不能被JS脚本访问；

如：`Set-Cookie:BDSVRBFE=Go; max-age=10; domain=m.baidu.com; path=/`
:::

## HTTP应答状态码

状态码   |  类别 | 描述
| :-------- | :----- | :---- |
1xx |`Informational`(信息性状态码) | 请求正在被处理
2xx |`Success`(成功状态码)| 请求处理成功
3xx |`Redirection`(重定向状态码) | 需要进行重定向
4xx |`Client Error`(客户端状态码) | 服务器无法处理请求
5xx |`Server Error`(服务端状态码) | 服务器处理请求时出错

### 常见应答状态码

![常见http状态码](https://img-blog.csdnimg.cn/20200208133106769.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

## HTTP缺点

1. 通信使用明文，可能被窃听
2. 不验证通信方的身份，可能遭遇伪装
3. 无法证明报文的完整性，有可能遭遇篡改

以上是`HTTP`的缺点，这在网络通信中对企业安全是很致命的问题。那`HTTPS`能解决这些问题吗？下面讲讲`HTTPS`。

## HTTPS定义

`HTTP`+加密+认证+完整性保护 = `HTTPS`

> 超文本传输安全协议（`Hypertext Transfer Protocol Secure`，缩写：`HTTPS`，常称为`HTTP over TLS`，`HTTP over SSL`或`HTTP Secure`）是一种通过计算机网络进行安全通信的传输协议。`HTTPS`经由`HTTP`进行通信，但利用`SSL/TLS`来加密数据包。

`HTTP`协议采用明文传输信息，存在信息窃听、信息篡改和信息劫持的风险，而协议`TLS/SSL`具有身份验证、信息加密和完整性校验的功能，可以避免此类问题发生。

`TLS/SSL`全称安全传输层协议`Transport Layer Security`, 是介于`TCP`和`HTTP`之间的一层安全协议，不影响原有的`TCP`协议和`HTTP`协议，所以使用`HTTPS`基本上不需要对`HTTP`页面进行太多的改造。

![https组成](https://img-blog.csdnimg.cn/2020020813541846.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

`HTTPS`是在`HTTP`上建立`SSL`加密层，并对传输数据进行加密，是`HTTP`协议的安全版。`HTTPS`主要作用是：

- 对数据进行加密，并建立一个信息安全通道，来保证传输过程中的数据安全。
- 对网站服务器进行真实身份认证。


## TLS/SSL工作原理

:::tip

`HTTPS`协议的主要功能基本都依赖于`TLS/SSL协议`，`TLS/SSL`的功能实现主要依赖于三类基本算法：`散列函数 Hash`、`对称加密`和`非对称加密`。

**其利用非对称加密实现身份认证和密钥协商，对称加密算法采用协商的密钥对数据加密，基于散列函数验证信息的完整性。**

:::

![TSL/SSL](https://img-blog.csdnimg.cn/20200208140622882.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

![HTTPS建立过程](https://img-blog.csdnimg.cn/20200208140631461.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

### 散列函数Hash

常见的有 `MD5`、`SHA1`、`SHA256`，该类函数特点是函数单向不可逆、对输入非常敏感、输出长度固定，针对数据的任何修改都会改变散列函数的结果，用于防止信息篡改并验证数据的完整性;

在信息传输过程中，散列函数不能单独实现信息防篡改，因为明文传输，中间人可以修改信息之后重新计算信息摘要，因此需要对传输的信息以及信息摘要进行加密;

### 对称加密

常见的有`AES-CBC`、`DES`、`3DES`、`AES-GCM`等，相同的密钥可以用于信息的加密和解密，掌握密钥才能获取信息，能够防止信息窃听，通信方式是1对1;

对称加密的优势是信息传输1对1，需要共享相同的密码，密码的安全是保证信息安全的基础，服务器和 N 个客户端通信，需要维持 N 个密码记录，且缺少修改密码的机制;

### 非对称加密

即常见的 `RSA` 算法，还包括 `ECC`、`DH` 等算法，算法特点是，密钥成对出现，一般称为公钥(公开)和私钥(保密)，公钥加密的信息只能私钥解开，私钥加密的信息只能公钥解开。因此掌握公钥的不同客户端之间不能互相解密信息，只能和掌握私钥的服务器进行加密通信，服务器可以实现1对多的通信，客户端也可以用来验证掌握私钥的服务器身份。

非对称加密的特点是信息传输1对多，服务器只需要维持一个私钥就能够和多个客户端进行加密通信，但服务器发出的信息能够被所有的客户端解密，且该算法的计算复杂，加密速度慢。

:::tip
**结合三类算法的特点，`TLS`的基本工作方式是:**

客户端使用非对称加密与服务器进行通信，实现身份验证并协商对称加密使用的密钥，然后对称加密算法采用协商密钥对信息以及信息摘要进行加密通信，不同的节点之间采用的对称密钥不同，从而可以保证信息只能通信双方获取。
:::

## PKI体系

### RSA身份验证的隐患

身份验证和密钥协商是`TLS`的基础功能，要求的前提是合法的服务器掌握着对应的私钥。但RSA算法无法确保服务器身份的合法性，因为公钥并不包含服务器的信息，存在安全隐患:

- 客户端C和服务器S进行通信，中间节点M截获了二者的通信;
- 节点M自己计算产生一对公钥pub_M和私钥pri_M;
- C向S请求公钥时，M把自己的公钥pub_M发给了C;
- C使用公钥 pub_M加密的数据能够被M解密，因为M掌握对应的私钥pri_M，而C无法根据公钥信息判断服务器的身份，从而 C和 * M之间建立了"可信"加密连接;
- 中间节点 M和服务器S之间再建立合法的连接，因此 C和 S之间通信被M完全掌握，M可以进行信息的窃听、篡改等操作。
- 另外，服务器也可以对自己的发出的信息进行否认，不承认相关信息是自己发出。

因此该方案下至少存在两类问题：`中间人攻击`和`信息抵赖`。

![RSA身份验证的隐患](https://img-blog.csdnimg.cn/2020020814180822.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

### 身份验证CA和证书

解决上述身份验证问题的关键是确保获取的公钥途径是合法的，能够验证服务器的身份信息，为此需要引入权威的第三方机构CA(如沃通CA)。

`CA`负责核实公钥的拥有者的信息，并颁发认证"证书"，同时能够为使用者提供证书验证服务，即`PKI`体系(PKI基础知识)。

基本的原理为，CA负责审核信息，然后对关键信息利用私钥进行"签名"，公开对应的公钥，客户端可以利用公钥验证签名。CA也可以吊销已经签发的证书，基本的方式包括两类 `CRL` 文件和 `OCSP`。CA使用具体的流程如下：

![CA流程](https://img-blog.csdnimg.cn/20200208142030173.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

:::tip
1. 服务方S向第三方机构CA提交公钥、组织信息、个人信息(域名)等信息并申请认证;

2. CA通过线上、线下等多种手段验证申请者提供信息的真实性，如组织是否存在、企业是否合法，是否拥有域名的所有权等;

3. 如信息审核通过，CA会向申请者签发认证文件-证书。
    
    证书包含以下信息：`申请者公钥`、`申请者的组织信息和个人信息`、`签发机构CA的信息`、`有效时间`、`证书序列号等信息的明文`，同时包含`一个签名`;

    签名的产生算法：首先，使用散列函数计算公开的明文信息的信息摘要，然后，采用 CA的私钥对信息摘要进行加密，密文即签名;

4. 客户端 C 向服务器 S 发出请求时，S 返回证书文件;

5. 客户端C读取证书中的相关的明文信息，采用相同的散列函数计算得到信息摘要，然后，利用对应 CA的公钥解密签名数据，对比证书的信息摘要，如果一致，则可以确认证书的合法性，即公钥合法;

6. 客户端然后验证证书相关的域名信息、有效时间等信息;

7. 客户端会内置信任CA的证书信息(包含公钥)，如果CA不被信任，则找不到对应 CA的证书，证书也会被判定非法。
:::

:::warning

**在这个过程注意几点：**

1. 申请证书不需要提供私钥，确保私钥永远只能服务器掌握;

2. 证书的合法性仍然依赖于非对称加密算法，证书主要是增加了服务器信息以及签名;

3. 内置 CA 对应的证书称为根证书，颁发者和使用者相同，自己为自己签名，即自签名证书（为什么说"部署自签SSL证书非常不安全"）

4. 证书=公钥+申请者与颁发者信息+签名;

:::

### 证书链

如 CA根证书和服务器证书中间增加一级证书机构，即`中间证书`，证书的产生和验证原理不变，只是增加一层验证，只要最后能够被任何信任的CA根证书验证合法即可。

1. 服务器证书 `server.pem` 的签发者为中间证书机构 `inter`，`inter` 根据证书 `inter.pem` 验证 `server.pem` 确实为自己签发的有效证书;

2. 中间证书 `inter.pem` 的签发 CA 为 `root`，`root` 根据证书 `root.pem` 验证 `inter.pem` 为自己签发的合法证书;

3. 客户端内置信任 CA 的 `root.pem`证书，因此服务器证书 `server.pem` 的被信任。

![证书链](https://img-blog.csdnimg.cn/20200208142837116.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

服务器证书、中间证书与根证书在一起组合成一条合法的证书链，证书链的验证是自下而上的信任传递的过程。

:::tip

**二级证书结构存在的优势：**

1. 减少根证书结构的管理工作量，可以更高效的进行证书的审核与签发;

2. 根证书一般内置在客户端中，私钥一般离线存储，一旦私钥泄露，则吊销过程非常困难，无法及时补救;

3. 中间证书结构的私钥泄露，则可以快速在线吊销，并重新为用户签发新的证书;

4. 证书链四级以内一般不会对 `HTTPS` 的性能造成明显影响。
:::

![https证书链s](https://img-blog.csdnimg.cn/20200208143242796.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

:::tip

**证书链有以下特点：**

1. 同一本服务器证书可能存在多条合法的证书链。

    因为证书的生成和验证基础是公钥和私钥对，如果采用相同的公钥和私钥生成不同的中间证书，针对被签发者而言，该签发机构都是合法的 CA，不同的是中间证书的签发机构不同;

2. 不同证书链的层级不一定相同，可能二级、三级或四级证书链。

    中间证书的签发机构可能是根证书机构也可能是另一个中间证书机构，所以证书链层级不一定相同。

:::

### 证书吊销

CA 机构能够签发证书，同样也存在机制宣布以往签发的证书无效。证书使用者不合法，CA 需要废弃该证书;或者私钥丢失，使用者申请让证书无效。主要存在两类机制：`CRL` 与 `OCSP`。

- `CRL(Certificate Revocation List)`证书吊销列表

一个单独的文件。该文件包含了 CA 已经吊销的证书序列号(唯一)与吊销日期，同时该文件包含生效日期并通知下次更新该文件的时间，当然该文件必然包含 CA 私钥的签名以验证文件的合法性。

证书中一般会包含一个 `URL` 地址 `CRL Distribution Point`，通知使用者去哪里下载对应的 `CRL` 以校验证书是否吊销。

该吊销方式的优点是不需要频繁更新，但是不能及时吊销证书，因为 `CRL` 更新时间一般是几天，这期间可能已经造成了极大损失。

- `OCSP(Online Certificate Status Protocol)`证书状态在线查询协议

一个实时查询证书是否吊销的方式。请求者发送证书的信息并请求查询，服务器返回正常、吊销或未知中的任何一个状态。证书中一般也会包含一个 `OCSP` 的 `URL` 地址，要求查询服务器具有良好的性能。

部分 CA 或大部分的自签 CA (根证书)都是未提供 `CRL` 或 `OCSP` 地址的，对于吊销证书会是一件非常麻烦的事情。


## HTTPS性能与优化

### HTTPS性能损耗

前文讨论了`HTTPS`原理与优势：身份验证、信息加密与完整性校验等，且未对`TCP`和`HTTP`协议做任何修改。但通过增加新协议以实现更安全的通信必然需要付出代价，`HTTPS`协议的性能损耗主要体现如下：

- 增加延时

分析前面的握手过程，一次完整的握手至少需要两端依次来回两次通信，至少增加延时`2* RTT`，利用会话缓存从而复用连接，延时也至少`1* RTT*`

- 消耗较多的CPU资源

除数据传输之外，`HTTPS`通信主要包括对对称加解密、非对称加解密(服务器主要采用私钥解密数据);

压测 `TS8` 机型的单核 `CPU`：对称加密算法`AES-CBC-256` 吞吐量 `600Mbps`，非对称 `RSA` 私钥解密`200次/s`。

不考虑其它软件层面的开销，`10G` 网卡为对称加密需要消耗 `CPU` 约17核，24核CPU最多接入 `HTTPS` 连接 4800;

静态节点当前`10G` 网卡的 `TS8` 机型的 `HTTP `单机接入能力约为`10w/s`，如果将所有的`HTTP`连接变为`HTTPS`连接，则明显`RSA`的解密最先成为瓶颈。因此，`RSA`的解密能力是当前困扰`HTTPS`接入的主要难题。

### HTTPS接入优化


- CDN接入

`HTTPS` 增加的延时主要是`传输延时 RTT`，`RTT` 的特点是节点越近延时越小，`CDN` 天然离用户最近，因此选择使用 `CDN` 作为 `HTTPS` 接入的入口，将能够极大减少接入延时。`CDN `节点通过和业务服务器维持长连接、会话复用和链路质量优化等可控方法，极大减少 `HTTPS` 带来的延时。

- 会话缓存

虽然前文提到 `HTTPS` 即使采用会话缓存也要至少`1*RTT`的延时，但是至少延时已经减少为原来的一半，明显的延时优化;

同时，基于会话缓存建立的 `HTTPS` 连接不需要服务器使用`RSA`私钥解密获取 `Pre-master` 信息，可以省去`CPU` 的消耗。

如果业务访问连接集中，缓存命中率高，则`HTTPS`的接入能力将明显提升。当前`TRP`平台的缓存命中率高峰时期大于30%，10k/s的接入资源实际可以承载13k/的接入，收效非常可观。

- 硬件加速

为接入服务器安装专用的`SSL`硬件加速卡，作用类似 `GPU`，释放 `CPU`，能够具有更高的 `HTTPS` 接入能力且不影响业务程序的。测试某硬件加速卡单卡可以提供35k的解密能力，相当于175核 CPU，至少相当于7台24核的服务器，考虑到接入服务器其它程序的开销，一张硬件卡可以实现接近10台服务器的接入能力。

- 远程解密

本地接入消耗过多的 `CPU` 资源，浪费了网卡和硬盘等资源，考虑将最消耗 `CPU` 资源的`RSA`解密计算任务转移到其它服务器，如此则可以充分发挥服务器的接入能力，充分利用带宽与网卡资源。远程解密服务器可以选择 `CPU` 负载较低的机器充当，实现机器资源复用，也可以是专门优化的高计算性能的服务器。当前也是 `CDN` 用于大规模`HTTPS`接入的解决方案之一。

- SPDY/HTTP2

前面的方法分别从减少传输延时和单机负载的方法提高 `HTTPS` 接入性能，但是方法都基于不改变 `HTTP` 协议的基础上提出的优化方法，`SPDY/HTTP2` 利用 `TLS/SSL` 带来的优势，通过修改协议的方法来提升 `HTTPS` 的性能，提高下载速度等。


## HTTP网络优化

### 减少资源体积

- gzip压缩

> `gzip` 使用了 `LZ77` 算法与 `Huffman` 编码来压缩文件，重复度越高的文件可压缩的空间就越大

:::tip
**如何查看是否开启`gzip`？**

—— 打开控制面板进入`NetWork`，右键选取`response headers` 选择查看`Content-Encoding`

`Content-Encoding`：内容编码格式`gzip` 和 `deflate`

**如何使用`gzip`？**



1. 首先浏览器（也就是客户端）发送请求时，通过`Accept-Encoding`带上自己支持的内容编码格式列表
2. 服务端在接收到请求后，从中挑选出一种用来对响应信息进行编码，并通过`Content-Encoding`来说明服务端选定的编码信息
3. 浏览器在拿到响应正文后，依据`Content-Encoding`进行解压。
:::

![gzip例子](https://img-blog.csdnimg.cn/20200210001648114.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

我们可以看到图片中开启`gzip`压缩之后文件小了很多(越小的文件越不明显)

- nginx开启

```nginx
gzip on;

gzip_min_length 1k; // 不压缩临界值，大于1K的才压缩，一般不用改

gzip_comp_level 2; // 压缩级别，1-10，数字越大压缩的越细，时间也越长

gzip_types text/plain application/javascript application/x-javascript text/css application/xml text/javascript application/x-httpd-php image/jpeg image/gif image/png; // 进行压缩的文件类型

gzip_disable "MSIE [1-6]\.";// ie兼容性不好所以放弃
```

- webpack开启

`compression-webpack-plugin` 这个插件可以提供功能

```js
const CompressionWebpackPlugin = require('compression-webpack-plugin');
plugins.push(    
    new CompressionWebpackPlugin({
        asset: '[path].gz[query]',// 目标文件名        
        algorithm: 'gzip',// 使用gzip压缩       
        test: new RegExp( '\\.(js|css)$' // 压缩 js 与 css),        
        threshold: 10240,// 资源文件大于10240B=10kB时会被压缩        
        minRatio: 0.8 // 最小压缩比达到0.8时才会被压缩    
    })
);
```

:::tip
**`webpack`的`gzip`和`nginx`的有什么关系？**

1. `nginx`没有开启`gzip`压缩,`webpack`打包出的`.gz`文件是用不到的

2. `nginx`开启了`gzip`，`nginx`查找静态资源是否存在已经压缩好的`gzip`压缩文件，如果没有则自行压缩（消耗cpu但感知比较少）

3. `nginx`开启`gzip`压缩,`webpack`打包出的`.gz`文件被找到，提前（打包）压缩直接使用，减少了`nginx`的压缩损耗
:::

### gzip是怎么压缩的？

到这一步的都不是一般人了，我就简述一下:使用`"滑动窗口"`的方法，来寻找文件中的每一个匹配长度达到最小匹配的串，重复的内容以一个哈希值存储在字典表中并替换到匹配的串上，以此来达到压缩，因此重复度越高的文件可压缩的空间就越大。


### 源文件控制

- 图片采用webp格式
- http2——头部压缩

### 减少资源请求
- 使用DNS
- 使用http2
- 使用缓存


## HTTP1.0、HTTP1.1及HTTP2.0区别

### HTTP基本优化

影响一个HTTP网络请求的因素主要有两个:`带宽`和`延迟`。

- 带宽:服务器资源相关

- 延迟
    - 浏览器阻塞(HOL Blocking):浏览器会因为一些原因阻塞请求。浏览器对于同一个域名，同时只能有固定个连接。
    
   | 浏览器 | HTTP 1.1 | HTTP 1.0 |
   |:----|:----|:----|
   | IE 6,7	| 2	| 4
   | IE 8 |	6 |	6
   | Firefox 2 | 2|	8
   | Firefox 3 | 6|	6
   | Safari | 3, 4|	4 |	4
   | Chrome 1,2 | 6|	?
   | Chrome 3	| 4	|4
   | Opera 9.63,10.00alpha|	4|	4

   超过浏览器最大连接数的限制，后续的请求就会被阻塞。

   - DNS查询

   浏览器需要知道目标服务器的IP才能建立连接。DNS就是将域名解析为IP。

   可以利用DNS缓存结果减少这个时间。

   - 建立连接

   `HTTP`是基于`TCP`协议的。需要经过三次握手才能携带请求报文。


### HTTP1.0与HTTP1.1的一些区别

HTTP最早在网页中使用是1996年，而HTTP1.1是1996年后才开始广泛用于现在的各大浏览器网络请求中。

主要区别在于:

**1. 缓存处理**

`HTTP1.0`中主要使用`header`里的`if-Modified-Since`,`Expires`来作为缓存判断的标准。

`HTTP1.1`引入了更多的缓存控制策略，例如`Enity tag`、`if-Unmodified-Since`、`if-Match`、`if-None-Match`等更多可提供选择的缓存头来控制缓存策略。

**2. 带宽优化及网络连接的作用**

`HTTP1.0`中存在一些浪费带宽的现象，例如客户端只是需要某个对象的一部分，而服务器却将整个对象返回回来了，并且不支持断点续传的功能。

`HTTP1.1`则在请求头中引入了`range`头域，他允许只请求资源的某个部分,即返回码是`206(Partial Content)`,这样就方便开发者自由的选择以便于充分利用带宽连接。

**3. 错误通知的管理**

在`HTTP1.1`中新增了24个错误状态响应码，如409(Conflict)表示请求的资源与资源当前状态发生冲突，401(Gone)表示服务器上的某个资源被永久性的删除。

**4. Host头处理**

在`HTTP1.0`中认为每台服务器都绑定一个唯一的IP地址，因此请求消息中的URL并没有传递主机名(hostname)。

在`HTTP1.1`中请求消息和响应消息都应支持`Host`头域，且消息请求中如果没有Host头域会报告一个错误(400 Bad Request)。

**5. 长连接**

`HTTP1.1`开始支持长连接

### HTTP与HTPPS的一些区别

- HTTPS协议需要到CA申请证书,一般免费证书比较少，需要付费。

- HTTP协议运行在TCP之上，所有的传输内容都是明文的，HTTPS运行在SSL/TSL之上,SSL/TSL运行在TCP上，所有传输内容都是加密的。

- HTTP与HTTPS采用完全不同的连接方式，用的端口也不一样，前者是80，后者是443。

- HTTPS可以有效的防止运营商劫持,解决了防劫持的一个问题。

### SPDY:HTTP1.x的优化

2012年google如一声惊雷提出了SPDY的方案，优化了HTTP1.x的请求延迟，解决了HTTP1.x的安全性，具体如下:

**1. 降低延迟,针对HTTP高延迟的问题，SPDY优雅的采用了`多路复用(multiplexing)`。**

多路复用通过多个请求stream共享一个tcp连接的方式，解决了HOL blocking的问题，降低了延迟同时提高了带宽的利用率。

**2. 请求优先级(request piroritization)。**

多路复用带来一个新的问题是，在连接共享的基础之上有可能导致关键请求被阻塞。SPDY允许给每个request设置优先级，这样重要的请求就会优先得到响应。比如浏览器加载首页，首页的html内容应该优先展示，之后才是各种静态资源文件，脚本文件等加载，这样可以保证用户能第一时间看到网页的内容。

**3. header压缩**

前面提到的HTTP1.x的header很多时候是多余的。选择合适的压缩算法可以减小包的大小和数量。

**4. 基于HTTPS的加密协议传输**

HTTPS传输大大提高了数据传输的可靠性。

**5. 服务端推送(Server Push)**

采用了SPDY的网页，例如我的网页有一个style.css的请求，在客户端收到style.css数据的同时，服务端会将style.js的文件推送到客户端，当客户端再次尝试获取style.js时就可以直接从缓存中获取，不用再发请求了。

### HTTP2.0:SPDY的升级版

HTTP2.0是SPDY的升级版，基于SPDY设计。

#### HTTP2.0与SPDY的区别

1. HTTP2.0支持明文HTTP传输，而SPDY强制使用HTTPS。

2. HTTP2.0消息头压缩算法采用`HPACK(http://http2.github.io/http2-spec/compression.html)`,SPDY采用`DEFLATE(http://zh.wikipedia.org/wiki/DEFLATE)`。


### HTTP2.0及HTTP1.x相比的新特性

- 新的二进制格式

HTTP1.x的解析是基于文本的。基于文本协议的格式解析存在天然缺陷，文本的表现形式具有多样性，要做到健壮性考虑的场景必然很多，二进制则不同，只有0和1的组合。

- 多路复用

即连接共享，即每个request都是用作连接共享机制的。一个request对应一个id，这样一个连接上可以有多个request，每个连接的request可以随机的混杂在一起，接收方可以根据request的id将request再归属到各自不同的服务端请求里面。

- header压缩

HTTP1.x中的header带有大量的信息，而且每次都要重复发送，HTTP2.0使用encoder来减少需要传输的header大小，通讯双方各自cache一份header fields表，既避免了重复header的传输，又减小了需要传输的大小。

- 服务端推送

### HTTP2.0的升级改造

- HTTP2.0可以支持非HTTPS，但是主流浏览器Chorme，firefox表示还是只支持基于TLS部署的HTTP2.0协议，所以要升级成HTTP2.0还是先升级HTTPS为好。

- 当你的网站升级为HTTPS之后，那么升级HTTP2.0就比较简单了，如果你使用了nginx，只要在配置文件中启用相应的协议就可以了。(参考地址:https://www.nginx.com/blog/nginx-1-9-5/)

- 在使用了HTTP2.0之后，原来的HTTP1.x怎么办?HTTP2.0完全兼容HTTP1.x的语义,对于不支持HTTP2.0的浏览器,nginx会自动向下兼容。


### HTTP2.0的多路复用 和 HTTP1.x的长连接有什么区别？

- HTTP/1.*一次请求-响应，建立一个连接，用完关闭。每一个请求都要建立一个连接。

- HTTP/1.1 Pipeling 解决方式为，若干个请求排队串行化单线处理，后面的请求会等待前面请求的返回之后才能会的执行机会。一旦有某请求超时等，后续请求只能被阻塞，毫无办法，也就是人们常说的线头阻塞。

- HTTP/2多个请求可同时在一个连接上并行执行。某个请求任务耗时严重，不会影响到其他连接的正常执行。

### 服务端推送到底是什么？

服务端推送能把客户端所需要的资源伴随着index.html一起发送到客户端，省去了客户端重复请求的步骤。正因为没有发送请求，建立连接等操作，所以静态资源通过服务端推送的方式可以极大地提升速度。

## 强缓存与协商缓存

Web缓存是可以自动保存常见文档副本的HTTP设备。当Web请求抵达缓存时，如果本地有"已缓存"的副本，就可以从本地存储设备而不是原始服务器中提取这个文档。

![缓存的流程](https://img-blog.csdnimg.cn/20200211145959398.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

### 缓存的优点

- 减少了冗余的数据传输，节省了网络费用。

- 缓解了网络瓶颈的问题，不需要更多的带宽就能够更快的加载页面。

- 降低了对原始服务器的要求，服务器可以更快的响应，避免过载的出现。

- 降低了距离延迟，因为从更远的地方加载会更加慢一点。

### 缓存的缺点

- 缓存中的数据可能和服务器中的数据不一致。

- 更加消耗内存。

### 浏览器中的缓存

浏览器中的缓存主要分为`强缓存`和`协商缓存`。

1. 浏览器进行资源请求时，会判断responese header是否命中强缓存，如果命中，直接从本地读取缓存，不会发送请求到服务器。

2. 如果未命中强缓存，会发送请求到服务器，判断协商缓存是否命中，如果命中的会，服务器会将请求返回(304),但是不会返回资源，告诉浏览器直接从本地读取缓存。如果不命中，服务器会直接返回资源。

### **强缓存**

到底什么是强缓存？强在哪？

其实强是强制的意思。当浏览器去请求某个文件的时候，服务端就在`respone header`里面对该文件做了缓存配置。缓存的时间、缓存类型都由服务端控制。

具体表现为：`respone header` 的`cache-control`，常见的设置是`max-age`、 `public`、 `private` 、`no-cache` 、`no-store`等以及返回头设置`Expires`字段。

![Cache-control](https://img-blog.csdnimg.cn/20200211142418838.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

:::tip
`max-age`表示缓存的时间是315360000秒（10年）

`public`表示可以被浏览器和代理服务器缓存

`immutable`表示即使用户刷新浏览器也不会去请求服务器

`from memory cache`表示从内存中读取缓存

`from disk cache`表示从磁盘中读取缓存
:::


`Expires`是一个`GMT`时间格式字符串,浏览器第一次请求的时候,服务器会在返回头部加上Expires，下次请求的时候如果在这个时间之前那么命中缓存。

```js
app.get('/',(req, res)=>{
    const cssContent = path.join(__dirname, './html/index.html');
    fs.readFile(cssContent, function(err, data){
        res.setHeader("Expires",new Date(Date().now() + 2592000000).toUTCString());
        res.end(data)
    })

})
```

:::tip
强缓存总结

1. `cache-control: max-age=xxxx，public`

客户端和代理服务器都可以缓存该资源；

客户端在xxx秒的有效期内，如果有请求该资源的需求的话就直接读取缓存,`statu code:200` ，如果用户做了刷新操作，就向服务器发起`http`请求。

2. `cache-control: max-age=xxxx，private`

只让客户端可以缓存该资源；代理服务器不缓存

客户端在xxx秒内直接读取缓存,statu code:200

3. `cache-control: max-age=xxxx，immutable`

客户端在xxx秒的有效期内，如果有请求该资源的需求的话就直接读取缓存,`statu code:200`，即使用户做了刷新操作，也不向服务器发起http请求

4. `cache-control: no-cache`

跳过设置强缓存，但是不妨碍设置协商缓存；一般如果你做了强缓存，只有在强缓存失效了才走协商缓存的，设置了`no-cache`就不会走强缓存了，每次请求都会询问服务端。

5. `cache-control: no-store`

不缓存，这个会让客户端、服务器都不缓存，也就没有所谓的强缓存、协商缓存了。
:::


### **协商缓存**

上面说到的强缓存就是给资源设置个过期时间，客户端每次请求资源时都会看是否过期；只有在过期才会去询问服务器。所以，强缓存就是为了给客户端自给自足用的。

而当某天，客户端请求该资源时发现其过期了，这时就会去请求服务器了，而这时候去请求服务器的这过程就可以设置协商缓存。这时候，协商缓存就是需要客户端和服务器两端进行交互的。

> 协议缓存主要是利用`Last-Modified`、`If-Modified-Since`和`Etag`、`If-None-Match`来实现。

:::tip

`Last-Modified`:表示为实体头部部分，`response`返回，表示为资源的最后更新时间,精确到秒。

`If-Modified-Since`:通过比较两次的时间判断，资源在请求期间是否有修改，假如没有修改，则命中协商缓存，浏览器从缓存中读取资源，如果没有命中，资源有过修改，返回新的`Last-Modified`和服务器资源。

:::

```js
app.get('/', (req, res) => {
    const cssContent = path.join(__dirname, './html/index.html')
    fs.stat(cssContent, (err, start) => {
        if (req.headers['if-modified-since'] === start.mtime.toUTCString()) {
            res.writeHead(304, 'Not Modified');
            res.end();
        } else {
            fs.readFile(cssContent, function (err, data) {
                let lastModified = start.mtime.toUTCString();
                res.setHeader('Last-Modified', lastModified);
                res.writeHead(200, 'OK');
                res.end(data);
            })
        }
    })
});
```


:::warning

有些情况下仅判断最后修改日期来验证资源是否有改动是不够的：

1. 存在周期性重写某些资源，但资源实际包含的内容并无变化；
2. 被修改的信息并不重要，如注释等；
3. `Last-Modified`无法精确到毫秒，但有些资源更新频率有时会小于一秒。
:::

:::tip

`ETag`:为相应头部字段，表示资源内容的唯一标识(文件hash,类似webpack打包生成的文件hash)，随服务器`response`返回；

`If-None-Match`: 服务器比较请求头中的`If-None-Match`和当前资源中的`etag`是否一致，来判断资源是否修改过，如果没有修改，则命中缓存，浏览器从缓存中读取资源，如果修改过，服务器会返回新的`etag`，并返回资源；

:::

```js
app.get('/home', (req, res) => {
    const cssContent = path.join(__dirname, './html/index.html')
    fs.stat(cssContent, (err, start) => {
        let etag = md5(cssContent);
        if (req.headers['if-none-match'] === etag) {
            res.writeHead(304, 'Not Modified');
            res.end();
        } else {
            fs.readFile(cssContent, function (err, data) {
                res.setHeader('Etag', etag);
                res.writeHead(200, 'OK');
                res.end(data);
            })
        }
    })
});
```
:::tip

**协商缓存步骤总结:**

1. 请求资源时，把用户本地该资源的`etag`同时带到服务端，服务端和最新资源做对比。
2. 如果资源没更改，返回304，浏览器读取本地缓存。
3. 如果资源有更改，返回200，返回最新的资源。

不推荐使用 `Expires` 首部，它指定的是实际的过期日期而不是秒数。

`HTTP`设计者后来认为，由于很多服务器的时钟都不同步，或者不正确，所以最好还是用剩余秒数，而不是绝对时间来表示过期时间。


`ETag`解决了`Last-Modified`使用时可能出现的资源的时间戳变了但内容没变及如果再一秒钟以内资源变化但`Last-Modified`没变的问题，感觉ETag更加稳妥。

补充：根据浏览器缓存策略，`Expire`和`Cache-Control`用回车、后退、F5刷新会跳过本地缓存，每次都会从服务器中获数据。

:::

## 从用户输入URL到浏览器呈现页面发生了什么？

## 理解域名中的CNAME

- 2020.06.04

### 简介

> `CNAME` 即指`别名记录`，也被称为`规范名字`。这种记录允你将多个名字映射到同一台计算机。

**什么情况下会用到 CNAME 记录？**

如果需要将域名指向另一个域名，再由另一个域名提供 ip地址，就需要添加 `CNAME记录`。最常用到CNAME的情况包括：做 CDN ，做企业邮局。

### CNAME 配置

这里已七牛云的配置为示例.如果需要对七牛存储空间的自定义域名（自定义域名建议使用二级域名）进行 CNAME 配置。

#### 获取CNAME值

在 `七牛开发者平台` 页面选择 `CDN` ，选择 `域名管理`，鼠标停留在域名对应CNAME值上即可点击复制 ，如下图所示。

![七牛云图片示例](https://dn-odum9helk.qbox.me/FkqzaHLz8IkzamxYtONzj--5TscU)

#### 添加CNAME记录

添加CNAME记录需要在您的域名厂商处配置，比如您在 阿里云 / 腾讯云 / 新网 等处购买的域名，您需要前往购买域名的厂商相应管理控制台，添加域名解析。

1. 打开您购买域名的厂商官网，登陆后在页面右上角找到 控制台 或 相关管理后台入口。

2. 在域名厂商的控制台中，找到您的域名解析添加页面，例如：
    - a. 阿里云：在控制台页面的左侧，产品与服务栏中选择 域名。
    - b. 腾讯云：在控制台的云产品中，搜索并选择 云解析。
    - c. DNSPOD：在控制台页面左侧，选择 域名。

3. 在域名产品的列表中找到您加速域名对应的主域名，点击域名后面的 解析设置 或 解析，进入解析设置页。

4. 选择 `添加记录` ，依次填写 `主机记录`，`记录类型` 以及 `记录值`，其他可设为默认值。

![七牛云图片示例](https://dn-odum9helk.qbox.me/Fn5LvRsKMEUgBQM4PvvAccI-ISyO)

| 参数	| 填写说明	| 注意事项
|:---   |:---    |:---
| 主机记录 | 填写加速域名对应的主机前缀 |	该参数唯一，请勿自定义
| 记录类型 | 选择 CNAME 类型	| 该参数唯一，请勿自定义
| 线路类型 | 保持默认 | 该参数可以根据需求自行调整
| 记录值  |	域名创建后，七牛提供的 CNAME | 该参数唯一，请勿自定义
| TTL	 | 保持默认	| 该参数可以根据需求自行调整

#### 如何处理 CNAME 记录和 A 记录冲突？

同一个域名只能使用 A 记录解析，或者使用 CNAME 解析，如果您在添加域名的 CNAME 解析时提示存在冲突，请检查该主机记录是否已经存在 A 记录。

解决方案：
1. 如果您的域名用于绑定七牛云存储

    - 重新添加一个未在其他地方使用的二级加速域名，例如您原本在七牛绑定的是 `qiniu.com` 或 `www.qiniu.com` ，建议您重新在空间绑定加速域名例如 `cdn.qiniu.com` 或者 `xxx.qiniu.com` ，然后针对新添加的加速域名，配置对应的解析即可。
    
    - 删除您原有的 A 记录就可做 CNAME 解析
    (注：A 记录删除会导致您的域名无法访问该域名的原有资源，谨慎操作)

2. 如果您的域名用于加速您的源站服务器站点

    - 在确认 CDN 配置无误情况下，可以删除A记录。
    - 通过配置 CNAME 解析，使得域名能够绑定到七牛的加速线路上。

:::tip
修改 CNAME 配置生效时间：新增 CNAME 记录会实时生效，而修改 CNAME 记录需要等待生效时间 TTL。
:::

#### 如何判断 CNAME 是否正确配置？

先在CDN 的 域名管理 中检查域名是否创建成功，如果已经创建成功，且已经按照步骤添加了 CNAME 解析，但是无法正常访问资源外链，或保持“等待 CNAME ”状态，可以通过以下方法检测本地的域名解析，如果域名长时间没有创建成功，您可以提交工单处理。