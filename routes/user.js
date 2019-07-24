const express = require('express');
const router = express.Router();
const { DatabaseAPI} = require('../db/database');
const dbMeta = require('../db/dbSchema');
const DB_PATH = './db/database.db';
const DB = new DatabaseAPI(DB_PATH, dbMeta.dbSchema);
const passport = require('passport');

const authenticationMiddleware = () => {
    return (req, res, next) => {
        // console.log(`req.session.passport.user: ${JSON.stringify(req.session.passport)}`);
        if (req.isAuthenticated()) return next();
        res.redirect('/login');
    }
}

router.get('/', authenticationMiddleware(), (req, res, next) => {
    DB.getUserData(null, req.user).then((user_data) => {
        if (user_data.permissionLevel >= 5) {
            DB.getAllUserData().then((userData) => {
                res.render('admin', {
                    mainStyle: 'css/main.css',
                    style: 'css/admin.css',
                    script: 'script/admin.js',
                    userData: userData,
                });
            });
        } else {
            DB.getUserBlogPosts(req.user).then((blogs) => {
                res.render('dashboard', {
                    title: `${user_data.firstName}'s Dashboard`,
                    mainStyle: 'css/main.css',
                    style: 'css/dashboard.css',
                    script: 'script/dashboard.js',
                    blogs: blogs,
                    user: user_data,
                });
            });
        }
    });
});

router.get('/:username', authenticationMiddleware(), (req, res, next) => {
    DB.getUserData(req.params.username).then((user_data) => {
        DB.getUserBlogPosts(user_data.id).then((blogs) => {
            res.render('adminControl', {
                title: 'Admin User Control',
                mainStyle: '../css/main.css',
                style: '../css/admin.css',
                script: '../script/admin.js',
                blogs: blogs,
                user_data: user_data,
            });
        });
    });
});

router.post('/blogPost', (req, res, next) => {
    DB.getUserData(null, req.user).then((user_data) => {
        DB.createBlogPost(user_data, req.body).then(() => {
            res.redirect('/dashboard');
        });
    });
});

router.delete('/blog/delete/:id', (req, res, next) => {
    DB.deleteBlogPost(req.params.id);
});

router.post('/blog/modify/:id', (req, res, next) => {
    DB.updateBlogPost(req.body);
});

router.post('/user/modify/:id', (req, res, next) => {
    DB.modifyUserData(req.body);
});

router.delete('/user/delete/:id', (req, res, next) => {
    DB.deleteUser(req.params);
});

passport.serializeUser(function(user, done) {
    done(null, user);
  });
  
  passport.deserializeUser(function(user, done) {
      done(null, user);
  });

  module.exports = router;