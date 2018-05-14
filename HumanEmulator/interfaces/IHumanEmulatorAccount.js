/* eslint-disable no-empty-function */
/* eslint-disable no-unused-vars */
/* eslint-disable valid-jsdoc */
'use strict';

class IHumanEmulatorAccount {

    /**
     * @param data
     * @return {Promise<boolean>}
     */
    async subscribe(data) {}

    /**
     * @param {string} newPassword
     * @return {Promise<void>}
     */
    async changePassword(newPassword) {}

    /**
     * Проверяет привязан ли данный аккаунт к телефону, если да, то возвращает этот телефон.
     * @return {Promise<string>}
     */
    async hasPhone() {}

    /**
     * @param data
     * @return {Promise<boolean>}
     */
    async like(data) {}

    /**
     * @param data
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
