'use strict';

const Async = require('async');

module.exports.retry = function retry(fn, times = 5, interval = 3 * 1000) {
    return new Promise((resolve, reject) => {
        Async.retry({
            times,
            interval
        }, (callback) => {
            fn()
                .then(result => callback(null, result))
                .catch(err => callback(err));
        }, (err, result) => {
            if (err) {
                return reject(err);
            }

            return resolve(result);
        });
    });
};

module.exports.delay = function delay(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
};
