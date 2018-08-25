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
