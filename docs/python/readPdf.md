# 读取pdf中的文本

- 2020.06.18

这里采用两步的方式，先将pdf转化为图片，再将图片转化为文字

## pdf转图片

```py
'''
pip install PyMuPDF
pip install fitz
'''

import sys, fitz, os, datetime, time

def pyMuPDF_fitz(pdf_path, pic_path):
    '''
        从pdf中提取图片
        :param pdf_path: pdf的路径
        :param pic_path: 图片保存的路径
        :return: 无return
    '''
    # 开始时间 2020-06-19 16:44:54.457168
    startTime_pdf2img = datetime.datetime.now()
    '''
        使用正则表达式查找PDF中的图片

        checkXO = r"/Type(?= */XObject)"
        checkIM = r"/Subtype(?= */Image)"
    '''
    # 打开pdf文件 返回一个fitz.Document('xx.pdf') 对象
    pdfDoc = fitz.open(pdf_path)
    print('当前pdf文件总共 %s 页, 开始转化' % pdfDoc.pageCount)
    # 获取对象数量长度
    lenXREF = pdfDoc._getXrefLength()
    # 打印PDF的信息
    print("文件名:{}, 页数: {}, 对象: {}".format(pdf_path, len(pdfDoc), lenXREF - 1))

    for pg in range(pdfDoc.pageCount):
        page = pdfDoc[pg]
        rotate = int(0)
        # 每个尺寸的缩放系数为1.3，这将为我们生成分辨率提高2.6的图像。
        # 此处若是不做设置，默认图片大小为：792X612, dpi=96
        zoom_x = 1.33333333 #(1.33333333-->1056x816)   (2-->1584x1224)
        zoom_y = 1.33333333
        mat = fitz.Matrix(zoom_x, zoom_y).preRotate(rotate)
        pix = page.getPixmap(matrix=mat, alpha=False)

        print(pix.n)
        # 判断存放图片的文件夹是否存在
        if not os.path.exists(pic_path):
            # 若图片文件夹不存在就创建
            os.makedirs(pic_path)

        # 如果 pix.n<5,可以直接将图片写入指定的文件夹内
        if pix.n < 5:
            pix.writePNG(pic_path+'/'+'images_%s.png' % pg)
        # 否则先转换CMYK
        else:
            pix0 = fitz.Pixmap(fitz.csRGB, pix)
            pix0.writePNG(pic_path+'/'+'images_%s.png' % pg)
            pix0 = None
        # 释放资源
        pix = None

    # 结束时间
    endTime_pdf2img = datetime.datetime.now()
    print('转化完成总共耗时:',(endTime_pdf2img - startTime_pdf2img).seconds, 's')

if __name__ == "__main__":
    pdf_path = 'webpack.pdf'
    pic_path = './'
    pyMuPDF_fitz(pdf_path, pic_path)
```

## 从图片中提取文字

从图片中识别出对应的文字有许多种方式，这里推荐使用第三方库或者现成的OCR识别API服务。

:::tip
**为什么需要从图片中提取文字呢?**

1. 可能需要将图片等提取转化为excel，或者处理成其他报表

2. 针对一些反爬虫的机制，某些文字采用背景图或者雪碧图来实现的，不太好进行破译的，采用图片识别转文字就可以轻松绕过其机制了。
:::


### 使用百度OCR文字识别API

> 百度的OCR服务目前已经提供了大量的识别场景，详情可以查看[简介](https://cloud.baidu.com/doc/OCR/s/Ek3h7xypm),申请相关的Key可以查阅其文档。


```py
# encoding:utf-8
import requests 
import base64

# client_id 为官网获取的AK， client_secret 为官网获取的SK
def get_access_token():
    client_id = '你的client_id'
    secret_key = '你的secret_key'
    host = 'https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id={0}&client_secret={1}'.format(client_id, secret_key)
    response = requests.get(host)
    if response:
        response = response.json()
        return response['access_token']

'''
通用文字识别
'''
def get_normal_text():
    request_url = "https://aip.baidubce.com/rest/2.0/ocr/v1/general_basic"
    # 二进制方式打开图片文件
    f = open('images_0.png', 'rb')
    img = base64.b64encode(f.read())
    params = {"image":img}
    access_token = get_access_token()
    request_url = request_url + "?access_token=" + access_token
    headers = {'content-type': 'application/x-www-form-urlencoded'}
    response = requests.post(request_url, data=params, headers=headers)
    if response:
        print (response.json())
'''
通用文字识别(含位置信息)
'''
def get_normal_text_position():
    request_url = "https://aip.baidubce.com/rest/2.0/ocr/v1/general"
    # 二进制方式打开图片文件
    f = open('images_0.png', 'rb')
    img = base64.b64encode(f.read())
    params = {"image":img}
    access_token = get_access_token()
    request_url = request_url + "?access_token=" + access_token
    headers = {'content-type': 'application/x-www-form-urlencoded'}
    response = requests.post(request_url, data=params, headers=headers)
    if response:
        print (response.json())

'''
通用文字识别（高精度版）
'''
def get_normal_text_higher():
    request_url = "https://aip.baidubce.com/rest/2.0/ocr/v1/accurate_basic"
    # 二进制方式打开图片文件
    f = open('images_0.png', 'rb')
    img = base64.b64encode(f.read())
    params = {"image":img}
    access_token = get_access_token()
    request_url = request_url + "?access_token=" + access_token
    headers = {'content-type': 'application/x-www-form-urlencoded'}
    response = requests.post(request_url, data=params, headers=headers)
    if response:
        print (response.json())

'''
通用文字识别（高精度含位置版）
'''
def get_normal_text_position_higher():
    request_url = "https://aip.baidubce.com/rest/2.0/ocr/v1/accurate"
    # 二进制方式打开图片文件
    f = open('images_0.png', 'rb')
    img = base64.b64encode(f.read())
    params = {"image":img}
    access_token = get_access_token()
    request_url = request_url + "?access_token=" + access_token
    headers = {'content-type': 'application/x-www-form-urlencoded'}
    response = requests.post(request_url, data=params, headers=headers)
    if response:
        print (response.json())

if __name__ == "__main__":
    get_normal_text()
```

:::tip
使用百度的API可以方便的识别出文字，但是对符号类，比如说小数点等，在实际的测试中识别效果并不是很好。
:::

### 使用