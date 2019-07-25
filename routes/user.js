const express = require('express');
const router = express.Router();
const passport = require('passport');
const userController = require('../controllers/user');

//login and logout requests
router.get('/login', userController.get_user_login);

router.get('/logout', userController.get_user_logout);

router.get('/register', userController.get_user_register);

//post requests
router.post('/register', userController.register_new_user);

router.post('/login', userController.login_user);

//passport

passport.serializeUser(function(user, done) {
    done(null, user);
});
  
passport.deserializeUser(function(user, done) {
    done(null, user);
});

module.exports = router;