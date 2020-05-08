# 使用recompose优化你的React组件

- 2020.05.07

文章参考:[原文地址](https://zhuanlan.zhihu.com/p/42494044)

## 优化前的代码

```jsx
// form.js
import React from "react";
import { TextField, Button, Grid } from "@material-ui/core";
import axios from 'axios';

class SignupForm extends React.Component {
  state = {
    email: "",
    emailError: "",
    password: "",
    passwordError: "",
    confirmPassword: "",
    confirmPasswordError: ""
  };

  getEmailError = email => {
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    const isValidEmail = emailRegex.test(email);
    return !isValidEmail ? "Invalid email." : "";
  };

  validateEmail = () => {
    const error = this.getEmailError(this.state.email);

    this.setState({ emailError: error });
    return !error;
  };

  getPasswordError = password => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

    const isValidPassword = passwordRegex.test(password);
    return !isValidPassword
      ? "The password must contain minimum eight characters, at least one letter and one number."
      : "";
  };

  validatePassword = () => {
    const error = this.getPasswordError(this.state.password);

    this.setState({ passwordError: error });
    return !error;
  };

  getConfirmPasswordError = (password, confirmPassword) => {
    const passwordsMatch = password === confirmPassword;

    return !passwordsMatch ? "Passwords don't match." : "";
  };

  validateConfirmPassword = () => {
    const error = this.getConfirmPasswordError(
      this.state.password,
      this.state.confirmPassword
    );

    this.setState({ confirmPasswordError: error });
    return !error;
  };

  onChangeEmail = event =>
    this.setState({
      email: event.target.value
    });

  onChangePassword = event =>
    this.setState({
      password: event.target.value
    });

  onChangeConfirmPassword = event =>
    this.setState({
      confirmPassword: event.target.value
    });

  handleSubmit = () => {
    if (
      !this.validateEmail() ||
      !this.validatePassword() ||
      !this.validateConfirmPassword()
    ) {
      return;
    }

    const data = {
      email: this.state.email,
      password: this.state.password
    };

    axios.post(`https://mywebsite.com/api/signup`, data);
  };

  render() {
    return (
      <Grid container spacing={16}>
        <Grid item xs={4}>
          <TextField
            label="Email"
            value={this.state.email}
            error={!!this.state.emailError}
            helperText={this.state.emailError}
            onChange={this.onChangeEmail}
            margin="normal"
          />

          <TextField
            label="Password"
            value={this.state.password}
            error={!!this.state.passwordError}
            helperText={this.state.passwordError}
            type="password"
            onChange={this.onChangePassword}
            margin="normal"
          />

          <TextField
            label="Confirm Password"
            value={this.state.confirmPassword}
            error={!!this.state.confirmPasswordError}
            helperText={this.state.confirmPasswordError}
            type="password"
            onChange={this.onChangeConfirmPassword}
            margin="normal"
          />

          <Button
            variant="contained"
            color="primary"
            onClick={this.handleSubmit}
            margin="normal"
          >
            Sign Up
          </Button>
        </Grid>
      </Grid>
    );
  }
}

export default SignupForm;
```

上面的组件很乱，它一次做很多事情：处理它的状态，验证表单字段，以及渲染表单。 它已经是140行代码。 添加更多功能很快就无法维护。 

## 使用 Recompose 库

> Recompose是一个React实用库，用于函数组件和高阶组件。把它想象成React的lodash。

`Recompose`允许你通过添加状态，生命周期方法，上下文等来增强函数组件。

最重要的是，它允许您清晰地分离关注点 - 你可以让主要组件专门负责布局，高阶组件负责处理表单输入，另一个用于处理表单验证，另一个用于提交表单。 它很容易测试！

## 安装 Recompose

```
yarn add recompose
```

## 1.提取输入表单的State

我们将从`Recompose`库中使用`withStateHandlers`高阶组件。 它将允许我们将组件状态与组件本身隔离开来。 我们将使用它为电子邮件，密码和确认密码字段添加表单状态，以及上述字段的事件处理程序。

```jsx
// withTextFieldState.js
import { withStateHandlers, compose } from "recompose";

const initialState = {
  email: { value: "" },
  password: { value: "" },
  confirmPassword: { value: "" }
};

const onChangeEmail = props => event => ({
  email: {
    value: event.target.value,
    isDirty: true
  }
});

const onChangePassword = props => event => ({
  password: {
    value: event.target.value,
    isDirty: true
  }
});

const onChangeConfirmPassword = props => event => ({
  confirmPassword: {
    value: event.target.value,
    isDirty: true
  }
});

const withTextFieldState = withStateHandlers(initialState, {
  onChangeEmail,
  onChangePassword,
  onChangeConfirmPassword
});

export default withTextFieldState;
```

`withStateHandlers`高阶组件非常简单——它接受初始状态和包含状态处理程序的对象。调用时，每个状态处理程序将返回新的状态。

## 2.提取表单验证逻辑

现在是时候提取表单验证逻辑了。我们将从`Recompose`中使用`withProps`高阶组件。它允许将任意`props`添加到现有组件。

我们将使用`withProps`添加`emailError`，`passwordError`和`confirmPasswordError props`，如果我们的表单任何字段存在无效，它们将输出错误。

还应该注意，每个表单字段的验证逻辑都保存在一个单独的文件中（为了更好地分离关注点）。

- withEmailError
```jsx
// withEmailError.js
import { withProps } from "recompose";

const getEmailError = email => {
  if (!email.isDirty) {
    return "";
  }

  const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  const isValidEmail = emailRegex.test(email.value);
  return !isValidEmail ? "Invalid email." : "";
};

