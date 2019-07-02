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
        getUserData: (username) => {
            return new Promise((resolve, reject) => {
                let sql = `SELECT id id, email email,first_name firstName, last_name lastName FROM Users WHERE username = ?`;
                DB.get(sql, [username], (sqlErr, row) => {
                    if(sqlErr){
                        reject(sqlErr);
                        return;
                    }
                    resolve(row);
                });
            });
        },
    }
}
module.exports = { DatabaseAPI };