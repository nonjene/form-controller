'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Widget = require('./Widget');

Object.defineProperty(exports, 'Widget', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Widget).default;
  }
});

var _query = require('./query');

Object.defineProperty(exports, '$', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_query).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * get input event name
 */
var getEveNameInput = exports.getEveNameInput = function getEveNameInput() {
  if (this._eveInput) return this._eveInput;
  var ipt = document.createElement('input');
  if ('oninput' in ipt) {
    this._eveInput = 'input';
  } else {
    this._eveInput = 'keyup';
  }
  return this._eveInput;
};

var getChromeVer = exports.getChromeVer = function getChromeVer() {
  var raw = navigator.userAgent.toLowerCase().match(/chrom(e|ium)\/([0-9]+)\./);
  return raw ? parseInt(raw[2], 10) : false;
};

/**
 * 去抖动, 先执行一次
 * @param gap   时间间隔
 */
var debounceDo = exports.debounceDo = function debounceDo() {
  var gap = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 100;

  var flagDo, flagClean;

  var timeOutclean = function timeOutclean() {
    flagClean = setTimeout(function () {
      flagDo = null;
      flagClean = null;
    }, gap);
  };

  return function (done) {
    if (!flagClean) {
      timeOutclean();
      return done();
    }

    clearTimeout(flagDo);
    clearTimeout(flagClean);

    flagDo = setTimeout(function () {
      //避免： 1-----1-1-----1-1-----1-1
      timeOutclean();
      return done();
    }, gap);
  };
};
//# sourceMappingURL=index.js.map