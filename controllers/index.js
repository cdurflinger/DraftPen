const { DatabaseAPI } = require('../db/database');

exports.get_home = async (req, res, next) => {
    const blogs = await DatabaseAPI.getAllBlogPosts();
    let page = 'home';
    if(req.user) {
        const permission_level = await DatabaseAPI.getUserPermissions(req.user);
        page = permission_level.permission_level >= 3 ? 'adminHome' : 'userHome';
    };
    res.render(page, {
        title: 'The latest blog posts!',
        style: 'css/home.css',
        blogs: blogs,
    });
}

exports.get_about = (req, res, next) => {
    res.send('Page not created yet. Please check back later!');
};
