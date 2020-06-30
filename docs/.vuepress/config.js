const moment = require('moment');

module.exports = {
  title: '前端工程师成长路线',
  description: '博客 分享 读后感 成长规划',
  dest: './dist',
  base: '/my-blogs/',
  head: [
    ['link', { rel: 'icon', href: '/images/favicon.png' }],
    ["link", { rel: "stylesheet", href: "https://cdn.bootcdn.net/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" }],
    ['meta', { name: 'theme-color', content: '#00adb5' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }],
    ['meta', { name: 'msapplication-TileColor', content: '#00adb5' }],
    ['meta', {name:'description', itemprop: 'description', content: '前端工程师成长路线' }],
    ['meta', { itemprop: 'name', content: '前端工程师成长路线' }],
    ['meta', { itemprop: 'image', content: '/my-blogs/images/favicon.png' }],
    ['script', {type: 'text/javascript', src: 'https://cdn.jsdelivr.net/gh/bmob/hydrogen-js-sdk/dist/Bmob-2.2.4.min.js'}],
    
  ],
  repo:"https://github.com/xjl271314/my-blogs",
  markdown: {
    anchor: { permalink: false },
    toc: { includeLevel: [1, 2, 3] },
    config: md => {
      md.use(require('markdown-it-include'), './')
    }
  },
  plugins: [
    require('./plugins/comment/index.js'),
    require('./plugins/copy/index.js'),
    '@vuepress/back-to-top',
    '@vuepress/active-header-links',
    ['@vuepress/last-updated',{
      transformer: (timestamp, lang) => {
        moment.locale(lang)
        return moment(timestamp).format('YYYY-MM-DD HH:mm:SS')
      }
    }],
    ['@vuepress/register-components'],
  ],
  themeConfig: {
    nav: [
      { text: 'css tricks', link: '' },
      { text: 'js tricks', link: '' },
    ],
    sidebar: [
      '/dom/',
      '/bom/',
      {
        title: "javaScript基础知识",
        collapsable: true,
        children: [
          "/javascript/script",
          "/javascript/noscript",
          "/javascript/scriptsort",
          "/javascript/strict",
          "/javascript/var",
          "/javascript/type",
          "/javascript/null",
          "/javascript/number",
          "/javascript/tostring",
          "/javascript/object",
          "/javascript/array",
          "/javascript/not",
          "/javascript/for-in",
          "/javascript/with",
          "/javascript/arguments",
          "/javascript/env",
          "/javascript/rubbish",
          "/javascript/regexp",
          "/javascript/function",
          "/javascript/url",
          "/javascript/math",
          "/javascript/oop",
          "/javascript/form",
          "/javascript/canvans",
          "/javascript/webgl",
          "/javascript/html5",
          "/javascript/cros",
          "/javascript/eventloop",
          "/javascript/copy",
          "/javascript/macro",
          "/javascript/ajax",
          "/javascript/throtte",
          "/javascript/eventsEmitter"
        ]
      },
      {
        title: "javaScript高级技巧",
        collapsable: true,
        children: [
          "/javascriptHigh/tips",
          "/javascriptHigh/mutationObserver",
          "/javascriptHigh/createTypes",
        ]
      },
      '/es/',
      {
      title: "CSS相关知识",
        collapsable: true,
        children: [
          "/css/base",
          "/css/img",
          "/css/fix",
          "/css/display",
          "/css/interview"
        ]
      },
      {
        title: "Svg相关知识",
        collapsable: true,
        children:[
          '/svg/base',
          '/svg/high',
          '/svg/path',
          '/svg/animation',
          '/svg/example',
        ]
      },
      '/http/',
      {
        title: "前端工程化",
        collapsable: true,
        children: [
          "/project/mock",
          "/project/module",
          "/project/babel",
          "/project/webpack",
          "/project/autobuild",
          "/project/err",
          "/project/standards",
          "/project/docker",
          "/project/autoTryCatch",
          "/project/gitlabCI"
        ]
      },
      '/safe/',
      '/git/',
      {
        title: "nginx",
        collapsable: true,
        children: [
          "/nginx/base",
          "/nginx/https"
        ]
      },
      {
        title: "TypeScript",
        collapsable: true,
        children: [
          "/typescript/base",
          "/typescript/enum",
          "/typescript/interface",
          "/typescript/fan",
          "/typescript/func",
          "/typescript/expirence",
        ]
      },
      {
        title: "移动端知识",
        collapsable: true,
        children: [
          "/mobile/meta",
          "/mobile/tips",
          "/mobile/wxShare",
          "/mobile/h5live",
          "/mobile/h5liveProblems"
        ]
      },
      {
        title: "React",
        collapsable: true,
        children: [
          "/react/lifestyle",
          "/react/dom",
          "/react/diff",
          "/react/fiber",
          "/react/component",
          "/react/com",
          "/react/setState",
          "/react/redux",
          "/react/hooksRedux",
          "/react/reduxSaga",
          "/react/mobx",
          "/react/hooks",
          "/react/aria",
          "/react/codesplit",
          "/react/ref",
          "/react/hoc",
          "/react/jsx",
          "/react/portal",
          "/react/syntheticEvent",
          "/react/optimization",
          "/react/webpack",
          "/react/recompose",
          "/react/problems"
        ]
      },
      {
        title: "Vue",
        collapsable: true,
        children: [
          "/vue/lifestyle",
        ]
      },
      {
        title: "Electron",
        collapsable: true,
        children:[
          '/electron/build',
          '/electron/update'
        ]
      },
      {
        title: "Mysql",
        collapsable: true,
        children:[
          '/mysql/base',
          '/mysql/select',
          '/mysql/insert'
        ]
      },
      {
        title: "Node.js",
        collapsable: true,
        children:[
          '/node/socket',
          '/node/uploadQiNiu',
          '/node/schedule',
          '/node/koaMiddleware',
          '/node/jwt',
          '/node/async',
          '/node/childProcess',
          '/node/egg',
          '/node/puppeteer'
        ]
      },
      {
        title: "Python",
        collapsable: true,
        children:[
          '/python/base',
          '/python/pip',
          '/python/pillow',
          '/python/os',
          '/python/selenium',
          '/python/utils',
          '/python/pandas',
          {
            title:'文件处理相关',
            children:[
              '/python/downloadImgs',
              '/python/autoRenameImgs',
              '/python/jsonToCsv',
              '/python/readPdf',
              '/python/tinyPng',
            ]
          }
        ]
      },
      {
        title: "Redis",
        collapsable: true,
        children:[
          '/redis/base',
          '/redis/notification',
          '/redis/multy'
        ]
      },
      '/bff/',
      {
        title: "开放性问题",
        collapsable: true,
        children: [
          "/open/font",
          "/open/px",
          "/open/module",
          "/open/rtv",
          "/open/highList",
          "/open/system"
        ]
      },
      {
        title: "即时通讯",
        collapsable: true,
        children: [
          "/im/tcent",
        ]
      },
      {
        title: "浏览器插件扩展",
        collapsable: true,
        children: [
          "/extensions/chrome"
        ]
      },
      {
        title: "算法",
        collapsable: true,
        children: [
          "/algorithm/cacheLRU",
        ]
      },
      {
        title: "工具",
        collapsable: true,
        children: [
          "/tool/charles",
        ]
      },
    ],
    lastUpdated: '上次更新时间' ,
    // 假定 GitHub。也可以是一个完整的 GitLab 网址
    repo: 'https://github.com/xjl271314/my-blogs',
    // 如果你的文档不在仓库的根部
    // docsDir: 'docs',
    // 可选，默认为 master
    docsBranch: 'master',
    // 默认为 true，设置为 false 来禁用
    editLinks: false,
    smoothScroll: true
  }
}

