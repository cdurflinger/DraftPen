module.exports.dbSchema = `CREATE TABLE IF NOT EXISTS Users (
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    permission_level INTEGER DEFAULT (1),
    email TEXT NOT NULL UNIQUE,
    first_name TEXT,
    last_name TEXT
);
    CREATE TABLE IF NOT EXISTS Blogs (
        id INTEGER NOT NULL PRIMARY KEY UNIQUE,
        user_id NOT NULL,
        blog TEXT,
        title TEXT NOT NULL,
        publish_date DATE,
        modified_date DATE,
        CONSTRAINT fk_Users
            FOREIGN KEY (user_id)
            REFERENCES Users(id)
            ON DELETE CASCADE
    );`

    