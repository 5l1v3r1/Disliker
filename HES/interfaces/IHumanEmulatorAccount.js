/* eslint-disable no-empty-function */
/* eslint-disable no-unused-vars */
/* eslint-disable valid-jsdoc */
'use strict';

class IHumanEmulatorAccount {

    /**
     * @param data - Данные для проставления лайка
     * @return {Promise<boolean>}
     */
    async like(data) {}

    /**
     * @param data - Данные для проставления дизлайка
     * @return {Promise<boolean>}
     */
    async dislike(data) {}

    /**
     * Выход из аккаунта
     * @return {Promise<void>}
     */
    async exit() {}
}

module.exports = IHumanEmulatorAccount;
