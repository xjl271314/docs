# 启动多端口、运行多实例

- 2020.06.15

`Redis`安装完成后配置文件：`/usr/local/redis/redis.conf`，该配置文件中配置的端口为默认端口：`6379`；

`Redis`的启动命令路径：`/usr/local/bin/redis-server`。

有的时候我们需要运行多个不同端口下的`redis`实例，这时我们可以通过修改配置文件。

## 启动多个Redis实例

> 一台Redis服务器，分成多个节点，每个节点分配一个端口（6380，6381…），默认端口是6379。
每个节点对应一个Redis配置文件，如： `redis6380.conf`、`redis6381.conf`。


**因此我们需要在原先的redis配置文件处,新增类似`redis6380.conf`指定端口的配置文件并修改配置。**

```
#cp redis.confredis6380.conf

#vi redis6380.conf

pidfile : pidfile/var/run/redis/redis_6380.pid

port 6380

logfile : logfile/var/log/redis/redis_6380.log

rdbfile : dbfilenamedump_6380.rdb
```

## 启动多个redis实例

```
#redis-server/usr/local/redis/redis6380.conf

#redis-server/usr/local/redis/redis6381.conf
```