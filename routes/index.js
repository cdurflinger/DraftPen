const express = require('express');
const router = express.Router();
const { DatabaseAPI} = require('../db/database');
const dbMeta = require('../db/dbSchema');
const DB_PATH = './db/database.db';
const DB = new DatabaseAPI(DB_PATH, dbMeta.dbSchema);
const passport = require('passport');

//verifies if the user has an active session/permits page view
const authenticationMiddleware = () => {
    return (req, res, next) => {
        // console.log(`req.session.passport.user: ${JSON.stringify(req.session.passport)}`);
        if (req.isAuthenticated()) return next();
        res.redirect('/login');
    }
}


//get Login Page
router.get('/', (req, res, next) => {
    // console.log(req.user);
    // console.log(req.isAuthenticated());
    DB.getAllBlogPosts().then((blogs) => {
        res.render('home', {
            title: 'Home',
            style: 'home.css',
            blogs: blogs,
        });
    });
});

router.get('/register', (req, res, next) => {
    res.render('register', {
       title: 'Register',
    //    style: 'main.css', 
    });
});

router.get('/login', (req, res, next) => {
    res.render('login', {
        title: 'Login',
        // style: 'main.css',
    });
});

router.get('/dashboard', authenticationMiddleware(), (req, res, next) => {
    DB.getUserData(null, req.user).then((user_data) => {
        DB.getUserBlogPosts(req.user).then((blogs) => {
            res.render('dashboard', {
                title: `${user_data.firstName}'s Dashboard`,
                style: 'dashboard.css',
                blogs: blogs,
            });
        });
    });
});


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
                    return res.redirect('/');
                });
            });    
        } else {
            res.render('login', {
            title: 'Incorrect username or password! Try again.',
            style: 'main.css', 
            });
        }
    });
});

router.post('/blogPost', (req, res, next) => {
    DB.getUserData(null, req.user).then((user_data) => {
        DB.createBlogPost(user_data, req.body).then(() => {
            res.render('dashboard', {
                title: 'Blog Posted!',
                style: 'main.css',
            });
        });
    });
});

router.post('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});


module.exports = router;