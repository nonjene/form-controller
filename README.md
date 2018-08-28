# Form controller

[![npm](https://img.shields.io/npm/v/form-controller.svg)](https://www.npmjs.com/package/form-controller)

一个便捷的表单验证交互的控制器，让繁琐的表单验证条理化，支持异步验证，代码没有任何依赖。

## 特点

FormController 能轻松地创建表单校验逻辑，响应用户的输入内容。有如下特点：

- 可结构化的定义表单逻辑
- 无需操作 dom，数据与视图自动绑定
- 可定义过滤、异步校验、及错误提示
- 一条数据可创建多个校验函数，可定义每个校验对应的错误提示，或动态的提示
- 数据未变化时，将会引用已缓存的校验结果
- 可轻易实现表单数据之间的约束
- 可实时调取当前的表单数据和校验结果
- 可调用 api 方法更新表单数据，以便适配使用高度封装的输入器控件
- 不依赖 UI 库，适用于任何浏览器（[前提条件](#兼容情况)）

## 例子

[demo](https://nonjene.github.io/demo/form-controller/index.html)
[demo 代码](https://github.com/nonjene/form-controller/blob/master/demo/FormDemo.jsx)

## 介绍

安装：

```shell
npm install form-controller
```

### 声明

```js
const fc = new FormController({
  $container: '#form', // 表单容器
  defFormData: {
    /* 表单数据初始化 */
  },
  chkVal: {
    /* 校验函数 */
  },
  dataFilter: {
    /* 实时输入的内容过滤 */
  }
  //...
});
fc.on('submit', data => {
  // 用户点击提交后，当检查都通过后，就会执行此回调, 并传递表单内容
});
```
如果是在react中使用，应该在`componentDidMount`函数中执行

完整的例子请看[完整的使用例子](#完整的使用例子)

### 定义 formController

**定义表单的数据**

key 与视图的 name 对应，如有两个数据`foo`、`bar`：

_如果初始值不为空，将会在初始化时把值自动同步到视图_
_如果是 checkbox，有多项选择的，可把值用`,`隔开_

```js
  defFormData: {
    foo: '',
    bar: '有初始值',
    baz: '1,2',  //checkbox
  },
```

**定义校验。一条数据可定义多个校验, 同步或异步, 及对应的错误提示**

_每条校验的 key 可自由定义，只需要对应到相应的错误提示的 key:_

```js
  chkVal:{
    foo: {
      rule1: function(val){ return !!val; },
      rule2: function(val){ return new Promise((resolve)=>{
        setTimeout(()=>resolve(), 100);
      }); }
    },
    bar:{
      //...
    }
  },
  errMsg:{
    foo: {
      rule1:'提示1',
      rule2:'提示2',
    },
    bar:{
      //...
    }
  }
```

**定义用户输入内容的筛选**：

*（筛选功能不会影响中文输入法的使用）*

```js
  dataFilter:{
    foo: function(val){ return val.slice(0,5); }
  }
```

### 更多校验功能

#### 动态显示错误提示

```js
chkVal: {
  foo: {
    // ...
    rule3: val => {
      return new Promise((resolve, reject) => {
        setTimeout(() => reject('动态指定错误提示内容'), 500);
      });
    };
  }
}
```

#### 校验时可对比其他的输入内容

_如以下规定`foo`与`bar`的值需要相等_

```js
  const fc = new FormController({
    // ...
    defFormData:{ foo:'', bar:'' }
    chkVal: {
      foo: {
        // ...
        rule4: val => val === tc.formdata.bar;
      }
    }
    //...
  });
```

#### 动态执行校验

可以动态调用方法校验一个或多个值是否合法

_如果不合法，视图上会自动显示校验对应的错误提示_

```js
fc.getChkStatus('foo', 'bar').then(([isFooPass, isBarPass]) => {
  if (isFooPass && isBarPass) {
    // do something
    // 使用 fc.formdata.foo 和 fc.formdata.bar 做一些业务逻辑
    // ...
  } else {
    // foo 或 bar 的值不合法
    // 错误提示会自动显示出来
  }
});
```

### 手动设置数据

假如表单中使用了抽象封装过的输入控件，无法通过`formController`将数据自动绑定视图，则可调用方法`fc.updData(name, value)`来同步数据。

例如：定义了一个数据`foo`，但是 html 上没有该输入框元素，而是一个另外封装的 UI 控件`InputUI`，它有个数据更新的钩子命名为`onUpdate`。假如该 UI 如下声明：

```js
new InputUI().onUpdate(value => {
  fc.updData('foo', value);
});
```

假如它是react组件：

```html
<InputUI onUpdate={value => this.fc.updData('foo', value)} />
```

调用`updData`后，会自动执行校验，错误提示内容依然会通过`formController`控制自动显示。

如果要手动调取校验结果，则参考[动态执行校验](#动态执行校验)。此调用不会与`updData`冲突，不会重复执行校验。

```js
fc.updData('foo', value)
  .getChkStatus('foo')
  .then(([isFooPass]) => {
    if (isFooPass) {
      //...
    }
  });
```

### 实时获得用户输入的内容

可通过监听实例的`input`事件，实时获取用户正在输入的值以及对应的`name`。

比如我需要把实时输入的`foo`值同步到 react 的 state：

```js
fc.on('input', ({ name, val }) => {
  // 用户正在输入
  if (name === 'foo') {
    // do something...
    this.setState({
      foo: val
    });
  }
});
```

### html 的一些约定

html 结构只有很少的约束，有如下：

1. 所有交互控件需要在一个容器里面，具体如何布局 html 不限制
2. 控件要有`name`属性，以便控制器查找到位置
3. `data-`的定义
4. 错误提示的容器的特征需要为`span.err`

假如一个表单有 2 个数据，`name`为`foo`和`bar`:

```html
<div id="form">
    <!-- foo -->
    <div data-block="foo">
        <input name="foo"/>
        <span class="err" data-for="foo"></span>
    </div>
    <!-- bar -->
    <div data-block="bar">
        <div>
            <input name="bar"/>
        </div>
        <p>
            <span class="err" data-for="bar"></span>
        </p>
    </div>
</div>
```

### 兼容情况

1. 如果要兼容 ie8 及以下，需要额外引入`jQuery`，注入在全局即可，formController 会自动识别。
2. 如果没有引入`jQuery`，无论是否需要兼容 ie8，都需要引入`babel-polyfill`, 因为一些代替 jquery 的代码使用了 es6 api。

## 完整的使用例子

```js
const FormController = require('FormController');

const fc = new FormController({
  // form容器，可以是选择器或dom
  $container: '#form',
  // 是否input输入失焦后立即执行校验。否则在点击提交后再校验
  blurChk: true,
  // 初始化的表单数据，key对应formData的name
  defFormData: {
    foo: '',
    bar: ''
  },
  // 用户输入内容过滤，
  dataFilter: {
    foo: val => val.replace(/[^\d]/g, '')
  },
  // 检查用户输入的校验，可同步、异步，可定义多条校验规则。规则key可以任意命名
  chkVal: {
    foo: {
      require: val => val.length === 11,
      valid: val =>
        new Promise(resolve => {
          setTimeout(() => resolve(true), 500);
        })
    }
    /* bar不定义校验，则认为不需要校验 */
  },
  // 错误信息，对应“chkVal”的规则
  errMsg: {
    foo: {
      require: '请输入11位数字',
      valid: '该号码已经被使用'
    }
  }
})
  .on('submit', data => {
    // 用户点击提交后，当“chkVal”的所有检查都通过了，执行此回调
    // data: {foo: 'xxx', bar: 'yyy'}
    fetch(data).then(() => {
      // 表单提交成功
    });
  })
  .on('input', ({ name, val }) => {
    // 用户正在输入
    if (name === 'foo') {
      // do sth.
    }
  });
```

### 可以使用预置的 react component

css 与 component 分离

```js
import {
  FormWrap,
  FormWrapSty1,
  FormWrapSty2,
  FormText,
  FormTextarea,
  FormRadio,
  FormCheckBox,
  FormPassword,
  ButtonSubmit,
  FormStatic,
  FormSmsCode,
  FormImgCode
} from 'form-controller/dist/components/react/index.js';

import 'form-controller/dist/components/css/style.css';
```

使用方式请看[demo 代码](https://github.com/nonjene/form-controller/blob/master/demo/FormDemo.jsx)

## API

todo
