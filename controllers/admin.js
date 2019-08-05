const { buildSanitizeFunction } = require('express-validator');
const sanitize = buildSanitizeFunction(['body']);
const { DatabaseAPI } = require('../db/database');
const dbMeta = require('../db/dbSchema');
const DB_PATH = './db/database.db';
const DB = new DatabaseAPI(DB_PATH, dbMeta.dbSchema);

exports.get_admin = async (req, res, next) => {
    const userData = await DB.getUserData(null, req.user);
    if(userData.permission_level >= 3) {
        const allUserData = await DB.getAllUserData();
        res.render('admin', {
            mainStyle: 'css/main.css',
            style: 'css/admin.css',
            script: 'script/admin.js',
            userData: allUserData,
        });
    } else {
        res.redirect('/dashboard');
    }
};

exports.get_user = async (req, res, next) => {
    try {
        const permission_level = await DB.getUserPermissions(req.user);
        if(permission_level.permission_level >= 3) {
            const userData = await DB.getUserData(req.params.username);
            const blogs = await DB.getUserBlogPosts(userData.id);
            res.render('adminControl', {
                title: 'Admin UserControl',
                mainStyle: '/css/main.css',
                style: '/css/admin.css',
                script: '/script/admin.js',
                blogs: blogs,
                user_data: userData,
            });
        } else {
            res.redirect('/dashboard');
        }
    } catch(err) {
        res.redirect('/admin');
    }
};

exports.delete_blog_post = (req, res, next) => {
    DB.deleteBlogPost(req.params.id);
};

exports.modify_blog_post = async (req, res, next) => {
    await sanitize('*').escape().trim().run(req);

    DB.updateBlogPost(req.body);
};

exports.modify_user = async (req, res, next) => {
    await sanitize('*').escape().trim().run(req);
    DB.modifyUserData(req.body);
};

exports.delete_user = (req, res, next) => {
    DB.deleteUser(req.params);
};