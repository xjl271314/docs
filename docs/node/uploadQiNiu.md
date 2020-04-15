# 使用Koa上传图片到七牛云

- 2020.04.15

```js
const path = require('path');
const os = require('os');
const fs = require('fs');
const moment = require('moment');

/**
 * 同步创建文件目录
 * @param  {string} dirname 目录绝对地址
 * @return {boolean}        创建目录结果
 */
function mkdirsSync(dirname) {
  if (fs.existsSync(dirname)) {
    return true
  } else {
    if (mkdirsSync(path.dirname(dirname))) {
      fs.mkdirSync(dirname)
      return true
    }
  }
};

/**
 * 获取上传文件的后缀名
 * @param  {string} fileName 获取上传文件的后缀名
 * @return {string}          文件后缀名
 */
function getSuffixName(fileName) {
  let nameList = fileName.split('.')
  return nameList[nameList.length - 1]
};

/**
 * 上传文件到本地
 * @param  {object} ctx     koa上下文
 * @param  {object} options 文件上传参数 fileType文件类型， path文件存放路径
 * @return {promise}         
 */
function uploadFile(ctx,filename) {
  let req = ctx.req
  let res = ctx.res
  
  //请求体格式不对 直接返回
  if (!/multipart\/form-data/i.test(req.headers['content-type'])) {
    return
  }
  let busboy = new Busboy({headers: req.headers})
  let fileType = filename || 'upload';
  //创建路径
  let filePath = path.join(
    __dirname,
    '../static',
    fileType,
    UtilDatetime.parseStampToFormat(null, 'YYYY/MM/DD')
  )
  let mkdirResult = mkdirsSync(filePath)
  
  return new Promise((resolve, reject) => {
    console.log('正在准备上传文件...')
    let result = {
      code: -1,
      success: false,
      message: '',
      data: null,
    }
    // 解析请求文件事件
    busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
      console.log('文件上传中...')
      let fileName = moment().format('YYYYMMDDHHmmSS') + Math.random().toString(16).substr(8) + '.' + getSuffixName(filename)
      let _uploadFilePath = path.join(filePath, fileName)
      let saveTo = path.join(_uploadFilePath)
      // 文件保存到制定路径
      file.pipe(fs.createWriteStream(saveTo))

      // 文件写入事件结束
      file.on('end', function () {
        result.code = 1;
        result.success = true
        result.message = '文件上传成功'
        result.data = {
          pictureUrl: `http://${ctx.host}/upload/${fileName}`,
          uploadTime:UtilDatetime.parseStampToFormat(null, 'YYYY-MM-DD')
        }
        console.log('文件上传成功！')
        resolve(result)
      })
    })

    // 解析结束事件
    busboy.on('finish', function () {
      console.log('文件上传结束')
      result.message = "文件上传结束"
      resolve(result)
    })


    // 解析错误事件
    busboy.on('error', function (err) {
      console.log('文件上出错')
      reject(result)
    })
    //将流链接到busboy对象
    req.pipe(busboy);
  })
};

/**
 * 上传文件到七牛云存储 2018-07-13
 * @param  {object}  文件信息
 * @return {object}  上传结果
 */
function uploadToQiNiu(filePath, key) {
    const accessKey = qiniuConfig.accessKey // 你的七牛的accessKey 
    const secretKey = qiniuConfig.secretKey // 你的七牛的secretKey 
    const mac = new qiniu.auth.digest.Mac(accessKey, secretKey)
    const options = {
        scope: qiniuConfig.scope // 你的七牛存储对象 
    }
    const putPolicy = new qiniu.rs.PutPolicy(options)
    const uploadToken = putPolicy.uploadToken(mac)
    const config = new qiniu.conf.Config()

    // 空间对应的机房 
    config.zone = qiniu.zone.Zone_z2
    const localFile = filePath
    const formUploader = new qiniu.form_up.FormUploader(config)
    const putExtra = new qiniu.form_up.PutExtra()
    console.log('正在上传到七牛云...')
    // 文件上传 
    return new Promise((resolved, reject) => {
        formUploader.putFile(uploadToken, key, localFile, putExtra, function (respErr, respBody, respInfo) {
            if (respErr) {
                reject(respErr)
            }
            if (respInfo && respInfo.statusCode == 200) {
                resolved(respBody)
                console.log('七牛云上传成功')
            }
        })
    })
};


module.exports = {
  uploadFile,
  uploadToQiNiu
};
```

实际使用的时候，前端上传类型需要是`form-data`。
```js
app.use(route.post('/upload', async function(ctx, next) {
 const serverPath = path.join(__dirname, './uploads/')
 // 获取上存图片
 const result = await uploadFile(ctx, {
  fileType: 'album',
  path: serverPath
 })
 const imgPath = path.join(serverPath, result.imgPath)
 // 上传到七牛
 const qiniu = await uploadToQiNiu(imgPath, result.imgKey)
 // 上存到七牛之后 删除原来的缓存图片
 removeTemImage(imgPath)
 ctx.body = {
  imgUrl: `http://xxxxx(你的外链或者解析后七牛的路径)/${qiniu.key}`
 }
}));

```