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




