# Form controller

[![npm](https://img.shields.io/npm/v/form-controller.svg)](https://www.npmjs.com/package/form-controller)

一个便捷的表单验证交互的控制器，让繁琐的表单验证条理化，支持异步验证，不依赖任何 UI 库。

## 特点

- 舒适的用户交互体验
- 轻松管理用户的输入内容
  1. 清晰结构化的表单逻辑定义
  1. 包含过滤、异步验证、及错误提示
  1. 每条数据可绑定多个校验规则，每个规则都可对应错误提示，或动态的错误提示
  1. 可轻易实现表单数据之间的约束
  2. 可调用 api 方法，控制表单数据，以便配合使用其他独立封装的 UI 控件
- 无需操作 dom，数据与视图绑定
- 不依赖 UI 库
- 适用于任何浏览器（[前提条件](#兼容情况)）

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
  $container: '#form',
  defFormData: {
    /* ... */
  }
  //...
});
fc.on('submit', data => {
  // 用户点击提交后，当检查都通过了，就会执行此回调
});
```

完整的例子请看[完整的使用例子](#完整的使用例子)

### 定义formController

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

假如有些输入控件不是原生的元素，无法通过`formController`自动绑定视图，则可调用方法`fc.updData(name, value)`来同步数据。

例子：定义了一个数据`foo`，但是 html 上没有该输入框元素，而是一个另外封装的 UI 控件`InputUI`。假如该 UI 如下声明：

```js
new InputUI().onUpdate(value => {
  fc.updData('foo', value);
});
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
  // form容器，可以是选择器或dom或
  $container: '#form',
  // input输入失焦后就校验内容
  blurChk: true,
  // 初始化的表单数据，key为name
  defFormData: {
    foo: '',
    bar: ''
  },
  // 用户输入内容过滤，key对应formData的name
  dataFilter: {
    foo: val => val.replace(/[^\d]/g, '')
  },
  // 检查用户输入的校验，可同步、异步，可定义多条校验规则。规则名称可以任意命名
  chkVal: {
    foo: {
      limitLength: val => val.length === 11,
      asyncChk: val =>
        new Promise(resolve => {
          setTimeout(() => resolve(true), 500);
        })
    }
  },
  // 错误信息，对应“chkVal”的规则
  errMsg: {
    foo: {
      limitLength: '请输入11位数字',
      asyncChk: '该号码已经被使用'
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
