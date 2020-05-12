# 缓存算法(页面置换算法)之LRU算法

- 2020.04.27

> LRU（Least Recently Used：最近最少使用）.假设我们有一个缓存数组，数量为5，里面存放了5个最近被访问的页面。当我们又去访问一个页面的时候，根据此类算法会将最近最少被访问到的页面移除缓存。

## 一道leetCode的原题

:::tip
运用你所掌握的数据结构，设计和实现一个  LRU (最近最少使用) 缓存机制。它应该支持以下操作： 获取数据 `get` 和 写入数据 `put` 。

获取数据 `get(key)` - 如果`密钥 (key)` 存在于缓存中，则获取密钥的值（总是正数），否则返回 -1。

写入数据 `put(key, value)` - 如果密钥已经存在，则变更其数据值；如果密钥不存在，则插入该组「密钥/数据值」。

当缓存容量达到上限时，它应该在写入新数据之前删除最久未使用的数据值，从而为新的数据值留出空间。
:::

### 示例:

```js
LRUCache cache = new LRUCache( 2 /* 缓存容量 */ );

cache.put(1, 1);
cache.put(2, 2);
cache.get(1);       // 返回  1
cache.put(3, 3);    // 该操作会使得密钥 2 作废
cache.get(2);       // 返回 -1 (未找到)
cache.put(4, 4);    // 该操作会使得密钥 1 作废
cache.get(1);       // 返回 -1 (未找到)
cache.get(3);       // 返回  3
cache.get(4);       // 返回  4
```

### 思路:

1. 维护一个堆栈，最近访问的在最底层，最近最少访问的在最上层。
2. 当堆栈满了，有新的元素进栈时，将最上层的元素出栈，将新元素放到栈尾。
3. 当访问已经存在于堆栈的中的老元素，将老元素放到堆栈的最后一位，其他元素往前补位。


```JS
/**
 * LRUCache类
 * @param {number} capacity
 */
const LRUCache = function(capacity)  {
    // 维护一个堆栈来进行缓存，最近使用的在最后面，最久没使用的在第一个
    this.cacheMap = new Map();
    this.capacity = capacity;
};

/** 
 * get方法
 * @param {number} key
 * @return {number}
 */
LRUCache.prototype.get = function(key) {
    if(this.cacheMap.has(key)){
        // 有命中，更改该值在堆栈中的顺序
        let temp = this.cacheMap.get(key);
        this.cacheMap.delete(key);
        this.cacheMap.set(key, temp);
        return temp;
    }
    return -1;
};

/** 
 * put方法
 * @param {number} key 
 * @param {number} value
 * @return {void}
 */
LRUCache.prototype.put = function(key, value) {
    if(this.cacheMap.has(key)){
        // 命中，改变顺序即可
        this.cacheMap.delete(key);
        this.cacheMap.set(key, value)
    }
    else{
        // 没命中
        if(this.cacheMap.size >= this.capacity){
            // 堆栈已满，清除第一个数据
            // map的keys函数返回一个迭代器，然后用一次next就能获取第一个元素
            let firstKey = this.cacheMap.keys().next().value;
            this.cacheMap.delete(firstKey);
            this.cacheMap.set(key, value)
        }
        else{
            // 堆栈未满，存数据
            this.cacheMap.set(key, value)
        }
    }
};
```