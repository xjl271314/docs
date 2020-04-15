# Redis简介

## 简介

> `redis`是一个`key-value`存储系统。和`Memcached`类似，支持存储的`value`类型相对更多，包括`string(字符串)`、`list(链表)`、`set(集合)`、`zset(sorted set –有序集合)`和`hash（哈希类型）`。整个数据库统统加载在内存当中进行操作，定期通过异步操作把数据库数据 flush 到硬盘上进行保存。因为是纯内存操作，Redis 的性能非常出色，每秒可以处理超过 10 万次读写操作，是已知性能最快的`Key-Value DB`。

## 安装

可以直接在`redis`官网上下载对应的安装包，也可以通过`homebrew`安装。mac上推荐使用`homebrew`安装，比较方便。

- homebrew安装

1. 进入进入[官网](https://brew.sh/)获取下载命令

2. 复制命令到终端执行

```
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"
```
- redis安装

```
brew update
brew search redis
brew install redis
```

耐心等待redis安装结束…

## 可视化软件

redis有对应的可视化操作工具[下载地址](https://github.com/uglide/RedisDesktopManager) 


## 修改配置文件

打开终端输入

```
vim /usr/local/etc/redis.conf
```

比如修改存储位置:

![修改存储位置](https://img-blog.csdnimg.cn/20200415204101829.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

修改默认端口:

![修改默认端口](https://img-blog.csdnimg.cn/20200415204338403.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)


## 启动

```
redis-server /usr/local/etc/redis.conf

// 或者

brew services start redis
```
![redis启动成功](https://img-blog.csdnimg.cn/20200415204955986.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

## 关闭

```
redis-cli shutdown

// 或者

brew services stop redis
```