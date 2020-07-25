# NumPy 概述

- 2020.07.21

## 简介

> `NumPy` 是一个 `Python` 的第三方库，代表 `Numeric Python`，主要用于`数学/科学计算`。 它是一个由多维数组对象和用于处理数组的例程集合组成的库。

使用 `Numpy` 我们可以轻松进行如下等计算：

1. 数组的算数和逻辑运算。

2. 傅立叶变换和用于图形操作的例程。

3. 与线性代数有关的操作。 `NumPy` 拥有线性代数和随机数生成的内置函数。

## 安装

推荐使用`pip`命令进行安装或者下载 [Anaconda](https://www.anaconda.com/products/individual) (一个python集成环境应用，内置numpy等常用库)

```
pip install numpy
```

## 安装检查

我们可以引入`numpy`，如果未报错说明已经正常安装。

```py
# 这是约定俗称的引入方式
import numpy as np
```

## 开始

在开始前我们需要知道一个概念`ndarray`。`ndarray`是`Numpy`的核心功能,其含义为`n-dimenssional-array`，即`多维数组`。

:::tip
**数组与列表之间的主要区别为:**

- 数组是同类的,即数组的所以元素必须具有相同的类型。

- 列表可以包含任意其他类型的元素。

使用`Numpy`的函数可以快速的创建数组,效率比使用基本库更高,原因是内部使用的是`向量`。
:::

## 数组的创建

- 2020.07.21

> 数组由实际数据和描述这些数据的元素组成,可以使用`*.shape`查看数据的形状,也可以用`*.dim`查看数组的维数。

### 语法

``` py
import numpy as np

np.array(object, dtype = None, copy = True, order = None, subok = False, ndmin = 0)
```

### 参数说明

|  参数    |   描述    |
|:-------:|:----------|
| `object` |   任何暴露数组接口方法的对象都会返回一个数组或任何(嵌套)序列。  |
| `dtype` |   数组的所需数据类型，可选。  |
| `copy`  |   可选，默认为true，对象是否被复制。  |
| `order` |  C(按行)、F(按列)或A(任意，默认)。  |
| `subok` |   默认情况下，返回的数组被强制为基类数组。 如果为true，则返回子类。 |
| `ndimin` |   指定返回数组的最小维数。 |

### 数组创建

|  输入   |   输出    |  描述 
|:-------:|:----------|:----------|
| `np.array([1,2,3,4])` | `array([1,2,3,4])` | 创建一个一维数组 
| `np.array([[1,2,3],[4,5,6]], dtype=float)` | `array([[1. 2. 3.][4. 5. 6.]])` | 创建一个类型为float的二维数组
| `np.arange(0,3,1)` | `array([0 1 2])` | 创建一个从0开始到3结束(不包含3)步长为1的等差数列 
| `np.linspace(0,3,5)` | `array([0. 0.75 1.5 2.25 3.])` | 创建一个从0开始到3结束,总的元素为5个的等差数列,可以包含结束(常用于统计区间内指定不同范围的数据)
| `np.repeat([1,2,3],2)` | `array([1,1,2,2,3,3])` | 创建一个对已有数组元素值复制2次的新数组(对每个元素复制n次)
| `np.title([1,2,3],2)` | `array([1,2,3,1,2,3])` | 创建一个复制数组2次的新数组(对原数组复制n次)
| `np.empty([2,2], dtype = int)` | `array([[ 4611686018427387904 -5764598731833932082][7596498546853937154      562954583945058]])` | 创建了一个2行2列的数组,由于我们未给定初始化值,所以初始化出来的值是随机int8类型
| `np.ones((2,3))` | `array([[1. 1. 1.][1. 1. 1.]])` | 创建一个m行n列的单位矩阵
| `np.zeros((2,3))` | `array([[0. 0. 0.][0. 0. 0.]])` | 创建一个m行n列的0向量矩阵
| `np.random.random(3)` | `array([0.33540741 0.77770008 0.68126503])` | 创建一个0~1之间随机数的1行n列的数组
| `np.random.randn(3)` | `array([-1.89796613 -0.96672881  1.86899636])` | 创建一个1行n列的标准正态分布数组
| `np.random.normal(loc=0,scale=1,size=3)` | `array([-1.55783589  0.99025671  1.992423  ])` | 创建一个1行n列的均值为0,标准差为1的正态分布数组

### 数值类型补充

|  类型    |   描述    |
|:-------:|:----------|
| `bool` |  存储为一个字节的布尔值(True或False)。  |
| `int` |  默认整数，通常为int32或int64。  |
| `int8` |  字节（-128 ~ 127）。  |
| `int16` |  整数（-32768 ~ 32767）。  |
| `int32` |  整数（-2 ** 31 ~ 2 ** 31 - 1）。  |
| `int64` |  整数（-2 ** 63 ~ 2 ** 63 - 1）。  |
| `uint8` |  无符号整数（0 ~ 255）。  |
| `uint16` |  无符号整数（0 ~ 65535）。  |
| `uint32` |  无符号整数（0 ~ 2 ** 32 - 1）。  |
| `uint64` |  无符号整数（0 ~ 2 ** 64 - 1）。  |
| `float16` |  半精度浮点，符号位，5 位指数，10 位尾数。  |
| `float32` |  单精度浮点，符号位，8 位指数，23 位尾数。  |
| `float64或float` |  双精度浮点，符号位，11 位指数，52 位尾数。  |
| `complex64` |  复数，由两个 32 位浮点表示（实部和虚部）。  |
| `complex128或complex` |  复数，由两个 64 位浮点表示（实部和虚部）。  |

## 数组的索引与变换

> Python数组的索引与切片使用中括号 "[]" 选定下标来实现,同时采用 ":" 分割起始位置与间隔,用 ","表示不同的维度, 用 "..."表示遍历剩下的维度。使用`reshape()`函数可以重构数组。


|  输入   |   输出    |  描述 
|:-------:|:----------|:----------|
| `a = np.arange(6).reshape((3,2))` | `array([[0 1][2 3][4 5]])` | 创建了1个从0到6(不包含)的1行6列数组并且转置为3行2列的数组
| `a[:,1]` | `[1 3 5]` | 选取数组的第一列元素(逗号前面的表示行、逗号后面表示列)
| `a[:,[0,1]]` | `[[0 1][2 3][4 5]]` | 拷贝原数组并选取0到1列(返回的即是原数组的复制)
| `a[1,:]` | `[[2 3]]` | 选取数组的第二行 并且返回所有的列数
| `a[[0,1],:]` | `[[0 1][2 3]]` | 选取数组的第一行和第二行 并且返回所有的列数
| `a[1,1]` | `3` | 选取数组的第二行第二列所在的元素
| `a[a[:,1]>2,]` | `[[2 3][4 5]]` | `a[:,1]>2` 返回第一列数据与2的比较结果 `[False  True  True]` `a[[False  True  True],]` 返回第一行第二行对应的所有列的数组(即当对应行显示为True的时候返回该行)
| `a[a[:,1]>2,] & a[a[:,1]<4,]` | `[[2 3]]` | 多条件判断 返回上述结果元素小于4的情况下的数组
| `a.reshape(2,3)` | `[0 2 4][1 3 5]` | 将原来3行2列的数组转置为2行3列的数组
| `a.T` 或者 `np.transpose(a)` | `[0 2 4][1 3 5]` | 数组转置方法 行列转置
| `a.flatten()` | `[0 1 2 3 4 5]` | 将数组降为一维数组(返回原数组的拷贝)
| `a.ravel()` | `[0 1 2 3 4 5]` | 将数组降为一维数组(返回原数组的视图,改变了原数组)

:::tip
`Numpy`的`ravel()`和`flatten()`所实现的功能是一致的,都是将制定的多维数组降为一维数组。两者的区别是在于返回拷贝还是视图。

- `flatten()`返回原数组的拷贝,并不会改变原数组

- `ravel()`返回修改后的原数组,会影响原始的矩阵。
:::

## 数组的排序

- 2020.07.22

> `Numpy` 提供了多种排序函数,比如`sort`(直接返回排序后的数组)、`argsort`(返回数组排序后的下标)、`lexsort`(根据键值的字典序排序)、`msort`(沿着第一个轴排序)、`sort_complex`(对复数按照先实后虚的顺序排序)等。

```py
import numpy as np

# 一维数组a
a = np.array([3,2,5,4])

# 直接排序 [2,3,4,5]
np.sort(a)
a.sort()

# 降序排列 [5,4,3,2]
np.sort(np.argsort(-a))

# 数组排序后的下标 [1,0,3,2]
np.argsort(a)

# 二维数组
b = np.array([[1,4,3],[4,5,1],[2,3,2]])

# axis = 0 表示按列排序 axis = 1 表示按行排列
b.sort(axis=0)
```

## 数组的组合

- 2020.07.23

> 数组的组合可以分为: `水平组合(hstack)`、`垂直组合(vstack)`、`深度组合(dstack)`、`列组合(colume_stack)`、`行组合(row_stack)`等。


### np.concatenate((a1, a2, ...), axis)

> 沿指定轴连接相同形状的两个或多个数组,默认是沿着axis=0及列方向。

```py
import numpy as np

# [[0 1][2 3][4 5]]
a = np.arange(6).reshape(3,2)

# [[0 1 2][3 4 5][6 7 8]]
b = np.arange(9).reshape(3,3)

# [[0 1 2][3 4 5]]
c = np.arange(6).reshape(2,3)

'''
水平组合 
[[0 1 0 1 2]
 [2 3 3 4 5]
 [4 5 6 7 8]]
'''
np.hstack((a,b))
np.concatenate((a,b),axis=1)
np.append(a,b,axis=1)

'''
垂直组合
[[0 1 2]
 [3 4 5]
 [6 7 8]
 [0 1 2]
 [3 4 5]]
'''
np.vstack((b,c))
np.concatenate((b,c),axis=0)
np.append(b,c,axis=0)

'''
直接组合
[0 1 2 3 4 5 0 1 2 3 4 5]
'''
np.append(a,c)

```
## 数组的常用统计函数

- 2020.07.23

> 我们经常需要对数据进行一些统计处理,包括简单的均值、中值、方差、标准差、最大值、最小值等。

```py
import numpy as np

# [0 1 2 3 4 5]
a = np.arange(6)

# 统计平均值 2.5
np.mean(a)
np.average(a)

# 统计方差 2.9166666666666665
np.var(a)

# 统计标准差 1.707825127659933
np.std(a)

# 统计最大值 6
np.max(a)

# 统计最小值 0
np.min(a)

# 统计最大值所在的索引 6
np.argmax(a)

# 统计最小值所在的索引 0
np.argmin(a)

# 计算全距 即最大值与最小值的差 5
np.ptp(a)

# 计算百分位在统计对象中的值 4.5
np.percentile(a,90)

# 计算统计对象的中值 2.5
np.median(a)

# 计算统计对象的和 15
np.sum(a)
```

## 数组的分割

- 2020.07.24

> 在实际应用中我们经常需要在原有数据中提取部分数据或者进行分类分割,这时需要对原数组进行分割。

### np.split(ary, indices_or_sections, axis)

| 参数名  | 参数描述
| :--- | :---- 
| `ary` | 被分割的输入数组
| `indices_or_sections` | 可以是整数，表明要从输入数组创建的，等大小的子数组的数量。如果此参数是一维数组，表示从指定位置进行分割。
| `axis` | 分割的方向默认是沿0轴

```py
import numpy as np
a = np.arange(9)

# [0 1 2 3 4 5 6 7 8]
print('第一个数组：')
print(a,'\n')

# [array([0, 1, 2]), array([3, 4, 5]), array([6, 7, 8])]
print('将数组分为三个大小相等的子数组：')
b = np.split(a,3)
print(b,'\n')

# [array([0, 1, 2, 3]), array([4, 5, 6]), array([7, 8])]
print('将数组在一维数组中指定的位置分割：')
b = np.split(a,[4,7])
print(b)
```

### np.hsplit(ary, indices_or_sections)

> `np.hsplit`是`split()`函数的特例，其中轴为 1 表示水平分割，无论输入数组的维度是什么。

```py
import numpy as np
a = np.arange(16).reshape(4,4)

print('第一个数组：')
print(a,'\n')

'''
[[ 0  1  2  3]
 [ 4  5  6  7]
 [ 8  9 10 11]
 [12 13 14 15]]
'''

print('水平分割后：')
b = np.hsplit(a,2)
print(b)

'''
[array([[ 0,  1],
        [ 4,  5],
        [ 8,  9],
        [12, 13]]), 
 array([[ 2,  3],
        [ 6,  7],
        [10, 11],
        [14, 15]])]
'''

```
### np.vsplit(ary, indices_or_sections)

> `np.vsplit`是`split()`函数的特例，其中轴为 0 表示竖直分割，无论输入数组的维度是什么。

```py
import numpy as np
a = np.arange(16).reshape(4,4)

print('第一个数组：')
print(a,'\n')

'''
[[ 0  1  2  3]
 [ 4  5  6  7]
 [ 8  9 10 11]
 [12 13 14 15]]
'''

print('垂直分割后：')
b = np.vsplit(a,2)
print(b)

'''
[array([[0, 1, 2, 3],
       [4, 5, 6, 7]]), 
 array([[ 8,  9, 10, 11],
       [12, 13, 14, 15]])]
'''
```

## 数组的添加\删除

- 2020.07.25

### np.resize(ary, shape)

> 返回指定大小的新数组。 如果新大小大于原始大小，则包含原始数组中的元素的重复副本。

:::tip

`np.resize(ary, shape)` 与 `np.reshape(ary, shape)` 都是为了改变数组的size。

区别在于`resize`会直接修改原始数组的数据,而返回`None`。`reshape`方法不会修改原始数组的数据，而返回一个新的数组。

:::

```py
import numpy as np

a = np.arange(0, 6, 1)

# [0 1 2 3 4 5] (6,)
print('原始数组:\n', a.shape)

b = np.resize(a,(2,3))
c = np.reshape(a,(2,3))

print('resiez后的数组:\n', b)

'''
 [[0 1 2]
 [3 4 5]]
'''

print('reshapre后的数组:\n', c)

'''
 [[0 1 2]
 [3 4 5]]
'''

d = np.resize(a,(3,3))
print(d)

'''
[[0 1 2]
 [3 4 5]
 [0 1 2]]
'''

e = np.resize(a,(3,5))
print(e)

'''
[[0 1 2 3 4]
 [5 0 1 2 3]
 [4 5 0 1 2]]
'''
```

:::warning
当原有的数组的shape不满足新的要求的时候会复制原有的值填充成指定的shape
:::

### np.append(ary, values, axis)

> 在数组的末尾添加值,返回修改后的原数组的副本(不改变原数组)。此外，在指定axios的时候,输入数组的维度必须匹配否则将报错`ValueError`。

| 参数名  | 参数描述
| :--- | :---- 
| `ary` | 输入的原始数组
| `values` | 需要追加的数组
| `axis` | 可选 不填的话数组和追加的数组始终返回降维后的一维数组

```py
import numpy as np

# [0 1 2]
a = np.linspace(0,2,3, dtype=int)
print(a)

# [array([3, 4, 5]), array([6, 7, 8])]   
b = np.split(np.arange(3,9), 2)
print(b)

# [0 1 2 3 4 5 6 7 8]
c = np.append(a, b)
print(c)

# err
d = np.append(a, np.arange(0,2), axis=1)
print(d)

# [0 1 2 3 4 5]
e = np.append(a, np.arange(3,6), axis=0)
print(e)
```

### np.insert(arr, obj, values, axis)

> 在指定索引之前，沿给定轴在数组中插入值,返回一个新的数组(不改变原始数组) 此外，如果未提供axis，则输入数组会被展开成一维数组。

| 参数名  | 参数描述
| :--- | :---- 
| `ary` | 输入的原始数组
| `obj` | 在原数组的对应索引位置插入
| `values` | 需要追加的数组
| `axis` | 可选 不填的话数组和追加的数组始终返回降维后的一维数组

```py
import numpy as np
a = np.array([[1,2],[3,4],[5,6]])

print('第一个数组：')
print(a)
print('\n')

'''
[[1 2]
 [3 4]
 [5 6]]
'''  

print('未传递 Axis 参数, 在插入之前输入数组会被展开。')
print(np.insert(a,3,[11,12]))
print('\n' ) 
'''
[ 1  2  3 11 12  4  5  6]
'''

print('传递了 Axis 参数。 会广播值数组来配输入数组。\n')

print('沿轴 0 广播：')
print(np.insert(a,1,[11],axis = 0))
print('\n')  
'''
[[ 1  2]
 [11 11]
 [ 3  4]
 [ 5  6]]
'''

print('沿轴 1 广播：')
print(np.insert(a,1,11,axis = 1))
'''
[[ 1 11  2]
 [ 3 11  4]
 [ 5 11  6]]
'''
```

### np.delete(arr, obj, axis)

> 返回从输入数组中删除指定子数组的后的新数组,不改变原数组。 与`insert()`函数的情况一样，如果未提供axis参数，则将数组降维为一维。

| 参数名  | 参数描述
| :--- | :---- 
| `ary` | 输入的原始数组
| `obj` | 在原数组的对应索引位置删除
| `axis` | 可选 不填始终返回降维后的一维数组

```py
import numpy as np
a = np.arange(12).reshape(3,4)

print('第一个数组：')
print(a)
print('\n' ) 
'''
[[0 1 2 3]
 [4 5 6 7]
 [8 9 10 11]]
'''

print('未传递 Axis 参数。 在插入之前输入数组会被展开。\n')

print(np.delete(a,5))
print('\n')
'''
[0 1 2 3 4 6 7 8 9 10 11]
'''

print('删除第二列：') 
print(np.delete(a,1,axis = 1))
print('\n')  
'''
[[0 2 3]
 [4 6 7]
 [8 10 11]]
'''

print('包含从数组中删除的替代值的切片：')
a = np.array([1,2,3,4,5,6,7,8,9,10])
print(np.delete(a, np.s_[::2]))
'''
[2 4 6 8 10]
'''
```

### np.unique(arr, return_index, return_inverse, return_counts)

> 返回对指定数组去重后的一个元组,包含去重数组和相关索引的数组。索引的性质取决于函数调用者返回参数的类型。

| 参数名  | 参数描述
| :--- | :---- 
| `ary` | 输入的原始数组,如果不是一维数组则会展开
| `return_index` | 如果为true，返回输入数组中的元素下标
| `return_inverse` | 如果为true，返回去重数组的下标，它可以用于重构输入数组
| `return_counts` | 如果为true，返回去重数组中的元素在原数组中的出现次数

```py
import numpy as np
a = np.array([5,2,6,2,7,5,6,8,2,9]).reshape((2,5))

print('原始数组\n')
print(a)
'''
[[5 2]
 [6 2]
 [7 5]
 [6 8]
 [2 9]]
'''

b = np.unique(a)
print('a去重后：')
print(b)
'''
二维数组被转化成一维数组
[2 5 6 7 8 9]
'''

print('去重后数组在原数组的索引数组：')
u,indices = np.unique(a, return_index = True)
print(indices)
'''
[1 0 2 4 7 9]
'''

print('去重的元素在原数组对应的索引：')
u,indices = np.unique(a,return_inverse = True)
print(indices)
'''
[1 0 2 0 3 1 2 4 0 5]
'''

print('返回去重元素的重复数量：')
u,indices = np.unique(a,return_counts = True)
print(indices)
'''
[3 2 2 1 1 1]
'''
```

## 常用字符串函数

- 2020.07.25

### np.char.add(str1, str2)

> 返回两个str或Unicode数组的逐个字符串连接后的结果

```py
import numpy as np 

print('连接两个字符串：')
print(np.char.add('hello',' world'))
'''
hello world
'''

print('连接两个字符串数组：')
print(np.char.add(['hello'],[' world']))
'''
['hello world']
'''
```

:::warning
该方法仅支持两个字符串(数组)连接
:::

### np.char.multiply(str, count)

> 返回给定参数的多重连接

| 参数名  | 参数描述
| :--- | :---- 
| `str` | 需要处理的字符串
| `count` | 重复的次数

```py
import numpy as np 
print(np.char.multiply('hello ',3))

'''
hello hello hello
'''
```

### np.char.center(str, width,fillchar)

> 返回指定宽度的数组，以便输入字符串位于中心，并使用`fillchar`在左侧和右侧进行填充。

| 参数名  | 参数描述
| :--- | :---- 
| `str` | 需要处理的字符串
| `width` | 需要填充完成的长度
| `fillchar` | 填充的字符

```py
import numpy as np 

print(np.char.center('hello', 10, fillchar = '*'))
'''
总宽度为10 文本占位为5 其余 5位 *补充分别添加在两侧
**hello***  
'''

print(np.char.center('hello', 11, fillchar = '-'))
'''
单数的时候默认多的补在右侧
---hello---  
'''
```

### np.char.capitalize(str)

> 返回字符串的副本，其中第一个字母大写。

```py
import numpy as np 

print(np.char.capitalize('hello world'))
'''
Hello world
'''
```

### np.char.title(str)

> 返回输入字符串的副本，其中每个单词的首字母都大写。

```py
import numpy as np 
print(np.char.capitalize('hello world'))
'''
Hello World
'''
```

### np.char.lower(str)

> 返回一个数组，其元素转换为小写。它对每个元素调用`str.lower`。

```py
import numpy as np 
print(np.char.lower('HELLO WORLD'))
'''
hello world
'''
```

### np.char.upper(str)

> 返回一个数组，其元素转换为大写。它对每个元素调用`str.upper`。

```py
import numpy as np 
print(np.char.upper('hello world'))
'''
HELLO WORLD
'''
```

### np.char.split(str, seq)

> 返回输入字符串中的单词列表。 默认情况下，`空格`用作分隔符。 否则，指定的分隔符字符用于分割字符串。

| 参数名  | 参数描述
| :--- | :---- 
| `str` | 需要处理的字符串
| `seq` | 分隔符

```py
import numpy as np 

print(np.char.split ('hello how are you?')) 
'''
['hello', 'how', 'are', 'you?']
'''
print(np.char.split ('Hello,python,numpy', sep = ','))
'''
['Hello', 'python', 'numpy']
'''
```

### np.char.splitlines(str)

> 返回数组中元素的单词列表，以换行符('\n'，'\r'，'\r\n'都会用作换行符)分割。

```py
import numpy as np 

print(np.char.splitlines ('hello\rhow are you?')) 
'''
['hello', 'how are you?']
'''

print(np.char.splitlines ('Hello,python\nnumpy'))
'''
['Hello,python', 'numpy']
'''
```

### np.char.join(seq, str)

> 返回一个字符串，其中单个字符由特定的分隔符连接。

```py
import numpy as np 

print(np.char.join(':','ymd')) 
'''
y:m:d
'''
print(np.char.join([':','-'],['abc','ymd']))
'''
['a:b:c' 'y-m-d']
'''
```

### np.char.replace(str, old, new)

> 返回被指定字符串替换后的副本。

```py
import numpy as np 

print(np.char.replace ('Lxq is a good gril', 'good', 'pretty'))
'''
Lxq is a pretty gril
'''
```

## 常用三角函数

- 2020.07.25

### np.sin()

> 返回正弦值

### np.cos()

> 返回余弦值

### np.tan()

> 返回正切值

```py
# 1 弧度 = 360 / 2 π = 180 / π

import numpy as np

a = np.array([0,30,45,60,90])  

print('不同角度的正弦值：') 

# 通过乘 pi/180 转化为弧度  
print(np.sin(a*np.pi/180),'\n')   
'''
[0. 0.5 0.70710678 0.8660254  1.] 
'''

print('数组中角度的余弦值：\n')   

print(np.cos(a*np.pi/180))   
'''
[1.00000000e+00 8.66025404e-01 7.07106781e-01 5.00000000e-01
 6.12323400e-17]
'''

print('数组中角度的正切值：\n')  
 
print(np.tan(a*np.pi/180)) 
'''
[0.00000000e+00 5.77350269e-01 1.00000000e+00 1.73205081e+00
 1.63312394e+16]
'''
```

`arcsin`，`arccos`，和`arctan`函数返回给定角度的`sin`，`cos`和`tan`的反三角函数。 

这些函数的结果可以通过`numpy.degrees()`函数通过将弧度制转换为角度制来验证。

```py
import numpy as np

a = np.array([0,30,45,60,90])  

print('含有正弦值的数组：\n')
sin = np.around(np.sin(a*np.pi/180),2)  
print(sin)
'''
[0.   0.5  0.71 0.87 1.  ]
'''

print('计算角度的反正弦，返回值以弧度为单位：\n')
inv = np.around(np.arcsin(sin),2)  
print(inv)
'''
[0.   0.52 0.79 1.06 1.57]
'''

print('通过转化为角度制来检查结果：\n')  
print(np.around(np.degrees(inv)),2)   
'''
[ 0. 30. 45. 61. 90.] 2
'''

print('arccos 和 arctan 函数行为类似：\n')
cos = np.cos(a*np.pi/180)  
print(np.around(cos),2) 
'''
[1. 1. 1. 1. 0.] 2
'''
print('反余弦：\n')
inv = np.arccos(cos)  
print(np.around(inv),2) 
'''
[0. 1. 1. 1. 2.] 2
'''

print('角度制单位：\n')  
print(np.around(np.degrees(inv)),2)   
'''
[ 0. 30. 45. 60. 90.] 2
'''

print('tan 函数：\n')
tan = np.tan(a*np.pi/180)  
print(np.around(tan),2) 
'''
[0.00000000e+00 1.00000000e+00 1.00000000e+00 2.00000000e+00
 1.63312394e+16] 2
'''

print('反正切：\n')
inv = np.arctan(tan)  
print(np.around(inv),2) 
'''
[0. 1. 1. 1. 2.] 2
'''

print('角度制单位：\n')  
print(np.around(np.degrees(inv)),2) 
'''
[ 0. 30. 45. 60. 90.] 2
'''
```

## 常用算数函数

- 2020.07.25

> 算术运算包括`add()`，`subtract()`，`multiply()`和`divide()`等方法，其中输入数组必须具有相同的形状或符合数组广播规则。


```py
import numpy as np 

a = np.arange(4, dtype = np.float_).reshape(2,2)  

print('第一个数组：\n')  
print(a) 
'''
[[0. 1.]
 [2. 3.]]
'''

print('第二个数组：\n') 
b = np.array([10,10])  
print(b) 
'''
[10 10]
'''

print('两个数组相加：\n')  
print(np.add(a,b))  
'''
[[10. 11.]
 [12. 13.]]
'''

print('两个数组相减：\n')  
print(np.subtract(a,b))  
'''
[[-10.  -9.]
 [ -8.  -7.]]
'''

print('两个数组相乘：\n')  
print(np.multiply(a,b))  
'''
[[ 0. 10.]
 [20. 30.]]
'''

print('两个数组相除：')  
print(np.divide(a,b))
'''
[[0.  0.1]
 [0.2 0.3]]
'''
```