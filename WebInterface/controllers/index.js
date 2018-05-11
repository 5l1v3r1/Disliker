'use strict';

const main = require('./main');
const auth = require('./auth');

module.exports = app => {
    main(app);
    auth(app);
};
