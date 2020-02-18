# 无障碍功能

网络内容无障碍指南`（Web Content Accessibility Guidelines，WCAG）` 为开发无障碍网站提供了指南。

`React`通过使用标准`HTML`技术支持构建无障碍辅助网站。

:::tip
注意：`JSX` 支持所有 `aria-*` HTML 属性。

虽然大多数 `React` 的 `DOM` 变量和属性命名都使用驼峰命名（camelCased），但 `aria-*` 应该像其在 `HTML` 中一样使用带连字符的命名法（也叫诸如 `hyphen-cased`，`kebab-case`，`lisp-case`)。
:::

```jsx
<input
  type="text"
  aria-label={labelText}
  aria-required="true"
  onChange={onchangeHandler}
  value={inputValue}
  name="name"
/>
```

## 语义化的HTML

语义化的 `HTML` 是无障碍辅助功能网络应用的基础。 利用多种 `HTML` 元素来强化您网站中的信息通常可以使您直接获得无障碍辅助功能。

- 利用`Fragement`元素来组合组件

```jsx
import React, { Fragment } from 'react';

function ListItem({ item }) {
  return (
    <Fragment>
      <dt>{item.term}</dt>
      <dd>{item.description}</dd>
    </Fragment>
  );
}

function Glossary(props) {
  return (
    <dl>
      {props.items.map(item => (
        <ListItem item={item} key={item.id} />
      ))}
    </dl>
  );
}
```
:::tip
当你不需要在 `fragment` 标签中添加任何 `prop` 且你的工具支持的时候，你可以使用 `短语法`：
:::
```js
function ListItem({ item }) {
  return (
    <>
      <dt>{item.term}</dt>
      <dd>{item.description}</dd>
    </>
  );
}
```

## 无障碍表单

所有的 HTML 表单控制，例如 `<input>` 和 `<textarea>` ，都需要被标注来实现无障碍辅助功能。我们需要提供屏幕朗读器以解释性标注。

```html
<label htmlFor="namedInput">Name:</label>
<input id="namedInput" type="text" name="name"/>
```
