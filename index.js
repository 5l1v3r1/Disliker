'use strict';

const fs = require('fs');
const puppeteer = require('puppeteer');

const YoutubeHumanEmulator = require('./HES/YoutubeHumanEmulator');
const PuppeteerBrowser = require('./HES/PuppeteerBrowser');

(async () => {
    const json = JSON.parse(fs.readFileSync('accounts.json', 'utf8'));
    const browser = await puppeteer.launch({
        executablePath: 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
        headless: false
    });

    const puppeteerBrowser = new PuppeteerBrowser(browser);
    const yhe = new YoutubeHumanEmulator(puppeteerBrowser);

    const videoId = process.argv[2];
    console.info(`${json.length} accounts`);

    for (let i = 0; i < json.length; i++) {
        const account = json[i];
        console.info(account.login);
        try {
            const yheAccount = await yhe.loginAccount(account);

            await yheAccount.dislike({ videoId });
            await yheAccount.exit();
        } catch (error) {
        	console.error(error);
        }
    }

    await puppeteerBrowser.close();
})();
