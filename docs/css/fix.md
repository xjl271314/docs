# 适配相关

- 2020.05.18

## iPhone X系列安全区域适配问题

`iPhone X` 以及它以上的系列，都采用刘海屏设计和全面屏手势。头部、底部、侧边都需要做特殊处理。才能适配 `iPhone X` 的特殊情况。


### 1. 设置安全区域，填充危险区域，危险区域不做操作和内容展示。

:::tip
危险区域指头部不规则区域，底部横条区域，左右触发区域。
:::

具体操作为：`viewport-fit meta` 标签设置为 `cover`，获取所有区域填充。判断设备是否属于 `iPhone X`，给头部底部增加适配层

:::tip
`viewport-fit` 有 3 个值分别为：

- `auto`：此值不影响初始布局视图端口，并且整个web页面都是可查看的。
- `contain`：视图端口按比例缩放，以适合显示内嵌的最大矩形。
- `cover`：视图端口被缩放以填充设备显示。强烈建议使用 `safe area inset` 变量，以确保重要内容不会出现在显示之外。

:::

**设置 viewport-fit 为 cover**

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=yes, viewport-fit=cover">
```

**增加适配层**

使用 `safe area inset` 变量

```css
/* 适配 iPhone X 顶部填充*/
@supports (top: env(safe-area-inset-top)){
  body,
  .header{
      padding-top: constant(safe-area-inset-top, 40px);
      padding-top: env(safe-area-inset-top, 40px);
      padding-top: var(safe-area-inset-top, 40px);
  }
}
/* 判断iPhoneX 将 footer 的 padding-bottom 填充到最底部 */
@supports (bottom: env(safe-area-inset-bottom)){
    body,
    .footer{
        padding-bottom: constant(safe-area-inset-bottom, 20px);
        padding-bottom: env(safe-area-inset-bottom, 20px);
        padding-top: var(safe-area-inset-bottom, 20px);
    }
}
```

:::tip
`safe-area-inset-top`, `safe-area-inset-right`, `safe-area-inset-bottom`, `safe-area-inset-left` `safe-area-inset-*`由四个定义了视口边缘内矩形的 top, right, bottom 和 left 的环境变量组成,这样可以安全地放入内容，而不会有被非矩形的显示切断的风险。

对于矩形视口，例如普通的笔记本电脑显示器，其值等于零。对于非矩形显示器（如圆形表盘，iPhoneX 屏幕），在用户代理设置的四个值形成的矩形内，所有内容均可见。
:::


- 其中 `env()` 用法为 `env( <custom-ident> , <declaration-value>? )`，第一个参数为自定义的区域，第二个为备用值。

- 其中 `var()` 用法为 `var( <custom-property-name> , <declaration-value>? )`，作用是在 `env()` 不生效的情况下，给出一个备用值。

- `constant（`） 被 css 2017-2018 年为草稿阶段，是否已被标准化未知。而其他iOS 浏览器版本中是否有此函数未知，作为兼容处理而添加进去。