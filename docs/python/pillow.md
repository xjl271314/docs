# Pillow的介绍与使用

- 2020.05.25


## Pillow简介

> `Pillow`是`Python`平台事实上的图像处理标准库了。功能非常强大，但API却非常简单易用,提供了广泛的文件格式支持，强大的图像处理能力，主要包括`图像储存`、`图像显示`、`格式转换`以及`基本的图像处理操作`等。早期的版本是`PIL`(由于PIL仅支持2.7的版本)后来志愿者们在其基础上进行了版本升级和兼容,命名为`Pillow`。


## 安装

如果安装了`Anaconda`，`Pillow`就已经可用了。否则，我们可以在命令行下通过`pip`安装：

```python
pip install pillow
```

## Image类

> `Image`类是`PIL`中最重要的类,许多常用的方法都需要从`Image`类中导入

```python
from PIL import Image
```

### 打开一张图片

> `Image.open(fp, mode =’r’ )`: 打开图片文件，返回一个`Image对象`

| 参数名  | 描述
| :--- | :----
| `fp`   | 图片路径
| `mode` | 模式。如果给出,必须是`r`

图像的对象属性有`filename`源文件的文件名或路径、format图片的格式、size图片大小，以像素为单位、mode图片模式、width图像宽度、height图像高度、palette调色板表等；
