# 使用 TypeScript 重构你的代码

- 2021.06.01

## Add Parameter（添加参数）

针对函数而言，在平常工作中经常会碰到函数中存在参数，当然不需要参数的也有。针对带有参数的函数推荐以下做法:

```js
// ① 函数参数 (理论上少于等于2个)
function createMenu(title, body, buttonText, cancellable) {
  ...other code
}
// ② 超过2个参数 使用对象统一传递
interface IMenuConfig {
  title?: string;
  body?: string;
  buttonText?: string;
  cancellable?: boolean;
}
const menuConfig: IMenuConfig = {
  title: 'Foo',
  body: 'Bar',
  buttonText: 'Baz',
  cancellable: true,
};

function createMenu(menuConfig: IMenuConfig) {}
```

上述代码解决了将多个参数合并成一个的问题，减少了过长的参数。

## Consolidate Conditional Expression（合并条件表达式）

很多场景下我们会写一堆的`if...else...`来进行某些逻辑的判断,针对一些一致的条件我们可以将其抽离为一个条件。我们来看看这段代码:

```js
interface ConfigFn {
  (): number;
}
const disabilityAmount: ConfigFn = (): number => {
  if (_seniority < 2) return 0;
  if (_monthsDisabled > 12) return 0;
  if (_isPartTime) return 0;
};
```

上面代码都在处理一个判断返回值。我们可以进行优化:

```js
const disabilityAmount: ConfigFn = (): number => {
    (_seniority < 2) || (_monthsDisabled > 12) || (_isPartTime)) return 0;
}
//继续改造
const isNotEligible = (): boolean=>{
    return  (_seniority < 2) || (_monthsDisabled > 12)||(_isPartTime));
}
const onVacation = (): boolean=>{}
const disabilityAmount = (): number => {
  // 这里也可以使用逻辑与继续更复杂的应用
  // if(isNotEligible){
  if(isNotEligible && onVacation){
        return 0;
   }
}
```

## Consolidate Duplicate Conditional Fragments（合并重复的条件片段）

比如说在我们进行接口请求的时候可能存在一些特殊场景的判断对应的请求参数会不一致:

```js
if (condition) {
  const data = {
    page: 1,
    params: {
      includeZero: true,
      includeName: true,
    },
  };
} else {
  const data = {
    page: 1,
    params: {
      includeZero: true,
      includeName: false,
    },
  };
}

return request(url, data);
```

我们可以把相同的参数片段提取出来。

```js
let data = {
  page: 1,
  params: {
    includeZero: true,
    includeName: false,
  },
};

if (condition) {
    data['includeName'] = true,
}

return request(url, data);
```
