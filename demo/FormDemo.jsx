import React, { Component } from 'react';

import {
  FormWrapSty2,
  FormText,
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
      debug:true,
      $container: this.wrapper,
      blurChk: true,
      dataFilter: {},
      defFormData: {
        passwd: '',
        imgCode: '',
        smsCode: '',
        setPwd: ''
      },
      chkVal: {
        imgCode: {
          require: val => {
            //debugger
            return val.length === 4
          },
          valid: val =>
            new Promise((resolve, reject) => {
              console.log('async check "imgCode" valid.');
              setTimeout(() => resolve(true), 1000);
            })
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
        setPwd: {
          require: val => !!val,
          sameCheck: val => val === fc.formdata.passwd
        }
      },
      errMsg: {
        mobile: {
          require: '请输入正确的手机号码',
          valid: '该手机号未注册'
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
          strong:
            '格式不正确，需包含数字及字母'
        },
        setPwd: {
          require: '请输入密码',
          sameCheck: '两次输入不一致'
        }
      }
    }).on('submit', data =>
      doResetPsw({ ...data, mobile: this.state.mobile })
    ));
  }

  handleGetSmsCode() {
    return new Promise((resolve, reject) => {
      setTimeout(() => reject(), 500);
    });
  }
  render() {
    return (
      <FormWrapSty2 _ref={dom => (this.wrapper = dom)}>
        <FormStatic label="手机号">
          <span>{111111111111}</span>
        </FormStatic>
        <FormImgCode
          name="imgCode"
          label="验证码"
          onResetSrcClick={() => {}}
          validImg={'imgLink'}
        />
        <FormSmsCode
          maxLen={6}
          name="smsCode"
          label="短信验证码"
          onGetSmsCodeClick={this.handleGetSmsCode.bind(this)}
          btnName="点击获取"
          btnNameCountdown="s后获取"
        />
        <FormText
          name="passwd"
          label="新密码"
          placeholder="设置6-16位数字和字母组成的密码"
        />
        <FormText
          name="setPwd"
          label="再输一遍"
          placeholder="再输一遍你设置的新密码"
        />
        <div className="button-wrap">
          <ButtonSubmit className="button-big" isLoading={false}>
            确认
          </ButtonSubmit>
        </div>
      </FormWrapSty2>
    );
  }
}
