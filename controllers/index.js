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
        script: '../script/users.js',
    });
}

exports.get_blog = async (req, res, next) => {
    const blog = await DatabaseAPI.getBlogPost(req.params);
    res.render('blog', {
       blog: blog,
       script: '../../script/users.js',
    });
};

exports.search_blogs = async (req, res, next) => {
    const blogs = await DatabaseAPI.searchBlogPosts(req.body.search);
    res.render('home', {
      title: `Results for ${req.body.search}`,
      blogs: blogs,
    });
};

exports.get_about = (req, res, next) => {
    res.send('Page not created yet. Please check back later!');
};
