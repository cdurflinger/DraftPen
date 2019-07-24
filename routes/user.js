const express = require('express');
const router = express.Router();
const passport = require('passport');
const userController = require('../controllers/user');

const authenticationMiddleware = () => {
    return (req, res, next) => {
        // console.log(`req.session.passport.user: ${JSON.stringify(req.session.passport)}`);
        if (req.isAuthenticated()) return next();
        res.redirect('/login');
    };
};

router.get('/', authenticationMiddleware(), userController.get_dashboard);

router.get('/:username', authenticationMiddleware(), userController.get_user_dashboard);

router.post('/blogPost', userController.create_blog_post);

router.delete('/blog/delete/:id', userController.delete_blog_post);

router.post('/blog/modify/:id', userController.modify_blog_post);

router.post('/user/modify/:id', userController.modify_user);

router.delete('/user/delete/:id', userController.delete_user);

passport.serializeUser(function(user, done) {
    done(null, user);
});
  
passport.deserializeUser(function(user, done) {
    done(null, user);
});

module.exports = router;