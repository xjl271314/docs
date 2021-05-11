# git merge 与 git rebase 的区别

- 2021.05.11

开发者在使用 `git` 的时候经常会在 `git merge` 和 `git rebase` 之间难以抉择,针对这个问题,我们来解析下到底什么场景下适用`merge`,什么场景下适用`rebase`。

## 共同点

首先,这两个命令都有着相同的目的——————**把不同分支的提交合并到一起**。但是他们的实现方式确实不一样的。

## git merge

我们先来看一下 `git merge`命令。

`merge` 是我们比较常用的 `git` 命令,当我们在创建分支进行测试、修复 bug，还是别的什么原因，经常都会需要把分支的提交 `merging` 到其它的分支上。常用的操作命令主要如下:

| 命令                    | 说明                                           |
| :---------------------- | :--------------------------------------------- |
| git merge A 分支        | 把 A 分支合入到当前分支,且为 merge 创建 commit |
| git merge A 分支 B 分支 | 把 A 分支合入到 B 分支,且为 merge 创建 commit  |

假如我们有个多人协作的项目,项目有个 `master` 分支 和一个开发的 `feature` 分支,在开发的分支上我们进行了多次 commit 的提交,与此同时远程的`master`分支上其他协作者也在进行推送。

![git merge 流程示例](https://img-blog.csdnimg.cn/20210511153604809.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

:::tip
其中蓝色的主线是`master`分支,其他的颜色是对应的`feature`分支。
:::

我们可以看到,当我们创建一个新分支,往`master`上推送一个 `merge请求` 的时候,都会往`master`上打一个`点`。当我们产生冲突的时候也只要解决一次冲突即可。

用一个比较生动的图来表示:

![merge流程示例](https://img-blog.csdnimg.cn/20210511160545379.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

### **因此,我们可以很容易的总结 merge 的部分特点:**

1. 只处理一次冲突.
2. 引入了一次合并的历史记录，合并后的所有 commit 会按照提交时间从旧到新排列.
3. 所有的过程信息更多，可能会提高之后查找问题的难度.

:::tip
为什么说 `git merge` 提交的信息过多可能会影响查找问题的难度呢？

因为在一个大型项目中，单纯依靠 `git merge` 方法进行合并，会保存所有的提交过程的信息：`引出分支`，`合并分支`，在分支上再引出新的分支等等，类似这样的操作一多，提交历史信息就会显得杂乱，这时如果有问题需要查找就会比较困难了。
:::

## git rebase

接着我们来看一下 `git rebase` 命令,这个命令在大项目的合作流程上非常有用。

![git rebase 流程示例](https://img-blog.csdnimg.cn/20210511154829918.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

直观的感受上我们会发现,git 的流水线变得更加清晰了。每个`feature`分支的提交都相对独立,是一个完整的功能单元。

这里我们没有展示在基于`master`分支的 A 节点创建了`feature`分支后,遇到`master`分支更新后,去执行`feature`分支的`变基`操作这一流程,我们可以通过下图去展示此流程:

![rebase流程示例](https://img-blog.csdnimg.cn/20210511161202788.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

从上图我们可以清楚的看到, `rebase`具有以下的几个特点:

1. 当`master`分支变更后, `rebase`操作会改变当前分支从 `master` 上拉出分支的位置。
2. 执行`rebase`后没有多余的合并历史的记录，此操作也导致了合并后的 `commit` 顺序不一定按照 `commit` 的提交时间排列。
3. 可能会多次解决同一个地方的冲突（有 `squash` 来解决，比如多个`commit`修改同一个文件导致的冲突解决）。
4. 分支的流水线更加清爽一些，`master` 分支上每个 `commit` 点都是相对独立完整的功能单元,不会像`merge`的时候每次打一个点。

## git rebase 示例

为了更加深入的理解`rebase`的流程,我们来拿一个实际的项目进行演示:

为了脱敏,项目地址这里不放出来了,只放置项目的更新流程:

### 1. 创建项目

在 github 上创建一个`git-rebase-demo`的项目,并进行初始化操作。

创建后的项目如下所示:

![package.json](https://img-blog.csdnimg.cn/20210511165556566.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

接着我们新建一个`index.js`并且添加一个 `demo1` 方法:

![index.js](https://img-blog.csdnimg.cn/20210511170003644.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

接着我们将项目进行提交,推送到远端,打开下载好的`Source Tree`可视化工具,我们可以看到第一次的提交历史。

![init](https://img-blog.csdnimg.cn/20210511170157796.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

### 2. 基于 master 创建一个 feature1 分支

接下来我们新建一个`feature1`分支,并添加一个`feature1`方法和`README.md`更新并进行提交。

![index.js](https://img-blog.csdnimg.cn/20210511170631553.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

![readme.md](https://img-blog.csdnimg.cn/20210511170819234.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

提交后我们把`feature1`分支 `merge`到 `master`分支上,看一下流:

![add feature1](https://img-blog.csdnimg.cn/20210511171020291.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

### 3. 基于 master 创建一个 feature2 分支

当我们提交`feature1`到 `master` 后,接下来我们基于`master`分支新建一个`feature1`分支,并添加一个`feature2`方法和`README.md`更新并进行提交。

![index.js](https://img-blog.csdnimg.cn/20210511171705717.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

提交后的 git 流如下:

![add feature2](https://img-blog.csdnimg.cn/20210511171818353.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

### 4. 在 master 分支上进行更新,模拟其他分支合并的场景

这步比较关键,在 `master` 分支上增加一个方法，注意此代码的行数会和`feature2`上的代码冲突。

![index.js](https://img-blog.csdnimg.cn/20210511171459883.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

接下来,我们在`feature2`分支上同步远程的`master`,模拟在上线前同步远程的变基操作:

```bash
git checkout feature2
git pull origin master --rebase
```

![git rebase](https://img-blog.csdnimg.cn/20210511172258782.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

我们可以看到,由于`index.js`文件远程和该分支都进行了修改,这里产生了冲突,需要手动进行解决。而且在控制台也给出了我们执行`rebase`的命令。

:::tip
当我们只有一个 `commit` 冲突的时候,我们只要解决该 `commit` 的冲突即可。

当我们有多个 `commit` 冲突的时候,我们需要一次又一次的解决冲突，并使用`git rebase --continue`命令进行后续的变基操作。

**当然如果想要放弃变基,我们只需要执行`git rebase --abort`即可。**
:::

这里为了模拟多次 commit 冲突的情况,我们先执行`git rebase --abort`取消变基。

### 5. 基于 master 创建一个 feature3 分支

为了模拟多次冲突解决,我们基于`master`分支上继续创建一个 `feature3`分支进行修改。

![feature3](https://img-blog.csdnimg.cn/20210511173430921.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

我们看一下修改后的流:

![git](https://img-blog.csdnimg.cn/20210511173641442.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

### 5. 切回我们的开发分支 feature2 同步 master 变基

接下来,假设我们需要上线`feature2`分支了,此时这时候 `master` 上已经领先了我们两个版本,我们继续执行之前未完成的变基操作。

```bash
git checkout feature2
git pull origin master --rebase
```

![第一次变基](https://img-blog.csdnimg.cn/20210511174051431.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

![第二次变基](https://img-blog.csdnimg.cn/20210511174520571.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

合并`feature2`分支到`master`分支上。

![合并后的流](https://img-blog.csdnimg.cn/20210511174733734.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

我们可以看到,采用`rebase`变基后的分支非常的清晰。

## git merge 示例

这里我们详细的展示了`rebase`变基后的流,那么关于`merge`的方式,通过上述的描述,大家能清晰的给出`merge`方式后的流表现么?

## 总结

到这里,想必大家对流程上两者的区别已经比较清楚了,如何去使用,我们再简单做下总结:

:::tip

- **git merge**

1. 当需要保留详细的合并信息的时候建议使用 git merge，特别是需要将分支合并进入 master 分支时；

- **git rebase**

1. 多人合作大型项目保持流清晰,方便回退。
2. 当发现自己修改某个功能时，频繁进行了 git commit 提交时，发现其实过多的提交信息没有必要时，可以尝试 git rebase。
   :::
