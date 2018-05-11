'use strict';

const { Schema, model } = require('mongoose');

const AccountSchema = new Schema({
    login: {
        type: String,
        index: true,
        required: true
    },
    service: {
        type: Number,
        required: true
    },
    data: Schema.Types.Mixed
});

module.exports = model('Account', AccountSchema);
