import Widget from './Widget';

const getEve = (eveHost)=> {
  if(eveHost) return eveHost;
  return new Widget();
};

/**
 * jquery lite
 * @param {string} query
 * @param {object} scope
 */
const $ = function(query, scope) {
  if ('jQuery' in window || 'zepto' in window) {
    return (window.jQuery || window.zepto)(query, scope);
  }

  let $query;
  if (query && typeof query === 'string') {
    if (!scope) scope = document;
    $query = [...scope.querySelectorAll(query)];
  } else if (Array.isArray(query)) {
    $query = query;
  } else if (query instanceof HTMLElement) {
    $query = [query];
  } else if (query instanceof NodeList || query instanceof HTMLCollection) {
    $query = [...query];
  } else {
    $query = [];
  }

  let eveHost; // event host

  return {
    each(func) {
      if (!func) return this;
      $query.forEach((node, i) => {
        func.call(node, i, node);
      });
    },
    find() {},
    eq() {},
    html() {},
    prop() {},
    /**
     *
     * @param {string} rule only support [propName1="val"]:propName2, and match once.
     */
    filter(rule) {
      const reg = /\[([^=]+)=(\S+)\]/.exec(rule);
      const reg2 = /\:(\S+)/.exec(rule);
      if (!reg && !reg2) return $();

      const props = {};
      const dataset = {};

      if (reg) {
        const val = reg[2].replace(/"|'/g, '');

        if (reg[1].indexOf('data-') === 0) {
          dataset[reg[1].slice(5)] = val;
        } else {
          props[reg[1]] = val;
        }
      }
      if (reg2) {
        props[reg[1]] = true;
      }

      const $newQuery = $query.filter(node => {
        return (
          Object.keys(props).every(key => node[key] === props[key]) &&
          Object.keys(dataset).every(key => node.dataset[key] === dataset[key])
        );
      });

      return $($newQuery);
    },
    map() {},
    get() {},
    on(eve, tar, func) {
      eveHost = getEve(eveHost);
      if (typeof func !== 'function') func = tar;
    },
    off(eve, tar, func) {
      eveHost = getEve(eveHost);
    }
  };
};

export default $;