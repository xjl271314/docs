# GitLab CI Pipeline框架

- 2020.05.20

本文将会介绍一些跟`GitLab CI`流程相关的知识,方便大家对CI/CD流程的熟悉,设计适合自己项目的流程。

## CI/CD 工作流程

![CI/CD 工作流程](https://img-blog.csdnimg.cn/20200520181143980.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

## Gitlab CI

> `GitLab CI` 是 `GitLab`内置的进行持续集成的工具，在你安装好 `GitLab` 之后，即同时安装了 `GitLab CI`。只需要在仓库根目录下创建 `.gitlab-ci.yml` 文件，并配置`GitLab Runner`；每次提交的时候，`gitlab`将自动识别到`.gitlab-ci.yml`文件，并且使用`Gitlab Runner`执行该脚本。


## Gitlab Runner

> `GitLab Runner` 是用来执行`.gitlab-ci.yml` 脚本的工具，从 `GitLab CI` 中获取到任务，并按其要求完成任务的执行。可以理解成，`Runner`就像认真工作的工人，`GitLab-CI`就是管理工人的中心，所有工人都要在 `GitLab-CI` 里面注册，并且表明自己是为哪个项目服务。当相应的项目发生变化时，`GitLab-CI` 就会通知相应的工人执行对应的脚本。


:::tip

`Runner`负责执行`.gitlab-ci.yml`文件中定义的`job`，可以是`虚拟机`、`vps`、`裸机`、`docker容器`或`容器集群`。

`GitLab Runner` 是由Go语言编写的,可以运行在 `GNU/Linux`, `macOS` 和 `Windows`上。

如果我们项目中需要使用到`Docker`的话,最低版本的 `Docker` 需要 `v1.13.0`。

我们可以在项目的`Settings-->CI/CD-->Runners`页面可以查看到是否有可用的`Runner`。
:::

### Runner类型

`GitLab-Runner` 可以分类两种类型：`Shared Runner（共享型）`和 `Specific Runner（指定型）`。

1. `Shared Runner`：所有工程都能够用的，且只有`系统管理员`能够创建。

2. `Specific Runner`：只有特定的项目可以使用。


### Runner安装

以`macOs`为例子,完整的安装地址参考:[官方下载地址](https://docs.gitlab.com/runner/install/)

- 方式1
```ssh
sudo curl --output /usr/local/bin/gitlab-runner https://gitlab-runner-downloads.s3.amazonaws.com/latest/binaries/gitlab-runner-darwin-amd64

sudo chmod +x /usr/local/bin/gitlab-runner

cd ~
gitlab-runner install
gitlab-runner start
```

- 方式2

```ssh
brew install gitlab-runner

brew services start gitlab-runner
```

### 获取Runner注册Token

安装好`Runner`之后，需要向`Gitlab`进行注册，注册`Runner`需要 `GitLab-CI` 的 `url` 和 `token`。可根据需求注册选择所需类型`Runner`。

- 获取`Shared Runner注册Token`：

使用管理员用户登录，进入`Admin Area->OverView->Runners`界面。

![图片地址](https://imgconvert.csdnimg.cn/aHR0cHM6Ly91c2VyLWdvbGQtY2RuLnhpdHUuaW8vMjAxOS83LzI5LzE2YzNjZWVkMTM5OGRjZjg)

- 获取`Specific Runner注册Token`：

进行项目仓库->settings->CI/CD界面

![图片地址](https://imgconvert.csdnimg.cn/aHR0cHM6Ly91c2VyLWdvbGQtY2RuLnhpdHUuaW8vMjAxOS83LzI5LzE2YzNjZWVmZmFkYTc4NWI)


### 注册Runner

完整的注册文档请参见[官方注册文档](https://docs.gitlab.com/runner/register/)

执行 `gitlab-ci-multi-runner register`命令进行 `Runner注册`，期间会用到前期获取的url及token；注册完成之后，`GitLab-CI`就会多出一条`Runner记录`。

![图片地址](https://imgconvert.csdnimg.cn/aHR0cHM6Ly91c2VyLWdvbGQtY2RuLnhpdHUuaW8vMjAxOS83LzI5LzE2YzNjZWYzZDVmZmI5MTA)

## gitlab-ci.yml(配置文件)

> 从`7.12`版本开始，`GitLab CI`使用`YAML`文件(`.gitlab-ci.yml`)来管理项目配置。该文件存放于项目`仓库的根目录`，并且包含了你的项目如何被编译的描述语句。`YAML`文件使用一系列约束叙述定义了Job启动时所要做的事情。

通过配置`gitlab-ci.yml`文件我们可以定义`Pipeline`的结构和执行顺序。


### 关键字及含义

| 关键字 | 含义
| :---  | :---
| `before_script` | 定义任何 Jobs 运行前都会执行的命令。
| `after_script`  | 定义任何 Jobs 运行完后都会执行的命令。（要求 GitLab 8.7+ 和 GitLab Runner 1.2+）
| `variables  && Job.variables` | 定义环境变量。如果定义了 Job 级别的环境变量的话，该 Job 会优先使用 Job 级别的环境变量。（要求 GitLab Runner 0.5.0+）
| `cache && Job.cache` | 定义需要缓存的文件。每个 Job 开始的时候，Runner 都会删掉 .gitignore 里面的文件。如果有些文件 (如 node_modules/) 需要多个 Jobs 共用的话，我们只能让每个 Job 都先执行一遍 npm install。（要求 GitLab Runner 0.7.0+）
| `Job.scrip` | 定义 Job 要运行的命令，必填项
| `Job.stage` | 定义 Job 的 stage，默认为 test
| `Job.artifacts` | 定义 Job 中生成的附件。当该 Job 运行成功后，生成的文件可以作为附件 (如生成的二进制文件) 保留下来，打包发送到 GitLab，之后我们可以在 GitLab 的项目页面下下载该附件。


### 工作流程

![工作流程](https://www.chenshaowen.com/blog/images/2017/11/cicd_pipeline_infograph.png)

## Pipeline(管道)

完整的 `pipeline` 配置可以参考[官方文档](https://docs.gitlab.com/ee/user/project/pipelines/schedules.html)
> `PipeLine` 即流水线是持续集成、发布、部署的最顶层的组件。由 `Stage` 和 `Job` 组成，由`.gitlab-ci.yml`来定义。按触发模式可分为：`自动触发`和`人工触发`。

一次 `Pipeline` 其实相当于一次构建任务，里面可以包含多个流程，比如`自动构建`、`自动进行单元测试`、`自动进行代码检查`等流程 ;

任何提交或者 `Merge Request` 的合并都可以触发 `Pipeline` ;

### 自动触发

- 定时触发

比如我们可以通过配置[Pipeline schedules API](https://docs.gitlab.com/ee/api/pipeline_schedules.html)在每天的0:00进行一次操作。

创建一个新的项目管道计划。

```
POST /projects/:id/pipeline_schedules
```

| 属性 | 类型 | 需要 | 描述
|:---|:---|:---|:----
| `id`	            | int / string    | 是	  |  经过身份验证的用户拥有的项目的ID或URL编码路径
| `description`	    | string	        | 是	| 管道进度表的描述
| `ref`	            | string	        | 是	| 分支/标签名称将被触发
| `cron`	        | string	        | 是	| cron（例如0 1 * * *）（Cron语法）
| `cron_timezone`	| string	        | 否   |	所支持的时区ActiveSupport::TimeZone（如Pacific Time (US & Canada)）（默认值：'UTC'）
| `active`	        | boolean	     | 否  |	管道计划的激活。如果假设置，管道计划将首先停用（默认值：true）

```
curl --request POST --header "PRIVATE-TOKEN: k5ESFgWY2Qf5xEvDcFxZ" --form description="Build packages" --form ref="master" --form cron="0 0 * * *" --form cron_timezone="UTC" --form active="true" "https://gitlab.example.com/api/v4/projects/29/pipeline_schedules"
```

执行结果:

```json
{
    "id": 14,
    "description": "Build packages",
    "ref": "master",
    "cron": "0 0 * * *",
    "cron_timezone": "UTC",
    "next_run_at": "2020-05-21T00:00:00.000Z",
    "active": true,
    "created_at": "2020-05-20T13:43:08.169Z",
    "updated_at": "2020-05-20T13:43:08.169Z",
    "last_pipeline": null,
    "owner": {
        "name": "Administrator",
        "username": "root",
        "id": 1,
        "state": "active",
        "avatar_url": "http://www.gravatar.com/avatar/e64c7d89f26bd1972efa854d13d7dd61?s=80&d=identicon",
        "web_url": "https://gitlab.example.com/root"
    }
}
```

- `Merge请求`触发

> 此功能在`GitLab 11.6`版本中引入。

在基础配置中,每次提交一个更改到分支的时候,GitLab都会运行一个管道。要在merge的时候触发需要配置CI/CD配置文件。


例如使用`only`或`except`运行管道以进行合并请求:

```yml
build:
  stage: build
  script: ./build
  only:
  - master

test:
  stage: test
  script: ./test
  only:
  - merge_requests

deploy:
  stage: deploy
  script: ./deploy
  only:
  - master
```
:::warning
使用此方法时，必须`only: - merge_requests`为每个作业指定。

在此示例中，管道包含`test`配置为在合并请求上运行的作业,在`build`与`deploy`工作没有`only: - merge_requests`参数，所以他们不会合并请求运行。
:::


### 人工触发

手动去触发打包

## Stages

> `stages` 表示构建阶段,一个 `Pipeline` 中可以定义多个 `stage`,包括了 `build`、`test` 和 `deploy`等阶段。

**stages有如下特点 :**

- 所有 `stages` 会按照顺序运行，即当一个 `stage` 完成后，下一个 `stage` 才会开始

- 只有当所有 `stages` 成功完成后，该构建任务 (`Pipeline`) 才算成功

- 如果任何一个 `stage` 失败，那么后面的 `stages` 不会执行，该构建任务 (`Pipeline`) 失败

```yml
stages:
  - build
  - test
  - deploy

job 1:
  stage: build
  script: make build dependencies

job 2:
  stage: build
  script: make build artifacts

job 3:
  stage: test
  script: make test

job 4:
  stage: deploy
  script: make deploy
```
### Stages执行顺序

![Stages执行顺序](https://imgconvert.csdnimg.cn/aHR0cHM6Ly91c2VyLWdvbGQtY2RuLnhpdHUuaW8vMjAxOS83LzI5LzE2YzNjZjAzOTY1MzVkM2M)

以图中所示为例，整个 CI 环节包含三个 Stage：`build、test 和deploy`。

- `build` 被首先执行。如果发生错误，本次 CI 立刻失败；

- `test` 在 build 成功执行完毕后执行。如果发生错误，本次 CI 立刻失败；

- `deploy` 在 test 成功执行完毕后执行。如果发生错误，本次 CI 失败。


## Jobs

> `Job`是 `.gitlab-ci.yml` 文件中最基本的元素，表示某个`stage`里面执行的工作。一个`stage`中用户可以创建任意个任务；每个任务必须有一个独一无二的名字，但有一些保留 `keywords` 不能用于`Job`名称。

**保留关键字**:

- `image`，
- `services`，
- `stages`，
- `types`，
- `before_script`，
- `after_script`，
- `variables`，
- `cache`，
- `include`。


`Job`被定义为`顶级元素`，并且至少包括一条`script`语句，如果一个 `Job` 没有显式地关联某个 `Stage`，则会被默认关联到 `test Stage`。

**jobs有如下特点 :**

- 相同 `stage` 中的`jobs` 会并行执行

- 相同 `stage` 中的 `jobs` 都执行成功时，该 `stage` 才会成功

- 如果任何一个`job` 失败，那么该 `stage` 失败，即该构建任务 (`Pipeline`) 失败


### Job执行流程

![在这里插入图片描述](https://img-blog.csdnimg.cn/20200520181121774.png)

![Job执行流程](https://img-blog.csdnimg.cn/20200520181035314.png)


## Script

> `script`是一段由`Runner`执行的`shell`脚本。

```yml
job:
  script:
    - uname -a
    - bundle exec rspec
```

## image and services

> 这两个选项允许开发者指定任务运行时所需的自定义的docker镜像和服务。

```yml
#为每个作业定义不同的映像和服务
test:2.1:
  image: ruby:2.1
  services:
  - postgres:9.3
  script:
  - bundle exec rake spec

test:2.2:
  image: ruby:2.2
  services:
  - postgres:9.4
  script:
  - bundle exec rake spec
```

## before_script和after_script

> `before_script`是用于定义一些在所有任务执行前所需执行的命令, 包括部署工作，可以接受一个数组或者多行字符串。`after_script`用于定义所有job执行过后需要执行的命令，可以接受一个数组或者多行字符串。

```yml
#定义全局 before_script:
default:
  before_script:
    - global before script
#覆盖全局before_script
job:
  before_script:
    - execute this instead of global before script
  script:
    - my command
  after_script:
    - execute this after my script

```

## 配置示例

```yml
before_script:
  # 激活 nodeenv 虚拟环境
  - source /data/gitlab-runner/paas-webfe/bin/activate
  # 查看 node 版本
  - which node && node --version
  # 为了能方便使用 npm ，给它取一个别名
  - alias npm="/data/gitlab-runner/node/bin/npm"
  - which npm && npm --version

stages:
  - build

build-test-webpack:
  variables:
    # 需要修改为项目的 GitLab 地址格式 
    CI_REPOSITORY_URL:
      http://$GIT_USERNAME:$GIT_PASSWORD@gitlab.xxx.com/$CI_PROJECT_PATH.git
    # 打包生成的文件存放目录
    OUT_PUT_DIR:
      test
  stage: build
  # 允许在 GitLab 页面上，直接下载 $OUT_PUT_DIR 内容
  artifacts:
    paths:
      - $OUT_PUT_DIR
  # 没有 Git 版本的文件，设置缓存，可以避免每次 npm install 重复安装
  cache:
    untracked: true
  script:
    # 开始执行打包编译命令，并提交到当前的 Git 仓库，具体的命令，需要根据项目编写，也可以放在一个 shell 文件，执行
    - echo "start build test"
    - rm -rf  $CI_PROJECT_NAME $OUT_PUT_DIR
    - cd ./webpack && tnpm install && tnpm run build-test && cd ..
    - git clone $CI_REPOSITORY_URL
    - rm -rf $CI_PROJECT_NAME/$OUT_PUT_DIR && cp -r $OUT_PUT_DIR $CI_PROJECT_NAME/
    - cd $CI_PROJECT_NAME
    - git add $OUT_PUT_DIR
    - git status >> build.log
    - date >> build.log
    - git add build.log
    - git commit -m "auto build-test[ci skip]"
    - git push $CI_REPOSITORY_URL master
    - echo "end build test"
```