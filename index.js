const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const port = process.env.PORT || 5000;
const hbs = require('express-handlebars');
const index = require('./routes/index');
const dashboard = require('./routes/dashboard');
const user = require('./routes/user');
const admin = require('./routes/admin');

//Authentication
const session = require('express-session');
const passport = require('passport');
const SQLiteStore = require('connect-sqlite3')(session);

const app = express();

app.engine('hbs', hbs({extname: 'hbs', defaultLayout: 'layout', layoutsDir: __dirname + '/views/layouts/'}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded( { extended: false } ));
app.use(express.static(path.join(__dirname + '/public')));

app.use(session({
    store: new SQLiteStore,
    //used to sign the session ID cookie
    secret: 's^%*&afj2KKS2j$^l342hDFLUl1nsaf!@',
    //true saves the session, even if never modified. false saves only if modified
    resave: true,
    //true saves a session that is uninitialized (session is new but not modified) *ie user visits page
    saveUninitialized: false,
    //set to true if hosted HTTPS, false otherwise
    cookie: { secure: false }
  }));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', index);
app.use('/dashboard', dashboard);
app.use('/user', user);
app.use('/admin', admin);

app.listen(port, () => {
    console.log(`Listening to port ${port}!`);
});
