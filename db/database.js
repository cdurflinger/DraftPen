function DatabaseAPI(DB_PATH, dbSchema) {
    const sqlite3 = require('sqlite3').verbose();
    //modules used to hash passwords
    const BCRYPT = require('bcrypt');
    const SALT_ROUNDS = 10;

    const DB = new sqlite3.Database(DB_PATH, sqlite3.OPEN_READWRITE, (err) => {
        if (err) {
            return console.log(err.message);
        }
        DB.exec('PRAGMA foreign_keys = ON', (err) => {
            if(err) {
                console.log(err);
            } else {
                // console.log('Foreign Key Enforcement is on.');
            }
        });
    });

    DB.exec(dbSchema, (err) => {
        if (err) {
            console.log(err);
        }
    });

    // const DB_CLOSE = DB.close((err) => {
    //     if(err) {
    //         console.error(err.message);
    //     }
    // });

    return {
        registerUser: (username, password, email, first, last) => {
            let sql = `INSERT INTO Users(username, password, email, first_name, last_name)
                        VALUES(?, ?, ?, ?, ?)`;
            BCRYPT.hash(password, SALT_ROUNDS, (err, hash) => {
                DB.run(sql, username, hash, email, first, last, (err) => {
                    if(err) {
                        console.log(err);
                    }
                });
            });
        },
        verifyUsername: (username) => {
            return new Promise((resolve, reject) => {
                let sql = `SELECT username username FROM Users WHERE username = ?`;
                let userVerified = false;
                DB.get(sql, [username], (sqlErr, row) => {
                    if(row === undefined) {
                        userVerified = false;
                        resolve(userVerified);
                    } else {
                        userVerified = true;
                        resolve(userVerified);
                    }
                })
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
        getUserPermissions: (user) => {
            return new Promise((resolve, reject) => {
                let sql = `SELECT permission_level permission_level FROM Users WHERE id = ?`;
                DB.get(sql, [user], (sqlErr, rows) => {
                    if (sqlErr) {
                        reject(sqlErr);
                        return;
                    }
                    resolve(rows);
                });
            });
        },
        getUserData: (username, user_id) => {
            return new Promise((resolve, reject) => {
                let sqlParam = username || user_id;
                let sql = username ? `SELECT id id, username username, permission_level permission_level, email email, first_name firstName, last_name lastName FROM Users WHERE username = ?` : `SELECT id id, username username, permission_level permission_level, email email, first_name firstName, last_name lastName FROM Users WHERE id = ?`;
                DB.get(sql, [sqlParam], (sqlErr, row) => {
                    if(sqlErr){
                        reject(sqlErr);
                        return;
                    }
                    resolve(row);
                });
            });
        },
        getAllUserData: () => {
            return new Promise((resolve, reject) => {
                let sql = `SELECT id id, username username, permission_level permission_level, email email, first_name firstName, last_name lastName FROM Users ORDER BY id`;
                DB.all(sql, [], (sqlErr, rows) => {
                    if (sqlErr) {
                        reject(sqlErr);
                        return;
                    }
                    resolve(rows);
                });
            });
        },
        modifyUserData: (user) => {
            return new Promise((resolve, reject) => {
                let sql = `UPDATE Users SET first_name = ?, last_name = ?, username = ?, permission_level = ?, email = ? WHERE id = ?`;
                DB.run(sql, [user.firstName, user.lastName, user.username, user.UserPermissionLevel, user.userEmail, user.id], (sqlErr) => {
                    if (sqlErr) {
                        reject(sqlErr);
                        return;
                    }
                    resolve();
                });
            });
        },
        deleteUser: (user) => {
            return new Promise((resolve, reject) => {
                let sql = `DELETE FROM Users WHERE id = ?`;
                DB.run(sql, [user.id], (sqlErr) => {
                    if (sqlErr) {
                        reject(sqlErr);
                        return;
                    }
                    resolve(true);
                });
            });
        },
        createBlogPost: (user, contents) => {
            return new Promise((resolve, reject) => {
                let sql = `INSERT INTO Blogs(user_id, blog, title, publish_date)
                VALUES(?, ?, ?, ?)`;
                const DATE = new Date();
                const MONTH = DATE.getMonth() + 1;
                const DAY = DATE.getDate();
                const YEAR = DATE.getFullYear();
                const NEW_DATE = `${MONTH}/${DAY}/${YEAR}`;
                //have to use regular function expression here because arrow function does not bind to 'this'
                DB.run(sql, [user.id, contents.blogpost, contents.title, NEW_DATE], function (sqlErr) {
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
        },
        deleteBlogPost: (user) => {
            return new Promise((resolve, reject) => {
                let sql = `DELETE FROM Blogs WHERE id = ?`;
                DB.run(sql, [user], (sqlErr) => {
                    if(sqlErr) {
                        reject(sqlErr);
                        return;
                    }
                    resolve();
                });
            });
        },
        updateBlogPost: (content) => {
            return new Promise((resolve, reject) => {
                let sql = `UPDATE Blogs SET blog = ?, title = ?, modified_date = ? WHERE id = ?`;
                const DATE = new Date();
                const MONTH = DATE.getMonth() + 1;
                const DAY = DATE.getDate();
                const YEAR = DATE.getFullYear();
                const NEW_DATE = `${MONTH}/${DAY}/${YEAR}`;
                DB.run(sql, [content.content, content.title, NEW_DATE, content.id], (sqlErr) => {
                    if(sqlErr) {
                        reject(sqlErr);
                        return;
                    }
                    resolve();
                });
            });
        },
        getAllBlogPosts: () => {
            return new Promise((resolve, reject) => {
                let sql = `SELECT blog blog, title title FROM Blogs ORDER BY id`;
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
                let sql = `SELECT id id, blog blog, title title, publish_date publishDate FROM Blogs WHERE user_id = ? ORDER BY id`;
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