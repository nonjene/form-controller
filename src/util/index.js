export { default as Widget } from './Widget';
export { default as $ } from './query';

/**
 * get input event name
 */
export const getEveNameInput = function() {
  if (this._eveInput) return this._eveInput;
  const ipt = document.createElement('input');
  if ('oninput' in ipt) {
    this._eveInput = 'input';
  } else {
    this._eveInput = 'keyup';
  }
  return this._eveInput;
};

export const getChromeVer = function() {
  var raw = navigator.userAgent.toLowerCase().match(/chrom(e|ium)\/([0-9]+)\./);
  return raw ? parseInt(raw[2], 10) : false;
};

/**
 * 去抖动, 先执行一次
 * @param gap   时间间隔
 */
export const debounceDo = function(gap = 100) {
  var flagDo, flagClean;

  var timeOutclean = function() {
    flagClean = setTimeout(function() {
      flagDo = null;
      flagClean = null;
    }, gap);
  };
  
  return function(done) {
    if (!flagClean) {
      timeOutclean();
      return done();
    }

    clearTimeout(flagDo);
    clearTimeout(flagClean);

    flagDo = setTimeout(function() {
      //避免： 1-----1-1-----1-1-----1-1
      timeOutclean();
      return done();
    }, gap);
  };
};
