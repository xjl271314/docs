# koa2中集成jwt认证

- 2020.04.16

## 定义

> json web token 简称JWT，是基于JSON的一种开放标准。服务器和客户端可以通过JWT来建立一座通信的桥梁。

`JWT`主要分为三部分。`header(头部)`，`payload(载体)`， `signature(签名)`。

- `header: 头部`: 声明加密方式和声明类型

- `payload: 载体`: 存放JWT定义的一些声明（例如：过期时间，签发者等等），我们将用户的一些信息存放在这里（例如：用户名，用户ID等，千万不要存在用户密码等敏感信息）

- `signature: 签名`: 

```
signature = [header(加密方式)](base64编码(header) + '.' + base64编码(payload), [服务器的私钥])
```

最后将上面三个组成部分用'.'连接起来就构成了JWT：

```
JWT = base64编码(header) + '.' + base64编码(payload) + '.' + signature
```

## 实现jwt认证

本示例是基于koa2实现的，默认你已安装koa2相关包。

1. 下载node-jsonwebtoken

```
npm i jsonwebtoken  // 一个实现jwt的包
```

2. 下载koa/jwt

```
npm i koa-jwt  //验证jwt的koa中间价
```

3. 修改app.js

```js
const Koa = require('koa')
const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')
const jwt = require('jsonwebtoken')
const jwtKoa = require('koa-jwt')
const util = require('util')
const verify = util.promisify(jwt.verify) // 解密
const secret = 'jwt demo'
const app = new Koa()
const router = new Router()

app.use(bodyParser())
app.use(jwtKoa({secret}).unless({
    path: [/^\/api\/login/], // 数组中的路径不需要通过jwt验证
    path: [/^\/api\/register/],
}))

router
    .post('/api/login', async (ctx, next) => {
        const user = ctx.request.body
        if(user?.name) {
            let userToken = {
                name: user.name
            }
            const token = jwt.sign(userToken, secret, {expiresIn: '2h'})  // token签名 有效期为2小时
            ctx.body = {
                message: '获取token成功',
                code: 1,
                token
            }
        } else {
            ctx.body = {
                message: '参数错误',
                code: -1
            }
        }
    })
    .get('/api/userInfo', async (ctx) => {
        const token = ctx.header.authorization  // 获取jwt
        let payload
        if (token) {
            payload = await verify(token.split(' ')[1], secret)  // // 解密，获取payload
            ctx.body = {
                payload
            }
        } else {
            ctx.body = {
                message: 'token 错误',
                code: -1
            }
        }
    })
app
    .use(router.routes())
    .use(router.allowedMethods())
app.listen(3000, () => {
    console.log('app listening 3000...')
})
```


