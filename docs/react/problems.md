# 常见问题汇总

- 2020.05.15

## 解决控制台对`a`标签`href`属性使用`javascript:;`导致的`warning`


### 问题描述

> URLs starting with javascript: are a dangerous attack surface because it’s easy to accidentally include unsanitized output in a tag like `<a href>` and create a security hole.

> In React 16.9, this pattern continues to work, but it will log a warning. If you use javascript: URLs for logic, try to use React event handlers instead.

### 解决方案

> `href属性`值使用 `#`或者`#!`

```js
// before
<a href="javascript:;" onClick={onClick}>我是一个超链接</a>

// after
<a href="#!" onClick={onClick}>我是一个超链接</a>
```

