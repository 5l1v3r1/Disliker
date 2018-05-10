'use strict';

require('hbs');
const path = require('path');
const express = require('express');

const app = express();

const viewsDir = path.join(__dirname, 'views');

app.set('view engine', 'hbs');
app.set('views', viewsDir);

app.listen(8080);
