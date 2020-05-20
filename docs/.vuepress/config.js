const moment = require('moment');

module.exports = {
  title: '前端工程师成长路线',
  description: '博客 分享 读后感 成长规划',
  dest: './dist',
  base: '/blogs/',
  repo: '',
  head: [
    ['link', { rel: 'icon', href: `/images/favicon.png` }],
    ['meta', { name: 'theme-color', content: '#00adb5' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }],
    ['meta', { name: 'msapplication-TileColor', content: '#00adb5' }],
    ['meta', {name:'description', itemprop: 'description', content: '常用的js方法，js_tricks' }],
    ['meta', { itemprop: 'name', content: 'js_trick' }],
    ['meta', { itemprop: 'image', content: '/js_tricks/images/favicon.png' }],
  ],
  markdown: {
    anchor: { permalink: false },
    toc: { includeLevel: [1, 2, 3] },
    config: md => {
      md.use(require('markdown-it-include'), './')
    }
  },
  plugins: [
    require('./plugins/copy/index'),
    '@vuepress/back-to-top',
    '@vuepress/active-header-links',
    ['@vuepress/last-updated',{
      transformer: (timestamp, lang) => {
        moment.locale(lang)
        return moment(timestamp).format('YYYY-MM-DD HH:mm:SS')
      }
    }]
  ],
  themeConfig: {
    nav: [
      { text: 'css tricks', link: '' },
      { text: 'blog', link: '' },
      { text: 'GitHub', link: '' },
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
          "/javascriptHigh/mutationObserver",
        ]
      },
      '/es/',
      {
      title: "CSS相关知识",
        collapsable: true,
        children: [
          "/css/base",
          "/css/img",
          "/css/fix"
        ]
      },
      '/http/',
      {
        title: "前端工程化",
        collapsable: true,
        children: [
          "/project/mock",
          "/project/module",
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
          "/mobile/wxShare"
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
          '/node/egg'
        ]
      },
      {
        title: "Python",
        collapsable: true,
        children:[
          '/python/pip'
        ]
      },
      {
        title: "Redis",
        collapsable: true,
        children:[
          '/redis/base'
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
          "/open/rtv"
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
  }
}

