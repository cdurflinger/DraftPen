module.exports.dbSchema = `CREATE TABLE IF NOT EXISTS Users (
    id integer NOT NULL PRIMARY KEY AUTOINCREMENT,
    username text NOT NULL UNIQUE,
    password text NOT NULL,
    salt text,
    email text NOT NULL UNIQUE,
    first_name text,
    last_name text
);
    CREATE TABLE IF NOT EXISTS Blogs (
        id integer NOT NULL PRIMARY KEY,
        user_id NOT NULL UNIQUE,
        blog text,
        title text NOT NULL,
        publish_date date,
        modified_date date,
            FOREIGN KEY (user_id) REFERENCES Users(id)
    );`