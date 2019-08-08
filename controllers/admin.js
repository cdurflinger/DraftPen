const { buildSanitizeFunction } = require('express-validator');
const sanitize = buildSanitizeFunction(['body']);
const { DatabaseAPI } = require('../db/database');

exports.get_admin = async (req, res, next) => {
    const userData = await DatabaseAPI.getUserData(null, req.user);
    if(userData.permission_level >= 3) {
        const allUserData = await DatabaseAPI.getAllUserData();
        res.render('admin', {
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
        const permission_level = await DatabaseAPI.getUserPermissions(req.user);
        if(permission_level.permission_level >= 3) {
            const userData = await DatabaseAPI.getUserData(null, req.params.id);
            const blogs = await DatabaseAPI.getUserBlogPosts(userData.id);
            res.render('adminControl', {
                title: 'Admin UserControl',
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
    DatabaseAPI.deleteBlogPost(req.params.id);
};

exports.modify_blog_post = async (req, res, next) => {
    await sanitize('*').escape().trim().run(req);
    await DatabaseAPI.updateBlogPost(req.body);

    res.json(req.body);
};

exports.modify_user = async (req, res, next) => {
    await sanitize('*').escape().trim().run(req);
    DatabaseAPI.modifyUserData(req.body);
};

exports.delete_user = (req, res, next) => {
    DatabaseAPI.deleteUser(req.params);
};