'use strict';

const { Schema, model } = require('mongoose');

const TaskSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
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
    data: Schema.Types.Mixed
});

module.exports = model('Task', TaskSchema);
