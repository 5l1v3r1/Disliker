'use strict';

const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    googleId: {
        type: String,
        index: true,
        required: true,
        unique: true
    },
    avatar: String,
    name: String,
    tokens: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('User', UserSchema);
