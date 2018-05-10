const puppeteer = require('puppeteer');
const Async = require('async');
const { retry, delay } = require('./utils');

class Disliker {
    constructor(opts) {
        this._opts = opts;
    }

    async process(login, password, id, rate) {
        const browser = await puppeteer.launch({
            executablePath: 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
            headless: false
        });
        let result = false;

        try {
            const page = await browser.newPage();

            await auth(page, login, password);
            await delay(3 * 1000);
            await page.goto(`https://www.youtube.com/watch?v=${id}`);
            await delay(3 * 1000);

            await page.evaluate(() => {
                const link = document.querySelector('.yt-simple-endpoint.style-scope.ytd-button-renderer');

                if (link) {
                    link.click();
                }
            });

            await delay(3 * 1000);

            await retry(async function () {
                const enText = rate ? 'like' : 'dislike';
                const ruText = rate ? 'Видео пон' : 'Видео не';

                await page.evaluate((enText, ruText) => {
                    let button = document.querySelector(`button[aria-label^="${enText}"]`);

                    if (!button) {
                        button = document.querySelector(`button[aria-label^="${ruText}"]`)
                    }

                    if (!button) {
                        throw new Error('No button!');
                    }

                    if (button.parentNode.getAttribute('aria-pressed') === "false") {
                        button.click();
                    } else {
                        console.log('PRESSED')
                    }
                }, enText, ruText);
            });

            await delay(3 * 1000);
            result = true;
        } catch (error) {
            console.log(error);
        } finally {
            await browser.close();
        }

        return result;
    }

    async like(login, password, id) {
        console.log('like');
        return this.process(login, password, id, true);
    }

    async dislike(login, password, id) {
        console.log('dislike');
        return this.process(login, password, id, false);
    }
}

module.exports = Disliker;

async function auth(page, login, password) {
    await page.goto('https://accounts.google.com/signin/v2/identifier?hl=ru&flowName=GlifWebSignIn&flowEntry=ServiceLogin');

    await retry(async function () {
        await page.evaluate((a) => {
            document.querySelector('input[name=identifier]').value = a;
            document.querySelector('#identifierNext').click();
        }, login);
    });

    await delay(3 * 1000);

    await retry(async function () {
        await page.evaluate((a) => {
            document.querySelector('input[name=password]').value = a;
            document.querySelector('#passwordNext').click();
        }, password);
    });
}