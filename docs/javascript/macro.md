# setTimeout、setImmediate、Process.nextTick

- setTimeount(IO观察者)

- setImmediate(check观察者)

- Process.nextTick(idle观察者)

## 优先级

Process.nextTick > setTimeount > setImmediate

## 为什么说setTimeout有个最小4ms的延迟?

- 2021.02.20

我们先来看一下`html standard`10-13描述中的定义:

```js
10. If timeout is less than 0, then set timeout to 0.
11. If nesting level is greater than 5, and timeout is less than 4, then set timeout to 4.
12. Increment nesting level by one.
13. Let task's timer nesting level be nesting level.
```

**从上面的规范可以看出来**：

- 如果设置的 timeout 小于 0，则设置为 0。

- 如果嵌套的层级超过了 5 层，并且 timeout 小于 4ms，则设置 timeout 为 4ms。

**看似我们已经找到了问题的原因，但是各大浏览器的厂商实际上并没有按照标准的规范进行设定**。

在这里我们只展示 chromium 的 source code，其他 webkit 或 Firefox 自行下载查看，在 chromium 的 blink 目录下，有一个 叫做 DOMTimer.cpp 的文件，online 地址，这里也是用来设置计时器延时的地方：

```c
static const int maxIntervalForUserGestureForwarding = 1000; // One second matches Gecko.
static const int maxTimerNestingLevel = 5;
static const double oneMillisecond = 0.001;
// Chromium uses a minimum timer interval of 4ms. We'd like to go
// lower; however, there are poorly coded websites out there which do
// create CPU-spinning loops.  Using 4ms prevents the CPU from
// spinning too busily and provides a balance between CPU spinning and
// the smallest possible interval timer.
static const double minimumInterval = 0.004;

double intervalMilliseconds = std::max(oneMillisecond, interval * oneMillisecond);
if (intervalMilliseconds < minimumInterval && m_nestingLevel >= maxTimerNestingLevel)
    intervalMilliseconds = minimumInterval;
```

代码逻辑很清晰，设置了三个常量：

- `maxTimerNestingLevel = 5`。也就是 HTML standard 当中提到的嵌套层级。

- `minimumInterval = 0.004`。也就是 HTML standard 当中说的最小延迟。

在第二段代码中我们会看到，首先会在 延迟时间 和 1ms 之间取一个最大值。换句话说，在不满足嵌套层级的情况下，最小延迟时间设置为 1ms。

在 chromium 的注释中，解释了为什么要设置 minimumInterval = 4ms。简单来讲，本身 chromium 团队想要设置更低的延迟时间（其实他们期望达到亚毫秒级别），但是由于某些网站（比如纽约时报的网站）对 setTimeout 这种计时器不良的使用，设置延迟过低会导致 CPU-spinning（在后面，我们再解释什么是 CPU-spinning），因此 chromium 做了些 benchmark 测试，选定了 4ms 作为其 minimumInterval。

**到这里为止，从浏览器厂商角度和 HTML standard 规范角度都解释了 4ms 的来源和其更加精确的定义,但是究竟是 HTML standard 先做出的设定，还是 Chromium 这种浏览器厂商先做出的设定。了解先后顺序的意义在于了解其背后历史，规范和厂商是如何相互促进与制衡的**。

这里补充一下操作系统层面的知识:

在windows下默认情况的 `timer resolution` 是 `10-15.6ms`,也就是最初的浏览器timer是依赖于操作系统层面的timer resolution的。换句话说,早期的setTimeout最小的延时至少会是 `10ms`。但从CPU的性能来讲,现在的CPU每秒计算可以达到4GHZ以上,而windows的默认timer并没有变化。

浏览器厂商认为默认计时器影响了网页的表达,如果clock tick很长，意味着浏览器会休眠很长的实际,从某一方面导致浏览器性能的下降。Chrome本身追求的是亚毫秒级(小于1ms),因此chrome团队希望可以改变浏览器对于操作系统timer的依赖,在windows和linux下采取了不同的方案来达到目的。最后chrome团队采用了和Flash和 Quicktime统一的 API 来代替系统默认的 timer resolution。

4ms的出现是后来市场反馈1ms的timer导致 CPU Spining等原因，从1ms提升到4ms之后大部分机器上都不再产生此现象。以致在后续的浏览器厂商的采用了4ms的设定。随后`HTML standard`才进行了相关规范的设定。

:::tip

**总结**

不同浏览器的最低时延会不一致，比如 chrome 的最低时延是 1ms。而如果 timer 嵌套层级很多，那么最低时延是 4ms。具体嵌套层级的阈值不同浏览器也不一致，HTML Standard 当中是 >5，chrome 当中是 >=5。

:::






