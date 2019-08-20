const { DatabaseAPI } = require('../db/database');

exports.get_home = async (req, res, next) => {
    const blogs = await DatabaseAPI.getAllBlogPosts();
    let page = 'home';
    if(req.user) {
        const permission_level = await DatabaseAPI.getUserPermissions(req.user);
        page = permission_level.permission_level >= 3 ? 'adminHome' : 'userHome';
    };
    res.render(page, {
        title: 'THE LATEST',
        blogs: blogs,
    });
}

exports.get_blog = async (req, res, next) => {
    const blog = await DatabaseAPI.getBlogPost(req.params);
    res.render('blog', {
       blog: blog, 
    });
};

exports.get_about = (req, res, next) => {
    res.send('Page not created yet. Please check back later!');
};
