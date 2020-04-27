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




