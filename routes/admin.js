const express = require('express');
const router = express.Router();
const passport = require('passport');
const adminController = require('../controllers/admin');

const authenticationMiddleware = () => {
    return (req, res, next) => {
        // console.log(`req.session.passport.user: ${JSON.stringify(req.session.passport)}`);
        if (req.isAuthenticated()) return next();
        res.redirect('/login');
    };
};

//get routes

router.get('/', authenticationMiddleware(), adminController.get_admin);

router.get('/:id', authenticationMiddleware(), adminController.get_user);

//post routes
router.put('/user/:id', adminController.modify_user);

//delete routes

router.delete('/user/:id', adminController.delete_user);

//passport

passport.serializeUser(function(user, done) {
    done(null, user);
});
  
passport.deserializeUser(function(user, done) {
    done(null, user);
});

module.exports = router;