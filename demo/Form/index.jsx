/**
 * Created by nonjene on 2018/5/8.
 */
require('./scss/index.scss');
const React = require('react');
//const PropTypes = require('prop-types');

const { BlockWrap, SubBlock } = require('../block/SubBlock');
const _raw = require('./component').default;

module.exports = _raw({ BlockWrap, SubBlock });
