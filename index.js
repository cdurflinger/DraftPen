const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const port = process.env.PORT || 5000;
const hbs = require('express-handlebars');
const routes = require('./routes/index');
// const { DatabaseAPI} = require('./db/database');
// const dbMeta = require('./db/dbSchema');
// const DB_PATH = './db/database.db';
// const DB = new DatabaseAPI(DB_PATH, dbMeta.dbSchema);
// const sqlite3 = require('sqlite3').verbose();

const app = express();

app.engine('hbs', hbs({extname: 'hbs', defaultLayout: 'layout', layoutsDir: __dirname + '/views/layouts/'}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded( { extended: false } ));
app.use('/', routes);
app.use(express.static('public'));



//open the db
// const DB = new sqlite3.Database('./db/database.db', sqlite3.OPEN_READWRITE, (err) => {
//     if (err) {
//         return console.log(err.message);
//     }
//     DB.exec('PRAGMA foreign_keys = ON', (err) => {
//         if(err) {
//             console.log(err);
//         } else {
//             console.log('Foreign Key Enforcement is on.');
//         }
//     });
// });

// const dbSchema = `CREATE TABLE IF NOT EXISTS Users (
//     id integer NOT NULL PRIMARY KEY AUTOINCREMENT,
//     username text NOT NULL UNIQUE,
//     password text NOT NULL,
//     salt text,
//     email text NOT NULL UNIQUE,
//     first_name text,
//     last_name text
// );
//     CREATE TABLE IF NOT EXISTS Blogs (
//         id integer NOT NULL PRIMARY KEY,
//         user_id NOT NULL UNIQUE,
//         blog text,
//         title text NOT NULL,
//         publish_date date,
//         modified_date date,
//             FOREIGN KEY (user_id) REFERENCES Users(id)
//     );`

// DB.serialize(() => {
//     DB.exec(dbSchema, (err) => {
//         if (err) {
//             console.log(err);
//         }
//     });
// });

// DB.close((err) => {
//     if (err) {
//         return console.log(err.message);
//     }
// });

app.listen(port, () => {
    console.log(`Listening to port ${port}!`);
});
