'use strict';

const FreeProxyListNetProxyGetter = require('./proxyGetters/FreeProxyListNetProxyGetter');

const pg = new FreeProxyListNetProxyGetter();

(async() => {
    try {
        console.log(await pg.getProxyList());
    } catch (error) {
        console.error(error);
    }
})();