/**
 * Created by nonjene on 2018/5/2.
 */


import React from 'react';

export const BlockWrap = function ({ children, className = '', ...props }) {
    return <div className={`u-block ${className}`} {...props}>{children}</div>
};
export const SubBlock  = function ({ children, className = '', ...props }) {
    return <div className={`u-sub ${className}`} {...props}>{children}</div>
};
