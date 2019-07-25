const { DatabaseAPI } = require('../db/database');
const dbMeta = require('../db/dbSchema');
const DB_PATH = './db/database.db';
const DB = new DatabaseAPI(DB_PATH, dbMeta.dbSchema);

exports.get_admin = (req, res, next) => {
    DB.getUserData(null, req.user).then((user_data) => {
        DB.getUserPermissions(req.user).then((permission_level) => {
            if(permission_level.permission_level >= 3) {
                DB.getAllUserData().then((userData) => {
                    res.render('admin', {
                        mainStyle: 'css/main.css',
                        style: 'css/admin.css',
                        script: 'script/admin.js',
                        userData: userData,
                    });
                });
            } else {
                res.redirect('/dashboard');
            }
        })
    });
};

exports.get_user = (req, res, next) => {
    DB.getUserData(req.params.username).then((user_data) => {
        DB.getUserPermissions(req.user).then((permission_level) => {
            if(permission_level.permission_level >= 3) {
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
            } else {
                res.redirect('/dashboard');
            }
        })
    });
};

exports.delete_blog_post = (req, res, next) => {
    DB.deleteBlogPost(req.params.id);
};

exports.modify_blog_post = (req, res, next) => {
    DB.updateBlogPost(req.body);
};

exports.modify_user = (req, res, next) => {
    DB.modifyUserData(req.body);
};

exports.delete_user = (req, res, next) => {
    DB.deleteUser(req.params);
};