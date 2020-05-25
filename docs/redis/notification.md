# Keyspace Notification（键空间通知）

- 2020.05.25

## 需求分析

1. 在`Redis`中设置了生存时间的`Key`，在过期时能不能有所提示？

2. 如果能对过期`Key`有个监听，如何对过期`Key`进行一个回调处理？

3. 如何使用 `Redis` 来实现定时任务？

## 解决方案

在 `Redis` 的 `2.8.0` 版本之后，其推出了一个新的特性————`键空间消息（Redis Keyspace Notifications）`，它配合 `2.0.0` 版本之后的 `SUBSCRIBE` 就能完成这个定时任务。


## Publish / Subscribe 

`Redis` 在 `2.0.0` 之后推出了 `Pub / Sub` 的指令，大致就是说一边给 `Redis` 的特定频道发送消息，另一边从 `Redis` 的特定频道取值————形成了一个简易的`消息队列`。

## Redis Keyspace Notifications

在 `Redis` 里面有一些事件，比如`键到期`、`键被删除`等。然后我们可以通过配置一些东西来让 `Redis` 一旦触发这些事件的时候就往特定的 `Channel` 推一条消息。

大致的流程就是我们给 `Redis` 的某一个 `db` 设置过期事件，使其键一旦过期就会往特定频道推消息，我在自己的客户端这边就一直消费这个频道就好了。

以后一来一条定时任务，我们就把这个任务状态压缩成一个键，并且过期时间为距这个任务执行的时间差。那么当键一旦到期，就到了任务该执行的时间，`Redis` 自然会把过期消息推去，我们的客户端就能接收到了。这样一来就起到了定时任务的作用。

## Key过期事件的Redis配置

> 这里需要配置 `notify-keyspace-events` 的参数为 `Ex`。`x` 代表了`过期事件`。`notify-keyspace-events Ex` 保存配置后，重启`Redis`服务，使配置生效。

![notify-keyspace-events](https://img-blog.csdnimg.cn/20200525190205251.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

配置完成后执行

```
brew services restart redis
```

### 添加过期事件订阅 开启一个终端，redis-cli 进入 redis 。开始订阅所有操作，等待接收消息。

```r
redis-cli -h 127.0.0.1 -p 6379

psubscribe __keyevent@0__:expired

# PSUBSCRIBE 命令订阅一个或多个符合给定模式的频道，0代表数据库0
```



![执行结果](https://img-blog.csdnimg.cn/20200525191847885.png)


### 再开启一个终端，redis-cli 进入 redis，新增一个 10秒过期的键：

```r
# SETEX key seconds value
setex test 10 123
```

### 另外一边执行了阻塞订阅操作后的终端，10秒过期后有如下信息输出：

![输出](https://img-blog.csdnimg.cn/20200525193252154.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

