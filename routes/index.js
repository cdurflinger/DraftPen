const express = require('express');
const router = express.Router();
const passport = require('passport');
const indexController = require('../controllers/index');

//get Home Page
router.get('/', indexController.get_home_page);

//login and logout requests
router.get('/login', indexController.get_user_login);

router.get('/logout', indexController.get_user_logout);

router.get('/register', indexController.get_user_register);

//post requests
router.post('/register', indexController.register_new_user);

router.post('/login', indexController.login_user);

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

module.exports = router;