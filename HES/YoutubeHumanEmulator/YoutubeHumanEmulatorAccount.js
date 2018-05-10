'use strict';

const HumanEmulatorAccount = require('../classes/HumanEmulatorAccount');
const { delay } = require('../../utils');

class YoutubeHumanEmulatorAccount extends HumanEmulatorAccount {
    constructor(page) {
        super(page);

        this._logOutUrl = 'https://accounts.google.com/Logout';
        this._watchVideoUrl = 'https://www.youtube.com/watch?v=';
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
            return false;
        }
    }

    async _needSignIn() {
        try {
            const signIn = await this._page.getElement(
                '.yt-simple-endpoint.style-scope.ytd-button-renderer'
            );

            signIn.click();

            return true;
        } catch (error) {
            return false;
        }
    }
}

module.exports = YoutubeHumanEmulatorAccount;
