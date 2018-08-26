/**
 * Created by nonjene on 2018/5/2.
 */


const React = require('react');

const BlockWrap = function ({ children, className = '', ...props }) {
    return <div className={`u-block ${className}`} {...props}>{children}</div>
};
const SubBlock  = function ({ children, className = '', ...props }) {
    return <div className={`u-sub ${className}`} {...props}>{children}</div>
};

module.exports = {
    BlockWrap,
    SubBlock
};
