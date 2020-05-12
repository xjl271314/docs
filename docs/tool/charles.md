# charles工具使用教程

- 2020.05.12

> Charles是一款http代理服务器和http监视器，当移动端在无线网连接中按要求设置好代理服务器，使所有对网络的请求都经过Charles客户端来转发时，Charles可以监控这个客户端各个程序所有连接互联网的Http通信。

## 安装Charles客户端

打开浏览器访问[Charles官网](https://www.charlesproxy.com/)，下载相应系统的Charles安装包，然后一键安装即可。

![官网](https://img-blog.csdnimg.cn/20200512184541621.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

## 抓包显示

Charles提供两种查看抓包信息的页签，一个是`Structure`，另一个是`Sequence`。

`Structure`用来将访问请求按访问的域名分类，`Sequence`用来将请求按访问的时间排序。任何程序都可以在`Charles`中的`Structure`窗口中看到访问的域名。

![Structure](https://img-blog.csdnimg.cn/20200512185623492.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

![Sequence](https://img-blog.csdnimg.cn/20200512185824825.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

## 抓取本机的发送请求

打开charles——> 选择proxy菜单项——> 选择macOs Proxy  即可抓取本机的请求

![抓取本机](https://img-blog.csdnimg.cn/20200512190706796.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

:::warning
mac下需要打开启动台——>其他——>钥匙串访问——>设置信任证书
:::

![钥匙串信任证书](https://img-blog.csdnimg.cn/20200512215436571.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

## 抓取移动设备发送的请求

使用charles抓取移动设备的请求需要保证移动设备和本机处于同一个网络中。

### 1. 打开设置———> 查看当前网络的ip(或者打开终端 输入ifconfig)

![ip地址](https://img-blog.csdnimg.cn/20200512191430855.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

### 2. 打开charles——> 选择proxy菜单项——> 选择Proxy Settings菜单项——> 填写相关代理设置

我们不进行设置的话 默认的端口就是8888端口

![代理端口配置](https://img-blog.csdnimg.cn/20200512192127130.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

### 3. 手机端配置代理

这里默认使用的是iphone手机。

手机端打开对应的网络——> 选择代理手动——> 输入对应的ip地址和端口

![手机配置代理](https://img-blog.csdnimg.cn/20200512193934344.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)


移动设备配置之后，第一次通过手机访问手机中的发送请求时，`Charles`会弹出提示框，提示有设备尝试连接到`Charle`s，是否允许，如果不允许的话，手机发送请求失败，点击`Allow`允许，这样这个设备的IP地址就会添加到允许列表中。

如果错误点击了`Deny`可以重启`Charles`会再此提示，或者通过`Proxy->Access Control Settings`手动添加地址，如果不想每个设备连接`Charles`都要点击允许的话，可以添加`0.0.0.0/0`允许所有设备连接到`Charles`。

![允许单个](https://img-blog.csdnimg.cn/20200512194941719.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

![允许所有设备](https://img-blog.csdnimg.cn/20200512194802419.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)


经过上面的配置之后我们就可以抓取http请求的包

## 配置支持https抓包请求

默认charles是不支持https抓包的,所以需要安装对应的https证书

![配置https](https://img-blog.csdnimg.cn/20200512195329755.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

手机上需要输入`chls.pro/ssl`安装对应的证书

![手机设置](https://img-blog.csdnimg.cn/20200512201215545.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

手机上打开设置——>通用——>描述文件与设备管理——>信任描述文件

![信任描述文件](https://img-blog.csdnimg.cn/20200512203904879.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

**之前经常做到这步 然后发现还是无法解析https请求，主要是遗漏了手机上证书的信任操作。**

手机上打开设置——>选择通用——>关于本机——>证书信任设置

![证书信任设置](https://img-blog.csdnimg.cn/20200512211411459.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

## 抓包请求过滤

有的时候我们并不想要查看所有请求的api信息或者其他的一些图片等资源的请求，只想关注某些特定域名下的请求。


打开charles——>选择Proxy->Recording Settings菜单

![过滤请求](https://img-blog.csdnimg.cn/20200512213248469.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)


或者在`Sequence`界面的`Filter`栏中填入需要过滤的关键字。

![Filter](https://img-blog.csdnimg.cn/20200512214124266.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

## 代理转发

我们在进行本地开发功能的测试时，可以将手机请求的地址转发到本机地址的程序进行执行。右键选择`Map Remote`，配置请求转发的地址。

![添加map记录](https://img-blog.csdnimg.cn/20200512214528901.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)


并选择`Tools->Map Remote Settings菜单`，勾选配置的转发条目。

![配置map](https://img-blog.csdnimg.cn/20200512214542105.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

## charles注册

注册码:

Registered Name: https://zhile.io

License Key: 48891cf209c6d32bf4

注册码:

Registered Name: DavidHoo

License Key: 1F32648C9DBCB8A838