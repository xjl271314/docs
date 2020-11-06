# target和currentTarget的区别

- 2020.11.06

:::tip
- `target`表示的是当前触发事件的DOM元素(事件触发的目标)。

- `currentTarget`表示引用事件侦听器正在侦听的DOM元素(事件的真实注册者)。
:::

```html
<ul class="todo-list">
  <li class="item">Walk your dog</li>
</ul>
```

```js
const list = document.querySelector(".todo-list");

list.addEventListener("click", e => {
  console.log(e.target);
  // Output: <li class="item">Walk your dog</li>
  console.log(e.currentTarget);
  // Output: <ul class="todo-list"></ul>
});
```

上述例子中,我们点击了li然后冒泡到ul上,触发了ul上绑定的事件,这个触发上事件事件的触发目标是li(target),而事件是监听在ul(currentTarget)上的。


