const { buildSanitizeFunction, validationResult } = require('express-validator');
const sanitize = buildSanitizeFunction(['body']);
const { DatabaseAPI } = require('../db/database');
const dbMeta = require('../db/dbSchema');
const DB_PATH = './db/database.db';
const DB = new DatabaseAPI(DB_PATH, dbMeta.dbSchema);

exports.get_user_register = (req, res, next) => {
    res.render('register', {
       title: 'Register',
       mainStyle: '/css/main.css', 
    });
};

exports.register_new_user = async (req, res, next) => {
    await sanitize('*').escape().trim().run(req);
    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        res.render('register', {
            errors: errors.array(),
            mainStyle: '/css/main.css', 
            });
    } else {
        DB.registerUser(`${req.body.username}`, `${req.body.password}`, `${req.body.email}`, `${req.body.firstname}`, 
        `${req.body.lastname}`);

        res.render('login', {
            title: 'Registration Complete! Please login below.',
            mainStyle: '/css/main.css', 
        });
    }
};

exports.get_user_login = (req, res, next) => {
    res.render('login', {
        title: 'Login',
        mainStyle: '/css/main.css',
    });
};

exports.login_user = async (req, res, next) => {
    await sanitize('*').escape().trim().run(req);
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        res.render('login', {
                    errors: errors.array(),
                    mainStyle: '/css/main.css', 
                    });
    } else {
        const verified = await DB.verifyUsername(`${req.body.username}`);
        if(verified) {
            const verifyPassword = await DB.verifyUserPassword(`${req.body.username}`, `${req.body.password}`);
            if(verifyPassword) {
                const userData = await DB.getUserData(req.body.username);
                req.login(userData.id, (err) => {
                    if(err) {
                        return next(err);
                    }
                    return res.redirect('/');
                });
            } else {
                res.render('login', {
                title: 'Incorrect username or password! Try again.',
                mainStyle: '/css/main.css', 
                });
            }
        }
        else {
            res.render('login', {
                title: 'Incorrect username or password! Try again.',
                mainStyle: '/css/main.css',
            });
        }
    }
};

exports.get_user_logout = (req, res, next) => {
    req.logout();
    res.redirect('/');
};
