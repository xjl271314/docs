# webscoket

- 2020.03.16
> [`nodejs-websocket`文档地址](https://www.npmjs.com/package/nodejs-websocket)
```js
// step1
npm install nodejs-websocket --save

// step2
const ws = require("nodejs-websocket");
const AllUserData = new Array();
// Scream server example: "hi" -> "HI!!!"
const server = ws.createServer(function (conn) {
    conn.on("text", function (str) {
        console.log("Received "+str)
        AllUserData.push({
            'id':str,
            'ws':conn
        })
        conn.sendText(str.toUpperCase()+"!!!")
    })

    conn.on('connect', function(code) {
      console.log('开启连接', code)
    })

    conn.on("close", function (code, reason) {
        console.log("Connection closed")
        // 当用户退出的时候捕捉到退出的用户
        for (var i=0 in AllUserData) {
            if (AllUserData[i].ws == conn) {
                console.log(AllUserData[i])
            }
        }
    })
    
    conn.on('error', function(code) {
      console.log('异常关闭', code)
    })
}).listen(8001)

// step3 frontend
const socket = new WebSocket("ws://127.0.0.1:8001");
socket.onopen = function () {
    console.log('WebSocket open');//成功连接上Websocket
};
socket.onmessage = function (e) {
    console.log('message: ' + e.data);//打印出服务端返回过来的数据
};
// Call onopen directly if socket is already open
if (socket.readyState == WebSocket.OPEN) socket.onopen();
window.mySocket = socket;

```

