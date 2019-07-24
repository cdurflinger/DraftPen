const { DatabaseAPI } = require('../db/database');
const dbMeta = require('../db/dbSchema');
const DB_PATH = './db/database.db';
const DB = new DatabaseAPI(DB_PATH, dbMeta.dbSchema);

exports.get_home_page = (req, res, next) => {
    // console.log(req.user);
    // console.log(req.isAuthenticated());
    DB.getAllBlogPosts().then((blogs) => {
        if(req.user){
            res.render('userHome', {
                title: 'The latest blog posts!',
                mainStyle: 'css/main.css',
                style: 'css/home.css',
                script: 'script/main.js',
                blogs: blogs,
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
};

exports.get_user_register = (req, res, next) => {
    res.render('register', {
       title: 'Register',
       mainStyle: 'css/main.css', 
    });
};

exports.register_new_user = (req, res, next) => {
    DB.registerUser(`${req.body.username}`, `${req.body.password}`, `${req.body.email}`, `${req.body.firstname}`, 
        `${req.body.lastname}`);

    res.render('login', {
       title: 'Registration Complete! Please login below.',
       mainStyle: 'css/main.css', 
    });
};

exports.get_user_login = (req, res, next) => {
    res.render('login', {
        title: 'Login',
        mainStyle: 'css/main.css',
    });
};

exports.login_user = (req, res, next) => {
    DB.verifyUserPassword(`${req.body.username}`, `${req.body.password}`).then((login) => {
        if(login) {
            DB.getUserData(req.body.username).then((user_data) => {
                req.login(user_data.id, (err) => {
                    if(err) {
                        return next(err);
                    }
                    return res.redirect('/');
                });
            });    
        } else {
            res.render('login', {
            title: 'Incorrect username or password! Try again.',
            mainStyle: 'css/main.css', 
            });
        }
    });
};

exports.get_user_logout = (req, res, next) => {
    req.logout();
    res.redirect('/');
};