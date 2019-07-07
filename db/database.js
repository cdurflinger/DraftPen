function DatabaseAPI(DB_PATH, dbSchema) {
    const sqlite3 = require('sqlite3').verbose();
    //modules used to hash passwords
    const BCRYPT = require('bcrypt');
    const saltRounds = 10;

    const DB = new sqlite3.Database(DB_PATH, sqlite3.OPEN_READWRITE, (err) => {
        if (err) {
            return console.log(err.message);
        }
        DB.exec('PRAGMA foreign_keys = ON', (err) => {
            if(err) {
                console.log(err);
            } else {
                console.log('Foreign Key Enforcement is on.');
            }
        });
    });

    DB.exec(dbSchema, (err) => {
        if (err) {
            console.log(err);
        }
    });

    return {
        registerUser: (username, password, email, first, last) => {
            let sql = `INSERT INTO Users(username, password, email, first_name, last_name)
                        VALUES(?, ?, ?, ?, ?)`;
            BCRYPT.hash(password, saltRounds, (err, hash) => {
                DB.run(sql, username, hash, email, first, last, (err) => {
                    if(err) {
                        console.log(err);
                    }
                });
            });
        },
        verifyUserPassword: (username, password) => {
            return new Promise((resolve, reject) => {
                let sql = `SELECT password password FROM Users WHERE username = ?`;
                DB.get(sql, [username], (sqlErr, row) => {
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
        },
        getUserData: (username, user_id) => {
            return new Promise((resolve, reject) => {
                let sqlParam = username || user_id;
                let sql = username ? `SELECT id id, username username, email email,first_name firstName, last_name lastName FROM Users WHERE username = ?` : `SELECT id id, username username, email email,first_name firstName, last_name lastName FROM Users WHERE id = ?`;
                // let sql = `SELECT id id, email email,first_name firstName, last_name lastName FROM Users WHERE username = ?`;
                DB.get(sql, [sqlParam], (sqlErr, row) => {
                    if(sqlErr){
                        reject(sqlErr);
                        return;
                    }
                    resolve(row);
                });
            });
        },
        createBlogPost: (user, contents) => {
            return new Promise((resolve, reject) => {
                let sql = `INSERT INTO Blogs(user_id, blog, title)
                VALUES(?, ?, ?)`;
                DB.run(sql, [user.id, contents.blogpost, contents.title], (sqlErr) => {
                    // console.log(user.id, contents.blogpost, contents.title);
                    if (sqlErr) {
                        reject(sqlErr);
                        return;
                    }
                    resolve();
                });
            });
        },
        getAllBlogPosts: () => {
            return new Promise((resolve, reject) => {
                let sql = `SELECT blog blog, title title FROM Blogs ORDER BY title`;
                DB.all(sql, [], (sqlErr, rows) => {
                    if (sqlErr) {
                        reject(sqlErr);
                        return;
                    }
                    resolve(rows);
                });
            });
        },
        getUserBlogPosts: (user) => {
            return new Promise((resolve, reject) => {
                let sql = `SELECT blog blog, title title FROM Blogs WHERE user_id = ? ORDER BY title`;
                DB.all(sql, [user], (sqlErr, rows) => {
                    if (sqlErr) {
                        reject(sqlErr);
                        return;
                    }
                    resolve(rows);
                });
            });
        },
    }
}
module.exports = { DatabaseAPI };