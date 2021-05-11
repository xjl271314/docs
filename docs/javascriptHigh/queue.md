# Javascript 中如何设计队列

- 2021.05.08

本文我们将介绍常见的数据结构---队列，并使用 javascript 的方式来实现他。

## 什么是队列?

> 队列是一种 `先入先出（FIFO` 数据结构。第一个入队的元素（FI）是第一个出队（FO），也就是`(FIFO,First In First Out)`结构。

:::tip
队列有 2 个指针：`头指针` 和 `尾指针`。队列中的最早排队的项目是在头部，而最新排队的项目在队列尾部。

**通俗一点的描述就是: 就像是我们排队去吃饭或者乘车,排在前面的人先服务，服务完了之后向后面的人服务。**
:::

![队列](https://img-blog.csdnimg.cn/20210508180800851.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

从更高的角度来看，队列是一种数据结构，可以让我们按照入库的顺序依次处理数据的每一项。

### 队列的操作

**队列主要操作主要是：**

1. 入队。
2. 出队。

此外，我们可能会发现执行队列的 `peek` 和 `length` 操作很有用。

- 入队操作:

> 入队操作是在队列尾部插入一个项目，插入的项目成为队列的尾部。

![入队](https://img-blog.csdnimg.cn/20210510203334375.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

上图中的入队操作将项目 8 插入到尾部，8 成为队列的尾部。

```js
queue.enqueue(8);
```

- 出队操作:

> 出队操作是在队列的开头导出项目，队列中的下一个项目成为头部项目。

![出队](https://img-blog.csdnimg.cn/20210510203508352.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

- 检视操作:

> 检视操作读取队列的开头，而不会更改队列。

![检视](https://img-blog.csdnimg.cn/20210510204210953.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

项目 7 是上图中的队列的开头，检视操作仅返回标头（项目）7，而无需修改队列。

```js
queue.peek(); // => 7
```

- 队列长度:

> 长度操作计算队列包含多少个项目。

![队列长度](https://img-blog.csdnimg.cn/20210510204456895.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

图中的队列中有 4 项：4，6，2，和 7，结果，队列长度为 4。

```js
queue.length; // => 4
```

## 队列操作时间复杂度

对于所有队列操作（入队，出队，检视和长度）重要的是，所有这些操作必须在固定时间内执行 O(1)。

恒定的时间 O(1)意味着无论队列大小如何（它可以有 10 或 100 万个项目）：入队，出队，窥视和长度操作都必须同时执行。

## 在 JavaScript 中实现队列

让我们看一下队列数据结构的可能实现，同时保持所有操作必须在恒定时间内执行的要求 O(1)。

```js
class Queue {
  constructor() {
    this.queueList = {};
    this.headIndex = 0;
    this.tailIndex = 0;
  }

  get length() {
    return this.tailIndex - this.headIndex;
  }

  enqueue(item) {
    this.queueList[this.tailIndex] = item;
    this.tailIndex++;
  }

  dequeue() {
    if (this.tailIndex - this.headIndex > 0) {
      const item = this.queueList[this.headIndex];
      delete this.queueList[this.headIndex];

      this.headIndex++;

      return item;
    }

    throw new Error("queue is empty!");
  }

  peek() {
    if (this.tailIndex - this.headIndex > 0) {
      return this.queueList[this.headIndex];
    }

    return null;
  }
}

// demo
const queue = new Queue();

queue.enqueue(7);
queue.enqueue(2);
queue.enqueue(6);
queue.enqueue(4);

queue.dequeue(); // => 7

queue.peek(); // => 2

queue.length; // => 3
```

## 队列方法的复杂性

类 `Queue` 的方法 `queue()`，`dequeue()`，`peek()` 和 `length()` 仅使用了：

属性访问（例如`this.queueList[this.headIndex]`）或执行算术操作（例如`this.headIndex++`）

因此，这些方法的时间复杂度是恒定时间 `O(1)`。
