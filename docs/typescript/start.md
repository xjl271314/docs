# 基础知识

- 2021.04.08

## 安装

```js
npm install typescript -g
```

使用全局安装的好处就是可以在任何地方使用`tsc`命令,如我们常见的初始化一个`tsconfig.json`只需要 `tsc --init`即可。

## 强类型语言与弱类型语言

- 强类型语言:

> 不允许改变变量的类型,除非进行强制类型转换。

例如: `Java`、`C++`、`Python`;

```java
class C {
    public static void main(String[] args){
        int x = 1;
        boolean y = true;
        x = y; // Error: incompatible types: boolean can not covert to int;

        char z = 'a';
        x = z; // 强制类型转化: 97 会将a的ACSII码转化为整形 赋值给x

        System.out.println(x);
    }
}

```
- 弱类型语言:

> 变量可以被赋值不同的类型。

例如: `JavaScript`;

```js
let a = 1;
let b = 'hello';
let c = true;

a = b; // hello
a = c; // true
```

## 静态类型语言与动态类型语言

- 静态类型语言

> 在编译阶段确定所有变量的类型。

例如: `C++`;

```c++
class C {
    public:
        int x;
        int y;
}

int add(C a,C b){
    return a.x + b.y;
}
```

- 动态类型语言

> 在程序执行阶段确定所有变量的类型。

例如: `JavaScript`;

```js
function add(x, y){
    return x + y;
}

add(1,2) // 3
add(1,'2') // 12
```


