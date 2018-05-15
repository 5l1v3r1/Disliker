'use strict';

require('dotenv').config('../.env');
const config = require('config');
const mongoose = require('mongoose');
const FreeProxyListNetProxyGetter = require('./proxyGetters/FreeProxyListNetProxyGetter');
const ProxyChecker = require('./classes/ProxyChecker');
const Proxy = require('../models/Proxy');

const fplnProxyGetter = new FreeProxyListNetProxyGetter();
const proxyListServices = [fplnProxyGetter];

(async () => {
    await mongoose.connect(config.get('mongodbUrl'));
    await loop();

    setInterval(loop, process.env.CHECK_PROXY_INTERVAL || 3600 * 1000);
})();

async function loop() {
    await checkProxyFromDb();
    await getNewProxy();
}

async function getNewProxy() {
    const newProxy = [];

    for (let proxyService of proxyListServices) {
        try {
            (await proxyService.getProxyList()).concat(newProxy);
        } catch (error) {
            console.error(`Can't get proxy list from ${proxyService.serviceName}`, error);
        }
    }

    for (let proxy of newProxy) {
        const result = await ProxyChecker.check(proxy.ip, proxy.port);

        if (result.work) {
            console.info(`Add proxy ${proxy.ip}:${proxy.port}`);
            await Proxy.create(Object.assign(proxy, result)).exec();
        }
    }
}

async function checkProxyFromDb() {
    const dbProxy = await Proxy.find();

    for (let proxy of dbProxy) {
        const result = await ProxyChecker.check(proxy.ip, proxy.port);

        if (!result.work) {
            console.info(`Proxy ${proxy.ip}:${proxy.port} not work!`);
            await proxy.remove();
        }
    }
}
