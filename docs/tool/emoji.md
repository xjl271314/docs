# 如何在项目中匹配所有 emoji

- 2021.05.31

## 场景描述

数据库中存储用户昵称等信息经常会采用`utf8mb4`的格式，这种格式可以支持存储`emoji`信息。因此很多用户的昵称上都会带一些奇奇怪怪的 emoji 表情。针对某些场景又需要对用户信息进行脱敏处理，不让直接透出真实昵称。

例如在直播业务中，涉及到主播端和用户端，在主播端信息要正常显示，针对其他用户端的场景进行脱敏处理。这个时候就需要前端自行进行处理了。

## JavaScript 中的 emoji

首先我们来了解下什么是 Unicode。

> Unicode，官方中文名称为统一码[1]，也译名为万国码、国际码、单一码，是计算机科学领域的业界标准。它整理、编码了世界上大部分的文字系统，使得电脑可以用更为简单的方式来呈现和处理文字。

- `Code point` — 特定的 Unicode 字符数字的表现.
- `Character Code` — code point 的另外一个称呼.
- `Code Unit` — code point 的编码单位(X 字节),Javascript 中使用 UTF-16.
- `Decimal` — code points 用十进制来表示.
- `Hexadecimal` — code points 用十六进制来表示.

这样来描述可能大家都很模糊,我们来看一下例子理解下在不同格式下的表现：

```js
// 我们拿例子 `A` 来进行说明
// From string to decimal code point

"A".codePointAt(0); // 65

// From decimal to hexadecimal code point
Number(65).toString(16); // 41

// From hexadecimal to decimal code point
parseInt("41", 16); // 65

// alternatively
0x0041; // 65

// From decimal code point to string
String.fromCodePoint(65); // A

// From hexadecimal code point to string
("\u0041"); // 'A'
```

:::warning
`codePointAt` 和 `fromCodePoint`都是 ES6 的新方法,用于处理`unicode`字符编码,采用`UTF-16`进行编码，包含了对`emoji`的处理。

我们可以使用这两种方式来代替`charCodeAt`,用于规避其处理`emoji`时无法正确解析的问题。
:::

我们再来看看例子:

```js
"😸".charCodeAt(0); // wrong: 55357

"😸".codePointAt(0); // correct: 128568
```

为了方便进行正则的匹配，我们一般会用 16 进制来表示对应的`emoji`编码。比如之前的`\u0041`代表字符 A。

:::warning
这里需要注意的是，16 进制的编码必须要是 4 位的长度，且该不区分大小写。

例如: `\uD83D` 和 `\ud83d`是等价的。

我们可以通过`String.fromCodePoint(0x0041)`来检查输出结果。
:::

### emoji 在 JavaScript 中的长度

我们来看看在`JavaScript`中的`emoji`占据多大的字节。

```js
"😀".length;
```

上述代码的真实长度是 2。根据 BMP 的规则，上述标签被拆分成了 2 段。

```
"\uD83D\uDE00"
```

其中第一对称为`主代理`，后者称为`尾代理`。

那么如何获取字符串中的`emoji`呢?

- 我们来看看用字符串`split`处理后的结果

```js
"abc😀".split(""); // ["a", "b", "c", "�", "�"]
```

我们来看看正确的操作方式:

```js
// http://www.2ality.com/2013/09/javascript-unicode.html
function toUTF16(codePoint) {
  var TEN_BITS = parseInt("1111111111", 2);
  function u(codeUnit) {
    return "\\u" + codeUnit.toString(16).toUpperCase();
  }

  if (codePoint <= 0xffff) {
    return u(codePoint);
  }
  codePoint -= 0x10000;

  // Shift right to get to most significant 10 bits
  var leadSurrogate = 0xd800 + (codePoint >> 10);

  // Mask to get least significant 10 bits
  var tailSurrogate = 0xdc00 + (codePoint & TEN_BITS);

  return u(leadSurrogate) + u(tailSurrogate);
}

// using codePointAt, it's easy to go from emoji
// to decimal and back.
// Emoji to decimal representation
"😀".codePointAt(0); // 128512;

// Decimal to emoji
String.fromCodePoint(128512); // "😀";

// going from emoji to hexadecimal is a little
// bit trickier. To convert from decimal to hexadecimal,
// we can use toUTF16.
// Decimal to hexadecimal
toUTF16(128512); // "\uD83D\uDE00";

// Hexadecimal to emoji
("\uD83D\uDE00"); // "😀";
```

