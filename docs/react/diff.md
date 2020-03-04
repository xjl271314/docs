# Diff算法

![React Diff](https://img-blog.csdnimg.cn/20200303165633276.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

### 例子

假设DOM变更后如图所示:

![在这里插入图片描述](https://img-blog.csdnimg.cn/20200303170936305.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

```js
delete B
delete C
delete A
create B
create C
create A
```

### 引申

#### 为什么react组件中经常有一个key的概念？为什么不推荐使用index?

在`Element Diff`的时候会先收集`key`，`key`本身类似与身份证`id`，代表该组件的唯一`id`值，如果使用`index`的话，可能组件可能先删除一个然后又添加了一个，某些元素的`index`未发生变化，本身只要比较key就可以得出结论，现在需要做一个全量的比较，比较耗性能。


