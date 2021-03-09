const moment = require('moment');

module.exports = {
    title: '前端工程师成长路线',
    description: '博客 分享 读后感 成长规划',
    dest: './dist',
    base: '/docs/',
    head: [
        ['link', { rel: 'icon', href: '/images/favicon.png' }],
        ["link", { rel: "stylesheet", href: "https://cdn.bootcdn.net/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" }],
        ['meta', { name: 'theme-color', content: '#00adb5' }],
        ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
        ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }],
        ['meta', { name: 'msapplication-TileColor', content: '#00adb5' }],
        ['meta', { name: 'description', itemprop: 'description', content: '前端工程师成长路线' }],
        ['meta', { itemprop: 'name', content: '前端工程师成长路线' }],
        ['meta', { itemprop: 'image', content: '/my-blogs/images/favicon.png' }],
        ['script', { type: 'text/javascript', src: 'https://cdn.jsdelivr.net/gh/bmob/hydrogen-js-sdk/dist/Bmob-2.2.4.min.js' }],

    ],
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
        ['@vuepress/last-updated', {
            transformer: (timestamp, lang) => {
                moment.locale(lang)
                return moment(timestamp).format('YYYY-MM-DD HH:mm:SS')
            }
        }],
        ['@vuepress/register-components'],
    ],
    themeConfig: {
        nav: [
            { text: 'css tricks', link: 'https://xjl271314.github.io/css_tips' },
            { text: 'js tricks', link: 'https://xjl271314.github.io/js_tips' },
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
                    "/javascript/typeChange",
                    "/javascript/tostring",
                    "/javascript/object",
                    "/javascript/array",
                    "/javascript/not",
                    "/javascript/for-in",
                    "/javascript/try-catch",
                    "/javascript/with",
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
                    "/javascript/eventsEmitter",
                    "/javascript/target",
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
                    "/css/higher",
                    "/css/img",
                    "/css/fix",
                    "/css/animate",
                    "/css/display",
                    "/css/interview"
                ]
            },
            {
                title: "Svg相关知识",
                collapsable: true,
                children: [
                    '/svg/base',
                    '/svg/high',
                    '/svg/path',
                    '/svg/animation',
                    '/svg/example',
                ]
            },
            '/http/',
            {
                title: "浏览器相关知识",
                collapsable: true,
                children: [
                    "/browser/extension",
                    "/browser/knowledge"
                ]
            },
            {
                title: "PS相关知识",
                collapsable: true,
                children: [
                    '/ps/quick',
                ]
            },
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
                    "/project/gitlabCI",
                    "/project/middleWare",
                    "/project/immer"
                ]
            },
            '/safe/',
            {
                title: "git",
                collapsable: true,
                children: [
                    "/git/base",
                    "/git/standant",
                    "/git/list",
                ]
            },
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
                    "/mobile/hybrid",
                    "/mobile/meta",
                    "/mobile/tips",
                    "/mobile/wxShare",
                    "/mobile/live",
                    "/mobile/h5live",
                    "/mobile/h5liveProblems",
                    "/mobile/rtc"
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
                    "/react/key",
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
                    "/react/problems",
                    "/react/upgrade",
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
                children: [
                    '/electron/build',
                    '/electron/update'
                ]
            },
            {
                title: "Mysql",
                collapsable: true,
                children: [
                    '/mysql/faq',
                    '/mysql/base',
                    '/mysql/select',
                    '/mysql/insert'
                ]
            },
            {
                title: "Node.js",
                collapsable: true,
                children: [
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
                children: [
                    '/python/base',
                    '/python/pip',
                    '/python/pillow',
                    '/python/os',
                    '/python/selenium',
                    '/python/utils',
                    '/python/pandas',
                    '/python/numpy',
                    '/python/django',
                    {
                        title: '文件处理相关',
                        children: [
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
                children: [
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
                    "/open/system",
                    "/open/pageVisualization",
                    "/open/semicolon",
                    "/open/performance",
                ]
            },
            {
                title: "即时通讯",
                collapsable: true,
                children: [
                    "/im/tcent",
                    "/im/base",
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
                title: "LeetCode",
                collapsable: true,
                children: [
                    "/leetcode/sameTree",
                    "/leetcode/sumOfTwoNum",
                    "/leetcode/addOfTwoNum",
                ]
            },
            {
                title: "微信开发相关",
                collapsable: true,
                children: [
                    "/wechat/h5share",
                    "/wechat/miniprogramComponent",
                    "/wechat/miniprogram",
                ]
            },
            {
                title: "工具",
                collapsable: true,
                children: [
                    "/tool/charles",
                ]
            },
            {
                title: "插件推荐",
                collapsable: true,
                children: [
                    "/extend/number",
                ]
            },
        ],
        lastUpdated: '上次更新时间',
        // 假定 GitHub。也可以是一个完整的 GitLab 网址
        repo: 'https://github.com/xjl271314/docs',
        // 如果你的文档不在仓库的根部
        // docsDir: 'docs',
        // 可选，默认为 master
        docsBranch: 'master',
        // 默认为 true，设置为 false 来禁用
        editLinks: false,
        smoothScroll: true
    }
}




