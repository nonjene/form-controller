'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _SendSmsCodeBtn = require('./SendSmsCodeBtn');

var _SendSmsCodeBtn2 = _interopRequireDefault(_SendSmsCodeBtn);

var _Block = require('./Block');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; } /**
                                                                                                                                                                                                                              * Created by nonjene on 2018/5/8.
                                                                                                                                                                                                                              */


var Button = function Button(_ref) {
  var children = _ref.children,
      _ref$className = _ref.className,
      className = _ref$className === undefined ? '' : _ref$className,
      block = _ref.block,
      sm = _ref.sm,
      props = _objectWithoutProperties(_ref, ['children', 'className', 'block', 'sm']);

  var cnB = block ? ' button-big' : '';
  var cnSm = sm ? ' button-sm' : '';
  return _react2.default.createElement(
    'a',
    _extends({ className: 'u-button' + cnB + cnSm + ' ' + className }, props),
    children
  );
};

var Err = function Err(_ref2) {
  var _ref2$styleName = _ref2.styleName,
      styleName = _ref2$styleName === undefined ? '' : _ref2$styleName,
      _ref2$dataFor = _ref2.dataFor,
      dataFor = _ref2$dataFor === undefined ? '' : _ref2$dataFor;

  return _react2.default.createElement(
    'div',
    { className: 'c-err-w ' + styleName },
    _react2.default.createElement('span', { 'data-for': dataFor, className: 'err' })
  );
};

var FormControl = function FormControl(_ref3) {
  var _ref3$className = _ref3.className,
      className = _ref3$className === undefined ? '' : _ref3$className,
      _ref3$name = _ref3.name,
      name = _ref3$name === undefined ? '' : _ref3$name,
      _ref3$label = _ref3.label,
      label = _ref3$label === undefined ? 'label' : _ref3$label,
      children = _ref3.children;

  return _react2.default.createElement(
    _Block.BlockWrap,
    { className: 'form-control ' + className, 'data-block': name },
    _react2.default.createElement(
      'label',
      { className: 'tc', htmlFor: name },
      label
    ),
    _react2.default.createElement(
      _Block.SubBlock,
      { className: 'rig-ipt' },
      children,
      _react2.default.createElement(Err, { dataFor: name })
    )
  );
};

var FormWrap = function FormWrap(props) {
  return _react2.default.createElement(
    'div',
    {
      className: 'm-form ' + (props.className || ''),
      ref: function ref(dom) {
        return props._ref && props._ref(dom);
      }
    },
    props.children
  );
};

exports.default = {
  Err: Err,
  FormControl: FormControl,
  FormWrap: FormWrap,
  FormWrapSty1: function FormWrapSty1(_ref4) {
    var _ref4$className = _ref4.className,
        className = _ref4$className === undefined ? '' : _ref4$className,
        props = _objectWithoutProperties(_ref4, ['className']);

    return _react2.default.createElement(FormWrap, _extends({ className: 'sty1 ' + className }, props));
  },
  FormWrapSty2: function FormWrapSty2(_ref5) {
    var _ref5$className = _ref5.className,
        className = _ref5$className === undefined ? '' : _ref5$className,
        props = _objectWithoutProperties(_ref5, ['className']);

    return _react2.default.createElement(FormWrap, _extends({ className: 'sty2 ' + className }, props));
  },
  FormText: function FormText(props) {
    return _react2.default.createElement(
      FormControl,
      props,
      _react2.default.createElement('input', {
        name: props.name,
        disabled: props.disabled,
        type: 'text',
        placeholder: props.placeholder
      })
    );
  },
  FormTextarea: function FormTextarea(props) {
    return _react2.default.createElement(
      FormControl,
      _extends({ className: 'form-txta' }, props),
      _react2.default.createElement('textarea', { name: props.name, placeholder: props.placeholder })
    );
  },
  FormStatic: function FormStatic(props) {
    return _react2.default.createElement(FormControl, _extends({ className: 'form-static' }, props));
  },
  FormRadio: function FormRadio(props) {
    return _react2.default.createElement(
      FormControl,
      props,
      props.options.map(function (_ref6, key) {
        var desc = _ref6.desc,
            optProps = _objectWithoutProperties(_ref6, ['desc']);

        return _react2.default.createElement(
          'label',
          { className: 'f-rdio', key: key },
          _react2.default.createElement('input', _extends({
            type: 'radio',
            className: 'toggle',
            name: props.name
          }, optProps)),
          _react2.default.createElement(
            'i',
            null,
            desc
          )
        );
      })
    );
  },
  FormCheckBox: function FormCheckBox(props) {
    return _react2.default.createElement(
      FormControl,
      props,
      props.options.map(function (_ref7, key) {
        var desc = _ref7.desc,
            pre = _ref7.pre,
            chil = _ref7.chil,
            optProps = _objectWithoutProperties(_ref7, ['desc', 'pre', 'chil']);

        return _react2.default.createElement(
          'label',
          { className: 'f-chkbox ' + pre, key: key },
          _react2.default.createElement('input', _extends({
            type: 'checkbox',
            className: 'chkbox',
            name: props.name
          }, optProps)),
          _react2.default.createElement(
            'i',
            null,
            desc
          )
        );
      })
    );
  },


  /**
   * 图文验证
   * @param props  { onResetPicCode, validImg }
   * @returns {*}
   * @constructor
   */
  FormImgCode: function FormImgCode(props) {
    return _react2.default.createElement(
      FormControl,
      _extends({ className: 'form-comb' }, props),
      _react2.default.createElement('input', { name: props.name, maxLength: props.maxLen, type: 'text' }),
      _react2.default.createElement(
        'div',
        { className: 'rig-ele pic-code', onClick: props.onResetPicCode },
        props.validImg && _react2.default.createElement('img', { src: props.validImg, alt: '\u56FE\u5F62\u9A8C\u8BC1\u7801' })
      )
    );
  },

  /**
   * 短信验证
   * @param props  { onGetSmsCodeClick, btnStyleName }
   * @returns {*}
   * @constructor
   */
  FormSmsCode: function FormSmsCode(props) {
    return _react2.default.createElement(
      FormControl,
      _extends({ className: 'form-comb' }, props),
      _react2.default.createElement('input', { name: props.name, type: 'tel', maxLength: props.maxLen }),
      _react2.default.createElement(
        'div',
        { className: 'rig-ele btn-wrap' },
        _react2.default.createElement(_SendSmsCodeBtn2.default, {
          timer: props.timer || 60,
          onClick: props.onGetSmsCodeClick,
          styleName: props.btnStyleName || '',
          title: props.btnName,
          countdownTitle: props.btnNameCountdown
        })
      )
    );
  },
  ButtonSubmit: function ButtonSubmit(props) {
    return _react2.default.createElement(
      Button,
      {
        className: 'btn-submit ' + (props.className || '') + ' ' + (props.isLoading ? 'disable' : ''),
        'data-action': 'submit'
      },
      props.isLoading ? '正在处理...' : props.children
    );
  }
};
//# sourceMappingURL=component.js.map