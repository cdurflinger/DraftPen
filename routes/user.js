const express = require('express');
const router = express.Router();
const passport = require('passport');
const { check } = require('express-validator');
const userController = require('../controllers/user');

//login and logout requests
router.get('/login', userController.get_user_login);

router.get('/logout', userController.get_user_logout);

router.get('/register', userController.get_user_register);

//post requests
router.post('/register', [
    check('username').not().isEmpty().withMessage('Please enter a username'),
    check('password').isLength({ min: 5}).withMessage('Password must be at least 5 characters long').custom((value, {req}) => {
        if(value !== req.body.confirmpassword) {
            throw new Error('Passwords do not match');
        } else {
            return value;
        }
    }).not().isEmpty(),
    check('email').isEmail().withMessage('You must enter a valid email address'),
    check('firstname').not().isEmpty().withMessage('You must enter your first name'),
    check('lastname').not().isEmpty().withMessage('You must enter your last name')
    ], userController.register_new_user);

router.post('/login', userController.login_user);

//passport

passport.serializeUser(function(user, done) {
    done(null, user);
});
  
passport.deserializeUser(function(user, done) {
    done(null, user);
});

module.exports = router;