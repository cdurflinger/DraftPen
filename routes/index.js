const express = require('express');
const router = express.Router();
const passport = require('passport');
const indexController = require('../controllers/index');

//get Home Page
router.get('/', indexController.get_home);

router.get('/about', indexController.get_about);

router.get('/blog/:id/:title', indexController.get_blog);

//search post

router.post('/search', indexController.search_blogs);

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

module.exports = router;