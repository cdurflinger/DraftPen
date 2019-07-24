const { DatabaseAPI } = require('../db/database');
const dbMeta = require('../db/dbSchema');
const DB_PATH = './db/database.db';
const DB = new DatabaseAPI(DB_PATH, dbMeta.dbSchema);

exports.get_dashboard = (req, res, next) => {
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
};

exports.get_user_dashboard = (req, res, next) => {
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
};

exports.create_blog_post = (req, res, next) => {
    DB.getUserData(null, req.user).then((user_data) => {
        DB.createBlogPost(user_data, req.body).then(() => {
            res.redirect('/dashboard');
        });
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