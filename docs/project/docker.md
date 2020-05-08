# 从0开始学习docker

- 2020.05.07

Docker是一个创建集装箱式的全开发平台应用程序，在Mac平台上运行Docker最好的方法就是在Mac平台上启动Docker。


## 安装

- [可视化工具下载地址](https://hub.docker.com/editions/community/docker-ce-desktop-mac)


## 检查Docker Engine，Docker Compose和Docker Machine的版本


```
$ docker --version
Docker version 19.03.8, build afacb8b
 
$ docker-compose --version
docker-compose version 1.25.4, build 8d51620a
 
$ docker-machine --version
docker-machine version 0.9.0, build 15fd4c7
```

不同机器上述的输出结果不一定相同。
## Hello World!

按照历史惯例，我们运行一下来自 Docker 的 Hello World，命令如下：

```
docker run hello-world
```

![运行结果](https://img-blog.csdnimg.cn/20200507203602585.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)


不就打印了一个字符串然后退出吗，有这么神奇？其实 Docker 为我们默默做了以下事情：

1. 检查本地是否有指定的 hello-world:latest 镜像（latest 是镜像标签，后面会细讲），如果没有，执行第 2 步，否则直接执行第 3 步

2. 本地没有指定镜像（Unable to find xxx locally），从 `Docker Hub` 下载到本地

3. 根据本地的 `hello-world:latest` 镜像创建一个新的容器并运行其中的程序

4. 运行完毕后，容器退出，控制权返回给用户

上述流程是在本地没有创建镜像的时候，假如创建了镜像有如下输出:

![运行结果](https://img-blog.csdnimg.cn/20200507203857776.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)


## 浏览应用程序和运行一个案列

- 打开命令行终端，使用`Docker`命令检查`Docker`是不像所期望的那样正常工作。可以使用这些命令`docker version`, `docker ps`和`docker run hello-world`来确认`Docker`是否正常运行，如果这些命令能正常执行,那么就说`Docker`在运行着。

- 使用更刺激的方法，运行一个`Docker`化的`web`服务器，当然这样做的前提条件是你本地必须有你要运行的镜像。

```
docker run -d -p 80:80 --name webserver nginx
```

```
Unable to find image 'nginx:latest' locally
latest: Pulling from library/nginx
54fec2fa59d0: Pull complete 
4ede6f09aefe: Pull complete 
f9dc69acb465: Pull complete 
Digest: sha256:86ae264c3f4acb99b2dee4d0098c40cb8c46dcf9e1148f05d3a51c4df6758c12
Status: Downloaded newer image for nginx:latest
1a1be28d46f49f0efa3b4cefd4f413496ef2899649e41becb7a30164989bb00e
(base) xujianglongdeMacBook-Pro:~ xujianglong$ docker ps
CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS              PORTS                NAMES
1a1be28d46f4        nginx               "nginx -g 'daemon of…"   16 seconds ago      Up 15 seconds       0.0.0.0:80->80/tcp   webserver
```

![预览](https://img-blog.csdnimg.cn/20200507180513958.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

上述命令执行顺序

1. 检查本地是否有指定的 nginx:latest 镜像（关于 latest 标签，后面会细讲），如果没有，执行第 2 步，否则直接执行第 3 步

2. 本地没有指定镜像（Unable to find xxx locally），从 Docker Hub 下载到本地

3. 根据本地的 `nginx:latest` 镜像创建一个新的容器，并通过 -p（--publish）参数建立本机的 80 端口与容器的 80 端口之间的映射，然后运行其中的程序

4. Nginx 服务器程序保持运行，容器也不会退出

:::tip
端口映射规则的格式为 `<本机端口>`:`<容器端口>`。

`Nginx` 容器默认开放了 `80 `端口，我们通过设置 `80:80` 的端口映射规则，就可以在本机（容器之外）通过访问 `localhost` 访问，甚至可以在同一局域网内通过内网 IP 访问.
:::

**就一个简简单单的 `docker run` 命令，就搞定了 `Nginx` 服务器的安装和部署？？**

没错，你可以继续访问一些不存在的路由，比如 `localhost:8080/what`，同样会提示 `404`。这时候我们再看 `Docker` 容器的输出，就有内容（服务器日志）了.


## 后台运行 Nginx

看上去很酷，不过像 `Nginx` 服务器这样的进程我们更希望把它抛到后台一直运行。按 `Ctrl + C` 退出当前的容器，然后再次运行以下命令：

```
docker run -p 8080:80 --name my-nginx -d nginx
```

:::warning
注意到与之前不同的是，我们加了一个参数 `--name`，用于指定容器名称为 `my-nginx` 加了一个选项 `-d（--detach）`，表示`“后台运行”`

容器的名称必须是唯一的，如果已经存在同一名称的容器（即使已经不再运行）就会创建失败。

如果遇到这种情况，可以删除之前不需要的容器（后面会讲解怎么删除）。
:::

Docker 会输出一串长长的 64 位容器 ID，然后把终端的控制权返回给了我们。我们试着访问 `localhost:8080`，还能看到那一串熟悉的 `Welcome to nginx!`，说明服务器真的在后台运行起来了。

```
99e7ffb43353c5d55ed287537886d45e310f777b2b75407d22e0545635753f31
```


> docker ps 命令可以让我们查看当前容器的状态

![在这里插入图片描述](https://img-blog.csdnimg.cn/2020050819580415.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

> docker stop my-nginx 可以停止运行服务


## 交互式运行

在过了一把 `Nginx` 服务器的瘾之后，我们再来体验一下 Docker 容器的另一种打开方式：`交互式运行`。运行以下命令，让我们进入到一个 `Ubuntu` 镜像中：

```
docker run -it --name dreamland ubuntu
```

可以看到我们加了 `-it` 选项，等于是同时指定 `-i（--interactive，交互式模式）`和 `-t（--tty，分配一个模拟终端）` 两个选项。

![运行结果](https://img-blog.csdnimg.cn/20200508232501726.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

运行结束后我们进入到了一个新的环境之中，一个由ubuntu镜像构筑的“梦境”。

## 销毁容器

筑梦师难免会有失败的作品，而我们刚才创建的 Docker 容器也只是用于初步探索，后续不会再用到。由于 Docker 容器是直接存储在我们本地硬盘上的，及时清理容器也能够让我们的硬盘压力小一些。我们可以通过以下命令查看所有容器（包括已经停止的）：

```
docker ps -a
```

类似 Shell 中的 rm 命令，我们可以通过 docker rm 命令销毁容器，例如删除我们之前创建的 dreamland 容器

```
docker rm dreamland

# 或者指定容器 ID，记得替换成自己机器上的
# docker rm 99e7ffb43353
```

但如果我们想要销毁所有容器怎么办？一次次输入 docker rm 删除显然不方便，可以通过以下命令轻松删除所有容器：

```
docker rm $(docker ps -aq)
```

:::warning
执行之前一定要仔细检查是否还有有价值的容器（特别是业务数据），因为容器一旦删除无法再找回
:::

## 容器生命周期

![生命周期](https://img-blog.csdnimg.cn/20200508234529122.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

### 1. 容器状态（带颜色的圆圈）

包括已创建（Created）、运行中（Running）、已暂停（Paused）、已停止（Stopped）以及被删除（Deleted）

### 2.Docker 命令（箭头上以 docker 开头的文字）

包括 docker run、docker create、docker stop 等等

### 3.事件（矩形框

包括 create、start、die、stop 还有 OOM（内存耗尽）等等

### 4.还有一个条件判断

根据重启策略（Restart Policy）判断是否需要重新启动容器

### 第一条路径（自然结束）

![在这里插入图片描述](https://img-blog.csdnimg.cn/20200508235052297.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)


•我们先通过 docker run 命令，直接创建（create）并启动（start）一个容器，进入到运行状态（Running）•然后程序运行结束（例如输出 Hello World 之后，或者通过 Ctrl + C 使得程序终止），容器死亡（die）•由于我们没有设置重启策略，所以直接进入到停止状态（Stopped）•最后通过 docker rm 命令销毁容器，进入到被删除状态（Deleted）。


### 第二条路径（强制结束）

![在这里插入图片描述](https://img-blog.csdnimg.cn/20200508235457783.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

•我们还是通过 docker run 命令，直接创建（create）并启动（start）一个容器，进入到运行状态（Running）•然后通过 docker stop 命令杀死容器中的程序（die）并停止（stop）容器，最终进入到停止状态（Stopped）•最后通过 docker rm 命令销毁容器，进入到被删除状态（Deleted）。

:::tip
有些眼尖的读者可能发现 docker kill 和 docker stop 的功能非常相似，它们之前存在细微的区别：

- kill 命令向容器内运行的程序直接发出 SIGKILL 信号（或其他指定信号），

- stop 则是先发出 SIGTERM 再发出 SIGKILL 信号，属于优雅关闭（Graceful Shutdown）
:::

### 一条捷径：删除运行中的容器

生命周期图其实有一条捷径没有画出来：直接从运行中（或暂停中）到被删除，通过给 docker rm 命令加上选项 -f（--force，强制执行）就可以实现：

```
# 假设 dreamland 还在运行中
docker rm -f dreamland
```

同样地，我们可以删除所有容器，无论处于什么状态：

```
docker rm -f $(docker ps -aq)
```

## 容器化第一个应用

在之前的步骤中，我们体验了别人为我们提前准备好的镜像（例如 hello-world、nginx 和 ubuntu），这些镜像都可以在 `Docker Hub` 镜像仓库中找到。在这一步，我们将开始筑梦之旅：学习如何容器化（Containerization）你的应用。

我们将容器化一个全栈的”梦想清单“应用，运行以下命令来获取代码，然后进入项目：

```
git clone -b start-point https://github.com/tuture-dev/docker-dream.git

cd docker-dream
```

在这一步中，我们将容器化这个用 React 编写的前端应用，用 Nginx 来提供前端页面的访问。

### 什么是容器化？

容器化包括三个阶段：

- 编写代码：我们已经提供了写好的代码•构建镜像：也就是这一节的核心内容，下面会详细展开•创建和运行容器：通过容器的方式运行我们的应用

### 构建镜像

构建 Docker 镜像主要包括两种方式：

1. 手动：根据现有的镜像创建并运行一个容器，进入其中进行修改，然后运行 docker commit 命令根据修改后的容器创建新的镜像

2. 自动：创建 `Dockerfile` 文件，指定构建镜像的命令，然后通过 `docker build` 命令直接创建镜像

### 一些准备工作

- 我们先把前端项目 `client` 构建成一个静态页面。确保你的机器上已经安装 `Node` 和 `npm`，或使用 `nvm`），然后进入到 `client` 目录下，安装所有依赖，并构建项目：

```
cd client
npm install
npm run build
```

等待一阵子后，你应该可以看到 `client/build` 目录，存放了我们要展示的前端静态页面。

- 创建 `Nginx` 配置文件 `client/config/nginx.conf`，代码如下：

```
server {
    listen 80;
    root /www;
    index index.html;
    sendfile on;
    sendfile_max_chunk 1M;
    tcp_nopush on;
    gzip_static on;


    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

- 创建 Dockerfile

然后就是这一步骤中最重要的代码：`Dockerfile！`创建 `client/Dockerfile` 文件，代码如下：

```
FROM nginx:1.13


# 删除 Nginx 的默认配置
RUN rm /etc/nginx/conf.d/default.conf


# 添加自定义 Nginx 配置
COPY config/nginx.conf /etc/nginx/conf.d/


# 将前端静态文件拷贝到容器的 /www 目录下
COPY build /www
```

可以看到我们用了 Dockerfile 中的三个指令：

- FROM 用于指定基础镜像，这里我们基于 nginx:1.13 镜像作为构建的起点

- RUN 命令用于在容器内运行任何命令（当然前提是命令必须存在）

- COPY 命令用于从 Dockerfile 所在的目录拷贝文件到容器指定的路径

```
# 如果你已经在 client 目录中
#（注意最后面有个点，代表当前目录）
docker build -t dream-client .


# 如果你回到了项目根目录
docker build -t dream-client client

```

可以看到我们指定了 -t（--tag，容器标签）为 dream-client，最后指定了构建容器的上下文目录（也就是 当前目录 . 或 client）。

运行以上的命令之后，你会发现：

```
Sending build context to Docker daemon：66.6MB
```

而且这个数字还在不断变大，就像黑客科幻电影中的场景一样，最后应该停在了 290MB 左右。接着运行了一系列的 Step（4 个），然后提示镜像构建成功。

为啥这个构建上下文（Build Context）这么大？因为我们把比“黑洞”还“重”的 `node_modules` 也加进去了！

### 使用 .dockerignore 忽略不需要的文件

Docker 提供了类似 .gitignore 的机制，让我们可以在构建镜像时忽略特定的文件或目录。创建 client/.dockerignore 文件（注意 dockerignore 前面有一个点）：

```
node_modules
```

很简单，我们只想忽略掉可怕的 node_modules。再次运行构建命令

```
docker build -t dream-client .
```

### 运行容器

终于到了容器化的最后一步——创建并运行我们的容器！通过以下命令运行刚才创建的 dream-client 镜像：

```
docker run -p 8080:80 --name client -d dream-client
```

与之前类似，我们还是设定端口映射规则为 8080:80，容器名称为 client，并且通过 -d 设置为后台运行。然后访问 localhost:8080：

我们可以看到已经正在运行的示例了。


## 常用命令

- docker ps 查看正在运行的容器

- docker stop停止正在运行的容器

- docker start启动容器

- docker ps -a查看终止状态的容器

- docker rm -f webserver命令来移除正在运行的容器

- docker list 列出本地镜像

- docker rmi 删除的镜像