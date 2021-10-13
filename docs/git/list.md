# GIT 命令清单

- 2021.02.19

## Git最小配置

| 配置当前账户下所有仓库                          | 配置当前git仓库                                |
| :---------------------------------------------- | :--------------------------------------------- |
| git config --global user.name '你的git账户名称' | git config --local user.name '你的git账户名称' |
| git config --global user.email '你的Email'      | git config --local user.name '你的Email'       |

## 查看Git的配置

| 查看当前账户下所有仓库的配置项 | 查看当前git仓库的配置项   |
| :----------------------------- | :------------------------ |
| git config --global --list     | git config --local --list |

## 清除Git的配置

| 清除当前账户下所有仓库的配置项         | 清除当前git仓库的配置项               |
| :------------------------------------- | :------------------------------------ |
| git config --unset --global 某个配置项 | git config --unset --local 某个配置项 |

## 本地基本操作(一)

| 命令                           | 说明                                       |
| :----------------------------- | :----------------------------------------- |
| git status                     | 查看变更情况                               |
| git branch -v                  | 查看当前工作在哪个分支上                   |
| git checkout 分支名称          | 切换到指定的分支上                         |
| git add .                      | 暂存当前目录及目录下的所有变更到暂存区     |
| git add -A                     | 把仓库内所有变更都加入到暂存区             |
| git add 文件1 文件2 文件3      | 把指定的文件暂存到暂存区                   |
| git commit                     | 创建正式的commit                           |
| git diff 某个文件              | 比较某个文件工作区和暂存区的差异           |
| git diff --cached 某文件       | 比较某文件暂存区和 HEAD 的差异             |
| git diff HEAD 某文件           | 比较某文件工作区和 HEAD 的差异             |
| git diff                       | 比较工作区和暂存区的所有差异               |
| git diff --cached              | 比较暂存区和 HEAD 的所有差异               |
| git checkout 文件1 文件2 文件3 | 把工作区指定文件恢复成和暂存区一样         |
| git reset 文件1 文件2 文件3    | 把暂存区指定文件恢复成和 HEAD 一样         |
| git reset --hard               | 把暂存区和工作区所有文件恢复成和 HEAD 一样 |
| git difftool commitA commitB   | 用difftool比较任意两个commit之间的差异     |
| git is-files --others          | 查看哪些文件没被 git 管控                  |

## 加塞临时任务的处理

| 命令                        | 说明                               |
| :-------------------------- | :--------------------------------- |
| git stash                   | 把未处理完的变更先保存到 stash 中  |
| git stash pop               | 临时任务处理完后继续之前未完的工作 |
| git stash list              | 查看所有stash                      |
| git stash pop stash@{数字n} | 取回某次 stash 的变更              |

## 修改个人分支的历史

### 修改最后一次commit

1. 在工作区修改文件
2. git add .
3. git commit --amend

### 修改中间的commit(代号X)

1. git rebase -i X前面一个commit的id
2. 在工作区修改文件
3. git add .
4. git rebase --continue

后续可能需要处理冲突，直到rebase结束。

| 命令                            | 说明                                       |
| :------------------------------ | :----------------------------------------- |
| git log --oneline               | 当前分支各个commit 用一行显示              |
| git log -n                      | 显示就近的n个commit                        |
| git log --oneline --graph --all | 用图示显示所有分支的历史                   |
| git log 某个文件                | 查看涉及到某文件变更的所有commit           |
| git blame 某个文件              | 某文件各行最后修改对应的 commit 以及其作者 |

## 分支与标签

| 命令                                                                             | 说明                                   |
| :------------------------------------------------------------------------------- | :------------------------------------- |
| git branch 新分支                                                                | 基于当前分支创建新分支                 |
| git branch 新分支 已有分支                                                       | 基于指定分支创建新分支                 |
| git checkout -b 新分支 某个commit的ID                                            | 基于某个 commit 创建分支               |
| git checkout -b 新分支                                                           | 创建新的分支并切换到该分支             |
| git branch -v                                                                    | 列出本地分支                           |
| git branch -av                                                                   | 列出本地和远端分支                     |
| git branch -rv                                                                   | 列出远端所有分支                       |
| git branch -rv -l'某样式'                                                        | 列出名称符合某样式的远程分支           |
| git branch -d 拟删除分支                                                         | 安全删除本地分支                       |
| git branch -D 拟删除分支                                                         | 强行删除本地某分支                     |
| `git branch --merged master | grep -v '^\*\| master' | xargs -n 1 git branch -d` | 删除已合并到 master 分支的所有本地分支 |
| git remote prune origin                                                          | 删除远端 origin 已不存在的所有本地分支 |
| git tag 标签名 commitid的ID                                                      | 给commit打上标签                       |

## 两分支之间的集成

| 命令                   | 说明                                                  |
| :--------------------- | :---------------------------------------------------- |
| git merge A分支        | 把A分支合入到当前分支,且为 merge创建 commit           |
| git merge A分支 B分支  | 把A分支合入到B分支,且为 merge 创建commit              |
| git rebase B分支       | 把当前分支基于B分支做rebase,以便把B分支合入到当前分支 |
| git rebase B分支 A分支 | 把A分支基于B分支做rebase, 以便把B分支合入到A分支      |
| git mergetool          | 用mergetool解决冲突                                   |

## 和远端的交互

| 命令                                | 说明                                        |
| :---------------------------------- | :------------------------------------------ |
| git remote -v                       | 列出所有的remote                            |
| git remote add url地址              | 增加remote                                  |
| git remote remove remote的名称      | 删除remote                                  |
| git remote rename 旧名称 新名称     | 改变remote的name                            |
| git fetch remote                    | 把远端所有分支合标签的变更都拉到本地        |
| git pull remote名称 分支名          | 把远端分支的变更拉到本地,且 merge到本地分支 |
| git push remote名称 分支名          | 把本地分支 push 到远程                      |
| git push remote --delete 远端分支名 | 删除远端分支                                |
| git push remote 标签名              | 向远端提交指定标签                          |
| git push remote --tags              | 向远端提交所有标签                          |

## git删除中间某个commit

1. git log获取commit信息
2. git rebase -i (commit-id) commit-id 为要删除的commit的前一个commitId
3. 编辑文件，将要删除的commit之前的单词改为drop
4. 先按esc键退出 然后输入:wq进行保存
5. git push -f 强推到远程
6. 查看git log 检查是否有误
