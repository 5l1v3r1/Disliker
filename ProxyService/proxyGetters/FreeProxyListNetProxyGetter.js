'use strict';

const request = require('requestify');
const geoip = require('geoip-lite');
const { JSDOM } = require('jsdom');
const IProxyGetter = require('../interfaces/IProxyGetter');

class FreeProxyListNetProxyGetter extends IProxyGetter {
    get serviceName() {
        return 'FreeProxyList.Net';
    }

    constructor() {
        super();

        this._address = 'https://free-proxy-list.net/anonymous-proxy.html';
    }

    async getProxyList() {
        const resp = await request.get(this._address);
        resp.getBody();

        const dom = new JSDOM(resp.body);
        const rows = dom.window.document.querySelectorAll('#proxylisttable > tbody > tr');
        const result = [];

        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            const ip = row.childNodes[0].innerHTML;
            const port = row.childNodes[1].innerHTML;
            const getInfo = geoip.lookup(ip);

            if (getInfo) {
                result.push({
                    ip,
                    port,
                    country: getInfo.country,
                    region: getInfo.region,
                    city: getInfo.city
                });
            }
        }

        return result;
    }
}

module.exports = FreeProxyListNetProxyGetter;
