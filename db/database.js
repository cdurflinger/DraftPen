const sqlite3 = require('sqlite3').verbose();
//modules used to hash passwords
const BCRYPT = require('bcrypt');
const SALT_ROUNDS = 10;
const dbMeta = require(__dirname + '/dbSchema');
const dbSchema = dbMeta.dbSchema;

class InitDatabase {
    static initDatabase() {
        this.db = new sqlite3.Database(__dirname + '/database.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
            if (err) {
                return console.log(err.message);
            }
        });
        this.db.exec('PRAGMA foreign_keys = ON', (err) => {
            if(err) {
                console.log(err);
            }
        });
        this.db.exec(dbSchema, (err) => {
            if (err) {
                console.log(err);
            }
            DatabaseAPI.registerUser('admin', 'admin', 'admin@mail.com', 'admin', 'admin').then(() => {
                this.db.run(`UPDATE Users SET permission_level = 5 WHERE id = 1`);
            });
        });
    }
}

class DatabaseManager {
    static openDatabase() {
        this.db = new sqlite3.Database(__dirname + '/database.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
            if (err) {
                return console.log(err.message);
            }
        });
    }
    static getDBInstance() {
        if(!this.db) {
            this.openDatabase();
        }
        return this.db;
    }
}

class DatabaseAPI {
    static registerUser(username, password, email, first, last) {
        return new Promise((resolve, reject) => {
            let sql = `INSERT INTO Users(username, password, email, first_name, last_name)
            VALUES(?, ?, ?, ?, ?)`;
            BCRYPT.hash(password, SALT_ROUNDS, (err, hash) => {
                return DatabaseManager.getDBInstance().run(sql, [username, hash, email, first, last], (err) => {
                    if(err) {
                    reject(err);
                    }
                    resolve();
                });
            });
        })
    }
    static verifyUsername(username) {
        return new Promise((resolve, reject) => {
            let sql = `SELECT username username FROM Users WHERE username = ?`;
            let userVerified = false;
            return DatabaseManager.getDBInstance().get(sql, [username], (sqlErr, row) => {
                if(row === undefined) {
                    userVerified = false;
                    resolve(userVerified);
                } else {
                    userVerified = true;
                    resolve(userVerified);
                }
            });
        });
    }
    static verifyUserPassword(username, password) {
        return new Promise((resolve, reject) => {
            let sql = `SELECT password password FROM Users WHERE username = ?`;
            return DatabaseManager.getDBInstance().get(sql, [username], (sqlErr, row) => {
                if(sqlErr){
                    reject(sqlErr);
                    return;
                }
                BCRYPT.compare(password, row.password, (bcryptErr, res) => {
                    if(bcryptErr) {					
                        reject(bcryptErr);
                        return;
                    }
                    resolve(res);
                });
            });
        });
    }
    static getUserPermissions(user) {
        return new Promise((resolve, reject) => {
            let sql = `SELECT permission_level permission_level FROM Users WHERE id = ?`;
            return DatabaseManager.getDBInstance().get(sql, [user], (sqlErr, rows) => {
                if (sqlErr) {
                    reject(sqlErr);
                    return;
                }
                resolve(rows);
            });
        });
    }
    static getUserData(username, user_id) {
        return new Promise((resolve, reject) => {
            let sqlParam = username || user_id;
            let sql = username ? `SELECT id id, username username, permission_level permission_level, email email, first_name firstName, last_name lastName FROM Users WHERE username = ?` : `SELECT id id, username username, permission_level permission_level, email email, first_name firstName, last_name lastName FROM Users WHERE id = ?`;
            return DatabaseManager.getDBInstance().get(sql, [sqlParam], (sqlErr, row) => {
                if(sqlErr){
                    reject(sqlErr);
                    return;
                }
                resolve(row);
            });
        });
    }
    static getAllUserData() {
        return new Promise((resolve, reject) => {
            let sql = `SELECT id id, username username, permission_level permission_level, email email, first_name firstName, last_name lastName FROM Users ORDER BY id`;
            return DatabaseManager.getDBInstance().all(sql, [], (sqlErr, rows) => {
                if (sqlErr) {
                    reject(sqlErr);
                    return;
                }
                resolve(rows);
            });
        });
    }
    static modifyUserData(user) {
        return new Promise((resolve, reject) => {
            let sql = `UPDATE Users SET first_name = ?, last_name = ?, username = ?, permission_level = ?, email = ? WHERE id = ?`;
            return DatabaseManager.getDBInstance().run(sql, [user.firstName, user.lastName, user.username, user.UserPermissionLevel, user.userEmail, user.id], (sqlErr) => {
                if (sqlErr) {
                    reject(sqlErr);
                    return;
                }
                resolve();
            });
        });
    }
    static deleteUser(user) {
        return new Promise((resolve, reject) => {
            let sql = `DELETE FROM Users WHERE id = ?`;
            return DatabaseManager.getDBInstance().run(sql, [user.id], (sqlErr) => {
                if (sqlErr) {
                    reject(sqlErr);
                    return;
                }
                resolve(true);
            });
        });
    }
    static createBlogPost(user, contents) {
        return new Promise((resolve, reject) => {
            let sql = `INSERT INTO Blogs(user_id, blog, title, publish_date)
                        VALUES(?, ?, ?, ?)`;
            const DATE = new Date();
            const MONTH = DATE.getMonth() + 1;
            const DAY = DATE.getDate();
            const YEAR = DATE.getFullYear();
            const NEW_DATE = `${MONTH}/${DAY}/${YEAR}`;
//have to use regular function expression here because arrow function does not bind to 'this'
            return DatabaseManager.getDBInstance().run(sql, [user.id, contents.blogpost, contents.title, NEW_DATE], function (sqlErr) {
                if(sqlErr) {
                    reject(sqlErr);
                    return;
                }
                resolve({
                    id: this.lastID,
                    date: NEW_DATE,
                });
            });
        });
    }
    static deleteBlogPost(user) {
        return new Promise((resolve, reject) => {
            let sql = `DELETE FROM Blogs WHERE id = ?`;
            return DatabaseManager.getDBInstance().run(sql, [user], (sqlErr) => {
                if(sqlErr) {
                    reject(sqlErr);
                    return;
                }
                resolve();
            });
        });
    }
    static updateBlogPost(content) {
        return new Promise((resolve, reject) => {
            let sql = `UPDATE Blogs SET blog = ?, title = ?, modified_date = ? WHERE id = ?`;
            const DATE = new Date();
            const MONTH = DATE.getMonth() + 1;
            const DAY = DATE.getDate();
            const YEAR = DATE.getFullYear();
            const NEW_DATE = `${MONTH}/${DAY}/${YEAR}`;
            return DatabaseManager.getDBInstance().run(sql, [content.content, content.title, NEW_DATE, content.id], (sqlErr) => {
                if(sqlErr) {
                    reject(sqlErr);
                    return;
                }
                resolve();
            });
        });
    }
    static getAllBlogPosts() {
        return new Promise((resolve, reject) => {
            let sql = `SELECT Blogs.id AS id, Blogs.blog AS blog, Blogs.title AS title, Blogs.publish_date AS publish_date, first_name first_name, last_name last_name FROM Users INNER JOIN Blogs ON Blogs.user_id = Users.id ORDER BY id`;
            return DatabaseManager.getDBInstance().all(sql, [], (sqlErr, rows) => {
                if (sqlErr) {
                    reject(sqlErr);
                    return;
                }
                let shortBlogs = (rows) => {
                    let arr = [];
                    for(let i = 0; i < rows.length; i++) {
                        if(rows[i].blog.length > 75) {
                            arr.push({id: rows[i].id, blog: rows[i].blog.slice(0, 75) + '...', title: rows[i].title, href: `/blog/${rows[i].id}/${rows[i].title.toLowerCase().split(' ').join('-')}`, publish_date: rows[i].publish_date, firstname: rows[i].first_name, lastname: rows[i].last_name});
                        } else {
                            arr.push({blog: rows[i].blog, title: rows[i].title, href: `/blog/${rows[i].id}/${rows[i].title.toLowerCase().split(' ').join('-')}`, publish_date: rows[i].publish_date});
                        }
                    }
                    return arr;
                }
                resolve(shortBlogs(rows));
            });
        });
    }
    static getBlogPost(params) {
        return new Promise((resolve, reject) => {
            let sql = `SELECT Blogs.id AS id, Blogs.blog AS blog, Blogs.title AS title, Blogs.publish_date AS publish_date, Blogs.modified_date AS modified_date, first_name first_name, last_name last_name FROM Users INNER JOIN Blogs ON Blogs.user_id = Users.id Where Blogs.id = ?`;
            return DatabaseManager.getDBInstance().get(sql, [params.id], (sqlErr, row) => {
               if (sqlErr) {
                   reject(sqlErr);
                   return;
               } 
               resolve(row);
            });
        });
    }
    static searchBlogPosts(searchParam) {
        return new Promise((resolve, reject) => {
            let arr = searchParam.split(' ');
            // let str = `SELECT Blogs.blog AS blog, Blogs.title AS title, Blogs.publish_date AS publish_date, Blogs.modified_date AS modified_date FROM Users INNER JOIN Blogs ON Blogs.user_id = Users.id WHERE Blogs.title LIKE`
            let str = `SELECT * FROM Blogs WHERE title LIKE`;
            (function (){
                for(let i = 0; i < arr.length; i++){
                    if(i != arr.length-1) {
                        str += ` "%${arr[i]}%" OR title LIKE`;
                    } else {
                        str += ` "%${arr[i]}%"`;
                    }
                }
            })()
            console.log(str);
            return DatabaseManager.getDBInstance().all(str, [], (sqlErr, rows) => {
                if (sqlErr) {
                    reject(sqlErr);
                    return;
                }
                let shortBlogs = (rows) => {
                    let arr = [];
                    for(let i = 0; i < rows.length; i++) {
                        if(rows[i].blog.length > 75) {
                            arr.push({id: rows[i].id, blog: rows[i].blog.slice(0, 75) + '...', title: rows[i].title, href: `/blog/${rows[i].id}/${rows[i].title.toLowerCase().split(' ').join('-')}`, publish_date: rows[i].publish_date, firstname: rows[i].first_name, lastname: rows[i].last_name});
                        } else {
                            arr.push({blog: rows[i].blog, title: rows[i].title, href: `/blog/${rows[i].id}/${rows[i].title.toLowerCase().split(' ').join('-')}`, publish_date: rows[i].publish_date});
                        }
                    }
                    return arr;
                }
                console.log(shortBlogs(rows));
                resolve(shortBlogs(rows));
            });
        });
    }
    static getUserBlogPosts(user) {
        return new Promise((resolve, reject) => {
            let sql = `SELECT id id, blog blog, title title, publish_date publishDate FROM Blogs WHERE user_id = ? ORDER BY id`;
            return DatabaseManager.getDBInstance().all(sql, [user], (sqlErr, rows) => {
                if (sqlErr) {
                    reject(sqlErr);
                    return;
                }
                resolve(rows);
            });
        });
    }
}

module.exports = { InitDatabase, DatabaseManager, DatabaseAPI };