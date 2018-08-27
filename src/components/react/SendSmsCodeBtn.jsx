/**
 * @倒计时按钮
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';

/**
 *   mobileOrToken      手机号码或token    string    [是否必输：是]，[示例：15012345678]
     smsType            短信类型    string    [是否必输：是]，00:注册验证码;02:找回登录密码验证码;20:登录动态验证码;
     userType           用户类型    number    [是否必输：是]，(借款人:2;商户:1000)
     verifyCode         图形验证码    string    [是否必输：否]，[长度：4]，[示例：6891]
     verifyNoncestr     随机字符串    string    [是否必输：否]，[长度：32]与本次"获得图形验证码"发送的noncestr一致
 * @param data
 * @returns {service}
 */
const propTypes = {
  title: PropTypes.string,
  timer: PropTypes.number,
  // onCLick 点击按钮，返回promise
  onClick: PropTypes.func.isRequired,
  resetTool: PropTypes.func
};
const defaultProps = {
  timer: 60,
  title: '获取验证码',
  countdownTitle: '秒后重新获取',
  pendingTitle: '正在发送...',
  errorTitle: '出错,请重试',
  styleName: ''
};

export default class SendSmsCodeBtn extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isCounting: false,
      remainTime: -1
    };
    this._initState = { ...this.state };
  }

  clean() {
    this.isCounting = false;
    this._timer && clearInterval(this._timer);
  }
  resetState() {
    this.setState(this._initState);
  }

  startTimer() {
    if (this.isCounting) return;
    this.isCounting = true;
    this.setState({
      isCounting: true,
      remainTime: this.props.timer
    });
    this._timerStartPoint = Date.now();
    this._timer = setInterval(() => {
      if (this.state.remainTime === 0) {
        this.clean();
        this.resetState();
      } else {
        this.setState({
          remainTime:
            this.props.timer -
            (((Date.now() - this._timerStartPoint) / 1000) | 0)
        });
      }
    }, 1000);
  }
  handleClick() {
    if (this.state.isPending || this.isCounting) return;

    this.setState({
      isPending: true,
      isError: false,
    });

    this.props
      .onClick()
      .then(() => {
        this.setState({ isPending: false });
        this.startTimer();
      })
      .catch(() => {
        this.setState({ isPending: false, isError: true });
        this.clean();
        this.resetState();
      });
  }
  componentWillMount() {
    this.clean();
  }
  componentDidMount() {
    this.props.resetTool &&
      this.props.resetTool(() => {
        this.clean();
        this.resetState();
      });
  }
  componentWillUnmount() {
    this.clean();
  }

  render() {
    return (
      <a
        className={`u-button c-btn-countdown ${this.props.styleName} ${
          this.state.isCounting || this.state.isPending ? 'disable' : ''
        }`}
        onClick={this.handleClick.bind(this)}
      >
        {this.state.isPending
          ? this.props.pendingTitle
          : this.state.isError
            ? this.props.errorTitle
            : !this.state.isCounting
              ? this.props.title
              : this.state.remainTime + this.props.countdownTitle}
      </a>
    );
  }
}

SendSmsCodeBtn.propTypes = propTypes;
SendSmsCodeBtn.defaultProps = defaultProps;
