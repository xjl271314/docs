# 基础知识

- 2020.06.15

最基础的一些语法相关的将不在此进行阐述。

## json模块的使用

- 2020.06.15

>  `json` 模块用来对 `JSON` 数据进行编解码，它包含了两个函数:

- `json.dumps()`: 对数据进行编码。

- `json.loads()`: 对数据进行编码。

在`json`的编解码过程中，`python` 的原始类型与`json`类型会相互转换，具体的转化对照如下:

**Python 编码为 JSON 类型转换对应表：**

| Python数据类型  | Json数据类型
| :--- | :----
| `dict` | | `object`
| `list`, `tuple` |	`array`
| `str` |	`string`
| `int`, `float`, `int- & float-derived Enums` | `number`
| `True` |	`true`
| `False` |	`false`
| `None` |	`null`

**JSON 解码为 Python 类型转换对应表：**

| Json数据类型  | Python数据类型
| :--- | :----
| `object` | `dict`
| `array`	| `list`
| `string` | `str`
| `number (int)` | `int`
| `number (real)`	| `float`
| `true	`| `True`
| `false`	| `False`
| `null`	| `None`

### `json.dumps` 示例

```py
import json
 
# Python 字典类型转换为 JSON 对象
data = {
    'no' : 1,
    'name' : 'Runoob',
    'url' : 'http://www.runoob.com'
}
 
json_str = json.dumps(data)
print ("Python 原始数据：", repr(data)) 
# {'url': 'http://www.runoob.com', 'no': 1, 'name': 'Runoob'}
print ("JSON 对象：", json_str)
#  {"url": "http://www.runoob.com", "no": 1, "name": "Runoob"}

# 写入 JSON 数据
with open('data.json', 'w') as f:
    json.dump(data, f)
 
# 读取数据
with open('data.json', 'r') as f:
    data = json.load(f)
```

## 三目运算符

- 2020.07.16

```py
output = 'Yes' if i > 3 else 'No'
output = ('No', 'Yes')[i>3]
```

## 推导式

- 2020.07.16

> 推导式是一种将for循环、if表达式以及赋值语句放到单一语句中产生序列的方法，主要有列表推导式、集合推导式、字典推导式等。 其中列表推导式只需要一条表达式就能非常简洁地构造一个新列表。

```py
# [11, 12, 13, 14]
output = [i+10 for i in range(1,5)] 
# [13, 14]
output = [i + 10 for i in range(1,5) if i > 2]
```