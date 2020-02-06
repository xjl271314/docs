# url编码方式

url编码方式主要有两种：

1. `encodeURI()`主要用于整个 URI（例如，http://www.wrox.com/illegal value.htm）。
2. `encodeURIComponent()`主要用于对 URI 中的某一段（例如前面 URI 中的 illegal value.htm）。

:::tip
`encodeURI()`不会对本身属于 `URI` 的特殊字符进行编码，例如冒号、正斜杠、问号和井字号；
`encodeURIComponent()`则会对它发现的任何非标准字符进行编码。
对应解码方式为`decodeURI()`与`decodeURIComponent()`。
:::

```javascript
var uri = "http://www.wrox.com/illegal value.htm#start"; 
// "http://www.wrox.com/illegal%20value.htm#start" 
alert(encodeURI(uri)); 

// "http%3A%2F%2Fwww.wrox.com%2Fillegal%20value.htm%23start" 
alert(encodeURIComponent(uri));
```