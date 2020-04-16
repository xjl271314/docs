# async模块简介以及在mysql中的应用

- 2020.04.16

## 定义

> async模块是node中的异步流程控制模块

## 安装

```
npm install async
```

## 使用

`async`模块有几个常用的api。

1. `series(tasks,[callback])`

> 多个函数从上到下依次执行,相互之间没有数据交互.

```js
const task1 = callback => {
	console.log("task1");
	callback(null,"task1");
}

const task2 = callback => {
	console.log("task2");
	callback(null,"task2");
}
    
const task3 = callback => {
	console.log("task3");
	callback(null,"task3");
}

async.series([task1,task2,task3],function(err, result){
	console.log("series");
	if (err) {
		console.log(err);
	}
	console.log(result);
})
/**
 * 1. task1
 * 2. task2
 * 3. task3
 * 4. series
 * 5. [ 'task1', 'task2', 'task3' ]
```

如果中途发生错误,则将错误传递到回调函数,并停止执行后面的函数

```js
// 修改 task2
const task2 = callback => {
	console.log("task2");
	callback(err,"task2");
}

/**
 * 1. task1
 * 2. task2
 * 3. series
 * 4. err
 * 5. [ 'task1', 'task2']

```

2. `parallel(tasks,[callback])`

> 多个函数并行执行,不会等待其他函数,最终把结果存在一个数据中去的，是有先后顺序的

```js
const task1 = callback => {
    console.log("task1", new Date().getTime());
    callback(null,"task1");
}
    
const task2 = callback => {
    console.log("task2", new Date().getTime());
    callback(null, "task2")
}
        
const task3 = callback => {
    console.log("task3", new Date().getTime());
    callback(null,"task3");
}
    
async.parallel([task1,task2,task3],function(err, result){
    console.log("parallel");
    if (err) {
        console.log(err);
    }
    console.log(result);
})

/**
 * 1. task1 1587045158058
 * 2. task2 1587045158060
 * 3. task3 1587045158060
 * 4. parallel
 * 5. [ 'task1', 'task2', 'task3' ]
```

3. `waterfall(tasks,[callback]) :瀑布流`

> 依次执行,前一个函数的输出为后一个函数的输入

```js
const task1 = callback => {
    console.log("task1", new Date().getTime());
    callback(null,"task1");
}
    
const task2 = (input, callback) => {
    console.log(input, "task2", new Date().getTime());
    callback(null, "task2")
}
        
const task3 = (input, callback) => {
    console.log(input, "task3", new Date().getTime());
    callback(null,"task3");
}
    
async.waterfall([task1,task2,task3],function(err, result){
    console.log("waterfall");
    if (err) {
        console.log(err);
    }
    console.log(result);
})
/**
 * 1. task1 1587045497048
 * 2. task1 task2 1587045497050
 * 2. task2 task3 1587045497050
 * 3. waterfall
 * 4. task3
 * /
```

4. `parallelLimit(tasks,limit,[callback]) `

> 和`parallel`类似,只是`limit`参数限制了同时并发执行的个数,不再是无限并发

```js
const task1 = callback => {
  console.log("task1", new Date().getTime());
  setTimeout(()=>callback(null, "task1"), 1000);
}

const task2 = callback => {
  console.log("task2", new Date().getTime());
  setTimeout(()=>callback(null, "task2"), 2000);
}

const task3 = callback => {
  console.log("task3", new Date().getTime());
  setTimeout(()=>callback(null, "task3"), 3000);
}

console.time("parallelLimit执行");

async.parallelLimit([task1, task2, task3], 2, function (err, result) {
  console.log("parallelLimit");
  if (err) {
    console.log(err);
  }
  console.log(result);
  console.timeEnd("parallelLimit执行");
})
/**
 * 1. task1 1587045939489
 * 2. task2 1587045939491
 * 3. task3 1587045940491
 * 4. parallelLimit执行
 * 5. [ 'task1', 'task2', 'task3' ]
 * 6. parallelLimit执行: 4.015s
 */
```

上面三个函数分别延迟1s、2s、3s执行，总共执行结果为4.015s。

我们设置了并行数量为2,首先执行函数1和2。

1s后函数1和2执行完成,这时函数3开始执行。

3s后函数3执行完毕，总共耗时4.015s。

5. compose(fn1,fn2,fn3...)

> 这个类似中间件，创建一个异步的集合函数,执行的顺序是倒序.前一个fn的输出是后一个fn的输入.有数据交互

```js
const task1 = (m, callback) => {
  console.log("task1", m);
  callback(null, m*2);
}

const task2 = (m, callback) => {
  console.log("task2", m);
  callback(null, m*3);
}

const task3 = (m, callback) => {
  console.log("task3", m);
  callback(null, m*4);
}

const _fn = async.compose(task3, task2, task1);

_fn(2, function (err, result) {
  console.log("compose");
  if (err) {
    console.log(err);
  }
  console.log(result);
})

/**
 * 1. task1 2
 * 2. task2 4
 * 3. task3 12
 * 4. compose
 * 5. 48
 * /

```

## 在mysql事务中使用

```js
// mysql.js
var db    = {};
var mysql = require('mysql');
var pool  = mysql.createPool({
    connectionLimit : 10,
    host            : 'localhost',
    user            : 'root',
    password        : '123456',
    database        : 'demo'
})

//获取连接
db.getConnection = function(callback){
	pool.getConnection(function(err, connection) {
		if (err) {
			callback(null);
			return;
		}
		callback(connection);
	});
} 
module.exports = db;
```

在model中使用

```js
var db = require('./mysql.js');
var async = require('async');

// 事务执行
db.getConnection(function(connection){
  connection.beginTransaction(function(err) {
    if (err) { 
      console.log(err);
      return;
    }

    var task1 = function(callback){
      connection.query(`insert into user (name) values('a')`, function(err, result) {
        if (err) {
          console.log(err);
          callback(err,null);
          return;
        }
        console.log('第一次插入成功!');
        callback(null,result);
      })
    }

    var task2 = function(callback){
      connection.query(`insert into user (name) values('b')`, function(err, result) {
        if (err) {
          console.log(err);
          callback(err,null);
          return;
        }
        console.log('第二次插入成功!');
        callback(null,result);
      })
    }

    var task3 = function(callback){
      connection.query(`insert into user (name) values('c')`, function(err, result) {
        if (err) {
          console.log(err);
          callback(err,null);
          return;
        }
        console.log('第三次插入成功!');
        callback(null,result);
      })
    }

    async.series([task1, task2, task3],function(err,result){
      if (err) {
        console.log(err);
        //回滚
        connection.rollback(function() {
          console.log('出现错误,回滚!');
          //释放资源
          connection.release();
        });
        return;
      }
      //提交
      connection.commit(function(err) {
        if (err) {
          console.log(err);
          return;
        }
          
        console.log('成功,提交!');
        //释放资源
        connection.release();
      });
    })
  });
});
```

:::tip
在使用 `async` 处理事务的时候经常用到的是`series`和`waterfall`两种模式
:::