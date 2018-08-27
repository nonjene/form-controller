/**
 * 表单数据验证功能
 */

import * as util from './util/';
const { $, Widget } = util;

const isInputSelector = type => !!~'radio,checkbox'.indexOf(type);

class FormController extends Widget {
  constructor(opt) {
    super(opt);
    this.EVE_INPUT = util.getEveNameInput();
    this.opt = opt = {
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
      mapHintTargetName: oriName => oriName,
      ...opt
    };

    this.formNames = Object.keys(opt.defFormData);

    this.formdata = this.formNames.reduce((o, name) => {
      let val = opt.defFormData[name];
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

    this._chkStatus = this.formNames.reduce((_o, name) => {
      _o[name] = undefined;
      return _o;
    }, {});

    this._uid = (Math.random() * 1e5) | 0;

    opt.$container = $(opt.$container);

    this._bindEve();

    this.$allInput = opt.$container.find('input[name],textarea[name]');
    this.$allErrCont = opt.$container.find('span.err');
    this.$allBlock = opt.$container.find('[data-block]');
    setTimeout(() => {
      // 获取浏览器自动填充的数据（假如对应的formdata为空）
      this._syncViewData();
      // 把formdata更新到视图
      this._syncModelToView();
    }, 0);
  }
  _syncViewData() {
    const that = this;
    const isNotDef = name => this.formdata[name] === '';
    const runSet = (name, value) => {
      that.formdata[name] = value;
      that.chkOne(name, { loose: true });
    };

    this.$allInput.each(function() {
      if (isInputSelector(this.type)) {
        if (this.checked && isNotDef(this.name)) {
          runSet(this.name, this.value);
        }
      } else if (this.value && isNotDef(this.name)) {
        runSet(this.name, this.value);
      }
    });
  }
  _syncModelToView(names, opt) {
    if (!names) names = this.formNames;
    if (typeof names === 'string') names = [names];

    names.forEach(name => {
      // 表单数据一定是要字符串
      const val = this.formdata[name];

      // 空数据不需要同步
      if (!val && opt !== 'focus') return;

      this.$allInput.filter(`[name="${name}"]`).each(function() {
        if (isInputSelector(this.type)) {
          //debugger
          $(this).prop('checked', !!~val.split(',').indexOf(this.value));
        } else {
          this.value = val;
        }
      });
    });
  }
  getChkStatus(...scope) {
    if (!scope.length) {
      this.chkAll({ useCache: true });
      scope = Object.keys(this._chkStatus);
    } else {
      scope.forEach(name => this.updateChk(name));
    }

    return Promise.all(
      scope.map(name => {
        const status = this._chkStatus[name];

        if (status instanceof Promise) {
          return status.then(flg => flg === null);
        } else {
          return false;
        }
      })
    );
  }
  //给实例调用，以更新错误提示，（如用户未输入任何内容的时候）
  updateChk(name) {
    this.chkOne(name, {
      useCache: true
    });
  }
  updateData(name, val) {
    return this.updData(name, val);
  }
  updData(name, val, opt) {
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
  _filterChangedData(data) {
    return Object.keys(data).reduce((host, key) => {
      const func = this.opt.dataFilter[key];
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
  _cleanChk(name) {
    this._chkStatus[name] = undefined;
  }
  /**
   * 查看是否【已经或正在】检查用户的最新输入
   * @returns {boolean}
   */
  _isChked(name) {
    const status = this._chkStatus[name];

    return status instanceof Promise;
  }
  async chkAll(opt, pass) {
    const chk = await this.chkAllSetting(opt);

    if (chk.length < 1) return pass();

    if (chk.length > 0) {
      chk.forEach(item => this.showErr(item));
    }
  }
  async chkOne(name, opt = {}, pass) {
    const chk = await this.chkOneSetting(name, opt);

    switch (chk) {
      case null:
        this.opt.statMark && this.getDom('block', name).addClass('b-has-pass');
        // through
      case undefined:
        pass && pass();
        break;
      default:
        this.showErr(chk);
    }
  }
  async chkOneSetting(name, opt = {}) {
    let val = this.formdata[name];
    const rules = this.opt.chkVal[name] || {};
    const msg = this.opt.errMsg[name] || {};

    // 使用缓存的情况
    if (opt.useCache && this._isChked(name)) {
      return await this._chkStatus[name];
    }

    // 删除之前检查结果的缓存，避免异步时候出现混乱
    this._cleanChk(name);

    // 不严格的检测。当用户未输入时，不提示错误
    if (opt.loose && !val) {
      return undefined;
    }

    let rtn = null;

    return (this._chkStatus[name] = new Promise(async resolve => {
      for (let rule in rules) {
        if (!rules.hasOwnProperty(rule)) continue;
        // 区分异步还是同步
        const func = rules[rule];

        try {
          const flag = await func(val);

          if (!flag) {
            rtn = {
              msg: msg[rule],
              name
            };
            break;
          }
        } catch (e) {
          rtn = {
            msg: e,
            name
          };
          break;
        }
      }
      resolve(rtn);
    }));
  }
  async chkAllSetting(opt = {}) {
    return (await Promise.all(
      Object.keys(this.formdata).map(async name => {
        return await this.chkOneSetting(name, opt);
      })
    )).filter(item => item !== null);
  }
  // 获取或设置该name是否暂时隐藏了错误提示。
  _handleTempHideErr(name, action) {
    if (typeof action === 'undefined') return !!this[`_tempHideErr_${name}`];
    this[`_tempHideErr_${name}`] = action;
  }
  showErr(item) {
    this._handleTempHideErr(item.name, false);

    const name = this.opt.mapHintTargetName(item.name);

    this.getDom('err', name)
      .html(item.msg)
      .css('display', 'block');
    this.getDom('err', 'submit').css('display', 'block');
    this.opt.statMark && this.getDom('block', name).removeClass('b-has-pass').addClass('b-has-err');
  }
  hideErr(name, opt) {
    this._handleTempHideErr(name, opt === 'temp');

    name = this.opt.mapHintTargetName(name);
    this.getDom('err', name).css('display', 'none');
    this.getDom('err', 'submit').css('display', 'none');
    this.opt.statMark && this.getDom('block', name).removeClass('b-has-err');
  }
  getDom(type, name) {
    if (type === 'block') {
      if (this) return this.$allBlock.filter(`[data-block="${name}"]`);
    } else if (type === 'err') {
      return this.$allErrCont.filter(`[data-for="${name}"]`);
    } else {
      return $();
    }
  }
  _gatherValue({ type, value: val, name }) {
    if (type === 'checkbox') {
      // 提取checkbox 的所有值
      val = this.$allInput
        .filter(`[name="${name}"]:checked`)
        .map(function(i, iptChecked) {
          return iptChecked.value;
        })
        .get()
        .join(',');
    }

    return { name, val };
  }
  _bindEve() {
    const that = this;
    let isOnComposition = false;
    // fixed for Chrome v53+ and detect all Chrome
    // https://chromium.googlesource.com/chromium/src/
    // +/afce9d93e76f2ff81baaa088a4ea25f67d1a76b3%5E%21/
    const isChrome53plus = util.getChromeVer() > 52;

    //失焦后假如有变化
    const handleChange = function(e) {
      const { val, name } = that._gatherValue(this);

      that.updData(name, val, 'noSyncToView');

      that.trigger('input', {
        name,
        val,
        dom: this
      });
    };

    const deBounceHandleInput = util.debounceDo(50);
    //输入框 即时触发
    const handleInput = function() {
      //输入时，把对应的错误提示隐藏
      if (!this._tempHideErr) {
        that.hideErr(this.name, 'temp');
      }
      this._tempHideErr = true;

      if (isOnComposition) return;

      //筛选输入的数据
      deBounceHandleInput(() => {
        //筛选
        const data = that._filterChangedData({ [this.name]: this.value });

        //解决输入法的问题。
        if (data[this.name] !== this.value) {
          this.value = data[this.name];
        }

        that.trigger('input', {
          name: this.name,
          val: this.value,
          dom: this
        });
      });
    };

    // 输入法事件
    const handleComposition = function(e) {
      isOnComposition = e.type !== 'compositionend';

      if (!isOnComposition && isChrome53plus) {
        handleInput.call(this, e);
      }
    };

    const handleBlur = function(e) {
      this._tempHideErr = false;
      //
      if (that._handleTempHideErr(this.name)) {
        that.updateChk(this.name);
      }

      //
      that.opt.statMark && !isInputSelector(e.target.type) &&
        that.getDom('block', this.name).removeClass('b-has-focus');
    };
    const handleFocus = function(e) {
      that.opt.statMark && !isInputSelector(e.target.type) &&
        that.getDom('block', this.name).addClass('b-has-focus');
    };

    const handleSubmit = function(e) {
      e && e.preventDefault();
      if (that.isLoading) return;

      that.chkAll({ useCache: that.opt.blurChk }, () => {
        that.trigger('submit', that.formdata);
      });
    };

    const handleContainerKeydown = function(e) {
      if (e.keyCode === 13) {
        const lastI = that.$allInput.get().length - 1;
        that.$allInput.each(function(i) {
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
    const handleAfterInput = function(info) {
      //当有值, 加样式
      if (info.val !== '' && info.dom._blockDecoHasV !== true) {
        info.dom._blockDecoHasV = true;
        this.getDom('block', info.name).addClass('b-has-v');
      } else if (info.val === '' && info.dom._blockDecoHasV !== false) {
        info.dom._blockDecoHasV = false;
        this.getDom('block', info.name).removeClass('b-has-v');
      }
    };

    const _tar = 'input,textarea';
    this.opt.$container
      .on('keydown.' + this._uid, handleContainerKeydown)
      .on('change.' + this._uid, _tar, handleChange)
      //.on('change' + '.' + this._uid, 'input[type="radio"]', handleInput)
      .on(this.EVE_INPUT + '.' + this._uid, _tar, handleInput)
      .on('compositionstart' + '.' + this._uid, _tar, handleComposition)
      .on('compositionupdate' + '.' + this._uid, _tar, handleComposition)
      .on('compositionend' + '.' + this._uid, _tar, handleComposition)
      .on('blur.' + this._uid, _tar, handleBlur)
      .on('focus.' + this._uid, _tar, handleFocus)
      .on('click.' + this._uid, '[data-action="submit"]', handleSubmit);

    // 样式控制
    this.opt.statMark && this.on('input', handleAfterInput);
    //
  }
  destory() {
    this.opt.$container
      .off('change.' + this._uid)
      .off(this.EVE_INPUT + '.' + this._uid)
      .off('blur.' + this._uid)
      .off('click.' + this._uid);

    this.off('input').off('submit');
  }
}
export default FormController;
