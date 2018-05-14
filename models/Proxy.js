'use strict';

const mongoose = require('mongoose');

const ProxySchema = new mongoose.Schema({
    ip: String,
    port: String,
    country: String,
    region: String,
    city: {
        type: String,
        index: true
    }
});

module.exports = mongoose.model('Proxy', ProxySchema);
