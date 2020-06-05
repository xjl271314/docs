# 批量修改一个文件下的所有图片的名称

- 2020.06.05

## 场景

有些时候我们在网上下载了一些图片或者屏幕截图等，类似(20200605ssxxffgf.png)这种名称的图片,我们把其中相同类目的一些图存放在一个文件夹中。这个文件夹中的图片，我们想要按照顺序对其重命名，假如文件夹内有几万张图片,一个一个的重命名就显的非常的麻烦，人生苦短何不用python帮助我们完成?

## 案例

![示例](https://img-blog.csdnimg.cn/20200605115756800.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

```py
# -*- coding:utf-8 -*-
# 2020.06.05
import os

# 这里改成你自己需要修改的目录即可
outer_path = '/Users/xujianglong/downloads/图片'
folderlist = os.listdir(outer_path)  # 列举文件夹

# 注意mac下隐藏文件.DS_Store
try:
    folderlist.remove('.DS_Store')
except:
    pass

total_num_folder = len(folderlist)  # 文件夹的总数

print('total have {0} folders'.format(total_num_folder))  # 打印文件夹的总数

for folder in folderlist:
    inner_path = os.path.join(outer_path, folder)
    filelist = os.listdir(inner_path)  # 列举图片
    i = 0
    for index, item in enumerate(filelist):
        total_num_file = len(filelist)  # 单个文件夹内图片的总数
        pic_type = item.split('.')[-1]  # 获取图片的后缀名
        if pic_type in ['jpg', 'png']:
            src = os.path.join(os.path.abspath(inner_path), item)  # 原图的地址
            # 新图的地址（这里可以把str(folder) + '_' + str(i) + '.jpg'改成你想改的名称）
            dst = os.path.join(os.path.abspath(inner_path),str(folder) + '_' + str(i) + '.' + pic_type)
            try:
                os.rename(src, dst)
                print('converting {0} to {1} ...'.format(src, dst))
                i += 1
            except:
                continue
```