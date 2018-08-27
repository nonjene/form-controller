'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Widget
 */
var Widget = function () {
  function Widget() {
    _classCallCheck(this, Widget);
  }

  _createClass(Widget, [{
    key: '_checkSlot',
    value: function _checkSlot() {
      if (!this._slot) {
        this._slot = {};
      }
    }
  }, {
    key: 'on',
    value: function on(eve, cb) {
      if (typeof cb !== 'function') return this;
      this._checkSlot();

      var slot = this._slot[eve];
      if (!slot) {
        this._slot[eve] = [cb];
      } else {
        slot.push(cb);
      }
      return this;
    }
  }, {
    key: 'off',
    value: function off(eve) {
      this._checkSlot();
      delete this._slot[eve];
      return this;
    }
  }, {
    key: '_doTrigger',
    value: function _doTrigger(eve, params, env) {
      this._checkSlot();
      var that = env || this;

      var allEve = this._slot[eve];
      if (!allEve) return this;

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = allEve[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var eFunc = _step.value;

          try {
            eFunc.apply(that, params);
          } catch (e) {
            console.error && console.error(e);
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }

    // trigger('xxx.ins') 立即触发
    // trigger('xxx')   异步触发

  }, {
    key: 'trigger',
    value: function trigger() {
      var args = Array.prototype.slice.call(arguments);
      var eve = args[0],
          params = args.slice(1);
      var env;

      if ((typeof eve === 'undefined' ? 'undefined' : _typeof(eve)) === 'object') {
        env = eve.env;
        eve = eve.eve;
      }

      return this._doTrigger(eve, params, env);

      return this;
    }
  }]);

  return Widget;
}();

exports.default = Widget;
//# sourceMappingURL=Widget.js.map