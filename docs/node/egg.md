# Egg.js入门到精通

- 2020.4.24

## 基础知识

> `Egg.js`是由`koa`扩展而来的,添加了多进程的支持,并且参考了 `Ruby On Rails` 的设计哲学,已约定优先的配置。

- `app/router.js`: 路由映射配置;
- `app/controller`: 存放控制器的目录,用来处理跳转相关的逻辑;
- `app/service`: 用来存放业务逻辑;
- `app/middleware`: 存放中间件的目录;
- `app/public`: 存放静态文件的目录;
- `app/extends`: 扩展框架目录,比如在ctx上添加一些变量方法等;
- `config`: 配置目录、中间件的配置项、环境配置变量等;
- `test`: 测试文件目录;
- `app.js`: 可以在该文件内添加启动钩子;

## 实现egg-core

`Egg.js`能够保持这些约定，得益于`egg-core`中的各种`loader`，比如`context_loader`、`file_loader`.


### 初始化项目

```
mkdir egg-core && cd egg-core && npm init -y
```

### 安装依赖

```
npm i koa globby
```

### egg.js

```js
const {
    resolve,
    join,
    parse
} = require('path');
const globby = require('globby');

module.exports = app => {
    const AppPath = resolve(__dirname, 'app');
    const context = app["context"];

    const fileAbsolutePath = {
        config: join(AppPath, 'config'),
        middleware: join(AppPath, 'middleware'),
        service: join(AppPath, 'service')
    };

    Object.keys(fileAbsolutePath).forEach(v => {
        const path = fileAbsolutePath[v];
        const prop = v;
        const files = globby.sync('**/*.js', {
            cwd: path
        });
        if (prop !== 'middleware') {
            context[prop] = {};
        }


        files.forEach(file => {
            const fileName = parse(file).name;
            const content = require(join(path, file));
            // middleware处理
            if (prop === 'middleware') {
                if (fileName in context['config']) {
                    const plugin = content(context['config'][fileName]);
                    app.use(plugin);
                }
                return;
            }
            // 配置文件处理
            if (prop === 'config' && content) {
                context[prop] = Object.assign({}, context[prop], content);
                return;
            }
            // 挂载service
            context[prop][fileName] = content;
        });
    });
}
```

### index.js

```js
const Koa = require('koa');
const init = require('./egg');

const app = new Koa();

init(app);

app.use(async (ctx, next) => {
    console.log(ctx.service);
    console.log(ctx.config);
    ctx.type = 'application/json';
    ctx.body = ctx.service.user.getUser();
});

app.listen(4000);

```

### app

- config

- middleware

- service

## 使用egg-init


### 安装egg-init

```
npm i egg-init -g
```

### 初始化项目

```
egg-init my-first-egg-project --type=simple
```

### 安装并运行

```
cd my-first-egg-proje && npm install
npm run dev
```

## egg-init的原理

模板类的脚手架的原理就是从网络或者本地下载模板，然后进行模板变量替换，替换完成后放在用户想要的位置就可已了。这个用户想要的位置可以通过命令行来指定，所以通常还是需要一个命令行解析工具。

官方的`egg-init`复制文件与模板替换功能是通过`mem-fs`、`mem-fs-editor`来实现内存中的复制和修改的，而命令行解析是通过`yargs`来实现的。

## 实现egg-cluster

实现一个多进程的HTTP服务,并且添加热重启功能。

复制egg-core的代码 修改为egg-cluster

### 安装依赖

```
npm i cfork chokidar cluster-reload
```

### cluster.js

```


```
