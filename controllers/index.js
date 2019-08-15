const { DatabaseAPI } = require('../db/database');

let shortBlogs = (blogs) => {
    let arr = [];
    for(let i = 0; i < blogs.length; i++) {
        if(blogs[i].blog.length > 50) {
            arr.push({id: blogs[i].id, blog: blogs[i].blog.slice(0, 50) + '...', title: blogs[i].title, href: `/blog/${blogs[i].id}/${blogs[i].title.toLowerCase().split(' ').join('-')}`});
        } else {
            arr.push({blog: blogs[i].blog, title: blogs[i].title, href: `/blog/${blogs[i].id}/${blogs[i].title.toLowerCase().split(' ').join('-')}`});
        }
    }
    return arr;
}

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
        blogs: shortBlogs(blogs),
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
