# BFF

- 2020.03.16

> `BFF(Backend For Frontend（服务于前端的后端）)`，也就是服务器设计 API 时会考虑前端的使用，并在服务端直接进行业务逻辑的处理，又称为`用户体验适配器`。`BFF` 只是一种逻辑分层，而非一种技术，虽然 `BFF` 是一个新名词，但它的理念由来已久。

![在这里插入图片描述](https://img-blog.csdnimg.cn/20200316203345143.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

在我们的前端页面时常存在，某个页面需要向 `backend A`、`backend B` 以及 `backend C`...... 发送请求，不同服务的返回值用于渲染页面中不同的 `component`，即一个页面存在很多请求的场景。

![在这里插入图片描述](https://img-blog.csdnimg.cn/20200316203509417.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

此时，每次访问该页面都需要发送 3 个请求。同时为了保障 `Android`，`iOS`，以及 `Web` 端的不同需求，需要为不同的平台写不同的 `API` 接口，而每当值发生一些变化时，需要 `Android`，`iOS`，`Web` 做出修改。

与此同时，当我们需要对一个字符串进行处理，如限定 `140` 个字符的时候，我们需要在每一个客户端`（Android，iOS，Web）`分别实现一遍，这样的代价显然相当大。

**于是，我们就需要 `BFF` 作为中间件。在这个中间件上我们将做一些业务逻辑处理：**

![在这里插入图片描述](https://img-blog.csdnimg.cn/20200316203712676.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

例如，我们加入 `BFF` 层，原本每次访问发送 3 请求页面，变成一个请求。

![在这里插入图片描述](https://img-blog.csdnimg.cn/20200316203745321.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

## 使用 BFF 的正确姿势

**- 多端应用**

我们在设计 API 时会考虑到不同设备的需求，也就是为不同的设备提供不同的 API，虽然它们可能是实现相同的功能，但因为不同设备的特殊性，它们对服务端的 API 访问也各有其特点，需要区别处理。

**- 服务聚合**

随着微服务的兴起，原本在同一个进程内运行的业务流程被拆分到了不同的服务中。这在增加业务灵活性的同时，也让前端的调用变得更复杂。BFF 的出现为前端应用提供了一个对业务服务调用的聚合点，它屏蔽了复杂的服务调用链，让前端可以聚焦在所需要的数据上，而不用关注底层提供这些数据的服务。

**- 非必要，莫新增**

我们在看到 BFF 带来的各种好处的同时，也要注意到它所带来的代码重复和工作量增加方面的问题。如果与已有 BFF 功能类似，且展现数据的要求也相近的话，一定要谨慎对待新增 BFF 的行为。因此，建议非必要，莫新增。


## 实战中的玩法

**- 访问控制**
例如，服务中的权限控制，将所有服务中的权限控制集中在 BFF 层，使下层服务更加纯粹和独立。

**- 应用缓存**
项目中时常存在一些需要缓存的临时数据，此时 BFF 作为业务的汇聚点，距离用户请求最近，遂将该缓存操作放在 BFF 层。

**- 第三方入口**
在业务中需要与第三交互时，将该交互放在 BFF 层，这样可以只暴露必要信息给第三方，从而便于控制第三方的访问。


