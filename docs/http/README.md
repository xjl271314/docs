# HTTP 相关知识

## HTTP 定义

> `HTTP(HyperText Transfer Protocal)`超文本传输协议，它通常运行在 TCP 之上，通过浏览器和服务器进行数据交互，进行超文本（文本、图片、视频等）传输的规定。也就是说，HTTP 协议规定了超文本传输所要遵守的规则。

通过`HTTP`或者`HTTPS`协议请求的资源由统一资源标识符`URL(Uniform Resource Identifiers)`来标识。

## HTTP 特点

http 主要有以下几个特点:

- 仅支持(客户端/服务端)模式。意味着该请求只能通过客户端发起,服务端响应。

- 简单快速、灵活。

- HTTP 协议是无状态的。这意味着客户端和服务端之间无法知晓当前对方的状态信息，`HTTP` 请求本身是不带有任何状态存储的。但实际情况下，客户端和服务端必然需要状态的认证和交互，所以就引入了 `Cookie`、`Session`， 用于存储当前浏览器的一些状态信息，每次通过独立的 `HTTP` 请求进行收发，从而解决这个问题。

- HTTP 请求互相独立。HTTP 互相之间都是一个独立的个体请求，在客户端请求网页时多数情况下并不是一次请求就能成功的，服务端首先是响应 HTML 页面，然后浏览器收到响应之后发现页面还引用了其他的资源，例如，CSS，JS 文件，图片等等，还会自动发送 HTTP 请求获取这些需要的资源。

- HTTP 协议基于 TCP 协议。HTTP 协议目的是规定客户端和服务端数据传输的格式和数据交互行为，并不负责数据传输的细节，底层是基于 TCP 实现的。现在使用的版本当中是默认持久连接的，也就是多次 HTTP 请求使用一个 TCP 连接。

:::warning
注意：`HTTP` 请求和 `TCP` 连接是不一样的，HTTP 是在 TCP 连接建立的基础上而发起的传输请求，在同一个 TCP 连接通道下，可以发送多个 HTTP 请求，举个例子的话就是高速公路和车子的关系。
:::

## HTTP 请求响应模型

HTTP 由请求和响应构成，是一个标准的客户端服务器模型(B/S)。

HTTP 协议永远是客户端发起，然后服务器返回响应。

