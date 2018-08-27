'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.SubBlock = exports.BlockWrap = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; } /**
                                                                                                                                                                                                                              * Created by nonjene on 2018/5/2.
                                                                                                                                                                                                                              */

var BlockWrap = function BlockWrap(_ref) {
    var children = _ref.children,
        _ref$className = _ref.className,
        className = _ref$className === undefined ? '' : _ref$className,
        props = _objectWithoutProperties(_ref, ['children', 'className']);

    return _react2.default.createElement(
        'div',
        _extends({ className: 'u-block ' + className }, props),
        children
    );
};
exports.BlockWrap = BlockWrap;
var SubBlock = function SubBlock(_ref2) {
    var children = _ref2.children,
        _ref2$className = _ref2.className,
        className = _ref2$className === undefined ? '' : _ref2$className,
        props = _objectWithoutProperties(_ref2, ['children', 'className']);

    return _react2.default.createElement(
        'div',
        _extends({ className: 'u-sub ' + className }, props),
        children
    );
};
exports.SubBlock = SubBlock;
//# sourceMappingURL=Block.js.map