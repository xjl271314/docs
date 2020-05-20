# 布局技巧

## CSS 多列等高如何实现？

1. 利用`padding-bottom|margin-bottom`正负值相抵，不会影响页面布局的特点。父容器设置超出隐藏（overflow:
hidden），这样父容器的高度就还是它里面的列没有设定`padding-bottom`时的高度，当它里面的任一列高度增加了，则
父容器的高度被撑到里面最高那列的高度，其他比这列矮的列会用它们的padding-bottom补偿这部分高度差。

2. 利用`table-cell`所有单元格高度都相等的特性，来实现多列等高。

3. 利用`flex布局`中项目`align-items`属性默认为`stretch`，如果项目未设置高度或设为`auto`，将占满整个容器的高度
的特性，来实现多列等高。

## `width:auto` 和 `width:100%`的区别？

- `width:100%`会使元素box的宽度等于父元素的contentbox的宽度。

- `width:auto`会使元素撑满整个父元素，margin、border、padding、content区域会自动分配水平空间。


