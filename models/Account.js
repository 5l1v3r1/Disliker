'use strict';

const mongoose = require('mongoose');

const AccountSchema = new mongoose.Schema({
    login: {
        type: String,
        index: true,
        required: true
    },
    service: {
        type: Number,
        required: true
    },
    donater: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    data: mongoose.Schema.Types.Mixed
});

module.exports = mongoose.model('Account', AccountSchema);
