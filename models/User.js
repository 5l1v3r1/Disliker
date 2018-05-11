'use strict';

const { Schema, model } = require('mongoose');

const UserSchema = new Schema({
    googleId: String,
    avatar: String,
    name: String
});

module.exports = model('User', UserSchema);
