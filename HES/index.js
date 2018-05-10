'use strict';
const puppeteer = require('puppeteer');

const YoutubeHumanEmulator = require('./YoutubeHumanEmulator');
const PuppeteerBrowser = require('./PuppeteerBrowser');

(async () => {
    const browser = await puppeteer.launch({
        executablePath: 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
        headless: false
    });

    const puppeteerBrowser = new PuppeteerBrowser(browser);
    const yhe = new YoutubeHumanEmulator(puppeteerBrowser);
    const account = await yhe.loginAccount({
        login: 'blue.gnom.gom@gmail.com',
        password: 'acbde823'
    });

    await account.dislike({ videoId: 'EW1J7_FEgto' });
})();
