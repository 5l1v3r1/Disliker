'use strict';

const IBrowser = require('../interfaces/IBrowser');
const PuppeterPage = require('./PuppeteerPage');

class PuppeteerBrowser extends IBrowser {
    constructor(browser) {
        super();

        this._browser = browser;
    }

    async navigate(url) {
        const page = await this.newPage();
        await page.navigate(url);

        return page;
    }

    async newPage() {
        const puppeterPage = await this._browser.newPage();
        await puppeterPage.setExtraHTTPHeaders({
            'accept-language': 'en-US,en;q=0.8'
        });
        await puppeterPage.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.139 Safari/537.36');

        return new PuppeterPage(puppeterPage);
    }

    async close() {
        return this._browser.close();
    }
}

module.exports = PuppeteerBrowser;
