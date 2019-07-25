const { DatabaseAPI } = require('../db/database');
const dbMeta = require('../db/dbSchema');
const DB_PATH = './db/database.db';
const DB = new DatabaseAPI(DB_PATH, dbMeta.dbSchema);

exports.get_home = (req, res, next) => {
    // console.log(req.user);
    // console.log(req.isAuthenticated());
    DB.getAllBlogPosts().then((blogs) => {
        if(req.user) {
            DB.getUserPermissions(req.user).then((permission_level) => {
                if(permission_level.permission_level >= 3) {
                    res.render('adminHome', {
                        title: 'The latest blog posts!',
                        mainStyle: 'css/main.css',
                        style: 'css/home.css',
                        script: 'script/main.js',
                        blogs: blogs,
                    });
                } else {
                    res.render('userHome', {
                        title: 'The latest blog posts!',
                        mainStyle: 'css/main.css',
                        style: 'css/home.css',
                        script: 'script/main.js',
                        blogs: blogs,
                    });  
                }
            });
        } else {
            res.render('home', {
                title: 'The latest blog posts!',
                mainStyle: 'css/main.css',
                style: 'css/home.css',
                script: 'script/main.js',
                blogs: blogs,
            });
        }
    });
}

exports.get_about = (req, res, next) => {
    res.send('Page not created yet. Please check back later!');
};
