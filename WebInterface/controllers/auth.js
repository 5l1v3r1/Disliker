'use strict';

const passport = require('passport');

module.exports = app => {
    app.get(
        '/login',
        passport.authenticate('google', { scope: [
            'profile',
            'https://www.googleapis.com/auth/calendar',
            'https://www.googleapis.com/auth/plus.login'
        ] })
    );

    app.get(
        '/return',
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
