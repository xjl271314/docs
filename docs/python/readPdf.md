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

