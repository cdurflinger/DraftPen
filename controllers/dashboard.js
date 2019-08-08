const { buildSanitizeFunction } = require('express-validator');
const sanitize = buildSanitizeFunction(['body']);
const { DatabaseAPI } = require('../db/database');

exports.get_dashboard = async (req, res, next) => {
    const userData = await DatabaseAPI.getUserData(null, req.user);
    let page = await userData.permission_level >= 3 ? 'adminDashboard' : 'dashboard';
    const blogs = await DatabaseAPI.getUserBlogPosts(req.user);

    res.render(page, {
        title: `${userData.firstName}'s Dashboard`,
        style: 'css/dashboard.css',
        script: 'script/dashboard.js',
        blogs: blogs,
        user: userData,
    });
};

exports.get_user_dashboard = async (req, res, next) => {
    const userData = await DatabaseAPI.getUserData(req.params.username);
    const blogs = await DatabaseAPI.getUserBlogPosts(userData.id);

    res.render('adminControl', {
        title: 'Admin User Control',
        style: '/css/admin.css',
        blogs: blogs,
        user_data: userData,
    });
};

exports.publish_post = async (req, res, next) => {
    await sanitize('*').escape().trim().run(req);
    const userData = await DatabaseAPI.getUserData(null, req.user);
    const blogData = await DatabaseAPI.createBlogPost(userData, req.body);

    res.json({
        title: req.body.title,
        content: req.body.blogpost,
        id: blogData.id,
        date: blogData.date,
    });
};

exports.delete_blog_post = (req, res, next) => {
    DatabaseAPI.deleteBlogPost(req.params.id);
};

exports.modify_blog_post = async (req, res, next) => {
    await sanitize('*').escape().trim().run(req);
    await DatabaseAPI.updateBlogPost(req.body);

    res.json(req.body);
};

exports.modify_user = (req, res, next) => {
    DatabaseAPI.modifyUserData(req.body);
};

exports.delete_user = (req, res, next) => {
    DatabaseAPI.deleteUser(req.params);
};
