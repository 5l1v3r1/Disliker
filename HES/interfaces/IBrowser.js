/* eslint-disable no-empty-function */
/* eslint-disable no-unused-vars */
/* eslint-disable valid-jsdoc */
'use strict';

class IBrowser {

    /**
     * @param {string} url
     * @return {Promise<IBrowserPage>}
     */
    async navigate(url) {}

    /**
     * @return {Promise<IBrowserPage>}
     */
    async newPage() {}

    /**
     * @return {Promise<void>}
     */
    async close() {}
}

module.exports = IBrowser;
