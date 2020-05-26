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

```py
from PIL import Image

# 同级目录下的图片不要加相对路径'./img.png'
path = 'img.png'
im = Image.open(path)
# <PIL.PngImagePlugin.PngImageFile image mode=P size=350x142 at 0x1077A3750>
```

### 保存图片

> `Image.save(fp, format=None, **params)`: 保存图像到给定的文件名下，如果没有指定格式则可以使用文件扩展名来确定要使用的格式，无返回值。

| 参数名  | 描述
| :--- | :----
| `fp`   | 文件名或路径
| `format` | 可选的格式覆盖

### 指定图像的大小

> `Image.thumbnail(size, resample=3)`: 指定图片的像素，size是大小，`resample`是重采样滤波器。

| 参数名  | 描述
| :--- | :----
| `size`   | 图像的大小
| `resample` | 重采样滤波器 (`Image.NEAREST`、`Image.BILINEAR`、`Image.BICUBIC`、`Image.LANCZOS`、默认为`Image.BICUBIC`)

### 旋转图片的方向

> `Image.rotate(angle, resample=0, expand=0, ceter=None, translate=None)`: 旋转图片的方向，返回旋转后的图像副本，一个Image对象 。

| 参数名  | 描述
| :--- | :----
| `angle`   | 角度(逆时针旋转)
| `resample` | 重采样滤波器
| `expand`   | 是否展开
| `ceter` | 旋转中心
| `translate` | 旋转后


### 图片加滤镜

> `Image.filter(filter)`: 给图片添加滤镜，返回一个Image对象。

| 参数名  | 描述
| :--- | :----
| `filter`   | 过滤器

### 旋转或翻转图像

> `Image.transpose(method)`: 旋转或翻转图像，返回旋转或翻转后的图像副本，一个Image对象。

| 参数名  | 描述
| :--- | :----
| `method`   | 模式(`Image.FLIP_LEFT_RIGHT`、`Image.FLIP_TOP_BOTTOM`、`Image.ROTATE_90`、`Image.ROTATE_180`、`Image.ROTATE_270`、`Image.TRANSPOSE`、`Image.TRANSVERSE`

### 显示图像

> `Image.show()`: 显示这个图像，此方法主要用于调试目的；

```py
import os
from PIL import Image, ImageDraw, ImageFilter

path = os.path.join(os.getcwd(),'img.png')
im = Image.open(path)

# 获取图片的后缀名
fExit = im.format.lower()
# 获取图片的格式，大小，以及模式
print(im.format, im.size, im.mode, fExit)

# 指定图片的像素
im.thumbnail((128,128))
im.save('./image_128_128.{exit}'.format(exit = fExit))

# 旋转图片的方向
dest_im = im.rotate(90)
dest_im.save('./image_rotate.{exit}'.format(exit = fExit))

# 给图片添加滤镜  image has wrong mode
# dest_im = im.filter(ImageFilter.GaussianBlur)
# dest_im.show()

# 图片反转
dest_im = im.transpose(Image.FLIP_LEFT_RIGHT)       # 左右反转
dest_im = im.transpose(Image.FLIP_TOP_BOTTOM)   # 上下反转
dest_im.show()

# 图片上写文字
image = Image.open(path)
img_draw = ImageDraw.Draw(image)
img_draw.text((770,250),'hello world',fill='black')   # 放上文字信息到图像上
image.show()
```

## ImageDraw类

> `ImageDraw`模块为`Image对象`提供简单的`2D图形`，可以使用此模块创建新图像，注释或润饰现有图像，以及动态生成图形以供Web使用；


### 创建可用于在给定图像中绘制的对象

> `ImageDraw.Draw（im,mode=None)`：创建可用于在给定图像中绘制的对象

| 参数名  | 描述
| :--- | :----
| `im`   | 要绘制的图像
| `mode` | 用于颜色值的可选模式


### 在给定位置绘制字符串

> `ImageDraw.text(xy，text，fill=None，font=None，anchor=None，spacing=0，align =“left”，direction = None，features=None，language=None)`：在给定位置绘制字符串

| 参数名  | 描述
| :--- | :----
| `xy`   | 文本的左上角
| `text` | 要绘制的文本
| `fill` | 文本的颜色
| `font` | 一个ImageFont实例
| `anchor` | 用于颜色值的可选模式
| `spacing`   | 如果文本传递给`multiline_text()`，则为行之间的像素数
| `align` | 如果文本传递给`multiline_text()`，“left”，“center”或“right”。
| `direction` | 文字的方向。它可以是'rtl'（从右到左），'ltr'（从左到右）或'ttb'（从上到下）。需要libraqm。
| `features` | 在文本布局期间使用的OpenType字体功能列表。这通常用于打开默认情况下未启用的可选字体功能，例如'dlig'或'ss01'，但也可用于关闭默认字体功能，例如'-liga'以禁用连字或' - kern'禁用字距调整。
| `language` | 文字的语言

### 给定坐标处绘制点

> `ImageDraw.point（xy,fill=None）`：在给定坐标处绘制点。

| 参数名  | 描述
| :--- | :----
| `xy`   | 元组的序列或类似的数值
| `fill` | 点的颜色


### 批量将图片大小设置为指定大小的例子

```py
import os
from PIL import Image

# 源目录
project_dir = os.path.dirname(os.path.abspath(__file__))
input = os.path.join(project_dir, 'src')

# 输出目录
output = os.path.join(project_dir, 'dest')

def modify():
    # 切换目录
    os.chdir(input)

    # 遍历目录下所有的文件
    for image_name in os.listdir(os.getcwd()):
        print(image_name)
        im = Image.open(os.path.join(input, image_name))
        im.thumbnail((128, 128))
        im.save(os.path.join(output, image_name))

if __name__ == '__main__':
    modify()
```