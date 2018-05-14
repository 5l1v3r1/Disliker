'use strict';

const IHumanEmulatorAccount = require('../interfaces/IHumanEmulatorAccount');

class HumanEmulatorAccount extends IHumanEmulatorAccount {
    constructor(page) {
        super();

        this._page = page;
    }
}

module.exports = HumanEmulatorAccount;
