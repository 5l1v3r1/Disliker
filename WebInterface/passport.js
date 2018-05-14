'use strict';

const config = require('config');
const GoogleStrategy = require('passport-google-oauth20');
const User = require('../models/User');

module.exports = (app, passport) => {
    app.use(passport.initialize());
    app.use(passport.session());

    passport.serializeUser((user, done) => {
        done(null, user.googleId);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findOne({ googleId: id });

            done(null, user);
        } catch (error) {
            done(error);
        }
    });

    passport.use(new GoogleStrategy({
        clientID: config.get('googleClientId'),
        clientSecret: config.get('googleClientSecret'),
        callbackURL: 'http://disliker.asuscomm.com:8080/return'
    }, async (accessToken, refreshToken, profile, callback) => {
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
            user = new User({
                googleId: profile.id,
                avatar: profile._json.image.url,
                name: profile._json.nickname
            });

            await user.save();
        }

        callback(null, user);
    }));
};
