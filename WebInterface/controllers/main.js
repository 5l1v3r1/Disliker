'use strict';

const Task = require('../../models/Task');

module.exports = app => {
    app.get('/', async (req, res) => {
        if (req.isAuthenticated()) {
            const tasks = await Task.find({ user: req.user._id }).sort({ createdAt: -1 });

            res.render('index', {
                user: req.user,
                task: JSON.stringify(tasks)
            });
        } else {
            res.redirect('/login');
        }
    });
};
