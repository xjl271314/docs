# 配合tinyPng实现图片高质量压缩

- 2020.06.20

这里介绍的是使用 `python + tinypng` 自动将文件夹下的所有指定格式的图片进行压缩

## 安装

为了使用`tinypng`的压缩方法，我们需要安装一个`python`操作`tinypng`的第三方库`tinify`.

```
pip install tinify
```

## 使用

在使用 `tinypng` 的自动压缩api的时候，需要登陆[TinyPNG官方网站:](https://tinypng.com/) ，注册`TinyPNG账号`，获取专属的`API_KEY`，免费的key一个月可以压缩500次。

![申请账号](https://img-blog.csdnimg.cn/20200620144116164.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

```py
'''
    python + tinypng 实现自动化压缩图片 并保存为指定格式
'''
import tinify
import os
import time
import random
import types
from multiprocessing import Pool, Manager


class TinyPng():
    def __init__(self, file_path=''):
        # 需要压缩的图片文件夹地址
        self.file_path = file_path
        # 存放当前使用的key的索引
        self.api_key_index = 0
        # 存放压缩失败的文件信息
        self.fail_files = []
        # 存放压缩成功的文件数量
        self.success_files_count = 0
        # 存放需要压缩的文件地址
        self.compress_imgs = []
        # 文件压缩前的大小
        self.original_size = 0
        # 文件压缩后的大小
        self.mini_size = 0

    # 一个账号一个月500次 这里推荐可以多注册几个账号 万一其中一个而不可用的话可以使用下一个
    def get_one_key(self, *index):
        # 申请注册的keys
        my_api_keys = [
            'qJTgfv5C52yj2MVVwYddb4bjD96ZrtCd',
            '8kHQW7TdYvbTr67bhBJ9t3kNWDpTp0bQ'
        ]
        # 初始化使用第一个key
        if not index :
            index = self.api_key_index

        return my_api_keys[index]

    # 获取文件扩展名
    def get_file_ext(self, file_name):
        dot_pos = file_name.rfind('.')
        if dot_pos == -1:
            ext = ''
        else:
            ext = file_name[dot_pos+1:]

        return ext

    # 如果某个元素不存在列表内则追加该元素
    def append_list_element(self, data, ele='', cb=None):
        if ele not in data:
            data.append(ele)
            if cb and isinstance(cb, types.FunctionType):
                cb()
        pass

    # 如果列表中有某个元素则删除该元素
    def remove_list_element(self, data, ele='', cb=None):
        if ele in data:
            data.remove(ele)
            if cb and isinstance(cb, types.FunctionType):
                cb()
        pass

    # 压缩本地文件夹
    def compress_local(self):
        # 遍历文件 file_path 来源路径
        tinify.key = self.get_one_key()
        '''
            os.walk遍历一个目录内各个子目录和子文件,返回一个三元的tupple(dirpath, dirnames, filenames)

            root: 当前正在遍历的这个文件夹的本身的地址
            dirs: list ，内容是该文件夹中所有的目录的名字(不包括子目录)
            files: list , 内容是该文件夹中所有的文件(不包括子目录)
        '''
        for root, dirs, files in os.walk(self.file_path):
            # 遍历文件夹
            for file in files:
                newFilePath = os.path.join(root, file)
                # 获取文件名的扩展名
                fileName, fileSuffix = os.path.splitext(file)
                if fileSuffix not in ['.png', '.jpg']:
                    print('当前文件不支持转化 %s' % fileName)
                    return
                # 进行图片的压缩
                source = tinify.from_file(newFilePath)
                source.to_file(newFilePath)
                print(fileName, '已经压缩完成')

    # 网络图片压缩
    def compress_online(self):
        pass

    # 返回某个文件夹下的所有图片
    def get_local_dir_imgs(self, *root_path):
        # 第一次初始化为self.file_path
        if not root_path:
            root_path = self.file_path
        # 否则返回的是一个tuple 取第一个元素
        else:
            root_path = root_path[0]
        # 获取当前文件路径
        path = os.path.join(os.getcwd(), root_path)
        print("开始获取{}下所有文件信息...\n".format(path))
        for dir_or_file in sorted(os.listdir(path)):
            # 文件路径
            file_path = os.path.join(path, dir_or_file)
            # 判断是否为文件
            if os.path.isfile(file_path):
                fileSuffix = self.get_file_ext(file_path)
                # 如果是文件再判断是否jpg或者png结尾，不是则跳过本次循环
                if fileSuffix in ['jpg', 'png']:
                    # 进行图片压缩处理
                    self.append_list_element(self.compress_imgs, file_path)
                else:
                    continue
            # 如果是个dir，则再次调用此函数，传入当前目录，递归处理。
            elif os.path.isdir(file_path):
                self.get_local_dir_imgs(file_path)
            # 既不是文件夹也不是文件
            else:
                print('not file and dir ' + os.path.basename(file_path))

    # 多进程压缩本地图片
    def compress_local_dir_imgs(self):
        self.get_local_dir_imgs()
        self.multi_process_compress()

    # 传入本地文件地址进行压缩
    def compress_local_img(self, path):
        print('当前正在压缩', os.path.basename(path))
        # tinypng所需key
        tinify.key = self.get_one_key()
        # 压缩过程处理异常
        try:
            # 图片原始大小
            self.original_size = os.path.getsize(path) / 1024
            # tinypng
            source = tinify.from_file(path)
            source.to_file(path)
            # 压缩成功数量加一
            self.success_files_count += 1
            self.remove_list_element(self.fail_files, path)
            # 压缩后的体积
            self.mini_size = os.path.getsize(path) / 1024
            print('{}压缩成功,压缩前大小为{},压缩后大小为{}'.format(path, self.original_size, self.mini_size))

        # 如果key值无效 换一个key继续压缩
        except tinify.AccountError as e:
            self.append_list_element(self.fail_files, path)
            print("当前key可用次数不足,正在切换新的key")
            self.api_key_index += 1
            tinify.key = self.get_one_key(self.api_key_index)
            # 递归方法 继续读取
            self.compress_local_img(path)

        # 如果客户端出错
        except tinify.ClientError as e:
            self.append_list_element(path)
            print("请检查您的图片信息和请求参数%s" % e.message)

        # 如果服务端出错
        except tinify.ServerError as e:
            self.append_list_element(self.fail_files, path)
            print("Tinify服务异常请稍后再试%s" % e.message)
            # 递归方法 继续读取
            self.compress_local_img(path)

        # 如果网络出错
        except tinify.ConnectionError as e:
            self.append_list_element(self.fail_files, path)
            print("网络故障请稍后再试")
            time.sleep(1)
            # 递归方法 继续读取
            self.compress_local_img(path)

        # 其他错误
        except Exception as e:
            self.append_list_element(self.fail_files, path)
            print('压缩{}出错,错误信息{}'.format(os.path.basename(path), e))

    # 压缩失败的文件进行统一处理
    def handle_fail_files(self):
        print('压缩失败数量', len(self.fail_files))
        for img in self.fail_files:
            print('img', img)

    # 多进程进行图片压缩处理
    def multi_process_compress(self):
        # 填充进程
        pool = Pool(processes = 1)
        for path in self.compress_imgs:
            # 创建非阻塞进程
            pool.apply_async(self.compress_local_img, (path,))
        print("Started processes")
        # 记录开始时间
        st = time.time()
        pool.close()
        pool.join()
        # 记录结束
        et = time.time()
        # 打印处理时间
        print('多进程处理文件压缩成功,总耗时{}s'.format(et - st))


if __name__ == '__main__':
    TinyPng('待压缩的图片').compress_local_dir_imgs()
```