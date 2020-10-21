
# 代码规范部分参照

- 2020.07.27

## 提交格式要求

```xml
<type>(<scope>):<subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

- type 代表某次提交的类型,比如说是修复一个bug还是增加一个新的feature。所有类型如下:
    - `feat`: 新增feature。
    - `fix`: 修复bug。
    - `docs`: 仅仅修改了文档,比如README,CHANGELOG,CONTRIBUTE等等。
    - `style`: 仅仅修改了空格、格式缩进等。
    - `refactor`: 代码重构,没有新增功能或者修复bug。
    - `perf`: 优化相关,比如提升性能、体验等。
    - `test`: 测试用例,包括单元测试、集成测试等。
    - `chore`: 更改构建流程,或者增加依赖库、工具等。
    - `revert`: 回滚到上一个版本。