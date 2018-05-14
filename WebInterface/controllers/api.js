'use strict';

const { Requester } = require('cote');
const requester = new Requester({ name: 'HES' });
const Task = require('../../models/Task');
const TaskStatus = require('../../enums/taskStatus');

module.exports = app => {
    app.post('/api/donate', async (req, res) => {
        const { login, password } = req.body;

        if (!login || !password) {
            return res.end();
        }

        requester.send({
            type: 'donate',
            userId: req.user._id,
            login,
            password
        }, (result) => {
            res.send(result);
            res.end();
        });
    });
    app.get('/api/task/all?from=:from&count=:count', async (req, res) => {
        if (req.user.googleId === '100771166143659542776') {
            const from = req.query.from || 0;
            const count = req.query.count || 5;

            const tasksCount = await Task.find()
                .count()
                .exec();

            const tasks = await Task.find({
                user: {
                    $not: req.user._id
                },
                status: {
                    $not: TaskStatus.COMPLETE
                }
            })
                .populate('user')
                .sort({ createdAt: -1 })
                .skip(from)
                .limit(count);

            res.send({
                tasks,
                count: tasksCount
            });
        }
    });
    app.get('/api/task', async (req, res) => {
        const tasks = await Task.find({ user: req.user._id }).sort({ createdAt: -1 });

        res.send(tasks);
        res.end();
    });
    app.post('/api/task', async (req, res) => {
        const { data, action } = req.body;

        if (data === undefined || action === undefined) {
            return res.end();
        }

        requester.send({
            type: 'action',
            userId: req.user._id,
            data,
            action
        }, (result) => {
            res.send(result);
            res.end();
        });
    });
};
