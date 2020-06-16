# os模块使用详解

> 操作系统接口模块。定义了与操作系统相关的一些方法等，常用于path模块和system模块结合使用。

## 路径与文件相关

- 2020.06.05

包含了路径与文件常用的一些方法。

### 获取当前文件所在路径

常用于查询文件或者导入文件等

```py
import os
os.getcwd()

# 比如我当前在/Users/xujianglong/python3-project
```
 
### 列举目录下的所有文件 

`os.listdir(path)` 用于列举指定path下的所有文件,返回的是一个列表。

```py
import os

path = os.getcwd()
files = os.listdir(path)

# 比如 ['test.py',  'pillowDemo.py', 'getTextFromFile.py']
```

### 返回当前目录文件的绝对路径

`os.path.abspath(path)` 用于返回指定文件的绝对路径地址,常用于文件重写、重命名等操作时获取文件路径。

```py
import os 

path = os.getcwd()

print(os.path.abspath('./img.png'), '\n', os.path.join(path, 'img.png'))

# 使用join方法获得当前路径再加上文件名可以实现abspath的同样效果
# /Users/xujianglong/python3-project/img.png
```

### 返回路径的文件夹部分和文件名部分

`os.path.split(path)` 用于返回路径的文件夹部分和文件名部分，返回的是元组类型。

```py
import os 

path = os.getcwd()

print(os.path.split(path))

# ('/Users/xujianglong', 'python3-project')
```

### 返回路径的文件夹部分

`os.path.dirname(path)` 用于返回path中的文件夹部分，结果不包含`\`。

```py
import os 

path = os.getcwd()

print(os.path.dirname(path))

# '/Users/xujianglong'
```

### 返回路径的文件名部分

`os.path.basename(path)` 用于返回path中的文件名。这几个方式其实都是split方法的变种。

```py
import os 

path = os.getcwd()

print(os.path.basename(path))

# '/Users/xujianglong'
```

### 查看当前文件的大小

`os.path.getsize(path)` 返回当前文件的大小(以字节为单位),如果是文件夹的话返回为0，可以配合isfile进行判断

```py
import os,sys

path = os.getcwd()

# 使用__file__ 也可获取当前文件名
file = os.path.join(path, sys.argv[0])

print(os.path.getsize(file))

# /Users/xujianglong/python3-project/test.py  116B
```

## 时间相关



