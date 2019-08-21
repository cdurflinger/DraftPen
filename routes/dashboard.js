const express = require('express');
const router = express.Router();
const passport = require('passport');
const dashboardController = require('../controllers/dashboard');

const authenticationMiddleware = () => {
    return (req, res, next) => {
        // console.log(`req.session.passport.user: ${JSON.stringify(req.session.passport)}`);
        if (req.isAuthenticated()) return next();
        res.redirect('/user/login');
    };
};

//get routes

router.get('/', authenticationMiddleware(), dashboardController.get_dashboard);

//post routes

router.post('/publish', dashboardController.publish_post);

//put routes

router.put('/blog/:id', dashboardController.modify_blog_post);

//delete routes

router.delete('/blog/:id', dashboardController.delete_blog_post);

//passport

passport.serializeUser(function(user, done) {
    done(null, user);
});
  
passport.deserializeUser(function(user, done) {
    done(null, user);
});

module.exports = router;