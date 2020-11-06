# 微信小程序组件注意事项


## icon图标

基础库 `1.0.0` 开始支持，低版本需做兼容处理。

:::warning
组件属性的长度单位默认为`px`，2.4.0起支持传入单位`(rpx/px)`。
:::

| 参数名 | 参数类型 | 参数描述 | 是否必传 | 默认值 | 最低版本
| :---- | :---- | :---- | :---- | :---- | :---- | 
| `type` | `String` | 有效值`success`、`success_no_circle`、`info`、`warn`、`waiting`、`cancel`、`download`、`search`、`clear` | - | - | 1.0.0
| `size`| `String`、`Number` | icon的尺寸大小 | - | - | 1.0.0
| `color`| `String` | icon的颜色,同CssColor | - | - | 1.0.0

### tabBar中的icon尺寸规则

标准规范上tabBar中使用的icon图标需要满足以下条件:

1. 尺寸大小为81*81,不支持自定义大小(可以通过外部填充透明色的图片来变相更改图片的大小)。
2. 需要使用png格式的图片。
3. 尺寸大小不要超过40KB。

### color改变的是什么颜色?

color改变的是整个icon的颜色,中间的是镂空的。

### 有时候真机上icon显示空白是什么原因?

1. 如果是自定义实现的图标,注意检查下字体格式等问题,是不是由于兼容性问题导致,小程序中推荐使用 `TTF` 和 `WOFF` 格式的字体。


## progress进度条


### 如何让进度条再播放完的时候再次播放一次动画?

```js
// 当动画执行完成 进度加载完
onAnimationEnd(){
    this.setData({ percent: 0 });
    this.setData({ percent: 100 });
}
```

由于小程序通信本身是执行底层的`evaluateJavascript`脚本,本身就是要消耗时间的,所以两次的`setData`是最简单有效的解决方案。

### 如何设计实现一个环形进度条?

可参考使用svg绘制的形式来实现。

## rich-text

## movable-area 和 movable-view

- 2020.11.02

基础库 1.2.0 开始支持，低版本需做兼容处理。

这两个标签需要配合使用,其中`movable-area`是`movable-view`的可移动区域。`movable-view`是可移动的视图容器，在页面中可以拖拽滑动。`movable-view`必须在 `movable-area` 组件中，并且必须是直接子节点，否则不能移动。

:::tip
1. `movable-area` 必须设置`width`和`height`属性，不设置默认为`10px`。

2. 当`movable-view`小于`movable-area`时，`movable-view`的移动范围是在`movable-area`内。

3. 当`movable-view`大于`movable-area`时，`movable-view`的移动范围必须包含`movable-area`（x轴方向和y轴方向分开考虑）。
:::

**movable-area**

| 参数名 | 参数类型 | 参数描述 | 是否必传 | 默认值 | 最低版本
| :---- | :---- | :---- | :---- | :---- | :---- | 
| `scale-area` | Boolean | 当里面的`movable-view`设置为支持双指缩放时，设置此值可将缩放手势生效区域修改为整个`movable-area` | 否 | false | 1.9.90

**movable-view**

| 参数名 | 参数类型 | 参数描述 | 是否必传 | 默认值 | 最低版本
| :---- | :---- | :---- | :---- | :---- | :---- | 
| `direction` | string | `movable-view`的移动方向，属性值有`all`、`vertical`、`horizontal`、`none` | 否 | none | 1.2.0 | 
| `inertia` | boolean | `movable-view`是否带有惯性 | 否 | false | 1.2.0 | 
| `out-of-bounds` | boolean | 超过可移动区域后，movable-view是否还可以移动 | 否 | false | 1.2.0 | 
| `x` | number | 定义x轴方向的偏移，如果x的值不在可移动范围内，会自动移动到可移动范围；改变x的值会触发动画 | 否 | false | 1.2.0 | 
| `y` | number | 定义y轴方向的偏移，如果y的值不在可移动范围内，会自动移动到可移动范围；改变y的值会触发动画 | 否 | false | 1.2.0 | 
| `damping` | number | 阻尼系数，用于控制x或y改变时的动画和过界回弹的动画，值越大移动越快 | 否 | 20 | 1.2.0 | 
| `friction` | number | 摩擦系数，用于控制惯性滑动的动画，值越大摩擦力越大，滑动越快停止；必须大于0，否则会被设置成默认值 | 否 | 2 | 1.2.0 | 
| `disabled` | boolean | 是否禁用 | 否 | false | 1.9.90 | 
| `scale` | boolean | 是否支持双指缩放，默认缩放手势生效区域是在`movable-view`内 | 否 | false | 1.9.90 | 
| `scale-min` | number | 定义缩放倍数最小值 | 否 | 0.5 | 1.9.90 | 
| `scale-max` | number | 定义缩放倍数最大值 | 否 | 10 | 1.9.90 | 
| `scale-value` | number | 定义缩放倍数，取值范围为 0.5 - 10 | 否 | 1 | 1.9.90 | 
| `animation` | boolean | 是否使用动画 | 否 | true | 2.1.0 | 
| `bindchange` | eventhandle | 拖动过程中触发的事件，`event.detail = {x, y, source}` | 否 | - | 1.9.90 | 
| `bindscale` | eventhandle | 缩放过程中触发的事件，`event.detail = {x, y, scale}`，x和y字段在2.1.0之后支持 | 否 | - | 1.9.90 | 
| `htouchmove` | eventhandle | 初次手指触摸后移动为横向的移动时触发，如果`catch`此事件，则意味着`touchmove`事件也被`catch` | 否 | - | 1.9.90 | 
| `vtouchmove` | eventhandle | 初次手指触摸后移动为纵向的移动时触发，如果`catch`此事件，则意味着`touchmove`事件也被`catch` | 否 | - | 1.9.90 | 

** bindchange 返回的 source 表示产生移动的原因 **

| 参数名 | 参数描述 
| :---- | :---- |
| touch	| 拖动
| touch-out-of-bounds | 超出移动范围
| out-of-bounds | 超出移动范围后的回弹
| friction | 惯性
| 空字符串 | setData

### 基于movable-view实现可滑动删除的组件


```wxml


```