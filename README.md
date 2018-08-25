# form controller

## example

```js
const FormController = require('FormController');

const fc = new FormController({
  $container: this.wrapper,
  blurChk: true,
  // 默认数据
  defFormData: {
    mobile: ''
  },
  // 用户输入内容过滤
  dataFilter: {
    mobile: val => val.replace(/[^\d]/g, '').slice(0, 11)
  },
  // 检查用户输入的合法性
  chkVal: {
    mobile: {
      require: val => val.length === 11,
      valid: val =>
        new Promise(resolve => {
          setTimeout(() => resolve(true), 500);
        })
    }
  }
})
  .on('submit', data => {
    // 所有检查都通过了
    fetch.reg(data).then(() => {
      // 表单提交成功
    });
  })
  .on('input', formItem => {
    // 用户正在输入
    //formItem: {
    //  name:'', // input 的 name
    //  val:''   // value
    //}
    if (formItem.name === 'passwd') {
      // do sth.
    }
  });
```
