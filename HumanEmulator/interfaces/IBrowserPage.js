/* eslint-disable no-empty-function */
/* eslint-disable no-unused-vars */
/* eslint-disable valid-jsdoc */
'use strict';

class IBrowserPage {


    /**
     * @return {Promise<void>}
     */
    async close() {}

    /**
     * @param {string} url
     */
    async navigate(url) {}

    /**
     * @param {string} selector
     * @return {Promise<string[]>}
     */
    async getElementAttributes(selector) {}

    /**
     * @param {string} selector
     * @return {Promise<string>}
     */
    async getElementContent(selector) {}

    /**
     * @param {string} selector
     * @param {number} timeout?
     * @return {Promise<HTMLElement>}
     */
    async getElement(selector, timeout) {}

    /**
     * @param {string} selector
     * @return {Promise<void>}
     */
    async focus(selector) {}

    /**
     * @param {string} selector
     * @param {string} text
     * @return {Promise<void>}
     */
    async type(selector, text) {}

    /**
     * @param {string} selector
     * @return {Promise<void>}
     */
    async click(selector) {}
}

module.exports = IBrowserPage;
