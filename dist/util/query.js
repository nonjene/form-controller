'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _Widget = require('./Widget');

var _Widget2 = _interopRequireDefault(_Widget);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var getEve = function getEve(eveHost) {
  if (eveHost) return eveHost;
  return new _Widget2.default();
};

var parseEveName = function parseEveName(eve) {
  var _eve$split = eve.split('.'),
      _eve$split2 = _slicedToArray(_eve$split, 1),
      eName = _eve$split2[0];

  var map = {
    blur: 'focusout',
    focus: 'focusin'
  };
  return map[eName] || eName;
};

var parseQuery = function parseQuery(_rule) {
  if (typeof _rule !== 'string') _rule = '';

  var regPropVal = /\[([^=]+)=(\S+)\]/;
  var regPropBool = /\:(\S+)/;
  var regTagName = /^([a-zA-Z0-9]+)/;

  var aRule = _rule.split(',');

  return aRule.map(function (rule) {
    var props = {};
    var dataset = {};

    var matchPropVal = regPropVal.exec(rule);
    var matchPropBool = regPropBool.exec(rule);
    var matchTagName = regTagName.exec(rule);

    if (matchPropVal) {
      var val = matchPropVal[2].replace(/"|'/g, '');

      if (matchPropVal[1].indexOf('data-') === 0) {
        dataset[matchPropVal[1].slice(5)] = val;
      } else {
        props[matchPropVal[1]] = val;
      }
    }
    if (matchPropBool) {
      props[matchPropBool[1]] = true;
    }
    if (matchTagName) {
      props.tagName = matchTagName[1].toUpperCase();
    }

    return { props: props, dataset: dataset };
  });
};

/**
 * jquery lite, only for FormController uses.
 * @param {string} query
 * @param {object} scope
 */
var $ = function $(query, scope) {
  if ('jQuery' in window || 'zepto' in window) {
    return (window.jQuery || window.zepto)(query, scope);
  }

  var $nodeList = void 0;
  if (query && typeof query === 'string') {
    if (!scope) scope = document;
    $nodeList = [].concat(_toConsumableArray(scope.querySelectorAll(query)));
  } else if (Array.isArray(query)) {
    $nodeList = query;
  } else if (query instanceof HTMLElement) {
    $nodeList = [query];
  } else if (query instanceof NodeList || query instanceof HTMLCollection) {
    $nodeList = [].concat(_toConsumableArray(query));
  } else {
    $nodeList = [];
  }

  var eveHost = void 0; // event host

  return {
    each: function each(func) {
      $nodeList.forEach(function (node, i) {
        return func.call(node, i, node);
      });
      return this;
    },
    map: function map(func) {
      if (!func) return this;
      return $($nodeList.map(function (node, i) {
        return func.call(node, i, node);
      }));
    },
    get: function get() {
      return $nodeList;
    },
    find: function find(rule) {
      var nodeList = [];
      this.each(function () {
        $(rule, this).each(function () {
          nodeList.push(this);
        });
      });
      return $(nodeList);
    },
    eq: function eq(i) {
      return $nodeList[i];
    },
    html: function html(cont) {
      if (typeof cont === 'undefined') {
        return $nodeList[0] && $nodeList[0].innerHTML;
      } else {
        this.each(function () {
          this.innerHTML = cont;
        });
        return this;
      }
    },
    prop: function prop(name, val) {
      this.each(function () {
        this[name] = val;
      });
      return this;
    },
    css: function css(name, val) {
      this.each(function () {
        this.style[name] = val;
      });
      return this;
    },

    /**
     *
     * @param {string} rule only support tagName[propName1="val"]:propName2,
     *                      no className or children selector like '>| '.
     */
    filter: function filter(rule) {
      var aQuery = parseQuery(rule);

      var $newNodeList = $nodeList.filter(function (node) {
        return aQuery.some(function (_ref) {
          var props = _ref.props,
              dataset = _ref.dataset;

          return Object.keys(props).every(function (key) {
            return node[key] === props[key];
          }) && Object.keys(dataset).every(function (key) {
            return node.dataset[key] === dataset[key];
          });
        });
      });

      return $($newNodeList);
    },
    removeClass: function removeClass(cn) {
      this.each(function () {
        var setClassList = new Set(this.classList);
        setClassList.delete(cn);
        this.className = Array.from(setClassList).join(' ');
      });
      return this;
    },
    addClass: function addClass(cn) {
      this.each(function () {
        this.className = Array.from(new Set(this.classList).add(cn)).join(' ');
      });
      return this;
    },
    on: function on(eve, tar, func) {
      eveHost = getEve(eveHost);
      if (typeof func !== 'function') {
        func = tar;
        tar = false;
      }

      eveHost.on(eve, func);

      // 为了方便注销事件，同一个事件只需要绑定一次
      if (!eveHost[eve]) {
        eveHost[eve] = function (e) {
          if (tar) {
            this['_proxyEventTarget_' + tar].get().some(function (node) {
              var isHitted = node.contains(e.target);

              isHitted && eveHost.trigger({
                eve: eve,
                env: node
              }, e);
              return isHitted;
            });
          } else {
            eveHost.trigger(eve, e);
          }
        };
        this.each(function () {
          if (tar) {
            this['_proxyEventTarget_' + tar] = $(tar, this);
          }
          this.addEventListener(parseEveName(eve), eveHost[eve], false);
        });
      }

      return this;
    },
    off: function off(eve, func) {
      eveHost = getEve(eveHost);

      eveHost[eve] && this.each(function () {
        this.removeEventListener(parseEveName(eve), eveHost[eve], false);
      });

      eveHost.off(eve);
      delete eveHost[eve];
      return this;
    }
  };
};

exports.default = $;
//# sourceMappingURL=query.js.map