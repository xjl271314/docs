# 从开发到打包

**本文将分以下小节和大家分享「从本地的代码到云端可下载的安装包」这一路的风景，带你领略一路上的美(jian)好(nan)风(cuo)光(zhe)：**

- 第一节是关于目录结构的讨论，合适的目录结构会是一个良好的开端
- 第二节是之后几个小节的概述，阐述了怎么把这一整个过程分成多个环节，每个环节又大要做什么事
- 第三到七节分别详细描述了「配置」、「打包」、「代码签名」、「构建安装包」、「发行安装包」这几个环节要做哪些事，有什么讲究
- 第八节是简述一些可进一步研究或优化的点
- 附：这样设计的 `gulpfile` 文件结构

## 目录结构

以下目录结构供参考，没有很详细地展开，因为每个应用可能不同，最想表达的是这是一个「双 package.json 结构」，你可以看到根目录下有一个`package.json`，app目录下还有一个`package.json`。

![在这里插入图片描述](https://img-blog.csdnimg.cn/20200229111617874.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

这是因为，我们的应用在运行时需要一些第三方依赖，这些依赖我们需要打包到应用内，也就是说`/app/node_modules`目录内的内容是要被打包到应用内的，用户使用的时候才不会缺失「运行时依赖」，而如果我们只有一个`package.json`，那么所有的依赖都被下载和安装到同一个`node_modules`文件夹下，我们没法把我们需要打包进去的依赖树提取出来。

所以这样双 `package.json`的结构最清晰明了和简单易用，`dependencies`和`devDependencies`有了明确划分。

暂定待续....
