import Widget from './Widget';

const getEve = eveHost => {
  if (eveHost) return eveHost;
  return new Widget();
};

const parseQuery = function(_rule) {
  if (typeof _rule !== 'string') _rule = '';

  const regPropVal = /\[([^=]+)=(\S+)\]/;
  const regPropBool = /\:(\S+)/;
  const regTagName = /^([a-zA-Z0-9]+)/;

  const aRule = _rule.split(',');

  return aRule.map(rule => {
    const props = {};
    const dataset = {};

    const matchPropVal = regPropVal.exec(rule);
    const matchPropBool = regPropBool.exec(rule);
    const matchTagName = regTagName.exec(rule);

    if (matchPropVal) {
      const val = matchPropVal[2].replace(/"|'/g, '');

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

    return { props, dataset };
  });
};

/**
 * jquery lite, only for FormController uses.
 * @param {string} query
 * @param {object} scope
 */
const $ = function(query, scope) {
  if ('jQuery' in window || 'zepto' in window) {
    return (window.jQuery || window.zepto)(query, scope);
  }

  let $nodeList;
  if (query && typeof query === 'string') {
    if (!scope) scope = document;
    $nodeList = [...scope.querySelectorAll(query)];
  } else if (Array.isArray(query)) {
    $nodeList = query;
  } else if (query instanceof HTMLElement) {
    $nodeList = [query];
  } else if (query instanceof NodeList || query instanceof HTMLCollection) {
    $nodeList = [...query];
  } else {
    $nodeList = [];
  }

  let eveHost; // event host

  return {
    each(func) {
      $nodeList.forEach((node, i) => func.call(node, i, node));
      return this;
    },
    map(func) {
      if (!func) return this;
      return $($nodeList.map((node, i) => func.call(node, i, node)));
    },
    get() {
      return $nodeList;
    },
    find(rule) {
      const nodeList = [];
      this.each(function() {
        $(rule, this).each(function() {
          nodeList.push(this);
        });
      });
      return $(nodeList);
    },
    eq(i) {
      return $nodeList[i];
    },
    html(cont) {
      if (typeof cont === 'undefined') {
        return $nodeList[0] && $nodeList[0].innerHTML;
      } else {
        this.each(function() {
          this.innerHTML = cont;
        });
        return this;
      }
    },
    prop(name, val) {
      this.each(function() {
        this[name] = val;
      });
      return this;
    },
    /**
     *
     * @param {string} rule only support tagName[propName1="val"]:propName2,
     *                      no className or children selector like '>| '.
     */
    filter(rule) {
      const aQuery = parseQuery(rule);

      const $newNodeList = $nodeList.filter(node => {
        return aQuery.some(({ props, dataset }) => {
          return (
            Object.keys(props).every(key => node[key] === props[key]) &&
            Object.keys(dataset).every(
              key => node.dataset[key] === dataset[key]
            )
          );
        });
      });

      return $($newNodeList);
    },
    removeClass(cn) {
      this.each(function() {
        this.className = Array.from(new Set(this.classList).delete(cn)).join(
          ' '
        );
      });
    },
    addClass(cn) {
      this.each(function() {
        this.className = Array.from(new Set(this.classList).add(cn)).join(' ');
      });
    },
    on(eve, tar, func) {
      eveHost = getEve(eveHost);
      if (typeof func !== 'function') {
        func = tar;
        tar = false;
      }

      const [eName] = eve.split('.');

      eveHost.on(eve, func);

      // 为了方便注销事件，同一个事件只需要绑定一次
      if (!eveHost[eve]) {
        eveHost[eve] = function(e) {
          if (tar) {
            this._proxyEventTarget.get().some(node => {
              const isHitted = node.contains(e.target);

              isHitted &&
                eveHost.trigger(
                  {
                    eve,
                    env: node
                  },
                  e
                );
              return isHitted;
            });
          }
        };
        this.each(function() {
          if (tar) {
            this._proxyEventTarget = $(tar, this);
          }
          this.addEventListener(eName, eveHost[eve], false);
        });
      }

      return this;
    },
    off(eve, func) {
      eveHost = getEve(eveHost);

      const [eName] = eve.split('.');

      eveHost[eve] &&
        this.each(function() {
          this.removeEventListener(eName, eveHost[eve], false);
        });

      eveHost.off(eve);
      delete eveHost[eve];
    }
  };
};

export default $;
