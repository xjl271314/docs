# 代码分割

打包是个非常棒的技术，但随着你的应用增长，你的代码包也将随之增长。尤其是在整合了体积巨大的第三方库的情况下。你需要关注你代码包中所包含的代码，以避免因体积过大而导致加载时间过长。

为了避免搞出大体积的代码包，在前期就思考该问题并对代码包进行分割是个不错的选择。 

代码分割是由诸如 `Webpack`，`Rollup` 和 `Browserify（factor-bundle）`这类打包器支持的一项技术，能够创建多个包并在运行时动态加载。

对你的应用进行代码分割能够帮助你“懒加载”当前用户所需要的内容，能够显著地提高你的应用性能。尽管并没有减少应用整体的代码体积，但你可以避免加载用户永远不需要的代码，并在初始加载的时候减少所需加载的代码量。


## 动态import

在你的应用中引入代码分割的最佳方式是通过动态 `import()` 语法。

```js
// before
import { add } from './math';
console.log(add(16, 26));

// after
import("./math").then(math => {
  console.log(math.add(16, 26));
});
```

当 `Webpack` 解析到该语法时，会自动进行代码分割。

如果你使用 `Create React App`，该功能已开箱即用，你可以立刻使用该特性。`Next.js` 也已支持该特性而无需进行配置。

如果你自己配置 Webpack，你可能要阅读下 Webpack 关于代码分割的指南。你的 Webpack 配置应该类似于此。

当使用 Babel 时，你要确保 `Babel` 能够解析动态 `import` 语法而不是将其进行转换。对于这一要求你需要`babel-plugin-syntax-dynamic-import` 插件。

## React.lazy

:::warning
`React.lazy` 和 `Suspense` 技术还不支持服务端渲染。如果你想要在使用服务端渲染的应用中使用，我们推荐 `Loadable Components` 这个库。它有一个很棒的服务端渲染打包指南。
:::

```js
// before
import OtherComponent from './OtherComponent';

// after
const OtherComponent = React.lazy(() => import('./OtherComponent'));
```
> `React.lazy` 接受一个函数，这个函数需要动态调用 `import()`。它必须返回一个 `Promise`，该 `Promise` 需要 `resolve` 一个 `defalut export` 的 `React` 组件。

然后应在 `Suspense` 组件中渲染 `lazy` 组件，如此使得我们可以使用在等待加载 `lazy` 组件时做优雅降级（如 loading 指示器等）。

```js
const OtherComponent = React.lazy(() => import('./OtherComponent'));

function MyComponent() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <OtherComponent />
      </Suspense>
    </div>
  );
}
```
`fallback` 属性接受任何在组件加载过程中你想展示的 `React` 元素。你可以将 `Suspense` 组件置于懒加载组件之上的任何位置。你甚至可以用一个 `Suspense` 组件包裹多个懒加载组件。

```jsx
const OtherComponent = React.lazy(() => import('./OtherComponent'));
const AnotherComponent = React.lazy(() => import('./AnotherComponent'));

function MyComponent() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <section>
          <OtherComponent />
          <AnotherComponent />
        </section>
      </Suspense>
    </div>
  );
}
```