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

### 遍历一个目录内各个子目录和子文件

`os.walk(top, [, topdown=True[, onerror=None[, followlinks=False]]])` 用来遍历一个目录内各个子目录和子文件, 返回一个三元`tupple(dirpath, dirnames, filenames)`。

**其中参数解释如下:**

| 参数名  | 参数类型 | 是否必选 | 默认值 | 参数描述
| :--- | :---- | :---- | :---- | :----
| `top` | `string` | 是 | - | 需要遍历的目录路径地址
| `topdown`| `boolean` | 可选 | True | 为 True，则优先遍历 top 目录，否则优先遍历 top 的子目录(默认为开启)。如果 topdown 参数为 True，walk 会遍历top文件夹，与top 文件夹中每一个子目录。
| `onerror` |	`function` | 可选 | - | 需要一个 callable 对象，当 walk 需要异常时，会调用。
| `followlinks` |	`boolean` | 可选 | False | 如果为 True，则会遍历目录下的快捷方式(linux 下是软连接 symbolic link )实际所指的目录(默认关闭)，如果为 False，则优先遍历 top 的子目录。


**其中返回值的解释如下:**

- `dirpath` 是一个`string`，代表目录的路径，

- `dirnames` 是一个`list`，包含了`dirpath`下所有子目录的名字。

- `filenames` 是一个`list`，包含了非目录文件的名字。

:::tip
这些名字不包含路径信息，如果需要得到全路径，需要使用`os.path.join(dirpath, name)`.
:::

```py
import os

for root, dirs, files in os.walk(self.file_path):
    for name in files:
        print('file name is %s' % name)

```

### 将文件的名称和扩展名分离

`os.path.splitext(path)` 将文件的名称和扩展名分离出来，默认返回`(fname,fextension)元组`，可做分片操作。

```py
import os

path_01='E:\images\1.png'
path_02='E:\images\aa'
res_01=os.path.splitext(path_01) # ('E:\images\1', '.png')
res_02=os.path.splitext(path_02) # ('E:\images\aa', '')

```

## 时间相关



