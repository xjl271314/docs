# Svg动画属性详解

- 2020.05.28


## animate

> 动画元素放在形状元素的内部，用来定义一个元素的某个属性如何动态改变。在指定持续时间里，属性从开始值变成结束值。


这里展示了一个矩形形变的动画。

<svg-animate1 />

```html
<svg viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg">
  <rect width="10" height="10">
    <animate attributeName="rx" values="0;5;0" dur="10s" repeatCount="indefinite" />
  </rect>
</svg>
```

### 属性说明

| 参数名 | 描述
| :--- | :----
| attributeName | 动画属性名称
| attributeType | 动画类型
| from | 属性的初始值
| to   | 属性的止值
| dur  | 动画持续时间
| repeatCount | 动画重复次数


## animateTransform

> 变动了目标元素上的一个变形属性，从而允许动画控制转换、缩放、旋转或斜切。

<svg-animate2 />

```html
<svg width="120" height="120"  viewBox="0 0 120 120"
     xmlns="http://www.w3.org/2000/svg" version="1.1"
     xmlns:xlink="http://www.w3.org/1999/xlink" >

    <polygon points="60,30 90,90 30,90">
        <animateTransform attributeName="transform"
                          attributeType="XML"
                          type="rotate"
                          from="0 60 70"
                          to="360 60 70"
                          dur="10s"
                          repeatCount="indefinite"/>
    </polygon>
</svg>
```

## animateMotion

> 定义了一个元素如何沿着运动路径进行移动,这个动画属性很好的解决了CSS无法实现路径动画的问题

<svg-animate3 />