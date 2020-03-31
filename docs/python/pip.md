# 解决pip安装超时

使用`pip`安装`python`库的时候经常会遇到超时而无法下载的问题,因为`pip`的服务器是在国外的，这里推荐使用两种方式来解决这个问题。


### 1. 一劳永逸 根部解决

**- mac**

1. 打开终端
2. mkdir .pip
3. cd .pip
4. touch pip.conf
5. vim pip.conf
6. 写入以下代码

```py
[global]
timeout = 6000
index-url=http://mirrors.aliyun.com/pypi/simple/
[install]
trusted-host=mirrors.aliyun.com
```
7. :wq 保存退出

**- windows**

1. 首先在下面文件夹下建立一个pip文件夹
> C:\Users\Administrator\AppData\Roaming

2. 在pip文件夹下新建一个文件pip.ini,并写入以下内容

```py
[global]
timeout = 60000
index-url = https://pypi.tuna.tsinghua.edu.cn/simple
[install]
use-mirrors = true
mirrors = https://pypi.tuna.tsinghua.edu.cn
```
### 2. 单次使用解决

1. 设置超时时间：
```py
pip --default-timeout=100 install  Pillow
```

2. 不使用缓存：
```py
pip  --no-cache-dir install Pillow
```

3. 使用国内源:

```py
pip install -i http://pypi.douban.com/simple/ 包名
```

- 阿里云:`http://mirrors.aliyun.com/pypi/simple/`
- 中国科技大学:`https://pypi.mirrors.ustc.edu.cn/simple/`
- 豆瓣(douban):`http://pypi.douban.com/simple/` 
- 清华大学:`https://pypi.tuna.tsinghua.edu.cn/simple/`
- 中国科学技术大学:`http://pypi.mirrors.ustc.edu.cn/simple/`