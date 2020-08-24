# 动画技巧

## 如何实现类似gif效果一直循环的css动画

- 2020.08.24

> 实际开发场景中,使用gif图片的方式能够快速实现一些动图,但是由于gif的实现在某些设备上可能会产生毛边的效果。针对某一些动画效果实现起来并不复杂(css3动画就能支持)的循环动画,我们也可以通过css的方式来进行实现。

比如说有以下这么一个场景,产品想实现一个每隔10s,动画执行时间为1s的无限循环摇摆动画(css:transform:rotate(30deg))。

```css
/*
* 动画计算属性说明
* 不断执行 时间间隔为3s 每次执行2次
* 之前的动画时长为0.2s 所以总时间为3.2s 0.2s内执行2次 0.2s占总时长的6.25% 0.1s执行一次 占3.125% 
* 0.1s内抖动4次 每次占0.78125%
*/
@basePercent:0.78125;
@percents: @basePercent, @basePercent*2,@basePercent*3, @basePercent*4,@basePercent*5,@basePercent*6,@basePercent*7,@basePercent*8,100;
@fk: '{transform: rotate(0deg);}','{transform: rotate(-10deg);}','{transform: rotate(0deg);}','{transform: rotate(10deg);}','{transform: rotate(0deg);}','{transform: rotate(-10deg);}','{transform: rotate(0deg);}','{transform: rotate(10deg);}','{transform: rotate(0deg);}','{transform: rotate(0deg);})';

.generickeyframe(@name; @framelist; @frameprops){
     @keyframes @name{
        .loop-framelist(@index) when (@index <= length(@framelist)){
        @framepos: extract(@framelist, @index) * 1%;
        @{framepos}{
            @props: extract(@frameprops, @index);
            @props();
        }
        .loop-framelist(@index + 1);
        }
        .loop-framelist(1);
    }
}

.generickeyframe(huangDong; 0, @basePercent, @basePercent*2,@basePercent*3, @basePercent*4,@basePercent*5,@basePercent*6,@basePercent*7,@basePercent*8,100;
    {transform: rotate(0deg);},            
    {transform: rotate(-10deg);},
    {transform: rotate(0deg);},
    {transform: rotate(10deg);},
    {transform: rotate(0deg);},
    {transform: rotate(-10deg);},
    {transform: rotate(0deg);},
    {transform: rotate(10deg);},
    {transform: rotate(0deg);},
    {transform: rotate(0deg);}
);
```