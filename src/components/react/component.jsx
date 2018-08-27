/**
 * Created by nonjene on 2018/5/8.
 */
import React from 'react';
import SendSmsCodeBtn from './SendSmsCodeBtn';
import { BlockWrap, SubBlock } from './Block';

const Button = ({ children, className = '', block, sm, ...props }) => {
  const cnB = block ? ' button-big' : '';
  const cnSm = sm ? ' button-sm' : '';
  return (
    <a className={`u-button${cnB}${cnSm} ${className}`} {...props}>
      {children}
    </a>
  );
};

const Err = ({ styleName = '', dataFor = '' }) => {
  return (
    <div className={`c-err-w ${styleName}`}>
      <span data-for={dataFor} className="err" />
    </div>
  );
};

const FormControl = ({
  className = '',
  name = '',
  label = 'label',
  children
}) => {
  return (
    <BlockWrap className={`form-control ${className}`} data-block={name}>
      <label className="u-sub" htmlFor={name}>
        {label}
      </label>
      <SubBlock className="rig-ipt">
        {children}
        <Err dataFor={name} />
      </SubBlock>
    </BlockWrap>
  );
};

const FormWrap = props => {
  return (
    <div
      className={`m-form ${props.className || ''}`}
      ref={dom => props._ref && props._ref(dom)}
    >
      {props.children}
    </div>
  );
};
const FormText = (props) => {
  return (
    <FormControl {...props}>
      <input
        name={props.name}
        disabled={props.disabled}
        type={props.type || 'text'}
        placeholder={props.placeholder}
      />
    </FormControl>
  );
};

export default {
  Err,
  FormControl,
  FormWrap,
  FormWrapSty1({ className = '', ...props }) {
    return <FormWrap className={`sty1 ${className}`} {...props} />;
  },
  FormWrapSty2({ className = '', ...props }) {
    return <FormWrap className={`sty2 ${className}`} {...props} />;
  },
  FormText,
  FormPassword(props){
    return <FormText type="password" {...props}/>;
  },
  FormTextarea(props) {
    return (
      <FormControl className="form-txta" {...props}>
        <textarea name={props.name} placeholder={props.placeholder} />
      </FormControl>
    );
  },
  FormStatic(props) {
    return <FormControl className="form-static" {...props} />;
  },
  FormRadio(props) {
    return (
      <FormControl {...props}>
        {props.options.map(({ desc, ...optProps }, key) => (
          <label className="f-rdio" key={key}>
            <input
              type="radio"
              className="toggle"
              name={props.name}
              {...optProps}
            />
            <span>{desc}</span>
          </label>
        ))}
      </FormControl>
    );
  },

  FormCheckBox(props) {
    return (
      <FormControl {...props}>
        {props.options.map(({ desc, ...optProps }, key) => (
          <label className='f-chkbox' key={key}>
            <input
              type="checkbox"
              className="chkbox"
              name={props.name}
              {...optProps}
            />
            <span>{desc}</span>
          </label>
        ))}
      </FormControl>
    );
  },

  /**
   * 图文验证
   * @param props  { onResetPicCode, validImg }
   * @returns {*}
   * @constructor
   */
  FormImgCode(props) {
    return (
      <FormControl className="form-comb" {...props}>
        <input name={props.name} maxLength={props.maxLen} type="text" />
        <div className="rig-ele pic-code" onClick={props.onResetPicCode}>
          {props.validImg && <img src={props.validImg} alt="图形验证码" />}
        </div>
      </FormControl>
    );
  },
  /**
   * 短信验证
   * @param props  { onGetSmsCodeClick, btnStyleName }
   * @returns {*}
   * @constructor
   */
  FormSmsCode(props) {
    return (
      <FormControl className="form-comb" {...props}>
        <input name={props.name} type="tel" maxLength={props.maxLen} placeholder={props.placeholder} />
        <div className="rig-ele btn-wrap">
          <SendSmsCodeBtn
            timer={props.timer}
            onClick={props.onGetSmsCodeClick}
            styleName={props.btnStyleName || ''}
            title={props.btnName}
            countdownTitle={props.btnNameCountdown}
          />
        </div>
      </FormControl>
    );
  },
  ButtonSubmit(props) {
    return (
      <Button
        className={`btn-submit ${props.className || ''} ${
          props.isLoading ? 'disable' : ''
        }`}
        data-action="submit"
      >
        {props.isLoading ? '正在处理...' : props.children}
      </Button>
    );
  }
};
