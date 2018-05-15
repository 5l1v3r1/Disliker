'use strict';

const mongoose = require('mongoose');

const ProxySchema = new mongoose.Schema({
    ip: {
        type: String,
        index: true,
        required: true
    },
    port: {
        type: String,
        index: true,
        required: true
    },
    country: String,
    region: String,
    city: {
        type: String,
        index: true
    },
    working: Boolean,
    http: Boolean
});

module.exports = mongoose.model('Proxy', ProxySchema);
