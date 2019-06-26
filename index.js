const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const port = process.env.PORT || 5000;
const app = express();
//open the db
const db = new sqlite3.Database('./db/database.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        return console.log(err.message);
    }
});

db.serialize(() => {
    // db.run("CREATE TABLE lorem (info TEXT)");
 
    // var stmt = db.prepare("INSERT INTO lorem VALUES (?)");
    // for (var i = 0; i < 10; i++) {
    //     stmt.run("Ipsum " + i);
    // }
    // stmt.finalize();
   
    db.each("SELECT rowid AS id, info FROM lorem", function(err, row) {
        if (err) {
            console.log(err.message);
        }
        console.log(row.id + ": " + row.info);
    });

});

db.close((err) => {
    if (err) {
        return console.log(err.message);
    }
});

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Listening to port ${port}!`);
});