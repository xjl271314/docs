# 深入jsx

## React.createElement

> `jsx` 其实是 `React.createElement(component, props, ...children)` 函数的语法糖。

```jsx
// jsx
<MyButton color="blue" shadowSize={2}>
  Click Me
</MyButton>

// 转化后 标签名大写表示组件 标签名小写表示的是html标签
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

**源码部分(可选择观看)**
```jsx
//注意：react只写了3个参数，实际上，从第三个参数往后都是children
export function createElement(type, config, children) {
  let propName;

  // Reserved names are extracted
  const props = {};

  let key = null;
  let ref = null;
  let self = null;
  let source = null;
  // 赋给标签的props不为空时
  if (config != null) {
    if (hasValidRef(config)) {
      ref = config.ref;
    }
    if (hasValidKey(config)) {
      // 防止是Number类型 转化为字符串
      key = '' + config.key;
    }
    // __self、__source 暂时不知道是干啥用的属性
    self = config.__self === undefined ? null : config.__self;
    source = config.__source === undefined ? null : config.__source;
    // Remaining properties are added to a new props object
    for (propName in config) {
      //如果config中的属性不是标签原生属性，则放入props对象中
      if (
        hasOwnProperty.call(config, propName) &&
        !RESERVED_PROPS.hasOwnProperty(propName)
      ) {
        props[propName] = config[propName];
      }
    }
  }

  // Children can be more than one argument, and those are transferred onto
  // the newly allocated props object.
  //子元素数量
  const childrenLength = arguments.length - 2;
  if (childrenLength === 1) {
    props.children = children;
  } else if (childrenLength > 1) {
    const childArray = Array(childrenLength);
    //依次将children push进array中
    for (let i = 0; i < childrenLength; i++) {
      childArray[i] = arguments[i + 2];
    }
    //如果是development环境的话
    if (__DEV__) {
      //冻结array
      //未在微信发表
      //https://www.jianshu.com/p/91e5dc520c0d?utm_campaign=hugo&utm_medium=reader_share&utm_content=note&utm_source=weixin-friends&from=singlemessage&isappinstalled=0
      if (Object.freeze) {
        Object.freeze(childArray);
      }
    }
    //开发中写的this.props.children就是子元素的集合
    props.children = childArray;
  }

  // Resolve default props

  //为传入的props设置默认值，比如：
  //class Comp extends React.Component{
  //  static defaultProps = {
  //     aaa: 'one',
  //     bbb: () => {},
  //     ccc: {},
  //   };
  //
  // }

  if (type && type.defaultProps) {
    const defaultProps = type.defaultProps;
    for (propName in defaultProps) {
      //如果props数组中未设值，则设置默认值（注意：null也算设置了值）
      if (props[propName] === undefined) {
        props[propName] = defaultProps[propName];
      }
    }
  }

  if (__DEV__) {
    //一旦ref或key存在
    if (key || ref) {
      //如果type是组件的话，赋值displayName
      const displayName =
        typeof type === 'function'
          ? type.displayName || type.name || 'Unknown'
          : type;
      //可不看
      if (key) {
        defineKeyPropWarningGetter(props, displayName);
      }
      if (ref) {
        defineRefPropWarningGetter(props, displayName);
      }
    }
  }
  return ReactElement(
    type,  //'div'
    key,  //null
    ref,  //null
    self, //null
    source, //null
    ReactCurrentOwner.current, //null或Fiber
    props, //自定义的属性、方法，注意：props.children=childArray
  );
}

// hasValidRef()   判断是否设置了ref的属性,true有，false没有
function hasValidRef(config) {
  // 如果是development环境的话
  if (__DEV__) {
    // 如果config中存在ref属性的话
    // 在jQuery中 .call/.apply的更大作用是绑定this
    if (hasOwnProperty.call(config, 'ref')) {
      //Object.getOwnPropertyDescriptor() es5
      //Object.getOwnPropertyDescriptors() es6
      //https://blog.csdn.net/qq_30100043/article/details/53424963

      //返回对象config的属性ref 的get对象
      const getter = Object.getOwnPropertyDescriptor(config, 'ref').get;
      //如果isReactWarning，则忽略ref属性，返回false
      if (getter && getter.isReactWarning) {
        return false;
      }
    }
  }
  //<div ref={this.optionsTEchart} ></div>
  return config.ref !== undefined;
}