const withEmailError = withProps(ownerProps => ({
  emailError: getEmailError(ownerProps.email)
}));

export default withEmailError;
```

- withPasswordError

```jsx
// withPasswordError.js 
import { withProps } from "recompose";

const getPasswordError = password => {
  if (!password.isDirty) {
    return "";
  }

  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

  const isValidPassword = passwordRegex.test(password.value);
  return !isValidPassword
    ? "The password must contain minimum eight characters, at least one letter and one number."
    : "";
};

const withPasswordError = withProps(ownerProps => ({
  passwordError: getPasswordError(ownerProps.password)
}));

export default withPasswordError;
```

- withConfirmPasswordError

```jsx
// withConfirmPasswordError.js
import { withProps } from "recompose";

const getConfirmPasswordError = (password, confirmPassword) => {
  if (!confirmPassword.isDirty) {
      return "";
  }

  const passwordsMatch = password.value === confirmPassword.value;

  return !passwordsMatch ? "Passwords don't match." : "";
};

const withConfirmPasswordError = withProps(
    (ownerProps) => ({
        confirmPasswordError: getConfirmPasswordError(
            ownerProps.password,
            ownerProps.confirmPassword
        )
    })
);

export default withConfirmPasswordError;
```

## 3.提取表单提交逻辑

在这一步中，我们将提取表单提交逻辑。我们将再次使用`withProps`高阶组件来添加`onSubmit`处理程序。

`handleSubmit`函数接受从上一步传递下来的`emailError`，`passwordError`和`confirmPasswordError props`，检查是否有任何错误，如果没有，则会把参数请求到我们的`API`。

```jsx
// withSubmitForm.js 
import axios from "axios";

const handleSubmit = ({
  email,
  password,
  emailError,
  passwordError,
  confirmPasswordError
}) => {
  if (emailError || passwordError || confirmPasswordError) {
    return;
  }

  const data = {
    email: email.value,
    password: password.value
  };

  axios.post(`https://mywebsite.com/api/signup`, data);
};

const withSubmitForm = withProps(ownerProps => ({
  onSubmit: handleSubmit(ownerProps)
}));

export default withSubmitForm;
```

## 4.魔术coming

最后，将我们创建的高阶组件组合到一个可以在我们的表单上使用的增强器中。 我们将使用`recompose`中的`compose`函数，它可以组合多个高阶组件。

```jsx
// withFormLogic.js
import { compose } from "recompose";

import withTextFieldState from "./withTextFieldState";
import withEmailError from "./withEmailError";
import withPasswordError from "./withPasswordError";
import withConfirmPasswordError from "./withConfirmPasswordError";
import withSubmitForm from "./withSubmitForm";

export default compose(
    withTextFieldState,
    withEmailError,
    withPasswordError,
    withConfirmPasswordError,
    withSubmitForm
);
```

请注意此解决方案的优雅和整洁程度。所有必需的逻辑只是简单地添加到另一个逻辑上以生成一个增强器组件。

## 5.呼吸一口新鲜空气

现在让我们来看看`SignupForm`组件本身。

```jsx
// SignupForm.js 
import React from "react";
import { TextField, Button, Grid } from "@material-ui/core";
import withFormLogic from "./logic";

const SignupForm = ({
    email, onChangeEmail, emailError,
    password, onChangePassword, passwordError,
    confirmPassword, onChangeConfirmPassword, confirmPasswordError,
    onSubmit
}) => (
  <Grid container spacing={16}>
    <Grid item xs={4}>
      <TextField
        label="Email"
        value={email.value}
        error={!!emailError}
        helperText={emailError}
        onChange={onChangeEmail}
        margin="normal"
      />

      <TextField
        label="Password"
        value={password.value}
        error={!!passwordError}
        helperText={passwordError}
        type="password"
        onChange={onChangePassword}
        margin="normal"
      />

      <TextField
        label="Confirm Password"
        value={confirmPassword.value}
        error={!!confirmPasswordError}
        helperText={confirmPasswordError}
        type="password"
        onChange={onChangeConfirmPassword}
        margin="normal"
      />

      <Button
        variant="contained"
        color="primary"
        onClick={onSubmit}
        margin="normal"
      >
        Sign Up
      </Button>
    </Grid>
  </Grid>
);

export default withFormLogic(SignupForm);
```
新的重构组件非常清晰，只做一件事 - 渲染。 单一责任原则规定模块应该做一件事，它应该做得好。 我相信我们已经实现了这一目标。

所有必需的数据和输入处理程序都只是作为props传递下来。 这反过来使组件非常容易测试。

我们应该始终努力使我们的组件完全不包含逻辑，并且只负责渲染。 Recompose允许我们这样做。

## 使用Recompose的pure优化性能

`Recompose`有`pure`，这是一个很好的高阶组件，允许我们只在需要的时候重新呈现组件。`pure`将确保组件不会重新呈现，除非任何`props`发生了更改。

```jsx
// pureSignupForm.js
import { compose, pure } from "recompose"; 

...

export default compose(
  pure,
  withFormLogic
)(SignupForm);
```

## 总结

我们应该始终遵循组件的单一责任原则，将逻辑与表现隔离开来。为了实现这一点，首先应该取消Class组件的写法。主要组件本身应该是功能性的，并且应该只负责呈现而不是其他任何东西。然后将所有必需的状态和逻辑添加为高阶组件。

遵循以上规则将使您的代码清晰明了、易于阅读、易于维护和易于测试。