## 正则表达式法:

说完了其中的相关知识，我们再来看看解决方案。既然要去匹配`emoji`等信息，首先会想到的应该就是通过正则表达式的方式。那么如何能通过正则，匹配到所有的`emoji`表情呢?

我们先来看看囊括的`emoji`大致上有哪几种类型?

:::tip
这里的说明类型来源于 github 上的一个项目[传送门](https://github.com/zly394/EmojiRegex),描述的类型还比较全面,(更新的时间是在 4 年前，后续没怎么更新)。
:::

### [1. 杂项符号及图形](https://zh.wikipedia.org/wiki/Template:Unicode_chart_Miscellaneous_Symbols_and_Pictographs)

杂项符号及图形一共有 768 个字符，范围为： `U+1F300 ～ U+1F5FF`，在 Java 中正则表达式为：

```
"[\\uD83C\\uDF00-\\uD83D\\uDDFF]"
```

### [2. 增补符号及图形](https://zh.wikipedia.org/wiki/Template:Unicode_chart_Supplemental_Symbols_and_Pictographs)

增补符号及图形中一共有 82 个字符，范围为： `U+1F900 ～ U+1F9FF`，在 Java 中正则表达式为：

```
"[\\uD83E\\uDD00-\\uD83E\\uDDFF]"
```

### [3. 表情符号](https://zh.wikipedia.org/wiki/Template:Unicode_chart_Emoticons)

表情符号一共有 80 个字符，范围为： `U+1F600 ～ U+1F64F`，在 Java 中正则表达式为：

```
"[\\uD83D\\uDE00-\\uD83D\\uDE4F]"
```

### [4. 交通及地图符号](https://zh.wikipedia.org/wiki/Template:Unicode_chart_Transport_and_Map_Symbols)

交通及地图符号一共有 103 个字符，范围为： `U+1F680 ～ U+1F6FF`，在 Java 中正则表达式为：

```
"[\\uD83D\\uDE80-\\uD83D\\uDEFF]"
```

### [5. 杂项符号](https://zh.wikipedia.org/wiki/Template:Unicode_chart_Miscellaneous_Symbols)

杂项符号一共有 256 个字符，范围为： `U+2600 ～ U+26FF` 或拼上 `U+FE0F`，在 Java 中正则表达式为：

```
"[\\u2600-\\u26FF]\\FE0F?"
```

### [6. 装饰符号](https://zh.wikipedia.org/wiki/Template:Unicode_chart_Dingbats)

装饰符号一共有 192 个字符，范围为： `U+2700 ～ U+27BF` 或拼上 `U+FE0F`，在 Java 中正则表达式为：

```
"[\\u2700-\\u27BF]\\FE0F?"
```

### [7. 封闭式字母数字符号](https://en.wikipedia.org/wiki/Enclosed_Alphanumerics)

封闭式字母数字符号中只有一个 emoji 字符，为： `U+24C2` 或拼上 `U+FE0F`，在 Java 中正则表达式为：

```
"\\u24C2\\uFE0F?"
```

### [8. 封闭式字母数字补充符号](https://en.wikipedia.org/wiki/Enclosed_Alphanumeric_Supplement)

封闭式字母数字补充符号包含 41 个 emoji 字符，其中 26 个属于区域指示符号

- [8.1 区域指示符号](https://en.wikipedia.org/wiki/Regional_indicator_symbol)

区域指示符号一共有 26 个字符，范围为： `U+1F1E6 ～ U+1F1FF`，并且其中每两个字母可以代表一个国家或地区的旗帜，在 Java 中正则表达式为：

```
"[\\uD83C\\uDDE6-\\uD83C\\uDDFF]{1,2}"
```

- 8.2 其他封闭式字母数字补充 `emoji` 符号

除了区域指示符号外其他的 emoji 字符为： `U+1F170`、 `U+1F171`、 `U+1F17E`、 `U+1F17F`、 `U+1F18E` 和 `U+1F191 ～ U+1F19A` 或拼上 `U+FE0F`，在 Java 中正则表达式为：

```
"[\\uD83C\\uDD70\\uD83C\\uDD71\\uD83C\\uDD7E\\uD83C\\uDD7F\\uD83C\\uDD8E\\uD83C\\uDD91-\\uD83C\\uDD9A]\\uFE0F?"
```

### [9. 键帽符号(#⃣, \*️⃣ and 0⃣-9⃣)](https://en.wikipedia.org/wiki/Basic_Latin_%28Unicode_block%29)

键帽符号一共有 12 个字符，其组成方式为： `U+0023`、 `U+002A` 和 `U+0030` ～ `U+0039` 12 个键帽基础字符加上 `U+FE0F` 和 `U+20E3`， 如：

```
"\u0023\u20E3" > "#⃣"

"\u002A\uFE0F\u20E3" > "*️⃣"

"\u0030\u20E3" > "0⃣"

"\u0039\u20E3" > "9⃣"
```

其中 `uFE0F` 是可选的，所以在 Java 中正则表达式为：

```
"[\\u0023\\u002A[\\u0030-\\u0039]]\\uFE0F?\\u20E3"
```

### [10. 箭头符号](https://en.wikipedia.org/wiki/Arrows_%28Unicode_block%29)

箭头符号中有 8 个 emoji 字符，范围为： `U+2194 ～ U+2199` 和 `U+21A9 ～ U+21AA` 或拼上 `U+FE0F`，在 Java 中正则表达式为：

```
"[\\u2194-\\u2199\\u21A9-\\u21AA]\\uFE0F?"
```

### [11. 杂项符号及箭头](https://en.wikipedia.org/wiki/Miscellaneous_Symbols_and_Arrows)

杂项符号及箭头中有 7 个 emoji 字符，分别为： `U+2B05` ～ `U+2B07`、 `U+2B1B`、 `U+2B1C`、 `U+2B50` 和 `U+2B55` 或拼上 `U+FE0F`，在 Java 中正则表达式为：

```
"[\\u2B05-\\u2B07\\u2B1B\\u2B1C\\u2B50\\u2B55]\\uFE0F?"
```

### [12. 补充箭头符号](https://en.wikipedia.org/wiki/Supplemental_Arrows-B)

补充箭头符号中有 2 个 emoji 字符，分别为： `U+2934` 和 `U+2935` 或拼上 `U+FE0F`，在 Java 中正则表达式为：

```
"[\\u2934\\u2935]\\uFE0F?"
```

### [13. CJK 符号和标点](https://en.wikipedia.org/wiki/CJK_Symbols_and_Punctuation)

CJK (Chinese, Japanese and Korean) 符号和标点中有两个 emoji 字符，分别为： `U+3030` 和 `U+303D` 或拼上 `U+FE0F`，在 Java 中正则表达式为：

```
"[\\u3030\\u303D]\\uFE0F?"
```

### [14. 封闭式 CJK 字母和月份符号](https://en.wikipedia.org/wiki/Enclosed_CJK_Letters_and_Months)

封闭式 CJK 字母和月份符号中有两个 emoji 字符，分别为：`U+3297` 和 `U+3299` 或拼上 `U+FE0F`，在 Java 中正则表达式为：

```
"[\\u3297\\u3299]\\uFE0F?"
```

### [15. 封闭式表意文字补充符号](https://en.wikipedia.org/wiki/Enclosed_Ideographic_Supplement)

封闭式表意文字补充符号中有 15 个 emoji 字符， 分别为： `U+1F201`、 `U+1F202`、 `U+1F21A`、 `U+1F22F`、 `U+1F232` ～ `U+1F23A`、 `U+1F250`、 `U+1F251` 或拼上 `U+FE0F`，在 Java 中正则表达式为：

```
"[\\uD83C\\uDE01\\uD83C\\uDE02\\uD83C\\uDE1A\\uD83C\\uDE2F\\uD83C\\uDE32-\\uD83C\\uDE3A\\uD83C\\uDE50\\uD83C\\uDE51]\\uFE0F?"
```

### [16. 一般标点](https://en.wikipedia.org/wiki/General_Punctuation)

一般标点符号中有 2 个 emoji 字符，分别为： `U+203C` 和 `U+2049` 或拼上 `U+FE0F`，在 Java 中正则表达式为：

```
"[\\u203C\\u2049]\\uFE0F?"
```

### [17. 几何图形](https://en.wikipedia.org/wiki/Geometric_Shapes)

几何图形中有 8 个 emoji 字符，分别为： `U+25AA`、 `U+25AB`、 `U+25B6`、 `U+25C0` 和 `U+25FB` ～ `U+25FE` 或拼上 `U+FE0F`，在 Java 中正则表达式为：

```
"[\\u25AA\\u25AB\\u25B6\\u25C0\\u25FB-\\u25FE]\\uFE0F?"
```

### [18. 拉丁文补充符号](https://en.wikipedia.org/wiki/Latin-1_Supplement_%28Unicode_block%29)

拉丁文补充符号中有 2 个 emoji 字符，分别为： `U+00A9` 和 `U+00AE` 或拼上 `U+FE0F`，在 Java 中正则表达式为：

```
"[\\u00A9\\u00AE]\\uFE0F?"
```

### [19. 字母符号](https://en.wikipedia.org/wiki/Letterlike_Symbols)

字母符号中有 2 个 emoji 字符，分别为： `U+2122` 和 `U+2139` 或拼上 `U+FE0F`，在 Java 中正则表达式为：

```
"[\\u2122\\u2139]\\uFE0F?"
```

### [20. 麻将牌](https://en.wikipedia.org/wiki/Mahjong_Tiles_%28Unicode_block%29)

麻将牌中只有一个 emoji 字符，为： `U+1F004` 或拼上 `U+FE0F`，在 Java 中正则表达式为：

```
"\\uD83C\\uDC04\\uFE0F?"
```

### [21. 扑克牌](https://en.wikipedia.org/wiki/Playing_cards_in_Unicode)

扑克牌中只有一个 emoji 字符，为： `U+1F0CF` 或拼上 `U+FE0F`，在 Java 中正则表达式为：

```
"\\uD83C\\uDCCF\\uFE0F?"
```

### [22. 杂项技术符号](https://en.wikipedia.org/wiki/Miscellaneous_Technical)

杂项技术符号中有 18 个 emoji 字符，分别为： `U+231A`、 `U+231B`、 `U+2328`、 `U+23CF`、 `U+23E9` ～ `U+23F3` 和 `U+23F8` ～ `U+23FA` 或拼上 `U+FE0F`，在 Java 中正则表达式为：

```
"[\\u231A\\u231B\\u2328\\u23CF\\u23E9-\\u23F3\\u23F8-\\u23FA]\\uFE0F?"
```

### 包含所有 emoji 的正则表达式

```
"(?:[\uD83C\uDF00-\uD83D\uDDFF]|[\uD83E\uDD00-\uD83E\uDDFF]|[\uD83D\uDE00-\uD83D\uDE4F]|[\uD83D\uDE80-\uD83D\uDEFF]|[\u2600-\u26FF]\uFE0F?|[\u2700-\u27BF]\uFE0F?|\u24C2\uFE0F?|[\uD83C\uDDE6-\uD83C\uDDFF]{1,2}|[\uD83C\uDD70\uD83C\uDD71\uD83C\uDD7E\uD83C\uDD7F\uD83C\uDD8E\uD83C\uDD91-\uD83C\uDD9A]\uFE0F?|[\u0023\u002A\u0030-\u0039]\uFE0F?\u20E3|[\u2194-\u2199\u21A9-\u21AA]\uFE0F?|[\u2B05-\u2B07\u2B1B\u2B1C\u2B50\u2B55]\uFE0F?|[\u2934\u2935]\uFE0F?|[\u3030\u303D]\uFE0F?|[\u3297\u3299]\uFE0F?|[\uD83C\uDE01\uD83C\uDE02\uD83C\uDE1A\uD83C\uDE2F\uD83C\uDE32-\uD83C\uDE3A\uD83C\uDE50\uD83C\uDE51]\uFE0F?|[\u203C\u2049]\uFE0F?|[\u25AA\u25AB\u25B6\u25C0\u25FB-\u25FE]\uFE0F?|[\u00A9\u00AE]\uFE0F?|[\u2122\u2139]\uFE0F?|\uD83C\uDC04\uFE0F?|\uD83C\uDCCF\uFE0F?|[\u231A\u231B\u2328\u23CF\u23E9-\u23F3\u23F8-\u23FA]\uFE0F?)"
```

### lodash 的解决方案

```js
(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff])[\ufe0e\ufe0f]?(?:[\u0300-\u036f\ufe20-\ufe23\u20d0-\u20f0]|\ud83c[\udffb-\udfff])?(?:\u200d(?:[^\ud800-\udfff]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff])[\ufe0e\ufe0f]?(?:[\u0300-\u036f\ufe20-\ufe23\u20d0-\u20f0]|\ud83c[\udffb-\udfff])?)*
```

关于`JavaScript`的讲解这里还有一篇比较全面的文章[传送门](https://medium.com/reactnative/emojis-in-javascript-f693d0eb79fb);
