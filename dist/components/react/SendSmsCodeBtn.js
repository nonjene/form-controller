'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @倒计时按钮
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

/**
 *   mobileOrToken      手机号码或token    string    [是否必输：是]，[示例：15012345678]
     smsType            短信类型    string    [是否必输：是]，00:注册验证码;02:找回登录密码验证码;20:登录动态验证码;
     userType           用户类型    number    [是否必输：是]，(借款人:2;商户:1000)
     verifyCode         图形验证码    string    [是否必输：否]，[长度：4]，[示例：6891]
     verifyNoncestr     随机字符串    string    [是否必输：否]，[长度：32]与本次"获得图形验证码"发送的noncestr一致
 * @param data
 * @returns {service}
 */
var propTypes = {
  title: _propTypes2.default.string,
  timer: _propTypes2.default.number,
  // onCLick 点击按钮，返回promise
  onClick: _propTypes2.default.func.isRequired,
  resetTool: _propTypes2.default.func
};
var defaultProps = {
  timer: 60,
  title: '获取验证码',
  countdownTitle: '秒后重新获取',
  pendingTitle: '正在发送...',
  errorTitle: '出错,请重试',
  styleName: ''
};

var SendSmsCodeBtn = function (_Component) {
  _inherits(SendSmsCodeBtn, _Component);

  function SendSmsCodeBtn(props) {
    _classCallCheck(this, SendSmsCodeBtn);

    var _this = _possibleConstructorReturn(this, (SendSmsCodeBtn.__proto__ || Object.getPrototypeOf(SendSmsCodeBtn)).call(this, props));

    _this.state = {
      isCounting: false,
      remainTime: -1
    };
    _this._initState = _extends({}, _this.state);
    return _this;
  }

  _createClass(SendSmsCodeBtn, [{
    key: 'clean',
    value: function clean() {
      this.isCounting = false;
      this._timer && clearInterval(this._timer);
    }
  }, {
    key: 'resetState',
    value: function resetState() {
      this.setState(this._initState);
    }
  }, {
    key: 'startTimer',
    value: function startTimer() {
      var _this2 = this;

      if (this.isCounting) return;
      this.isCounting = true;
      this.setState({
        isCounting: true,
        remainTime: this.props.timer
      });
      this._timerStartPoint = Date.now();
      this._timer = setInterval(function () {
        if (_this2.state.remainTime === 0) {
          _this2.clean();
          _this2.resetState();
        } else {
          _this2.setState({
            remainTime: _this2.props.timer - ((Date.now() - _this2._timerStartPoint) / 1000 | 0)
          });
        }
      }, 1000);
    }
  }, {
    key: 'handleClick',
    value: function handleClick() {
      var _this3 = this;

      if (this.state.isPending || this.isCounting) return;

      this.setState({
        isPending: true,
        isError: false
      });

      this.props.onClick().then(function () {
        _this3.setState({ isPending: false });
        _this3.startTimer();
      }).catch(function () {
        _this3.setState({ isPending: false, isError: true });
        _this3.clean();
        _this3.resetState();
      });
    }
  }, {
    key: 'componentWillMount',
    value: function componentWillMount() {
      this.clean();
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this4 = this;

      this.props.resetTool && this.props.resetTool(function () {
        _this4.clean();
        _this4.resetState();
      });
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.clean();
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'a',
        {
          className: 'u-button c-btn-countdown ' + this.props.styleName + ' ' + (this.state.isCounting || this.state.isPending ? 'disable' : ''),
          onClick: this.handleClick.bind(this)
        },
        this.state.isPending ? this.props.pendingTitle : this.state.isError ? this.props.errorTitle : !this.state.isCounting ? this.props.title : this.state.remainTime + this.props.countdownTitle
      );
    }
  }]);

  return SendSmsCodeBtn;
}(_react.Component);

exports.default = SendSmsCodeBtn;


SendSmsCodeBtn.propTypes = propTypes;
SendSmsCodeBtn.defaultProps = defaultProps;
//# sourceMappingURL=SendSmsCodeBtn.js.map