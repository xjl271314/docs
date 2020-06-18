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
    startTime_pdf2img = datetime.datetime.now()#开始时间

    pdfDoc = fitz.open(pdfPath)
    print(pdfDoc.pageCount)

    for pg in range(pdfDoc.pageCount):
        page = pdfDoc[pg]
        rotate = int(0)
        # 每个尺寸的缩放系数为1.3，这将为我们生成分辨率提高2.6的图像。
        # 此处若是不做设置，默认图片大小为：792X612, dpi=96
        zoom_x = 1.33333333 #(1.33333333-->1056x816)   (2-->1584x1224)
        zoom_y = 1.33333333
        mat = fitz.Matrix(zoom_x, zoom_y).preRotate(rotate)
        pix = page.getPixmap(matrix=mat, alpha=False)

        if not os.path.exists(imagePath):#判断存放图片的文件夹是否存在
            os.makedirs(imagePath) # 若图片文件夹不存在就创建

        pix.writePNG(imagePath+'/'+'images_%s.png' % pg)#将图片写入指定的文件夹内

    endTime_pdf2img = datetime.datetime.now()#结束时间
    print('pdf2img时间=',(endTime_pdf2img - startTime_pdf2img).seconds)

if __name__ == "__main__":
    pdfPath = 'webpack.pdf'
    imagePath = './'
    pyMuPDF_fitz(pdfPath, imagePath)
```