# Javascript设计模式详解

- 2020.05.25

> 设计模式是一个高级工程师的必备技巧,也是评判一个工程师工作经验和能力的试金石.设计模式是前辈们多年工作经验的凝练和总结,能更大限度的优化代码以及对已有代码的合理重构.作为一名合格的前端工程师,学习设计模式是对自己工作经验的另一种方式的总结和反思,也是开发高质量,高可维护性,可扩展性代码的重要手段.


## 单例模式

> 保证一个类只有一个实例, 一般先判断实例是否存在,如果存在直接返回, 不存在则先创建再返回,这样就可以保证一个类只有一个实例对象.

![单例模式](https://img-blog.csdnimg.cn/20200525172611159.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

```js
(function(){
  // 养鱼游戏
  let fish = null
  function catchFish() {
    // 如果鱼存在,则直接返回
    if(fish) {
      return {
        fish,
        water: function() {
          let water = this.fish.getAttribute('weight')
          this.fish.setAttribute('weight', ++water)
        }
    }else {
      // 如果鱼不存在,则获取鱼再返回
      fish = document.querySelector('#cat')
      return {
        fish,
        water: function() {
          let water = this.fish.getAttribute('weight')
          this.fish.setAttribute('weight', ++water)
        }
      }
    }
  }

  // 每隔3小时喂一次水
  setInterval(() => {
    catchFish().water()
  }, 3*60*60*1000)
})()
```

## 构造器模式

> 用于创建特定类型的对象,以便实现业务逻辑和功能的可复用.

![构造器模式](https://img-blog.csdnimg.cn/20200525173955703.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

```js
function Tools(){
  if(!(this instanceof Tools)){
    return new Tools()
  }
  this.name = 'js工具库'
  // 获取dom的方法
  this.getEl = function(elem) {
    return document.querySelector(elem)
  }
  // 判断是否是数组
  this.isArray = function(arr) {
    return Array.isArray(arr)
  }
  // 其他通用方法...
}
```

## 建造者模式

> 将一个复杂的逻辑或者功能通过有条理的分工来一步步实现

![建造者模式](https://img-blog.csdnimg.cn/20200525174349829.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

```js
// canvas绘制图形验证码
(function(){
    function Gcode(el, option) {
        this.el = typeof el === 'string' ? document.querySelector(el) : el;
        this.option = option;
        this.init();
    }
    Gcode.prototype = {
        constructor: Gcode,
        init: function() {
            if(this.el.getContext) {
                isSupportCanvas = true;
                var ctx = this.el.getContext('2d'),
                // 设置画布宽高
                cw = this.el.width = this.option.width || 200,
                ch = this.el.height = this.option.height || 40,
                textLen = this.option.textLen || 4,
                lineNum = this.option.lineNum || 4;
                var text = this.randomText(textLen);
    
                this.onClick(ctx, textLen, lineNum, cw, ch);
                this.drawLine(ctx, lineNum, cw, ch);
                this.drawText(ctx, text, ch);
            }
        },
        onClick: function(ctx, textLen, lineNum, cw, ch) {
            var _ = this;
            this.el.addEventListener('click', function(){
                text = _.randomText(textLen);
                _.drawLine(ctx, lineNum, cw, ch);
                _.drawText(ctx, text, ch);
            }, false)
        },
        // 画干扰线
        drawLine: function(ctx, lineNum, maxW, maxH) {
            ctx.clearRect(0, 0, maxW, maxH);
            for(var i=0; i < lineNum; i++) {
                var dx1 = Math.random()* maxW,
                    dy1 = Math.random()* maxH,
                    dx2 = Math.random()* maxW,
                    dy2 = Math.random()* maxH;
                ctx.strokeStyle = 'rgb(' + 255*Math.random() + ',' + 255*Math.random() + ',' + 255*Math.random() + ')';
                ctx.beginPath();
                ctx.moveTo(dx1, dy1);
                ctx.lineTo(dx2, dy2);
                ctx.stroke();
            }
        },
        // 画文字
        drawText: function(ctx, text, maxH) {
            var len = text.length;
            for(var i=0; i < len; i++) {
                var dx = 30 * Math.random() + 30* i,
                    dy = Math.random()* 5 + maxH/2;
                ctx.fillStyle = 'rgb(' + 255*Math.random() + ',' + 255*Math.random() + ',' + 255*Math.random() + ')';
                ctx.font = '30px Helvetica';
                ctx.textBaseline = 'middle';
                ctx.fillText(text[i], dx, dy);
            }
        },
        // 生成指定个数的随机文字
        randomText: function(len) {
            var source = ['a', 'b', 'c', 'd', 'e',
            'f', 'g', 'h', 'i', 'j', 
            'k', 'l', 'm', 'o', 'p',
            'q', 'r', 's', 't', 'u',
            'v', 'w', 'x', 'y', 'z'];
            var result = [];
            var sourceLen = source.length;
            for(var i=0; i< len; i++) {
                var text = this.generateUniqueText(source, result, sourceLen);
                result.push(text)
            }
            return result.join('')
        },
        // 生成唯一文字
        generateUniqueText: function(source, hasList, limit) {
            var text = source[Math.floor(Math.random()*limit)];
            if(hasList.indexOf(text) > -1) {
                return this.generateUniqueText(source, hasList, limit)
            }else {
                return text
            }  
        }
    }
    new Gcode('#canvas_code', {
        lineNum: 6
    })
})();
// 调用
new Gcode('#canvas_code', {
  lineNum: 6
})
```

## 代理模式

> 一个对象通过某种代理方式来控制对另一个对象的访问

![代理模式](https://img-blog.csdnimg.cn/20200525174911465.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

```js
// 缓存代理
function sum(a, b){
  return a + b
}
let proxySum = (function(){
  let cache = {}
  return function(){
      let args = Array.prototype.join.call(arguments, ',');
      if(args in cache){
          return cache[args];
      }

      cache[args] = sum.apply(this, arguments)
      return cache[args]
  }
})()
```

## 外观模式

> 为子系统中的一组接口提供一个一致的表现,使得子系统更容易使用而不需要关注内部复杂而繁琐的细节

![外观模式](https://img-blog.csdnimg.cn/20200525175240145.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

```js
function on(type, fn){
  // 对于支持dom2级事件处理程序
  if(document.addEventListener){
      dom.addEventListener(type,fn,false);
  }else if(dom.attachEvent){
  // 对于IE9一下的ie浏览器
      dom.attachEvent('on'+type,fn);
  }else {
      dom['on'+ type] = fn;
  }
}
```

## 观察者模式

> 定义了一种一对多的关系, 所有观察对象同时监听某一主题对象,当主题对象状态发生变化时就会通知所有观察者对象,使得他们能够自动更新自己

![观察者模式](https://img-blog.csdnimg.cn/20200525180105905.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)


```js
class EventEmitter (){
    constructor(){
        this.maxListener = 20;
        this.observes = {};
    }

    on(name, fn){
        if(this.observes[name]){
            this.observes[name].push(fn);
            return this;
        }

        this.observes[name] = [fn];
        return this;
    }

    emit(name, ...args){
        this.observes[name].forEach(fn=> fn(...args));
        return this;
    }
}

const eventEmitter = new EventEmitter();

eventEmitter.on('hello',message => console.log('hello', message)));

eventEmitter.emit('world');// hello world

```

## 策略模式

>  策略模式将不同算法进行合理的分类和单独封装，让不同算法之间可以互相替换而不会影响到算法的使用者

![策略模式](https://img-blog.csdnimg.cn/20200525181616903.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

```js
const obj = {
  A: (num) => num * 4,
  B: (num) => num * 6,
  C: (num) => num * 8
}

const getSum =function(type, num) {
  return obj[type](num)
}
```

## 迭代器模式

> 提供一种方法顺序访问一个聚合对象中的各个元素,使用者并不需要关心该方法的内部表示

![迭代器模式](https://img-blog.csdnimg.cn/20200525182236852.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

```js
function _each(el, fn = (v, k, el) => {}) {
  // 判断数据类型
  function checkType(target){
    return Object.prototype.toString.call(target).slice(8,-1)
  }

  // 数组或者字符串
  if(['Array', 'String'].indexOf(checkType(el)) > -1) {
    for(let i=0, len = el.length; i< len; i++) {
      fn(el[i], i, el)
    }
  }else if(checkType(el) === 'Object') {
    for(let key in el) {
      fn(el[key], key, el)
    }
  }
}
```




