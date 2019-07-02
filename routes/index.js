const express = require('express');
const router = express.Router();
const { DatabaseAPI} = require('../db/database');
const dbMeta = require('../db/dbSchema');
const DB_PATH = './db/database.db';
const DB = new DatabaseAPI(DB_PATH, dbMeta.dbSchema);
const passport = require('passport');


//get Login Page
router.get('/', (req, res, next) => {
    console.log(req.user);
    console.log(req.isAuthenticated());
    res.render('home', {
        title: 'Home',
        style: 'main.css',
    });
});

router.get('/register', (req, res, next) => {
    res.render('register', {
       title: 'Register',
       style: 'main.css', 
    });
});

router.get('/login', (req, res, next) => {
    res.render('login', {
        title: 'Login',
        style: 'main.css',
    })
})



//post requests
router.post('/register', (req, res, next) => {
    DB.registerUser(`${req.body.username}`, `${req.body.password}`, `${req.body.email}`, `${req.body.firstname}`, 
        `${req.body.lastname}`);

    res.render('login', {
       title: 'Registration Complete! Please login below.',
       style: 'main.css', 
    });
});

router.post('/login', (req, res, next) => {
    DB.verifyUserPassword(`${req.body.username}`, `${req.body.password}`).then((login) => {
        if(login) {
            DB.getUserData(req.body.username).then((user_data) => {
                req.login(user_data.id, (err) => {
                    if(err) {
                        return next(err);
                    }
                    return res.render('dashboard', {
                        title: 'Dashboard',
                        style: 'style.css',
                        firstName: user_data.firstName,
                        lastName: user_data.lastName,
                    });
                });
            });    
        } else {
            res.render('login', {
            title: 'Incorrect username or password! Try again.',
            style: 'main.css', 
            });
        }
    })
});

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

module.exports = router;