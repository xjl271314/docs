# try-catch语句

try-catch常用于兼容性写法。

## 在try-catch语句中,使用try时进行return操作,finally语句会执行么?

- 2020.11.9

```js
function foo (){
    try {
        return 0;
    }catch(err){
        console.error(err);
    }finally{
        console.log('finally');
    }
}

// finally return 0;
console.log(foo());
```

上述代码执行结果是`finally`确实执行了,而且`return`语句也生效了,函数返回了0；

但是虽然return语句执行了,函数并没有立即返回,又执行了finally里面的内容,这样的行为违背了很多人的直觉。

假如将`finally`中的代码也返回`return`,那么执行结果将会是什么?

```js
function foo (){
    try {
        return 0;
    }catch(err){
        console.error(err);
    }finally{
        return 'finally';
    }
}

// finally 
console.log(foo());
```

上述代码的执行结果是: `finally`中的`return`覆盖了 `try`中的 `return`。在一个函数中执行了两次return,这已经超出了很多人的常识,也是其他语言中不会出现的一种行为。

产生上述执行结果的实质原因是背后运行的`Completion Record`机制。

### Completion Record机制

表示一个语句执行完成之后的结果,它有3个字段:

1. `type:` 表示完成的类型,有`break`、`continue`、`return`、`throw`和`normal`几种类型。

2. `value:` 表示语句的返回值,如果语句没有返回值,则是`empty`。

3. `target:` 表示语句的目标,通常是一个javascript标签。

`Javascript`正是依靠语句的`Completion Record类型`才可以在语句的复杂嵌套结构中,实现各种控制。


理解这块内容之前先来看看语句的分类:

![语句分类](https://img-blog.csdnimg.cn/20201109112733669.jpg?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70#pic_center)

#### 普通语句

这些语句在执行时,从前到后顺次执行,没有任何分支或者重复执行逻辑。

普通语句执行完成后,会得到`type`为`normal`的`Completion Record`, javascript引擎遇到这样的记录就会执行下一条语句。

这些语句中只有`表达式语句`会产生value,从引擎的角度,这个value并没有什么用处,这就像我们在Chrome的控制台调式工具中输入一个表达式是可以得到结果的,但是在表达式前面加上var,就变成了`undefined`。这也说明了Chrome控制台输出的是语句的`Completion Record`的value值。

#### 语句块

语句块就是拿大括号括起来的一组语句,它是一种语句的复合结构,可以嵌套。

在使用语句块的时候,我们需要注意的是语句块内部的`Completion Record`type如果不是normal的话,就会打断语句块后续的执行。

#### 控制型语句

控制型语句带有if、switch关键字,它们会对不同类型的`Completion Record`产生反应。

![控制型语句](https://img-blog.csdnimg.cn/20201109135343908.jpg?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70#pic_center)


通过这个表我们发现,因为finally中的内容必须保证执行,所以try/catch执行完毕,即使得到的结果是非normal类型的完成记录,也必须要执行finally。

而当finally执行也得到了了非normal的记录,则会是finally中的记录作为整个try结构的结果。

#### 带标签的语句

前文阐述了一些type在语句中的作用,接下来涉及到target。

实际上,任何javascript语句是可以加标签的,在语句前面加冒号即可:

```js
firstStatement: var a = 1;
```

大部分的时候,这个东西类似于注释,没有任何作用。唯一有作用的时候是: 与完成记录类型中的target相配合,用于跳出多层循环。

```js
outer: while(true){
    inner: while(true){
        break outer;
    }
}

console.log('finished');
```
break/continue 语句如果后跟了关键字,会产生带target的完成记录。一旦完成记录带了target,那么只有拥有对应label的循环语句会消费它。

:::tip

总结:

因为`Javascript`语句存在嵌套关系,所以只需过程实际上主要在一个树形结构上进行,树形结构的每一个节点执行后产生`Completion Record`,根据语句的结构和`Completion Record`,`Javascript`实现了各种分支合跳出逻辑。
:::