function hasValidKey(config) {
  if (__DEV__) {
    if (hasOwnProperty.call(config, 'key')) {
      const getter = Object.getOwnPropertyDescriptor(config, 'key').get;
      if (getter && getter.isReactWarning) {
        return false;
      }
    }
  }
  return config.key !== undefined;
}

```
## ReactElement()

通过工厂模式创建`React.Element`对象，你打印一个React组件的话，会是下面这个样子：

![在这里插入图片描述](https://img-blog.csdnimg.cn/20200218151605636.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

```jsx
/**
 * Factory method to create a new React element. This no longer adheres to
 * the class pattern, so do not use new to call it. Also, no instanceof check
 * will work. Instead test $$typeof field against Symbol.for('react.element') to check
 * if something is a React Element.
 *
 * @param {*} type
 * @param {*} props
 * @param {*} key
 * @param {string|object} ref
 * @param {*} owner
 * @param {*} self A *temporary* helper to detect places where `this` is
 * different from the `owner` when React.createElement is called, so that we
 * can warn. We want to get rid of owner and replace string `ref`s with arrow
 * functions, and as long as `this` and owner are the same, there will be no
 * change in behavior.
 * @param {*} source An annotation object (added by a transpiler or otherwise)
 * indicating filename, line number, and/or other information.
 * @internal
 */

// type,  //'div'
// key,  //null
// ref,  //null
// self, //null
// source, //null
// ReactCurrentOwner.current, //null或Fiber
// props, //自定义的属性、方法，注意：props.children=childArray
const ReactElement = function(type, key, ref, self, source, owner, props) {
  const element = {
    // This tag allows us to uniquely identify this as a React Element
    //标识element的类型
    //因为jsx都是通过createElement创建的，所以ReactElement的类型固定:为REACT_ELEMENT_TYPE
    //重要！因为react最终渲染到DOM上时，需要判断$$typeof===REACT_ELEMENT_TYPE
    $$typeof: REACT_ELEMENT_TYPE,

    // Built-in properties that belong on the element
    //设置元素的内置属性
    type: type,
    key: key,
    ref: ref,
    props: props,

    // Record the component responsible for creating this element.
    //记录创建react.element的组件（this？）
    _owner: owner,
  };

  if (__DEV__) {
    // The validation flag is currently mutative. We put it on
    // an external backing store so that we can freeze the whole object.
    // This can be replaced with a WeakMap once they are implemented in
    // commonly used development environments.

    //验证flag是不固定的.我们将其放置在一个store上，从而能冻结整个object
    //这样一旦它们被用在开发环境时，用WeakMap代替

    //WeakMap
    // http://es6.ruanyifeng.com/#docs/set-map
    element._store = {};

    // To make comparing ReactElements easier for testing purposes, we make
    // the validation flag non-enumerable (where possible, which should
    // include every environment we run tests in), so the test framework
    // ignores it.
    //方便测试用
    Object.defineProperty(element._store, 'validated', {
      configurable: false,
      enumerable: false,
      writable: true,
      value: false,
    });
    // self and source are DEV only properties.
    Object.defineProperty(element, '_self', {
      configurable: false,
      enumerable: false,
      writable: false,
      value: self,
    });
    // Two elements created in two different places should be considered
    // equal for testing purposes and therefore we hide it from enumeration.
    Object.defineProperty(element, '_source', {
      configurable: false,
      enumerable: false,
      writable: false,
      value: source,
    });
    if (Object.freeze) {
      Object.freeze(element.props);
      Object.freeze(element);
    }
  }

  return element;
};
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


