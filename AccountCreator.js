const puppeteer = require('puppeteer');
const { delay, retry } = require('./utils');
const randomstring = require('randomstring');

class AccountCreator {
    constructor(opts) {
        this._opts = opts;
    }

    async createAccount(firstName, lastName, password) {
        const browser = await puppeteer.launch({
            // executablePath: 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
            headless: false,
            args: [
                '--proxy-server=91.240.87.109:3130'
            ]
        });

        const userName = `${firstName}.${lastName}.${randomstring.generate(5)}`;

        try {
            const page = await browser.newPage();
            const userAgent = await browser.userAgent();
            await page.setUserAgent(userAgent.replace('Windows NT 10.0; Win64; x64', 'macOS 10.1.13'));
            await page.goto('https://accounts.google.com/signup/v2/webcreateaccount?flowName=GlifWebSignIn&flowEntry=SignUp');
            await delay(3 * 1000);

            await page.evaluate((firstName, lastName, userName, password) => {
                document.querySelector('input[name="firstName"]').value = firstName;
                document.querySelector('input[name="lastName"]').value = lastName;
                document.querySelector('input[name="Username"]').value = userName;
                document.querySelector('input[name="Passwd"]').value = password;
                document.querySelector('input[name="ConfirmPasswd"]').value = password;

                document.querySelector('#accountDetailsNext').click();
            }, firstName, lastName, userName, password);

            await delay(100 * 1000)
        } catch (error) {
            console.log(error);
        } finally {
            browser.close();
        }
    }
}

const ac = new AccountCreator();

(async() => {
    await ac.createAccount('Gnominator', 'Puginator', 'acbde823');
})();