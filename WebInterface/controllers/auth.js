'use strict';

const passport = require('passport');

module.exports = app => {
    app.get(
        '/login',
        passport.authenticate('github')
    );

    app.get(
        '/login/return',
        passport.authenticate('github'),
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
