'use strict';

const request = require('request-promise');

class ProxyChecker {
    static async check(ip, port) {
        const http = await check(ip, port, 'http://www.google.com/');
        const https = await check(ip, port, 'https://www.google.com/');

        return {
            work: http || https,
            https
        };
    }
}

module.exports = ProxyChecker;

async function check(ip, port, address) {
    try {
        await request({
            uri: address,
            proxy: `http://${ip}:${port}`
        });

        return true;
    } catch (error) {

        return false;
    }
}