'use strict';

const FreeProxyListNetProxyGetter = require('./proxyGetters/FreeProxyListNetProxyGetter');
const ProxyChecker = require('./classes/ProxyChecker');

const pg = new FreeProxyListNetProxyGetter();

(async() => {
    try {
        const proxyList = await pg.getProxyList();

        for (let proxy of proxyList) {
            const result = await ProxyChecker.checkProxy(proxy.ip, proxy.port);

            console.log(`${proxy.ip}:${proxy.port} ${result.work}`);
        }
    } catch (error) {
        console.error(error);
    }
})();