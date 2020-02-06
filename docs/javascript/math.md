# Math对象

## 常用方法

-  `min()`和 `max()`方法

	```javascript
	var values = [1, 2, 3, 4, 5, 6, 7, 8]; 
    var max = Math.max.apply(Math, values);
    var min = Math.min.apply(Math, values);
	```
- `Math.ceil()`执行向上舍入，即它总是将数值向上舍入为最接近的整数；
- `Math.floor()`执行向下舍入，即它总是将数值向下舍入为最接近的整数；
- `Math.round()`执行标准舍入，即它总是将数值四舍五入为最接近的整数。
- `Math.random()`返回大于等于0小于1的一个随机数。
- `Math.abs(num)` 返回num的绝对值。
- `Math.pow(num,power)` 返回num的power次幂。

```js
// 返回指定区间的数
function selectFrom(lowerValue, upperValue) { 
    let choices = upperValue - lowerValue + 1; 
    return Math.floor(Math.random() * choices + lowerValue); 
} 
const num = selectFrom(2, 10); 
alert(num); // 介于 2 和 10 之间（包括 2 和 10）的一个数值
```