const express = require('express');
const router = express.Router();
const { DatabaseAPI} = require('../db/database');
const dbMeta = require('../db/dbSchema');
const DB_PATH = './db/database.db';
const DB = new DatabaseAPI(DB_PATH, dbMeta.dbSchema);


//get Login Page
router.get('/', (req, res, next) => {
    res.render('login', {
        title: 'Login',
        style: 'main.css',
    });
});

router.get('/register', (req, res, next) => {
    res.render('index', {
       title: 'Register',
       style: 'main.css', 
    });
});



//post requests
router.post('/register', (req, res, next) => {
    DB.registerUser(`${req.body.username}`, `${req.body.password}`, `${req.body.email}`, `${req.body.firstname}`, 
        `${req.body.lastname}`);

    res.render('login', {
       title: 'Registration Complete! Please login below.',
       style: 'main.css', 
    });
});

router.post('/login', (req, res, next) => {
    function passwordVerified(){
        console.log(DB.verifyUserPassword(`${req.body.username}`, `${req.body.password}`));
        return DB.verifyUserPassword(`${req.body.username}`, `${req.body.password}`);
    }
    // passwordVerified().then((val) => {
    //     console.log(val);
    // })
    passwordVerified();
        res.render('login', {
            title: 'Login Complete!',
            style: 'main.css', 
         });
});

module.exports = router;