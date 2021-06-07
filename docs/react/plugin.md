# 常用插件合集

- 2021.05.20

## react-drabble

> 用于生成可拖拽的组件。[示例集合:](https://mzabriskie.github.io/react-draggable/example/)

### 安装

```
npm install react-draggable
yarn add react-draggable
```

### 基础使用

```js
import React from "react";
import ReactDOM from "react-dom";
import Draggable from "react-draggable";

class App extends React.Component {
  eventLogger = (e: MouseEvent, data: Object) => {
    console.log("Event: ", e);
    console.log("Data: ", data);
  };

  render() {
    return (
      <Draggable
        axis="x"
        handle=".handle"
        defaultPosition={{ x: 0, y: 0 }}
        position={null}
        grid={[25, 25]}
        scale={1}
        onStart={this.handleStart}
        onDrag={this.handleDrag}
        onStop={this.handleStop}
      >
        <div>
          <div className="handle">Drag from here</div>
          <div>This readme is really dragging on...</div>
        </div>
      </Draggable>
    );
  }
}

ReactDOM.render(<App />, document.body);
```

### 属性说明

| 参数名                     | 参数类型                                                                                 | 参数描述                                                                                                                                                                                               |
| :------------------------- | :--------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `allowAnyClick`            | `boolean`                                                                                | 设置为 `true` 的时候允许非左键点击拖拽                                                                                                                                                                 |
| `axis`                     | `string`                                                                                 | **定义组件的可拖拽方向。**<br/><br/>11. 设置为 `both` 的时候允许横向、竖向拖拽。<br/>2. 设置为`x`的时候允许横向拖拽。<br/>3. 设置为`y`的时候允许竖向拖拽。 <br/>4. 设置为`none`的时候不允许拖拽。      |
| `bounds`                   | `{`<br/> `left?: number,top?: number,`<br/>`right?: number,bottom?: number` `} | string` | **定义组件的可拖拽边界。** <br/><br/>1. 当设置为`parent`时 会在组件节点的父节点下移动。 <br/>2. 当设置为`selector`容器时，会在容器内部移动。<br /> 3. 当设置`left`等属性的时候会在自定义的范围内移动。 |
| `cancel`                   | `string`                                                                                 | 用于指定放置拖动初始化配置的选择器。类似`.first, .second, .body`等。                                                                                                                                   |
| `defaultClassName`         | `string`                                                                                 | 用于指定拖拽组件默认样式名。                                                                                                                                                                           |
| `defaultClassNameDragging` | `string`                                                                                 | 用于指定拖拽组件拖拽中样式名。                                                                                                                                                                         |
| `defaultClassNameDragged`  | `string`                                                                                 | 用于指定拖拽组件拖拽完成样式名。                                                                                                                                                                       |
| `defaultPosition`          | `{ x: number,y: number }`                                                                | **定义组件初始拖动的位置。** <br/><br/>                                                                                                                                                                |
| `disabled`                 | `boolean`                                                                                | 设置为`true`的时候禁止拖动                                                                                                                                                                             |
| `grid`                     | `[number, number]`                                                                       | 设置组件拖拽时的捕捉到的 x、y                                                                                                                                                                          |
| `handle`                   | `string`                                                                                 | 指定一个选择器用作启动拖动的句柄。                                                                                                                                                                     |
| `offsetParent`             | `HTMLElement`                                                                            | 指定组件的父容器。                                                                                                                                                                                     |
| `onMouseDown`              | `(e: MouseEvent) => void`                                                                | `onMouseDown`事件回调。                                                                                                                                                                                |
| `onStart`                  | `DraggableEventHandler`                                                                  | 当组件开始拖拽的时候触发。                                                                                                                                                                             |
| `onDrag`                   | `DraggableEventHandler`                                                                  | 当组件拖拽时触发。                                                                                                                                                                                     |
| `onStop`                   | `DraggableEventHandler`                                                                  | 当组件拖拽结束时候触发。                                                                                                                                                                               |
| `nodeRef`                  | `React.Ref<typeof React.Component>`                                                      | 用于解决在`React`严格模式下`ReactDOM.findDOMNode()`被废弃的场景。                                                                                                                                      |
| `position`                 | `{ x: number,y: number }`                                                                | 设置`position`属性的时候组件会变成受控组件。                                                                                                                                                           |
| `positionOffset`           | `{ x: number,y: number } | string`                                                       | 设置组件件初始偏移位置。                                                                                                                                                                               |
| `scale`                    | `number`                                                                                 | 设置组件缩放比例。                                                                                                                                                                                     |

## react-use

> 一个丰富多彩的 `react-hooks` 组件库。[传送门](https://github.com/streamich/react-use)

### 安装

```
npm i react-use
yarn add react-use
```

### 示例说明

- #### 传感器相关

| Hooks 名称                                                                                        | Hooks 说明                                                                                                                                         |
| :------------------------------------------------------------------------------------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------- |
| [useBattery](https://github.com/streamich/react-use/blob/master/docs/useBattery.md)               | 追踪设备的电池相关状态                                                                                                                             |
| [useGeolocation](https://github.com/streamich/react-use/blob/master/docs/useGeolocation.md)       | 追踪设备的 geo 定位相关信息                                                                                                                        |
| [useHover and useHoverDirty](https://github.com/streamich/react-use/blob/master/docs/useHover.md) | 监听元素的 mouse 相关事件                                                                                                                          |
| [useHash ](https://github.com/streamich/react-use/blob/master/docs/useHash.md)                    | 设置 Hash 值                                                                                                                                       |
| [useIdle ](https://github.com/streamich/react-use/blob/master/docs/useIdle.md)                    | 反应传感器挂钩，用于跟踪页面上的用户是否空闲。                                                                                                     |
| [useIntersection ](https://github.com/streamich/react-use/blob/master/docs/useIntersection.md)    | 反应传感器挂钩，用于跟踪目标元素与祖先元素或顶层文档的视口的交集中的变化。使用 `IntersectionObserver API` 并返回一个 `IntersectionObserverEntry`。 |
| [useKey](https://github.com/streamich/react-use/blob/master/docs/useKey.md)                       | 反应传感器挂钩，用于监听键盘按钮点击事件。                                                                                                         |
| [useKeyPress](https://github.com/streamich/react-use/blob/master/docs/useKeyPress.md)             | 反应传感器挂钩，用于监听键盘按钮点击事件。                                                                                                         |
| [useKeyboardJs](https://github.com/streamich/react-use/blob/master/docs/useKeyboardJs.md)         | 反应传感器挂钩，用于监听键盘多个按钮同时点击事件。                                                                                                 |
| [useKeyPressEvent](https://github.com/streamich/react-use/blob/master/docs/useKeyPressEvent.md)   | 反应传感器挂钩，用于监听 useKey 的按压事件,但是此事件仅会触发一次，比如说你先按住了某个键，过了一会才房放掉，但是也仅会触发一次 keydwon 事件。     |
| [useLocation](https://github.com/streamich/react-use/blob/master/docs/useLocation.md)             | 监听 navigation 导航相关。                                                                                                                         |
| [useSearchParam](https://github.com/streamich/react-use/blob/master/docs/useSearchParam.md)       | 监听 location 下参数相关。                                                                                                                         |
| [useLongPress](https://github.com/streamich/react-use/blob/master/docs/useLongPress.md)           | 监听某个元素的长按事件。                                                                                                                           |
