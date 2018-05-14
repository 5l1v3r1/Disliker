'use strict';

const HumanEmulator = require('../classes/HumanEmulator');
const YoutubeHumanEmulatorAccount = require('./YoutubeHumanEmulatorAccount');
const { delay } = require('../../utils');

class YoutubeHumanEmulator extends HumanEmulator {
    constructor(browser) {
        super(browser);

        /* eslint-disable-next-line max-len */
        this._loginPageUrl = 'https://accounts.google.com/signin/v2/identifier?hl=en&flowName=GlifWebSignIn&flowEntry=ServiceLogin';
        /* eslint-disable-next-line max-len */
        this._failLoginPageUrl = 'https://accounts.google.com/ServiceLogin?hl=en&flowName=GlifWebSignIn&flowEntry=ServiceLogin';
    }

    /* eslint-disable-next-line */
    async loginAccount({ login, password }) {
        const page = await this._browser.navigate(this._loginPageUrl);

        await page.focus('input[name=identifier]');
        await delay(1000);
        await page.type('input[name=identifier]', login);
        await delay(1000);
        await page.click('#identifierNext');
        await delay(1000);
        await page.focus('input[name=password]');
        await delay(1000);
        await page.type('input[name=password]', password);
        await delay(1000);
        await page.click('#passwordNext');
        await delay(3 * 1000);

        if (page.url.startsWith(this._failLoginPageUrl)) {
            await page.close();
            throw new Error('Can\'t login!');
        }

        return new YoutubeHumanEmulatorAccount(page, { login, password });
    }

    /* eslint-disable-next-line */
    async createAccount(data) {
        throw new Error('Method not implemented!');
    }
}

module.exports = YoutubeHumanEmulator;
