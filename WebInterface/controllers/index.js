'use strict';

const main = require('./main');
const auth = require('./auth');
const api = require('./api');

module.exports = app => {
    main(app);
    auth(app);
    api(app);
};
