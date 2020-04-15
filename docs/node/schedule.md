# Node定时任务的使用

- 2020.04.15

在实际项目开发过程中，会遇到很多定时任务的工作。比如：定时导出某些数据、定时发送消息或邮件给用户、定时重置用户的某些任务等等。

node中也有很多用来执行定时任务的插件.

## node-schedule

> [github地址](https://github.com/node-schedule/node-schedule)

### 安装

```js
npm install node-schedule
```

### Cron风格定时器

```js
var schedule = require('node-schedule');

function scheduleCronstyle(){
    schedule.scheduleJob('30 * * * * *',function(){
        console.log('scheduleCronstyle:'+new Date());
    });
}

scheduleCronstyle();
```

上面代码执行结果是每分钟的30秒会输出。

```js
/** 
 *  通配符解释
    * *  *  *  *  *  *
    ┬ ┬ ┬ ┬ ┬ ┬
    │ │ │ │ │  |
    │ │ │ │ │ └ day of week (0 - 7) (0 or 7 is Sun)
    │ │ │ │ └───── month (1 - 12)
    │ │ │ └────────── day of month (1 - 31)
    │ │ └─────────────── hour (0 - 23)
    │ └──────────────────── minute (0 - 59)
    └───────────────────────── second (0 - 59, OPTIONAL)

    6个占位符从左到右分别代表：秒、分、时、日、月、周几

　　 '*'表示通配符，匹配任意，当秒是'*'时，表示任意秒数都触发，其它类推

    每分钟的第30秒触发： '30 * * * * *'

    每小时的1分30秒触发 ：'30 1 * * * *'

    每天的凌晨1点1分30秒触发 ：'30 1 1 * * *'

    每月的1日1点1分30秒触发 ：'30 1 1 1 * *'

    2016年的1月1日1点1分30秒触发 ：'30 1 1 1 2016 *'

    每周1的1点1分30秒触发 ：'30 1 1 * * 1'
 * 
*/
```

我们可以根据自己的需要去定制化定时任务。

### 递归规则定时器

```js
var schedule = require('node-schedule');

function scheduleRecurrenceRule(){
    var rule = new schedule.RecurrenceRule();
    /**
     * rule = {
     *   dayOfWeek,
     *   month,
     *   dayOfMonth,
     *   hour
     *   minute,
     *   second
     * }

    schedule.scheduleJob(rule, function(){
        console.log('scheduleRecurrenceRule:' + new Date());
    });
}

scheduleRecurrenceRule();
```

上述代码会在每分钟第60秒时触发。

### 对象文本语法定时器

```js
var schedule = require('node-schedule');

function scheduleObjectLiteralSyntax(){
    /*
     * dayOfWeek
     * month
     * dayOfMonth
     * hour
     * minute
     * second
     * /
    
    schedule.scheduleJob({hour: 16, minute: 11, dayOfWeek: 1}, function(){
        console.log('scheduleObjectLiteralSyntax:' + new Date());
    });
}

scheduleObjectLiteralSyntax();
```
