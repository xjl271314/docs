# 数字相关插件


## 数字滚轴效果 [odometer](https://github.hubspot.com/odometer/)

- 2020.10.21

> `odometer`是一款使用`javascript`和`css`构建的数字滚轴插件,可以平滑的展示数字的变化动画效果。

### 安装

```
npm i odometer
```

<odometer-demo1 />

```vue
<template>
  <div class="demo-wrap">
    <div class="number" ref="demo">{{ defaultNum }}</div>
  </div>
</template>
```

```js
const od = new Odometer({
    el: this.$refs.demo,
    value: 0,
    duration: 2000,
    dot: 0,
        animation: "count",
        format: "",
        theme: "coin-animate-defualt",
});

od.update(8888);
```
