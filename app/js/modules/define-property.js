module.exports = function(obj, key, value) {
    'use strict';

    try {
        Object.defineProperty(obj, key, {
            writable: false,
            enumerable: false,
            configurable: false,
            value: value
        });
    } catch(e) {
        obj[key] = value;
    }
};