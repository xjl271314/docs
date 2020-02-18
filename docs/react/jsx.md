# 深入jsx

## React.createElement

> `jsx` 其实是 `React.createElement(component, props, ...children)` 函数的语法糖。

```jsx
// jsx
<MyButton color="blue" shadowSize={2}>
  Click Me
</MyButton>

// 转化后
React.createElement(
  MyButton,
  {color: 'blue', shadowSize: 2},
  'Click Me'
)

// 没有子节点
<div className="sidebar" />

React.createElement(
  'div',
  {className: 'sidebar'},
  null
)
```

## 自定义组件

**用户定义的组件必须以大写字母开头**

以小写字母开头的元素代表一个 `HTML` 内置组件，比如 `<div>` 或者 `<span>` 会生成相应的字符串 `'div'` 或者 `'span'` 传递给 `React.createElement`（作为参数）。

大写字母开头的元素则对应着在 `JavaScript` 引入或自定义的组件，如 `<Foo />` 会编译为 `React.createElement(Foo)`。

## Props 默认值为 “True”

**如果你没给 `prop` 赋值，它的默认值是 `true`。以下两个 JSX 表达式是等价的：**

```jsx
<MyTextBox autocomplete />

<MyTextBox autocomplete={true} />
```

## 布尔类型、`Null` 以及 `Undefined` 将会忽略

**`false`, `null`, `undefined`, and `true` 是合法的子元素。但它们并不会被渲染。以下的 `JSX` 表达式渲染结果相同：**

```html
<div />

<div></div>

<div>{false}</div>

<div>{null}</div>

<div>{undefined}</div>

<div>{true}</div>
```

