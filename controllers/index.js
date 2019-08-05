const { DatabaseAPI } = require('../db/database');
const dbMeta = require('../db/dbSchema');
const DB_PATH = './db/database.db';
const DB = new DatabaseAPI(DB_PATH, dbMeta.dbSchema);

exports.get_home = async (req, res, next) => {
    const blogs = await DB.getAllBlogPosts();
    let page = 'home';
    if(req.user) {
        const permission_level = await DB.getUserPermissions(req.user);
        page = permission_level.permission_level >= 3 ? 'adminHome' : 'userHome';
    };
    res.render(page, {
        title: 'The latest blog posts!',
        mainStyle: 'css/main.css',
        style: 'css/home.css',
        blogs: blogs,
    });
}

exports.get_about = (req, res, next) => {
    res.send('Page not created yet. Please check back later!');
};
