'use strict';

const HumanEmulatorAccount = require('../classes/HumanEmulatorAccount');
const { delay } = require('../../utils');

class YoutubeHumanEmulatorAccount extends HumanEmulatorAccount {
    constructor(page, loginData) {
        super(page);

        this._loginData = loginData;

        this._logOutUrl = 'https://accounts.google.com/Logout';
        this._channelUrl = 'https://www.youtube.com/channel/';
        this._watchVideoUrl = 'https://www.youtube.com/watch?v=';
        this._phoneCheckUrl = 'https://myaccount.google.com/u/1/security?utm_source=OGB';
    }

    async subscribe(data) {
        await this._page.navigate(this._channelUrl + data.channelId);
        await delay(3 * 1000);

        if (await this._needSignIn()) {
            await delay(3 * 1000);
        }

        const attributes = await this._page.getElementAttributes(
            '#subscribe-button > ytd-subscribe-button-renderer > paper-button'
        );

        if (attributes.subscribed === undefined) {
            await this._page.click('#subscribe-button');
            await delay(2 * 1000);

            return true;
        }

        return false;
    }

    /* eslint-disable-next-line */
    async changePassword(newPassword) {
        await this._page.navigate(this._phoneCheckUrl);
        await delay(2 * 1000);

        /* eslint-disable-next-line max-len */
        await this._page.click('#yDmH0d > div.FaV4Jb.xAuNcb > c-wiz > div > div > div.hdPVYc.mFnbqb > div:nth-child(2) > c-wiz > c-wiz:nth-child(4) > div > div.qeiSec > div:nth-child(2) > div:nth-child(2) > a > div > div.JsdkBf > div.Phkdhd');
        await delay(3 * 1000);

        const passwordInput = await this._page.getElement('input[name=password]');
        if (passwordInput) {
            await passwordInput.focus();
            await delay(1000);
            passwordInput.type(this._loginData.password);
            await delay(1000);
            await this._page.click('#passwordNext');
            await delay(3 * 1000);
        }

        await this._page.type('input[name=password]', newPassword);
        await this._page.type('input[name=confirmation_password]', newPassword);
        await delay(1000);
        /* eslint-disable-next-line max-len */
        await this._page.click('#yDmH0d > div.FaV4Jb.xAuNcb > c-wiz > div:nth-child(3) > c-wiz > div > div.hyMrOd > div.qNeFe.RH9rqf > div');
        await delay(3 * 1000);
    }

    async hasPhone() {
        await this._page.navigate(this._phoneCheckUrl);
        await delay(2 * 1000);

        try {
            /* eslint-disable-next-line max-len */
            const content = await this._page.getElementCotent('#yDmH0d > div.FaV4Jb.xAuNcb > c-wiz > div > div > div.hdPVYc.mFnbqb > div:nth-child(2) > c-wiz > c-wiz:nth-child(4) > div > div.qeiSec > div:nth-child(3) > div:nth-child(3) > a > div > div.JsdkBf > div.dLswc > div.oJFOKe .xm9RIe');

            return content;
        } catch (error) {
            return undefined;
        }
    }

    async like({ videoId }) {
        return this._clickLikeOrDislike(
            videoId,
            /* eslint-disable-next-line max-len */
            '#menu > ytd-menu-renderer > #top-level-buttons > ytd-toggle-button-renderer:first-child:not(.style-default-active)'
        );
    }

    async dislike({ videoId }) {
        return this._clickLikeOrDislike(
            videoId,
            /* eslint-disable-next-line max-len */
            '#menu > ytd-menu-renderer > #top-level-buttons > ytd-toggle-button-renderer:nth-child(2):not(.style-default-active)'
        );
    }

    async exit() {
        await this._page.navigate(this._logOutUrl);

        return this._page.close();
    }

    async _clickLikeOrDislike(videoId, selector) {
        await this._page.navigate(`${this._watchVideoUrl}${videoId}`);
        await delay(3 * 1000);

        if (await this._needSignIn()) {
            await delay(3 * 1000);
        }

        try {
            const button = await this._page.getElement(selector);
            button.click();
            await delay(1000);

            return true;
        } catch (error) {
            console.error(error);

            return false;
        }
    }

    async _needSignIn() {
        try {
            const signIn = await this._page.getElement(
                /* eslint-disable-next-line */
                '#masthead .yt-simple-endpoint.style-scope.ytd-button-renderer > paper-button > #text'
            );

            signIn.click();

            return true;
        } catch (error) {
            return false;
        }
    }
}

module.exports = YoutubeHumanEmulatorAccount;
