'use strict';

require('dotenv').config('../.env');
const config = require('config');
const mongoose = require('mongoose');
const Account = require('../models/Account');
const Task = require('../models/Task');
const puppeteer = require('puppeteer');
const { queue } = require('async');
const { Responder } = require('cote');
const { YHE, PuppeteerBrowser } = require('../HumanEmulator');
const TaskType = require('../enums/actions');
const TaskStatus = require('../enums/taskStatus');
const ServiceType = require('../enums/services');

const service = new Responder({ name: 'HES' });

(async () => {
    await mongoose.connect(config.get('mongodbUrl'));

    const browser = await puppeteer.launch({
        executablePath: 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
        headless: true
    });

    const puppeterBrowser = new PuppeteerBrowser(browser);
    const yhe = new YHE(puppeterBrowser);

    const taskQueue = queue(queueTask.bind(null, yhe));

    service.on('donate', async (req, cb) => {
        const task = new Task({
            user: req.userId,
            service: ServiceType.YOUTUBE,
            type: TaskType.DONATE_ACCOUNT,
            status: TaskStatus.INIT,
            data: {
                login: req.login.replace('@gmail.com', ''),
                password: req.password
            }
        });
        await task.save();
        taskQueue.push(task);
        await switchTaskStatus(task, TaskStatus.PENDING);
        cb(task);
    });

    service.on('action', async (req, cb) => {
        const task = new Task({
            user: req.userId,
            service: ServiceType.YOUTUBE,
            type: req.action,
            status: TaskStatus.INIT,
            data: req.data
        });
        await task.save();
        taskQueue.push(task);
        await switchTaskStatus(task, TaskStatus.PENDING);
        cb(task);
    });
})();

async function donate(yhe, task) {
    const existAccount = await Account.findOne({
        service: ServiceType.YOUTUBE,
        login: task.data.login
    });

    if (existAccount) {
        task.result = {
            error: 'Dublicate'
        };
        await switchTaskStatus(task, TaskStatus.ERROR);

        return;
    }

    const account = await getAccount(yhe, task.data);

    if (!account) {
        task.result = {
            error: 'Cant get account!'
        };
        await switchTaskStatus(task, TaskStatus.ERROR);

        return;
    }

    try {
        await switchTaskStatus(task, TaskStatus.IN_PROCESS);

        if (await account.hasPhone()) {
            throw new Error(`Account ${task.data.login} has phone!`);
        }
        await account.changePassword('acbde823');

        const dbAccount = new Account({
            login: task.data.login,
            service: ServiceType.YOUTUBE,
            donater: task.user,
            data: {
                login: task.data.login,
                password: 'acbde823'
            }
        });
        await dbAccount.save();
        await switchTaskStatus(task, TaskStatus.COMPLETE);
    } catch (error) {
        console.error(task._id, error);

        task.result = {
            error: error.message
        };
        await switchTaskStatus(task, TaskStatus.ERROR);
    } finally {
        await account.exit();
    }
}

async function subscribe(yhe, task) {
    const accounts = await Account.find({ service: ServiceType.YOUTUBE });
    task.result = {
        success: 0,
        fail: 0,
        from: accounts.length
    };
    await switchTaskStatus(task, TaskStatus.IN_PROCESS);

    for (const account of accounts) {
        const yhea = await getAccount(yhe, account.data);

        if (!yhea) {
            console.info(`Account ${account.login} for youtube continue!`);
            await Task.update(
                { _id: task._id },
                { $inc: { 'result.fail': 1 } }).exec();
            continue;
        }

        try {
            await yhea.subscribe(task.data);
            await Task.update(
                { _id: task._id },
                { $inc: { 'result.success': 1 } }).exec();
        } catch (error) {
            console.error(`LikeOrDir error ${account.login}`, error);
            await Task.update(
                { _id: task._id },
                { $inc: { 'result.fail': 1 } }).exec();
        } finally {
            await yhea.exit();
        }
    }

    await switchTaskStatus(task, TaskStatus.COMPLETE);
}

async function likeOrDis(yhe, task) {
    const accounts = await Account.find({ service: ServiceType.YOUTUBE });
    task.result = {
        success: 0,
        fail: 0,
        from: accounts.length
    };
    await switchTaskStatus(task, TaskStatus.IN_PROCESS);

    for (const account of accounts) {
        const yhea = await getAccount(yhe, account.data);

        if (!yhea) {
            console.info(`Account ${account.login} for youtube continue!`);
            await Task.update(
                { _id: task._id },
                { $inc: { 'result.fail': 1 } }).exec();
            continue;
        }

        try {
            const action = task.type === TaskType.DISLIKE ? yhea.dislike : yhea.like;
            await action.call(yhea, task.data);
            await Task.update(
                { _id: task._id },
                { $inc: { 'result.success': 1 } }).exec();
        } catch (error) {
            console.error(`LikeOrDir error ${account.login}`, error);
            await Task.update(
                { _id: task._id },
                { $inc: { 'result.fail': 1 } }).exec();
        } finally {
            await yhea.exit();
        }
    }

    await switchTaskStatus(task, TaskStatus.COMPLETE);
}

async function getAccount(yhe, data) {
    try {
        const account = await yhe.loginAccount(data);

        return account;
    } catch (error) {
        console.error('getAccount:', error);
    }
}

/**
 * @param {HumanEmulator} yhe
 * @param {Task} task
 * @param {{ Function }} cb
 */
async function queueTask(yhe, task, cb) {
    try {
        /* eslint-disable-next-line default-case */
        switch (task.type) {
            case TaskType.DONATE_ACCOUNT:
                await donate(yhe, task);
                break;
            case TaskType.LIKE:
                await likeOrDis(yhe, task);
                break;
            case TaskType.DISLIKE:
                await likeOrDis(yhe, task);
                break;
            case TaskType.SUBSCRIBE:
                await subscribe(yhe, task);
                break;
        }
    } catch (error) {
        console.error(error);
    } finally {
        cb();
    }
}

async function switchTaskStatus(task, status) {
    task.status = status;

    return task.save();
}