![HTTP请求](https://img-blog.csdnimg.cn/20200207155322862.png)

:::tip
`HTTP`是一个无状态的协议。

无状态是指客户机（`Web`浏览器）和服务器之间不需要建立持久的连接，这意味着当一个客户端向服务器端发出请求，然后服务器返回响应(`response`)，连接就被关闭了，在服务器端不保留连接的有关信息.

`HTTP`遵循请求(`Request`)/应答(`Response`)模型。客户机（浏览器）向服务器发送请求，服务器处理请求并返回适当的应答。所有`HTTP`连接都被构造成一套请求和应答。

:::

## ISO5 层模型

![ISO5层模型](https://img-blog.csdnimg.cn/2021041320410447.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

### 物理层:

> 定义物理设备如何传输数据，常见的物理层有网线，光缆，网卡，声卡等，物理层是一切软件的基础。

- 主要解决的问题:

1. 尽可能屏蔽物理设备、传输媒体和通讯手段的不同,使上面的数据链路层感觉不到这些差异的存在,而专注于完成本层的协议与服务。

2. 考虑的是怎么样才能在连接各种计算机的传输媒体上传输数据比特流。

### 数据链路层:

> 数据链路层在通信实体间建立数据链路连接，物理设备连接完成以后，需要相应的软件和驱动来连接和打通这些物理设备，创建电路的连接。

- 主要的协议:

1. `SLIP(串行线路IP)`。
2. `PPP(点到点协议)`。

### 网络层:

> 介于传输层和数据链路层之间，它在数据链路层提供的两个相邻端点之间的数据帧的传送功能上，进一步管理网络中的数据通信，将数据设法从源端经过若干个中间节点传送到目的端，从而向运输层提供最基本的端到端的数据传送服务。

- 主要的协议:

1. `IP(Internet Protocal)`网络协议
2. `ARP(Address Resolution Protocal)`地址解析协议
3. `ICMP(Internet Control Message Protocal)`因特网控制消息协议
4. `HDLC(High Data Link Control)`高级数据链路控制。

### 传输层:

> 传输层是整个网络体系结构中的关键层次之一，主要负责向两个主机中进程之间的通信提供服务。

- 主要的协议:

1. `TCP(Transition Control Protocal)`传输控制协议。
2. `UDP(User Data Protocal)`用户数据协议。

### 应用层:

> 应用层包含了我们所说的 HTTP 协议，为各个应用软件提供了很多服务，常见的应用层服务有：HTTP 服务 、FTP 服务 、Email 服务等。应用层屏蔽了底层模型的相关细节，作为应用支持，只提供给使用者一些必要的使用方式。

- 主要的协议:

1. `HTTP(HyperText Transfer Protocal)`超文本传输协议。
2. `FTP(File Transfer Protocal)`文件传输协议。
3. `SMTP(Simple Mall Transfer Protocal)`简单邮件传输协议。
4. `POP3(Post Office Protocal)`邮局协议。
5. `DNS(Domain Name System)`域名系统。

## TCP/IP 协议族

> `TCP/IP` 协议（传输控制协议/互联网协议）不是简单的一个协议，而是一组特别的协议，包括：`TCP`，`IP`，`UDP`，`ARP`等，这些被称为子协议。在这些协议中，最重要、最著名的就是 TCP 和 IP。因此我们习惯将整个协议族称为 `TCP/IP`。

- ### IP 协议:

  1. IP 协议使互联网成为一个允许连接不同类型的计算机和不同操作系统的网络。

  2. IP 地址是 IP 协议提供的一种统一的地址格式，它为互联网上的每一个网络和每一台主机分配一个逻辑地址，相当于这台机器的暂用名，别的机器可以通过这个名字找到它，进而能互相建立起连接进行通信和交流。

- ### TCP 协议:

      1. TCP 协议是面向连接的全双工协议，因此不管是客户端还是服务端都能在 TCP 连接通道下向对端接收和发送数据。

      2. TCP 相比于 UDP 的优势在于它的传输稳定性，在数据传输之前必须经过三次握手建立连接；在数据传输过程中必须保证数据有序完整地传到对端。

      3. TCP 相比于 UDP 的劣势在于它的复杂度，连接建立、断开都是比较大的性能开销，而且数据传输过程中一旦卡住，则必须等前面的数据发送完毕以后，后续数据才能继续传输。

  每台服务器可提供支持的 TCP 连接数量是有限的，所以这也使得 TCP 连接变成了稀缺资源，经不起浪费。

- ### UDP 协议:

  1. UDP 协议是面向无连接的，不需要在传输数据前先建立连接，想发就发想传就传。

  2. UDP 做的工作只是报文搬运，不负责有序且不丢失地传递到对端，因此容易出现丢包的情况。

  3. UDP 不仅支持一对一的传输方式，还支持一对多、多对多、多对一的方式，也就是说 UPD 提供了单播、多播、广播的功能。

  4. UDP 相比于 TCP 的优势在于它的轻量、高效和灵活，在一些对于实时性应用要求较高的场景下需要使用到 UDP，比如直播、视频会议、LOL 等实时对战游戏。

  5. UDP 相比于 TCP 的劣势在于它的不可靠性和不稳定性。

## TCP 连接

在客户端发送正式的 HTTP 请求之前，需要先创建一个 TCP 连接，在创建的 TCP Connect 通道下，所有的 HTTP 请求和响应才能正常的发送和接受。

**在不同的 HTTP 协议版本里，这个 TCP 连接通道的创建和持续机制也有所不同。**

- 在 `HTTP1.0` 中，每一次 HTTP 请求都会创建一个 TCP 连接，在请求发送完成，服务器响应以后，这个 TCP 连接就自动断开了。

- 在 `HTTP1.1` 中，可以通过手动设置 `Connection： keep-alive` 请求头来建立 TCP 的持久连接，多个 HTTP 请求可以共用一个 TCP 连接。但是 TCP 连接存在线头阻塞，即若干个请求排队等待发送，一旦有某请求超时等，后续请求只能被阻塞。

- 在 `HTTP2.0` 中，采用了`信道复用`，使 TCP 连接支持并发请求，即多个请求可同时在一个连接上并行执行。某个请求任务耗时严重，不会影响到其它连接的正常执行吗，这样一来，大部分请求可以使用一个 TCP 连接，而不用创建新的 TCP 连接通道，既节省了三次握手的开销，又节约了服务端维护 TCP 端口的成本。

::: tip
**如何查看 TCP 连接复用:**

![如何查看Connection-ID](https://img-blog.csdnimg.cn/20210428212623157.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

图上可以看到有不同的 `Connection ID`，这就代表着本次请求实际上是开启了一个新的 `TCP` 连接，如果请求的 `Connection ID` 都是相同的，代表着多个 `HTTP` 请求复用了同一个 `TCP` 连接。

:::

:::warning
Chrome 浏览器所能够支持的最大并发 TCP 连接数是 6 个[知乎上的视频链接](https://video.zhihu.com/video/1270801868936478720)，并且在 HTTP 2.0 以下的 HTTP 版本中，请求是阻塞的。也就是说，一旦六个连接开满，前面的请求未完成，那么后续请求就会被阻塞，直到前面的请求返回，后续才能继续发送。

:::

## HTTP 工作过程

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

### 2.封装 HTTP 请求数据包

把以上部分结合本机自己的信息，封装成一个 HTTP 请求数据包

### 3.封装成`TCP`包，建立`TCP`连接（TCP 的三次握手）

在`HTTP`工作开始之前，客户机（Web 浏览器）首先要通过网络与服务器建立连接，该连接是通过`TCP`来完成的，该协议与 IP 协议共同构建`Internet`，即著名的`TCP/IP`协议族，因此`Internet`又被称作是`TCP/IP`网络。

`HTTP`是比`TCP`更高层次的应用层协议，根据规则，只有低层协议建立之后才能，才能进行高层协议的连接，因此，首先要建立`TCP`连接，一般`TCP`连接的端口号是`80`。这里是`8080`端口。

#### 补充:三次握手

![三次握手流程](https://img-blog.csdnimg.cn/20210412214709527.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

:::tip
提示：关于 ACK、FIN、SYN 状态码的含义

- ACK 用于确认，表示通知对方，我已经收到你发来的信息了。

- FIN 用于结束，表示告知对方，我这边已经结束，数据全部发送完毕，没有后续输出，请求终止连接。

- SYN 用于同步和建立连接，表示告知对方，我这边请求同步建立连接。
  :::

1. 第一次握手：由客户端向服务端发送连接请求 SYN 报文，该报文段中包含自身的数据通讯初始序号，请求发送后，客户端便进入 SYN-SENT 状态。

2. 第二次握手：服务端收到连接请求报文段后，如果同意连接，则会发送一个包含了 ACK 和 SYN 报文信息的应答，该应答中也会包含自身的数据通讯初始序号（在断开连接的“四次挥手”时，ACK 和 SYN 这两个报文是作为两次应答，独立开来发送的，因此会有四次挥手），服务端发送完成后便进入 SYN-RECEIVED 状态。

3. 第三次握手：当客户端收到连接同意的应答后，还要向服务端发送一个确认报文。客户端发完这个报文段后便进入 ESTABLISHED 状态，服务端收到这个应答后也进入 ESTABLISHED 状态，此时连接建立成功。

:::tip
**面试时可能会问的一个问题就是，明明两次握手就能确定的连接，为什么需要三次握手？**

因为由于很多不可控制的因素，例如网络原因，可能会造成第一次请求隔了很久才到达服务端，这个时候客户端已经等待响应等了很久，之前发起的请求已超时，已经被客户端废弃掉不再继续守着监听了。

然而服务端过了很久，收到了废弃的延迟请求，发起回应的同时又开启了一个新的 TCP 连接端口，在那里呆等客户端。

而服务端能维护的 TCP 连接是有限的，这种闲置的无用链接会造成服务端的资源浪费。

因此在服务端发送了 SYN 和 ACK 响应后，需要收到客户端接的再次确认，双方连接才能正式建立起来。三次握手就是为了规避这种`由于网络延迟而导致服务器额外开销的问题`。
:::

#### 补充：四次挥手

![四次挥手](https://img-blog.csdnimg.cn/2021041221485659.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

和建立 TCP 连接类似，断开 TCP 连接也同样需要客户端于服务端的双向交流，因为整个断开动作需要双端共发送 4 个数据包才能完成，所以简称为“四次挥手”。

1. 第一次挥手：客户端认为自己这边的数据已经全部发送完毕了，于是发送一个 FIN 用来关闭客户端到服务端的数据传输，发送完成以后，客户端进入 FIN_WAIT_1 状态。

2. 第二次挥手：服务端收到客户端发送回来的 FIN 以后，会告诉应用层要释放 TCP 链接，并且发送一个 ACK 给客户端，表明已经收到客户端的释放请求了，不会再接受客户端发来的数据，自此，服务端进入 CLOSE_WAIT 的状态。

3. 第三次挥手：服务端如果此时还有未发送完的数据可以继续发送，发送完毕后，服务端也会发送一个释放连接的 FIN 请求用来关闭服务端到客户端的数据传送，然后服务端进入 LAST_ACK 状态。

4. 第四次挥手：客户端接收到服务端的 FIN 请求后，发送最后一个 ACK 给服务端，接着进入 TIME_WAIT_2 状态，该状态会持续 2MSL（最大段生存期，指报文段在网络中生存的时间，超时会被抛弃） 时间，若该时间段内没有服务端的重发请求的话，客户端就进入 CLOSED 状态.服务端在收到应答消息后，也会进入 CLOSED 状态，至此完成四次挥手的过程，双方正式断开连接。

:::tip
**可能有些面试中会问，为什么建立连接有三次握手，而断开连接却有四次？**

这是因为在建立连接过程中，服务端在收到客户但建立连接请求的 SYN 报文后，会把 ACK 和 SYN 放在一个报文里发送给客户端。
而关闭连接时，服务端收到客户端的 FIN 报文，只是表示客户端不再发送数据了，但是还能接收数据，而且这会儿服务端可能还有数据没有发送完，不能马上发送 FIN 报文，只能先发送 ACK 报文，先响应客户端，在确认自己这边所有数据发送完毕以后，才会发送 FIN。
所以，在断开连接时，服务器的 ACK 和 FIN 一般都会单独发送，这就导致了断开连接比请求连接多了一次发送操作。
:::

### 4.客户机发送请求命令

一旦端对端成功建立起了 TCP 连接，下一步就要开始发送正式的 HTTP 请求了，请求方式的格式为：`统一资源标识符（URL）`、`协议版本号`，后边是`MIME`信息包括请求修饰符、客户机信息和可内容。

:::tip
流淌在 `TCP Connect` 通道里的 `HTTP` 只负责传输数据包，并没有连接的概念，因此 `HTTP` 也被叫做`无状态协议`。
:::

### 5.服务器响应

服务器接到请求后，给予相应的响应信息，其格式为一个`状态行`，包括信息的`协议版本号`、`一个成功或错误的代码`，后边是`MIME`信息包括服务器信息、实体信息和可能的内容。

实体消息是服务器向浏览器发送头信息后，它会发送一个空白行来表示头信息的发送到此为结束，接着，它就以`Content-Type`应答头信息所描述的格式发送用户所请求的实际数据。

### 6.服务器关闭 TCP 连接

一般情况下，一旦`Web`服务器向浏览器发送了请求数据，它就要关闭`TCP`连接，然后如果浏览器或者服务器在其头信息加入了这行代码:

```js
Connection: keep - alive;
```

`TCP`连接在发送后将仍然保持打开状态，于是，浏览器可以继续通过相同的连接发送请求。保持连接节省了为每个请求建立新连接所需的时间，还节约了网络带宽。

### HTTP 工作过程用到的概念

**报文格式**

HTTP1.0 的报文有两种类型：请求和响应。其报文格式分别为：

:::tip
**请求报文格式**

- 请求方法 URL HTTP/版本号
- 请求首部字段(可选)
- 空行
- body(只对 Post 请求有效)

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

### URL 的结构

使用`HTTP`协议访问资源是通过`URL（Uniform Resource Locator）`统一资源定位符来实现的。URL 的格式如下：

```
scheme://host:port/path?query

scheme: 表示协议，如http, https, ftp等；
host: 表示所访问资源所在的主机名：如：www.baidu.com;
port: 表示端口号，默认为80；
path: 表示所访问的资源在目标主机上的储存路径；
query: 表示查询条件；

例如： http://www.baidu.com/search?words=Baidu
```

### HTTP 的请求方法

- `GET`: 获取 URL 指定的资源。
- `POST`：一般用于传输实体信息。
- `PUT`：一般用于上传文件。
- `DELETE`：删除文件。
- `HEAD`：获取报文首部，与 GET 相比，不返回报文主体部分。
- `OPTIONS`：用于预检请求中，询问请求 URI 资源支持的方法。
- `TRACE`：追踪请求的路径；。
- `CONNECT`：要求在与代理服务器通信时建立隧道，使用隧道进行`TCP`通信。主要使用`SSL`和`TLS`将数据加密后通过网络隧道进行传输。

### 报文字段

`HTTP`首部字段由字段名和字段值组成，中间以":"分隔，如`Content-Type: text/html.`其中，同一个字段名可对应多个字段值。

`HTTP`的报文字段分为 5 种：

1. 请求报文字段
2. 应答报文字段
3. 实体首部字段
4. 通用报文字段
5. 其他报文字段

#### 请求报文字段

`HTTP`请求中支持的报文字段。

>

- `Accept`：客户端能够处理的媒体类型。如`text/html`, 表示客户端让服务器返回`html`类型的数据，如果没有，返回`text`类型的也可以。媒体类型的格式一般为：`type/subType`, 表示优先请求`subType`类型的数据，如果没有，返回 type 类型数据也可以。

  **常见的媒体类型：**

  - 文本文件：`text/html`, `text/plain`, `text/css`, `application/xml`
  - 图片文件：`iamge/jpeg`, `image/gif`, `image/png`;
  - 视频文件：`video/mpeg`
  - 应用程序使用的二进制文件：`application/octet-stream`, `application/zip`

:::tip
`Accept`字段可设置多个字段值，这样服务器依次进行匹配，并返回最先匹配到的媒体类型，当然，也可通过 q 参数来设置
媒体类型的权重，权重越高，优先级越高。q 的取值为[0, 1], 可取小数点后 3 位，默认为 1.0。例如：
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

- `Authorization`：表示客户端的认证信息。客户端在访问需要认证的也是时，服务器会返回 401，随后客户端将认证信息加在`Authorization`字段中发送到服务器后，如果认证成功，则返回 200. 如 Linux 公社下的 Ftp 服务器就是这种流程：ftp://ftp1.linuxidc.com。

- `Host`: 表示访问资源所在的主机名，即 URL 中的域名部分。如：m.baidu.com

- `If-Match`: `If-Match`的值与所请求资源的`ETag`值（实体标记，与资源相关联。资源变化，实体标记跟着变化）一致时，服务器才处理此请求。

- `If-Modified-Since`: 用于确认客户端拥有的本地资源的时效性。 如果客户端请求的资源在`If-Modified-Since`指定的时间后发生了改变，则服务器处理该请求。如：If-Modified-Since:Thu 09 Jul 2018 00:00:00, 表示如果客户端请求的资源在 2018 年 1 月 9 号 0 点之后发生了变化，则服务器处理改请求。通过该字段我们可解决以下问题：有一个包含大量数据的接口，且实时性较高，我们在刷新时就可使用改字段，从而避免多余的流量消耗。

- `If-None-Match`: `If-Match`的值与所请求资源的`ETag`值不一致时服务器才处理此请求。

- `If-Range`： `If-Range`的值（ETag 值或时间）与所访问资源的 ETag 值或时间相一致时，服务器处理此请求，并返回 Range 字段中设置的指定范围的数据。如果不一致，则返回所有内容。`If-Range`其实算是`If-Match`的升级版，因为它的值不匹配时，依然能够返回数据，而`If-Match`不匹配时，请求不会被处理，需要数据时需再次进行请求。

* `If-Unmodified-Since`：与`If-Modified-Since`相反，表示请求的资源在指定的时间之后未发生变化时，才处理请求，否则返回 412。

* `Max-Forwards`：表示请求可经过的服务器的最大数目，请求每被转发一次，`Max-Forwards`减 1，当`Max-Forwards`为 0 时，所在的服务器将不再转发，而是直接做出应答。通过此字段可定位通信问题，比如之前支付宝光纤被挖断，就可通过设置 Max-Forwards 来定位大概的位置。

* `Proxy-Authorization`：当客户端接收到来自代理服务器的认证质询时，客户端会将认证信息添加到`Proxy-Authorization`来完成认证。与`Authorization`类似，只不过`Authorization`是发生在客户端与服务端之间。

* `Range`：获取部分资源，例如：Range: bytes=500-1000 表示获取指定资源的第 500 到 1000 字节之间的内容，如果服务器能够正确处理，则返回 206 作为应答，表示返回了部分数据，如果不能处理这种范围请求，则以 200 作为应答，返回完整的数据，

* `Referer`：告知服务器请求是从哪个页面发起的。例如在百度首页中搜索某个关键字，结果页面的请求头部就会有这个字段，其值为https://www.baidu.com/。通过这个字段可统计广告的点击情况。

* `User-Agent`：将发起请求的浏览器和代理名称等信息发送给服务端，例如：User-Agent: Mozilla/5.0 (Linux; Android 5.0; SM-G900P Build/LRX21T) AppleWebKit/537.36(KHTML, like Gecko) Chrome/63.0.3239.84 Mobile Safari/537.36

#### 应答报文字段

`HTTP`应答中支持的报文字段。

- `Age`：服务端告知客户端，源服务器（而不是缓存服务器）在多久之前创建了响应。单位为秒。

- `ETag`： 实体资源的标识，可用来请求指定的资源。

- `Location`：请求的资源所在的新位置。

- `Proxy-Authenticate`：将代理服务器需要的认证信息发送给客户端。

- `Retry-After`：服务端告知客户端多久之后再重试，一般与 503 和 3xx 重定向类型的应答一起使用。

- `Server`：告知服务端当前使用的`HTTP`服务器应用程序的相关信息。

- `WWW-Authenticate`：告知客户端适用于所访问资源的认证方案，如`Basic`或`Digest`。`401`的响应中肯定带有`WWW-Authenticate`字段。

#### 实体首部字段

- `Allow`：通知客户端，服务器所支持的请求方法。但服务器收到不支持的请求方法时，会以 405（Method Not Allowed）作为响应。
- `Content-Encoding`：告知客户端，服务器对资源的内容编码。

- `Content-Language`：告知客户端，资源所使用的自然语言。

- `Content-Length`：告知客户端资源的长度。

- `Content-Location`：告知客户端资源所在的位置。

- `Content-Type`：告知客户端资源的媒体类型，取值同请求首部字段中的 Accept。

- `Expires`：告知客户端资源的失效日期。可用于对缓存的处理。

- `Last-Modified`：告知客户端资源最后一次修改的时间。

#### 通用报文字段

即可在`HTTP`请求中使用，也可在`HTTP`应答中使用的报文字段。

- `Cache-Control`：控制缓存行为；

- `Connection`：管理持久连接，设置其值为`Keep-Alive`可实现长连接。

- `Date`：创建`HTTP`报文的日期和时间。

- `Pragma`：`Http/1.1`之前的历史遗留字段，仅作为`HTTP/1.0`向后兼容而定义，虽然是通用字段，当通常被使用在客户单的请求中，如 Pragma: no-cache, 表示客户端在请求过程中不循序服务端返回缓存的数据；

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

`HttpOnly`: 使`Cookie`不能被 JS 脚本访问；

如：`Set-Cookie:BDSVRBFE=Go; max-age=10; domain=m.baidu.com; path=/`
:::

## HTTP 应答状态码

| 状态码 | 类别                          | 描述                 |
| :----- | :---------------------------- | :------------------- |
| 1xx    | `Informational`(信息性状态码) | 请求正在被处理       |
| 2xx    | `Success`(成功状态码)         | 请求处理成功         |
| 3xx    | `Redirection`(重定向状态码)   | 需要进行重定向       |
| 4xx    | `Client Error`(客户端状态码)  | 服务器无法处理请求   |
| 5xx    | `Server Error`(服务端状态码)  | 服务器处理请求时出错 |

### 常见应答状态码

![常见http状态码](https://img-blog.csdnimg.cn/20200208133106769.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

## HTTP 发展历史

### HTTP 0.9 版本

- 只有一个 `GET` 命令。
- 没有请求头和响应头来描述传输相关的数据信息。
- 服务器发送完数据后，直接关闭 `TCP` 连接，不支持 `TCP` 持久化连接。

### HTTP 1.0 版本

- 增加了很多命令，`HEAD`、`POST`、`PUT`、`DELETE` 等。
- 增设了 `status code` 状态码和 `header` 请求头和响应头。
- 增加了多字符集支持、多部分发送、权限、缓存等。
- 可通过开启 `Connection： keep-alive` 来指定使用 TCP 长连接

### HTTP 1.1 （目前普遍使用）

- 默认支持持久连接
- 默认支持`长连接（PersistentConnection）`，即默认开启 `Connection： keep-alive`。
- 支持请求的`流水线（Pipelining）`处理，即在一个 `TCP` 连接上可以传送多个 `HTTP` 请求和响应。
- 增加了 `host` 请求头字段，通过对 host 解析，就能够允许在同一台物理服务器上运行多个软件服务，极大提高了服务器的使用率。目前的 nginx 反向代理就是根据 `HTTP` 请求头中的 `host` 来分辨不同的请求，从而将这些请求代理到同一台服务器不同的软件服务上。

### HTTP1.0 与 HTTP1.1 的一些区别

HTTP 最早在网页中使用是 1996 年，而 HTTP1.1 是 1996 年后才开始广泛用于现在的各大浏览器网络请求中。

| 差异                         | HTTP 1.0                                                                                                               | HTTP 1.1                                                                                                                                    |
| :--------------------------- | :--------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------ |
| **缓存处理**                 | 使用`header`里的`if-Modified-Since`,`Expires`来作为缓存判断的标准。                                                    | 引入了更多的缓存控制策略，例如`Enity tag`、`if-Unmodified-Since`、`if-Match`、`if-None-Match`等更多可提供选择的缓存头来控制缓存策略。       |
| **带宽优化及网络连接的作用** | 存在一些浪费带宽的现象，例如客户端只是需要某个对象的一部分，而服务器却将整个对象返回回来了，并且不支持断点续传的功能。 | 在请求头中引入了`range`头域，他允许只请求资源的某个部分,即返回码是`206(Partial Content)`,这样就方便开发者自由的选择以便于充分利用带宽连接。 |
| **错误通知的管理**           | -                                                                                                                      | 新增了 24 个错误状态响应码，如 `409(Conflict)`表示请求的资源与资源当前状态发生冲突，401(Gone)表示服务器上的某个资源被永久性的删除。         |
| **Host 头处理**              | 认为每台服务器都绑定一个唯一的 IP 地址，因此请求消息中的 URL 并没有传递主机名(hostname)。                              | 请求消息和响应消息都应支持`Host`头域，且消息请求中如果没有 Host 头域会报告一个错误(400 Bad Request)。                                       |
| **长连接**                   | -                                                                                                                      | 开始支持长连接。                                                                                                                            |

### HTTP 2.0

- `HTTP1.x` 的解析是基于`文本`，存在解析上的缺陷；而 `HTTP2.0` 直接使用`二进制`的解析方式来替代 `HTTP 1.X` 的字符串解析，更为高效和健壮。
- `HTTP2.0` 所有数据以`帧`的方式进行传输，因此同一个连接中发送的多个请求不再需要按照顺序进行返回处理，可以达到`并行`的数据传输。
- `HTTP2.0` 压缩头信息进行传输数据量的优化。`HTTP1.x` 的请求头带有大量信息，而且每次都要重复发送，`HTTP2.0` 使用 `encoder` 来减少需要传输的请求头大小，通讯双方各自缓存一份 `header fields` 表，既避免了重复的传输，又减小了传输信息的大小。
- `HTTP2.0` 新增了 `server push（服务端推送）` 的概念，服务端可以主动发起一些数据推送。比如，服务端在接收到浏览器发来的 `HTML` 请求的同时，可以主动推送相关的资源文件`（js/css）`给客户端，并行发送，提高网页的传输和渲染效率。
- 目前如果要使用 `HTTP2` 需要首先使用 `HTTPS` 在这基础上，才能使用 `HTTP2`。

:::tip
`HTTP 2.0` 相比于 `HTTP 1` 最直观的图片加载性能提升, [HTTP 2 性能提升的官方演示](https://http2.akamai.com/demo)。
:::

## HTTP 缺点

1. 通信使用明文，可能被窃听
2. 不验证通信方的身份，可能遭遇伪装
3. 无法证明报文的完整性，有可能遭遇篡改

以上是`HTTP`的缺点，这在网络通信中对企业安全是很致命的问题。那`HTTPS`能解决这些问题吗？下面讲讲`HTTPS`。

## HTTP 基本优化

影响一个 HTTP 网络请求的因素主要有两个:`带宽`和`延迟`。

- 带宽:服务器资源相关

- 延迟

  - 浏览器阻塞(HOL Blocking):浏览器会因为一些原因阻塞请求。浏览器对于同一个域名，同时只能有固定个连接。

  | 浏览器                | HTTP 1.1 | HTTP 1.0 |
  | :-------------------- | :------- | :------- |
  | IE 6,7                | 2        | 4        |
  | IE 8                  | 6        | 6        |
  | Firefox 2             | 2        | 8        |
  | Firefox 3             | 6        | 6        |
  | Safari                | 3, 4     | 4        | 4 |
  | Chrome 1,2            | 6        | ?        |
  | Chrome 3              | 4        | 4        |
  | Opera 9.63,10.00alpha | 4        | 4        |

  超过浏览器最大连接数的限制，后续的请求就会被阻塞。

  - DNS 查询

  浏览器需要知道目标服务器的 IP 才能建立连接。DNS 就是将域名解析为 IP。

  可以利用 DNS 缓存结果减少这个时间。

  - 建立连接

  `HTTP`是基于`TCP`协议的。需要经过三次握手才能携带请求报文。

### HTTP 与 HTPPS 的一些区别

- HTTPS 协议需要到 CA 申请证书,一般免费证书比较少，需要付费。

- HTTP 协议运行在 TCP 之上，所有的传输内容都是明文的，HTTPS 运行在 SSL/TSL 之上,SSL/TSL 运行在 TCP 上，所有传输内容都是加密的。

- HTTP 与 HTTPS 采用完全不同的连接方式，用的端口也不一样，前者是 80，后者是 443。

- HTTPS 可以有效的防止运营商劫持,解决了防劫持的一个问题。

### SPDY:HTTP1.x 的优化

2012 年 google 如一声惊雷提出了 SPDY 的方案，优化了 HTTP1.x 的请求延迟，解决了 HTTP1.x 的安全性，具体如下:

**1. 降低延迟,针对 HTTP 高延迟的问题，SPDY 优雅的采用了`多路复用(multiplexing)`。**

多路复用通过多个请求 stream 共享一个 tcp 连接的方式，解决了 HOL blocking 的问题，降低了延迟同时提高了带宽的利用率。

**2. 请求优先级(request piroritization)。**

多路复用带来一个新的问题是，在连接共享的基础之上有可能导致关键请求被阻塞。SPDY 允许给每个 request 设置优先级，这样重要的请求就会优先得到响应。比如浏览器加载首页，首页的 html 内容应该优先展示，之后才是各种静态资源文件，脚本文件等加载，这样可以保证用户能第一时间看到网页的内容。

**3. header 压缩**

前面提到的 HTTP1.x 的 header 很多时候是多余的。选择合适的压缩算法可以减小包的大小和数量。

**4. 基于 HTTPS 的加密协议传输**

HTTPS 传输大大提高了数据传输的可靠性。

**5. 服务端推送(Server Push)**

采用了 SPDY 的网页，例如我的网页有一个 style.css 的请求，在客户端收到 style.css 数据的同时，服务端会将 style.js 的文件推送到客户端，当客户端再次尝试获取 style.js 时就可以直接从缓存中获取，不用再发请求了。

### HTTP2.0:SPDY 的升级版

HTTP2.0 是 SPDY 的升级版，基于 SPDY 设计。

#### HTTP2.0 与 SPDY 的区别

1. HTTP2.0 支持明文 HTTP 传输，而 SPDY 强制使用 HTTPS。

2. HTTP2.0 消息头压缩算法采用`HPACK(http://http2.github.io/http2-spec/compression.html)`,SPDY 采用`DEFLATE(http://zh.wikipedia.org/wiki/DEFLATE)`。

### HTTP2.0 及 HTTP1.x 相比的新特性

- 新的二进制格式

HTTP1.x 的解析是基于文本的。基于文本协议的格式解析存在天然缺陷，文本的表现形式具有多样性，要做到健壮性考虑的场景必然很多，二进制则不同，只有 0 和 1 的组合。

- 多路复用

即连接共享，即每个 request 都是用作连接共享机制的。一个 request 对应一个 id，这样一个连接上可以有多个 request，每个连接的 request 可以随机的混杂在一起，接收方可以根据 request 的 id 将 request 再归属到各自不同的服务端请求里面。

- header 压缩

HTTP1.x 中的 header 带有大量的信息，而且每次都要重复发送，HTTP2.0 使用 encoder 来减少需要传输的 header 大小，通讯双方各自 cache 一份 header fields 表，既避免了重复 header 的传输，又减小了需要传输的大小。

- 服务端推送

### HTTP2.0 的升级改造

- HTTP2.0 可以支持非 HTTPS，但是主流浏览器 Chorme，firefox 表示还是只支持基于 TLS 部署的 HTTP2.0 协议，所以要升级成 HTTP2.0 还是先升级 HTTPS 为好。

- 当你的网站升级为 HTTPS 之后，那么升级 HTTP2.0 就比较简单了，如果你使用了 nginx，只要在配置文件中启用相应的协议就可以了。(参考地址:https://www.nginx.com/blog/nginx-1-9-5/)

- 在使用了 HTTP2.0 之后，原来的 HTTP1.x 怎么办?HTTP2.0 完全兼容 HTTP1.x 的语义,对于不支持 HTTP2.0 的浏览器,nginx 会自动向下兼容。

### HTTP2.0 的多路复用 和 HTTP1.x 的长连接有什么区别？

- HTTP/1.\*一次请求-响应，建立一个连接，用完关闭。每一个请求都要建立一个连接。

- HTTP/1.1 Pipeling 解决方式为，若干个请求排队串行化单线处理，后面的请求会等待前面请求的返回之后才能会的执行机会。一旦有某请求超时等，后续请求只能被阻塞，毫无办法，也就是人们常说的线头阻塞。

- HTTP/2 多个请求可同时在一个连接上并行执行。某个请求任务耗时严重，不会影响到其他连接的正常执行。

### 服务端推送到底是什么？

服务端推送能把客户端所需要的资源伴随着 index.html 一起发送到客户端，省去了客户端重复请求的步骤。正因为没有发送请求，建立连接等操作，所以静态资源通过服务端推送的方式可以极大地提升速度。

## HTTP 网络优化

### 减少资源体积

- gzip 压缩

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

- nginx 开启

```nginx
gzip on;

gzip_min_length 1k; // 不压缩临界值，大于1K的才压缩，一般不用改

gzip_comp_level 2; // 压缩级别，1-10，数字越大压缩的越细，时间也越长

gzip_types text/plain application/javascript application/x-javascript text/css application/xml text/javascript application/x-httpd-php image/jpeg image/gif image/png; // 进行压缩的文件类型

gzip_disable "MSIE [1-6]\.";// ie兼容性不好所以放弃
```

- webpack 开启

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

2. `nginx`开启了`gzip`，`nginx`查找静态资源是否存在已经压缩好的`gzip`压缩文件，如果没有则自行压缩（消耗 cpu 但感知比较少）

3. `nginx`开启`gzip`压缩,`webpack`打包出的`.gz`文件被找到，提前（打包）压缩直接使用，减少了`nginx`的压缩损耗
   :::

### gzip 是怎么压缩的？

到这一步的都不是一般人了，我就简述一下:使用`"滑动窗口"`的方法，来寻找文件中的每一个匹配长度达到最小匹配的串，重复的内容以一个哈希值存储在字典表中并替换到匹配的串上，以此来达到压缩，因此重复度越高的文件可压缩的空间就越大。

### 源文件控制

- 图片采用 webp 格式
- http2——头部压缩

### 减少资源请求

## HTTP 缓存

> 虽然 `HTTP` 缓存不是必须的，但重用缓存的资源通常是必要的。然而常见的 `HTTP` 缓存只能存储 `GET` 响应，对于其他类型的响应则无能为力。缓存的关键主要包括 `request method` 和`目标 URI`（一般只有 GET 请求才会被缓存）。当 Web 请求抵达缓存时，如果本地有"已缓存"的副本，就可以从本地存储设备而不是原始服务器中提取这个文档。

### 缓存的流程

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

1. 浏览器进行资源请求时，会判断 responese header 是否命中强缓存，如果命中，直接从本地读取缓存，不会发送请求到服务器。

2. 如果未命中强缓存，会发送请求到服务器，判断协商缓存是否命中，如果命中的会，服务器会将请求返回(304),但是不会返回资源，告诉浏览器直接从本地读取缓存。如果不命中，服务器会直接返回资源。

:::tip
对于前端浏览器环境来说，缓存读取位置是由先后顺序的，顺序分别是`（由上到下寻找，找到即返回；找不到则继续）`。

- Service Worker
- Memory Cache
- Disk Cache
- 网络请求
  :::

#### Service Worker

> `Service Worker` 的缓存与浏览器其他内建的缓存机制不同，它可以让我们自由控制缓存哪些文件、如何匹配缓存、如何读取缓存，并且缓存是持续性的。

- 浏览器优先查找。
- 持久存储。
- 可以更加灵活地控制存储的内容，可以选择缓存哪些文件、定义缓存文件的路由匹配规则等。
- 可以从 `Chrome` 的 `F12` 中，`Application -> Cache Storage` 查看。

#### Memory Cache

- `memory cache` 是内存中的缓存存储。
- 读取速度快。
- 存储空间较小。
- 存储时间短，当浏览器的 `tab` 页被关闭，内存资源即被释放。
- 如果明确指定了 `Cache-Control` 为 `no-store`，浏览器则不会使用 `memory-cache`。

#### Disk Cache

- `Disk Cache` 是硬盘中的缓存存储。
- 读取速度慢于 `Memory Cache` ，快于网络请求。
- 存储空间较大。
- 持久存储。
- `Disk Cache` 严格依照 `HTTP` 头信息中的字段来判断资源是否可缓存、是否要认证等。
- 经常听到的`强缓存`，`协商缓存`，以及 `Cache-Control` 等，归于此类。

#### 网络请求

如果一个请求的资源文件均未命中上述缓存策略，那么就会发起网络请求。浏览器拿到资源后，会把这个新资源加入缓存。

### Cache-Control

> `HTTP/1.1`定义的 `Cache-Control` 头用来区分对缓存机制的支持情况， 请求头和响应头都支持这个属性。通过它提供的不同的值来定义缓存策略。需要注意的是，数据变化频率很快的场景并不适合开启 `Cache-Control`。

以下是 `Cache-Control` 常用字段的解释:

|       字段       | 说明                                                                                                                                                                                               |
| :--------------: | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|      public      | 公共缓存：表示该响应可以被任何中间人（比如中间代理、CDN 等）缓存。                                                                                                                                 |
|     private      | 私有缓存：表示该响应是专用于某单个用户的，中间人不能缓存此响应，该响应只能应用于浏览器私有缓存中。                                                                                                 |
|     max-age      | （单位/秒）设置缓存的过期时间，过期需要重新请求，否则就读取本地缓存，并不实际发送请求                                                                                                              |
|     s-maxage     | （单位/秒）覆盖 max-age，作用一样，只在代理服务器中生效                                                                                                                                            |
|    max-stale     | （单位/秒）表示即使缓存过期，也使用这个过期缓存                                                                                                                                                    |
|     no-store     | 禁止进行缓存                                                                                                                                                                                       |
|   no-transform   | 不得对资源进行转换或压缩等操作，Content-Encoding、Content-Range、Content-Type 等 HTTP 头不能由代理修改（有时候资源比较大的情况下，代理服务器可能会自行做压缩处理，这个指令就是为了防止这种情况）。 |
|     no-cache     | 强制确认缓存：即每次使用本地缓存之前，需要请求服务器，查看缓存是否失效，若未过期（注：实际就是返回 304），则缓存才使用本地缓存副本。                                                               |
| must-revalidate  | 缓存验证确认：意味着缓存在考虑使用一个陈旧的资源时，必须先验证它的状态，已过期的缓存将不被使用                                                                                                     |
| proxy-revalidate | 与 must-revalidate 作用相同，但它仅适用于共享缓存（例如代理），并被私有缓存忽略。                                                                                                                  |

### **强缓存**

到底什么是强缓存？强在哪？

其实强是强制的意思。当浏览器去请求某个文件的时候，服务端就在`respone header`里面对该文件做了缓存配置。缓存的时间、缓存类型都由服务端控制。

具体表现为：`respone header` 的`cache-control`，常见的设置是`max-age`、 `public`、 `private` 、`no-cache` 、`no-store`等以及返回头设置`Expires`字段。

![Cache-control](https://img-blog.csdnimg.cn/20200211142418838.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

:::tip
`max-age`表示缓存的时间是 315360000 秒（10 年）

`public`表示可以被浏览器和代理服务器缓存

`immutable`表示即使用户刷新浏览器也不会去请求服务器

`from memory cache`表示从内存中读取缓存

`from disk cache`表示从磁盘中读取缓存
:::

`Expires`是一个`GMT`时间格式字符串,浏览器第一次请求的时候,服务器会在返回头部加上 Expires，下次请求的时候如果在这个时间之前那么命中缓存。

```js
app.get("/", (req, res) => {
  const cssContent = path.join(__dirname, "./html/index.html");
  fs.readFile(cssContent, function(err, data) {
    res.setHeader("Expires", new Date(Date().now() + 2592000000).toUTCString());
    res.end(data);
  });
});
```

:::tip
强缓存总结

1. `cache-control: max-age=xxxx，public`

客户端和代理服务器都可以缓存该资源；

客户端在 xxx 秒的有效期内，如果有请求该资源的需求的话就直接读取缓存,`statu code:200` ，如果用户做了刷新操作，就向服务器发起`http`请求。

2. `cache-control: max-age=xxxx，private`

只让客户端可以缓存该资源；代理服务器不缓存

客户端在 xxx 秒内直接读取缓存,statu code:200

3. `cache-control: max-age=xxxx，immutable`

客户端在 xxx 秒的有效期内，如果有请求该资源的需求的话就直接读取缓存,`statu code:200`，即使用户做了刷新操作，也不向服务器发起 http 请求

4. `cache-control: no-cache`

跳过设置强缓存，但是不妨碍设置协商缓存；一般如果你做了强缓存，只有在强缓存失效了才走协商缓存的，设置了`no-cache`就不会走强缓存了，每次请求都会询问服务端。

5. `cache-control: no-store`

不缓存，这个会让客户端、服务器都不缓存，也就没有所谓的强缓存、协商缓存了。
:::

### **协商缓存**

上面说到的强缓存就是给资源设置个过期时间，客户端每次请求资源时都会看是否过期；只有在过期才会去询问服务器。所以，强缓存就是为了给客户端自给自足用的。

而当某天，客户端请求该资源时发现其过期了，这时就会去请求服务器了，而这时候去请求服务器的这过程就可以设置协商缓存。这时候，协商缓存就是需要客户端和服务器两端进行交互的。

> 协议缓存主要是利用`Last-Modified`、`If-Modified-Since`和`Etag`、`If-None-Match`来实现。

#### Last-Modified

顾名思义，就是资源的最新一次修改时间。当客户端访问服务端的资源，服务端会将这个 `Last-Modified` 值返回给客户端，客户端收到之后，下次发送请求就会将服务端返回回来的 `Last-Modified` 值装在 `If-Modified-Since` 或者 `If-Unmodified-Since` 里，发送给服务端进行缓存校验。

这样服务器就可以通过读取 `If-Modified-Since （较常用）`或 `If-UnModified-Since` 的值，和本地的 `Last-Modified` 值做对比校验。如果校验发现这两个值是一样的，就代表本次请求的资源文件没有被修改过，那么服务器就会告诉浏览器，资源有效，可以继续使用，否则就需要使用最新的资源。

:::tip

`Last-Modified`:表示为实体头部部分，`response`返回，表示为资源的最后更新时间,精确到秒。

`If-Modified-Since`:通过比较两次的时间判断，资源在请求期间是否有修改，假如没有修改，则命中协商缓存，浏览器从缓存中读取资源，如果没有命中，资源有过修改，返回新的`Last-Modified`和服务器资源。

:::

```js
app.get("/", (req, res) => {
  const cssContent = path.join(__dirname, "./html/index.html");
  fs.stat(cssContent, (err, start) => {
    if (req.headers["if-modified-since"] === start.mtime.toUTCString()) {
      res.writeHead(304, "Not Modified");
      res.end();
    } else {
      fs.readFile(cssContent, function(err, data) {
        let lastModified = start.mtime.toUTCString();
        res.setHeader("Last-Modified", lastModified);
        res.writeHead(200, "OK");
        res.end(data);
      });
    }
  });
});
```

:::warning

有些情况下仅判断最后修改日期来验证资源是否有改动是不够的：

1. 存在周期性重写某些资源，但资源实际包含的内容并无变化；
2. 被修改的信息并不重要，如注释等；
3. `Last-Modified`无法精确到毫秒，但有些资源更新频率有时会小于一秒。
   :::

这个时候我们就需要请出另一位嘉宾: `ETag`。

#### ETag

`Etag` 的作用本质上和 `Last-Modified` 差别不大。相比于 `Last-Modified` 使用最后修改日期来比较资源是否失效的缓存校验策略，`ETag` 则是通过数据签名来做一个更加严格的缓存验证。

所谓`数据签名`，其实就是通过对资源内容进行一个唯一的签名标记，一旦资源内容改变，那么签名必将改变，服务端就以此签名作为暗号，来标记缓存的有效性。典型的做法是针对资源内容进行一个 `hash` 计算，类似于 `webpack`打包线上资源所加的 `hash` 标识,随服务器`response`返回。

和 `Last-Modified` 对应 `If-Modified-Since` 相同，`ETag` 也会对应 `If-Match` 或者 `If-None-Match`（If-None-Match 比较常用），如果前后的签名相同，则不需要返回新的资源内容。

`If-None-Match`: 服务器比较请求头中的`If-None-Match`和当前资源中的`etag`是否一致，来判断资源是否修改过，如果没有修改，则命中缓存，浏览器从缓存中读取资源，如果修改过，服务器会返回新的`etag`，并返回资源；

```js
app.get("/home", (req, res) => {
  const cssContent = path.join(__dirname, "./html/index.html");
  fs.stat(cssContent, (err, start) => {
    let etag = md5(cssContent);
    if (req.headers["if-none-match"] === etag) {
      res.writeHead(304, "Not Modified");
      res.end();
    } else {
      fs.readFile(cssContent, function(err, data) {
        res.setHeader("Etag", etag);
        res.writeHead(200, "OK");
        res.end(data);
      });
    }
  });
});
```

:::tip

`Last-Modified` 和 `ETag` 只是给服务端提供了一个控制缓存有效期的手段，并没有任何强制缓存的作用，最终决定是否使用缓存、还是使用新的资源文件，还是需要靠服务端指定对应的 `http code` 来决定。对于保存在服务器上的文件，都有最后修改日期的属性，当使用 `Last-Modified` 可以利用这个有效的属性进行数据缓存验证；或者在数据库存入一个 `updatetime` 字段来标识具体的修改日期，从而判断缓存是否有效。

**协商缓存步骤总结:**

1. 请求资源时，把用户本地该资源的`etag`同时带到服务端，服务端和最新资源做对比。
2. 如果资源没更改，返回 304，浏览器读取本地缓存。
3. 如果资源有更改，返回 200，返回最新的资源。

不推荐使用 `Expires` 首部，它指定的是实际的过期日期而不是秒数。

`HTTP`设计者后来认为，由于很多服务器的时钟都不同步，或者不正确，所以最好还是用剩余秒数，而不是绝对时间来表示过期时间。

`ETag`解决了`Last-Modified`使用时可能出现的资源的时间戳变了但内容没变及如果再一秒钟以内资源变化但`Last-Modified`没变的问题，感觉 ETag 更加稳妥。

补充：根据浏览器缓存策略，`Expire`和`Cache-Control`用回车、后退、F5 刷新会跳过本地缓存，每次都会从服务器中获数据。

:::

## HTTPS 定义

> 超文本传输安全协议（`Hypertext Transfer Protocol Secure`，缩写：`HTTPS`，常称为`HTTP over TLS`，`HTTP over SSL`或`HTTP Secure`）是一种通过计算机网络进行安全通信的传输协议。`HTTPS`经由`HTTP`进行通信，但利用`SSL/TLS`来加密数据包。

`HTTP`协议采用明文传输信息，存在信息窃听、信息篡改和信息劫持的风险，而协议`TLS/SSL`具有身份验证、信息加密和完整性校验的功能，可以避免此类问题发生。

`TLS/SSL`全称安全传输层协议`Transport Layer Security`, 是介于`TCP`和`HTTP`之间的一层安全协议，不影响原有的`TCP`协议和`HTTP`协议，所以使用`HTTPS`基本上不需要对`HTTP`页面进行太多的改造。

![https组成](https://img-blog.csdnimg.cn/2020020813541846.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

`HTTPS`是在`HTTP`上建立`SSL`加密层，并对传输数据进行加密，是`HTTP`协议的安全版。`HTTPS`主要作用是：

- 对数据进行加密，并建立一个信息安全通道，来保证传输过程中的数据安全。
- 对网站服务器进行真实身份认证。

:::tip
简单的总结就是: `HTTPS` = `HTTP`+加密+认证+完整性保护。

上述出现的各种广告也是由于 HTTP 在传输时被劫持而导致的。
:::

## TLS/SSL 工作原理

:::tip

`HTTPS`协议的主要功能基本都依赖于`TLS/SSL协议`，`TLS/SSL`的功能实现主要依赖于三类基本算法：`散列函数 Hash`、`对称加密`和`非对称加密`。

**其利用非对称加密实现身份认证和密钥协商，对称加密算法采用协商的密钥对数据加密，基于散列函数验证信息的完整性。**

:::

![TSL/SSL](https://img-blog.csdnimg.cn/20200208140622882.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

![HTTPS建立过程](https://img-blog.csdnimg.cn/20200208140631461.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

### 散列函数 Hash

常见的有 `MD5`、`SHA1`、`SHA256`，该类函数特点是函数单向不可逆、对输入非常敏感、输出长度固定，针对数据的任何修改都会改变散列函数的结果，用于防止信息篡改并验证数据的完整性;

在信息传输过程中，散列函数不能单独实现信息防篡改，因为明文传输，中间人可以修改信息之后重新计算信息摘要，因此需要对传输的信息以及信息摘要进行加密;

### 对称加密

常见的有`AES-CBC`、`DES`、`3DES`、`AES-GCM`等，相同的密钥可以用于信息的加密和解密，掌握密钥才能获取信息，能够防止信息窃听，通信方式是 1 对 1;

对称加密的优势是信息传输 1 对 1，需要共享相同的密码，密码的安全是保证信息安全的基础，服务器和 N 个客户端通信，需要维持 N 个密码记录，且缺少修改密码的机制;

### 非对称加密

即常见的 `RSA` 算法，还包括 `ECC`、`DH` 等算法，算法特点是，密钥成对出现，一般称为公钥(公开)和私钥(保密)，公钥加密的信息只能私钥解开，私钥加密的信息只能公钥解开。因此掌握公钥的不同客户端之间不能互相解密信息，只能和掌握私钥的服务器进行加密通信，服务器可以实现 1 对多的通信，客户端也可以用来验证掌握私钥的服务器身份。

非对称加密的特点是信息传输 1 对多，服务器只需要维持一个私钥就能够和多个客户端进行加密通信，但服务器发出的信息能够被所有的客户端解密，且该算法的计算复杂，加密速度慢。

:::tip
**结合三类算法的特点，`TLS`的基本工作方式是:**

客户端使用非对称加密与服务器进行通信，实现身份验证并协商对称加密使用的密钥，然后对称加密算法采用协商密钥对信息以及信息摘要进行加密通信，不同的节点之间采用的对称密钥不同，从而可以保证信息只能通信双方获取。
:::

## PKI 体系

### RSA 身份验证的隐患

身份验证和密钥协商是`TLS`的基础功能，要求的前提是合法的服务器掌握着对应的私钥。但 RSA 算法无法确保服务器身份的合法性，因为公钥并不包含服务器的信息，存在安全隐患:

- 客户端 C 和服务器 S 进行通信，中间节点 M 截获了二者的通信;
- 节点 M 自己计算产生一对公钥 pub_M 和私钥 pri_M;
- C 向 S 请求公钥时，M 把自己的公钥 pub_M 发给了 C;
- C 使用公钥 pub_M 加密的数据能够被 M 解密，因为 M 掌握对应的私钥 pri_M，而 C 无法根据公钥信息判断服务器的身份，从而 C 和 \* M 之间建立了"可信"加密连接;
- 中间节点 M 和服务器 S 之间再建立合法的连接，因此 C 和 S 之间通信被 M 完全掌握，M 可以进行信息的窃听、篡改等操作。
- 另外，服务器也可以对自己的发出的信息进行否认，不承认相关信息是自己发出。

因此该方案下至少存在两类问题：`中间人攻击`和`信息抵赖`。

![RSA身份验证的隐患](https://img-blog.csdnimg.cn/2020020814180822.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

### 身份验证 CA 和证书

解决上述身份验证问题的关键是确保获取的公钥途径是合法的，能够验证服务器的身份信息，为此需要引入权威的第三方机构 CA(如沃通 CA)。

`CA`负责核实公钥的拥有者的信息，并颁发认证"证书"，同时能够为使用者提供证书验证服务，即`PKI`体系(PKI 基础知识)。

基本的原理为，CA 负责审核信息，然后对关键信息利用私钥进行"签名"，公开对应的公钥，客户端可以利用公钥验证签名。CA 也可以吊销已经签发的证书，基本的方式包括两类 `CRL` 文件和 `OCSP`。CA 使用具体的流程如下：

![CA流程](https://img-blog.csdnimg.cn/20200208142030173.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

:::tip

1. 服务方 S 向第三方机构 CA 提交公钥、组织信息、个人信息(域名)等信息并申请认证;

2. CA 通过线上、线下等多种手段验证申请者提供信息的真实性，如组织是否存在、企业是否合法，是否拥有域名的所有权等;

3. 如信息审核通过，CA 会向申请者签发认证文件-证书。

   证书包含以下信息：`申请者公钥`、`申请者的组织信息和个人信息`、`签发机构CA的信息`、`有效时间`、`证书序列号等信息的明文`，同时包含`一个签名`;

   签名的产生算法：首先，使用散列函数计算公开的明文信息的信息摘要，然后，采用 CA 的私钥对信息摘要进行加密，密文即签名;

4. 客户端 C 向服务器 S 发出请求时，S 返回证书文件;

5. 客户端 C 读取证书中的相关的明文信息，采用相同的散列函数计算得到信息摘要，然后，利用对应 CA 的公钥解密签名数据，对比证书的信息摘要，如果一致，则可以确认证书的合法性，即公钥合法;

6. 客户端然后验证证书相关的域名信息、有效时间等信息;

7. 客户端会内置信任 CA 的证书信息(包含公钥)，如果 CA 不被信任，则找不到对应 CA 的证书，证书也会被判定非法。
   :::

:::warning

**在这个过程注意几点：**

1. 申请证书不需要提供私钥，确保私钥永远只能服务器掌握;

2. 证书的合法性仍然依赖于非对称加密算法，证书主要是增加了服务器信息以及签名;

3. 内置 CA 对应的证书称为根证书，颁发者和使用者相同，自己为自己签名，即自签名证书（为什么说"部署自签 SSL 证书非常不安全"）

4. 证书=公钥+申请者与颁发者信息+签名;

:::

### 证书链

如 CA 根证书和服务器证书中间增加一级证书机构，即`中间证书`，证书的产生和验证原理不变，只是增加一层验证，只要最后能够被任何信任的 CA 根证书验证合法即可。

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

## HTTPS 性能与优化

### HTTPS 性能损耗

前文讨论了`HTTPS`原理与优势：身份验证、信息加密与完整性校验等，且未对`TCP`和`HTTP`协议做任何修改。但通过增加新协议以实现更安全的通信必然需要付出代价，`HTTPS`协议的性能损耗主要体现如下：

- 增加延时

分析前面的握手过程，一次完整的握手至少需要两端依次来回两次通信，至少增加延时`2* RTT`，利用会话缓存从而复用连接，延时也至少`1* RTT*`

- 消耗较多的 CPU 资源

除数据传输之外，`HTTPS`通信主要包括对对称加解密、非对称加解密(服务器主要采用私钥解密数据);

压测 `TS8` 机型的单核 `CPU`：对称加密算法`AES-CBC-256` 吞吐量 `600Mbps`，非对称 `RSA` 私钥解密`200次/s`。

不考虑其它软件层面的开销，`10G` 网卡为对称加密需要消耗 `CPU` 约 17 核，24 核 CPU 最多接入 `HTTPS` 连接 4800;

静态节点当前`10G` 网卡的 `TS8` 机型的 `HTTP`单机接入能力约为`10w/s`，如果将所有的`HTTP`连接变为`HTTPS`连接，则明显`RSA`的解密最先成为瓶颈。因此，`RSA`的解密能力是当前困扰`HTTPS`接入的主要难题。

### HTTPS 接入优化

- CDN 接入

`HTTPS` 增加的延时主要是`传输延时 RTT`，`RTT` 的特点是节点越近延时越小，`CDN` 天然离用户最近，因此选择使用 `CDN` 作为 `HTTPS` 接入的入口，将能够极大减少接入延时。`CDN`节点通过和业务服务器维持长连接、会话复用和链路质量优化等可控方法，极大减少 `HTTPS` 带来的延时。

- 会话缓存

虽然前文提到 `HTTPS` 即使采用会话缓存也要至少`1*RTT`的延时，但是至少延时已经减少为原来的一半，明显的延时优化;

同时，基于会话缓存建立的 `HTTPS` 连接不需要服务器使用`RSA`私钥解密获取 `Pre-master` 信息，可以省去`CPU` 的消耗。

如果业务访问连接集中，缓存命中率高，则`HTTPS`的接入能力将明显提升。当前`TRP`平台的缓存命中率高峰时期大于 30%，10k/s 的接入资源实际可以承载 13k/的接入，收效非常可观。

- 硬件加速

为接入服务器安装专用的`SSL`硬件加速卡，作用类似 `GPU`，释放 `CPU`，能够具有更高的 `HTTPS` 接入能力且不影响业务程序的。测试某硬件加速卡单卡可以提供 35k 的解密能力，相当于 175 核 CPU，至少相当于 7 台 24 核的服务器，考虑到接入服务器其它程序的开销，一张硬件卡可以实现接近 10 台服务器的接入能力。

- 远程解密

本地接入消耗过多的 `CPU` 资源，浪费了网卡和硬盘等资源，考虑将最消耗 `CPU` 资源的`RSA`解密计算任务转移到其它服务器，如此则可以充分发挥服务器的接入能力，充分利用带宽与网卡资源。远程解密服务器可以选择 `CPU` 负载较低的机器充当，实现机器资源复用，也可以是专门优化的高计算性能的服务器。当前也是 `CDN` 用于大规模`HTTPS`接入的解决方案之一。

- SPDY/HTTP2

前面的方法分别从减少传输延时和单机负载的方法提高 `HTTPS` 接入性能，但是方法都基于不改变 `HTTP` 协议的基础上提出的优化方法，`SPDY/HTTP2` 利用 `TLS/SSL` 带来的优势，通过修改协议的方法来提升 `HTTPS` 的性能，提高下载速度等。

- 使用 DNS
- 使用 http2
- 使用缓存

## 从用户输入 URL 到浏览器呈现页面发生了什么?

- 2021.02.20

在我们理解输入 url 后发生了什么之前，我们需要先了解下浏览器的原理。

### 浏览器架构

在讲浏览器架构之前，先理解两个概念，`进程`和`线程`。

- `进程(process)`是程序的一次执行过程,是一个动态概念,是程序在执行过程中分配和管理资源的基本单位。

- `线程(thread)`是 CPU 调度和分配的基本单位,它可以与同属于一个进程的其他线程共享该进程所拥有的全部资源。

浏览器属于一个应用程序,而应用程序的一次执行，可以理解为计算机启动了一个进程,进程启动后,CPU 会给该进程分配相应的内存空间,当我们的进程得到了内存之后,就可以使用线程进行资源的调度,进而完成我们应用程序的功能。

而在应用程序中，为了满足功能的需要，启动的进程会创建另外的进程来处理其他任务，这些创建出来的新的进程拥有全新的独立的内存空间，不与原来的进程共享内存，如果这些进程之间需要通信,需要通过`IPC机制(Inter Process Communication)`进行。

![通信流程](https://img-blog.csdnimg.cn/2021022013564064.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

很多应用程序都会采取这种多进程的方式来工作，因为进程和进程之间是互相独立的它们互不影响，也就是说，当其中一个进程挂掉了之后，不会影响到其他进程的执行，只需要重启挂掉的进程就可以恢复运行。

### 浏览器的多进程架构

假如我们去开发一个浏览器，它的架构可以是一个单进程多线程的应用程序，也可以是一个使用 IPC 通信的多进程应用程序。

不同的浏览器使用不同的架构，这里我们以 Chrome 为例，介绍浏览器的多进程架构。

**在 Chrome 中，主要的进程有 4 个**：

1. **浏览器进程 (Browser Process)**：负责浏览器的 TAB 的前进、后退、地址栏、书签栏的工作和处理浏览器的一些不可见的底层操作，比如网络请求和文件访问。
2. **渲染进程 (Renderer Process)**：负责一个 Tab 内的显示相关的工作，也称渲染引擎。
3. **插件进程 (Plugin Process)**：负责控制网页使用到的插件
4. **GPU 进程 (GPU Process)**：负责处理整个应用程序的 GPU 任务

![进程描述](https://img-blog.csdnimg.cn/2021022014062453.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

1. 首先，当我们要浏览一个网页，我们会在浏览器的地址栏里输入 URL，这个时候`Browser Process`会向这个 URL 发送请求，获取这个 URL 的 HTML 内容，然后将 HTML 交给`Renderer Process`。

2. `Renderer Process`解析 HTML 内容，解析遇到需要请求网络的资源又返回来交给`Browser Process`进行加载，同时通知`Browser Process`，需要`Plugin Process`加载插件资源，执行插件代码。

3. 解析完成后，`Renderer Process`计算得到图像帧，并将这些图像帧交给`GPU Process`，`GPU Process`将其转化为图像显示屏幕。

![通信流程](https://img-blog.csdnimg.cn/20210220151454266.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

### 多进程架构的好处

Chrome 为什么要使用多进程架构呢？

- **第一，更高的容错性**。当今 WEB 应用中，HTML，JavaScript 和 CSS 日益复杂，这些跑在渲染引擎的代码，频繁的出现 BUG，而有些 BUG 会直接导致渲染引擎崩溃，多进程架构使得每一个渲染引擎运行在各自的进程中，相互之间不受影响，也就是说，当其中一个页面崩溃挂掉之后，其他页面还可以正常的运行不收影响。

![在这里插入图片描述](https://img-blog.csdnimg.cn/20210220151643220.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

- **第二，更高的安全性和沙盒性（sanboxing）**。渲染引擎会经常性的在网络上遇到不可信、甚至是恶意的代码，它们会利用这些漏洞在你的电脑上安装恶意的软件，针对这一问题，浏览器对不同进程限制了不同的权限，并为其提供沙盒运行环境，使其更安全更可靠。

- **第三，更高的响应速度**。在单进程的架构中，各个任务相互竞争抢夺 CPU 资源，使得浏览器响应速度变慢，而多进程架构正好规避了这一缺点。

### 多进程架构优化

之前的我们说到，`Renderer Process`的作用是负责一个 Tab 内的显示相关的工作，这就意味着，一个 Tab，就会有一个 Renderer Process，这些进程之间的内存无法进行共享，而不同进程的内存常常需要包含相同的内容。

### 浏览器的进程模式

为了节省内存，Chrome 提供了四种进程模式（Process Models），不同的进程模式会对 tab 进程做不同的处理。

- `Process-per-site-instance (default)` - 同一个 `site-instance` 使用一个进程
- `Process-per-site` - 同一个 site 使用一个进程
- `Process-per-tab` - 每个 tab 使用一个进程
- `Single process` - 所有 tab 共用一个进程

:::tip

- **site** 指的是相同的 registered domain name(如：google.com ，bbc.co.uk)和 scheme (如：https://)。比如 a.baidu.com 和 b.baidu.com 就可以理解为同一个 site（注意这里要和 Same-origin policy 区分开来，同源策略还涉及到子域名和端口）。

- **site-instance** 指的是一组 **connected pages from the same site**，这里 connected 的定义是 can obtain references to each other in script code 怎么理解这段话呢。满足下面两中情况并且打开的新页面和旧页面属于上面定义的同一个 site，就属于同一个 site-instance. - 用户通过`<a target="_blank">`这种方式点击打开的新页面 - JS 代码打开的新页面（比如 window.open)
  :::

**理解了概念之后，下面解释四个进程模式**:

1. 首先是`Single process`，顾名思义，单进程模式，所有 tab 都会使用同一个进程。接下来是`Process-per-tab` ，也是顾名思义，每打开一个 tab，会新建一个进程。而对于`Process-per-site`，当你打开 a.baidu.com 页面，在打开 b.baidu.com 的页面，这两个页面的 tab 使用的是共一个进程，因为这两个页面的 site 相同，而如此一来，如果其中一个 tab 崩溃了，而另一个 tab 也会崩溃。

2. `Process-per-site-instance` 是最重要的，因为这个是 Chrome 默认使用的模式，也就是几乎所有的用户都在用的模式。当你打开一个 tab 访问 a.baidu.com ，然后再打开一个 tab 访问 b.baidu.com，这两个 tab 会使用两个进程。而如果你在 a.baidu.com 中，通过 JS 代码打开了 b.baidu.com 页面，这两个 tab 会使用同一个进程。

### 默认模式选择

**那么为什么浏览器使用`Process-per-site-instance`作为默认的进程模式呢？**

`Process-per-site-instance`兼容了性能与易用性，是一个比较中庸通用的模式。

- 相较于 Process-per-tab，能够少开很多进程，就意味着更少的内存占用
- 相较于 Process-per-site，能够更好的隔离相同域名下毫无关联的 tab，更加安全

### 导航过程都发生了什么

前面我们讲了浏览器的多进程架构，讲了多进程架构的各种好处，和 Chrome 是怎么优化多进程架构的，下面从用户浏览网页这一简单的场景，来深入了解进程和线程是如何呈现我们的网站页面的。

### 网页加载过程

上面我们提到，tab 以外的大部分工作由浏览器进程`Browser Process`负责，针对工作的不同，Browser Process 划分出不同的工作线程：

- UI thread：控制浏览器上的按钮及输入框；
- network thread：处理网络请求，从网上获取数据；
- storage thread：控制文件等的访问

![在这里插入图片描述](https://img-blog.csdnimg.cn/20210220154349628.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

#### 第一步：处理输入

当我们在浏览器的地址栏输入内容按下回车时，UI thread 会判断输入的内容是搜索关键词（search query）还是 URL，如果是搜索关键词，跳转至默认搜索引擎对应都搜索 URL，如果输入的内容是 URL，则开始请求 URL。

![处理输入](https://img-blog.csdnimg.cn/20210220154445862.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

#### 第二步：开始导航

回车按下后，`UI thread`将关键词搜索对应的 URL 或输入的 URL 交给网络线程`Network thread`，此时 UI 线程使 Tab 前的图标展示为加载中状态，然后网络进程进行一系列诸如 DNS 寻址，建立 TLS 连接等操作进行资源请求，如果收到服务器的 301 重定向响应，它就会告知 UI 线程进行重定向然后它会再次发起一个新的网络请求。

![开始导航](https://img-blog.csdnimg.cn/20210220154554845.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

#### 第三步：读取响应

`network thread`接收到服务器的响应后，开始解析 HTTP 响应报文，然后根据响应头中的`Content-Type`字段来确定响应主体的媒体类型（MIME Type），如果媒体类型是一个 HTML 文件，则将响应数据交给渲染进程（renderer process）来进行下一步的工作，如果是 zip 文件或者其它文件，会把相关数据传输给下载管理器。

与此同时，浏览器会进行 Safe Browsing 安全检查，如果域名或者请求内容匹配到已知的恶意站点，network thread 会展示一个警告页。除此之外，网络线程还会做 CORB（Cross Origin Read Blocking）检查来确定那些敏感的跨站数据不会被发送至渲染进程。

#### 第四步：查找渲染进程

各种检查完毕以后，network thread 确信浏览器可以导航到请求网页，network thread 会通知 UI thread 数据已经准备好，UI thread 会查找到一个 renderer process 进行网页的渲染。

![查找渲染进程](https://img-blog.csdnimg.cn/20210220154928579.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

浏览器为了对查找渲染进程这一步骤进行优化，考虑到网络请求获取响应需要时间，所以在第二步开始，浏览器已经预先查找和启动了一个渲染进程，如果中间步骤一切顺利，当 network thread 接收到数据时，渲染进程已经准备好了，但是如果遇到重定向，这个准备好的渲染进程也许就不可用了，这个时候会重新启动一个渲染进程。

#### 第五步：提交导航

到了这一步，数据和渲染进程都准备好了，`Browser Process` 会向 `Renderer Process` 发送 IPC 消息来确认导航，此时，浏览器进程将准备好的数据发送给渲染进程，渲染进程接收到数据之后，又发送 IPC 消息给浏览器进程，告诉浏览器进程导航已经提交了，页面开始加载。

![提交导航](https://img-blog.csdnimg.cn/20210220155437671.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

这个时候导航栏会更新，安全指示符更新（地址前面的小锁），访问历史列表（history tab）更新，即可以通过前进后退来切换该页面。

#### 第六步：初始化加载完成

当导航提交完成后，渲染进程开始加载资源及渲染页面（详细内容下文介绍），当页面渲染完成后（页面及内部的 iframe 都触发了 onload 事件），会向浏览器进程发送 IPC 消息，告知浏览器进程，这个时候 UI thread 会停止展示 tab 中的加载中图标。

### 网页渲染原理

导航过程完成之后，浏览器进程把数据交给了渲染进程，渲染进程负责 tab 内的所有事情，核心目的就是将 HTML/CSS/JS 代码，转化为用户可进行交互的 web 页面。那么渲染进程是如何工作的呢？

**渲染进程中，包含线程分别是**：

- 一个主线程（main thread）
- 多个工作线程（work thread）
- 一个合成器线程（compositor thread）
- 多个光栅化线程（raster thread）

![渲染进程线程](https://img-blog.csdnimg.cn/20210220155645253.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

不同的线程，有着不同的工作职责。

### 构建 DOM

当渲染进程接受到导航的确认信息后，开始接受来自浏览器进程的数据，这个时候，主线程会解析数据转化为 DOM（Document Object Model）对象。

**DOM 为 Web 开发人员通过 JavaScript 与网页进行交互的数据结构及 API**。

### 资源子加载

在构建 DOM 的过程中，会解析到图片、CSS、JavaScript 脚本等资源，这些资源是需要从网络或者缓存中获取的，主线程在构建 DOM 过程中如果遇到了这些资源，逐一发起请求去获取，而为了提升效率，浏览器也会运行预加载扫描（preload scanner）程序，如果如果 HTML 中存在 img、link 等标签，预加载扫描程序会把这些请求传递给`Browser Process`的 network thread 进行资源下载。

![资源加载](https://img-blog.csdnimg.cn/20210220155906139.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

### JavaScript 的下载与执行

构建 DOM 过程中，如果遇到`<script>`标签，渲染引擎会停止对 HTML 的解析，而去加载执行 JS 代码，原因在于 JS 代码可能会改变 DOM 的结构（比如执行`document.write()`等 API）。

不过开发者其实也有多种方式来告知浏览器应对如何应对某个资源，比如说如果在`<script>`标签上添加了 `async` 或 `defer`等属性，浏览器会异步的加载和执行 JS 代码，而不会阻塞渲染。

### 样式计算 - Style calculation

DOM 树只是我们页面的结构，我们要知道页面长什么样子，我们还需要知道 DOM 的每一个节点的样式。主线程在解析页面时，遇到`<style>`标签或者`<link>`标签的 CSS 资源，会加载 CSS 代码，根据 CSS 代码确定每个 DOM 节点的计算样式（computed style）。

计算样式是主线程根据 CSS 样式选择器（CSS selectors）计算出的每个 DOM 元素应该具备的具体样式，即使你的页面没有设置任何自定义的样式，浏览器也会提供其默认的样式。

![Style calculation](https://img-blog.csdnimg.cn/20210220160131114.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

### 布局 - Layout

DOM 树和计算样式完成后，我们还需要知道每一个节点在页面上的位置，布局（Layout）其实就是找到所有元素的几何关系的过程。

主线程会遍历 DOM 及相关元素的计算样式，构建出包含每个元素的页面坐标信息及盒子模型大小的布局树（Render Tree），遍历过程中，会跳过隐藏的元素（display: none），另外，伪元素虽然在 DOM 上不可见，但是在布局树上是可见的。

![Layout](https://img-blog.csdnimg.cn/20210220160248599.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

### 绘制 - Paint

布局 layout 之后，我们知道了不同元素的结构，样式，几何关系，我们要绘制出一个页面，我们要需要知道每个元素的绘制先后顺序，在绘制阶段，主线程会遍历布局树（layout tree），生成一系列的绘画记录（paint records）。绘画记录可以看做是记录各元素绘制先后顺序的笔记。

![Paint](https://img-blog.csdnimg.cn/20210220160354879.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

### 合成 - Compositing

文档结构、元素的样式、元素的几何关系、绘画顺序，这些信息我们都有了，这个时候如果要绘制一个页面，我们需要做的是把这些信息转化为显示器中的像素，这个转化的过程，叫做`光栅化（rasterizing）`。

那我们要绘制一个页面，最简单的做法是只光栅化视口内（viewport）的网页内容，如果用户进行了页面滚动，就移动光栅帧（rastered frame）并且光栅化更多的内容以补上页面缺失的部分，如下：

![Compositing](https://img-blog.csdnimg.cn/20210220160620984.gif)

Chrome 第一个版本就是采用这种简单的绘制方式，这一方式唯一的缺点就是每当页面滚动，光栅线程都需要对新移进视图的内容进行光栅化，这是一定的性能损耗，为了优化这种情况，Chrome 采取一种更加复杂的叫做合成（compositing）的做法。

那么，什么是合成？**合成**是一种将页面分成若干层，然后分别对它们进行光栅化，最后在一个单独的线程 - 合成线程（compositor thread）里面合并成一个页面的技术。当用户滚动页面时，由于页面各个层都已经被光栅化了，浏览器需要做的只是合成一个新的帧来展示滚动后的效果罢了。页面的动画效果实现也是类似，将页面上的层进行移动并构建出一个新的帧即可。

![合成](https://img-blog.csdnimg.cn/20210220161152479.gif)

为了实现合成技术，我们需要对元素进行分层，确定哪些元素需要放置在哪一层，主线程需要遍历渲染树来创建一棵层次树（Layer Tree），对于添加了 `will-change` CSS 属性的元素，会被看做单独的一层，没有 `will-change` CSS 属性的元素，浏览器会根据情况决定是否要把该元素放在单独的层。

![will-change](https://img-blog.csdnimg.cn/2021022016140757.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

你可能会想要给页面上所有的元素一个单独的层，然而当页面的层超过一定的数量后，层的合成操作要比在每个帧中光栅化页面的一小部分还要慢，因此衡量你应用的渲染性能是十分重要的一件事情。

一旦 Layer Tress 被创建，渲染顺序被确定，主线程会把这些信息通知给合成器线程，合成器线程开始对层次数的每一层进行光栅化。有的层的可以达到整个页面的大小，所以合成线程需要将它们切分为一块又一块的小图块（tiles），之后将这些小图块分别进行发送给一系列光栅线程（raster threads）进行光栅化，结束后光栅线程会将每个图块的光栅结果存在`GPU Process`的内存中。

![合成线程](https://img-blog.csdnimg.cn/20210220161510873.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

为了优化显示体验，合成线程可以给不同的光栅线程赋予不同的优先级，将那些在视口中的或者视口附近的层先被光栅化。

当图层上面的图块都被栅格化后，合成线程会收集图块上面叫做`绘画四边形（draw quads）`的信息来构建一个`合成帧（compositor frame）`。

- 绘画四边形：包含图块在内存的位置以及图层合成后图块在页面的位置之类的信息。
- 合成帧：代表页面一个帧的内容的绘制四边形集合。

以上所有步骤完成后，合成线程就会通过 IPC 向浏览器进程（browser process）提交（commit）一个渲染帧。这个时候可能有另外一个合成帧被浏览器进程的 UI 线程（UI thread）提交以改变浏览器的 UI。这些合成帧都会被发送给 GPU 从而展示在屏幕上。如果合成线程收到页面滚动的事件，合成线程会构建另外一个合成帧发送给 GPU 来更新页面。

![IPC渲染通信](https://img-blog.csdnimg.cn/20210220161636121.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

合成的好处在于这个过程没有涉及到主线程，所以合成线程不需要等待样式的计算以及 JavaScript 完成执行。这就是为什么合成器相关的动画最流畅，如果某个动画涉及到布局或者绘制的调整，就会涉及到主线程的重新计算，自然会慢很多。

### 浏览器对事件的处理

当页面渲染完毕以后，TAB 内已经显示出了可交互的 WEB 页面，用户可以进行移动鼠标、点击页面等操作了，而当这些事件发生时候，浏览器是如何处理这些事件的呢？

以点击事件（click event）为例，让鼠标点击页面时候，首先接受到事件信息的是`Browser Process`，但是`Browser Process`只知道事件发生的类型和发生的位置，具体怎么对这个点击事件进行处理，还是由 Tab 内的`Renderer Process`进行的。Browser Process 接受到事件后，随后便把事件的信息传递给了渲染进程，渲染进程会找到根据事件发生的坐标，找到目标对象（target），并且运行这个目标对象的点击事件绑定的监听函数（listener）。

![事件处理](https://img-blog.csdnimg.cn/20210220161856473.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

### 渲染进程中合成器线程接收事件

前面我们说到，合成器线程可以独立于主线程之外通过已光栅化的层创建组合帧，例如页面滚动，如果没有对页面滚动绑定相关的事件，组合器线程可以独立于主线程创建组合帧，如果页面绑定了页面滚动事件，合成器线程会等待主线程进行事件处理后才会创建组合帧。那么，合成器线程是如何判断出这个事件是否需要路由给主线程处理的呢？

由于执行 JS 是主线程的工作，当页面合成时，合成器线程会标记页面中绑定有事件处理器的区域为`非快速滚动区域(non-fast scrollable region)`，如果事件发生在这些存在标注的区域，合成器线程会把事件信息发送给主线程，等待主线程进行事件处理，如果事件不是发生在这些区域，合成器线程则会直接合成新的帧而不用等到主线程的响应。

![渲染进程中合成器线程接收事件](https://img-blog.csdnimg.cn/20210220162022137.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

而对于非快速滚动区域的标记，开发者需要注意全局事件的绑定，比如我们使用事件委托，将目标元素的事件交给根元素 body 进行处理，代码如下：

```js
document.body.addEventListener("touchstart", (event) => {
  if (event.target === area) {
    event.preventDefault();
  }
});
```

在开发者角度看，这一段代码没什么问题，但是从浏览器角度看，这一段代码给 body 元素绑定了事件监听器，也就意味着整个页面都被编辑为一个非快速滚动区域，这会使得即使你的页面的某些区域没有绑定任何事件，每次用户触发事件时，合成器线程也需要和主线程通信并等待反馈，流畅的合成器独立处理合成帧的模式就失效了。

![在这里插入图片描述](https://img-blog.csdnimg.cn/20210220162125475.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

其实这种情况也很好处理，只需要在事件监听时传递`passtive`参数为 true，`passtive`会告诉浏览器你既要绑定事件，又要让组合器线程直接跳过主线程的事件处理直接合成创建组合帧。

```js
document.body.addEventListener(
  "touchstart",
  (event) => {
    if (event.target === area) {
      event.preventDefault();
    }
  },
  { passive: true }
);
```

### 查找事件的目标对象（event target）

当合成器线程接收到事件信息，判定到事件发生不在非快速滚动区域后，合成器线程会向主线程发送这个时间信息，主线程获取到事件信息的第一件事就是通过命中测试（hit test）去找到事件的目标对象。具体的命中测试流程是遍历在绘制阶段生成的绘画记录（paint records）来找到包含了事件发生坐标上的元素对象。

![在这里插入图片描述](https://img-blog.csdnimg.cn/2021022016230866.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

### 浏览器对事件的优化

一般我们屏幕的帧率是每秒 60 帧，也就是 60fps，但是某些事件触发的频率超过了这个数值，比如 wheel，mousewheel，mousemove，pointermove，touchmove，这些连续性的事件一般每秒会触发 60~120 次，假如每一次触发事件都将事件发送到主线程处理，由于屏幕的刷新速率相对来说较低，这样使得主线程会触发过量的命中测试以及 JS 代码，使得性能有了没必要是损耗。

![在这里插入图片描述](https://img-blog.csdnimg.cn/20210220162359479.png)

出于优化的目的，浏览器会合并这些连续的事件，延迟到下一帧渲染是执行，也就是`requestAnimationFrame`之前。

![在这里插入图片描述](https://img-blog.csdnimg.cn/20210220162437417.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

而对于非连续性的事件，如 keydown，keyup，mousedown，mouseup，touchstart，touchend 等，会直接派发给主线程去执行。

:::tip

**总结:**

浏览器的多进程架构，根据不同的功能划分了不同的进程，进程内不同的使命划分了不同的线程。

用户开始浏览网页时候，浏览器进程进行处理输入、开始导航请求数据、请求响应数据，查找新建渲染进程，提交导航，之后渲染又进行了解析 HTML 构建 DOM、构建过程加载子资源、下载并执行 JS 代码、样式计算、布局、绘制、合成，一步一步的构建出一个可交互的 WEB 页面。

之后浏览器进程又接受页面的交互事件信息，并将其交给渲染进程，渲染进程内主进程进行命中测试，查找目标元素并执行绑定的事件，完成页面的交互。
:::

## 理解域名中的 CNAME

- 2020.06.04

### 简介

> `CNAME` 即指`别名记录`，也被称为`规范名字`。这种记录允你将多个名字映射到同一台计算机。

**什么情况下会用到 CNAME 记录？**

如果需要将域名指向另一个域名，再由另一个域名提供 ip 地址，就需要添加 `CNAME记录`。最常用到 CNAME 的情况包括：做 CDN ，做企业邮局。

### CNAME 配置

这里已七牛云的配置为示例.如果需要对七牛存储空间的自定义域名（自定义域名建议使用二级域名）进行 CNAME 配置。

#### 获取 CNAME 值

在 `七牛开发者平台` 页面选择 `CDN` ，选择 `域名管理`，鼠标停留在域名对应 CNAME 值上即可点击复制 ，如下图所示。

![七牛云图片示例](https://dn-odum9helk.qbox.me/FkqzaHLz8IkzamxYtONzj--5TscU)

#### 添加 CNAME 记录

添加 CNAME 记录需要在您的域名厂商处配置，比如您在 阿里云 / 腾讯云 / 新网 等处购买的域名，您需要前往购买域名的厂商相应管理控制台，添加域名解析。

1. 打开您购买域名的厂商官网，登陆后在页面右上角找到 控制台 或 相关管理后台入口。

2. 在域名厂商的控制台中，找到您的域名解析添加页面，例如：

   - a. 阿里云：在控制台页面的左侧，产品与服务栏中选择 域名。
   - b. 腾讯云：在控制台的云产品中，搜索并选择 云解析。
   - c. DNSPOD：在控制台页面左侧，选择 域名。

3. 在域名产品的列表中找到您加速域名对应的主域名，点击域名后面的 解析设置 或 解析，进入解析设置页。

4. 选择 `添加记录` ，依次填写 `主机记录`，`记录类型` 以及 `记录值`，其他可设为默认值。

![七牛云图片示例](https://dn-odum9helk.qbox.me/Fn5LvRsKMEUgBQM4PvvAccI-ISyO)

| 参数     | 填写说明                     | 注意事项                   |
| :------- | :--------------------------- | :------------------------- |
| 主机记录 | 填写加速域名对应的主机前缀   | 该参数唯一，请勿自定义     |
| 记录类型 | 选择 CNAME 类型              | 该参数唯一，请勿自定义     |
| 线路类型 | 保持默认                     | 该参数可以根据需求自行调整 |
| 记录值   | 域名创建后，七牛提供的 CNAME | 该参数唯一，请勿自定义     |
| TTL      | 保持默认                     | 该参数可以根据需求自行调整 |

#### 如何处理 CNAME 记录和 A 记录冲突？

同一个域名只能使用 A 记录解析，或者使用 CNAME 解析，如果您在添加域名的 CNAME 解析时提示存在冲突，请检查该主机记录是否已经存在 A 记录。

解决方案：

1. 如果您的域名用于绑定七牛云存储

   - 重新添加一个未在其他地方使用的二级加速域名，例如您原本在七牛绑定的是 `qiniu.com` 或 `www.qiniu.com` ，建议您重新在空间绑定加速域名例如 `cdn.qiniu.com` 或者 `xxx.qiniu.com` ，然后针对新添加的加速域名，配置对应的解析即可。

   - 删除您原有的 A 记录就可做 CNAME 解析
     (注：A 记录删除会导致您的域名无法访问该域名的原有资源，谨慎操作)

2. 如果您的域名用于加速您的源站服务器站点

   - 在确认 CDN 配置无误情况下，可以删除 A 记录。
   - 通过配置 CNAME 解析，使得域名能够绑定到七牛的加速线路上。

:::tip
修改 CNAME 配置生效时间：新增 CNAME 记录会实时生效，而修改 CNAME 记录需要等待生效时间 TTL。
:::

#### 如何判断 CNAME 是否正确配置？

先在 CDN 的 域名管理 中检查域名是否创建成功，如果已经创建成功，且已经按照步骤添加了 CNAME 解析，但是无法正常访问资源外链，或保持“等待 CNAME ”状态，可以通过以下方法检测本地的域名解析，如果域名长时间没有创建成功，您可以提交工单处理。

## 在 HTTPS 站点中使用 websocket

- 2020.08.10

> 在 http 中使用 websocket 需要配置对应的端口,在 https 中使用略有不同。

1. 如果网站使用`HTTPS`，`WebSocket`必须要使用`wss`协议；

2. 使用`wss`协议的连接请求必须只能写域名，而非 IP+端口；

3. 建议在`URL`域名后面为`websocket`定义一个路径，本例中是`/wss/`；

### 前端代码

```js
const socket = new WebSocket("wss://www.xxx.cn/wss/");
```

### Nginx 配置

```nginx
# 前提是要配置好HTTPS,然后只需要在HTTPS配置的server内加一个location即可

# websockets
location /wss/ {
    proxy_pass http://xxx.xx.xx.xx:9999;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "Upgrade";
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Real-IP $remote_addr;
}
```

:::tip

1. `location /wss/` {...}这里要格外注意！

   - html 中的 url 是 `wss://www.xxx.cn/wss/`，所以`Nginx`配置中一定要是 `/wss/`

2. `proxy_pass`对应的最好是公网 IP 加端口号，我试过 `localhost`，`127.0.0.1`，域名都会失败

3. `proxy_http_version` 1.1 版本号必须是 1.1，这条配置必需
   :::
