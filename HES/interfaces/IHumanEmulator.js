/* eslint-disable no-empty-function */
/* eslint-disable no-unused-vars */
/* eslint-disable valid-jsdoc */
'use strict';

class IHumanEmulator {

    /**
     * @param {object} data - Данные для создания аккаунта
     * @returns {Promise<IHumanEmulatorAccount>}
     */
    async createAccount(data) {}

    /**
     * @param data - Данные для входа в аккаунт
     * @returns {Promise<IHumanEmulatorAccount>}
     */
    async loginAccount(data) {}
}

module.exports = IHumanEmulator;
