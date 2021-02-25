(window.webpackJsonp=window.webpackJsonp||[]).push([[129],{797:function(t,n,s){"use strict";s.r(n);var a=s(14),e=Object(a.a)({},(function(){var t=this,n=t.$createElement,s=t._self._c||n;return s("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[s("h1",{attrs:{id:"node定时任务的使用"}},[t._v("Node定时任务的使用")]),t._v(" "),s("ul",[s("li",[t._v("2020.04.15")])]),t._v(" "),s("p",[t._v("在实际项目开发过程中，会遇到很多定时任务的工作。比如：定时导出某些数据、定时发送消息或邮件给用户、定时重置用户的某些任务等等。")]),t._v(" "),s("p",[t._v("node中也有很多用来执行定时任务的插件.")]),t._v(" "),s("h2",{attrs:{id:"node-schedule"}},[t._v("node-schedule")]),t._v(" "),s("blockquote",[s("p",[s("a",{attrs:{href:"https://github.com/node-schedule/node-schedule",target:"_blank",rel:"noopener noreferrer"}},[t._v("github地址"),s("OutboundLink")],1)])]),t._v(" "),s("h3",{attrs:{id:"安装"}},[t._v("安装")]),t._v(" "),s("div",{staticClass:"language-js extra-class"},[s("pre",{pre:!0,attrs:{class:"language-js"}},[s("code",[t._v("npm install node"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("-")]),t._v("schedule\n")])])]),s("h3",{attrs:{id:"cron风格定时器"}},[t._v("Cron风格定时器")]),t._v(" "),s("div",{staticClass:"language-js extra-class"},[s("pre",{pre:!0,attrs:{class:"language-js"}},[s("code",[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("var")]),t._v(" schedule "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("require")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'node-schedule'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n\n"),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("function")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("scheduleCronstyle")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    schedule"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("scheduleJob")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'30 * * * * *'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("function")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n        console"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("log")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'scheduleCronstyle:'")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("+")]),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("new")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("Date")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n\n"),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("scheduleCronstyle")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n")])])]),s("p",[t._v("上面代码执行结果是每分钟的30秒会输出。")]),t._v(" "),s("div",{staticClass:"language-js extra-class"},[s("pre",{pre:!0,attrs:{class:"language-js"}},[s("code",[s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("/** \n *  通配符解释\n    * *  *  *  *  *  *\n    ┬ ┬ ┬ ┬ ┬ ┬\n    │ │ │ │ │  |\n    │ │ │ │ │ └ day of week (0 - 7) (0 or 7 is Sun)\n    │ │ │ │ └───── month (1 - 12)\n    │ │ │ └────────── day of month (1 - 31)\n    │ │ └─────────────── hour (0 - 23)\n    │ └──────────────────── minute (0 - 59)\n    └───────────────────────── second (0 - 59, OPTIONAL)\n\n    6个占位符从左到右分别代表：秒、分、时、日、月、周几\n\n　　 '*'表示通配符，匹配任意，当秒是'*'时，表示任意秒数都触发，其它类推\n\n    每分钟的第30秒触发： '30 * * * * *'\n\n    每小时的1分30秒触发 ：'30 1 * * * *'\n\n    每天的凌晨1点1分30秒触发 ：'30 1 1 * * *'\n\n    每月的1日1点1分30秒触发 ：'30 1 1 1 * *'\n\n    2016年的1月1日1点1分30秒触发 ：'30 1 1 1 2016 *'\n\n    每周1的1点1分30秒触发 ：'30 1 1 * * 1'\n * \n*/")]),t._v("\n")])])]),s("p",[t._v("我们可以根据自己的需要去定制化定时任务。")]),t._v(" "),s("h3",{attrs:{id:"递归规则定时器"}},[t._v("递归规则定时器")]),t._v(" "),s("div",{staticClass:"language-js extra-class"},[s("pre",{pre:!0,attrs:{class:"language-js"}},[s("code",[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("var")]),t._v(" schedule "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("require")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'node-schedule'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n\n"),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("function")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("scheduleRecurrenceRule")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("var")]),t._v(" rule "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("new")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("schedule"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("RecurrenceRule")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("/**\n     * rule = {\n     *   dayOfWeek,\n     *   month,\n     *   dayOfMonth,\n     *   hour\n     *   minute,\n     *   second\n     * }\n\n    schedule.scheduleJob(rule, function(){\n        console.log('scheduleRecurrenceRule:' + new Date());\n    });\n}\n\nscheduleRecurrenceRule();\n")])])])]),s("p",[t._v("上述代码会在每分钟第60秒时触发。")]),t._v(" "),s("h3",{attrs:{id:"对象文本语法定时器"}},[t._v("对象文本语法定时器")]),t._v(" "),s("div",{staticClass:"language-js extra-class"},[s("pre",{pre:!0,attrs:{class:"language-js"}},[s("code",[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("var")]),t._v(" schedule "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("require")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'node-schedule'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n\n"),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("function")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("scheduleObjectLiteralSyntax")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("/*\n     * dayOfWeek\n     * month\n     * dayOfMonth\n     * hour\n     * minute\n     * second\n     * /\n    \n    schedule.scheduleJob({hour: 16, minute: 11, dayOfWeek: 1}, function(){\n        console.log('scheduleObjectLiteralSyntax:' + new Date());\n    });\n}\n\nscheduleObjectLiteralSyntax();\n")])])])])])}),[],!1,null,null,null);n.default=e.exports}}]);