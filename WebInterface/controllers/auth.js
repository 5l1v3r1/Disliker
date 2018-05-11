'use strict';

const passport = require('passport');

module.exports = app => {
    app.get(
        '/login',
        passport.authenticate('google', { scope: ['profile'] })
    );

    app.get(
        '/login/return',
        passport.authenticate('google'),
        (req, res) => {
            res.redirect('/');
        }
    );

    app.get(
        '/logout',
        (req, res) => {
            req.logout();
            res.redirect('/');
        }
    );
};
