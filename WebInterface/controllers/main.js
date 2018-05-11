'use strict';

module.exports = app => {
    app.get('/', (req, res) => {
        if (req.isAuthenticated()) {
            res.render('index', { user: req.user });
        } else {
            res.redirect('http://localhost:8080/login');
        }
    });
};
