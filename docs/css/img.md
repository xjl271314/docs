# 实现div中图片高度自适应并与父级div宽度一致

```html
<div class="imgbox">
    <img src="upimg/comm2.png"/>
</div>
```

```scss
// 图片宽高比例自适应或者固定比例 
// 装图片的盒子imgbox，设置的padding-bottom，当该值为百分比属性时，是基于父元素宽度的百分比，所以这里设置100%的时候，就相当于形成了一个正方形。
// 宽高比16:9 （100%*9）/16
@mixin imgFixPercent($percent:100%) {
    position: relative;
    overflow: hidden;
    padding-bottom: $percent+%;
    >img {
        position: absolute;
        left: 0;
        top: 0;
        width:100%;
    }
}
```