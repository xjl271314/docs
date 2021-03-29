# 微信小程序插件开发

- 2021.03.15

> 小程序插件，是可被添加到小程序内直接使用的功能组件。开发者可以像开发小程序一样开发一个插件，供其他小程序使用。同时，小程序开发者可直接在小程序内使用插件，无需重复开发，为用户提供更丰富的服务。

:::tip
一个小程序只能开发一个插件。
:::

## 插件开发接入流程

1. 开通插件功能
2. 填写开发信息并开发
3. 完善基本信息
4. 提交审核、发布
5. 管理插件使用申请

### 开通插件功能

小程序开发者无需重新注册帐号，可直接在小程序管理后台开通插件功能，完成基本信息填写后完成开通。

> 开通入口：小程序管理后台-小程序插件

![开通插件功能-1](https://img-blog.csdnimg.cn/20210315145509995.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

填写插件基本信息，插件的基本信息将在插件申请流程、小程序基本信息页中展示。

![开通插件功能-2](https://img-blog.csdnimg.cn/20210315145608828.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

### 填写开发信息并完成开发

设置插件的服务器域名及`Token`信息后，即可在开发者工具中开发插件。

![开通插件功能-3](https://img-blog.csdnimg.cn/20210315151906654.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

### 提交审核、发布

插件在提交审核前，请确认已设置插件名称、插件头像、插件简介等信息，并已上传插件开发文档，便于开发者接入插件。


### 管理插件使用申请

开发者可在”小程序管理后台-小程序插件-申请管理“内处理插件的接入申请。插件开发者可在24小时内选择”通过“或”拒绝“申请方使用插件。

![开通插件功能-4](https://img-blog.csdnimg.cn/20210315152203808.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

## 插件开发流程

### 创建插件项目

插件类型的项目可以在开发者工具中直接创建。这里使用到的`AppID`是和微信小程序采用同一个ID。

![创建插件项目](https://img-blog.csdnimg.cn/20210315153427637.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

新建插件类型的项目后，如果创建示例项目，则项目中将包含三个目录：

- `plugin 目录`：插件代码目录。
- `miniprogram 目录`：放置一个小程序，用于调试插件。
- `doc 目录`：用于放置插件开发文档。

:::tip
`miniprogram` 目录内容可以当成普通小程序来编写，用于插件调试、预览和审核。下面的内容主要介绍 plugin 中的插件代码及 doc 中的插件开发文档。

由于插件需要 appid 才能工作，这里的appid需要和小程序的一致,具体书写的位置如下图所示,在`miniprogram/app.json`中进行添加。
:::

![小程序插件](https://img-blog.csdnimg.cn/20210315155221248.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

### 插件目录结构

一个插件可以包含若干个自定义组件、页面，和一组 js 接口。插件的目录内容如下：

![目录结构](https://img-blog.csdnimg.cn/2021031516030820.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

### 插件配置文件

向使用者小程序开放的所有自定义组件、页面和 js 接口都必须在插件配置文件 `plugin.json` 列出，格式如下：

```json
{
  "publicComponents": {
    "hello-component": "components/hello-component"
  },
  "pages": {
    "hello-page": "pages/hello-page"
  },
  "main": "index.js"
}
```

这个配置文件将向使用者小程序开放一个自定义组件 `hello-component`，一个页面 `hello-page` 和 `index.js` 下导出的所有 js 接口。

### 进行插件开发

:::warning
请注意：在插件开发中，只有 [`部分接口`](https://developers.weixin.qq.com/miniprogram/dev/framework/plugin/api-limit.html) 可以直接调用；另外还有`部分能力（如 获取用户信息 和 发起支付 等）`可以通过 [`插件功能页`](https://developers.weixin.qq.com/miniprogram/dev/framework/plugin/functional-pages.html) 的方式使用。
:::

**插件功能页**:

插件功能页从小程序基础库版本 `2.1.0` 开始支持。

某些接口不能在插件中直接调用（如 wx.login），但插件开发者可以使用插件功能页的方式来实现功能。目前，插件功能页包括：

- 获取用户信息，包括 openid 和昵称等（相当于 wx.login 和 wx.getUserInfo 的功能），详见 用户信息功能页；
- 支付（相当于 wx.requestPayment），详见 支付功能页；
- 获取收货地址（相当于 wx.chooseAddress），详见 收货地址功能页。
- 获取发票抬头（相当于 wx.chooseInvoiceTitle），详见 发票抬头功能页。
- 获取发票（相当于 wx.chooseInvoice），详见 发票功能页。

要使用插件功能页，需要先激活功能页特性，配置对应的功能页函数，再使用 `functional-page-navigator` 组件跳转到插件功能页，从而实现对应的功能

### 自定义组件

插件可以定义若干个自定义组件，这些自定义组件都可以在插件内相互引用。但提供给使用者小程序使用的自定义组件必须在配置文件的 publicComponents 段中列出。

除去接口限制以外，自定义组件的编写和组织方式与一般的自定义组件相同，每个自定义组件由 wxml, wxss, js 和 json 四个文件组成。

### 页面

插件从小程序基础库版本 2.1.0 开始支持页面。插件可以定义若干个插件页面，可以从本插件的自定义组件、其他页面中跳转，或从使用者小程序中跳转。所有页面必须在配置文件的 pages 段中列出。

除去接口限制以外，插件的页面编写和组织方式与一般的页面相同，每个页面由 wxml, wxss, js 和 json 四个文件组成。具体可以参考其他关于页面的文档。

插件执行页面跳转的时候，可以使用 `navigator` 组件。当插件跳转到自身页面时， url 应设置为这样的形式：`plugin://PLUGIN_APPID/PATH/TO/PAGE` 。需要跳转到其他插件时，也可以这样设置 url 。

```wxml
<navigator id="nav" url="plugin://weather/index">
    今天天气好晴朗。
</navigator>
```

### 接口

插件可以在接口文件（在配置文件中指定，详情见上文）中 export 一些 js 接口，供插件的使用者调用，如：

```js
module.exports = {
  hello: function() {
    console.log('Hello plugin!')
  }
}
```

## 插件预览、上传和发布

插件可以像小程序一样预览和上传，但插件没有体验版。

插件会同时有多个线上版本，由使用插件的小程序决定具体使用的版本号。

手机预览和提审插件时，会使用一个特殊的小程序来套用项目中 `miniprogram` 文件夹下的小程序，从而预览插件。

- （建议的方式）如果当前开发者有 测试号，则会使用这个测试号；在测试号的设置页中可以看到测试号的 appid 、 appsecret 并设置域名列表。

- 否则，将使用“插件开发助手”，它具有一个特定的 appid 。

## 插件开发文档

在使用者小程序使用插件时，插件代码并不可见。因此，除了插件代码，我们还支持插件开发者上传一份插件开发文档。这份开发文档将展示在插件详情页，供其他开发者在浏览插件和使用插件时进行阅读和参考。插件开发者应在插件开发文档中对插件提供的自定义组件、页面、接口等进行必要的描述和解释，方便使用者小程序正确使用插件。

插件开发文档必须放置在插件项目根目录中的 doc 目录下，目录结构如下：

![在这里插入图片描述](https://img-blog.csdnimg.cn/20210315165501721.png)

其中，`README.md` 的编写有一定的 限制条件，具体来说：

1. 引用到的图片资源不能是网络图片，且必须放在这个目录下；
2. 文档中的链接只能链接到：
    - 微信开发者社区（developers.weixin.qq.com）
    - 微信公众平台（mp.weixin.qq.com）
    - GitHub（github.com）

编辑 `README.md` 之后，可以在开发者工具左侧资源管理器的文件栏中右键单击 README.md，并选择上传文档。发布上传文档后，文档不会立刻发布。此时可以使用帐号和密码登录 管理后台 ，在 小程序插件 > 基本设置 中预览、发布插件文档。

:::warning
**插件文档总大小不能大于 2M，超过时上传将返回错误码 80051**。
:::

## 注意事项

### 1. 插件间互相调用

插件不能直接引用其他插件。但如果小程序引用了多个插件，插件之间是可以互相调用的。

对于 js 接口，可使用 `requirePlugin` ，但目前尚不能在文件一开头就使用 `requirePlugin` ，因为被依赖的插件可能还没有初始化，请考虑在更晚的时机调用 `requirePlugin` ，如接口被实际调用时、组件 `attached` 时。（未来会修复这个问题。）

## 插件使用

### 添加插件

在使用插件前，首先要在小程序管理后台的“设置-第三方服务-插件管理”中添加插件。开发者可登录小程序管理后台，通过 appid 查找插件并添加。如果插件无需申请，添加后可直接使用；否则需要申请并等待插件开发者通过后，方可在小程序中使用相应的插件。

### 引入插件代码包

使用插件前，使用者要在 `app.json` 中声明需要使用的插件，例如：

```json
{
  "plugins": {
    "myPlugin": {
      "version": "1.0.0",
      "provider": "wxidxxxxxxxxxxxxxxxx"
    }
  }
}
```

如上例所示， plugins 定义段中可以包含多个插件声明，每个插件声明以一个使用者自定义的插件引用名作为标识，并指明插件的 appid 和需要使用的版本号。其中，引用名（如上例中的 myPlugin）由使用者自定义，无需和插件开发者保持一致或与开发者协调。在后续的插件使用中，该引用名将被用于表示该插件。

### 在分包内引入插件代码包

如果插件只在一个分包内用到，可以将插件仅放在这个分包内，例如：

```json
{
  "subpackages": [
    {
      "root": "packageA",
      "pages": [
        "pages/cat",
        "pages/dog"
      ],
      "plugins": {
        "myPlugin": {
          "version": "1.0.0",
          "provider": "wxidxxxxxxxxxxxxxxxx"
        }
      }
    }
  ]
}
```

**在分包内使用插件有如下限制**:

- 仅能在这个分包内使用该插件；
- 同一个插件不能被多个分包同时引用；
- 如果基础库版本低于 2.9.0 ，不能从分包外的页面直接跳入分包内的插件页面，需要先跳入分包内的非插件页面、再跳入同一分包内的插件页面。

### 自定义组件

使用插件提供的自定义组件，和 使用普通自定义组件 的方式相仿。在 json 文件定义需要引入的自定义组件时，使用 plugin:// 协议指明插件的引用名和自定义组件名，例如：

```json
{
  "usingComponents": {
    "hello-component": "plugin://myPlugin/hello-component"
  }
}
```

出于对插件的保护，插件提供的自定义组件在使用上有一定的限制：

- 默认情况下，页面中的 `this.selectComponent` 接口无法获得插件的自定义组件实例对象；
- `wx.createSelectorQuery` 等接口的 >>> 选择器无法选入插件内部。
