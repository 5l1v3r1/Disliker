'use strict';

const IHumanEmulator = require('../interfaces/IHumanEmulator');

class HumanEmulator extends IHumanEmulator {

    /**
     * @param {IBrowser} browser - Браузер
     */
    constructor(browser) {
        super();

        this._browser = browser;
    }
}

module.exports = HumanEmulator;
