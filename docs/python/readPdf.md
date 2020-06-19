# 读取pdf中的文本

- 2020.06.18

这里采用两步的方式，先将pdf转化为图片，再将图片转化为文字

## pdf转图片

```py
'''
pip install PyMuPDF
pip install fitz
'''
import sys, fitz, os, datetime

def pyMuPDF_fitz(pdfPath, imagePath):
    # 开始时间 2020-06-19 16:44:54.457168
    startTime_pdf2img = datetime.datetime.now()
    # 打开pdf文件 返回一个fitz.Document('xx.pdf') 对象
    pdfDoc = fitz.open(pdfPath)
    print('当前pdf文件总共 %s 页, 开始转化' % pdfDoc.pageCount)
    for pg in range(pdfDoc.pageCount):
        page = pdfDoc[pg]
        rotate = int(0)
        # 每个尺寸的缩放系数为1.3，这将为我们生成分辨率提高2.6的图像。
        # 此处若是不做设置，默认图片大小为：792X612, dpi=96
        zoom_x = 1.33333333 #(1.33333333-->1056x816)   (2-->1584x1224)
        zoom_y = 1.33333333
        mat = fitz.Matrix(zoom_x, zoom_y).preRotate(rotate)
        pix = page.getPixmap(matrix=mat, alpha=False)

        # 判断存放图片的文件夹是否存在
        if not os.path.exists(imagePath):
            # 若图片文件夹不存在就创建
            os.makedirs(imagePath)

        pix.writePNG(imagePath+'/'+'images_%s.png' % pg)#将图片写入指定的文件夹内

    endTime_pdf2img = datetime.datetime.now()#结束时间
    print('转化完成总共耗时:',(endTime_pdf2img - startTime_pdf2img).seconds, 's')

if __name__ == "__main__":
    pdfPath = 'react.pdf'
    imagePath = './react'
    pyMuPDF_fitz(pdfPath, imagePath)
```