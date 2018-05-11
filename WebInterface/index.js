'use strict';

const hbs = require('hbs');
const hbsutils = require('hbs-utils')(hbs);
const path = require('path');
const express = require('express');
const passport = require('passport');

const app = express();
require('./controllers')(app);
require('./passport')(app, passport);

const viewsDir = path.join(__dirname, 'views');
const staticDir = path.join(__dirname, 'static');
const partialsDir = path.join(viewsDir, 'partials');

app.set('view engine', 'hbs');
app.set('views', viewsDir);

app.use(express.static(staticDir));

hbsutils.registerWatchedPartials(partialsDir, () => {
    app.listen(8080);
});

/* hbs.registerPartials(partialsDir, () => {
    app.listen(8080);
});*/
