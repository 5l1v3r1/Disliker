'use strict';

const request = require('requestify');
const geoip = require('geoip-lite');
const { JSDOM } = require('jsdom');
const IProxyGetter = require('../interfaces/IProxyGetter');

class FreeProxyListNetProxyGetter extends IProxyGetter {
    constructor() {
        super();

        this._address = 'https://free-proxy-list.net/anonymous-proxy.html';
    }

    async getProxyList() {
        const resp = await request.get(this._address);
        resp.getBody();

        const dom = new JSDOM(resp.body);
        const rows = dom.window.document.querySelectorAll('#proxylisttable > tbody > tr');

        return Array.prototype.slice.call(rows).map(row => {
            const ip = row.childNodes[0].innerHTML;
            const port = row.childNodes[1].innerHTML;
            const getInfo = geoip.lookup(ip);

            return {
                ip,
                port,
                country: getInfo.country,
                region: getInfo.region,
                city: getInfo.city
            };
        });
    }
}

module.exports = FreeProxyListNetProxyGetter;
