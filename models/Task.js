'use strict';

const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        index: true
    },
    service: {
        type: Number,
        required: true
    },
    type: {
        type: Number,
        required: true
    },
    status: {
        type: Number,
        required: true
    },
    data: mongoose.Schema.Types.Mixed
});

module.exports = mongoose.model('Task', TaskSchema);
