'use strict';

const IBrowserPage = require('../interfaces/IBrowserPage');

class PuppeteerPage extends IBrowserPage {
    get url() {
        return this._page.url();
    }

    constructor(page) {
        super();

        this._page = page;
    }

    async close() {
        await this._page._client.send('Network.clearBrowserCookies');

        return this._page.close();
    }

    async navigate(url) {
        return this._page.goto(url);
    }

    async focus(selector) {
        await this.getElement(selector);

        return this._page.focus(selector);
    }

    async type(selector, text) {
        await this.getElement(selector);

        return this._page.type(selector, text);
    }

    async click(selector) {
        await this.getElement(selector);

        return this._page.click(selector);
    }

    async getElementAttributes(selector) {
        return this._page.evaluate(s => {
            /* eslint-disable-next-line */
            const element = document.querySelector(s);
            const attributes = {};

            for (let i = 0; i < element.attributes.length; i++) {
                attributes[element.attributes[i].name] =
                    element.attributes[i].value;
            }

            return attributes;
        }, selector);
    }

    async getElementCotent(selector) {
        /* eslint-disable-next-line */
        return this._page.evaluate(s => document.querySelector(s).innerHTML, selector);
    }

    async getElement(selector, timeout = 10 * 1000) {
        return this._page.waitForSelector(selector, { timeout });
    }
}

module.exports = PuppeteerPage;
