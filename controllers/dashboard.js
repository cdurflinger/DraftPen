const { buildSanitizeFunction } = require('express-validator');
const sanitize = buildSanitizeFunction(['body']);
const { DatabaseAPI } = require('../db/database');
const dbMeta = require('../db/dbSchema');
// const DB_PATH = './db/database.db';
const DB = new DatabaseAPI(dbMeta.dbSchema);

exports.get_dashboard = async (req, res, next) => {
    const userData = await DB.getUserData(null, req.user);
    let page = await userData.permission_level >= 3 ? 'adminDashboard' : 'dashboard';
    const blogs = await DB.getUserBlogPosts(req.user);

    res.render(page, {
        title: `${userData.firstName}'s Dashboard`,
        style: 'css/dashboard.css',
        script: 'script/dashboard.js',
        blogs: blogs,
        user: userData,
    });
};

exports.get_user_dashboard = async (req, res, next) => {
    const userData = await DB.getUserData(req.params.username);
    const blogs = await DB.getUserBlogPosts(userData.id);

    res.render('adminControl', {
        title: 'Admin User Control',
        style: '/css/admin.css',
        blogs: blogs,
        user_data: userData,
    });
};

exports.publish_post = async (req, res, next) => {
    await sanitize('*').escape().trim().run(req);
    const userData = await DB.getUserData(null, req.user);
    const blogData = await DB.createBlogPost(userData, req.body);

    res.json({
        title: req.body.title,
        content: req.body.blogpost,
        id: blogData.id,
        date: blogData.date,
    });
};

exports.delete_blog_post = (req, res, next) => {
    DB.deleteBlogPost(req.params.id);
};

exports.modify_blog_post = async (req, res, next) => {
    await sanitize('*').escape().trim().run(req);
    await DB.updateBlogPost(req.body);

    res.json(req.body);
};

exports.modify_user = (req, res, next) => {
    DB.modifyUserData(req.body);
};

exports.delete_user = (req, res, next) => {
    DB.deleteUser(req.params);
};
