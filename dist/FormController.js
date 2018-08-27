'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _util = require('./util/');

var util = _interopRequireWildcard(_util);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * 表单数据验证功能
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var $ = util.$,
    Widget = util.Widget;


var isInputSelector = function isInputSelector(type) {
  return !!~'radio,checkbox'.indexOf(type);
};

var FormController = function (_Widget) {
  _inherits(FormController, _Widget);

  function FormController(opt) {
    _classCallCheck(this, FormController);

    var _this = _possibleConstructorReturn(this, (FormController.__proto__ || Object.getPrototypeOf(FormController)).call(this, opt));

    _this.EVE_INPUT = util.getEveNameInput();
    _this.opt = opt = _extends({
      // 容器
      $container: null,
      // 失焦就检测
      blurChk: true,

      // 用户输入交互，如聚焦失焦，错误，空值
      statMark: true,

      // 默认的表单数据，就算是空的也要加上去。
      defFormData: {
        /*
          name: '',
          mobile: '',
        */
      },

      // 实时控制用户输入的数据
      dataFilter: {
        /*
          mobile: val => val.replace(/[^\d]/g, '').slice(0, 11),
        */
      },

      // 数据验证
      chkVal: {
        /*
          name: {
            require: (val,next) => {
                next(val.length > 0)
            },
            max: val => val.length < 11
          },
          mobile: {
            require: val => /^1\d{10}$/.test(val)
          },
        */
      },

      // 错误提示文案
      errMsg: {
        /*
          name: {
            require: '请填写收件人',
            max:'收件人请限制10个字以内'
          },
          mobile: {
            require: '请填写正确的联系电话'
          },
        */
      },
      mapHintTargetName: function mapHintTargetName(oriName) {
        return oriName;
      }
    }, opt);

    _this.formNames = Object.keys(opt.defFormData);

    _this.formdata = _this.formNames.reduce(function (o, name) {
      var val = opt.defFormData[name];
      if (val === null || val === undefined) {
        val = '';
      }
      o[name] = String(val);
      return o;
    }, {});

    // 1. undefined 表示没有检查过，
    // 2. Promise:
    //      1. null 表示检查通过，
    //      2. { msg, name} 表示有错误;

    _this._chkStatus = _this.formNames.reduce(function (_o, name) {
      _o[name] = undefined;
      return _o;
    }, {});

    _this._uid = Math.random() * 1e5 | 0;

    opt.$container = $(opt.$container);

    _this._bindEve();

    _this.$allInput = opt.$container.find('input[name],textarea[name]');
    _this.$allErrCont = opt.$container.find('span.err');
    _this.$allBlock = opt.$container.find('[data-block]');
    setTimeout(function () {
      // 获取浏览器自动填充的数据（假如对应的formdata为空）
      _this._syncViewData();
      // 把formdata更新到视图
      _this._syncModelToView();
    }, 0);
    return _this;
  }

  _createClass(FormController, [{
    key: '_syncViewData',
    value: function _syncViewData() {
      var _this2 = this;

      var that = this;
      var isNotDef = function isNotDef(name) {
        return _this2.formdata[name] === '';
      };
      var runSet = function runSet(name, value) {
        that.formdata[name] = value;
        that.chkOne(name, { loose: true });
      };

      this.$allInput.each(function () {
        if (isInputSelector(this.type)) {
          if (this.checked && isNotDef(this.name)) {
            runSet(this.name, this.value);
          }
        } else if (this.value && isNotDef(this.name)) {
          runSet(this.name, this.value);
        }
      });
    }
  }, {
    key: '_syncModelToView',
    value: function _syncModelToView(names, opt) {
      var _this3 = this;

      if (!names) names = this.formNames;
      if (typeof names === 'string') names = [names];

      names.forEach(function (name) {
        // 表单数据一定是要字符串
        var val = _this3.formdata[name];

        // 空数据不需要同步
        if (!val && opt !== 'focus') return;

        _this3.$allInput.filter('[name="' + name + '"]').each(function () {
          if (isInputSelector(this.type)) {
            //debugger
            $(this).prop('checked', !!~val.split(',').indexOf(this.value));
          } else {
            this.value = val;
          }
        });
      });
    }
  }, {
    key: 'getChkStatus',
    value: function getChkStatus() {
      var _this4 = this;

      for (var _len = arguments.length, scope = Array(_len), _key = 0; _key < _len; _key++) {
        scope[_key] = arguments[_key];
      }

      if (!scope.length) {
        this.chkAll({ useCache: true });
        scope = Object.keys(this._chkStatus);
      } else {
        scope.forEach(function (name) {
          return _this4.updateChk(name);
        });
      }

      return Promise.all(scope.map(function (name) {
        var status = _this4._chkStatus[name];

        if (status instanceof Promise) {
          return status.then(function (flg) {
            return flg === null;
          });
        } else {
          return false;
        }
      }));
    }
    //给实例调用，以更新错误提示，（如用户未输入任何内容的时候）

  }, {
    key: 'updateChk',
    value: function updateChk(name) {
      this.chkOne(name, {
        useCache: true
      });
    }
  }, {
    key: 'updateData',
    value: function updateData(name, val) {
      return this.updData(name, val);
    }
  }, {
    key: 'updData',
    value: function updData(name, val, opt) {
      this.hideErr(name);

      this.formdata[name] = val;
      //清除检查结果。
      this._cleanChk(name);

      opt !== 'noSyncToView' && this._syncModelToView(name, 'focus');

      if (this.opt.blurChk) {
        this.chkOne(name, { loose: true, useCache: true });
      }
      this.opt.debug && console.log(name, val);
    }
  }, {
    key: '_filterChangedData',
    value: function _filterChangedData(data) {
      var _this5 = this;

      return Object.keys(data).reduce(function (host, key) {
        var func = _this5.opt.dataFilter[key];
        host[key] = func ? func(data[key]) : data[key];
        return host;
      }, {});
    }
    /**
     * 清楚检测结果
     * @this._chkStatus[name]
     *      Promise instance： pending 等待异步结果
     *      null:表示检查通过，
     *      undefined: 表示没有检查过，
     *      { msg, name}: 表示有错误
     * @param name  form name
     */

  }, {
    key: '_cleanChk',
    value: function _cleanChk(name) {
      this._chkStatus[name] = undefined;
    }
    /**
     * 查看是否【已经或正在】检查用户的最新输入
     * @returns {boolean}
     */

  }, {
    key: '_isChked',
    value: function _isChked(name) {
      var status = this._chkStatus[name];

      return status instanceof Promise;
    }
  }, {
    key: 'chkAll',
    value: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(opt, pass) {
        var _this6 = this;

        var chk;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return this.chkAllSetting(opt);

              case 2:
                chk = _context.sent;

                if (!(chk.length < 1)) {
                  _context.next = 5;
                  break;
                }

                return _context.abrupt('return', pass());

              case 5:

                if (chk.length > 0) {
                  chk.forEach(function (item) {
                    return _this6.showErr(item);
                  });
                }

              case 6:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function chkAll(_x, _x2) {
        return _ref.apply(this, arguments);
      }

      return chkAll;
    }()
  }, {
    key: 'chkOne',
    value: function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(name) {
        var opt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        var pass = arguments[2];
        var chk;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return this.chkOneSetting(name, opt);

              case 2:
                chk = _context2.sent;
                _context2.t0 = chk;
                _context2.next = _context2.t0 === null ? 6 : _context2.t0 === undefined ? 7 : 9;
                break;

              case 6:
                this.opt.statMark && this.getDom('block', name).addClass('b-has-pass');

              case 7:
                pass && pass();
                return _context2.abrupt('break', 10);

              case 9:
                this.showErr(chk);

              case 10:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function chkOne(_x3) {
        return _ref2.apply(this, arguments);
      }

      return chkOne;
    }()
  }, {
    key: 'chkOneSetting',
    value: function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(name) {
        var _this7 = this;

        var opt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        var val, rules, msg, rtn;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                val = this.formdata[name];
                rules = this.opt.chkVal[name] || {};
                msg = this.opt.errMsg[name] || {};

                // 使用缓存的情况

                if (!(opt.useCache && this._isChked(name))) {
                  _context4.next = 7;
                  break;
                }

                _context4.next = 6;
                return this._chkStatus[name];

              case 6:
                return _context4.abrupt('return', _context4.sent);

              case 7:

                // 删除之前检查结果的缓存，避免异步时候出现混乱
                this._cleanChk(name);

                // 不严格的检测。当用户未输入时，不提示错误

                if (!(opt.loose && !val)) {
                  _context4.next = 10;
                  break;
                }

                return _context4.abrupt('return', undefined);

              case 10:
                rtn = null;
                return _context4.abrupt('return', this._chkStatus[name] = new Promise(function () {
                  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(resolve) {
                    var rule, func, flag;
                    return regeneratorRuntime.wrap(function _callee3$(_context3) {
                      while (1) {
                        switch (_context3.prev = _context3.next) {
                          case 0:
                            _context3.t0 = regeneratorRuntime.keys(rules);

                          case 1:
                            if ((_context3.t1 = _context3.t0()).done) {
                              _context3.next = 21;
                              break;
                            }

                            rule = _context3.t1.value;

                            if (rules.hasOwnProperty(rule)) {
                              _context3.next = 5;
                              break;
                            }

                            return _context3.abrupt('continue', 1);

                          case 5:
                            // 区分异步还是同步
                            func = rules[rule];
                            _context3.prev = 6;
                            _context3.next = 9;
                            return func(val);

                          case 9:
                            flag = _context3.sent;

                            if (flag) {
                              _context3.next = 13;
                              break;
                            }

                            rtn = {
                              msg: msg[rule],
                              name: name
                            };
                            return _context3.abrupt('break', 21);

                          case 13:
                            _context3.next = 19;
                            break;

                          case 15:
                            _context3.prev = 15;
                            _context3.t2 = _context3['catch'](6);

                            rtn = {
                              msg: _context3.t2,
                              name: name
                            };
                            return _context3.abrupt('break', 21);

                          case 19:
                            _context3.next = 1;
                            break;

                          case 21:
                            resolve(rtn);

                          case 22:
                          case 'end':
                            return _context3.stop();
                        }
                      }
                    }, _callee3, _this7, [[6, 15]]);
                  }));

                  return function (_x7) {
                    return _ref4.apply(this, arguments);
                  };
                }()));

              case 12:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function chkOneSetting(_x5) {
        return _ref3.apply(this, arguments);
      }

      return chkOneSetting;
    }()
  }, {
    key: 'chkAllSetting',
    value: function () {
      var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6() {
        var _this8 = this;

        var opt = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                _context6.next = 2;
                return Promise.all(Object.keys(this.formdata).map(function () {
                  var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(name) {
                    return regeneratorRuntime.wrap(function _callee5$(_context5) {
                      while (1) {
                        switch (_context5.prev = _context5.next) {
                          case 0:
                            _context5.next = 2;
                            return _this8.chkOneSetting(name, opt);

                          case 2:
                            return _context5.abrupt('return', _context5.sent);

                          case 3:
                          case 'end':
                            return _context5.stop();
                        }
                      }
                    }, _callee5, _this8);
                  }));

                  return function (_x9) {
                    return _ref6.apply(this, arguments);
                  };
                }()));

              case 2:
                _context6.t0 = function (item) {
                  return item !== null;
                };

                return _context6.abrupt('return', _context6.sent.filter(_context6.t0));

              case 4:
              case 'end':
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      function chkAllSetting() {
        return _ref5.apply(this, arguments);
      }

      return chkAllSetting;
    }()
    // 获取或设置该name是否暂时隐藏了错误提示。

  }, {
    key: '_handleTempHideErr',
    value: function _handleTempHideErr(name, action) {
      if (typeof action === 'undefined') return !!this['_tempHideErr_' + name];
      this['_tempHideErr_' + name] = action;
    }
  }, {
    key: 'showErr',
    value: function showErr(item) {
      this._handleTempHideErr(item.name, false);

      var name = this.opt.mapHintTargetName(item.name);

      this.getDom('err', name).html(item.msg).css('display', 'block');
      this.getDom('err', 'submit').css('display', 'block');
      this.opt.statMark && this.getDom('block', name).removeClass('b-has-pass').addClass('b-has-err');
    }
  }, {
    key: 'hideErr',
    value: function hideErr(name, opt) {
      this._handleTempHideErr(name, opt === 'temp');

      name = this.opt.mapHintTargetName(name);
      this.getDom('err', name).css('display', 'none');
      this.getDom('err', 'submit').css('display', 'none');
      this.opt.statMark && this.getDom('block', name).removeClass('b-has-err');
    }
  }, {
    key: 'getDom',
    value: function getDom(type, name) {
      if (type === 'block') {
        if (this) return this.$allBlock.filter('[data-block="' + name + '"]');
      } else if (type === 'err') {
        return this.$allErrCont.filter('[data-for="' + name + '"]');
      } else {
        return $();
      }
    }
  }, {
    key: '_gatherValue',
    value: function _gatherValue(_ref7) {
      var type = _ref7.type,
          val = _ref7.value,
          name = _ref7.name;

      if (type === 'checkbox') {
        // 提取checkbox 的所有值
        val = this.$allInput.filter('[name="' + name + '"]:checked').map(function (i, iptChecked) {
          return iptChecked.value;
        }).get().join(',');
      }

      return { name: name, val: val };
    }
  }, {
    key: '_bindEve',
    value: function _bindEve() {
      var that = this;
      var isOnComposition = false;
      // fixed for Chrome v53+ and detect all Chrome
      // https://chromium.googlesource.com/chromium/src/
      // +/afce9d93e76f2ff81baaa088a4ea25f67d1a76b3%5E%21/
      var isChrome53plus = util.getChromeVer() > 52;

      //失焦后假如有变化
      var handleChange = function handleChange(e) {
        var _that$_gatherValue = that._gatherValue(this),
            val = _that$_gatherValue.val,
            name = _that$_gatherValue.name;

        that.updData(name, val, 'noSyncToView');

        that.trigger('input', {
          name: name,
          val: val,
          dom: this
        });
      };

      var deBounceHandleInput = util.debounceDo(50);
      //输入框 即时触发
      var handleInput = function handleInput() {
        var _this9 = this;

        //输入时，把对应的错误提示隐藏
        if (!this._tempHideErr) {
          that.hideErr(this.name, 'temp');
        }
        this._tempHideErr = true;

        if (isOnComposition) return;

        //筛选输入的数据
        deBounceHandleInput(function () {
          //筛选
          var data = that._filterChangedData(_defineProperty({}, _this9.name, _this9.value));

          //解决输入法的问题。
          if (data[_this9.name] !== _this9.value) {
            _this9.value = data[_this9.name];
          }

          that.trigger('input', {
            name: _this9.name,
            val: _this9.value,
            dom: _this9
          });
        });
      };

      // 输入法事件
      var handleComposition = function handleComposition(e) {
        isOnComposition = e.type !== 'compositionend';

        if (!isOnComposition && isChrome53plus) {
          handleInput.call(this, e);
        }
      };

      var handleBlur = function handleBlur() {
        this._tempHideErr = false;
        //
        if (that._handleTempHideErr(this.name)) {
          that.updateChk(this.name);
        }

        //
        that.opt.statMark && that.getDom('block', this.name).removeClass('b-has-focus');
      };
      var handleFocus = function handleFocus() {
        that.opt.statMark && that.getDom('block', this.name).addClass('b-has-focus');
      };

      var handleSubmit = function handleSubmit(e) {
        e && e.preventDefault();
        if (that.isLoading) return;

        that.chkAll({ useCache: that.opt.blurChk }, function () {
          that.trigger('submit', that.formdata);
        });
      };

      var handleContainerKeydown = function handleContainerKeydown(e) {
        if (e.keyCode === 13) {
          var lastI = that.$allInput.length - 1;
          that.$allInput.each(function (i) {
            if (this === e.target) {
              if (i === lastI) {
                if (e.target.type === 'textarea') return;
                handleSubmit();
              } else {
                that.$allInput.eq(i + 1).focus();
              }
            }
          });
        }
      };
      var handleAfterInput = function handleAfterInput(info) {
        //当有值, 加样式
        if (info.val !== '' && info.dom._blockDecoHasV !== true) {
          info.dom._blockDecoHasV = true;
          this.getDom('block', info.name).addClass('b-has-v');
        } else if (info.val === '' && info.dom._blockDecoHasV !== false) {
          info.dom._blockDecoHasV = false;
          this.getDom('block', info.name).removeClass('b-has-v');
        }
      };

      var _tar = 'input,textarea';
      this.opt.$container.on('keydown.' + this._uid, handleContainerKeydown).on('change.' + this._uid, _tar, handleChange)
      //.on('change' + '.' + this._uid, 'input[type="radio"]', handleInput)
      .on(this.EVE_INPUT + '.' + this._uid, _tar, handleInput).on('compositionstart' + '.' + this._uid, _tar, handleComposition).on('compositionupdate' + '.' + this._uid, _tar, handleComposition).on('compositionend' + '.' + this._uid, _tar, handleComposition).on('blur.' + this._uid, _tar, handleBlur).on('focus.' + this._uid, _tar, handleFocus).on('click.' + this._uid, '[data-action="submit"]', handleSubmit);

      // 样式控制
      this.opt.statMark && this.on('input', handleAfterInput);
      //
    }
  }, {
    key: 'destory',
    value: function destory() {
      this.opt.$container.off('change.' + this._uid).off(this.EVE_INPUT + '.' + this._uid).off('blur.' + this._uid).off('click.' + this._uid);

      this.off('input').off('submit');
    }
  }]);

  return FormController;
}(Widget);

exports.default = FormController;
//# sourceMappingURL=FormController.js.map