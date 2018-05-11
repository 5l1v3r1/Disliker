'use strict';

const config = require('config');
const GoogleStrategy = require('passport-google-oauth20');

module.exports = (app, passport) => {

    passport.use(new GoogleStrategy({
        clientID: config.get('googleClientId'),
        clientSecret: config.get('googleClientSecret'),
        callbackURL: 'http://localhost:8080/login/return'
    }, (accessToken, refreshToken, profile, callback) => {
        console.log(profile);
    }));

    app.use(passport.initialize());
    app.use(passport.session());
};
