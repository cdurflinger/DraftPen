const { buildSanitizeFunction, validationResult } = require('express-validator');
const sanitize = buildSanitizeFunction(['body']);
const { DatabaseAPI } = require('../db/database');

exports.get_user_register = (req, res, next) => {
    res.render('register', {
       title: 'Register',
    });
};

exports.register_new_user = async (req, res, next) => {
    await sanitize('*').escape().trim().run(req);
    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        res.render('register', {
            errors: errors.array(),
            });
    } else {
        DatabaseAPI.registerUser(`${req.body.username}`, `${req.body.password}`, `${req.body.email}`, `${req.body.firstname}`, 
        `${req.body.lastname}`);

        res.render('login', {
            title: 'Registration Complete! Please login below.',
        });
    }
};

exports.get_user_login = (req, res, next) => {
    res.render('login', {
        title: 'Login',
    });
};

exports.login_user = async (req, res, next) => {
    await sanitize('*').escape().trim().run(req);
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        res.render('login', {
                    errors: errors.array(),
                    });
    } else {
        const verified = await DatabaseAPI.verifyUsername(`${req.body.username}`);
        if(verified) {
            const verifyPassword = await DatabaseAPI.verifyUserPassword(`${req.body.username}`, `${req.body.password}`);
            if(verifyPassword) {
                const userData = await DatabaseAPI.getUserData(req.body.username);
                req.login(userData.id, (err) => {
                    if(err) {
                        return next(err);
                    }
                    return res.redirect('/');
                });
            } else {
                res.render('login', {
                title: 'Incorrect username or password! Try again.',
                });
            }
        }
        else {
            res.render('login', {
                title: 'Incorrect username or password! Try again.',
            });
        }
    }
};

exports.get_user_logout = (req, res, next) => {
    req.logout();
    res.redirect('/');
};
