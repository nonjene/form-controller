/**
 * Widget
 */
export default class Widget {
  constructor() {}
  _checkSlot() {
    if (!this._slot) {
      this._slot = {};
    }
  }
  on(eve, cb) {
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
  off(eve) {
    this._checkSlot();
    delete this._slot[eve];
    return this;
  }
  _doTrigger(eve, params, env) {
    this._checkSlot();
    var that = env || this;

    var allEve = this._slot[eve];
    if (!allEve) return this;

    for (let eFunc of allEve) {
      try {
        eFunc.apply(that, params);
      } catch (e) {
        console.error && console.error(e);
      }
    }
  }

  // trigger('xxx.ins') 立即触发
  // trigger('xxx')   异步触发
  trigger() {
    var args = Array.prototype.slice.call(arguments);
    var eve = args[0],
      params = args.slice(1);
    var env;

    if (typeof eve === 'object') {
      env = eve.env;
      eve = eve.eve;
    }

    return this._doTrigger(eve, params, env);

    return this;
  }
}
