'use strict';

const hbs = require('hbs');
const hbsutils = require('hbs-utils')(hbs);
const path = require('path');
const express = require('express');
const passport = require('passport');
const config = require('config');
const mongoose = require('mongoose');
const session = require('express-session');

const app = express();

const viewsDir = path.join(__dirname, 'views');
const staticDir = path.join(__dirname, 'static');
const partialsDir = path.join(viewsDir, 'partials');

app.set('view engine', 'hbs');
app.set('views', viewsDir);

app.use(express.static(staticDir));
app.use(session({
    secret: config.get('cookieSecret'),
    resave: true,
    saveUninitialized: true
}));

require('./passport')(app, passport);
require('./controllers')(app);

(async () => {
    await mongoose.connect(config.get('mongodbUrl'));
    await registerPartials(partialsDir, config.get('debug'));

    app.listen(8080);
})();

async function registerPartials(dir, debug) {
    const registerFn = debug
        ? hbsutils.registerWatchedPartials.bind(hbsutils)
        : hbs.registerPartials.bind(hbs);

    return new Promise(resolve => registerFn(dir, resolve));
}
