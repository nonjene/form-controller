import React, { Component } from 'react';

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
} from '../src/components/react/index.jsx';

import '../src/components/scss/index.scss';

import FormController from '../src/FormController';

export class FormDemo extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.initFormCtrl();
  }
  initFormCtrl() {
    const fc = (this.fc = new FormController({
      debug: true,
      $container: this.wrapper,
      blurChk: true,

      defFormData: {
        mobile: '',
        smsCode: '',
        passwd: '',
        repeatPwd: '',
        radio1: '',
        checkbox1: '',
        checkbox2: '3,4',
        remark: '这是初始化时定义的数据内容。'
      },
      dataFilter: {
        mobile: val => val.replace(/[^\d]/g, '').slice(0, 11)
      },
      chkVal: {
        mobile: {
          require: val => {
            //debugger
            return val.length === 11;
          }
        },
        smsCode: {
          require: val => +val.length === 6,
          verify: val =>
            new Promise((resolve, reject) => {
              console.log('async check "smsCode" valid.');
              setTimeout(() => resolve(true), 100);
            })
        },
        passwd: {
          require: val => !!val,
          strong: val => /[a-zA-Z]/.test(val) && /[0-9]/.test(val)
        },
        repeatPwd: {
          require: val => !!val,
          sameCheck: val => val === fc.formdata.passwd
        },
        radio1: {
          require: val => !!val
        },
        checkbox1: {
          require: val => !!val
        },
        checkbox2: {
          // no rule
          //require: val =>true
        }
      },
      errMsg: {
        mobile: {
          require: '请输入11位的手机号码'
        },

        imgCode: {
          require: '请输入4位图片验证码',
          valid: '验证码错误'
        },
        smsCode: {
          require: '请输入6位短信验证码',
          verify: '验证码不正确'
        },
        passwd: {
          require: '请输入密码',
          strong: '格式不正确，需包含数字及字母'
        },
        repeatPwd: {
          require: '请输入密码',
          sameCheck: '两次输入不一致'
        },
        radio1: {
          require: '请选择其中一个'
        },
        checkbox1: {
          require: '请至少选一个咯'
        }
      }
    }).on('submit', formdata => {
      console.log(formdata);
      alert('data:'+ JSON.stringify(formdata))
    }));
  }

  handleGetSmsCode() {
    return new Promise((resolve, reject) => {
      // 获取用户输入的手机号，
      // 假如手机号不合法，会在手机号那栏提示错误
      const promiseChk = this.fc.getChkStatus('mobile' /* 可以添加其他name */);
      promiseChk.then(([mobile /*boolean*/ /* 其他name */]) => {
        if (mobile) {
          console.log('发送验证码到手机：', this.fc.formdata.mobile);
          // request backend api to send sms.
          setTimeout(() => resolve(), 200);
        } else {
          reject(''); // 手机号验证不通过，发送按钮状态恢复初始状态。
        }
      });
    });
  }
  render() {
    return (
      <div className="demo-form">
        <h2>Form control demo</h2>
        <FormWrapSty2 _ref={dom => (this.wrapper = dom)}>
          <FormStatic label="手机号">
            <span>13800000000(静态内容)</span>
          </FormStatic>
          <FormText
            type="tel"
            name="mobile"
            label="新手机号"
            placeholder="这是文本输入框"
          />
          <FormSmsCode
            maxLen={6}
            name="smsCode"
            label="短信验证码"
            placeholder="这是组合套餐"
            onGetSmsCodeClick={this.handleGetSmsCode.bind(this)}
            btnName="点击获取"
            btnNameCountdown="s后获取"
            timer={10}
          />
          <FormPassword
            name="passwd"
            label="新密码"
            placeholder="设置6-16位数字和字母组成的密码"
          />
          <FormPassword
            name="repeatPwd"
            label="再输一遍"
            placeholder="再输一遍你设置的新密码"
          />
          <FormRadio
            name="radio1"
            label="单选"
            options={[
              { desc: '启用', value: '1' },
              { desc: '禁用', value: '0' }
            ]}
          />
          <FormCheckBox
            name="checkbox1"
            label="多选"
            options={[
              { desc: '选项1', value: '0' },
              { desc: '选项2', value: '1' }
            ]}
          />

          <FormCheckBox
            name="checkbox2"
            label="默认选中某个"
            options={[
              { desc: '选项1', value: '2' },
              { desc: '选项2', value: '3' },
              { desc: '选项3', value: '4' }
            ]}
          />

          <FormTextarea
            name="remark"
            label="多行文本框"
            placeholder="描述描述描述描述"
          />
          <div className="button-wrap">
            <ButtonSubmit className="button-big" isLoading={false}>
              确认
            </ButtonSubmit>
          </div>
        </FormWrapSty2>
      </div>
    );
  }
}
